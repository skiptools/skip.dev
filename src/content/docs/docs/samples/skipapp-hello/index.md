---
title: "skipapp-hello"
layout: docs
note: This documentation section is derived from https://raw.githubusercontent.com/skiptools/skipapp-hello/main/README.md using the scripts/syncdocs.sh script. Do not change the file here, change it there.
---

<style type="text/css">
  div p img {
    width: 90%;
  }
</style>

:::note[Source Repository]{icon="github"}
This sample app is available at [https://github.com/skiptools/skipapp-hello.git](https://source.skip.tools/skipapp-hello.git), which can be checked out and run once Skip is [installed](/docs/gettingstarted/).
:::

This is a [Skip Lite](/docs/status#skip_lite) dual-platform app project.
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
5. Add your name to the Skip [Contributor Agreement](https://source.skip.tools/clabot-config)
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

