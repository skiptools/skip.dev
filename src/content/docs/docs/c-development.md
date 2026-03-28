---
title: C Development Reference
permalink: /docs/c-development/
---

Skip supports calling C and C++ code from your cross-platform Swift, with different mechanisms depending on which mode you are using.

## Skip Fuse (Native Mode)

In [Fuse mode](/docs/modes/#fuse), your Swift compiles natively for Android, so Swift's built-in C and C++ interoperability works exactly as it does on iOS. You can use Swift's `import` of C modules, call C functions directly, and work with C pointers and structs without any bridging layer.

This means you can use C libraries (like SQLite, libxml2, or your own native code) on both platforms with no additional effort beyond what you would do on iOS. The [Swift Android SDK](https://www.swift.org/blog/swift-6.3-released/#android) includes the Android NDK, so common system libraries are available.

For examples of C interop in a Fuse project, see the [skipapp-travelposters-native](https://github.com/skiptools/skipapp-travelposters-native) sample.

## Skip Lite (Transpiled Mode)

In [Lite mode](/docs/modes/#lite), your Swift is transpiled to Kotlin, so Swift's native C interop is not available. Instead, Skip provides the [`skip-ffi`](/docs/modules/skip-ffi/) module, which uses [JNA (Java Native Access)](https://github.com/java-native-access/jna) to call C functions from the transpiled Kotlin code.

With `skip-ffi`, you write your C function declarations in Swift, and Skip transpiles them into JNA calls on Android. This lets you share C library code across both platforms from a single Swift codebase.

For a detailed walkthrough, see the blog post [Sharing C code between Swift and Kotlin for iPhone and Android apps](/blog/sharing-c-between-swift-and-kotlin/).

## Which approach to choose

If your project relies heavily on C or C++ libraries, Fuse mode is the simpler path because Swift's native interop works identically on both platforms. If you are using Lite mode for other reasons (such as maximizing Kotlin interoperability), `skip-ffi` provides a solid bridge to C libraries through JNA.
