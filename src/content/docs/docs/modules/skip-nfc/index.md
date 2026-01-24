---
title: SkipNFC
description: Documentation for SkipNFC fetched from GitHub.
note: This documentation section is derived from the GitHub README.md source using the scripts/sync-modules.mjs script. Do not make edits to the file here, change it there.
editUrl: https://github.com/skiptools/skip-nfc/edit/main/README.md
---

:::note[Source Repository]{icon="github"}
This framework is available at [github.com/skiptools/skip-nfc](https://github.com/skiptools/skip-nfc) and can be checked out and improved locally as described in the [Contribution Guide](/docs/contributing/#local-libraries).
:::
# SkipNFC

This package provides rudimentary support for Android and iOS NFC interaction
for [Skip](https://skip.dev) apps.

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
        .package(url: "https://source.skip.dev/skip-nfc.git", "0.0.0"..<"2.0.0"),
    ],
    targets: [
        .target(name: "MyTarget", dependencies: [
            .product(name: "SkipNFC", package: "skip-nfc")
        ])
    ]
)
```

## Usage

```swift
let nfcAdapter: NFCAdapter = NFCAdapter()
nfcAdapter.startScanning { message in
    print("received message: \(message)")
}
nfcAdapter.stopScanning()
```

## Setup

### Android

* Add [android.permission.NFC](https://developer.android.com/reference/android/Manifest.permission.html#NFC) to your `AndroidManifest.xml`.

### iOS

* Add [Near Field Communication Tag Reader Session Formats Entitlements](https://developer.apple.com/documentation/bundleresources/entitlements/com_apple_developer_nfc_readersession_formats) to your entitlements.
* Add [NFCReaderUsageDescription](https://developer.apple.com/documentation/bundleresources/information_property_list/nfcreaderusagedescription) to your `Darwin/Info.plist`.
* Add [com.apple.developer.nfc.readersession.iso7816.select-identifiers](https://developer.apple.com/documentation/bundleresources/information_property_list/select-identifiers) to your `Darwin/Info.plist` as needed.

For example:

```xml
<key>com.apple.developer.nfc.readersession.formats</key>
<array>
    <string>NDEF</string>
</array>
<key>NSNFCReaderUsageDescription</key>
<string>This app requires access to NFC to read and write data to NFC tags.</string>
```


## Building

This project is a free Swift Package Manager module that uses the
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

