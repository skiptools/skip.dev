---
title: Weather (Lite)
description: Documentation for Weather (Lite) fetched from GitHub.
note: This documentation section is derived from the GitHub README.md source using the scripts/sync-modules.mjs script. Do not make edits to the file here, change it there.
editUrl: https://github.com/skiptools/skipapp-weather/edit/main/README.md
---

:::note[Source Repository <a href='https://github.com/skiptools/skipapp-weather/releases' alt='Releases for skipapp-weather'><img decoding='async' loading='lazy' alt='Releases for skipapp-weather' src='https://img.shields.io/github/v/release/skiptools/skipapp-weather.svg?style=flat' /></a>]{icon="github"}
This sample app is available at [github.com/skiptools/skipapp-weather](https://github.com/skiptools/skipapp-weather) and can be checked out and improved locally as described in the [Contribution Guide](/docs/contributing/#local-libraries).
:::

The SkipApp weather is a demonstration of a useful Skip App
that uses the Open-Meteo to show the weather in a location.

This is that app that is demonstrated in
the [Skip Tour](/tour) video.

![Screenshot](https://assets.skip.dev/skipapp-weather-dev-screenshot.png)

This app uses the [SkipDevice](/docs/modules/skip-device) framework to access the current location.

## Building

This project is both a stand-alone Swift Package Manager module,
as well as an Xcode project that builds and transpiles the project
into a Kotlin Gradle project for Android using the Skip plugin.

Building the module requires that Skip be installed using
[Homebrew](https://brew.sh) with `brew install skiptools/skip/skip`.

This will also install the necessary transpiler prerequisites:
Kotlin, Gradle, and the Android build tools.

Installation requirements can be confirmed by running `skip checkup`.

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

## Package

This package was initialized with the command:

```
skip init --appid=skip.weather.App --icon-color="16a085" skipapp-weather SkipWeather SkipWeatherModel
```



