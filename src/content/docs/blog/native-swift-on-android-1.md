---
title:  "Native Swift on Android, Part 1: Setup, Compiling, Running, and Testing"
date: 2024-09-11
tags: [swift, android, toolchain, native, cross-platform, xctest, mobile-development, sdk, testing, command-line]
layout: post
permalink: /blog/native-swift-on-android-1/
author: Marc Prud'hommeaux
---

You may already be familiar with [Skip](/) as a tool for bringing your Swift iOS apps to Android. Skip takes a novel *transpilation* approach, where we integrate with the Xcode build system to convert your Swift code into [Kotlin](https://kotlinlang.org). This allows us to create an Android library for every build of your Swift package, or to launch an Android version of your SwiftUI app on every Xcode `Run`.

We've [discussed the advantages](/blog/bringing-swift-to-android/) of a transpilation-based strategy in the past. But despite the fact that Android is a Java/Kotlin-oriented platform, there are also significant benefits to compiled code. Skip has featured support for integrating with [C code](/blog/sharing-c-between-swift-and-kotlin/) on both Android and iOS for a long time. It only makes sense that our *transpiled* Swift code should also integrate with *compiled* Swift code.

![Swift Android Logo](/assets/images/Swift-Android.svg)
{: style="text-align: center; width: 200px; margin: auto;"}

And so we are excited to announce the first technology preview of a **native Swift toolchain and driver for Android**! This toolset enables developers to build and run Swift executables and test cases on a connected Android device or emulator.

## Getting Started

On a macOS development machine with 
[Xcode](https://developer.apple.com/xcode/) and 
[Homebrew](https://brew.sh) installed,
you can install the Swift 6.0 Android toolchain by opening a terminal and running:

```
brew install skiptools/skip/swift-android-toolchain@6.0
```

This will download the Swift Android SDK, along with all the dependencies it
needs to build, run, and test Swift packages on Android.

If you're an existing Skip user, make sure to also update your `skip` copy to version 1.1.1+:

```
skip upgrade
```

### Android Emulator Setup 

Unless you have an Android device handy,
you will need to install the Android emulator in order to run executables and test cases
in a simulated Android environment. The simplest way to do this is to download
and install [Android Studio](https://developer.android.com/studio), then
launch it and open the "Virtual Device Manager" from the "More Actions" (or ellipsis menu) of 
the "Welcome to Android Studio" dialog. On the resulting "Device Manager" screen, select "Create virtual device".

<div style="text-align: center; margin: auto;">
<a href="https://assets.skip.dev/android-emulator-setup/emulator_1_setup_welcome_screen.png" target="_blank"><img src="https://assets.skip.dev/android-emulator-setup/emulator_1_setup_welcome_screen.png" alt="Android Emulator Setup 1: Welcome Screen" style="width: 45%"/></a>
<a href="https://assets.skip.dev/android-emulator-setup/emulator_2_setup_device_manager.png" target="_blank"><img src="https://assets.skip.dev/android-emulator-setup/emulator_2_setup_device_manager.png" alt="Android Emulator Setup 2: Device Manager" style="width: 45%"/></a>
</div>

On the "Select Hardware" screen, select a device (e.g., “Pixel 6”) and then on the "Select a system image" screen select one of the recommended images (e.g., "UpsideDownCake", a.k.a. API 34), and then on the next screen name the device and select "Finish". When you return to the "Device Manager" screen, you will see a new device (like "Pixel 6 API 34"), which you can then launch with the triangular play button. A little window titled "Android Emulator" will appear and the operating system will boot.

<div style="text-align: center; margin: auto;">
<a href="https://assets.skip.dev/android-emulator-setup/emulator_3_avd_select_hardware.png" target="_blank"><img src="https://assets.skip.dev/android-emulator-setup/emulator_3_avd_select_hardware.png" alt="Android Emulator Setup 3: Select Hardware" style="width: 30%"/></a>
<a href="https://assets.skip.dev/android-emulator-setup/emulator_4_avd_system_image.png" target="_blank"><img src="https://assets.skip.dev/android-emulator-setup/emulator_4_avd_system_image.png" alt="Android Emulator Setup 4: Select System Image" style="width: 30%"/></a>
<a href="https://assets.skip.dev/android-emulator-setup/emulator_5_avd_verify.png" target="_blank"><img src="https://assets.skip.dev/android-emulator-setup/emulator_5_avd_verify.png" alt="Android Emulator Setup 5: Verify Connfiguration" style="width: 30%"/></a>
</div>

<div style="text-align: center; margin: auto;">
<a href="https://assets.skip.dev/android-emulator-setup/emulator_6_setup_device_manager.png" target="_blank"><img src="https://assets.skip.dev/android-emulator-setup/emulator_6_setup_device_manager.png" alt="Android Emulator Setup 6: Device Manager" style="width: 45%"/></a>
<a href="https://assets.skip.dev/android-emulator-setup/emulator_7_running.png" target="_blank"><img src="https://assets.skip.dev/android-emulator-setup/emulator_7_running.png" alt="Android Emulator Setup 6: Running Emulator" style="max-width: 45%; max-height: 300px;"/></a>
</div>

:::caution
To verify that the emulator is working, open a terminal and run the command `adb devices`. It should output `List of devices attached` followed by a single line with the device identifier, such as `emulator-5554`. If you encounter issues, or for more information on setting up the Android emulator, see the [Create and manage virtual devices](https://developer.android.com/studio/run/managing-avds) documentation.
:::

<!-- 
Can install and configure an "Android Virtual Device" (AVD) with the following commands.
For an ARM ("M-Series") macOS host:

```
sdkmanager "build-tools;35.0.0" "platform-tools" "emulator" "system-images;android-35;google_apis;arm64-v8a" "platforms;android-35"
avdmanager create avd -n "Pixel_7" -d "pixel_7" -k "system-images;android-35;google_apis;arm64-v8a"
```

These commands will be somewhat different if you are running on an 
Intel machine. For these, you would replace "arm64-v8a" with "x86_64", as follows:

```
sdkmanager "build-tools;35.0.0" "platform-tools" "emulator" "system-images;android-35;google_apis;x86_64" "platforms;android-35"
avdmanager create avd -n "Pixel_7" -d "pixel_7" -k "system-images;android-35;google_apis;x86_64"
```

Once you have created the AVD on your ARM or Intel machine, you can launch the emulator with the commands:

```
avdmanager list avd
~/Library/Android/sdk/emulator/emulator -avd Pixel_7
```
 -->


## Running Swift “Hello World” on Android

Now that you have everything set up and have launched an Android emulator (or connected a physical Android device with [developer mode enabled](https://developer.android.com/studio/debug/dev-options)), it's time to run some Swift!

Open a terminal and create a new Swift command-line executable called "HelloSwift":

```
% mkdir HelloSwift
% cd HelloSwift
% swift package init --type=executable

Creating executable package: HelloSwift
Creating Package.swift
Creating Sources/main.swift
```

Just to make sure it works on macOS, run the program with the standard `swift run` command:

```
% swift run HelloSwift

Building for debugging...
Build of product 'HelloSwift' complete! (1.80s)

Hello, world!
```

And now, we will build and run it on the Android emulator (or device) using the Swift Android driver, which we include as part of the `skip` tool that was installed along with the toolchain:

```
% skip android run HelloSwift

Building for debugging...
Build complete! (10.90s)

[✓] Check Swift Package (0.68s)
[✓] Connecting to Android (0.05s)
[✓] Copying executable files (0.25s)

Hello, world!
```

:::danger
If you have installed a version of Xcode that uses a different Swift version than the toolchain (e.g. Xcode 16, which includes Swift 6.0), you may encounter errors when building for Android. In these cases, you can work around this by downloading an earlier version of Xcode from [developer.apple.com](https://developer.apple.com/download/applications/) (e.g., Xcode 15.4) and then referencing the install location with the DEVELOPER_DIR environment variable.
:::

Viola! There's Swift running on Android. And just to prove to that we are really running on a different host, edit the `Sources/main.swift` file with your favorite editor (or run `xed Sources/main.swift` to edit it in Xcode), and add a platform check:

```swift
#if os(Android)
print("Hello, Android!")
#elseif os(macOS)
print("Hello, macOS!")
#else
print("Hello, someone other platform…")
#endif
```

Then run it on both macOS and Android:

```
% swift run HelloSwift

Building for debugging...
Build of product 'HelloSwift' complete! (0.47s)

Hello, macOS!

% skip android run HelloSwift

Building for debugging...
Build complete! (0.89s)

[✓] Check Swift Package (0.23s)
[✓] Connecting to Android (0.04s)
[✓] Copying executable files (0.23s)

Hello, Android!
```

## Running Swift Test Cases on Android

Command-line tools are fun, but to really exercise Swift on Android, we
want to be able to run test suites. 
This is how developers interested in creating cross-platform frameworks will 
be able to check for – and resolve – issues with their Swift code arising from
platform differences.

Fortunately the `skip android` driver includes not just the `run` command,
but also the `test` command, which will connect to the Android emulator/device
and run through an [XCTest](https://developer.apple.com/documentation/xctest) test suite
in the same way as `swift test` does for macOS.

To demonstrate, we can run the test suite for Apple's
[swift-algorithms](https://github.com/apple/swift-algorithms.git) package,
to make sure it runs correctly on Android:

```
% git clone https://github.com/apple/swift-algorithms.git
Cloning into 'swift-algorithms'...
…
Resolving deltas: 100% (1054/1054), done.

% cd swift-algorithms 
% skip android test

Fetching https://github.com/apple/swift-numerics.git from cache
Fetched https://github.com/apple/swift-numerics.git from cache (0.87s)
Computing version for https://github.com/apple/swift-numerics.git
Computed https://github.com/apple/swift-numerics.git at 1.0.2 (0.57s)
Creating working copy for https://github.com/apple/swift-numerics.git
Working copy of https://github.com/apple/swift-numerics.git resolved at 1.0.2

Building for debugging...
…
[92/93] Linking swift-algorithmsPackageTests.xctest
Build complete! (25.91s)

[✓] Check Swift Package (0.74s)
[✓] Connecting to Android (0.06s)
[✓] Copying test files (0.27s)

Test Suite 'All tests' started at 2024-09-10 20:24:17.770
Test Suite 'swift-algorithms-C7A0585A-0DC2-4937-869A-8FD5E482398C.xctest' started at 2024-09-10 20:24:17.776
Test Suite 'AdjacentPairsTests' started at 2024-09-10 20:24:17.776
Test Case 'AdjacentPairsTests.testEmptySequence' started at 2024-09-10 20:24:17.776
Test Case 'AdjacentPairsTests.testEmptySequence' passed (0.001 seconds)
…
Test Case 'WindowsTests.testWindowsSecondAndLast' started at 2024-09-10 20:24:20.480
Test Case 'WindowsTests.testWindowsSecondAndLast' passed (0.0 seconds)
Test Suite 'WindowsTests' passed at 2024-09-10 20:24:20.480
     Executed 8 tests, with 0 failures (0 unexpected) in 0.004 (0.004) seconds
Test Suite 'swift-algorithms-C7A0585A-0DC2-4937-869A-8FD5E482398C.xctest' passed at 2024-09-10 20:24:20.480
     Executed 212 tests, with 0 failures (0 unexpected) in 2.702 (2.702) seconds
Test Suite 'All tests' passed at 2024-09-10 20:24:20.480
     Executed 212 tests, with 0 failures (0 unexpected) in 2.702 (2.702) seconds

```

Everything passes. Hooray!

Not every package's tests will pass so easily: Android is based on Linux – unlike the Darwin/BSD heritage of macOS and iOS – so there may be assumptions your code makes for Darwin that don't hold true on Linux. Running through a comprehensive test suite is the best way to begin isolating, and then addressing, these platform differences.

:::tip
If you use GitHub for continuous integration testing of your Swift package, you may want to check out Skip's [Swift Android Action](https://github.com/skiptools/swift-android-action/) on the GitHub Marketplace, which enables automated Android testing for your Swift package as part of your CI workflow.
:::


:::caution
Note that the Android toolchain does not yet support the new [Swift Testing](https://developer.apple.com/documentation/testing/) framework. Only test that use the [XCTest](https://developer.apple.com/documentation/xctest) framework will currently build and run.
:::

## Next Steps: Creating an App

Command line executables and unit tests are all well and good,
but “Hello World” is not an app. To create an actual Android
app, with access to device capabilities and a graphical user interface, you need to 
work with the Android SDK, which is written in Java and Kotlin.
And you need to package and distribute the app in Android's own
idiomatic way, with self-contained libraries embedded in the application's assembly.

This is where integration with Skip's broader ecosystem comes into play. [Additional installments](#next) of this series explore Skip's system for transparently bridging compiled Swift to Java, Kotlin, and transpiled Swift - including Skip's existing [SwiftUI support](/docs/modules/skip-ui) for Android. This allows the best of all worlds: transpiled Swift to talk to Android libraries, SwiftUI on top of [Jetpack Compose](https://developer.android.com/compose), and business logic and algorithms implemented in compiled Swift!

<img src="/assets/images/skip-marketing-preview.jpg" alt="Screenshot" style="width: 100%"/>

:::note
We would love to hear feedback from developers on their experience with the tools, and to discuss the best way to get your packages ready for a Swift multi-platform world. Reach out to us on our [Slack channel](/slack) or [community forums](https://community.skip.tools).
:::

## Native Swift on Android Series {#next}

Additional posts in the native Swift on Android series:

- Part 1: A native Swift toolchain for Android
- [Part 2: Your first native Swift Android app](/blog/skip-native-tech-preview/)
- [Part 3: Using a shared native Swift model to power separate SwiftUI iOS and Jetpack Compose Android apps](/blog/shared-swift-model/)
- Coming soon: Bridging Kotlin and Java API for consumption by native Swift
- Coming soon: Incorporating native Swift, C, and C++ dependencies into your cross-platform Swift apps

## Afterword
<!-- 
Swift is designed to be a portable, multi-platform language.
As well as supporting Apple platforms (macOS, iOS, tvOS, etc.),
Swift can also be used to build programs for 
[Linux](https://www.swift.org/blog/swift-linux-port/), 
[Windows](https://www.swift.org/blog/swift-on-windows/), 
and various embedded devices, such as the 
[Raspberry Pi](https://www.swift.org/blog/embedded-swift-examples/)
and the [Playdate](https://www.swift.org/blog/byte-sized-swift-tiny-games-playdate/) game console.
 -->
 
The Swift toolchain for Android is the culmination of many years of community effort, in which we (the Skip team) have played only a very small part.

Even before Swift was made open-source, people have been tinkering with getting
it running on Android, starting with Romain Goyet's 
["Running Swift code on Android"](https://romain.goyet.com/articles/running_swift_code_on_android/)
attempts in 2015, which got some basic Swift compiling and running on an Android device.
A more practical example came with Geordie J's
["How we put an app in the Android Play Store using Swift"](https://medium.com/@ephemer/how-we-put-an-app-in-the-android-play-store-using-swift-67bd99573e3c)
in 2016, where Swift was used in an actual shipping Android app.
Then in 2018, Readdle published
["Swift for Android: Our Experience and Tools"](https://readdle.com/blog/swift-for-android-our-experience-and-tools)
on integrating Swift into their _Spark_ app for Android.
These articles provide valuable technical insight into the mechanics and complexities involved with cross-compiling Swift for a new platform.

In more recent years, the Swift community has had various collaborative and independent endeavors to develop a usable Swift-on-Android toolchain. Some of the most prominent contributors on GitHub are 
[@finagolfin](https://github.com/finagolfin),
[@vgorloff](https://github.com/vgorloff),
[@andriydruk](https://github.com/andriydruk),
[@compnerd](https://github.com/compnerd),
and [@hyp](https://github.com/hyp).
Our work merely builds atop of their tireless efforts,
and we expect to continue collaborating with them in the
hopes that Android eventually becomes a [fully-supported
platform](https://www.swift.org/platform-support/) for the Swift language.

Looking towards the future, we are eager for the final release of Swift 6.0, which will enable us to publish a toolchain that supports all the great new concurrency features, as well as the [Swift Foundation](https://www.swift.org/blog/foundation-preview-now-available/) reimplementation of the Foundation C/Objective-C libraries, which will give us the the ability to provide better integration between Foundation idioms (bundles, resources, user defaults, notifications, logging, etc.) and the standard Android patterns. A toolchain is only the first step in making native Swift a viable tool for building high-quality Android apps, but it is an essential component that we are very excited to be adding to the Skip ecosystem.
