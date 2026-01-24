---
title: SkipSupabase
description: Documentation for SkipSupabase fetched from GitHub.
note: This documentation section is derived from the GitHub README.md source using the scripts/sync-modules.mjs script. Do not make edits to the file here, change it there.
editUrl: https://github.com/skiptools/skip-supabase/edit/main/README.md
---

:::note[Source Repository]{icon="github"}
This framework is available at [github.com/skiptools/skip-supabase](https://github.com/skiptools/skip-supabase) and can be checked out and improved locally as described in the [Contribution Guide](/docs/contributing/#local-libraries).
:::
# SkipSupabase

This package provides Supabase support for [Skip Lite](https://skip.dev) transpiled Swift.
The Swift side uses the official Supabase iOS SDK directly,
with the various `SkipSupabase*` modules passing the transpiled calls
through to the community Supabase Android SDK.

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
        .package(url: "https://source.skip.dev/skip-supabase.git", "0.0.0"..<"2.0.0"),
    ],
    targets: [
        .target(name: "MyTarget", dependencies: [
            .product(name: "SkipSupabase", package: "skip-supabase")
        ])
    ]
)
```

## Usage

:::warning
The current Supabase API coverage is currently very limited, and mostly used as a starting point.
:::

Browse the test cases at
[SkipSupabaseTests.swift](https://source.skip.dev/skip-supabase/blob/main/Tests/SkipSupabaseTests/SkipSupabaseTests.swift)
to see what API is supported.

:::note
[Skip Fuse](/docs/modes/) native apps can use the [Supabase Swift API](https://supabase.com/docs/reference/swift) directly without needing this package.
:::

## Package

The modules in the SkipSupabase framework project mirror the division of the SwiftPM
modules in the Supabase iOS SDK (at [http://github.com/supabase/supabase-swift](http://github.com/supabase/supabase-swift)),
which is generally mirrored in the division of the Supabase Kotlin Android gradle modules (at [https://github.com/supabase-community/supabase-kt](https://github.com/supabase-community/supabase-kt)).

## Status

This project is in a very early stage, but some amount of Auth and Database API is implemented.
For examples of what is working, see the [SkipSupabaseTests.swift](https://source.skip.dev/skip-supabase/blob/main/Tests/SkipSupabaseTests/SkipSupabaseTests.swift)
test case, which also shows how setup can be performed.

Please file an [issue](https://source.skip.dev/skip-supabase/issues)
if there is a particular API that you need for you project, or if something isn't working right.
And please consider contributing to this project by filing
[pull requests](https://source.skip.dev/skip-supabase/pulls).

### Implementation Details

This package mimics the API shape of the
[supabase-swift](http://github.com/supabase/supabase-swift)
package by adapting it to the
[supabase-kt](https://github.com/supabase-community/supabase-kt)
project. Unlike other Skip API adaptations (like [Skip Firebase](https://source.skip.dev/skip-firebase)),
this is a challenging task because the Swift and Kotlin interfaces to Supabase
were designed and implemented separately, and so their API shapes differ drastically.

For an example of some of the gymnastics that are required to achieve the goal is a single unified API,
see the implementation of
[SkipSupabase.swift](https://source.skip.dev/skip-supabase/blob/main/Sources/SkipSupabase/SkipSupabase.swift).


