---
title: Hiya Skip (Split Mixed)
description: Documentation for Hiya Skip (Split Mixed) fetched from GitHub.
note: This documentation section is derived from the GitHub README.md source using the scripts/sync-modules.mjs script. Do not make edits to the file here, change it there.
editUrl: https://github.com/skiptools/skipapp-hiya/edit/main/README.md
---

:::note[Source Repository <a href='https://github.com/skiptools/skipapp-hiya/releases' alt='Releases for skipapp-hiya'><img decoding='async' loading='lazy' alt='Releases for skipapp-hiya' src='https://img.shields.io/github/v/release/skiptools/skipapp-hiya.svg?style=flat' /></a>]{icon="github"}
This sample app is available at [github.com/skiptools/skipapp-hiya](https://github.com/skiptools/skipapp-hiya) and can be checked out and improved locally as described in the [Contribution Guide](/docs/contributing/#local-libraries).
:::


This is a Skip dual-platform app project
that demonstrates the integration between a native Swift model
layer compiled for Android connected to a transpiled SwiftUI
user interface. For more information on using natively-compiled
Swift on Android, see the
[native swift documentation](/docs/native).

This is the exact project with will be output when running the command:

```
skip init --native-model --appid=hiya.skip skipapp-hiya HiyaSkip HiyaSkipModel HiyaSkipLogic
```

The package will contain three modules:

1. A top-level `HiyaSkip` target that uses SwiftUI that will be transpiled to Jetpack Compose on Android to make up the user interface portion of the app
2. A `HiyaSkipModel` model layer that will be compiled natively for both Android and iOS. It contains an `@Observable ViewModel` that will be used directly on iOS, and on Android will be bridged to the transpiled user-interface layer using [SkipFuse](/docs/modules/skip-fuse) and [SkipBridge](/docs/modules/skip-bridge).
3. A pure swift cross-platform `HiyaSkipLogic` module that does not use any bridging, and is depended on by `HiyaSkipModel`


The project structure looks like:

```
skipapp-hiya/
├── Android
│   ├── app
│   │   ├── build.gradle.kts
│   │   ├── proguard-rules.pro
│   │   └── src
│   │       └── main
│   │           ├── AndroidManifest.xml
│   │           └── kotlin
│   │               └── hiya
│   │                   └── skip
│   │                       └── Main.kt
│   ├── gradle.properties
│   └── settings.gradle.kts
├── Darwin
│   ├── Assets.xcassets
│   │   ├── AccentColor.colorset
│   │   │   └── Contents.json
│   │   └── Contents.json
│   ├── Entitlements.plist
│   ├── HiyaSkip.xcconfig
│   ├── HiyaSkip.xcodeproj
│   │   └── project.pbxproj
│   ├── Info.plist
│   └── Sources
│       └── HiyaSkipAppMain.swift
├── Package.swift
├── README.md
├── Skip.env
├── Sources
│   ├── HiyaSkip
│   │   ├── ContentView.swift
│   │   ├── HiyaSkipApp.swift
│   │   ├── Resources
│   │   │   ├── Localizable.xcstrings
│   │   │   └── Module.xcassets
│   │   │       └── Contents.json
│   │   └── Skip
│   │       └── skip.yml
│   ├── HiyaSkipLogic
│   │   └── HiyaSkipLogic.swift
│   └── HiyaSkipModel
│       ├── Resources
│       │   └── Localizable.xcstrings
│       ├── Skip
│       │   └── skip.yml
│       └── ViewModel.swift
└── Tests
    ├── HiyaSkipModelTests
    │   ├── HiyaSkipModelTests.swift
    │   ├── Resources
    │   │   └── TestData.json
    │   ├── Skip
    │   │   └── skip.yml
    │   └── XCSkipTests.swift
    └── HiyaSkipTests
        ├── HiyaSkipTests.swift
        ├── Resources
        │   └── TestData.json
        ├── Skip
        │   └── skip.yml
        └── XCSkipTests.swift

```



## Building

This project is both a stand-alone Swift Package Manager module,
as well as an Xcode project that builds and translates the project
into a Kotlin Gradle project for Android using the skipstone plugin.

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
launch the HiyaSkipApp target from Xcode.
A build phases runs the "Launch Android APK" script that
will deploy the transpiled app a running Android emulator or connected device.
Logging output for the iOS app can be viewed in the Xcode console, and in
Android Studio's logcat tab for the transpiled Kotlin app.
