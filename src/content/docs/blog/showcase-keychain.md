---
title: "Skip Showcase: Securing your secrets with SkipKeychain"
date: 2025-09-25
tags: [skip-keychain, keychain, android-security, ios-security, data-protection, cross-platform, skip-tool]
layout: post
permalink: /blog/showcase-keychain/
author: the Skip Team
---

Skip is a technology that enables the creation of dual-platform iOS/Android apps from a single shared Swift and SwiftUI codebase. The headline feature of Skip is that it takes your SwiftUI interface and automatically translates it into the equivalent Jetpack Compose interface, so your app is genuinely native on _both_ platforms.

However, there is much more to Skip than just SwiftUI: there is a whole suite of optional modules that you can add to your project that provide additional integrations with the underlying platform. These are primarily distributed as free and open-source Swift Package Manager repositories under the [skiptools](http://github.com/skiptools) GitHub organization, but many developers have also created their own. The equivalent package index in the Flutter world would be [pub.dev](https://pub.dev), and the closest thing for React might be [expo.dev](https://expo.dev).

This first post in the "Exploring Showcase" series will discuss the [SkipKeychain](/docs/modules/skip-keychain/) module, which provides a common API for accessing encrypted secrets on both iOS and Android. Future entries will cover other integrations, such as native embedded [web views](/docs/modules/skip-web/) and [video players](/docs/modules/skip-av/), [Lottie animations](/docs/modules/skip-motion/), [Firebase](/docs/modules/skip-firebase/) support, local [SQLite persistence](/docs/modules/skip-sql/), [Bluetooth](/docs/modules/skip-bluetooth/) and [NFC](/docs/modules/skip-nfc/) hardware, and [device sensor](/docs/modules/skip-device/) access.

As with many of Skip's features, we provide a demonstration in our eponymous "Showcase" app, which is available on both the Apple App Store and Google Play Store, and whose full source code is available in the [skipapp-showcase](https://github.com/skiptools/skipapp-showcase) repository.

<div align="center">
  <a href="https://play.google.com/store/apps/details?id=org.appfair.app.Showcase" style="display: inline-block;"><img src="https://appfair.org/assets/badges/google-play-store.svg" alt="Download on the Google Play Store" style="height: 60px; vertical-align: middle; object-fit: contain;" /></a>
  <a href="https://apps.apple.com/us/app/skip-showcase/id6474885022" style="display: inline-block;"><img src="https://appfair.org/assets/badges/apple-app-store.svg" alt="Download on the Apple App Store" style="height: 60px; vertical-align: middle; object-fit: contain;" /></a>
</div>

## What is SkipKeychain?

The SkipKeychain module provides the ability to store and retrieve "secrets" on the device. These are small pieces of data, such as passwords, notes, and encryption keys, that need to be secured locally.

Apple offers a set of Keychain services[^keychainservices] APIs that provide access to their Keychain on iOS (as well as macOS and others). On Android, the `EncryptedSharedPreferences` is a [Jetpack](https://developer.android.com/jetpack) security library feature that encrypts key-value pairs before storing them in a [SharedPreferences](https://developer.android.com/reference/kotlin/android/content/SharedPreferences) file.

SkipKeychain is a great example of the power of Skip's integration capabilities, because it is so simple. The whole thing is implemented in a single ~300 line file, [SkipKeychain.swift](https://github.com/skiptools/skip-keychain/blob/main/Sources/SkipKeychain/SkipKeychain.swift). This is a _transpiled_ module, but it is bridged to native Swift, so it can be used equally well from a Skip Lite or Skip Fuse app[^fuselite].

The API surface is quite simple:

```swift
import SkipKeychain

let keychain = Keychain.shared

try keychain.set("value", forKey: "key")
assert(keychain.string(forKey: "key") == "value")

try keychain.removeValue(forKey: "key")
assert(keychain.string(forKey: "key") == nil)
```

The Showcase playground for the Keychain uses this API like so:

```swift
import SwiftUI
import SkipKeychain

struct KeychainPlayground: View {
    @State var allKeys: [String] = []

    /// load all the keys from the keychain
    func loadKeys() {
        allKeys = ((try? Keychain.shared.keys()) ?? []).sorted()
    }

    var body: some View {
        List {
            Section {
                ForEach(allKeys, id: \.self) { key in
                    NavigationLink {
                        KeychainValueEditor(key: key, isNewKey: false)
                    } label: {
                        Text(key)
                    }
                }
                .onDelete { indices in
                    for keyIndex in indices {
                        try? Keychain.shared.removeValue(forKey: allKeys[keyIndex])
                    }
                    loadKeys()
                }
            }
        }
        .onAppear {
            loadKeys()
        }
    }
}
```

The result is a very simple yet functional secret manager which behaves identically on both iOS and Android:

<div align="center">
<video id="intro_video" style="height: 500px;" autoplay muted loop playsinline>
  <source style="width: 100;" src="https://assets.skip.dev/videos/skip-keychain.mov" type="video/mp4">
  Your browser does not support the video tag.
</video>
</div>

## Modular Skip

One takeaway from this very simple and useful framework is just how simple it is to develop and iterate on, unlike the cumbersome bridging technologies needed by other cross-platform frameworks, which often force the developer to implement platform support across multiple separate projects with a variety of languages and build tools.

In contrast, Skip's framework support is as simple as can be: a single standard Swift Package Manage project using the skipstone plugin. Kotlin and Java APIs for Android can be dropped right into `#if SKIP` blocks, and the whole thing can be tested using SwiftPM's built-in testing support. And using the framework is just as standard: it is a simple Swift Package Manager dependency, added like:

```swift
let package = Package(
    name: "skipapp-showcase",
    products: [
        .library(name: "Showcase", type: .dynamic, targets: ["Showcase"]),
    ],
    dependencies: [
        .package(url: "https://source.skip.tools/skip.git", from: "1.0.0"),
        .package(url: "https://source.skip.tools/skip-ui.git", from: "1.0.0"),
        .package(url: "https://source.skip.tools/skip-keychain.git", "0.3.0"..<"2.0.0"),
    ],
    targets: [
        .target(name: "Showcase", dependencies: [
            .product(name: "SkipUI", package: "skip-ui"),
            .product(name: "SkipKeychain", package: "skip-keychain"),
        ], plugins: [.plugin(name: "skipstone", package: "skip")]),
    ]
)
```

## The Skip Advantage

The Skip philosophy is to take modern iOS-first development practices, and build on top of them to provide the ability to reach the entire marketplace. It does not add a whole new language and runtime on top of the platform, but instead enables _unintermediated_ access to the platform using the native development language for each: Swift on iOS and Kotlin on Android. This results in the smallest app size possible, the most efficient performance, and the absolute best user experience possible, while still enabling the development of your app from a single codebase.

As always, _Happy Skipping_!

[^keychainservices]: Keychain services: "Securely store small chunks of data on behalf of the user." — [https://developer.apple.com/documentation/security/keychain-services](https://developer.apple.com/documentation/security/keychain-services)
[^fuselite]: For more on the distinction between transpiled Skip Lite and compiled Skip Fuse apps, see [Skip Fuse vs. Lite](/docs/status/).





