---
title: Hello Skip (Lite)
description: Documentation for Hello Skip (Lite) fetched from GitHub.
note: This documentation section is derived from the GitHub README.md source using the scripts/sync-modules.mjs script. Do not make edits to the file here, change it there.
editUrl: https://github.com/skiptools/skipapp-hello/edit/main/README.md
---

:::note[Source Repository <a href='https://github.com/skiptools/skipapp-hello/releases' alt='Releases for skipapp-hello'><img decoding='async' loading='lazy' alt='Releases for skipapp-hello' src='https://img.shields.io/github/v/release/skiptools/skipapp-hello.svg?style=flat' /></a>]{icon="github"}
This sample app is available at [github.com/skiptools/skipapp-hello](https://github.com/skiptools/skipapp-hello) and can be checked out and improved locally as described in the [Contribution Guide](/docs/contributing/#local-libraries).
:::


This is a Skip dual-platform sample app: from a single Swift
and SwiftUI codebase it builds a native app for both iOS and Android. `HelloSkip`
is the simplest of the samples — a single module that is **fully transpiled** to
Kotlin and Jetpack Compose ([Skip Lite](/docs/modes/) mode).

It is one of four Skip sample apps that share the same
[conventional Skip app project layout](/docs/project-types/#samples)
but differ in their module structure and Skip mode, as shown below.

## The sample apps

| Sample | Modules | Skip mode |
| --- | --- | --- |
| [skipapp-hello](/docs/samples/skipapp-hello) | `HelloSkip` | fully transpiled — Skip Lite |
| [skipapp-howdy](/docs/samples/skipapp-howdy) | `HowdySkip` | fully native — Skip Fuse |
| [skipapp-ahoy](/docs/samples/skipapp-ahoy) | `AhoySkipper`, `SkipperModel` | fully native — Skip Fuse |
| [skipapp-hiya](/docs/samples/skipapp-hiya) | `HiyaSkip`, `HiyaSkipModel`, `HiyaSkipLogic` | mixed — native model bridged to a transpiled UI |

In **transpiled** ("Skip Lite") modules, Swift is converted to Kotlin and
SwiftUI to Jetpack Compose. In **native** ("Skip Fuse") modules, Swift is
compiled directly for Android with the Swift toolchain and bridged to
Kotlin/Jetpack Compose; see [Native and Transpiled Modes](/docs/modes/)
for the distinction. `skipapp-hello`, `skipapp-ahoy`, and `skipapp-hiya` include
unit tests that run on both platforms; `skipapp-howdy` omits them.

## Re-creating this project

This repository is exactly what `skip init` produces — its CI verifies that it
stays identical to the generated template — so it can be re-created with:

```
skip init --no-build --zero --transpiled-app --appid=skip.hello.App --version 1.0.0 skipapp-hello HelloSkip
```

## Building

This project is both a stand-alone Swift Package Manager package and an Xcode
project that builds the iOS app and, using the skipstone plugin, generates and
builds the equivalent Kotlin Gradle project for Android.

## Testing

The app can be tested with the standard `swift test` command, or by running the
test target for the macOS destination in Xcode, which runs the Swift tests as
well as the transpiled Kotlin JUnit tests in the Robolectric Android simulation
environment. Parity testing can be performed with `skip test`, which outputs a
table comparing the test results on both platforms.

## Running

Xcode and Android Studio must both be installed to run the app in the iOS
simulator and the Android emulator. Start an Android emulator first (for example,
from Android Studio's Device Manager).

Open `Project.xcworkspace` in Xcode and run the "HelloSkip App" scheme. A build
phase runs the "Launch Android APK" script, which deploys the app to a running
Android emulator or connected device alongside the iOS build. iOS logs appear in
the Xcode console; Android logs appear in Android Studio's Logcat tab (or via
`adb logcat`).

## Contributing

We welcome contributions to this package in the form of enhancements and bug fixes.

The general flow for contributing to this and any other Skip package is:

1. Fork this repository and enable actions from the "Actions" tab
2. Check out your fork locally
3. When developing alongside a Skip app, add the package to a [shared workspace](/docs/contributing) to see your changes incorporated in the app
4. Push your changes to your fork and ensure the CI checks all pass in the Actions tab
5. Add your name to the Skip [Contributor Agreement](https://source.skip.dev/clabot-config)
6. Open a Pull Request from your fork with a description of your changes
