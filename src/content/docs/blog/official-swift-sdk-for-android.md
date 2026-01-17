---
title: "An official Swift SDK for Android"
date: 2025-10-25
tags: [swift, android, sdk, official-release, swift-6.3, workgroup, native, cross-platform, announcement]
layout: post
permalink: /blog/official-swift-sdk-for-android/
author: the Skip Team
---

When we first launched Skip in 2023, the notion of using Swift to create universal mobile applications was novel. While some projects had dabbled with custom Swift toolchains to share some of their business logic between iOS and Android, no one had ever undertaken the effort to enable building the entire application stack — from the low-level networking and persistence all the way up to the user interface — using just the Swift language.

But the time was right. SwiftUI was just reaching maturity, and its declarative design was flexible enough to target not only the mobile phone form factor, but also to scale all the way up to the full desktop and all the way down to the smartwatch. Expanding SwiftUI's architecture to the "other" mobile platform was a daunting engineering challenge, but it made perfect sense from the standpoint of facilitating the creation of a whole app using a single language.

Developers who have adopted Skip for their dual-platform app development have loved it. But there has always been an undercurrent of caution and reservation about the future of the project, especially from larger enterprises for whom the architecture decisions were central to their business' future. As we've written in the past, the best-in-class apps that top the charts on both the App Store and Play Store are not written once, but twice: they are written first in Swift for iOS, and then they are re-written in Kotlin for Android. Despite being enormously laborious to coordinate and maintain, writing the app twice has always been considered the safe choice, not just because it enables optimal performance and a _truly_ native user interface, but also because they are using the languages and APIs that are recommended and supported by the operating system vendors themselves. How could an independent project by a small team possibly offer the same guarantees of technological durability?

### Enter the Swift Android Workgroup

Such concerns have presented a challenge and barrier against the adoption of Skip for cross-platform app development since the beginning. And so we joined together with some other visionaries and founded the Swift on Android Community Working Group[^commgroup] earlier this year. Our goal was to collaborate in harnessing and coordinating the energies of various developers and businesses that had each dabbled in using Swift in some way for their Android apps.

[^commgroup]: Swift on Android Working Group, Community Showcase, February 10, 2025: [https://forums.swift.org/t/swift-on-android-working-group/77780](https://forums.swift.org/t/swift-on-android-working-group/77780)

The workgroup had so much excitement behind it that a few months later, it was blessed by the Swift Platform Steering Group as an official workgroup[^officialgroup], which meant that we had the backing and support of the Swift community as a whole. This was **huge**: Swift on Android was no longer a niche interest for risk-taking startups and indie developers, but was going to evolve into a fully-supported platform for the Swift language.

[^officialgroup]: Announcing the Android Workgroup, June 25, 2025: [https://forums.swift.org/t/announcing-the-android-workgroup/80666](https://forums.swift.org/t/announcing-the-android-workgroup/80666)

Work began in earnest. Since last year, Skip has been using an unofficial preview build of the toolchain and native Swift SDK for Android to power our "Skip Fuse" mode[^nativeswiftandroid]. Using this technology as a base — which had evolved over the years in a somewhat haphazard fashion — we began the long process of getting it in shape for official approval and release: cleanup, bug fixes, ripping out unsupported dependencies, harmonizing the structure with other Swift SDKs, packaging, quality control, and continuous integration.

[^nativeswiftandroid]: Native Swift on Android, Part 1: Setup, Compiling, Running, and Testing: [/blog/native-swift-on-android-1/](/blog/native-swift-on-android-1/)

### The Official Release

The culmination of all these efforts has at last arrived! As announced on the swift.org blog[^announcement], we are now publishing the Swift SDK as an officially supported platform. The Swift SDK for Android is available alongside the Static Linux (Musl) and WebAssembly (Wasm) SDKs, and will be available in nightly snapshot releases throughout the Swift 6.3 release cycle.

[^announcement]: Announcing the Swift SDK for Android: [https://www.swift.org/blog/nightly-swift-sdk-for-android/](https://www.swift.org/blog/nightly-swift-sdk-for-android/)

As mentioned, Skip is currently using our own preview release build of this SDK for our native Skip Fuse mode. So switching over to this official SDK will be smooth and painless for our current customers. We anticipate that the final Swift 6.3 release will be the point where we include it by default in the Skip installation and setup instructions.

Note that this SDK is not just theoretical, but is in active use _today_ in many Skip-powered applications. Our own Skip Showcase[^showcase] app has been running using this SDK, and provides a comprehensive sample of what is possible when you combine native Swift with Skip's SwiftUI implementation for Android.

[^showcase]: Skip Showcase [/docs/samples/skipapp-showcase-fuse/](/docs/samples/skipapp-showcase-fuse/)

## The Future for Swift on Android

Since we announced the availability of the Swift SDK for Android, there has been an explosion of interest in the project. Many heretofore skeptics are realizing that this is _real_, and are seeing that Swift is a viable choice as the one language for their entire application stack — on all platforms. No longer do developers need to make the agonizing choice between writing an application in two separate native languages, versus settling on an inefficient and alien language like JavaScript or Dart for their shared codebase.

For Skip itself, this development grants us an _enormous_ amount of confidence-building support. **Swift on Android is here to stay**. And so even if Skip as a product were to somehow disappear tomorrow, any investment that is made in Swift for Android development would continue be a viable and supported path going forward. Swift on Android is available today, it has official backing by the Swift project, and it is here to stay. The future is bright!


<div align="center">
  <a href="https://assets.skip.dev/screens/swift-sdk-for-android-in-action-showcase.png" target="_blank"><img alt="Screenshot of Skip Showcase native app" src="https://assets.skip.dev/screens/swift-sdk-for-android-in-action-showcase.png" style="width: 100%; max-width: 1200px;" /></a>
  <br />
  <a href="https://play.google.com/store/apps/details?id=org.appfair.app.Showcase" style="display: inline-block;"><img src="https://appfair.org/assets/badges/google-play-store.svg" alt="Download on the Google Play Store" style="height: 60px; vertical-align: middle; object-fit: contain;" /></a>
  <a href="https://apps.apple.com/us/app/skip-showcase/id6474885022" style="display: inline-block;"><img src="https://appfair.org/assets/badges/apple-app-store.svg" alt="Download on the Apple App Store" style="height: 60px; vertical-align: middle; object-fit: contain;" /></a>
</div>


