---
title: SkipSocketIO
description: Documentation for SkipSocketIO fetched from GitHub.
note: This documentation section is derived from the GitHub README.md source using the scripts/sync-modules.mjs script. Do not make edits to the file here, change it there.
editUrl: https://github.com/skiptools/skip-socketio/edit/main/README.md
---

:::note[Source Repository]{icon="github"}
This framework is available at [github.com/skiptools/skip-socketio](https://github.com/skiptools/skip-socketio) and can be checked out and improved locally as described in the [Contribution Guide](/docs/contributing/#local-libraries).
:::
# SkipSocketIO

This is a [Skip](https://skip.dev) Swift/Kotlin library project that
abstracts the Socket.io [iOS](https://socket.io/blog/socket-io-on-ios/)
and [Android](https://socket.io/blog/native-socket-io-and-android/) APIs.

## About Socket.io

[Socket.IO](https://socket.io) is a library for real-time, event-based, bidirectional communication that provides a robust abstraction layer over various transport protocols (primarily WebSocket and HTTP long-polling). 

Key features of the Socket.IO library that go beyond the raw WebSocket protocol include: 

- Automatic reconnection with exponential backoff.
- Packet buffering and automatic acknowledgments.
- Event-driven communication with a simplified API (emit and on).
- Multiplexing through namespaces and broadcasting to rooms. 

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
        .package(url: "https://source.skip.dev/skip-socketio.git", "0.0.0"..<"2.0.0"),
    ],
    targets: [
        .target(name: "MyTarget", dependencies: [
            .product(name: "SkipSocketIO", package: "skip-socketio")
        ])
    ]
)
```

## API Compatibility

SkipSocketIO provides a similar API surface as the [SkipSocketIO Swift SDK](https://nuclearace.github.io/Socket.IO-Client-Swift/Classes/SocketIOClient.html) ([source](https://github.com/socketio/socket.io-client-swift)), ensuring a familiar development experience. All methods should behave identically on both iOS and Android platforms, allowing you to write once and deploy everywhere. On Android, the API calls are forwarded to their equivalents in the [Socket.IO Java SDK](https://socketio.github.io/socket.io-client-java/installation.html) ([source](https://github.com/socketio/socket.io-client-java)).

## Usage Examples

### Connection


```swift
let socket = SkipSocketIOClient(socketURL: URL(string: "https://example.org")!, options: [
    .compress,
    .path("/mypath/"),
    .secure(false),
    .forceNew(false),
    .forcePolling(false),
    .reconnects(true),
    .reconnectAttempts(5),
    .reconnectWait(2),
    .reconnectWaitMax(10),
    .extraHeaders(["X-Custom-Header": "Value"]),
])

socket.on("connection") { params in
    logger.log("socket connection established")
}

socket.connect()

socket.on("onUpdate") { params in
    logger.log("onUpdate event received with parameters: \(params)")
}

socket.emit("update", ["hello", 1, "2", Data()])

socket.disconnect()
```

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

