---
layout: docs
title: Native Swift Tech Preview
permalink: /docs/native/
---

# Native Swift

Skip has long allowed developers to create cross-platform iOS and Android apps in Swift and SwiftUI by *transpiling* your Swift to Android's native Kotlin language. Now, Skip gives you the ability to use native, **compiled** Swift for cross-platform development as well. Skip's native Swift support is a combination of:

- A native Swift toolchain for Android.
- Integration of Swift functionality like logging and networking with the Android operating system.
- Swift API for accessing various Android services.
- Bridging technology for using Kotlin/Java API from Swift, and for using Swift API from Kotlin/Java.
- The ability to power Jetpack Compose and shared SwiftUI user interfaces with native Swift `@Observables`.
- Xcode integration and tooling to build and deploy across both iOS and Android.

Instructions for using native Swift have been integrated into the [Skip documentation](/docs/), starting with the chapter on [Native vs. Transpiled](/docs/modes/) modes. Enjoy!