---
title: Zip
layout: docs
note: This documentation section is derived from https://raw.githubusercontent.com/skiptools/skip-zip/main/README.md using the scripts/syncdocs.sh script. Do not change the file here, change it there.
---

:::note[Source Repository]{icon="github"}
The skip-zip framework is available at [https://github.com/skiptools/skip-zip.git](https://source.skip.tools/skip-zip.git), which can be checked out and tested with `skip test` once Skip is [installed](/docs/gettingstarted/).
:::

SkipZip is a Skip framework that provides support for creating and extracting zip archives.

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
        .package(url: "https://source.skip.tools/skip-zip.git", "0.0.0"..<"2.0.0"),
    ],
    targets: [
        .target(name: "MyTarget", dependencies: [
            .product(name: "SkipZip", package: "skip-zip")
        ])
    ]
)
```

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

