---
title: Auth0
description: Documentation for Auth0 fetched from GitHub.
note: This documentation section is derived from the GitHub README.md source using the scripts/sync-modules.mjs script. Do not make edits to the file here, change it there.
editUrl: https://github.com/skiptools/skip-auth0/edit/main/README.md
---

:::note[Source Repository <a href='https://github.com/skiptools/skip-auth0/releases' alt='Releases for skip-auth0'><img decoding='async' loading='lazy' alt='Releases for skip-auth0' src='https://img.shields.io/github/v/release/skiptools/skip-auth0.svg?style=flat' /></a>]{icon="github"}
This framework is available at [github.com/skiptools/skip-auth0](https://github.com/skiptools/skip-auth0) and can be checked out and improved locally as described in the [Contribution Guide](/docs/contributing/#local-libraries).
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

