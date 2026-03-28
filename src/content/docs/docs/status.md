---
title: Skip Fuse vs Lite
permalink: /docs/status/
---

Skip supports two modes for bringing your Swift code to Android. You can use either mode, or combine them within a single app by using different modes for different modules.

### Skip Fuse {#skip_fuse}
**Skip Fuse** compiles your Swift natively for Android using the [official Swift SDK for Android](https://www.swift.org/blog/swift-6.3-released/#android). It auto-generates [JNI](https://docs.oracle.com/javase/8/docs/technotes/guides/jni/) bridging code so your compiled Swift can communicate with [Kotlin](https://kotlinlang.org) and Java. Fuse gives you full access to the Swift language, standard library, and Foundation on Android.

### Skip Lite {#skip_lite}
**Skip Lite** transpiles[^1] your Swift source code into Kotlin, which is then compiled using the standard Kotlin compiler. This maximizes interoperability with Android's native ecosystem, since the result is pure Kotlin code.

[^1]: [_Transpilation_](https://en.wiktionary.org/wiki/transpile) is the process of converting one programming language into another.

In both modes, Skip translates your SwiftUI views into Jetpack Compose, producing genuinely native UI on Android.

Except where otherwise noted, this documentation focuses on Skip Fuse. To learn more about the tradeoffs between native and transpiled modes, see [Native and Transpiled](/docs/modes/).

## Status

Skip is stable and powers production apps on both the [App Store](https://apps.apple.com/us/app/skip-showcase/id6474885022) and [Play Store](https://play.google.com/store/apps/details?id=org.appfair.app.Showcase). We appreciate your [feedback](/docs/help/) as we continue to improve its functionality and tooling.

The best way to get help and connect with fellow Skip users is to join the community [Slack](/slack/). We also have forums for [discussions](http://forums.skip.dev) and [issue tracking](https://source.skip.dev/skip/issues).
