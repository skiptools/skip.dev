---
title:  "Bringing Swift and SwiftUI to Android"
date:   2024-03-26
tags: [swift, swiftui, android, kotlin, cross-platform, transpiler, jetpack-compose, mobile-development, swiftpm]
layout: post
permalink: /blog/bringing-swift-to-android/
author: The Skip Team
---

Swift and SwiftUI are Apple’s recommended technologies for app development, and with good reason. Their emphasis on safety, efficiency, and expressiveness have made it easier than ever to build fast, polished, and robust apps for the Apple ecosystem.

Recent stories about [Swift on Windows](https://www.swift.org/blog/swift-everywhere-windows-interop/), [Swift on the Playdate](https://www.swift.org/blog/byte-sized-swift-tiny-games-playdate/), and a [SwiftUI-like library for Gnome](https://www.swift.org/blog/adwaita-swift/) highlight developers’ desire to take advantage of Swift and SwiftUI in other environments too, and advances in Swift tooling have facilitated the porting process. We’re excited to share how Skip combines several Swift platform technologies to bring Swift and SwiftUI development to Android.

![Cross-platform development in Xcode](https://assets.skip.dev/images/skip-marketing-preview.jpg)

## Overview

There are multiple paths to supporting Swift on Android, and - like everything in engineering - each comes with its own set of tradeoffs. We chose *transpilation* as our primary mechanism. Transpiling your Swift source to Android’s native [Kotlin](https://kotlinlang.org) language maximizes interoperability, allowing you to call Kotlin and Java APIs directly from Swift - a key concern when you want to take advantage of Android-specific features in your apps.

Our Swift-to-Kotlin transpiler is powered by [SwiftSyntax](https://github.com/apple/swift-syntax), and we use use [Swift Package Manager](https://github.com/apple/swift-package-manager) to both invoke the transpiler as part of the build process, and to integrate our suite of [open source Android libraries](/docs/modules/). 

![Diagram of Skip's Swift-on-Android build process](https://assets.skip.dev/diagrams/skip-diagrams-app.svg)

The result is a workflow in which you work in Xcode, writing standard Swift and SwiftUI. Our build plugin leaves your source code untouched, but generates, packages, and builds the equivalent Kotlin and Jetpack Compose alongside it. One Swift and SwiftUI codebase, two fully native apps.

Let’s take a closer look at the Swift platform technologies that make this possible.

## Transpilation with SwiftSyntax

[SwiftSyntax](https://github.com/apple/swift-syntax) is an open source Swift library by Apple that provides powerful tools for parsing and transforming Swift source code. SwiftSyntax has existed for some time, but it has only recently risen to prominence as the library powering [Swift macros](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/macros/). 

Our transpiler uses SwiftSyntax to parse your Swift code into a highly detailed syntax tree. Once we have this tree, we’re able to analyze it and translate it into an equivalent syntax tree for [Kotlin](https://kotlinlang.org), the modern JVM-based language used in Android development. The fidelity that SwiftSyntax provides not only allows us to perfectly capture the semantics of the Swift source, but even to preserve your comments and formatting. The Kotlin we output is often indistinguishable from hand-written code.

```swift
Example Swift:

protocol Action {
    associatedtype R
    var name: String { get }
    func perform() throws -> R
}

/// Action to add two integers
struct AddAction: Action, Equatable {
    let lhs: Int // Left hand side
    let rhs: Int // Right hand side
    
    var name: String {
        return "Add"
    }

    func perform() -> Int {
        return lhs + rhs
    }
}
```

```kotlin
Transpiles to:

internal interface Action<R> {
    val name: String
    fun perform(): R
}

/// Action to add two integers
internal class AddAction: Action<Int> {
    internal val lhs: Int // Left hand side
    internal val rhs: Int // Right hand side

    override val name: String
        get() = "Add"

    override fun perform(): Int = lhs + rhs

    constructor(lhs: Int, rhs: Int) {
        this.lhs = lhs
        this.rhs = rhs
    }

    override fun equals(other: Any?): Boolean {
        if (other !is AddAction) return false
        return lhs == other.lhs && rhs == other.rhs
    }
}
```

[`ViewBuilders`](https://developer.apple.com/documentation/swiftui/viewbuilder) - a special case of Swift’s [`ResultBuilders`](https://github.com/apple/swift-evolution/blob/main/proposals/0289-result-builders.md) - lie at the heart of SwiftUI’s easy-to-use syntax. SwiftSyntax is able to perfectly parse these as well, but this is one area where our output does not look hand-written. Kotlin doesn’t support the expressive `ViewBuilder` syntax, and [Jetpack Compose](https://developer.android.com/develop/ui/compose) - Android’s modern UI framework - is based on nested function calls instead. The transpilation from `ViewBuilders` to function calls is effective, but it results in mechanical-looking code.

You can see all of this in action using our online Swift-to-Kotlin [transpiler playground](/playground/). While it doesn’t replicate the integrated Xcode experience of the real thing, it is fun to experiment with, and it demonstrates the speed and sophistication of SwiftSyntax.

## Swift Package Manager Integration

Translating Swift into Kotlin is interesting, but a complete cross-platform solution must also integrate with your development workflow, support the Swift and SwiftUI APIs you’re accustomed to using, and scale to multi-module projects. For these needs, we leverage [Swift Package Manager](https://github.com/apple/swift-package-manager).

Swift Package Manager (SwiftPM) is the standard dependency management tool for Swift projects, and it has become an integral part of the Swift ecosystem. We use SwiftPM’s plugin support, dependency resolution, and module system.

### Plugins

[Swift Package Manager Plugins](https://docs.swift.org/swiftpm/documentation/packagemanagerdocs/plugins/) are a way to extend the functionality of SwiftPM. They allow developers to securely add custom commands or behaviors to the package manager. Parts of the plugin API are specifically designed for reading source code and generating additional source code, and we utilizes these capabilities to invoke our transpiler. Thanks to Xcode’s seamless SwiftPM integration, this happens transparently on every build, and any transpilation errors are surfaced right inline.

### Dependency Resolution

We maintain a suite of [open source libraries](/docs/modules/) to mirror standard frameworks like Foundation, Observation, and SwiftUI for Android. SwiftPM allows you to easily integrate these libraries into your project, keep them up to date, and manage their transitive dependencies. Because SwiftPM’s `Package.swift` files have all the capabilities of Swift, we can add logic allowing you to exclude these Android libraries when performing Apple platform release builds, keeping your Apple releases free from any dependencies on Skip.

### Modules

As the size of a project grows, so does the importance of modularization. SwiftPM makes it as easy as possible to break up your code into modules that you can test and iterate on independently. Compartmentalizing your codebase can also significantly improve compilation speeds, as modules that haven’t changed don’t need to be recompiled. We’re able to use this optimization as well, avoiding re-transpiling and recompiling for Android when a module hasn’t been modified. 

## Unit Testing with XCTest

Unit testing is critical for verifying functionality and ensuring that what worked yesterday will still work tomorrow. This is doubly important for code that runs on multiple platforms.

[XCTest](https://developer.apple.com/documentation/xctest) is Apple's native framework for writing and running unit tests in Swift. Through our open source [SkipUnit](/docs/modules/skip-unit/) library, we support the XCTest API on top of [JUnit](https://junit.org/junit5/), the venerable Java unit testing framework. 

![Diagram of Skip's XCTest-on-Android test process](https://assets.skip.dev/diagrams/skip-diagrams-testing.svg)

Being able to run a unified set of Swift unit tests across your Apple **and** Android targets is a critical aspect of any Swift-on-Android solution. In fact the Skip modules themselves rely heavily on this testing support: we use GitHub actions to run our suite of Swift unit tests across both iOS and Android on every commit to prevent regressions.

## Conclusion

While Swift and SwiftUI are often associated with development for Apple devices, their principles and paradigms are universal, and their use across platforms is spreading. Advances in the Swift ecosystem have unlocked powerful integration possibilities. We leverage these advances to bring Swift and SwiftUI to Android with Skip, allowing you to create fully native cross-platform libraries and apps from a single Swift and SwiftUI codebase.
