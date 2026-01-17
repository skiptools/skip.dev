---
title: Keychain
layout: docs
note: This documentation section is derived from https://raw.githubusercontent.com/skiptools/skip-keychain/main/README.md using the scripts/syncdocs.sh script. Do not change the file here, change it there.
---

:::note[Source Repository]{icon="github"}
The skip-keychain framework is available at [https://github.com/skiptools/skip-keychain.git](https://source.skip.tools/skip-keychain.git), which can be checked out and tested with `skip test` once Skip is [installed](/docs/gettingstarted/).
:::

This is a Skip Swift/Kotlin library project providing a simple unified API to secure key/value storage. It uses the Keychain on Darwin platforms and `EncyptedSharedPreferences` on Android.

<div align="center">
<video id="intro_video" style="height: 500px;" autoplay muted loop playsinline>
  <source style="width: 100;" src="https://assets.skip.dev/videos/skip-keychain.mov" type="video/mp4">
  Your browser does not support the video tag.
</video>
</div>

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
        .package(url: "https://source.skip.tools/skip-keychain.git", "0.0.0"..<"2.0.0"),
    ],
    targets: [
        .target(name: "MyTarget", dependencies: [
            .product(name: "SkipKeychain", package: "skip-keychain")
        ])
    ]
)
```

## Usage

```swift
import SkipKeychain

let keychain = Keychain.shared

try keychain.set("value", forKey: "key")
assert(keychain.string(forKey: "key") == "value")

try keychain.removeValue(forKey: "key")
assert(keychain.string(forKey: "key") == nil)
```

## Backups

Google recommends excluding encrypted shared preference files from backups to prevent restoring an encrypted file whose encryption key is lost. If your app targets devices running Android 11 or lower, follow the instructions [here](https://developer.android.com/identity/data/autobackup#include-exclude-android-11) to create backup rules for your app and reference them from your `AndroidManifest.xml`. Your rules file should exclude SkipKeychain's shared preferences, like so:

```xml
<?xml version="1.0" encoding="utf-8"?>
<full-backup-content>
    <exclude domain="sharedpref" path="tools.skip.SkipKeychain.xml"/>
</full-backup-content>
```

For newer devices, follow [these instructions](https://developer.android.com/identity/data/autobackup#include-exclude-android-12) in addition to the steps above for older devices. Your additional rules file should contain the fllowing:

```xml
<?xml version="1.0" encoding="utf-8"?>
<data-extraction-rules>
  <cloud-backup>
    <exclude domain="sharedpref" path="tools.skip.SkipKeychain.xml"/>
  </cloud-backup>
  <device-transfer>
    <exclude domain="sharedpref" path="tools.skip.SkipKeychain.xml"/>
  </device-transfer>
</data-extraction-rules>
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

## Contributing

We welcome contributions to this package in the form of enhancements and bug fixes.

The general flow for contributing to this and any other Skip package is:

1. Fork this repository and enable actions from the "Actions" tab
2. Check out your fork locally
3. When developing alongside a Skip app, add the package to a [shared workspace](/docs/contributing) to see your changes incorporated in the app
4. Push your changes to your fork and ensure the CI checks all pass in the Actions tab
5. Add your name to the Skip [Contributor Agreement](https://source.skip.tools/clabot-config)
6. Open a Pull Request from your fork with a description of your changes

