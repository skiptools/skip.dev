---
title: SkipScript
description: Documentation for SkipScript fetched from GitHub.
note: This documentation section is derived from the GitHub README.md source using the scripts/sync-modules.mjs script. Do not make edits to the file here, change it there.
editUrl: https://github.com/skiptools/skip-script/edit/main/README.md
---

:::note[Source Repository]{icon="github"}
This framework is available at [github.com/skiptools/skip-script](https://github.com/skiptools/skip-script) and can be checked out and improved locally as described in the [Contribution Guide](/docs/contributing/#local-libraries).
:::
SkipScript provides a unified interface to the JavaScriptCore script engine on
both iOS (using the platform-provided JavaScriptCore libraries) and
on Android (using the bundled libjsc.so library). SkipScript enables
a single scripting language (JavaScript) to be embedded in a dual-platform
Skip app and provide the exact same behavior on both platforms.

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
        .package(url: "https://source.skip.dev/skip-script.git", from: "1.0.0"),
    ],
    targets: [
        .target(name: "MyTarget", dependencies: [
            .product(name: "SkipScript", package: "skip-script")
        ])
    ]
)
```

# Usage

:::note
Note that SkipScript will automatically be imported when it is included
:::
as a dependency and a Swift source file imports the `JavaScriptCore` framework.

In this case, a subset of the the Objective-C JavaScriptAPI is mimicked on the
Kotlin side, passing the calls through to the underlying C interface to the 
JavaScriptCore API using JNA and [SkipFFI](https://source.skip.dev/skip-ffi/).


An example of evaluating some JavaScript:

```swift
import SkipScript

let ctx = try JSContext()
let num = ctx.evaluateScript("1 + 2.3")
assert(num.toDouble() == 3.3)

```

**NOTE**: JIT compilation is blocked on iOS without a special entitlement, which can drastically impact the performance of JavaScriptCore on iOS compared to either macOS or Android (where JIT is not blocked).

## Implementation

On iOS and other Darwin platforms, the built-in `JavaScriptCore` libraries will be used. 

Android, on the other hand, does not ship JSC as part of the operating system, and so the dependency on the Android side will utilize the `org.webkit:android-jsc` package to bundle a native build of JavaScriptCore with the app itself. This will increase the total Android bundle size by between 5-10Mb.


## Building

This project is a Swift Package Manager module that uses the
[Skip](https://skip.dev) plugin to transpile Swift into Kotlin.

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

