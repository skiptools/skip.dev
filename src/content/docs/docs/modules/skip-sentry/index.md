---
title: Sentry
description: Documentation for Sentry fetched from GitHub.
note: This documentation section is derived from the GitHub README.md source using the scripts/sync-modules.mjs script. Do not make edits to the file here, change it there.
editUrl: https://github.com/skiptools/skip-sentry/edit/main/README.md
---

:::note[Source Repository <a href='https://github.com/skiptools/skip-sentry/releases' alt='Releases for skip-sentry'><img decoding='async' loading='lazy' alt='Releases for skip-sentry' src='https://img.shields.io/github/v/release/skiptools/skip-sentry.svg?style=flat' /></a>]{icon="github"}
This framework is available at [github.com/skiptools/skip-sentry](https://github.com/skiptools/skip-sentry) and can be checked out and improved locally as described in the [Contribution Guide](/docs/contributing/#local-libraries).
:::


[Sentry](https://sentry.io) error tracking and performance monitoring for Skip apps on both iOS and Android.

On iOS this wraps the [Sentry Cocoa SDK](https://docs.sentry.io/platforms/apple/guides/ios/) (v9.8+). On Android, the Swift code is transpiled to Kotlin via Skip Lite and wraps the [Sentry Android SDK](https://docs.sentry.io/platforms/android/) (v8.37).

## Setup

Add the dependency to your `Package.swift` file:

```swift
let package = Package(
    name: "my-package",
    products: [
        .library(name: "MyProduct", targets: ["MyTarget"]),
    ],
    dependencies: [
        .package(url: "https://source.skip.dev/skip-sentry.git", "0.0.0"..<"2.0.0"),
    ],
    targets: [
        .target(name: "MyTarget", dependencies: [
            .product(name: "SkipSentry", package: "skip-sentry")
        ])
    ]
)
```

### Sentry Project Setup

Create a [Sentry](https://sentry.io) project and obtain your DSN from **Settings > Projects > [Your Project] > Client Keys (DSN)**.

## Usage

### Initialization

Initialize Sentry early in your app's lifecycle:

```swift
import SkipSentry

@main struct MyApp: App {
    init() {
        SkipSentry.start(
            dsn: "https://examplePublicKey@o0.ingest.sentry.io/0",
            debug: false
        )
    }

    var body: some Scene {
        WindowGroup { ContentView() }
    }
}
```

### Advanced Configuration

Use the options-based initializer for full control:

```swift
SkipSentry.start { options in
    options.dsn = "https://examplePublicKey@o0.ingest.sentry.io/0"
    options.debug = false
    options.environment = "production"
    options.release = "1.0.0"
    options.dist = "1"
    options.sampleRate = 1.0                    // 0.0 to 1.0
    options.enableAutoSessionTracking = true
    options.sessionTrackingIntervalMillis = 30000
    options.attachStacktrace = true
    options.enableAppHangTracking = true         // iOS only
}
```

### Capturing Errors

```swift
do {
    try riskyOperation()
} catch {
    SkipSentry.capture(error: error)
}
```

### Capturing Messages

```swift
SkipSentry.capture(message: "User completed onboarding")
SkipSentry.capture(message: "Payment processing slow", level: .warning)
SkipSentry.capture(message: "Database connection lost", level: .error)
```

### Breadcrumbs

Breadcrumbs provide a trail of events leading up to an error:

```swift
SkipSentry.addBreadcrumb(message: "User tapped checkout button")

SkipSentry.addBreadcrumb(
    message: "Navigated to payment screen",
    category: "navigation"
)

SkipSentry.addBreadcrumb(
    message: "API request failed with 500",
    category: "http",
    level: .error
)

// Clear all breadcrumbs
SkipSentry.clearBreadcrumbs()
```

### User Context

Associate events with the current user:

```swift
SkipSentry.setUser(
    id: "user-12345",
    email: "user@example.com",
    username: "johndoe"
)

// Clear user on logout
SkipSentry.clearUser()
```

### Tags and Extras

Tags are indexed and searchable. Extras provide additional context but are not indexed.

```swift
// Tags (searchable in Sentry UI)
SkipSentry.setTag(key: "page", value: "checkout")
SkipSentry.setTag(key: "feature_flag", value: "new_flow")
SkipSentry.removeTag(key: "page")

// Extras (additional context)
SkipSentry.setExtra(key: "response_time", value: "1200ms")
SkipSentry.setExtra(key: "cart_items", value: "3")

// Set the scope level
SkipSentry.setLevel(.warning)
```

### Flushing Events

Force-send queued events:

```swift
SkipSentry.flush()                    // Default 5-second timeout
SkipSentry.flush(timeout: 10.0)       // Custom timeout
```

### SDK Status

```swift
if SkipSentry.isEnabled {
    print("Sentry is active")
}

if SkipSentry.crashedLastRun {
    print("App crashed during the last run")
}
```

### Closing the SDK

```swift
SkipSentry.close()
```

## API Reference

### SkipSentry

All methods are static on the `SkipSentry` class.

| Method | Description |
|---|---|
| `start(dsn:debug:)` | Initialize with a DSN |
| `start(configure:)` | Initialize with full options |
| `isEnabled: Bool` | Whether the SDK is initialized |
| `close()` | Release SDK resources |
| `capture(error:)` | Capture an error |
| `capture(message:level:)` | Capture a message |
| `addBreadcrumb(message:)` | Add a simple breadcrumb |
| `addBreadcrumb(message:category:level:)` | Add a categorized breadcrumb |
| `clearBreadcrumbs()` | Remove all breadcrumbs |
| `setUser(id:email:username:)` | Set the current user |
| `clearUser()` | Clear the current user |
| `setTag(key:value:)` | Set a searchable tag |
| `removeTag(key:)` | Remove a tag |
| `setExtra(key:value:)` | Set extra context |
| `setLevel(_:)` | Set the scope severity level |
| `flush(timeout:)` | Send queued events |
| `crashedLastRun: Bool` | Whether the app crashed last run |

### SkipSentryOptions

| Property | Type | Default | Description |
|---|---|---|---|
| `dsn` | `String?` | `nil` | Sentry Data Source Name |
| `debug` | `Bool` | `false` | Enable debug logging |
| `environment` | `String?` | `nil` | Environment name (e.g. "production") |
| `release` | `String?` | `nil` | Release version string |
| `dist` | `String?` | `nil` | Distribution identifier |
| `sampleRate` | `Double?` | `nil` | Error sample rate (0.0–1.0) |
| `enableAutoSessionTracking` | `Bool` | `true` | Auto-track sessions |
| `sessionTrackingIntervalMillis` | `Int?` | `nil` | Session tracking interval (ms) |
| `attachStacktrace` | `Bool` | `true` | Attach stack traces to events |
| `enableAppHangTracking` | `Bool` | `true` | Detect app hangs (iOS only) |

### SkipSentryLevel

| Case | Description |
|---|---|
| `.debug` | Debug-level message |
| `.info` | Informational message |
| `.warning` | Warning condition |
| `.error` | Error condition |
| `.fatal` | Fatal/critical error |

## Limitations

:::warning
The following features are **not yet available** in the Skip cross-platform wrapper:
:::
> - **Performance monitoring** (transactions, spans) — Use the native Sentry SDKs directly via `#if SKIP` / `#if !SKIP` blocks for transaction tracing.
> - **Attachments** — File attachments on events are not wrapped.
> - **User feedback dialog** — The Sentry feedback widget is not wrapped.
> - **Session replay** — Available on each platform's native SDK but not wrapped.
> - **Profiling** — Not wrapped.
> - **Metrics** — The custom metrics API is not wrapped.
> - **Feature flags** — The `addFeatureFlag` API is not wrapped.

:::note
**Platform-specific differences:**
:::
> - `enableAppHangTracking` is only available on iOS. It has no effect on Android.
> - `crashedLastRun` is deprecated on iOS (use `lastRunStatus` via the native SDK for more detail). On Android, returns `null` if unknown, which is treated as `false`.
> - `capture(error:)` on Android converts the error to a Java `Throwable` using Skip's standard error bridging. If the error already originates from a Java/Kotlin exception, it is passed directly. Otherwise, it is wrapped in an `Exception` with the error's `localizedDescription`.
> - `flush(timeout:)` takes seconds on iOS but milliseconds on Android. The wrapper converts automatically.
> - The `start()` methods on Android require an Android context (obtained from `ProcessInfo.processInfo.androidContext`), so they cannot be called in Robolectric unit tests.

## Building

This project is a Swift Package Manager module that uses the
Skip plugin to build the package for both iOS and Android.

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

