---
title: NFC
description: Documentation for NFC fetched from GitHub.
note: This documentation section is derived from the GitHub README.md source using the scripts/sync-modules.mjs script. Do not make edits to the file here, change it there.
editUrl: https://github.com/skiptools/skip-nfc/edit/main/README.md
---

:::note[Source Repository <a href='https://github.com/skiptools/skip-nfc/releases' alt='Releases for skip-nfc'><img decoding='async' loading='lazy' alt='Releases for skip-nfc' src='https://img.shields.io/github/v/release/skiptools/skip-nfc.svg?style=flat' /></a>]{icon="github"}
This framework is available at [github.com/skiptools/skip-nfc](https://github.com/skiptools/skip-nfc) and can be checked out and improved locally as described in the [Contribution Guide](/docs/contributing/#local-libraries).
:::


NFC (Near Field Communication) support for Skip apps on both iOS and Android.

## About

SkipNFC provides a unified Swift API for NFC tag reading, writing, and communication.
On iOS it wraps Apple's CoreNFC framework. On Android, the Swift code is transpiled to
Kotlin and uses the `android.nfc` APIs.

Supported capabilities:

- **NDEF message reading and writing** on all tag types
- **Tag type detection**: ISO-DEP (ISO 14443-4), NFC-V (ISO 15693), NFC-F (FeliCa), and MIFARE Classic
- **Tag UID access** for identifying individual tags
- **NDEF record creation** for text, URI, and MIME type payloads
- **NDEF record parsing** with convenience accessors for text and URL content
- **Raw transceive** for sending low-level commands to tags
- **Error handling** with typed `NFCError` cases
- **Polling options** for selecting which NFC technologies to scan for

## Setup

Add the dependency to your `Package.swift` file:

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

### Android

Add [android.permission.NFC](https://developer.android.com/reference/android/Manifest.permission.html#NFC) to your `AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.NFC" />
```

### iOS

Add the following to your entitlements and `Info.plist`:

- [Near Field Communication Tag Reader Session Formats Entitlements](https://developer.apple.com/documentation/bundleresources/entitlements/com_apple_developer_nfc_readersession_formats)
- [NFCReaderUsageDescription](https://developer.apple.com/documentation/bundleresources/information_property_list/nfcreaderusagedescription)
- [com.apple.developer.nfc.readersession.iso7816.select-identifiers](https://developer.apple.com/documentation/bundleresources/information_property_list/select-identifiers) (if using ISO 7816 tags)

```xml
<key>com.apple.developer.nfc.readersession.formats</key>
<array>
    <string>NDEF</string>
    <string>TAG</string>
</array>
<key>NFCReaderUsageDescription</key>
<string>This app requires access to NFC to read and write data to NFC tags.</string>
```

## Usage

### Scanning for NDEF Messages

The simplest use case is scanning for NDEF messages. Create an `NFCAdapter` and call
`startScanning` with a message handler:

```swift
import SkipNFC

let adapter = NFCAdapter()

adapter.startScanning(messageHandler: { message in
    for record in message.records {
        print("Record type: \(record.typeName)")
        if let text = record.textContent {
            print("Text: \(text)")
        }
        if let url = record.urlContent {
            print("URL: \(url)")
        }
    }
}, errorHandler: { error in
    print("NFC error: \(error)")
})

// When done:
adapter.stopScanning()
```

### Scanning for Tags

To interact with tags directly (read, write, or send commands), use the `tagHandler`:

```swift
let adapter = NFCAdapter(pollingOptions: [.iso14443, .iso15693])
adapter.alertMessage = "Hold your device near the NFC tag"

adapter.startScanning(tagHandler: { tag in
    print("Tag UID: \(tag.identifier.map { String(format: "%02X", $0) }.joined(separator: ":"))")

    Task {
        do {
            let message = try await tag.readMessage()
            for record in message.records {
                print("Record: \(record.textContent ?? "unknown")")
            }
        } catch {
            print("Failed to read: \(error)")
        }
    }
})
```

### Writing NDEF Messages

Create NDEF records and write them to a tag:

```swift
adapter.startScanning(tagHandler: { tag in
    Task {
        do {
            let textRecord = NDEFRecord.makeTextRecord(text: "Hello from Skip!")
            let uriRecord = NDEFRecord.makeURIRecord(url: "https://skip.dev")
            let message = NDEFMessage.makeMessage(records: [textRecord, uriRecord])
            try await tag.writeMessage(message)
            print("Write successful")
        } catch NFCError.tagReadOnly {
            print("Tag is read-only")
        } catch NFCError.tagNotNDEF {
            print("Tag does not support NDEF")
        } catch {
            print("Write failed: \(error)")
        }
    }
})
```

### Creating NDEF Records

SkipNFC provides factory methods for creating common NDEF record types:

```swift
// Text record with language code
let text = NDEFRecord.makeTextRecord(text: "Bonjour", locale: "fr")

// URI record
let uri = NDEFRecord.makeURIRecord(url: "https://skip.dev")

// MIME type record with arbitrary data
let json = NDEFRecord.makeMIMERecord(type: "application/json", data: jsonData)

// Compose into a message
let message = NDEFMessage.makeMessage(records: [text, uri, json])
```

### Parsing NDEF Records

Read the contents of NDEF records:

```swift
for record in message.records {
    switch record.typeName {
    case .nfcWellKnown:
        // Text or URI record
        if let text = record.textContent {
            print("Text: \(text)")
        } else if let url = record.urlContent {
            print("URL: \(url)")
        }
    case .media:
        // MIME type record
        let mimeType = String(data: record.type, encoding: .utf8) ?? ""
        print("MIME: \(mimeType), payload: \(record.payload.count) bytes")
    default:
        print("Other record type: \(record.typeName)")
    }
}
```

### Raw Tag Communication

For advanced use cases, send raw commands to a tag using `transceive`:

```swift
adapter.startScanning(pollingOptions: [.iso14443], tagHandler: { tag in
    guard let isoTag = tag as? NFCISODepTag else { return }

    Task {
        do {
            // Send an APDU command
            let command = Data([0x00, 0xA4, 0x04, 0x00])
            let response = try await isoTag.transceive(data: command)
            print("Response: \(response.map { String(format: "%02X", $0) }.joined())")
        } catch {
            print("Transceive failed: \(error)")
        }
    }
})
```

### Using a SwiftUI View

```swift
import SwiftUI
import SkipNFC

struct NFCScannerView: View {
    @State var adapter = NFCAdapter()
    @State var scannedText: String = ""
    @State var isScanning = false

    var body: some View {
        VStack(spacing: 16) {
            Text(scannedText.isEmpty ? "Tap Scan to read an NFC tag" : scannedText)
                .padding()

            Button(isScanning ? "Stop" : "Scan") {
                if isScanning {
                    adapter.stopScanning()
                    isScanning = false
                } else {
                    adapter.alertMessage = "Hold your device near the NFC tag"
                    adapter.startScanning(messageHandler: { message in
                        for record in message.records {
                            if let text = record.textContent {
                                scannedText = text
                            } else if let url = record.urlContent {
                                scannedText = url.absoluteString
                            }
                        }
                    }, errorHandler: { error in
                        scannedText = "Error: \(error)"
                    })
                    isScanning = true
                }
            }
        }
        .padding()
    }
}
```

## API Reference

### NFCAdapter

The main interface for NFC scanning.

| Property / Method | Description |
|---|---|
| `init(pollingOptions:)` | Create an adapter, optionally specifying which NFC technologies to scan for |
| `isAvailable: Bool` | Whether NFC hardware is available on this device |
| `isReady: Bool` | Whether NFC is enabled and ready for use |
| `alertMessage: String?` | The iOS prompt message shown during scanning |
| `startScanning(messageHandler:tagHandler:errorHandler:)` | Begin scanning for NFC tags |
| `stopScanning()` | Stop scanning |

### NFCAdapter.PollingOption

| Option | Description |
|---|---|
| `.iso14443` | ISO/IEC 14443 Type A/B (IsoDep, NfcA, NfcB) |
| `.iso15693` | ISO/IEC 15693 (NfcV) |
| `.iso18092` | NFC-F / FeliCa |
| `.pace` | PACE (iOS only) |

### NDEFMessage

| Property / Method | Description |
|---|---|
| `makeMessage(records:)` | Create a message from an array of records |
| `records: [NDEFRecord]` | The records in this message |

### NDEFRecord

| Property / Method | Description |
|---|---|
| `makeTextRecord(text:locale:)` | Create a well-known text record |
| `makeURIRecord(url:)` | Create a well-known URI record |
| `makeMIMERecord(type:data:)` | Create a MIME type record |
| `identifier: Data` | Record identifier |
| `type: Data` | Record type |
| `payload: Data` | Raw payload data |
| `typeName: TypeName` | The type name format (.nfcWellKnown, .media, etc.) |
| `textContent: String?` | Parse payload as text (nil if not a text record) |
| `urlContent: URL?` | Parse payload as URL (nil if not a URI record) |

### Tag Types

All tag types conform to `NFCTagImpl` and provide:

| Property / Method | Description |
|---|---|
| `identifier: Data` | The tag's unique identifier (UID) |
| `readMessage() async throws` | Read the NDEF message from the tag |
| `writeMessage(_:) async throws` | Write an NDEF message to the tag |
| `transceive(data:) async throws` | Send a raw command and receive a response |

| Tag Class | NFC Technology | iOS Type | Android Type |
|---|---|---|---|
| `NFCISODepTag` | ISO-DEP (ISO 14443-4) | `NFCISO7816Tag` | `IsoDep` |
| `NFCVTag` | NFC-V (ISO 15693) | `NFCISO15693Tag` | `NfcV` |
| `NFCFTag` | NFC-F (FeliCa) | `NFCFeliCaTag` | `NfcF` |
| `NFCMTag` | MIFARE Classic | `NFCMiFareTag` | `MifareClassic` |

`NFCISODepTag` also provides `historicalBytes: Data?` from the tag's answer-to-select response.

### NFCError

| Case | Description |
|---|---|
| `.notAvailable` | NFC hardware is not available |
| `.tagNotNDEF` | Tag does not support NDEF |
| `.tagReadOnly` | Tag is read-only |
| `.readFailed(String)` | Read operation failed |
| `.writeFailed(String)` | Write operation failed |
| `.connectionFailed(String)` | Connection to tag failed |
| `.transceiveFailed(String)` | Raw command failed |
| `.sessionError(String)` | Session or system error |

## Building

This project is a Swift Package Manager module that uses the
Skip plugin to build the package for both iOS and Android.

## Testing

The module can be tested using the standard `swift test` command
or by running the test target for the macOS destination in Xcode,
which will run the Swift tests as well as the transpiled
Kotlin JUnit tests in the Robolectric Android simulation environment.

Parity testing can be performed with `skip test`,
which will output a table of the test results for both platforms.

