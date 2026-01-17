---
title: Supabase
layout: docs
note: This documentation section is derived from https://raw.githubusercontent.com/skiptools/skip-supabase/main/README.md using the scripts/syncdocs.sh script. Do not change the file here, change it there.
---

:::note[Source Repository]{icon="github"}
The skip-supabase framework is available at [https://github.com/skiptools/skip-supabase.git](https://source.skip.tools/skip-supabase.git), which can be checked out and tested with `skip test` once Skip is [installed](/docs/gettingstarted/).
:::

This package provides Supabase support for [Skip Lite](/docs/status#skip_lite) transpiled Swift.
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
        .package(url: "https://source.skip.tools/skip-supabase.git", "0.0.0"..<"2.0.0"),
    ],
    targets: [
        .target(name: "MyTarget", dependencies: [
            .product(name: "SkipSupabase", package: "skip-supabase")
        ])
    ]
)
```

## Usage

:::caution
The current Supabase API coverage is currently very limited, and mostly used as a starting point.
:::

Browse the test cases at
[SkipSupabaseTests.swift](https://source.skip.tools/skip-supabase/blob/main/Tests/SkipSupabaseTests/SkipSupabaseTests.swift)
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
For examples of what is working, see the [SkipSupabaseTests.swift](https://source.skip.tools/skip-supabase/blob/main/Tests/SkipSupabaseTests/SkipSupabaseTests.swift)
test case, which also shows how setup can be performed.

Please file an [issue](https://source.skip.tools/skip-supabase/issues)
if there is a particular API that you need for you project, or if something isn't working right.
And please consider contributing to this project by filing
[pull requests](https://source.skip.tools/skip-supabase/pulls).

### Implementation Details

This package mimics the API shape of the
[supabase-swift](http://github.com/supabase/supabase-swift)
package by adapting it to the
[supabase-kt](https://github.com/supabase-community/supabase-kt)
project. Unlike other Skip API adaptations (like [Skip Firebase](/docs/modules/skip-firebase)),
this is a challenging task because the Swift and Kotlin interfaces to Supabase
were designed and implemented separately, and so their API shapes differ drastically.

For an example of some of the gymnastics that are required to achieve the goal is a single unified API,
see the implementation of
[SkipSupabase.swift](https://source.skip.tools/skip-supabase/blob/main/Sources/SkipSupabase/SkipSupabase.swift).


