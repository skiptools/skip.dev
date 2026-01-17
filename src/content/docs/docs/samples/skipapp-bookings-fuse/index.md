---
title: "skipapp-bookings-fuse"
layout: docs
note: This documentation section is derived from https://raw.githubusercontent.com/skiptools/skipapp-bookings-fuse/main/README.md using the scripts/syncdocs.sh script. Do not change the file here, change it there.
---

<style type="text/css">
  div p img {
    width: 90%;
  }
</style>

:::note[Source Repository]{icon="github"}
This sample app is available at [https://github.com/skiptools/skipapp-bookings-fuse.git](https://source.skip.tools/skipapp-bookings-fuse.git), which can be checked out and run once Skip is [installed](/docs/gettingstarted/).
:::


This is a [Skip Fuse](/docs/status#skip_fuse) dual-platform app project.
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
