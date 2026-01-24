---
title: SkipFuse
description: Documentation for SkipFuse fetched from GitHub.
note: This documentation section is derived from the GitHub README.md source using the scripts/sync-modules.mjs script. Do not make edits to the file here, change it there.
editUrl: https://github.com/skiptools/skip-fuse/edit/main/README.md
---

:::note[Source Repository <a href='https://github.com/skiptools/skip-fuse/releases' alt='Releases for skip-fuse'><img decoding='async' loading='lazy' alt='Releases for skip-fuse' src='https://img.shields.io/github/v/release/skiptools/skip-fuse.svg?style=flat' /></a>]{icon="github"}
This framework is available at [github.com/skiptools/skip-fuse](https://github.com/skiptools/skip-fuse) and can be checked out and improved locally as described in the [Contribution Guide](/docs/contributing/#local-libraries).
:::


SkipFuse helps fuse the Swift and Android worlds for [Skip Fuse](/docs/modes/#native) modules and apps. It is an umbrella framework that vends cross-platform functionality. For example, SkipFuse:

- Vends OSLog APIs on Android so that your OSLog messages appear in Android's Logcat logging.
- Transparently integrates your Swift `@Observables` into Jetpack Compose, so that they can transparently power Compose UI.
- Includes the `AnyDynamicObject` type for invoking Kotlin/Java API from compiled Swift with zero setup.

Skip will be enhancing SkipFuse over time to integrate many additional Swift foundational APIs with Android.

See the Skip [documentation](/docs/) for details.

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
        .package(url: "https://source.skip.dev/skip-fuse.git", from: "1.0.0"),
    ],
    targets: [
        .target(name: "MyTarget", dependencies: [
            .product(name: "SkipFuse", package: "skip-fuse")
        ])
    ]
)
```

