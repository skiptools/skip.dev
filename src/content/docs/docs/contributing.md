---
title: Contributing
permalink: /docs/contributing/
---

Skip welcomes community contributions in all forms. There are many ways to contribute:

- Help improve the docs. Every documentation page contains an "Edit page" link at the bottom which takes you to the [https://github.com/skiptools/skipdev/](https://github.com/skiptools/skipdev/) documentation site where you can fork a page, make improvements, and submit it as a pull reqiest.
- Contribute to the [Skip Core Frameworks](/docs/modules/), Skip's open source re-implementations of fundamental Swift frameworks like Foundation for [Skip Lite](/docs/status/#skip_fuse). Each library's README includes background information such as its current status, any important implementation strategies employed, etc. Please review the README before contributing. When you are ready to submit an update, create a standard GitHub [pull request](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request). Skip's development team will attempt to address PRs as quickly as possible.
- Contribute to [SkipUI](/docs/modules/skip-ui/) and [SkipFuseUI](/docs/modules/skip-fuse-ui/) to help expand and improve SwiftUI support on Android. As with other Skip modules, please review the README, and submit a standard GitHub [pull request](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request).
- Submit pull requests to third-party Swift libraries so that they can build for Android and show up as Android compatible on the [Swift Package Index](https://swiftpackageindex.com/search?query=platform%3Aios%2Candroid). See the [porting guide](/docs/porting/) for helpful tips.

:::tip
Remember that you are not required to contribute updates you make. You can build and deploy apps using local modifications to any of the Skip Core Frameworks or Integration Frameworks. But we sincerely hope that you will: your improvements to the Swift ecosystem and to Skip's open source libraries will benefit all Swift-for-Android developers, and by extension all users of Swift-on-Android apps.
:::

## Local Skip Libraries {#local-libraries}

If you'd like to make local changes to Skip's libraries while working on an app - or to work on [SkipUI](/docs/modules/skip-ui/) or [SkipFuseUI](/docs/modules/skip-fuse-ui/) and exercise your changes with its [ShowcaseFuse app](/docs/samples/skipapp-showcase-fuse/) - you will want to configure Xcode to use local library versions rather than the current Skip distributions. This is easily accomplished with an Xcode Workspace.

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

### Working in Android Studio

Launching your app from Android Studio will **not** use your Workspace's local libraries by default. If you'd like to work in Android Studio, edit your app's `Android/settings.gradle.kts` file to point Android Studio at Xcode's build, as described in [Cross-Platform Topics](/docs/platformcustomization/#android-studio-setup).

:::tip
If Android Studio appears to be stuck on the official library releases rather than your local versions, use its `File → Sync Project with Gradle Files` command to force Android Studio to re-evaluate `settings.gradle.kts`.
:::

---

## Community Libraries {#community-libraries}

The [Swift Package Index](https://swiftpackageindex.com/search?query=platform%3Aios%2Candroid) tracks thousands of Swift packages that compile natively for Android. Submit your own Linux and Android-supporting packages to the Swift Package Index to automatically include and document them.

Skip users can utilize [transpiled packages](/docs/modes/#transpiled) in addition to native ones. Transpiled packages are useful both to full Skip Lite apps, and - when [bridging](/docs/modes/#bridging) is applied - to Skip Fuse apps that want to interface with Kotlin libraries. If you've created a [transpiled library](/docs/dependencies/#implementation) that you think might be useful to other Skip users, please consider opening it up to the Skip community.

## Tips

If you're working on a [transpiled library](/docs/modes/#transpiled) that involves heavy use of Kotlin API, you might find it faster to open your module in Android Studio and iterate there *even if you want the final code to be in Swift*. The idea is to prototype in Android Studio using Kotlin, then back-port the solution to your Swift codebase. We have found this particularly useful when implementing SwiftUI features on top of Compose. Android Studio provides robust autocompletion, inline documentation, and automatic `imports` of the myriad of Compose packages. It is also extremely fast to build and run, which helps a lot when you're experimenting. Our general strategy when implementing a major [SkipUI module](/docs/modules/skip-ui/) feature is:

1. Make sure you're set up for [local library development](#local-libraries). Don't forget to point Android Studio at your local libraries.
1. Stub out the feature in Swift and Xcode.
1. Build your app (in the case of SkipUI work, we use the [Showcase app](/docs/samples/skipapp-showcase)) so that your Swift stubs are transpiled.
1. [Open the app](/docs/platformcustomization/#android-studio) in Android Studio.
1. Iterate on the implementation in Android Studio using pure Kotlin/Compose. Yes, this involves editing the transpiled file containing your stubs, and you may even have to override the file's read-only flag to do so. **Take care not to run an Xcode build** during this phase, because it will overwrite the file with its own transpilation. 
1. Once you have settled on your Android implementation, use it to fill in your Swift stubs. You can do this by separating it into an included [Kotlin file](/docs/platformcustomization/#kotlin-files) whose API you call from Swift, or by back-porting the Kotlin you wrote into inline Swift.

Again, we only recommend this process when your implementation is going to require heavy use of Kotlin API and a healthy amount of iteration and experimentation. In that case, the speed of using Android's native IDE to figure out what works more than makes up for the extra few minutes it takes to clean up the final solution.

