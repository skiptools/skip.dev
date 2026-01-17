---
title: SkipFuse
layout: docs
note: This documentation section is derived from https://raw.githubusercontent.com/skiptools/skip-fuse/main/README.md using the scripts/syncdocs.sh script. Do not change the file here, change it there.
---

:::note[Source Repository]{icon="github"}
The skip-fuse framework is available at [https://github.com/skiptools/skip-fuse.git](https://source.skip.tools/skip-fuse.git), which can be checked out and tested with `skip test` once Skip is [installed](/docs/gettingstarted/).
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
        .package(url: "https://source.skip.tools/skip-fuse.git", from: "1.0.0"),
    ],
    targets: [
        .target(name: "MyTarget", dependencies: [
            .product(name: "SkipFuse", package: "skip-fuse")
        ])
    ]
)
```

