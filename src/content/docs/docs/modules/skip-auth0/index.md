---
title: Auth0
layout: docs
note: This documentation section is derived from https://raw.githubusercontent.com/skiptools/skip-auth0/main/README.md using the scripts/syncdocs.sh script. Do not change the file here, change it there.
---

:::note[Source Repository]{icon="github"}
The skip-auth0 framework is available at [https://github.com/skiptools/skip-auth0.git](https://source.skip.tools/skip-auth0.git), which can be checked out and tested with `skip test` once Skip is [installed](/docs/gettingstarted/).
:::

This is a free Skip Swift/Kotlin library project containing the following modules:

SkipAuth0

## Building

This project is a free Swift Package Manager module that uses the
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

