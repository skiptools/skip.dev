---
title: FAQs
menutitle: FAQ
permalink: /docs/faq/
---

## General FAQs

### What is Skip? {#what_is_skip}

Skip is an Xcode plugin that builds your Swift and SwiftUI for Android. The Skip build process enables you to continuously iterate on both your iOS and Android app with a single unified codebase, while mixing in as much or as little platform-specific code as you like. To learn more, start with the [documentation](/docs/).

### How does Skip compare to other frameworks like Flutter, React Native, Xamarin, and Cordova? {#flutter}

Skip is focused on genuinely native app development exclusively for the two dominant mobile platforms – iOS and Android. A comparison table between the various frameworks can be found on the [Skip Comparison Matrix](/compare).

### What is Swift? {#swift}

Swift is the officially-recommended language for app development for iOS devices, including the iPhone and iPad. Swift integrates seamlessly with Objective-C, the legacy language for iOS development. For information on Swift, see [https://developer.apple.com/swift/](https://developer.apple.com/swift/).

### What is SwiftUI? {#swiftui}

According to [developer.apple.com](https://developer.apple.com/ios/planning/#build-the-data-structures-youll-use-in-your-app), SwiftUI “offers a modern, platform-agnostic approach to building your UI and app infrastructure. With SwiftUI, you specify your interface programmatically and let the system display and update that interface dynamically”. Since debuting in 2019, SwiftUI can already be used to build apps for the iPhone, iPad, tvOS, watchOS, visionOS, and other operating systems, and has become the recommended way to create new apps for the iPhone and iPad. Skip brings SwiftUI to the Android platform through the SkipStone plugin and the [SkipUI compatibility framework](#skipstack).

### What is Kotlin? {#kotlin}

Kotlin is the officially-recommended language for app development for Android devices. Kotlin integrates seamlessly with Java, the legacy language for Android development. For information on Kotlin and Android, see [https://developer.android.com/kotlin/](https://developer.android.com/kotlin/).

### What is Jetpack Compose? {#compose}

According to [developer.android.com](https://developer.android.com/jetpack/compose): “Jetpack Compose is Android’s recommended modern toolkit for building native UI.” Jetpack Compose, which debuted in 2019, presents a declarative Kotlin API for platform-agnostic user interfaces.

### What are "Native" and "Transpiled" modes? {#modes}

Skip supports both *compiling* Swift natively for Android, and *transpiling* Swift into Kotlin. Read about Skip's modes in the [documentation](/docs/modes/).

### What is a "Transpiler"? {#transpiler}

Transpilation is defined as the conversion between programming languages that operate at approximately the same level of abstraction. The SkipStone plugin has both native and transpiled modes, but even native-mode apps require some Kotlin code generation to interface with the Android system. In additional to generating  Kotlin and Compose, the SkipStone plugin transpiles your app's Swift Package Manager project into a buildable Gradle project and transpiles your iOS app's metadata into Android metadata. This is all done automatically by Xcode, the result being that you can build, test, and run your Swift app, and the transpiled equivalent app will also be built, tested, and run side-by-side.

### Do I need to know Kotlin to develop with Skip? {#kotlin_experience}

Skip provides [several mechanisms](/docs/platformcustomization/) to integrate with Kotlin, but you do not need to know any Kotlin in order to build an app with Skip. You will likely learn some Kotlin as you develop with Skip, however - particularly when integrating Android-specific features.

### What are the system requirements for using Skip? {#sysreq}

macOS 13 (ARM or Intel) with the latest Xcode, Android Studio "Koala" (2024.1.1), and Homebrew installed. Additional software is required to build and test projects for Android. See Skip's [installation instructions](/docs/gettingstarted).

### Can Skip run on Linux or Windows? {#linux}

Skip is implemented as a Swift Package Manager plugin, and so is only available on platforms where SwiftPM plugins are supported. Currently SwiftPM plugins are only supported on macOS.

### Which parts of Skip are free and which parts are commercial? {#free_commercial}

Earlier, Skip would require a license key for non-commercial app development. No longer: Skip is now completely free and open-source, but please do consider [supporting](/sponsor/) the project.

### Which FOSS license is recommended for framework development? {#foss_license_recommendations}

We generally recommend the LGPL, which provides a good balance of flexibility and freedom. LGPL libraries can be embedded in closed-source commercial applications. Many popular software components like WebKit, JavaScriptCore, and Qt are distributed under the LGPL.

### Can Skip Apps be distributed on the Apple App Store and the Google Play Store? {#appstore}

Yes. Applications built with Skip utilize the user interface toolkits recommended by the platform vendors themselves, and thereby follow the guidelines and principles that are unique to each of these two individual platforms. On the iOS side, the [Skip Core Framrwork](#skipstack) modules can be eliminated from the build (with [SkipZero](#skipzero)), resulting in an app submission that contains no trace of any Skip libraries whatsoever.

One example of an app that is distributed on the Apple App Store and the Google Play Store is the [Skip Showcase](/docs/samples/skipapp-showcase/) app.

### What does it mean it be Genuinely Native? {#genuinely_native}

Skip apps are genuinely native, in that they use the vendor-recommended UI toolkits directly, thereby guaranteeing maximum compatibility, accessibility, and performance. They use SwiftUI directly on the iPhone (“<i>SwiftUI is the preferred app-builder technology, because it offers a modern, platform-agnostic approach to building your UI and app infrastructure.</i>” – [developer.apple.com](https://developer.apple.com/ios/planning/#build-the-data-structures-youll-use-in-your-app)) and Compose on Android (“<i>We recommend using Jetpack Compose if you’re looking to build a new app</i>” – [android-developers.googleblog.com](https://android-developers.googleblog.com/2023/02/hundreds-of-thousands-of-developers-are-learning-jetpack-compose.html)).

### What is Skip Zero? {#skipzero}

When a Skip app relies only on the [Skip Core Frameworks](#skipstack) modules (SkipUnit, SkipLib, SkipFoundation, SkipModel, and SkipUI), these libraries can be completely excluded from the app build. This means that you can ship a Skip app for Android and iOS, and there will be no vestige of Skip on the iOS side at all. One benefit, among many others, is that your app distribution can be minuscule (e.g., the <a href="https://github.com/skiptools/skipapp-hello/releases">HelloSkip.ipa</a> sample is under 25KB). This also makes Skip easily "ejectable" from your iOS project, in that you can drop the Skip tools at any time and continue to have a fully-functional iOS project.

### Is Skip a cloud-based service? Do you upload my code to your servers? {#cloud}

No, and no. The Skip build plugin runs locally on your macOS machine as part of the Xcode build process. The plugin is secured using the standard Xcode plugin sandboxing mechanisms that block network and file system access. Neither your Swift nor any generated code ever leave your machine. The only network requirements are for resolving any external dependencies your project has, either on the SwiftPM side for Swift dependencies, or on the Gradle side for Kotlin dependencies.

### How is Skip distributed? {#distribution}

The SkipStone build plugin is distributed as a binary executable artifact and driven by the Skip plugin hosted at [https://source.skip.tools/skip.git](https://source.skip.tools/skip.git). In addition, the `skip` command-line tool must be installed using the [Homebrew](https://brew.sh) command: `brew install skiptools/skip/skip`. This will install the `skip` utility that can be used to create projects and run tests, as well as the prerequisites for being able to perform local Android testing: `gradle`, `openjdk`, `android-platform-tools`, and `android-commandlinetools`.

### Do Skip or any of the Skip frameworks collect data for the purposes of user tracking? {#tracking}

The Skip plugin does not collect any data, perform any telemetry, or otherwise "phone home" unless explicitly requested (e.g., running the <code>skip upgrade</code> command to check for the latest version of Skip). The Skip frameworks, which are all free and open-source (and which can thus be audited externally), also do not collect any telemetry or track users in any way. We provide this notice to help you fill out [Apple's App Privacy Details](https://developer.apple.com/app-store/app-privacy-details/) and comply with [Google's User Data](https://support.google.com/googleplay/android-developer/answer/10144311) policies.

Note that when installing `skip` using Homebrew, they may use telemetry to report the installation event. See the [Homebrew Analytics](https://docs.brew.sh/Analytics#what) documentation for their explanation and details on how it can be disabled.

### How does Skip compare to low-code or no-code app-building technologies? {#lowcode}

Skip is the opposite of no-code/low-code offerings. Skip embraces the dominant emerging UI paradigm of declarative user interfaces written in the same language as the platform-native components. This means Swift for SwiftUI, and Kotlin for Compose.

### Does Skip use Artificial Intelligence? {#ai}

No, Skip is a purely offline tool with predictable behavior.

However, AI tools can be very useful for generating Swift and SwiftUI code, especially for getting started with the outline of an iOS app. This code will generally be compatible with SkipUI and the other Skip libraries, which can be a great aid in getting a dual-platform app started quickly.

## Development FAQs

### What is the minimum iOS version for Skip apps? {#ios_version}

iOS 16+. It is estimated at [developer.apple.com](https://developer.apple.com/support/app-store/) that 96% of all devices introduced in the last four years use iOS 16 or higher, as measured by devices that transacted on the App Store as of February 4, 2024.

### What is the minimum Android version for Skip apps? {#android_version}

Skip targets Android API level 34 (which is the minimum allowed level for submitting new apps to the Play Store, according to [https://developer.android.com/google/play/requirements/target-sdk](https://developer.android.com/google/play/requirements/target-sdk)) with a minimum supported version of API level 29. Android API 29 ("Q"; Android 10.0) will run on approximately 90% of active Android devices as of May, 2025, according to [https://apilevels.com](https://apilevels.com).

### How large are apps that are built using Skip? {#app_size}

For iOS apps utilizing [SkipZero](#skipzero), the smallest `app.ipa` size is around 50KB. For Android apps, it is around 5MB. This difference is largely due to the fact that Android apps need to bundle the Jetpack Compose libraries with the app itself, whereas SwiftUI is included with iOS.

### Why is the first build of my app so slow? {#slow_build}

Skip libraries are distributed through SwiftPM as source code, which means that your first build includes building portions of Skip itself as well. Additionally, the first time you build the generated Gradle project in order to test and run on Android, the Gradle build system will need to download all of its dependency jars and build tools. This can lead to the initial build of an app downloading many dependencies. The Compose dependencies alone will add around 1GB to the size of the Gradle cache folder, as seen with `du -skh ~/.gradle`. But once you have downloaded and cached your project's dependencies, future builds shouldn't need to fetch them again.

### Does Skip need network access? {#network_access}

Skip itself is a locally-installed Xcode plugin and does not talk to the network, making it suitable for offline use. However, your app's dependencies will need to be resolved and cached for your app to be built, tested, or run. This means that if you add any new dependencies, either on the Swift side in the `Package.swift`, or on the Kotlin side in the `build.gradle.kts` (as configured through the module's `Skip/skip.yml` file), you will need to perform a build at least once for the dependencies to be resolved and downloaded.

### Does Skip support large codebases? {#large_codebase}

Skip leverages Swift Package Manager's support for dependencies between modules, in both local and external git repositories. Skip's plugin is run individually on each transitive dependency of your project, and the resulting Gradle projects will have these dependencies mirrored. This results in a highly modularizable system, where large codebases can be distributed across multiple modules, each with their individual documentation, test cases, and [continuous integration workflows](#ci).

### What is parity testing? {#parity_tests}

Skip encourages modularization of large codebases, each with their individual test targets. The command `skip test` can be run in a project that contains Skip tests, and both the Swift `XCTest` cases and the generated Kotlin `JUnit` cases will be run, after which the tool will output a markdown table summarizing each of the test results for each of the platforms.

### What are the Skip Core Frameworks? {#skipstack}

The Skip Core Framework modules (also knows as the "Skip Stack") are the core compatibility modules that transparently bridge from standard iOS frameworks into their equivalents for Kotlin, Java, and Android. They are implicitly imported in transpiled Skip Lite modules whenever their equivalent frameworks are imported.

* [SkipUnit](/docs/modules/skip-unit) bridges the [XCTest](https://developer.apple.com/documentation/xctest) framework to provide unit testing support through [JUnit 4](https://junit.org/junit4/). 
* [SkipLib](/docs/modules/skip-lib) bridges the [Swift Standard Library](https://developer.apple.com/documentation/swift/swift-standard-library) for conversion between low-level types and their [Kotlin equivalents](https://kotlinlang.org/api/latest/jvm/stdlib/). 
* [SkipFoundation](/docs/modules/skip-foundation) provides Java and Android equivalents for the [Foundation](https://developer.apple.com/documentation/foundation) framework
* [SkipModel](/docs/modules/skip-model) provides support for [Observation](https://developer.apple.com/documentation/observation/) through the [Compose Runtime](https://developer.android.com/jetpack/androidx/releases/compose-runtime) framework. 
* [SkipUI](/docs/modules/skip-ui) provides an implementation of [SwiftUI](https://developer.apple.com/documentation/swiftui) that bridges to Android's [Jetpack Compose UI](https://developer.android.com/jetpack/androidx/releases/compose-ui) components. 

The Skip Core Frameworks are the fundamental building blocks on which the rest of the [Skip ecosystem of libraries](/docs/modules/) is based.

### Can I preview the Kotlin that Skip's transpiled mode generates? {#playground}

We provide a “Playground” page at [https://skip.dev/playground/](/playground/) that runs a limited online version of the Skip transpiler in order to preview snippets of transpiled code. When using Skip for development, you can [access the transpiled Kotlin](/docs/debugging/#accessing-transpiled-output) it generates at any time.

### How much runtime overhead does SkipUI add to the Compose side of the app? {#overhead}

Very little. Many of SkipUI's views are very simple shims that bridge from their SwiftUI equivalents into Compose, such as [Divider.swift](https://source.skip.tools/skip-ui/blob/main/Sources/SkipUI/SkipUI/Components/Divider.swift) simply invoking `androidx.compose.material3.Divider`. To support `@Environment` and `@State`, Skip needs to perform some additional book-keeping that may have some runtime cost.

### Why does my Android app feel slow? {#slow_android_app}

There is often a significant difference between Debug and Release build performance on Android devices. Always use a Release build when evaluating real-world performance.

### What pure Swift libraries can be used by a Skip App? {#compat}

Skip uses Swift Package Manager to handle source code dependency resolution. The [Swift Package Index](https://swiftpackageindex.com/search?query=platform%3Aios%2Candroid) site tracks the thousands of Swift packages that compile for Android and are available to apps using Skip's native mode. If a dependent module has a `Skip/skip.yml` file and is **not** in native mode, it will be transpiled into Kotlin. You can also use native Swift dependencies from the Swift side of your app only (and seek alternative implementations through the use of `#if os(Android)` blocks or custom Kotlin files; for an example, see the <a href="https://source.skip.tools/skip-motion/blob/main/Sources/SkipMotion/SkipMotion.swift">LottieMotionView</a> implementation). Skip's constellation of [frameworks](/docs/modules/) are expected to provide most functionality that is commonly needed by modern apps, but you are free to develop your own libraries and frameworks, either from scratch, or by forking an existing repository to add Skip support for the library.

### How do I add dependencies to my Skip app? {#adddeps}

Swift dependencies are added by editing the `Package.swift` to add dependent packages to the `dependencies` array. Kotlin and Java dependencies are added by editing the `Skip/skip.yml` file for the module. See the [Dependencies documentation](/docs/dependencies) for details.

:::caution
The Xcode "Add Package Dependencies…" menu should *not* be used to add Swift dependencies, as it will not update the `Package.swift` file that Skip needs to build the dependencies for Android. Dependencies must be added directly to the `Package.swift` file.
:::


### How does logging work in Skip? {#logging}

Skip supports the `OSLog` module, so an app can log using a `Logger` instance, which will output log messages to the Xcode console for the iOS side of the app. For the Android side, log messages are passed to `android.util.Log` and can be viewed from the Logcat tab in Android Studio, or by running `adb logcat` from the terminal. Note that the `print()` function does not send any output to Logcat, so `OSLog.Logger` should be the preferred method of logging.

### How do resources work in Skip? {#resources}

The `SkipFoundation` framework implements the `Bundle.module` function for accessing resources stored in the standard SwiftPM location of `Sources/ModuleName/Resources/`. These resources are automatically bundled in the Gradle project, and will be embedded in the resulting `.apk` artifact. Note that unlike Foundation on Darwin platforms, the app archive is not expanded on disk for Android apps, but rather can only be accessed using a streaming interface. SkipFoundation handles this transparently for you, so you can load a resource with `try Data(contentsOfURL Bundle.module.url(forResource: "SomeResource", withExtension: "ext"))`. However, you cannot perform random access on a resources URL like you can on iOS. This means that embedded resources, such as a `.sqlite` database, would need to first be manually extracted to the app's storage folder before they can be accessed.

### How does localization work in Skip? {#localization}

Skip supports the standard [`Localizable.xcstrings`](https://developer.apple.com/documentation/Xcode/localizing-and-varying-text-with-a-string-catalog) translation source file. These files are automatically updated by Xcode 15 to contain any localization-aware string in your app. 

This allows you to have a single translation file that is used by both your iOS and Android app, so that your SwiftUI `Text("Hello!")` can be rendered as “Bonjour!” in French.

### How can I use a SQLite database in my Skip App? {#sqlite}

We have a [SkipSQL framework](/docs/modules/skip-sql/) which provides low-level access to the system-installed SQLite3 library on both iOS and Android.

### How can I use a Firebase database in my Skip App? {#firebase}

Skip has a [SkipFirebase framework](/docs/modules/skip-firebase/) module that provides integration with the official Firebase iOS and Android SDKs. Currently the Firestore integration is the most complete.

### Can I display Lottie animations in my app? {#lottie}

We have a [SkipMotion framework](/docs/modules/skip-motion/) framework and a [Lottie Demo app](/docs/samples/skipapp-lottiedemo/) available.

### How can I change the app name as displayed on the home screen? {#appname}

For the iOS side, you can edit the `Darwin/AppName.xcconfig` and set:

```
INFOPLIST_KEY_CFBundleDisplayName = App Name
```

And for the Android side, you can edit `Android/app/src/main/AndroidManifest.xml` and set the `android:label` attribute:

```xml
    <application android:label="App Name" …
```

### Does Skip transfer an app's metadata, icons, and entitlements on Android? {#metadata}

Skip currently only handles the generation of the required `AndroidMetadata.xml`, which is populated with the elements from your project's `Skip.env` file like `PRODUCT_NAME`, `BUNDLE_IDENTIFIER`, and `MARKETING_VERSION`. Other aspects of your Android app, such as icons, must be customized manually for the app, either using Android Studio, or manually in the Gradle project.

### How does Skip launch my app in the Android emulator? {#emulator}

Skip-enabled app projects have an `.xcodeproj` generated for them, which includes an embedded script that, as a side effect of running a build of the app target, will assemble and launch the app using the `gradle` command. The app will be launched against the first connected Android emulator or device that is found. To customize which emulator should be used, the `ANDROID_SERIAL` environment variable can be set to the identifier of the Android device, as seen with the terminal command `adb devices`.

### How can I launch the iOS app without also launching the Android app? {#launchios}

By default, whenever you run your iOS app from Xcode, Skip will also builds and run the Android app. However, you may sometimes want to run only the iOS side of the app for certain time periods, such as when debugging an iOS-specific issue. To do this, follow [these instructions](/docs/app-development/#ios-only) in the Building and Running documentation.

### How does Skip run my test cases? {#testcases}

Skip-enabled projects have an `XCSkipTests.swift` test case, which is generated as part of the `skip init` command (see [Getting Started](/docs/gettingstarted/). This test case will use the `SkipDrive` module to launch the `gradle test` command on the generated project. It will then interpret the test results and convert any failures back into XCTest failures, including mapping back the line numbers from the JUnit tests to the original Swift. This will result in a test failure showing up twice in Xcode: once for the Swift XCTest failure, and one for the Kotlin JUnit failure.

### How can I run unit tests against an Android Emulator or Device? {#testing}

By default, your translated XCTest cases are run as Kotlin JUnit 4 tests using the SkipUnit framework, and these tests are run in a local JVM using the Robolectric utilities to mock many Android APIs. If you have a connected Android Emulator or Simulator, you can get the identifier from the command `adb devices`, and then set the identifier in the environment variable `ANDROID_SERIAL`. This can be done from the command-line with `ANDROID_SERIAL=emulator-1234 skip test`. In Xcode you can set this variable in the Scheme's Run Arguments section, then toggle it on or off to switch between the (faster) Robolectric tests and the (higher-fidelity) Android tests.

### Can Skip frameworks be built and tested using continuous integration systems? {#ci}

Skip framework projects contain built-in support for running [parity tests](#parity_tests) for both the Swift and Kotlin sides of a project. These tests can be included in automated continuous integration workflows to ensure that the tests are always passing. We do this ourselves for the various Skip frameworks, such as the [SkipLib Actions](https://github.com/skiptools/skip-lib/actions), which references our standard [GitHub CI workflow](https://github.com/skiptools/skip-lib/blob/main/.github/workflows/ci.yml).

### Can Skip be used with Xcode Cloud{#xcode_cloud}

You should be able to install Skip for an Xcode Cloud build using Homebrew, as per the documentation at [https://developer.apple.com/documentation/xcode/making-dependencies-available-to-xcode-cloud#Use-a-custom-build-script-to-install-a-third-party-dependency-or-tool](https://developer.apple.com/documentation/xcode/making-dependencies-available-to-xcode-cloud#Use-a-custom-build-script-to-install-a-third-party-dependency-or-tool).

### Does Skip code use garbage collection? {#gc}

Swift does not use garbage collection, but Kotlin/Java does. Any Swift code that is transpiled into Kotlin will run in the same managed, garbage collected Android Runtime environment as every other Android app.

## Skip Lite FAQs

### Does Skip Lite's transpiled mode support Swift language feature ________? {#swiftlang}

Skip's transpiled Swift support is detailed in the [Transpilation Reference](/docs/swiftsupport).

### How does Skip Lite's transpiled mode handle ________ difference between Swift and Kotlin? {#swiftkotlindiff}

Many topics related to the differences between Swift and Kotlin are covered in the Transpilation Reference [topics](/docs/swiftsupport/#special-topics).

### How can I check whether my Android build is in debug or release mode? {#skip_lite_debugflag}

The traditional `#if DEBUG` check doesn't work on the Android side of your app with transpiled Skip Lite – it will always resolve to false. One simple way you can do this is add a top-level `isDebugBuild` variable that checks the Android `ApplicationInfo` for the debuggable flag, as so:

```swift
let isDebugBuild: Bool = {
    #if SKIP
    return (ProcessInfo.processInfo.androidContext.getApplicationInfo().flags & android.content.pm.ApplicationInfo.FLAG_DEBUGGABLE) != 0
    #elseif DEBUG
    return true
    #else
    return false
    #endif
}()
```

## Skip Fuse FAQs

### What is Skip Fuse? {#skip_fuse_what}

Skip Fuse enables the creation of apps and libraries for Android using compiled Swift rather than Swift that is transpiled to Kotlin.

### What are the advantages of using native Skip Fuse over transpiled Skip Lite? {#skip_fuse_advantages}

One limitation of Skip Lite's transpiled mode is that any package dependencies need to be "Skip aware" if they are to be used in the Android side of the app. This effectively locked away the massive Swift package ecosystem from being used across both platforms in a Skip app.

With Skip Fuse's ability to use natively compiled Swift, any package that compiles for Android can be used in your Skip app, which greatly increases the catalog of libraries that can be depended on.

### What are the disadvantages of using native Skip Fuse versus transpiled Skip Lite? {#skip_fuse_disadvantages}

For the end user, the experience of using a Skip Fuse app should be the same as using a Skip Lite app, in that they both present a genuinely native user interface using Jetpack Compose. One downside is that Skip Fuse apps are larger than Skip Lite apps because they need to include the native Swift libraries and all their dependencies as libraries in the .apk.

For developers, developing Skip Fuse apps can exhibit slower build times due to needed to compile all the Swift a second time for Android. Also, debugging tools are currently limited when working with native Swift. 

### What is the status of Skip Fuse? {#skip_fuse_status}

Skip Fuse is stable and used in productions apps, but it is not as mature as the transpilation mode used by Skip Lite.

### What is the minimum Swift version for Skip Fuse apps? {#skip_fuse_min_version}

Skip Fuse requires Swift 6 or higher.

### How can I check system prerequisites for building with native Skip Fuse? {#skip_fuse_prerequisites}

Running `skip checkup --native` will perform a full system analysis as well as create and build a small Skip Fuse app to ensure that it is working on your system.

### What core iOS frameworks will work with Skip Fuse? {#skip_fuse_ios_frameworks}

Foundation, Dispatch, Observation, and the Swift standard library come "for free" as part of the Swift Android SDK. In addition, SwiftUI is supported via SkipFuseUI for building the user interface of your app.

Other frameworks native to Apple devices like Combine, CoreGraphics, and CoreAnimation, as well as the many iOS-specific "Kit" frameworks (StoreKit, PhotoKit, HealthKit, etc.) are not available, and alternative solutions would need to be found for the Android side of your app.

Some libraries have Skip-specific bridging implementations, like [SkipAV](/docs/modules/skip-av) for AVKit and [SkipWeb](/docs/modules/skip-web) for WebKit. And other frameworks have popular open-source equivalents, like [OpenCombine](https://github.com/OpenCombine/OpenCombine) for the Combine framework.

### What third-party dependencies will work with Skip Fuse? {#skip_fuse_third_party_deps}

Some packages that rely solely on built-in frameworks like Foundation and the Swift standard library will work "out of the box" with Skip Fuse. For other packages, it is up to the maintainer to add support for Android to their Swift package. In some cases, this can be a trivial matter, and in other cases — especially when the package interacts with low-level operating-system specific nuances — it can be more challenging.

The [Bringing Swift Packages to Android](/blog/android-native-swift-packages/) post provides more information and some helpful suggestions for package authors who want to ensure their code can be used on Android.

### Is there a list of third-party packages with will work with Skip Fuse? {#skip_fuse_third_party_deps_list}

While not comprehensive, the [Swift Package Index](https://swiftpackageindex.com/search?query=platform%3Aios%2Candroid) site lists Swift packages that are known to compile successfully for Android. It can be used as a quick reference to see if your favorite packages might be usable with Skip Fuse.

### Can I use binary dependencies with Skip Fuse? {#skip_fuse_binary_deps}

The Swift Package Manager only supports binary dependencies for Darwin (e.g., macOS, iOS) platforms. So at this time, Skip Fuse only supports source dependencies and cannot be used with packages that have binary dependencies.

### Will Skip Fuse native apps completely replace Skip Lite transpiled apps? {#skip_fuse_replace_skip_lite}

No. Skip Lite's transpilation layer is used by Skip Fuse compiled apps when it needs to bridge from Swift to Kotlin (and back). This includes the SkipFuseUI compatibility framework for SwiftUI, which is built on top of the transpiled SkipUI module. Transpilation remains a fundamental part of the Skip architecture and is not going away.

### What is the SkipFuse module, and when do I need to import it? {#skip_fuse_module}

[SkipFuse](/docs/modules/skip-fuse/) is the module that handles many of the nuances of adapting your iOS idioms to Android. It handles various miscellaneous features like bridging the OSLog `Logger` class to an implementation to uses Android `adb logcat` system.

Importing the SkipFuse module is also requires when your code uses an `@Observable` because it handles the additional communication that is needed to update any Jetpack Compose components that are tracking the state.

### How can I unit test Skip Fuse code? {#skip_fuse_unit_test}

For native packages, you can run `skip android test` to run the `XCTest` or Swift `Testing` test cases on the connected Android 

:::caution
Note that running `skip test` currently does *not* execute your native Android tests. It only runs your transpiled test cases.
:::

### How can I debug a Skip Fuse app? {#skip_fuse_debugging}

Debugging support is currently quite limited in SkipFuse apps. Along with using `Logger` messages (which show up in `adb logcat`), any native crashes will be logged to logcat. Swift symbols will be mangled in crash reports, but they can be processed through the `swift demangle` command to get a more scrutable name. For example:

```
$ swift demangle

__TMaC17find_the_treasure15YD_Secret_Class

_type metadata accessor for find_the_treasure.YD_Secret_Class
```

Interactive debugging with breakpoints and support for stepping is something under active investigation at this time.

### How can I build my Skip Fuse app in release mode? {#skip_fuse_release_mode}

In Xcode, selecting the "Release" option for the build type in the scheme selector for your target will cause the Android app to be built in release mode. Note that for Android apps, you will need to set up a signing key when running in release mode. Running in release mode is especially important for performance testing, since it can have a dramatic effect on Android.

### How can I export my Skip Fuse app for distribution? {#skip_fuse_export}

The `skip export` command will create your app's .apk, including performing the native compilation and embedding of the shared object files.

### What Android architectures does Skip Fuse support? {#skip_fuse_android_arch}

By default, Skip Fuse will build for the `aarch64` and `x86_64`, which covers the vast majority of deployed Android architectures. Newer architectures like `riscv` will be added in the future if they achieve full support in Android.

### Are Skip Fuse apps larger than Skip Lite apps? {#skip_fuse_app_size}

Skip Fuse apps need to embed not only your natively-compiled libraries, but also all the Swift dependencies like `libFoundation.so` and `libSwift.so`. For this reason, Skip Fuse apps can be considerably larger than a transpiled Skip Lite app, which does not need to include any native libraries.

:::note
Note that the .apk size by itself is not a good indication for how large the app's download will be for end users, since the app marketplace (such as the Google Play Store) will perform additional optimization like removing unused architectures from the artifact before delivering it to the user. Android Studio's "Profile of Debug APK" feature will provide an estimate for the total download size of an app that is created with `skip export`.
:::

### Does Skip support 16kb page sizes? {#skip_fuse_16kb_page_size}

Yes, the Swift SDK for Android builds 16KB-aligned libraries by default as of Swift 6.2. This makes Skip Fuse apps compatible with Android's [requirement](https://developer.android.com/guide/practices/page-sizes) for native librarie as of November 1, 2025.

