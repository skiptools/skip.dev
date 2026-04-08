---
title: Ahoy Skipper (Split Fuse)
description: Documentation for Ahoy Skipper (Split Fuse) fetched from GitHub.
note: This documentation section is derived from the GitHub README.md source using the scripts/sync-modules.mjs script. Do not make edits to the file here, change it there.
editUrl: https://github.com/skiptools/skipapp-ahoy/edit/main/README.md
---

:::note[Source Repository <a href='https://github.com/skiptools/skipapp-ahoy/releases' alt='Releases for skipapp-ahoy'><img decoding='async' loading='lazy' alt='Releases for skipapp-ahoy' src='https://img.shields.io/github/v/release/skiptools/skipapp-ahoy.svg?style=flat' /></a>]{icon="github"}
This sample app is available at [github.com/skiptools/skipapp-ahoy](https://github.com/skiptools/skipapp-ahoy) and can be checked out and improved locally as described in the [Contribution Guide](/docs/contributing/#local-libraries).
:::


This is a [Skip](https://skip.tools) dual-platform app project.


<!-- TODO: add iOS screenshots to fastlane metadata
## iPhone Screenshots

<img alt="iPhone Screenshot" src="https://raw.githubusercontent.com/skiptools/skipapp-ahoy/main/Darwin/fastlane/screenshots/en-US/1_en-US.png" style="width: 18%" /> <img alt="iPhone Screenshot" src="https://raw.githubusercontent.com/skiptools/skipapp-ahoy/main/Darwin/fastlane/screenshots/en-US/2_en-US.png" style="width: 18%" /> <img alt="iPhone Screenshot" src="https://raw.githubusercontent.com/skiptools/skipapp-ahoy/main/Darwin/fastlane/screenshots/en-US/3_en-US.png" style="width: 18%" /> <img alt="iPhone Screenshot" src="https://raw.githubusercontent.com/skiptools/skipapp-ahoy/main/Darwin/fastlane/screenshots/en-US/4_en-US.png" style="width: 18%" /> <img alt="iPhone Screenshot" src="https://raw.githubusercontent.com/skiptools/skipapp-ahoy/main/Darwin/fastlane/screenshots/en-US/5_en-US.png" style="width: 18%" />
-->

<!-- TODO: add Android screenshots to fastlane metadata
## Android Screenshots

<img alt="Android Screenshot" src="https://raw.githubusercontent.com/skiptools/skipapp-ahoy/main/Android/fastlane/metadata/android/en-US/images/phoneScreenshots/1_en-US.png" style="width: 18%" /> <img alt="Android Screenshot" src="https://raw.githubusercontent.com/skiptools/skipapp-ahoy/main/Android/fastlane/metadata/android/en-US/images/phoneScreenshots/2_en-US.png" style="width: 18%" /> <img alt="Android Screenshot" src="https://raw.githubusercontent.com/skiptools/skipapp-ahoy/main/Android/fastlane/metadata/android/en-US/images/phoneScreenshots/3_en-US.png" style="width: 18%" /> <img alt="Android Screenshot" src="https://raw.githubusercontent.com/skiptools/skipapp-ahoy/main/Android/fastlane/metadata/android/en-US/images/phoneScreenshots/4_en-US.png" style="width: 18%" /> <img alt="Android Screenshot" src="https://raw.githubusercontent.com/skiptools/skipapp-ahoy/main/Android/fastlane/metadata/android/en-US/images/phoneScreenshots/5_en-US.png" style="width: 18%" />
-->

## Building

This project is both a stand-alone Swift Package Manager module,
as well as an Xcode project that builds and translates the project
into a Kotlin Gradle project for Android using the skipstone plugin.

## Running

Xcode and Android Studio must be downloaded and installed in order to
run the app in the iOS simulator / Android emulator.
An Android emulator must already be running, which can be launched from
Android Studio's Device Manager.

The project can be opened and run in Xcode from
`Project.xcworkspace`, which also enabled parallel
development of any Skip libary dependencies.

To run both the Swift and Kotlin apps simultaneously,
launch the "AhoySkipper App" target from Xcode.
A build phases runs the "Launch Android APK" script that
will deploy the Skip app to a running Android emulator or connected device.
Logging output for the iOS app can be viewed in the Xcode console, and in
Android Studio's logcat tab for the transpiled Kotlin app, or
using `adb logcat` from a terminal.

## Testing

The module can be tested using the standard `swift test` command
or by running the test target for the macOS destination in Xcode,
which will run the Swift tests as well as the transpiled
Kotlin JUnit tests in the Robolectric Android simulation environment.

Parity testing can be performed with `skip test`,
which will output a table of the test results for both platforms.
