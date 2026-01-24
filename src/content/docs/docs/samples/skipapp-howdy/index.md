---
title: Howdy Skip (Fuse)
description: Documentation for Howdy Skip (Fuse) fetched from GitHub.
note: This documentation section is derived from the GitHub README.md source using the scripts/sync-modules.mjs script. Do not make edits to the file here, change it there.
editUrl: https://github.com/skiptools/skipapp-howdy/edit/main/README.md
---

:::note[Source Repository <a href='https://github.com/skiptools/skipapp-howdy/releases' alt='Releases for skipapp-howdy'><img decoding='async' loading='lazy' alt='Releases for skipapp-howdy' src='https://img.shields.io/github/v/release/skiptools/skipapp-howdy.svg?style=flat' /></a>]{icon="github"}
This sample app is available at [github.com/skiptools/skipapp-howdy](https://github.com/skiptools/skipapp-howdy) and can be checked out and improved locally as described in the [Contribution Guide](/docs/contributing/#local-libraries).
:::


This is a Skip dual-platform app project.
It builds a native app for both iOS and Android.

This is a fully-native compiled Swift app, in contrast
with the [skipapp-hello](/docs/samples/skipapp-hello)
sample, which is a fully-transpiled sample app.

To learn about the distinction, see the
[Native and Transpiled Modes](/docs/modes/)
documentaton.

This repository contains the exact project with will be output when running the command:

```
skip init --native-app --appid=skip.howdy.App skipapp-howdy HowdySkip
```

The project structure looks like this:

```
skipapp-howdy
├── Android
│   ├── app
│   │   ├── build.gradle.kts
│   │   ├── proguard-rules.pro
│   │   └── src
│   │       └── main
│   │           ├── AndroidManifest.xml
│   │           ├── kotlin
│   │           │   └── Main.kt
│   │           └── res
│   │               ├── mipmap-anydpi
│   │               │   └── ic_launcher.xml
│   │               └── mipmap-hdpi
│   │                   ├── ic_launcher_background.png
│   │                   ├── ic_launcher_foreground.png
│   │                   ├── ic_launcher_monochrome.png
│   │                   └── ic_launcher.png
│   ├── gradle
│   │   └── wrapper
│   │       └── gradle-wrapper.properties
│   ├── gradle.properties
│   └── settings.gradle.kts
├── Darwin
│   ├── Assets.xcassets
│   │   ├── AccentColor.colorset
│   │   │   └── Contents.json
│   │   ├── AppIcon.appiconset
│   │   │   ├── AppIcon@2x.png
│   │   │   ├── AppIcon@3x.png
│   │   │   └── Contents.json
│   │   └── Contents.json
│   ├── Entitlements.plist
│   ├── HowdySkip.xcconfig
│   ├── HowdySkip.xcodeproj
│   │   ├── project.pbxproj
│   │   ├── project.xcworkspace
│   │   │   └── contents.xcworkspacedata
│   │   └── xcshareddata
│   │       └── xcschemes
│   │           └── HowdySkip App.xcscheme
│   ├── Info.plist
│   └── Sources
│       └── Main.swift
├── Package.swift
├── README.md
├── Skip.env
└── Sources
    └── HowdySkip
        ├── ContentView.swift
        ├── HowdySkipApp.swift
        ├── Resources
        │   ├── Localizable.xcstrings
        │   └── Module.xcassets
        │       └── Contents.json
        ├── Skip
        │   └── skip.yml
        └── ViewModel.swift
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

## Running

Xcode and Android Studio must be downloaded and installed in order to
run the app in the iOS simulator / Android emulator.
An Android emulator must already be running, which can be launched from
Android Studio's Device Manager.

To run both the Swift and Kotlin apps simultaneously,
launch the HowdySkipApp target from Xcode.
A build phases runs the "Launch Android APK" script that
will deploy the transpiled app a running Android emulator or connected device.
Logging output for the iOS app can be viewed in the Xcode console, and in
Android Studio's logcat tab for the transpiled Kotlin app.
