---
title: Travel Bookings (Lite)
description: Documentation for Travel Bookings (Lite) fetched from GitHub.
note: This documentation section is derived from the GitHub README.md source using the scripts/sync-modules.mjs script. Do not make edits to the file here, change it there.
editUrl: https://github.com/skiptools/skipapp-bookings/edit/main/README.md
---

:::note[Source Repository <a href='https://github.com/skiptools/skipapp-bookings/releases' alt='Releases for skipapp-bookings'><img decoding='async' loading='lazy' alt='Releases for skipapp-bookings' src='https://img.shields.io/github/v/release/skiptools/skipapp-bookings.svg?style=flat' /></a>]{icon="github"}
This sample app is available at [github.com/skiptools/skipapp-bookings](https://github.com/skiptools/skipapp-bookings) and can be checked out and improved locally as described in the [Contribution Guide](/docs/contributing/#local-libraries).
:::


This is a demonstration of a full-featured
Skip Lite dual-platform app project
for both iOS and Android. It is a travel exploration app
that displays cities loaded from a bundled JSON asset,
and has the following features:

  - A navigation list of the bundled city list
  - A persistent favorites list that can be modified and reordered
  - An embedded maps view for any given city
  - An embedded web view showing the wikipedia page for the city
  - Dynamic temperature update using a weather web service endpoint
  - A settings view enabling override of preferred color scheme and display units
  
<video autoplay muted loop playsinline controlslist="nodownload" style="background: transparent; width: 100%;" poster="https://www.skip.dev/assets/video/skip-splash-poster.png">
    <source src="https://www.skip.dev/assets/video/skip-splash.mov" type="video/webm">
    Your browser does not support the video tag.
</video>


  iOS |  Android
:----:|:--------:
![iOS Screenshot](https://assets.skip.dev/skipapp-bookings/city-list-iphone.png) | ![Android Screenshot](https://assets.skip.dev/skipapp-bookings/city-list-android.png)
![iOS Screenshot](https://assets.skip.dev/skipapp-bookings/city-view-iphone.png) | ![Android Screenshot](https://assets.skip.dev/skipapp-bookings/city-view-android.png)
![iOS Screenshot](https://assets.skip.dev/skipapp-bookings/city-settings-iphone.png) | ![Android Screenshot](https://assets.skip.dev/skipapp-bookings/city-settings-android.png)

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
5. Add your name to the Skip [Contributor Agreement](https://source.skip.dev/clabot-config)
6. Open a Pull Request from your fork with a description of your changes

## Running

Xcode and Android Studio must be downloaded and installed in order to
run the app in the iOS simulator / Android emulator.
An Android emulator must already be running, which can be launched from 
Android Studio's Device Manager.

To run both the Swift and Kotlin apps simultaneously, 
launch the HelloSkipApp target from Xcode.
A build phases runs the "Launch Android APK" script that
will deploy the transpiled app a running Android emulator or connected device.
Logging output for the iOS app can be viewed in the Xcode console, and in
Android Studio's logcat tab for the transpiled Kotlin app.

