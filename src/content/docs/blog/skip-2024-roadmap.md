---
title:  "Skip 2024 Roadmap"
date:   2023-12-24
tags: [skip, roadmap, cross-platform, mobile-development, swift, swiftui, kotlin, jetpack-compose, '2024', skipstone, skipui, skipfoundation]
layout: post
permalink: /blog/skip-2024-roadmap/
author: Marc Prud'hommeux
---

Skip enables you to build the best possible apps, for the widest possible audience, using a single codebase. Our goal with Skip is to enable individuals and small teams to create apps for both the iPhone and Android using the native first-party toolkits for those platforms: SwiftUI and Jetpack Compose. We believe this is the best possible experience for users of iPhone and Android devices.

<!-- It is an incontestable fact that the best apps use user interfaces.  -->

<!-- This means SwiftUI/UIKit on iOS and Jetpack Compose on Android. -->

We spent 2023 building the underlying technology to enable this project. The *SkipStone* transpiler takes your code written in Swift for iOS and converts it into Kotlin for Android. The open-source *SkipStack* frameworks provide runtime support: they transparently bridge the various Darwin and iOS software layers into their Android equivalents. This includes *SkipUI*, which takes your SwiftUI interface and turns it into the equivalent Jetpack Compose code, as well as *SkipFoundation*, which bridges the low-level Foundation framework to the Java APIs used by Android apps. Bringing it all together is the *Skip* Xcode plugin that automatically runs the transpiler when you build your project and converts your entire Swift package into a buildable Android gradle project.

The end result is a magical development experience: you develop in Xcode and run your SwiftUI app in the iOS Simulator, and Skip seamlessly transpiles and launches your Compose app in the Android emulator. Change some code and re-run, and within seconds both your iOS app and Android app are rebuilt and run side-by-side, ready for testing. The [Skip Tour](/tour/) video provides a taste of this process.

In 2024 we will be expanding our ecosystems of Skip frameworks beyond SwiftUI and Foundation. Aside from user interface widgets and operating system integration, a modern mobile app needs a variety of capabilities: graphics and animation, SQL databases, push notifications, media players, cloud storage, payment integrations, parsers for common data formats, cryptography, game technologies, et cetera. 

There are many existing libraries, both 1st and 3rd party, for both Android and iOS that fulfill these needs. Our goal is not to re-invent them, but rather to build common abstractions atop them. For example, the new *SkipAV* framework for playing music and videos is not created from scratch, but is rather implemented on top of iOS's *AVKit* and Android's *ExoPlayer*. This enables Skip apps to take advantage of each platform's best-in-class libraries that have matured over the years, while at the same time maintaining a single dual-platform API for developer convenience. 

These frameworks are all free and open-source software that Android and iOS app developers can use in their apps. We sell the Skip transpiler itself, but the ecosystem of Skip frameworks can be used – independently of the Skip transpiler – whether or not you are a customer. We choose to make them free software not merely as a value-add for our own customers, but also to grant you, the developer, the confidence that anything you build with Skip will remain under your purview, and that you retain the agency to continue to iterate on your app, with or without the Skip transpiler.

The realization of genuinely native apps for both major mobile platforms, created from a single codebase in a single language, has been a dream for a long time. 2024 will be an exciting year.

