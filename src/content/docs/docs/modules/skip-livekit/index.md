---
title: WebRTC (LiveKit)
description: Documentation for WebRTC (LiveKit) fetched from GitHub.
note: This documentation section is derived from the GitHub README.md source using the scripts/sync-modules.mjs script. Do not make edits to the file here, change it there.
editUrl: https://github.com/skiptools/skip-livekit/edit/main/README.md
---

:::note[Source Repository <a href='https://github.com/skiptools/skip-livekit/releases' alt='Releases for skip-livekit'><img decoding='async' loading='lazy' alt='Releases for skip-livekit' src='https://img.shields.io/github/v/release/skiptools/skip-livekit.svg?style=flat' /></a>]{icon="github"}
This framework is available at [github.com/skiptools/skip-livekit](https://github.com/skiptools/skip-livekit) and can be checked out and improved locally as described in the [Contribution Guide](/docs/contributing/#local-libraries).
:::


SkipLiveKit provides a cross-platform [LiveKit](https://livekit.io) integration for Skip apps. It wraps the LiveKit [Swift SDK](https://github.com/livekit/client-sdk-swift) on iOS and the LiveKit [Android SDK](https://github.com/livekit/client-sdk-android) on Android behind a unified SwiftUI API, so you can add real-time video and audio rooms to your app without writing any platform-specific code.

## Setup

Add SkipLiveKit to your `Package.swift`:

```swift
dependencies: [
    .package(url: "https://source.skip.tools/skip-livekit.git", "0.0.0"..<"2.0.0"),
],
targets: [
    .target(name: "MyApp", dependencies: [
        .product(name: "SkipLiveKit", package: "skip-livekit"),
    ]),
]
```

### Android Permissions

Your `AndroidManifest.xml` must include the following permissions for camera, microphone, and network access:

```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.RECORD_AUDIO" />
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
```

### iOS Permissions

Add these keys to your `Darwin/AppName.xcconfig`:

```
INFOPLIST_KEY_NSCameraUsageDescription = "This app needs camera access for video calls";
INFOPLIST_KEY_NSMicrophoneUsageDescription = "This app needs microphone access for audio calls";
```

## Quick Start

The fastest way to add a video room to your app is with `LiveKitRoomView`. It handles connection, participant display, and media controls:

```swift
import SwiftUI
import SkipLiveKit

struct CallView: View {
    var body: some View {
        LiveKitRoomView(
            url: "wss://your-server.livekit.cloud",
            token: "your-jwt-access-token"
        )
    }
}
```

This renders a participant grid with controls for camera, microphone, screen sharing, camera flip, speakerphone, and hang-up. It connects automatically when the view appears. Participant tiles show connection quality indicators, speaking highlights, and screen share status.

## Using LiveKitRoomManager

For more control over the room lifecycle, use `LiveKitRoomManager` directly:

```swift
import SwiftUI
import SkipLiveKit

struct MyRoomView: View {
    @StateObject var room = LiveKitRoomManager()

    var body: some View {
        VStack {
            Text("Room: \(room.roomName ?? "Not connected")")
            Text("State: \(room.connectionState.rawValue)")
            Text("Participants: \(room.participants.count)")

            if room.connectionState == .connected {
                HStack {
                    Button(room.isMicrophoneEnabled ? "Mute" : "Unmute") {
                        Task { try? await room.setMicrophoneEnabled(!room.isMicrophoneEnabled) }
                    }
                    Button(room.isCameraEnabled ? "Camera Off" : "Camera On") {
                        Task { try? await room.setCameraEnabled(!room.isCameraEnabled) }
                    }
                    Button("Leave") {
                        Task { await room.disconnect() }
                    }
                }
            }
        }
        .task {
            do {
                try await room.connect(
                    url: "wss://your-server.livekit.cloud",
                    token: "your-jwt-access-token"
                )
            } catch {
                print("Connection failed: \(error)")
            }
        }
    }
}
```

### LiveKitRoomManager API

**Published Properties:**

| Property | Type | Description |
|---|---|---|
| `connectionState` | `LiveKitConnectionState` | Current state: `.disconnected`, `.connecting`, `.connected`, `.reconnecting` |
| `participants` | `[LiveKitParticipantInfo]` | All participants including the local user |
| `roomName` | `String?` | The name of the connected room |
| `roomMetadata` | `String?` | Server-assigned metadata for the room |
| `isCameraEnabled` | `Bool` | Whether the local camera is active |
| `isMicrophoneEnabled` | `Bool` | Whether the local microphone is active |
| `isScreenShareEnabled` | `Bool` | Whether the local screen share is active |
| `isSpeakerphoneEnabled` | `Bool` | Whether audio is routed to the speakerphone (default `true`) |
| `isFrontCamera` | `Bool` | Whether the front-facing camera is selected (default `true`) |
| `errorMessage` | `String?` | Error description if connection failed |

**Callbacks:**

| Property | Type | Description |
|---|---|---|
| `onDataReceived` | `((String?, Data, String?) -> Void)?` | Called when a data message arrives. Parameters: sender identity, data, topic. |

**Methods:**

| Method | Type | Description |
|---|---|---|
| `connect(url:token:)` | `async throws` | Connect to a LiveKit server |
| `disconnect()` | `async` | Disconnect from the current room |
| `setCameraEnabled(_:)` | `async throws` | Toggle the local camera |
| `setMicrophoneEnabled(_:)` | `async throws` | Toggle the local microphone |
| `setScreenShareEnabled(_:)` | `async throws` | Toggle local screen sharing |
| `setSpeakerphoneEnabled(_:)` | | Toggle between speakerphone and earpiece audio output |
| `switchCamera()` | `async throws` | Switch between front and back camera |
| `publishData(_:reliability:topic:)` | `async throws` | Send data to other participants (reliable or lossy) |
| `updateParticipants()` | | Refresh the participant list from room state |

### LiveKitParticipantInfo

Each participant is represented as a simple value type:

```swift
public struct LiveKitParticipantInfo: Identifiable {
    public let id: String
    public let identity: String
    public let name: String
    public let metadata: String?
    public let isSpeaking: Bool
    public let audioLevel: Float
    public let connectionQuality: LiveKitConnectionQuality
    public let isCameraEnabled: Bool
    public let isMicrophoneEnabled: Bool
    public let isScreenShareEnabled: Bool
    public let isLocal: Bool
}
```

### LiveKitConnectionQuality

Connection quality reported per-participant: `.unknown`, `.lost`, `.poor`, `.good`, `.excellent`.

### LiveKitDataReliability

Controls data message delivery: `.reliable` (ordered, guaranteed — like TCP) or `.lossy` (fast, unordered — like UDP).

### Sending and Receiving Data

```swift
// Send a message to all participants
let message = "Hello!".data(using: .utf8)!
try await room.publishData(message, reliability: .reliable, topic: "chat")

// Receive messages
room.onDataReceived = { senderIdentity, data, topic in
    if let text = String(data: data, encoding: .utf8) {
        print("\(senderIdentity ?? "unknown"): \(text)")
    }
}
```

## Development and Testing View

`LiveKitConnectView` provides a simple form for entering a server URL and token, useful during development:

```swift
import SkipLiveKit

struct DevView: View {
    var body: some View {
        NavigationStack {
            LiveKitConnectView { url, token in
                LiveKitRoomView(url: url, token: token)
            }
        }
    }
}
```

## Platform Implementation

SkipLiveKit is a [Skip Lite](/docs/modes/#lite) module. The Swift source is transpiled to Kotlin for Android.

On iOS, SkipLiveKit uses the [LiveKit Swift SDK](https://github.com/livekit/client-sdk-swift) (`client-sdk-swift` v2.3+). Room management, participant tracking, and media control all go through the Swift `Room` class.

On Android, the transpiled Kotlin code uses the [LiveKit Android SDK](https://github.com/livekit/client-sdk-android) (`livekit-android` v2.24+). The `io.livekit.android.LiveKit.create(context)` factory creates a `Room` instance, and all participant and media APIs are accessed through the Android SDK's Kotlin API.

Platform differences in property types (such as Kotlin inline classes for participant IDs) are handled internally so the public API is identical on both platforms.

## Building

This project is a free Swift Package Manager module that uses the
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

