---
title: Socket.IO
description: Documentation for Socket.IO fetched from GitHub.
note: This documentation section is derived from the GitHub README.md source using the scripts/sync-modules.mjs script. Do not make edits to the file here, change it there.
editUrl: https://github.com/skiptools/skip-socketio/edit/main/README.md
---

:::note[Source Repository <a href='https://github.com/skiptools/skip-socketio/releases' alt='Releases for skip-socketio'><img decoding='async' loading='lazy' alt='Releases for skip-socketio' src='https://img.shields.io/github/v/release/skiptools/skip-socketio.svg?style=flat' /></a>]{icon="github"}
This framework is available at [github.com/skiptools/skip-socketio](https://github.com/skiptools/skip-socketio) and can be checked out and improved locally as described in the [Contribution Guide](/docs/contributing/#local-libraries).
:::


Real-time bidirectional communication with [Socket.IO](https://socket.io) for Skip apps on both iOS and Android.

## About

SkipSocketIO wraps the native Socket.IO client libraries for each platform:
- **iOS/macOS**: [socket.io-client-swift](https://github.com/socketio/socket.io-client-swift) (v16+)
- **Android**: [socket.io-client-java](https://github.com/socketio/socket.io-client-java) (v2.1)

Key features inherited from Socket.IO:

- Automatic reconnection with exponential backoff
- Packet buffering and automatic acknowledgments
- Event-driven communication with `emit` and `on`
- Multiplexing through namespaces
- Transport fallback (WebSocket with HTTP long-polling fallback)

## Setup

Add the dependency to your `Package.swift` file:

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

## Usage

### Connecting to a Server

Create a client and connect:

```swift
import SkipSocketIO

let socket = SkipSocketIOClient(socketURL: URL(string: "https://example.org")!, options: [
    .secure(true),
    .reconnects(true),
    .reconnectAttempts(5),
])

socket.on(SocketIOEvent.connect) { _ in
    print("Connected! Socket ID: \(socket.socketId ?? "unknown")")
}

socket.on(SocketIOEvent.disconnect) { _ in
    print("Disconnected")
}

socket.on(SocketIOEvent.connectError) { data in
    print("Connection error: \(data)")
}

socket.connect()
```

### Listening for Events

Use `on` for persistent listeners, or `once` for one-time handlers:

```swift
// Called every time the event fires
socket.on("chat message") { data in
    if let message = data.first as? String {
        print("Received: \(message)")
    }
}

// Called once, then automatically removed
socket.once("welcome") { data in
    print("Server welcome: \(data)")
}
```

### Removing Event Handlers

```swift
// Remove handlers for a specific event
socket.off("chat message")

// Remove all handlers
socket.removeAllHandlers()
```

### Catch-All Handler

Listen for every incoming event:

```swift
socket.onAny { eventName, data in
    print("Event '\(eventName)' received with data: \(data)")
}
```

### Emitting Events

Send events with data to the server:

```swift
// Simple string
socket.emit("chat message", ["Hello, world!"])

// Multiple items of different types
socket.emit("update", ["status", 42, true])

// With a send completion callback
socket.emit("save", ["data to save"]) {
    print("Event sent")
}
```

### Acknowledgements

Emit an event and receive an acknowledgement from the server:

```swift
socket.emitWithAck("get-users", ["room-1"]) { ackData in
    print("Server responded with: \(ackData)")
}
```

### Connection Status

Check the current connection state:

```swift
if socket.isConnected {
    print("Socket ID: \(socket.socketId ?? "")")
}

switch socket.status {
case .connected:    print("Connected")
case .connecting:   print("Connecting...")
case .disconnected: print("Disconnected")
case .notConnected: print("Never connected")
}
```

### Connect with Timeout

```swift
socket.connect(timeoutAfter: 5.0) {
    print("Connection timed out after 5 seconds")
}
```

### Namespaces

Use `SkipSocketIOManager` to connect to multiple namespaces on the same server:

```swift
let manager = SkipSocketIOManager(socketURL: URL(string: "https://example.org")!, options: [
    .reconnects(true),
    .forceWebsockets(true),
])

let defaultSocket = manager.defaultSocket()
let chatSocket = manager.socket(forNamespace: "/chat")
let adminSocket = manager.socket(forNamespace: "/admin")

chatSocket.on("message") { data in
    print("Chat message: \(data)")
}

adminSocket.on("notification") { data in
    print("Admin notification: \(data)")
}

defaultSocket.connect()
chatSocket.connect()
adminSocket.connect()
```

### Configuration Options

```swift
let socket = SkipSocketIOClient(socketURL: URL(string: "https://example.org")!, options: [
    // Transport
    .forceWebsockets(true),         // Use only WebSockets (no long-polling fallback)
    .forcePolling(true),            // Use only HTTP long-polling
    .compress,                      // Enable WebSocket compression
    .secure(true),                  // Use secure transports (wss://)
    .path("/custom-path/"),         // Custom Socket.IO server path

    // Reconnection
    .reconnects(true),              // Enable auto-reconnection
    .reconnectAttempts(10),         // Max reconnection attempts (-1 for infinite)
    .reconnectWait(1),              // Min seconds between reconnection attempts
    .reconnectWaitMax(30),          // Max seconds between reconnection attempts
    .randomizationFactor(0.5),      // Jitter factor for reconnection delay

    // Headers and parameters
    .extraHeaders(["Authorization": "Bearer token123"]),
    .connectParams(["userId": "abc"]),
    .auth(["token": "secret"]),

    // Other
    .forceNew(true),                // Always create a new engine
    .log(true),                     // Enable debug logging
    .selfSigned(true),              // Allow self-signed certificates (dev only)
    .enableSOCKSProxy(false),       // SOCKS proxy support
])
```

### SwiftUI Integration

```swift
import SwiftUI
import SkipSocketIO

struct ChatView: View {
    @State var messages: [String] = []
    @State var inputText: String = ""
    @State var socket = SkipSocketIOClient(
        socketURL: URL(string: "https://chat.example.org")!,
        options: [.reconnects(true)]
    )

    var body: some View {
        VStack {
            List(messages, id: \.self) { message in
                Text(message)
            }
            HStack {
                TextField("Message", text: $inputText)
                    .textFieldStyle(.roundedBorder)
                Button("Send") {
                    socket.emit("chat message", [inputText])
                    inputText = ""
                }
            }
            .padding()
        }
        .task {
            socket.on("chat message") { data in
                if let msg = data.first as? String {
                    messages.append(msg)
                }
            }
            socket.connect()
        }
    }
}
```

## API Reference

### SkipSocketIOClient

The primary interface for Socket.IO communication.

| Method / Property | Description |
|---|---|
| `init(socketURL:options:)` | Create a client for the given server URL |
| `connect()` | Connect to the server |
| `connect(timeoutAfter:handler:)` | Connect with a timeout callback |
| `disconnect()` | Disconnect from the server |
| `isConnected: Bool` | Whether the client is currently connected |
| `socketId: String?` | The server-assigned session ID |
| `status: SocketIOStatus` | Current connection status |
| `on(_:callback:)` | Register a persistent event handler |
| `once(_:callback:)` | Register a one-time event handler |
| `off(_:)` | Remove all handlers for an event |
| `removeAllHandlers()` | Remove all event handlers |
| `onAny(_:)` | Register a catch-all handler for all incoming events |
| `emit(_:_:completion:)` | Emit an event with data |
| `emitWithAck(_:_:ackCallback:)` | Emit an event and receive a server acknowledgement |

### SkipSocketIOManager

Manages connections and namespaces for a server.

| Method | Description |
|---|---|
| `init(socketURL:options:)` | Create a manager for the given server URL |
| `defaultSocket()` | Returns a client for the default namespace (`/`) |
| `socket(forNamespace:)` | Returns a client for the given namespace |

### SocketIOStatus

| Case | Description |
|---|---|
| `.notConnected` | Has never been connected |
| `.connecting` | Connection in progress |
| `.connected` | Currently connected |
| `.disconnected` | Was connected, now disconnected |

### SocketIOEvent

Standard event name constants.

| Constant | Value | Description |
|---|---|---|
| `SocketIOEvent.connect` | `"connect"` | Fired on successful connection |
| `SocketIOEvent.disconnect` | `"disconnect"` | Fired on disconnection |
| `SocketIOEvent.connectError` | `"connect_error"` | Fired on connection error |

### SkipSocketIOClientOption

| Option | Description | Android Support |
|---|---|---|
| `.compress` | WebSocket compression | Ignored |
| `.connectParams([String: Any])` | GET parameters for the connect URL | Ignored |
| `.extraHeaders([String: String])` | Extra HTTP headers | Supported |
| `.forceNew(Bool)` | Always create a new engine | Supported |
| `.forcePolling(Bool)` | HTTP long-polling only | Supported |
| `.forceWebsockets(Bool)` | WebSockets only | Supported |
| `.enableSOCKSProxy(Bool)` | SOCKS proxy | Ignored |
| `.log(Bool)` | Debug logging | Ignored |
| `.path(String)` | Custom Socket.IO path | Supported |
| `.reconnects(Bool)` | Auto-reconnection | Supported |
| `.reconnectAttempts(Int)` | Max reconnection attempts | Supported |
| `.reconnectWait(Int)` | Min seconds before reconnect | Supported |
| `.reconnectWaitMax(Int)` | Max seconds before reconnect | Supported |
| `.randomizationFactor(Double)` | Reconnect jitter | Supported |
| `.secure(Bool)` | Secure transports | Supported |
| `.selfSigned(Bool)` | Self-signed certs (dev only) | Ignored |
| `.auth([String: Any])` | Authentication payload | Ignored |

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

