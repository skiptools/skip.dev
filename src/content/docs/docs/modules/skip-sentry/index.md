---
title: Sentry
description: Documentation for Sentry fetched from GitHub.
note: This documentation section is derived from the GitHub README.md source using the scripts/sync-modules.mjs script. Do not make edits to the file here, change it there.
editUrl: https://github.com/skiptools/skip-sentry/edit/main/README.md
---

:::note[Source Repository <a href='https://github.com/skiptools/skip-sentry/releases' alt='Releases for skip-sentry'><img decoding='async' loading='lazy' alt='Releases for skip-sentry' src='https://img.shields.io/github/v/release/skiptools/skip-sentry.svg?style=flat' /></a>]{icon="github"}
This framework is available at [github.com/skiptools/skip-sentry](https://github.com/skiptools/skip-sentry) and can be checked out and improved locally as described in the [Contribution Guide](/docs/contributing/#local-libraries).
:::


This is a Skip Swift/Kotlin library project that
abstracts the
[Sentry iOS](https://docs.sentry.io/platforms/apple/guides/ios/usage/)
and
[Sentry Android](https://docs.sentry.io/platforms/android/usage/)
SDKs.

It is currently in a primitive state and needs contributions
to flesh out the capabilities.

## Setup

To include this framework in your project, add the following
dependency to your `Package.swift` file:

```swift
let package = Package(
    name: "my-package",
    products: [
        .library(name: "MyProduct", targets: ["MyTarget"]),
    ],
    dependencies: [
        .package(url: "https://source.skip.dev/skip-sentry.git", "0.0.0"..<"2.0.0"),
    ],
    targets: [
        .target(name: "MyTarget", dependencies: [
            .product(name: "SkipSentry", package: "skip-sentry")
        ])
    ]
)
```

## Configuration

### Android

Follow the guide at [https://docs.sentry.io/platforms/android/configuration/](https://docs.sentry.io/platforms/android/configuration/).

### iOS

Follow the guide at [https://docs.sentry.io/platforms/apple/configuration/](https://docs.sentry.io/platforms/apple/configuration/).

## Building

This project is a Swift Package Manager module that uses the
Skip plugin to transpile Swift into Kotlin.

Building the module requires that Skip be installed using
[Homebrew](https://brew.sh) with `brew install skiptools/skip/skip`.
This will also install the necessary build prerequisites:
Kotlin, Gradle, and the Android build tools.

## Testing

The module can be tested using the standard `swift test` command
or by running the test target for the macOS destination in Xcode,
which will run the Swift tests as well as the transpiled
Kotlin JUnit tests in the Robolectric Android simulation environment.

Parity testing can be performed with `skip test`,
which will output a table of the test results for both platforms.

