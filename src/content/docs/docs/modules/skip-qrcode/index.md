---
title: SkipQRCode
description: Documentation for SkipQRCode fetched from GitHub.
note: This documentation section is derived from the GitHub README.md source using the scripts/sync-modules.mjs script. Do not make edits to the file here, change it there.
editUrl: https://github.com/skiptools/skip-qrcode/edit/main/README.md
---

:::note[Source Repository]{icon="github"}
This framework is available at [github.com/skiptools/skip-qrcode](https://github.com/skiptools/skip-qrcode) and can be checked out and improved locally as described in the [Contribution Guide](/docs/contributing/#local-libraries).
:::
# SkipQRCode

This is a free [Skip](https://skip.dev) Swift/Kotlin library project containing the following modules:

SkipQRCode

## Installation

Add SkipQRCode as a dependency in your `Package.swift`:

```swift
dependencies: [
    .package(url: "https://source.skip.dev/skip-qrcode.git", "0.0.1"..<"2.0.0")
],
targets: [
    .target(
        name: "YourApp",
        dependencies: [
            .product(name: "SkipQRCode", package: "skip-qrcode")
        ]
    )
]
```

## Quick Start

### Basic Usage

```swift
import SwiftUI
import SkipQRCode

struct ContentView: View {
    @State private var showScanner = false
    @State private var scannedCode: String?
    
    var body: some View {
        VStack(spacing: 20) {
            Button("Scan QR Code") {
                showScanner = true
            }
            .buttonStyle(.borderedProminent)
            
            if let code = scannedCode {
                Text("Scanned: \(code)")
                    .font(.headline)
            }
        }
        .sheet(isPresented: $showScanner) {
            #if os(iOS)
            BarcodeScannerView { code in
                scannedCode = code
                showScanner = false
            }
            .ignoresSafeArea()
            #elseif os(Android)
            // Android scanner launches as a native activity
            Color.clear
                .onAppear {
                    showScanner = false
                    AndroidBarcodeScanner.scan { code in
                        if let code = code {
                            scannedCode = code
                        }
                    }
                }
            #endif
        }
    }
}
```

### Advanced Example with Error Handling

```swift
import SwiftUI
import SkipQRCode

struct AdvancedScannerView: View {
    @State private var showScanner = false
    @State private var scannedCode: String?
    @State private var scanError: String?
    @State private var isScanning = false
    
    var body: some View {
        VStack(spacing: 20) {
            Text("QR Code Scanner")
                .font(.title)
            
            if let code = scannedCode {
                VStack(alignment: .leading, spacing: 8) {
                    Text("Scanned Code:")
                        .font(.caption)
                        .foregroundColor(.secondary)
                    Text(code)
                        .font(.body)
                        .padding()
                        .background(Color.gray.opacity(0.1))
                        .cornerRadius(8)
                }
                .padding()
            }
            
            if let error = scanError {
                Text("Error: \(error)")
                    .foregroundColor(.red)
                    .padding()
            }
            
            Button(action: startScanning) {
                HStack {
                    Image(systemName: "qrcode.viewfinder")
                    Text(isScanning ? "Scanning..." : "Scan QR Code")
                }
            }
            .buttonStyle(.borderedProminent)
            .disabled(isScanning)
        }
        .padding()
        .sheet(isPresented: $showScanner) {
            #if os(iOS)
            BarcodeScannerView { code in
                handleScanResult(code)
            }
            .ignoresSafeArea()
            #elseif os(Android)
            Color.clear
                .onAppear {
                    showScanner = false
                    performAndroidScan()
                }
            #endif
        }
    }
    
    private func startScanning() {
        scannedCode = nil
        scanError = nil
        isScanning = true
        showScanner = true
    }
    
    private func handleScanResult(_ code: String) {
        scannedCode = code
        showScanner = false
        isScanning = false
    }
    
    #if os(Android)
    private func performAndroidScan() {
        AndroidBarcodeScanner.scan { code in
            isScanning = false
            if let code = code {
                scannedCode = code
            } else {
                scanError = "Scan cancelled or failed"
            }
        }
    }
    #endif
}
```

## Platform-Specific Behavior

### iOS

**Implementation**: Uses VisionKit's `DataScannerViewController`
- Requires iOS 17.0+
- Full-screen camera interface
- Automatic barcode detection
- Built-in guidance overlay
- Pinch-to-zoom support
- High frame rate tracking

**Permissions**: Add camera usage description to your `Info.plist`:
```xml
<key>NSCameraUsageDescription</key>
<string>We need camera access to scan QR codes and barcodes</string>
```

### Android

**Implementation**: Uses Google ML Kit with CameraX
- Requires Android API 24+
- Native activity-based scanner
- ML Kit barcode detection
- Torch/flashlight control
- Portrait orientation

**Permissions**: Automatically merged from the package's `AndroidManifest.xml`:
- `android.permission.CAMERA`
- Camera hardware features (optional)

**Activities**: Scanner activities are automatically registered:
- `skip.qrcode.MLKitScanActivity` - Main scanner with camera
- `skip.qrcode.ScanHostActivity` - Activity launcher/bridge

## API Reference

### `AndroidBarcodeScanner`

A utility struct for launching the Android scanner.

```swift
public struct AndroidBarcodeScanner {
    public static func scan(completion: @escaping @Sendable (String?) -> Void)
}
```

**Parameters:**
- `completion`: Async callback invoked when scanning completes. Receives:
  - The scanned barcode string if successful
  - `nil` if the scan was cancelled or failed

**Usage:**
```swift
AndroidBarcodeScanner.scan { result in
    if let barcode = result {
        print("Scanned: \(barcode)")
    } else {
        print("Scan cancelled or failed")
    }
}
```

## Supported Barcode Types

SkipQRCode supports all common 1D and 2D barcode formats:

- **2D Codes**: QR Code, Data Matrix, Aztec, PDF417
- **1D Codes**: UPC-A, UPC-E, EAN-8, EAN-13
- **Other**: Code 39, Code 93, Code 128, ITF, Codabar
- **Specialized**: Driver's License, Calendar Events, Contact Info

## Architecture

SkipQRCode is a **transpiled Skip package with bridging support**, which means:

- ✅ **iOS**: Direct Swift → VisionKit (native iOS framework)
- ✅ **Android**: Swift → Transpiled Kotlin → ML Kit + CameraX
- ✅ **Bridging**: Automatically bridges to native SkipFuse apps
- ✅ **Platform Optimized**: Uses best-in-class libraries for each platform
- ✅ **Zero Setup**: Import once, works on both platforms

### Component Overview

```
iOS Side:
  SwiftUI → VisionKit DataScannerViewController

Android Side (Transpiled):
  Swift → AndroidBarcodeScanner.swift
    ↓ (transpiles to)
  Kotlin → ScanHostActivity → MLKitScanActivity
            (activity trampoline)  (CameraX + ML Kit scanner)
```

### How It Works

1. **On iOS**: Uses Apple's VisionKit for native barcode scanning
2. **On Android**: 
   - Swift code transpiles to Kotlin
   - Launches native Android Activities with ML Kit
   - Camera preview rendered programmatically (no XML resources)
   - Results passed back via polling mechanism

## Requirements

- **iOS**: 17.0 or later
- **Android**: API 24 (Android 7.0) or later
- **Skip**: 1.6.27 or later
- **Xcode**: 15.0 or later

## Building

This project uses the [Skip](https://skip.dev) plugin with native compilation mode.

Install Skip using [Homebrew](https://brew.sh):
```bash
brew install skiptools/skip/skip
```

Build the package:
```bash
swift build
```

## Testing

Run tests using:
```bash
swift test
```

For parity testing across platforms:
```bash
skip test
```

## Troubleshooting

### iOS

**Scanner doesn't appear:**
- Ensure you're running on iOS 17.0 or later
- Check that `NSCameraUsageDescription` is in your Info.plist
- Verify camera permissions are granted

**Scanner shows but doesn't scan:**
- Check that `DataScannerViewController.isSupported` returns true
- Ensure good lighting conditions
- Try different barcode types

### Android

**Scanner crashes on launch:**
- Verify all dependencies are properly resolved
- Check that camera permissions are declared in manifest
- Ensure device has a working camera

**Scanned results not returning:**
- Check LogCat for error messages (tag: `MLKitScanActivity`, `ScanHostActivity`)
- Ensure ML Kit dependencies are included
- Verify network connectivity (ML Kit may download models)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Setup

1. Clone the repository
2. Install Skip: `brew install skiptools/skip/skip`
3. Open in Xcode or your preferred IDE
4. Make your changes
5. Run tests: `swift test` or `skip test`
6. Submit a PR

## Credits

Built with [Skip](https://skip.dev) - Swift for iOS and Android

**Technologies Used:**
- iOS: VisionKit, SwiftUI
- Android: ML Kit, CameraX, Kotlin, Jetpack Compose

