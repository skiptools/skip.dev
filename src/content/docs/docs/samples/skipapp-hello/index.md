---
title: Hello Skip (Lite)
description: Documentation for Hello Skip (Lite) fetched from GitHub.
note: This documentation section is derived from the GitHub README.md source using the scripts/sync-modules.mjs script. Do not make edits to the file here, change it there.
editUrl: https://github.com/skiptools/skipapp-hello/edit/main/README.md
---

:::note[Source Repository <a href='https://github.com/skiptools/skipapp-hello/releases' alt='Releases for skipapp-hello'><img decoding='async' loading='lazy' alt='Releases for skipapp-hello' src='https://img.shields.io/github/v/release/skiptools/skipapp-hello.svg?style=flat' /></a>]{icon="github"}
This sample app is available at [github.com/skiptools/skipapp-hello](https://github.com/skiptools/skipapp-hello) and can be checked out and improved locally as described in the [Contribution Guide](/docs/contributing/#local-libraries).
:::


This is a Skip Lite dual-platform app project.
It builds a native app for both iOS and Android.

This is the exact project with will be output when running the command:

```
skip init --zero --appid=skip.hello.App skipapp-hello HelloSkip
```

The project structure looks like this:

```
skipapp-hello
├── Android
│   ├── app
│   │   ├── build.gradle.kts
│   │   ├── proguard-rules.pro
│   │   └── src
│   │       └── main
│   │           ├── AndroidManifest.xml
│   │           └── kotlin
│   │               └── hello
│   │                   └── skip
│   │                       └── Main.kt
│   ├── gradle.properties
│   └── settings.gradle.kts
├── CHANGELOG.md
├── Darwin
│   ├── Assets.xcassets
│   │   ├── AccentColor.colorset
│   │   │   └── Contents.json
│   │   └── Contents.json
│   ├── Entitlements.plist
│   ├── HelloSkip.xcconfig
│   ├── HelloSkip.xcodeproj
│   │   └── project.pbxproj
│   ├── Info.plist
│   └── Sources
│       └── HelloSkipAppMain.swift
├── Package.swift
├── README.md
├── Skip.env
├── Sources
│   └── HelloSkip
│       ├── ContentView.swift
│       ├── HelloSkipApp.swift
│       ├── Resources
│       │   ├── Localizable.xcstrings
│       │   └── Module.xcassets
│       │       └── Contents.json
│       ├── Skip
│       │   └── skip.yml
│       └── ViewModel.swift
└── Tests
    └── HelloSkipTests
        ├── HelloSkipTests.swift
        ├── Resources
        │   └── TestData.json
        ├── Skip
        │   └── skip.yml
        └── XCSkipTests.swift
```

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

