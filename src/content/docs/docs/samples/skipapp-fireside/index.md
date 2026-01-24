---
title: Fireside (Lite)
description: Documentation for Fireside (Lite) fetched from GitHub.
note: This documentation section is derived from the GitHub README.md source using the scripts/sync-modules.mjs script. Do not make edits to the file here, change it there.
editUrl: https://github.com/skiptools/skipapp-fireside/edit/main/README.md
---

:::note[Source Repository <a href='https://github.com/skiptools/skipapp-fireside/releases' alt='Releases for skipapp-fireside'><img decoding='async' loading='lazy' alt='Releases for skipapp-fireside' src='https://img.shields.io/github/v/release/skiptools/skipapp-fireside.svg?style=flat' /></a>]{icon="github"}
This sample app is available at [github.com/skiptools/skipapp-fireside](https://github.com/skiptools/skipapp-fireside) and can be checked out and improved locally as described in the [Contribution Guide](/docs/contributing/#local-libraries).
:::


This is a Skip Lite dual-platform app project.
It creates a native app for both iOS and Android.

This app shows Skip Lite's integration with the Firebase backend
cloud computing services
using the official native Firebase SDKs for iOS and Android.
It utilizes the
[Skip Firebase](/docs/modules/skip-firebase)
framework.

<video id="intro_video" style="width: 100%" controls autoplay>
  <source style="width: 100;" src="https://assets.skip.dev/videos/SkipFirebaseExample.mov" type="video/mp4">
  Your browser does not support the video tag.
</video>


## Quickstart

This repository contains an Xcode project with a SwiftUI app that uses the
Skip plugin to transpile the app into Kotlin then build and launch it on Android.
To get started:

1. Install skip (requires macOS 13+ with [Homebrew](https://brew.sh), [Xcode](https://developer.apple.com/xcode/), and [Android Studio](https://developer.android.com/studio)):
```
$ brew install skiptools/skip/skip
```
2. Configure and launch an Android emulator from the [Android Studio device manager](https://developer.android.com/studio/run/emulator-launch-without-app), or by launching a pre-existing emulator:
```
$ ~/Library/Android/sdk/emulator/emulator @Pixel_6_API_30
```
3. Download this [repository as a zip file](/docs/samples/skipapp-fireside/archive/main.zip) and unzip it, or clone the repository:
```
$ git clone https://source.skip.dev/skipapp-fireside.git
```
4. Open the Xcode project in the *Darwin* folder:
```
$ open skipapp-fireside/Darwin/FireSide.xcodeproj
```
5. Select and Run the `FireSide` target with an iOS simulator destination; the app will build and run side-by-side on the iOS simulator and Android emulator.

## Testing

The module can be tested using the standard `swift test` command
or by running the test target for the macOS destination in Xcode,
which will run the Swift tests as well as the transpiled
Kotlin JUnit tests in the Robolectric Android simulation environment.

Parity testing can be performed with `skip test`,
which will output a table of the test results for both platforms.

## Contributing

We welcome contributions to this package in the form of enhancements and bug fixes.

The general flow for contributing to this and any other Skip package is:

1. Fork this repository and enable actions from the "Actions" tab
2. Check out your fork locally
3. When developing alongside a Skip app, add the package to a [shared workspace](/docs/contributing) to see your changes incorporated in the app
4. Push your changes to your fork and ensure the CI checks all pass in the Actions tab
5. Add your name to the Skip [Contributor Agreement](https://source.skip.dev/clabot-config)
6. Open a Pull Request from your fork with a description of your changes

## Running

Xcode and Android Studio must be downloaded and installed in order to
run the app in the iOS simulator / Android emulator.
An Android emulator must already be running, which can be launched from 
Android Studio's Device Manager.

To run both the Swift and Kotlin apps simultaneously, 
launch the FireSideApp target from Xcode.
A build phases runs the "Launch Android APK" script that
will deploy the transpiled app a running Android emulator or connected device.
Logging output for the iOS app can be viewed in the Xcode console, and in
Android Studio's logcat tab for the transpiled Kotlin app.
