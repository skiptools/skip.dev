---
title:  "Skip and Kotlin Multiplatform"
date: 2024-06-25
tags: [skip, kotlin-multiplatform, cross-platform, swiftui, jetpack-compose, swift, kotlin, kmp]
layout: post
permalink: /blog/skip-and-kotlin-multiplatform/
author: The Skip Team
draft: false
---

* Table of contents
{:toc}

Kotlin Multiplatform (KMP) is a technology that enables Kotlin to be compiled natively and used in non-Java environments. Google recommends using KMP for sharing business logic between Android and iOS platforms[^1].

[^1]: “We use Kotlin Multiplatform within Google and recommend using KMP for sharing business logic between Android and iOS platforms.” – [https://developer.android.com/kotlin/multiplatform](https://developer.android.com/kotlin/multiplatform). The mobile-specific form of KMP had been known as KMM, or "Kotlin Multiplatform Mobile", until they recently [deprecated the term](https://blog.jetbrains.com/kotlin/2023/07/update-on-the-name-of-kotlin-multiplatform/).

In many ways, Skip and KMP are inverses of each other, in that:

 - Skip brings your Swift/iOS codebase to Android.
 - KMP brings your Kotlin/Android codebase to iOS.

The mechanics powering these transformations are different – Skip uses source [transpilation](/docs/modes/#transpiled) to convert Swift into idiomatic Kotlin, whereas KMP compiles Kotlin into native code that presents an Objective-C interface – but the high-level benefits are the same: you can maintain a single codebase for both your iOS and Android app.

## Skip or KMP?

![Skip or KMP](https://assets.skip.dev/images/skip-or-kmp.jpg)
{: style="text-align: center; width: 50%; margin: auto;"}

We think that Skip is the [right way](/docs/#skip-versus-other-cross-platform-mobile-frameworks) to tackle the challenge of creating genuinely native dual-platform apps. Skip gives you an uncompromised iOS-first development approach: your code is used as-is on iOS devices, with zero bridging and no added runtime or garbage collector[^2]. Our [SkipUI](/docs/modules/skip-ui/) adaptor framework – which takes your SwiftUI and converts it into Jetpack Compose – allows you to create genuinely native user interfaces for both platforms. And while the Compose Multiplatform[^3] project adds cross-platform Compose support to KMP, it eschews native components on iOS by default. It utilizes a Flutter-like strategy instead, painting interface elements onto a Skia canvas. This can result in a sub-par experience for iOS users in terms of aesthetics, performance, accessibility, and feel, not to mention limitations on native component integration (something Skip [excels at](/docs/modules/skip-ui/#composeview)). We believe that a premium, no-compromises user experience requires embracing the platform's native UI toolkit.

[^2]: KMP embeds a garbage collector into its compiled iOS framework. Kotlin/Native's GC algorithm is a stop-the-world mark and concurrent sweep collector that does not separate the heap into generations. [https://kotlinlang.org/docs/native-memory-manager.html#garbage-collector](https://kotlinlang.org/docs/native-memory-manager.html#garbage-collector)

[^3]: “Develop stunning shared UIs for Android, iOS, desktop, and web” – [https://www.jetbrains.com/lp/compose-multiplatform](https://www.jetbrains.com/lp/compose-multiplatform)

If we put the UI layer aside, however, using KMP for logic and model code *does* have some great benefits. With KMP, you can target not just Android and iOS, but also the web, desktop, and server-side environments, whereas Skip is focused squarely on mobile app development. You can also write and build KMP code on a variety of platforms: macOS, Windows, and Linux. Finally, some organizations might already be heavily invested in the Kotlin/Java ecosystem.

## Skip *and* KMP!

![Skip and KMP](https://assets.skip.dev/images/skip-and-kmp.jpg)
{: style="text-align: center; width: 50%; margin: auto;"}

And so it may be the case that you have business logic in one or more KMP modules that you want to use in a cross-platform Android and iOS app. The trend among organizations that have adopted KMP has been to build separate native apps for each platform – using Jetpack Compose (or Views) on Android and SwiftUI (or UIKit) on iOS – and then import their KMP business logic module into those apps. This is much the same as [writing two separate apps](/docs/#skip-versus-writing-two-separate-native-apps), but with the benefit that some of the business logic can use a shared codebase.

This happens to be a perfect fit for Skip. With Skip/KMP integration, you can build the UI of your app from a single Swift codebase, and at the same time use the KMP module from both the Swift and (transpiled) Kotlin sides of the app. You get all the benefits of a genuinely native user interface, and can still leverage any existing investment in a shared Kotlin codebase. The remainder of this post will outline the details of integrating and accessing a KMP module from a Skip app project.

## Using a KMP library in a Skip project

When viewed from the Android side, a KMP module is simply a traditional Kotlin/Gradle project dependency: you add it to your `build.gradle.kts` and import the Kotlin packages in the same way as you use any other Kotlin package. The KMP module has no knowledge of, or dependency on, any Skip libraries or tools.

The iOS side is a bit more involved: the KMP project must be compiled and exported as a native library[^4] that can be imported into the iOS project. This is done by compiling the KMP project to native code and then exporting it to an xcframework, which is a multi-platform binary framework bundle that is supported by Xcode and SwiftPM.

[^4]: Details about how a KMP project can be used to create an xcframework can be found at [https://kotlinlang.org/docs/apple-framework.html](https://kotlinlang.org/docs/apple-framework.html), and you can reference our [kmp-library-sample](https://github.com/skiptools/kmp-library-sample.git) project for a concrete example. This is another interesting reversal of the normal way of doing things, where the Swift side of an app typically has source dependencies on other SwiftPM packages and the Kotlin side typically has binary dependencies on `jar`/`aar` artifacts published to a Maven repository. When depending on a KMP project, this is reversed: the Swift side has a binary dependency on the xcframework built from the KMP project, and the Kotlin side has a source dependency on the KMP project's Kotlin/Gradle project.

The resulting project and dependency layout will look like this:

![Skip KMP Diagram](https://assets.skip.dev/diagrams/skip-diagrams-kmp.svg)
{: .diagram-vector }

## Adding a KMP dependency to a Skip Framework

In the `Package.swift` file for the [skip-kmp-sample](https://github.com/skiptools/skip-kmp-sample.git) library, we have the Skip-enabled "SkipKMPSample" target with a dependency on a binary target specifying the location and checksum of the compiled xcframework. This enables us to access the Objective-C compiled interface for the KMP library, which is in the separate [kmp-library-sample](https://github.com/skiptools/kmp-library-sample.git) repository containing the Kotlin and Gradle project that builds the library.

```swift
// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "skip-kmp-sample",
    defaultLocalization: "en",
    platforms: [.iOS(.v16), .macOS(.v13), .tvOS(.v16), .watchOS(.v9), .macCatalyst(.v16)],
    products: [
        .library(name: "SkipKMPSample", targets: ["SkipKMPSample"]),
    ],
    dependencies: [
        .package(url: "https://github.com/skiptools/skip.git", from: "0.8.55"),
        .package(url: "https://github.com/skiptools/skip-foundation.git", from: "0.6.12")
    ],
    targets: [
        .target(name: "SkipKMPSample", dependencies: [
            .product(name: "SkipFoundation", package: "skip-foundation"),
            "MultiPlatformLibrary"
        ], resources: [.process("Resources")], plugins: [.plugin(name: "skipstone", package: "skip")]),
        .testTarget(name: "SkipKMPSampleTests", dependencies: [
            "SkipKMPSample",
            .product(name: "SkipTest", package: "skip")
        ], resources: [.process("Resources")], plugins: [.plugin(name: "skipstone", package: "skip")]),
        .binaryTarget(name: "MultiPlatformLibrary", 
            url: "https://github.com/skiptools/kmp-library-sample/releases/download/1.0.4 /MultiPlatformLibrary.xcframework.zip",
            checksum: "65e97edcdeadade0f10ef0253d0200bce0009fe11f9826dc11ad6d56b6436369")
    ]
)
```

For the transpiled Kotlin side of the Skip framework, we add a Gradle source dependency[^5] to that same repository. This is accomplished by using the module's [`skip.yml`](/docs/dependencies/) file to add the dependency on the same tagged version as the published xcframework:

[^5]: Note that we could have alternatively depended on a compiled `.aar` published as a pom to a Maven repository, but for expedience we find that using source dependencies are the easiest way to link directly to another git repository.

```yaml
settings:
  contents:
    - block: 'sourceControl'
      contents:
        - block: 'gitRepository(java.net.URI.create("https://github.com/skiptools/kmp-library-sample.git"))'
          contents:
            - 'producesModule("kmp-library-sample:multi-platform-library")'

build:
  contents:
    - block: 'dependencies'
      contents:
        - 'implementation("kmp-library-sample:multi-platform-library:1.0.4")'

```

The result is that the Kotlin side of the Skip project will depend on the Kotlin library, and the Swift side of the Skip project will access the natively-compiled xcframework of the KMP library via its exported Objective-C interface.

## Using KMP code from a Skip app

Using KMP code from a Skip app is generally the same as using KMP from any other app. As already mentioned, on the Android side, the KMP module is included directly as Kotlin code, and compiled to JVM bytecode along with the rest of your app. On the iOS side, the code is compiled natively to each of the supported architectures (ARM iOS, ARM/X86 iOS Simulator, and ARM/X86 macOS) and bundled into an xcframework. As part of this packaging the KMP compiler generates an Objective-C interface to the native code. This interface can then be used from your Swift through the automatic Objective-C bridging provided by the Swift language.

A simple example can be illustrated using the following Kotlin class:

```kotlin
class SampleClass(var stringField: String, var intField: Int, val doubleField: Double) {
    fun addNumbers() : Double {
        return intField + doubleField
    }

    suspend fun asyncFunction(duration: Long) {
        delay(duration)
    }

    @Throws(Exception::class)
    fun throwingFunction() {
        throw Exception("This function always throws")
    }
}
```

The Objective-C header created by the Kotlin/Native compiler for this class will look like this:

```objc
__attribute__((objc_subclassing_restricted))
__attribute__((swift_name("SampleClass")))
@interface MPLSampleClass : MPLBase

@property (readonly) double doubleField __attribute__((swift_name("doubleField")));
@property int32_t intField __attribute__((swift_name("intField")));
@property NSString *stringField __attribute__((swift_name("stringField")));

- (instancetype)initWithStringField:(NSString *)stringField intField:(int32_t)intField doubleField:(double)doubleField __attribute__((swift_name("init(stringField:intField:doubleField:)"))) __attribute__((objc_designated_initializer));

- (double)addNumbers __attribute__((swift_name("addNumbers()")));

/**
 * @note This method converts instances of CancellationException to errors.
 * Other uncaught Kotlin exceptions are fatal.
*/
- (void)asyncFunctionDuration:(int64_t)duration completionHandler:(void (^)(NSError * _Nullable))completionHandler __attribute__((swift_name("asyncFunction(duration:completionHandler:)")));

/**
 * @note This method converts instances of Exception to errors.
 * Other uncaught Kotlin exceptions are fatal.
*/
- (BOOL)throwingFunctionAndReturnError:(NSError * _Nullable * _Nullable)error __attribute__((swift_name("throwingFunction()")));
@end
```

When viewed as Swift, the Objective-C interface will be represented as:

```swift
public class SampleClass: NSObject {
    public var stringField: String { get set }
    public var intField: Int32 { get set }
    public var doubleField: Double { get }
    
    public init(stringField: String, intField: Int32, doubleField: Double)
    public func addNumbers() -> Double
    public func asyncFunction(duration: Int64) async throws
    public func throwingFunction() throws
}
```

This Swift interface derived from the generated Objective-C is idiomatic, much in the same way that Skip's transpiled code is [idiomatic Kotlin](/docs/swiftsupport/). This results in code that can be used from both sides of your dual-platform Swift project using the same interface. For example, this Swift code will work on both sides of a Skip project, where the Swift code instantiates the Objective-C class, and the transpiled Kotlin code instantiates the Java class.

```swift
func performAdd() -> Double {
    let instance = SampleClass(stringField: "XYZ", intField: Int32(123), doubleField: 12.23)
    return instance.addNumbers()
}
```

### Kotlin type mappings

The [type mapping](https://kotlinlang.org/docs/native-objc-interop.html#mappings) section of the Interoperability with Swift/Objective-C documentation goes over the automatic conversion of various Kotlin types into their closest Objective-C equivalents. This, in turn, will affect how the Swift types are represented.

These type mappings will typically be the same as the type mappings used by Skip to represent Swift types in Kotlin (such as a Kotlin `Short` being represented by a Swift `Int16`), but they don't always line up exactly. In these cases, there may need to be some manual coercion of types inside an [`#if SKIP` block](/docs/platformcustomization/#compiler-directives) to get both the Swift and transpiled Kotlin to behave the same.

### Throwing functions

Kotlin doesn't have functions that declare that they might throw an exception (like Swift and Java), but if you add the `@Throws` annotation to a function, the Kotlin/Native compiler will generate Objective-C that accepts a trailing `NSError` pointer argument, which is, in turn, represented in Swift as a throwing function. For example, the following Kotlin:

```kotlin
@Throws(IllegalArgumentException::class)
public func someThrowingFunction() {
    …
}
```

will be represented in Swift as:

```swift
func someThrowingFunction() throws {
    …
}
```

### Async functions

In the same way that Skip transforms Swift [async functions into Kotlin coroutines](/docs/swiftsupport/#concurrency), the Kotlin/Native compiler will generate Objective-C with a trailing `completionHandler` parameter that will be represented in Swift as an async throwing function.

For example, the Kotlin function:

```kotlin
suspend fun someAsyncFunction(argument: String): String {
    …
}
```

will be represented in Swift as:

```swift
func someAsyncFunction(argument: String) async throws {
    …
}
```

## Caveats

Considering that Skip was not designed with KMP integration in mind – nor vice-versa – it is remarkable how well they work together out of the box. Classes, functions, async, throwable: all work without any special consideration by the Skip transpiler.

That being said, the integration is not perfect. You may encounter some of the following issues:

  - Primitive Boxing: KMP will box primitives when wrapping in collection types like arrays. For example, a Kotlin function that returns an `[Int]` will be represented in Objective-C as an `NSArray<MPLInt *>`, where `MPLInt` is an `NSNumber` type. And while the automatic Objective-C bridging will handle converting the `NSArray` into a Swift `Array`, it will not know enough about `MPLInt` to convert it into a Swift `Int32`, so that sort of conversion will need to be handled manually.
  - Static Functions: KMP doesn't map `object` functions to Objective-C `static` functions in the way that Skip assumes, but rather handles a Kotlin `object` as a singleton instance of the type accessible through a `shared` property.
  <!-- - Single KMP Dependency Limitation: an iOS project can have only a single KMP xcframework dependency[^6]. Attempts to import multiple KMP frameworks will result in `duplicate symbols` errors at build time (for static libraries), or errors like `Class MPLKListAsNSArray is implemented in both` (for dynamic libraries). This limits its utility to a single leaf dependency for an app-specific library, rather than, say, enabling multiple independent KMP modules to be used by one or more apps. -->

More can be read about platform-specific behavior in the Kotlin/Native [iOS integration](https://kotlinlang.org/docs/native-ios-integration.html) docs. 

[^6]: “Only one Kotlin framework can be loaded currently”: [kotlin-native/issues/2423](https://github.com/JetBrains/kotlin-native/issues/2423)

## Next steps

To experiment with your own Skip/KMP integrations, we recommend starting with our pair of example repositories:

  - [kmp-library-sample](https://github.com/skiptools/kmp-library-sample.git): a basic KMP project that presents a source Kotlin dependency, and whose [releases](https://github.com/skiptools/kmp-library-sample/releases) publish a binary xcframework artifact.
  - [skip-kmp-sample](https://github.com/skiptools/skip-kmp-sample.git): a basic Skip project that depends on the `kmp-library-sample`'s published xcframework on the Swift side, and has a source dependency on the `kmp-library-sample` gradle project on the Kotlin side. The test cases in this project utilize Skip's [parity testing](/docs/modules/skip-unit/#parity-testing) to ensure that the tests pass on each supported architecture: macOS and Robolectric for local testing, as well as iOS and Android for connected testing.

These two projects work together to provide a minimal working example of Skip's KMP integration, and can be used as the basis for further development.

## Conclusion

Skip presents an iOS-first, full-stack approach to writing apps for iOS and Android. From the low-level logic layers to the high-level user interface, Skip provides a vertically integrated stack of frameworks that enable the creation of best-in-class apps using the native UI toolkits for both of the dominant mobile platforms.

Kotlin Multiplatform has benefits too: KMP modules can be written and tested on multiple platforms, and they can target platforms beyond mobile. For this reason, KMP can be a compelling option for people who want to share their mobile app code with the web, desktop, or server-side applications.

KMP code fits nicely with Skip projects, because its idiomatic native Objective-C representation means that, for the most part, it can be used seamlessly from both the source Swift and transpiled Kotlin sides of a project. Whether you are creating KMP modules because you are invested in the Kotlin/Java ecosystem, or because you are starting to migrate away from an Android-centric app infrastructure, Skip provides the ideal complement to your existing KMP code. You can have the genuinely native user interface for both platforms that Skip provides, while at the same time utilizing the Kotlin code that you may have built up over time. It is truly the best of both worlds!



