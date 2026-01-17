---
title: "skipapp-notes"
layout: docs
note: This documentation section is derived from https://raw.githubusercontent.com/skiptools/skipapp-notes/main/README.md using the scripts/syncdocs.sh script. Do not change the file here, change it there.
---

<style type="text/css">
  div p img {
    width: 90%;
  }
</style>

:::note[Source Repository]{icon="github"}
This sample app is available at [https://github.com/skiptools/skipapp-notes.git](https://source.skip.tools/skipapp-notes.git), which can be checked out and run once Skip is [installed](/docs/gettingstarted/).
:::

Skip notes is a [Skip Fuse](/docs/status#skip_fuse) dual-platform note taking app
built using Skip
and distributed through the [App Fair](https://appfair.org).

<div align="center">
  <a href="https://play.google.com/store/apps/details?id=org.appfair.app.SkipNotes" style="display: inline-block;"><img src="https://appfair.org/assets/badges/google-play-store.svg" alt="Download on the Google Play Store" style="height: 60px; vertical-align: middle; object-fit: contain;" /></a>
  <a href="https://apps.apple.com/us/app/skip-notes/id6740916318" style="display: inline-block;"><img src="https://appfair.org/assets/badges/apple-app-store.svg" alt="Download on the Apple App Store" style="height: 60px; vertical-align: middle; object-fit: contain;" /></a>
</div>

## iPhone Screenshots

<img alt="iPhone Screenshot" src="https://raw.githubusercontent.com/skiptools/skipapp-notes/main/Darwin/fastlane/screenshots/en-US/1_en-US.png" style="width: 18%" /> <img alt="iPhone Screenshot" src="https://raw.githubusercontent.com/skiptools/skipapp-notes/main/Darwin/fastlane/screenshots/en-US/2_en-US.png" style="width: 18%" />


## Android Screenshots

<img alt="Android Screenshot" src="https://raw.githubusercontent.com/skiptools/skipapp-notes/main/Android/fastlane/metadata/android/en-US/images/phoneScreenshots/1_en-US.png" style="width: 18%" /> <img alt="Android Screenshot" src="https://raw.githubusercontent.com/skiptools/skipapp-notes/main/Android/fastlane/metadata/android/en-US/images/phoneScreenshots/2_en-US.png" style="width: 18%" />

## Building

This project is both a stand-alone Swift Package Manager module,
as well as an Xcode project that builds and transpiles the project
into a Kotlin Gradle project for Android using the Skip plugin.

Building the module requires that Skip be installed using
[Homebrew](https://brew.sh) with `brew install skiptools/skip/skip`.

This will also install the necessary transpiler prerequisites:
Kotlin, Gradle, and the Android build tools.

Installation prerequisites can be confirmed by running `skip checkup`.

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
5. Add your name to the Skip [Contributor Agreement](https://source.skip.tools/clabot-config)
6. Open a Pull Request from your fork with a description of your changes

## Running

Xcode and Android Studio must be downloaded and installed in order to
run the app in the iOS simulator / Android emulator.
An Android emulator must already be running, which can be launched from 
Android Studio's Device Manager.

To run both the Swift and Kotlin apps simultaneously, 
launch the SkipNotesApp target from Xcode.
A build phases runs the "Launch Android APK" script that
will deploy the transpiled app a running Android emulator or connected device.
Logging output for the iOS app can be viewed in the Xcode console, and in
Android Studio's logcat tab for the transpiled Kotlin app.
