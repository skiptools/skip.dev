---
title:  "Sharing C code between Swift and Kotlin for iPhone and Android apps"
date:   2024-01-17
tags: [c, swift, kotlin, ffi, android-ndk, skip-tool, native-libraries, mobile-optimization]
layout: post
author: Marc Prud'hommeaux 
permalink: /blog/sharing-c-between-swift-and-kotlin/
---

Swift — true to its name — is a fast language. It is just about as close-to-the-metal as any higher level programming language can be. Stack-allocated value types make efficient use of resources, and the lack of garbage collection means that memory allocation and deallocation is predictable, with controllable memory watermarks and minimal overhead from reference counting. Swift code is compiled down to architecture-specific machine instructions before being packaged into the `app.ipa` archive that is ultimately distributed to end users for installation on their iPhone.

Java (and, therefore, Kotlin) is not quite as fast or as efficient with memory as Swift. When a Kotlin Android app is built using gradle or an IDE, it processes the source code into Java bytecode, which is an intermediate representation of the program's instructions. Next, the Java bytecode is re-processed into Dalvik Executable (DEX) bytecode for packaging into an `app.apk` for distribution to Android devices. Finally, when a user installs the app, the DEX is converted on the device into architecture-specific instructions, which is what is ultimately run during the program's execution. The app's code is run within Android's managed runtime (ART), which provides automatic memory management using garbage collection (GC).

Skip is a tool that transpiles Swift into Kotlin, enabling the creation of SwiftUI apps for both iOS and Android. The transpiled Kotlin code maintains Swift's semantics and behavior. But since Java lacks true value types, Swift struct and enumeration types can only be translated into Kotlin classes; this means that they will always be allocated on the heap and subject to indeterministic garbage collection, just like any other Java object. These, and other factors, contribute to the difference in performance and efficiency between the two languages.

## Fast "Enough"?

Despite the difference in performance characteristics, both these languages are generally "fast enough" for app development. Day-to-day app development in the real world[^1] typically involves building and tweaking screens of controls and implementing designs, shuffling data between local storage and network services, and generally managing the interaction between a human user and some backend business logic. Rarely do language-level performance limitations become a consideration to a developer who is building an app at this level.

There are, however, many cases where the absolute optimal performance is critical for the app experience to be acceptable. Compression and encryption algorithms, database and format encoders and decoders, and anything to do with real-time video or audio: these are the sorts of things that need the barest-of-metal, lowest-level language there is: C. Nothing, short of hand-written assembly, beats C in terms of capacity for raw performance. And so it is the choice for nearly all the low-level components that are used in mobile operating systems today: the embedded SQLite database, the cryptography libraries, video and audio processing, are all implemented in C on both Android and iOS. Higher-lever wrappers are then built around these C interfaces to make them easy to consume by framework and app developers.

## Swift and C

