---
title: Travel Bookings (Fuse)
description: Documentation for Travel Bookings (Fuse) fetched from GitHub.
note: This documentation section is derived from the GitHub README.md source using the scripts/sync-modules.mjs script. Do not make edits to the file here, change it there.
editUrl: https://github.com/skiptools/skipapp-bookings-fuse/edit/main/README.md
---

:::note[Source Repository <a href='https://github.com/skiptools/skipapp-bookings-fuse/releases' alt='Releases for skipapp-bookings-fuse'><img decoding='async' loading='lazy' alt='Releases for skipapp-bookings-fuse' src='https://img.shields.io/github/v/release/skiptools/skipapp-bookings-fuse.svg?style=flat' /></a>]{icon="github"}
This sample app is available at [github.com/skiptools/skipapp-bookings-fuse](https://github.com/skiptools/skipapp-bookings-fuse) and can be checked out and improved locally as described in the [Contribution Guide](/docs/contributing/#local-libraries).
:::


This is a Skip Fuse dual-platform app project.
It builds a native app for both iOS and Android.

## Building

This project is both a stand-alone Swift Package Manager module,
as well as an Xcode project that builds and generates a Kotlin Gradle
project for Android using the Skip plugin.

Building the module requires that Skip be installed using
[Homebrew](https://brew.sh) with `brew install skiptools/skip/skip`.

This will also install the necessary transpiler prerequisites:
Kotlin, Gradle, and the Android build tools.

Installation prerequisites can be confirmed by running `skip checkup`.

## Running

Xcode and Android Studio must be downloaded and installed in order to
run the app in the iOS simulator / Android emulator.
An Android emulator must already be running, which can be launched from
Android Studio's Device Manager.

To run both the Swift and Kotlin apps simultaneously,
launch the TravelBookingsFuse target from Xcode.
A build phases runs the "Launch Android APK" script that
will deploy the transpiled app a running Android emulator or connected device.
Logging output for the iOS app can be viewed in the Xcode console, and in
Android Studio's logcat tab for the generated Kotlin app.
