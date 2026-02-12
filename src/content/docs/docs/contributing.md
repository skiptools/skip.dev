---
title: Contributing
permalink: /docs/contributing/
---

Skip welcomes community contributions in all forms. There are many ways to contribute:

- Help improve the docs. Every documentation page contains an "Edit page" link at the bottom which takes you to the [github.com/skiptools/skip.dev/](https://github.com/skiptools/skip.dev/) documentation site where you can fork a page, make improvements, and submit it as a pull request.
- Improve the Skip [Core Frameworks](/docs/modules/), Skip's open source re-implementations of fundamental Swift frameworks like Foundation for [Skip Lite](/docs/modes/#lite). Each library's README includes background information such as its current status, any important implementation strategies employed, etc. Please review the README before contributing. When you are ready to submit an update, create a standard GitHub [pull request](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request). Skip's development team will attempt to address PRs as quickly as possible.
- Contribute to [SkipUI](/docs/modules/skip-ui/) and [SkipFuseUI](/docs/modules/skip-fuse-ui/) to help expand and improve SwiftUI support on Android. As with other Skip modules, please review the README, and submit a standard pull request. `SkipFuse` and `SkipFuseUI` libraries have [special considerations](#skipui-and-skipfuseui) for contribution.
- Submit pull requests to third-party Swift libraries so that they can build for Android and show up as Android compatible on the [Swift Package Index](https://swiftpackageindex.com/search?query=platform%3Aios%2Candroid). See the [porting guide](/docs/porting/) for helpful tips.

## Local Skip Libraries {#local-libraries}

If you'd like to make local changes to Skip's libraries while working on an app - such as by improving [SkipUI](/docs/modules/skip-ui/) or [SkipFuseUI](/docs/modules/skip-fuse-ui/) and exercising your changes with its [ShowcaseFuse app](/docs/samples/skipapp-showcase-fuse/) - you will want to configure Xcode to use local library versions rather than the current Skip distributions. This is easily accomplished with an Xcode Workspace.

1. Clone the [repositories](https://github.com/skiptools) you'd like to work on. We find it most convenient to make the clone directory a peer of your app directory.

    ```console
    > ls
    hello-skip/ skip-ui/ skip-fuse-ui/
    ```

1. Use Xcode to create a new Workspace in the same directory.
1. Add your app's `.xcodeproj` file to the Workspace.
1. Add your local module directories to the Workspace. Adding these local packages will override the distributions specified in `Package.swift`, so that changes to the local packages will get used in your app build.
1. Use the Workspace to iterate on your app and the libraries in tandem.

You are now set up to work on Skip libraries! This is a great way to fix any issues or add any missing functionality that is affecting your app, while potentially helping the entire Skip community.

:::tip
You can build and deploy apps using local modifications to any of the Skip Core Frameworks or Integration Frameworks. Contributing these improvements to the Swift ecosystem and to Skip's open source libraries will benefit all Swift-for-Android developers, and by extension all users of Swift-on-Android apps.
:::

### Working in Android Studio

Launching your app from Android Studio will **not** use your Workspace's local libraries by default. If you'd like to work in Android Studio, edit your app's `Android/settings.gradle.kts` file to point Android Studio at Xcode's build, as described in [Cross-Platform Topics](/docs/platformcustomization/#android-studio-setup).

:::tip
If Android Studio appears to be stuck on the official library releases rather than your local versions, use its `File → Sync Project with Gradle Files` command to force Android Studio to re-evaluate `settings.gradle.kts`.
:::

### Android Studio Tips

If you're working on a [transpiled library](/docs/modes/#lite) that involves heavy use of Kotlin API, you might find it faster to open your module in Android Studio and iterate there *even if you want the final code to be in Swift*. The idea is to prototype in Android Studio using Kotlin, then back-port the solution to your Swift codebase. We have found this particularly useful when implementing SwiftUI features on top of Compose. Android Studio provides robust autocompletion, inline documentation, and automatic `imports` of the myriad of Compose packages. It is also extremely fast to build and run, which helps a lot when you're experimenting. Our general strategy when implementing a major [SkipUI module](/docs/modules/skip-ui/) feature is:

1. Make sure you're set up for [local library development](#local-libraries). Don't forget to point Android Studio at your local libraries.
1. Stub out the feature in Swift and Xcode.
1. Build your app (in the case of SkipUI work, we use the [Showcase app](/docs/samples/skipapp-showcase/)) so that your Swift stubs are transpiled.
1. [Open the app](/docs/platformcustomization/#android-studio) in Android Studio.
1. Iterate on the implementation in Android Studio using pure Kotlin/Compose. Yes, this involves editing the transpiled file containing your stubs, and you may even have to override the file's read-only flag to do so. **Take care not to run an Xcode build** during this phase, because it will overwrite the file with its own transpilation. 
1. Once you have settled on your Android implementation, use it to fill in your Swift stubs. You can do this by separating it into an included [Kotlin file](/docs/platformcustomization/#kotlin-files) whose API you call from Swift, or by back-porting the Kotlin you wrote into inline Swift.

Again, we only recommend this process when your implementation is going to require heavy use of Kotlin API and a healthy amount of iteration and experimentation. In that case, the speed of using Android's native IDE to figure out what works more than makes up for the extra few minutes it takes to clean up the final solution.

## SkipUI and SkipFuseUI

Most contributions to the libraries, whether they are [Core Frameworks](/docs/modules/) or [Integration Frameworks](#integration-frameworks), will be isolated to submitting pull requests for a single package and repository. SkipUI, however, is different: due to the complexity of the SwiftUI implementation, Skip's support for it is split across two separate repositories:

1. [SkipUI](/docs/modules/skip-ui/) for the transpiled Skip Lite mapping of the SwiftUI concepts to their Jetpack Compose equivalents
2. [SkipFuseUI](/docs/modules/skip-fuse-ui/) for the additional accommodations that are needed to use `SKipUI` in a native Skip Fuse app.

Some improvements to `SkipUI`, such as fixing bugs with Compose implementations, can be done in just the [`skip-ui`](https://github.com/skiptools/skip-ui) repository. But if the improvement involves additional API that is being made available or any other changes to the `SwiftUI` surface, and PRs will need to be paired with a PR against the [`skip-fuse-ui`](https://github.com/skiptools/skip-fuse-ui) repository.

In addition, when adding new features or otherwise changing behavior, it is always good to test it out in the Showcase apps, both the [`skipapp-showcase`](https://github.com/skiptools/skipapp-showcase) Skip Lite app and the equivalent [`skipapp-showcase-fuse`](https://github.com/skiptools/skipapp-showcase-fuse) app. This both serves as a way to test out your new feature, ensure that it doesn't break anything else, and provide a demonstration for other developers of how your improvement works.

So a sample workflow making a contribution would look like this:

1. Fork SkipUI: [https://github.com/skiptools/skip-ui/fork](https://github.com/skiptools/skip-ui/fork)
2. Fork SkipFuseUI: [https://github.com/skiptools/skip-fuse-ui/fork](https://github.com/skiptools/skip-fuse-ui/fork)
3. Fork Showcase Lite: [https://github.com/skiptools/skipapp-showcase/fork](https://github.com/skiptools/skipapp-showcase/fork)
4. Fork Showcase Fuse: [https://github.com/skiptools/skipapp-showcase-fuse/fork](https://github.com/skiptools/skipapp-showcase-fuse/fork)
5. Clone each of the forked repositories to a local folder
6. Create an Xcode workspace that incorporates both the `skip-ui` and `skip-fuse-ui` packages as well as the `skipapp-showcase/Darwin/Showcase.xcodeproj` and `skipapp-showcase-fuse/Darwin/ShowcaseFuse.xcodeproj` projects
7. Run each of the `ShowcaseLite App` and `ShowcaseFuse App` targets to ensure they work
8. Start implementing changes to `SkipUI`, testing them out by launching the `ShowcaseLite App` target
9. When you are happy with the changes, begin implementing the equivalent functionality in the `SkipFuseUI` module, and test those out by launching the `ShowcaseFuse App` target
10. When everything is working, push your changes to your local forks and submit 4 separate PRs to each of the upstream repositories.

:::note
If the PRs involve changing the API surface (including removing `@unavailable` annotations), then the CI will likely fail on everything except the `SkipUI` changes due to the fact that the other packages are only built against the most recent release tags of `SkipUI` rather than the `main` branch. That's OK: when the PRs are reviewed, they will all be reviewed together and once merged and included in a new release, the CI will become green again.
:::

## Integration Frameworks

Integration frameworks are the lifeblood of Skip: they are the optional modules that provide a single API to equivalent functionality on Android and Darwin platforms alike. A subset of the existing integration frameworks is available at the [modules index](/docs/modules/), but many more exist under the [Skip GitHub organization repositories](https://github.com/orgs/skiptools/repositories). Many of these frameworks have been contributed by users over the years.

There are two different strategies for implementing integration frameworks: "Pass-through" and "Bespoke".

### Pass-through API

When the goal is to mimic a pre-existing Darwin (iOS or macOS) API surface on Android, the Android API can be crafted to match the Darwin API.

Some examples of pass-through APIs are:

- [SkipAV](/docs/modules/skip-av/): provides an Android equivalent of a subset of the Darwin [AVKit](https://developer.apple.com/documentation/avkit) and [AVFoundation](https://developer.apple.com/documentation/avfoundation) frameworks, backed by [Jetpack Media3](https://developer.android.com/media/media3) libraries.
- [SkipBluetooth](/docs/modules/skip-bluetooth/): mimics Darwin's built-in [CoreBluetooth](https://developer.apple.com/documentation/corebluetooth) framework using Android's built-in [Bluetooth](https://developer.android.com/develop/connectivity/bluetooth) libraries.
- [SkipScript](/docs/modules/skip-script/): mimics Darwin's [JavaScriptCore](https://developer.apple.com/documentation/javascriptcore) framework on Android, based on a third-party [JSC build](https://github.com/react-native-community/jsc-android-buildscripts).
- [SkipFirebase](/docs/modules/skip-firebase/): Provides API parity between the Firebase's [Darwin](https://firebase.google.com/docs/ios/learn-more) and [Android](https://firebase.google.com/docs/android/learn-more) APIs.

The pass-through strategy has these advantages:

1. The API is already designed for you. You just need to "fill in the blanks" for Android for the subset of functionality that you want to expose.
1. When mimicking a pre-existing Darwin API surface, often you _only_ need to implement the Android side (typically within an `#if SKIP` block). The iOS/macOS API will be used as-is, and your Android implementation just needs to be crafted to work the same as the Darwin side.

### Bespoke API

Unlike the pass-through strategy, a bespoke API is a whole new API surface that adapts separately to underlying Darwin and Android APIs.

Some examples of bespoke APIs are:

- [SkipDevice](/docs/modules/skip-device/): Integration with device sensors such as Location, Network Reachability, and Accelerometer.
- [SkipKeychain](/docs/modules/skip-keychain/): Abstraction of Darwin [Keychain Services](https://developer.apple.com/documentation/security/keychain-services) and Android [Keystore](https://developer.android.com/privacy-and-security/keystore).
- [SkipMarketplace](/docs/modules/skip-marketplace/): Utilities around app purchases, updates and reviews.

Some advantages of the bespoke API strategy are:

1. While a pass-through API will constrain the design to an (oftentimes legacy) pre-existing Darwin API, designing a custom API to abstract functionality on Darwin and Android platforms enables using modern conventions such as `async`/`await` and `AsyncStream`.
1. A custom API can build just the subset of supported API, rather than having to provide shims for unsupported parts of an API on Android that throw errors indicating that they are unsupported.
1. A bespoke API can cut across multiple independent dependencies rather than being narrowly restricted to just the framework that it is designed to mimic.

### Implementation Tips

Regardless of whether an integration framework is pass-through or bespoke, there are some useful strategies to designing and implementing them.

1. **Minimize Novelty**: An integration framework is usually intended to provide an abstraction between equivalent functionality or features on Android and Darwin. It is generally recommended that implementations be as minimal as possible, and delegate the important logic to the underlying implementation, which might either be a built-in feature of the platform or an external library dependency.
1. **Seek Prior Art**: Many common integration needs have been already implemented in other cross-platform development tools. Searching on Flutter's [pub.dev](https://pub.dev/) or React Native's [expo.dev](https://docs.expo.dev/versions/latest/) can lead to existing free and open-source implementations of the necessary Swift (or Objective-C) and Kotlin (or Java) that demonstrates how the integration might be accomplished. These can either be adapted for Skip, or serve as inspiration for how a new API might be designed and implemented.


### Contribution Process for Integration Frameworks

There is no obligation to contribute your framework to the Skip organization, but doing so helps the community and opens up the framework to being documented on the skip.dev modules page and helps encourage community contributions and ongoing maintenance.

To suggest a new idea for an integration framework, post a message on the [ideas forum](https://github.com/orgs/skiptools/discussions/categories/ideas) with a description of the new features and functionality it will enable. Typically, we will then create a new Skip repository with a blank Skip project, which you can then fork, iterate on, and then improve by submitting a pull request.

## Native Android Libraries {#community-libraries}

Skip Fuse apps can utilize pure Swift libraries with them needing the be "Skip aware". This necessitates that the package will build for Android as well as Darwin platforms.

:::caution
Native Android libraries will _not_ work in Skip Lite (transpiled) apps.
:::

The [Swift Package Index](https://swiftpackageindex.com/search?query=platform%3Aios%2Candroid) tracks thousands of Swift packages that compile natively for Android. Submit your own Linux and Android-supporting packages to the Swift Package Index to automatically include and document them.

Skip users can utilize [transpiled packages](/docs/modes/#lite) in addition to native ones. Transpiled packages are useful both to full Skip Lite apps, and - when [bridging](/docs/modes/#bridging) is applied - to Skip Fuse apps that want to interface with Kotlin libraries. If you've created a [transpiled library](/docs/dependencies/#implementation) that you think might be useful to other Skip users, please consider opening it up to the Skip community.

