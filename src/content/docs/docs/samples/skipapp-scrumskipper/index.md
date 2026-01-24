---
title: Scrumskipper (Lite)
description: Documentation for Scrumskipper (Lite) fetched from GitHub.
note: This documentation section is derived from the GitHub README.md source using the scripts/sync-modules.mjs script. Do not make edits to the file here, change it there.
editUrl: https://github.com/skiptools/skipapp-scrumskipper/edit/main/README.md
---

:::note[Source Repository <a href='https://github.com/skiptools/skipapp-scrumskipper/releases' alt='Releases for skipapp-scrumskipper'><img decoding='async' loading='lazy' alt='Releases for skipapp-scrumskipper' src='https://img.shields.io/github/v/release/skiptools/skipapp-scrumskipper.svg?style=flat' /></a>]{icon="github"}
This sample app is available at [github.com/skiptools/skipapp-scrumskipper](https://github.com/skiptools/skipapp-scrumskipper) and can be checked out and improved locally as described in the [Contribution Guide](/docs/contributing/#local-libraries).
:::


Scrumskipper is a Skip Lite dual-platform app project using the source from [Scrumdinger](https://developer.apple.com/tutorials/app-dev-training/getting-started-with-scrumdinger), Apple's canonical SwiftUI sample app. Scrumskipper builds a native app for both iOS and Android.

Read more about this sample on the [Skip blog](/blog/scrumskipper/).

## Building

This project is both a stand-alone Swift Package Manager module,
as well as an Xcode project that builds and transpiles the project
into a Kotlin Gradle project for Android using the Skip plugin.

Building the module requires that Skip Lite be installed using
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
5. Add your name to the Skip [Contributor Agreement](https://source.skip.dev/clabot-config)
6. Open a Pull Request from your fork with a description of your changes

## Running

Xcode and Android Studio must be downloaded and installed in order to
run the app in the iOS simulator / Android emulator.
An Android emulator must already be running, which can be launched from 
Android Studio's Device Manager.

To run both the Swift and Kotlin apps simultaneously, 
launch the ScrumskipperApp target from Xcode.
A build phases runs the "Launch Android APK" script that
will deploy the transpiled app a running Android emulator or connected device.
Logging output for the iOS app can be viewed in the Xcode console, and in
Android Studio's logcat tab for the transpiled Kotlin app.
