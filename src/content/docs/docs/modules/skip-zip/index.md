---
title: Zip
description: Documentation for Zip fetched from GitHub.
note: This documentation section is derived from the GitHub README.md source using the scripts/sync-modules.mjs script. Do not make edits to the file here, change it there.
editUrl: https://github.com/skiptools/skip-zip/edit/main/README.md
---

:::note[Source Repository <a href='https://github.com/skiptools/skip-zip/releases' alt='Releases for skip-zip'><img decoding='async' loading='lazy' alt='Releases for skip-zip' src='https://img.shields.io/github/v/release/skiptools/skip-zip.svg?style=flat' /></a>]{icon="github"}
This framework is available at [github.com/skiptools/skip-zip](https://github.com/skiptools/skip-zip) and can be checked out and improved locally as described in the [Contribution Guide](/docs/contributing/#local-libraries).
:::


SkipZip is a Skip framework that provides support for creating and extracting zip archives.

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
        .package(url: "https://source.skip.dev/skip-zip.git", "0.0.0"..<"2.0.0"),
    ],
    targets: [
        .target(name: "MyTarget", dependencies: [
            .product(name: "SkipZip", package: "skip-zip")
        ])
    ]
)
```

## Usage

### Local Zip Archives

Use `ZipReader` and `ZipWriter` for working with zip files on disk:

```swift
import SkipZip

// Reading a zip file
if let reader = ZipReader(path: "/path/to/archive.zip") {
    try reader.first()
    while true {
        if let name = try reader.currentEntryName {
            print("Entry: \(name)")
        }
        if let data = try reader.currentEntryData {
            // Process entry data...
        }
        if !(try reader.next()) { break }
    }
    try reader.close()
}

// Writing a zip file
if let writer = ZipWriter(path: "/path/to/output.zip", append: false) {
    try writer.add(path: "hello.txt", data: "Hello, World!".data(using: .utf8)!, compression: 5)
    try writer.close()
}
```

### Remote Zip Archives

`RemoteZipReader` allows reading individual entries from a remote zip archive over HTTP
without downloading the entire file. It uses HTTP Range requests to fetch only the
archive's central directory (metadata) and the specific entries you request.

This is useful for selectively extracting files from large remote archives where
downloading the full archive would be impractical.

**Requirements:** The HTTP server must support Range requests (indicated by the
`Accept-Ranges: bytes` header). If the server does not support range requests,
the operation will fail with a descriptive error.

```swift
import SkipZip

// Open a remote zip archive (fetches only the metadata)
let reader = try await RemoteZipReader.open(url: URL(string: "https://example.com/archive.zip")!)

// Browse entries without downloading their data
for entry in reader.entries {
    print("\(entry.name): \(entry.uncompressedSize) bytes")
}

// Fetch and decompress a specific entry
let data = try await reader.data(forEntryNamed: "README.md")
print(String(data: data, encoding: .utf8)!)
```

#### Configuration

`RemoteZipConfiguration` controls retry behavior for transient network failures.
Retryable conditions include network errors and HTTP status codes 429, 502, 503, and 504.

```swift
let config = RemoteZipConfiguration(
    maxRetries: 5,                 // Retry up to 5 times (default: 3)
    initialBackoffInterval: 1.0,   // Wait 1 second before first retry (default: 0.5)
    backoffMultiplier: 2.0,        // Double the wait time after each retry (default: 2.0)
    maxBackoffInterval: 60.0,      // Cap backoff at 60 seconds (default: 30.0)
    endOfFileReadSize: 131_072     // Read last 128KB to find EOCD (default: 65536)
)

let reader = try await RemoteZipReader.open(
    url: archiveURL,
    session: myURLSession,        // Optional: provide a custom URLSession
    configuration: config
)
```

#### Custom URLSession

You can pass a custom `URLSession` for authentication, caching, or proxy configuration:

```swift
let sessionConfig = URLSessionConfiguration.default
sessionConfig.httpAdditionalHeaders = ["Authorization": "Bearer token123"]
let session = URLSession(configuration: sessionConfig)

let reader = try await RemoteZipReader.open(url: archiveURL, session: session)
```

#### Error Handling

All errors are reported as `RemoteZipError` with descriptive messages:

```swift
do {
    let reader = try await RemoteZipReader.open(url: archiveURL)
    let data = try await reader.data(forEntryNamed: "file.txt")
} catch let error as RemoteZipError {
    switch error {
    case .serverDoesNotSupportRangeRequests:
        print("Server doesn't support Range requests")
    case .entryNotFound(let name):
        print("Entry '\(name)' not found")
    case .retryLimitExceeded(let count, let lastError):
        print("Failed after \(count) retries: \(lastError)")
    default:
        print(error.localizedDescription)
    }
}
```

#### Supported Compression Methods

`RemoteZipReader` supports the two most common zip compression methods:

- **STORE** (method 0): No compression; data is returned as-is.
- **DEFLATE** (method 8): Standard zip compression; data is decompressed automatically.

ZIP64 extensions are supported for archives and entries larger than 4 GB.

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