:::note
You can follow along with this project by installing Skip (`brew install skiptools/skip/skip`) and cloning the [https://github.com/skiptools/skip-c-demo.git](https://github.com/skiptools/skip-c-demo.git) repository and either opening it in Xcode and running the unit tests, or running them from the terminal with  `swift test`.
:::


Swift integrates wonderfully with C. Many popular Swift projects use this C integration to great effect, such as the [Yams](https://github.com/jpsim/Yams) parser embedding the libYAML C library, and the [swift-cmark](https://github.com/apple/swift-cmark) parser wrapping the cmark C library. Parsing YAML and markdown from Swift is so blazing fast because it *isn't* implemented in Swift. 

Adding your own C code to a Swift project is simple[^2]. Add a new `LibCLibrary` Swift module and add a `Sources/LibCLibrary/include/demo.h` header file:

```c
double demo_compute(int n, double a, double b);
```

and a `Sources/LibCLibrary/src/demo.c` source file:

```c
#include "demo.h"

double demo_compute(int n, double a, double b) {
    double result = 0.0;
    for (int i = 0; i < n; i++) {
        result += (a * b) / (a + b + i);
    }
    return result;
}
```

then add a `Sources/LibCLibrary/CMakeLists.txt`[^3] file to bring it all together:

```cmake
cmake_minimum_required(VERSION 3.1)
project(cproject, LANGUAGES C)
file(GLOB SOURCES src/*.c)
add_library(clibrary SHARED ${SOURCES})
include_directories(clibrary PUBLIC include)
```

And you now have a C project that can be built with the Swift Package manager.

Next link to the library from a `SkipCDemo` Swift module, and you can call the C code directly from your Swift code, such as this test case:

```swift
XCTAssertEqual(105.95723590826853, demo_compute(n: 1_000_000, a: 2.5, b: 3.5))
```

Voilà! You've now unlocked the full potential for high-performance C libraries on the Swift side of your app. More information on Swift's C integration can be found at [https://developer.apple.com/documentation/swift/using-imported-c-functions-in-swift](https://developer.apple.com/documentation/swift/using-imported-c-functions-in-swift).

## C and Xcode

Xcode has built-in support for C. It provides syntax highlighting, auto-completion of function and type names, doc-comment lookup, and inline error reporting. If you are comfortable writing in a memory-unsafe language, Xcode is a productive way to develop cross-platform C code. And developing it alongside a higher-level Swift wrapper with fast unit testing cycles is an effective way to iterate on library development.

<img src="/assets/images/skip-c-project.png" alt="Screenshot of Xcode with C project" style="width: 90%"/>

## C and Kotlin/Java

Smooth Swift/C interoperability is all well and good, but Skip is a tool for making dual-platform apps for both iOS and Android. What of the Kotlin/Java side? Swift's automatic C interoperability is obviously never going to *just work* from Java-derived bytecode in the same way as it does from compiled Swift.

However, with runtime support from the [SkipFFI](/docs/modules/skip-ffi/) framework, the C interface that developers enjoy from the Swift side can be — with some caveats — automatically converted into Kotlin code that interfaces the same way with the native C libraries on Android. It gets close to Swift-level C integration by leveraging the Java Native Access library (JNA), which is a venerable open-source Java library that enables C integration using foreign-function interface (FFI) techniques[^4]. JNA runs atop the standard Java Native Interface (JNI) that provide the ability to pass data and invoke functions between Java and native-compiled languages.

The SkipFFI package uses JNA to provide support for creating native-aware wrapper libraries. The sample project's wrapper `SkipCDemo.swift` looks like this:

```swift
import Foundation
import SkipFFI
#if !SKIP
import LibCLibrary
#endif

/// `DemoLibrary` is a Swift encapsulation of the embedded C library's functions and structures.
internal final class DemoLibrary {
    /* SKIP EXTERN */ public func demo_compute(n: Int32, a: Double, b: Double) -> Double {
        return LibCLibrary.demo_compute(n, a, b)
    }
    
    /// Singleton library instance
    static let instance = registerNatives(DemoLibrary(), frameworkName: "SkipCDemo", libraryName: "clibrary")
}
```

On the Swift side the `DemoLibrary` functions are merely passed directly through to the same-named C functions. For the Kotlin side, Skip sees the `/* SKIP EXTERN */` statements, and elides the function bodies from the transpiled Kotlin, resulting in a `SkipCDemo.kt` like:

```kotlin
package skip.cdemo

import skip.lib.*
import skip.foundation.*
import skip.ffi.*

/// `DemoLibrary` is a Swift encapsulation of the embedded C library's functions and structures.
internal class DemoLibrary {
    external fun demo_compute(n: Int, a: Double, b: Double): Double

    companion object {
        /// Singleton library instance
        internal val instance = registerNatives(DemoLibrary(), frameworkName = "SkipCDemo", libraryName = "clibrary")
    }
}
```

These `extern` functions (which need to be public) are what JNA uses to match the functions with the corresponding C functions that it loads from the compiled dynamic library. The result is that the same interface is presented to both the Swift and Kotlin sides of your apps, using identical calling conventions.

In addition to handling the expected primitives arguments and return types, JNA also handles converting between C strings and Java strings. Since Swift strings are treated as Kotlin strings by Skip, and since Kotlin strings are just aliases to Java strings, string arguments and return types generally work transparently when zero-terminated C string conventions are followed.

On top of all this, the SkipFFI package provides some stand-in mappings for the Swift C interoperability types. For example, the `Swift.OpaquePointer`[^5] type will be represented by a typealias to the `com.sun.jna.Pointer`[^6] type. This is generally enough to create a portable Swift wrapper around a C type that is represented by a pointer.

Beyond functions, JNA has support for mapping structs and union types, as well as working with low-level shared memory. These are not yet directly supported by Skip (see "Future Work" below), but they can all be overcome by embedding Kotlin directly in `#if SKIP / #endif` blocks.

SkipFFI is how the the [SkipSQL](/docs/modules/skip-sql/) framework interfaces with the vendored SQLite API on Android and iOS. It is also how [SkipScript](/docs/modules/skip-script/) works with JavaScriptCore, which is included with iOS but needs to be shipped as an additional library with Android apps. Regardless of whether the dependent library is included with the operating system or shipped separately, the mechanism for interacting with it will be the same. So If you already have pre-built native libraries for iOS and/or Android that you can include in your project, then `SkipFFI` is all you need to be able to access them from the Kotlin side.

However, if you want to include C code directly in your project, you'll need to build that code for the Android side and package it in a way that makes it accessible at runtime, in the same way as SwiftPM handles building and packing it for iOS.

## Compiling C into Android apps with the NDK

As of release 0.7.44, the Skip transpiler will generate a gradle project that will cross-compile your C project to each of the four Android native architectures and embed it in the resulting `app.apk`. Skip detects native support by checking for the following declaration in the target module:

```swift
cSettings: [.define("SKIP_BUILD_NDK")]
```

This causes Skip to create a `build.gradle.kts` project that uses the `externalNativeBuild` clause, directing it to use the `CMakeLists.txt` to build the native libraries for each of the supported Android NDK targets.

The generated `build.gradle.kts` project will look something like this:

```kotlin
plugins {
    id("com.android.library") version "8.1.0"
}

android {
    namespace = group as String
    compileSdk = 34
    defaultConfig {
        minSdk = 29
    }
    externalNativeBuild {
        cmake {
            path = file("ext/CMakeLists.txt")
        }
    }
}

```

When building and testing the project, the Gradle project will be generated for the native library, which will instruct gradle to build the project with each of the four separate Android Native Development Kit (NDK) toolchains. The first time you do this, the toolchains will be automatically downloaded and installed as part of the build process, so you should expect the initial build to take a much longer time than subsequent builds.

As you can see in the Xcode Console area, when running the `skip-c-demo` test cases (and thereby running the transpiled Kotlin tests via gradle), the native compilation steps look like:

```
GRADLE> > Task :LibCLibrary:buildCMakeDebug[arm64-v8a]
GRADLE> > Task :LibCLibrary:buildCMakeDebug[armeabi-v7a]
GRADLE> > Task :LibCLibrary:buildCMakeDebug[x86]
GRADLE> > Task :LibCLibrary:buildCMakeDebug[x86_64]
GRADLE> > Task :LibCLibrary:mergeDebugJniLibFolders
```

The intermediate `LibCLibrary.aar` archive will correspondingly contain the embedded compiled shared object files:

```plaintext
classes.dex
lib/arm64-v8a/libclibrary.so
lib/armeabi-v7a/libclibrary.so
lib/x86/libclibrary.so
lib/x86_64/libclibrary.so
AndroidManifest.xml
resources.arsc
```

Each of these shared object files will be distributed as part of the final `app.apk`, although note that if you distribute your app as part of the an Android Bundle, then the app storefront may be able to thin out unused architectures before it delivers your app bundle to the end user for installation.

At runtime, the `SkipFFI` library will handle loading the shared object file that you specify by name in your wrapper class, and you'll be able to interact with the C library via the wrapper. JNA will link up the function names (or throw an exception for any external functions that cannot be found), and the library will thus be ready for consumption by the Kotlin side of the calling code.

## Summary

The ability to invoke C directly from both the iOS and Android side enables the prospect of unbeatably-fast dual-platform libraries that can be consumed by app and framework developers alike. We've only scratched the surface of what is possible, but to delve deeper, start with the [https://github.com/skiptools/skip-c-demo](https://github.com/skiptools/skip-c-demo) sample repository and the [SkipFFI](/docs/modules/skip-ffi/) documentation. The [SkipTidy](https://github.com/skiptools/skip-tidy) repository shows a non-trivial example of an existing C library being embedded in a dual-platform Swift framework in source form. And for examples of using SkipFFI with pre-compiled libraries (either included with the OS or bundled with the app), see the [SkipSQL](/docs/modules/skip-sql/) and [SkipScript](/docs/modules/skip-script/) frameworks. The [SkipFFI test cases](https://github.com/skiptools/skip-ffi/blob/main/Tests/SkipFFITests/SkipFFITests.swift) also show some examples of integrating with OS-embedded libraries like `zlib` and `libxml`, as well as manually mapping C structures to Swift types.

We're very excited to see the capabilities that will be unlocked by developers using this feature! If you have questions or suggestions for improvements, please reach out to us on Mastodon [@skiptools@mas.to](https://mas.to/@skiptools), via chat [skiptools.slack.com](https://skiptools.slack.com), or in our [discussion forums](http://community.skip.tools).

<hr />

### Notes and Future Directions

 - structs: automatic C integration using SkipFFI only works for function invocations. C structs, which are nicely mapped to Swift structs, do not benefit from any automatic conversion on the Kotlin side. It is possible to manually implement them using the JNA `Structure` interface, but it is currently cumbersome. For an example, see the `ZlibLibrary` test case in the [SkipFFI](/docs/modules/skip-ffi/) tests.
 - C++: Swift recently gained the ability to integrate with C++ code. SkipFFI and JNA lack any understanding of C++, so while you can build and embed your C libraries using SwiftPM and gradle, you'll need to interface with it through a C API.
 - JNA Overhead: while there is essentially zero overhead when calling into C from Swift the side, on the Kotlin side the JNA layer does introduce some overhead. When a JNA wrapper class is first instantiated, the runtime needs to do some work to load the correct shared libraries and match up the `extern` functions with their corresponding C functions. This mostly affects the initial load time, and single a library wrapper instance is likely to be a shared singleton for an application, this overhead is usually tolerable.
 - Size overhead: the SkipFFI depends on the JNA library, which itself includes some native shared object files to facilitate the C side of the bridge. This adds about 1.2 MB to the size of the compiled `app.apk`, but note that the resulting app size delivered to end users might be smaller if the app storefront is able to thin out unused architectures.
 - Unsigned types: Neither the Java language nor the Java bytecode specification have any support for unsigned types. Kotlin's support for unsigned types (e.g., `UInt8`) are wrappers around the equivalent signed type (e.g., `Int8`), and are not understood or handled by JNA. Attempting to map a function parameter or return type to an unsigned data type will raise a runtime error. In order to work around this limitation, unsigned types must be manually marshalled and unmarshalled, which can be cumbersome.
 - Project Panama: this recent project aims to ease the interaction between Java and foreign APIs written in C and C++. It is presented as an alternative for JNI and JNA, and eliminated most of the bridging overhead, making it the most high-performance call interface from Java into native code. However, Project Panama is an OpenJDK project, and is unlikely to make it into Android's Java runtime (ART) anytime soon.
 - Mach-O/ELF: You may be wondering what the difference between the `libSkipCDemo.dylib` and `arm64-v8a/libclibrary.so` are. If you're building on an ARM macOS machine, the architecture for both these files should be arm64-v8a, right? Yes, but they are not the same format. Darwin-based operating systems like iOS and macOS use the "Mach-O" executable format[^7], whereas Linux-based operating systems like Android use the "ELF" format[^8]. You can see this after running `swift test` in the sample project from the Terminal:
 ```
 skiptools/skip-c-demo % file ./.build/arm64-apple-macosx/debug/libSkipCDemo.dylib ./.build/plugins/outputs/skip-c-demo/LibCLibrary/skipstone/LibCLibrary/.build/SkipCDemo/intermediates/merged_native_libs/debug/out/lib/*/*.so
 …/libSkipCDemo.dylib: Mach-O 64-bit dynamically linked shared library arm64
 …/arm64-v8a/libclibrary.so: ELF 64-bit LSB shared object, ARM aarch64, version 1 (SYSV), dynamically linked
 …/armeabi-v7a/libclibrary.so: ELF 32-bit LSB shared object, ARM, EABI5 version 1 (SYSV), dynamically linked
 …/x86/libclibrary.so: ELF 32-bit LSB shared object, Intel 80386, version 1 (SYSV), dynamically linked
 …/x86_64/libclibrary.so: ELF 64-bit LSB shared object, x86-64, version 1 (SYSV), dynamically linked
 ```

### References

 - Using Imported C Functions in Swift: [https://developer.apple.com/documentation/swift/using-imported-c-functions-in-swift](https://developer.apple.com/documentation/swift/using-imported-c-functions-in-swift)
 - Android NDK JNI Tips: [https://developer.android.com/training/articles/perf-jni](https://developer.android.com/training/articles/perf-jni)

### Footnotes

[^1]: Non-game development, that is.
[^2]: More information on Swift's C integration can be found at [https://developer.apple.com/documentation/swift/using-imported-c-functions-in-swift](https://developer.apple.com/documentation/swift/using-imported-c-functions-in-swift).
[^3]: The `CMakeLists.txt` is used by the cmake tool ([https://cmake.org](https://cmake.org)), a flexible and popular native build tool that is used by both Swift Package Manager and the Gradle Android plugin (see [https://developer.android.com/ndk/guides/cmake](https://developer.android.com/ndk/guides/cmake)) for integration with native build systems.
[^4]: The details of how this works can be found at the JNA project's homepage at [https://github.com/java-native-access/jna](https://github.com/java-native-access/jna). JNA adds about 1.1 MB to the side of your `app.apk`, which is why it is included in a separate `SkipFFI` package rather than included directly with `SkipLib` or `SkipFoundation`.
[^5]: Swift C interoperability types[^5] ([https://developer.apple.com/documentation/swift/c-interoperability](https://developer.apple.com/documentation/swift/c-interoperability))
[^6]: Javadoc for `com.sun.jna.Pointer`: [https://java-native-access.github.io/jna/5.14.0/javadoc/com/sun/jna/Pointer.html](https://java-native-access.github.io/jna/5.14.0/javadoc/com/sun/jna/Pointer.html)
[^7]: Mach-O file format: [https://en.wikipedia.org/wiki/Mach-O](https://en.wikipedia.org/wiki/Mach-O)
[^8]: Executable and Linkable Format (ELF): [https://en.wikipedia.org/wiki/Executable_and_Linkable_Format](https://en.wikipedia.org/wiki/Executable_and_Linkable_Format)

<!-- [^1]: Unless there were to be some Rosetta-style ARM-to-RISC-V emulator. -->
