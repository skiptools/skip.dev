---
title: PostHog
description: Documentation for PostHog fetched from GitHub.
note: This documentation section is derived from the GitHub README.md source using the scripts/sync-modules.mjs script. Do not make edits to the file here, change it there.
editUrl: https://github.com/skiptools/skip-posthog/edit/main/README.md
---

:::note[Source Repository <a href='https://github.com/skiptools/skip-posthog/releases' alt='Releases for skip-posthog'><img decoding='async' loading='lazy' alt='Releases for skip-posthog' src='https://img.shields.io/github/v/release/skiptools/skip-posthog.svg?style=flat' /></a>]{icon="github"}
This framework is available at [github.com/skiptools/skip-posthog](https://github.com/skiptools/skip-posthog) and can be checked out and improved locally as described in the [Contribution Guide](/docs/contributing/#local-libraries).
:::


[PostHog](https://posthog.com) product analytics for Skip apps on both iOS and Android.

On iOS this wraps the [PostHog iOS SDK](https://posthog.com/docs/libraries/ios) (v3.0+). On Android, the Swift code is transpiled to Kotlin via Skip Lite and wraps the [PostHog Android SDK](https://posthog.com/docs/libraries/android) (v3.x).

## Setup

Add the dependency to your `Package.swift` file:

```swift
let package = Package(
    name: "my-package",
    products: [
        .library(name: "MyProduct", targets: ["MyTarget"]),
    ],
    dependencies: [
        .package(url: "https://source.skip.dev/skip-posthog.git", "0.0.0"..<"2.0.0"),
    ],
    targets: [
        .target(name: "MyTarget", dependencies: [
            .product(name: "SkipPostHog", package: "skip-posthog")
        ])
    ]
)
```

## Configuration

Initialize PostHog when your app starts:

```swift
import SkipPostHog

PostHogSDK.shared.setup(
    PostHogConfig(apiKey: "phc_your_project_api_key")
)
```

For self-hosted instances:

```swift
PostHogSDK.shared.setup(
    PostHogConfig(apiKey: "phc_your_project_api_key", host: "https://your-posthog-instance.com")
)
```

### Advanced Configuration

```swift
let config = PostHogConfig(apiKey: "phc_your_project_api_key")

// Event batching
config.flushAt = 20                          // Send after 20 events
config.flushIntervalSeconds = 30             // Or every 30 seconds
config.maxQueueSize = 1000                   // Max queued events
config.maxBatchSize = 50                     // Max events per batch

// Automatic capture
config.captureApplicationLifecycleEvents = true
config.captureScreenViews = true

// Feature flags
config.sendFeatureFlagEvent = true           // Emit $feature_flag_called events
config.preloadFeatureFlags = true            // Preload on startup

// Person profiles
config.personProfiles = .identifiedOnly      // .never, .always, or .identifiedOnly

// Session replay
config.sessionReplay = true                  // Enable session recording

// Surveys
config.surveys = true                        // Enable in-app surveys

// Debug logging
config.debug = true                          // Enable debug output

// Privacy
config.optOut = false                        // Start opted-in (default)

PostHogSDK.shared.setup(config)
```

## Event Tracking

```swift
// Simple event
PostHogSDK.shared.capture("button_clicked")

// Event with properties
PostHogSDK.shared.capture(
    "purchase_completed",
    properties: [
        "product_id": "abc123",
        "price": 29.99,
        "currency": "USD"
    ]
)

// Event with user properties and groups
PostHogSDK.shared.capture(
    "subscription_started",
    properties: ["plan": "premium"],
    userProperties: ["subscription_tier": "premium"],
    groups: ["company": "acme-corp"]
)
```

### Screen Tracking

```swift
PostHogSDK.shared.screen("Home Screen")

PostHogSDK.shared.screen(
    "Product Details",
    properties: ["product_id": "xyz789", "category": "Electronics"]
)
```

### Exception Tracking

```swift
do {
    try riskyOperation()
} catch {
    PostHogSDK.shared.captureException(error)
    PostHogSDK.shared.captureException(error, properties: ["context": "checkout"])
}
```

## User Identification

```swift
// Identify a user
PostHogSDK.shared.identify(distinctId: "user_12345")

// Identify with properties
PostHogSDK.shared.identify(
    distinctId: "user_12345",
    userProperties: [
        "email": "user@example.com",
        "plan": "premium"
    ],
    userPropertiesSetOnce: [
        "signup_date": "2024-01-15"
    ]
)

// Set person properties without creating an identify event
PostHogSDK.shared.setPersonProperties(
    userPropertiesToSet: ["theme": "dark"],
    userPropertiesToSetOnce: ["first_seen": "2024-01-15"]
)

// Alias: link anonymous IDs with identified users
PostHogSDK.shared.alias("user_12345")

// Get current IDs
let distinctId = PostHogSDK.shared.getDistinctId()
let anonymousId = PostHogSDK.shared.getAnonymousId()

// Reset when user logs out
PostHogSDK.shared.reset()
```

## Feature Flags

```swift
// Check if a feature is enabled
if PostHogSDK.shared.isFeatureEnabled("new_checkout_flow") {
    // Show new checkout flow
}

// Get feature flag value (for multivariate flags)
if let variant = PostHogSDK.shared.getFeatureFlag("experiment") as? String {
    switch variant {
    case "control": // ...
    case "test": // ...
    default: break
    }
}

// Get the full feature flag result
if let result = PostHogSDK.shared.getFeatureFlagResult("experiment") {
    print("Enabled: \(result.enabled)")
    print("Variant: \(result.variant ?? "none")")
    print("Payload: \(result.payload ?? "none")")
}

// Get flag payload
if let payload = PostHogSDK.shared.getFeatureFlagPayload("experiment") {
    // Use the JSON payload
}

// Reload flags from the server
PostHogSDK.shared.reloadFeatureFlags()

// Reload with completion callback
PostHogSDK.shared.reloadFeatureFlags {
    print("Feature flags reloaded")
}

// Control whether $feature_flag_called events are sent
let enabled = PostHogSDK.shared.isFeatureEnabled("flag", sendFeatureFlagEvent: false)
```

### Feature Flag Interaction Tracking

Track when users see or interact with features controlled by flags:

```swift
PostHogSDK.shared.captureFeatureView(flag: "new-dashboard", flagVariant: "test")
PostHogSDK.shared.captureFeatureInteraction(flag: "new-dashboard", flagVariant: "test")
```

### Local Flag Evaluation Properties

Set properties used for local feature flag evaluation:

```swift
// Person properties for local evaluation
PostHogSDK.shared.setPersonPropertiesForFlags(["plan": "premium"])
PostHogSDK.shared.resetPersonPropertiesForFlags()

// Group properties for local evaluation
PostHogSDK.shared.setGroupPropertiesForFlags("company", properties: ["industry": "tech"])
PostHogSDK.shared.resetGroupPropertiesForFlags("company")
PostHogSDK.shared.resetGroupPropertiesForFlags()  // Reset all groups
```

## Super Properties

Properties that are sent with every event:

```swift
// Register super properties
PostHogSDK.shared.register(["app_version": "2.1.0", "environment": "production"])

// Remove a super property
PostHogSDK.shared.unregister("environment")
```

## Group Analytics

Associate users with groups (companies, teams, etc.):

```swift
PostHogSDK.shared.group(type: "company", key: "acme-corp")

PostHogSDK.shared.group(
    type: "company",
    key: "acme-corp",
    groupProperties: ["name": "Acme Corp", "plan": "enterprise"]
)
```

## Sessions

```swift
PostHogSDK.shared.startSession()
PostHogSDK.shared.endSession()

let sessionId = PostHogSDK.shared.getSessionId()
let isActive = PostHogSDK.shared.isSessionActive()
```

## Session Replay

```swift
// Check if session replay is recording
if PostHogSDK.shared.isSessionReplayActive() {
    print("Recording active")
}

// Start/stop recording
PostHogSDK.shared.startSessionRecording()
PostHogSDK.shared.startSessionRecording(resumeCurrent: true)
PostHogSDK.shared.stopSessionRecording()
```

## Privacy

```swift
// Opt a user out of tracking
PostHogSDK.shared.optOut()

// Check opt-out status
if PostHogSDK.shared.isOptOut() {
    print("User has opted out")
}

// Opt back in
PostHogSDK.shared.optIn()
```

## Lifecycle

```swift
// Flush queued events immediately
PostHogSDK.shared.flush()

// Close the SDK (releases resources)
PostHogSDK.shared.close()

// Enable/disable debug logging at runtime
PostHogSDK.shared.debug(true)
```

## API Reference

### PostHogSDK

| Method / Property | Description |
|---|---|
| `shared` | The singleton instance |
| `setup(_:)` | Initialize with a `PostHogConfig` |
| `close()` | Release SDK resources |
| `flush()` | Send all queued events immediately |
| `debug(_:)` | Enable/disable debug logging |
| `capture(_:properties:userProperties:groups:)` | Track a custom event |
| `screen(_:properties:)` | Track a screen view |
| `captureException(_:properties:)` | Capture an error/exception |
| `identify(distinctId:userProperties:userPropertiesSetOnce:)` | Identify a user |
| `setPersonProperties(userPropertiesToSet:userPropertiesToSetOnce:)` | Set person properties |
| `alias(_:)` | Link anonymous and identified user IDs |
| `reset()` | Clear user data (on logout) |
| `getDistinctId()` | Get current distinct ID |
| `getAnonymousId()` | Get the anonymous ID |
| `getSessionId()` | Get the current session ID |
| `register(_:)` | Set super properties |
| `unregister(_:)` | Remove a super property |
| `group(type:key:groupProperties:)` | Associate with a group |
| `reloadFeatureFlags()` | Refresh feature flags |
| `reloadFeatureFlags(_:)` | Refresh with completion callback |
| `isFeatureEnabled(_:)` | Check if a flag is enabled |
| `getFeatureFlag(_:)` | Get a flag's value |
| `getFeatureFlagPayload(_:)` | Get a flag's JSON payload |
| `getFeatureFlagResult(_:)` | Get structured flag result |
| `captureFeatureView(flag:flagVariant:)` | Track feature view |
| `captureFeatureInteraction(flag:flagVariant:)` | Track feature interaction |
| `setPersonPropertiesForFlags(_:reloadFeatureFlags:)` | Set local evaluation properties |
| `setGroupPropertiesForFlags(_:properties:reloadFeatureFlags:)` | Set group properties for flags |
| `startSession()` / `endSession()` | Manual session control |
| `isSessionActive()` | Whether a session is active |
| `isSessionReplayActive()` | Whether replay is recording |
| `startSessionRecording(resumeCurrent:)` | Start session recording |
| `stopSessionRecording()` | Stop session recording |
| `optOut()` / `optIn()` / `isOptOut()` | Privacy controls |

### PostHogConfig

| Property | Type | Default | Description |
|---|---|---|---|
| `apiKey` | `String` | — | Your PostHog project API key |
| `host` | `URL` | PostHog Cloud | Custom host URL |
| `flushAt` | `Int` | 20 | Events before auto-flush |
| `maxQueueSize` | `Int` | 1000 | Maximum queued events |
| `maxBatchSize` | `Int` | 50 | Events per network request |
| `flushIntervalSeconds` | `TimeInterval` | 30 | Auto-flush interval |
| `sendFeatureFlagEvent` | `Bool` | true | Emit `$feature_flag_called` |
| `preloadFeatureFlags` | `Bool` | true | Preload flags on startup |
| `captureApplicationLifecycleEvents` | `Bool` | false | Track app lifecycle |
| `captureScreenViews` | `Bool` | false | Auto-track screens |
| `captureElementInteractions` | `Bool` | false | Autocapture (iOS only) |
| `personProfiles` | `PostHogPersonProfiles` | `.identifiedOnly` | Profile creation mode |
| `sessionReplay` | `Bool` | false | Enable session recording |
| `surveys` | `Bool` | false | Enable in-app surveys |
| `debug` | `Bool` | false | Debug logging |
| `optOut` | `Bool` | false | Start opted-out |
| `reuseAnonymousId` | `Bool` | true | Reuse anonymous ID on reset |
| `setDefaultPersonProperties` | `Bool` | true | Set default person properties |
| `enableSwizzling` | `Bool` | true | Enable method swizzling (iOS only) |

## Limitations

:::warning
**Platform-specific differences:**
:::
> - `getAnonymousId()` on Android returns the distinct ID (the Android SDK does not expose a separate anonymous ID).
> - `captureException()` on iOS uses a `capture("$exception", ...)` workaround because the PostHog iOS SDK's `captureException` is marked `@_spi` and not publicly accessible.
> - `captureElementInteractions` (autocapture) is only available on iOS. Setting it on Android is a no-op.
> - `enableSwizzling` is only available on iOS. Setting it on Android is a no-op.
> - `isSessionActive()` on iOS is approximated by checking if a session ID exists.
> - `flushIntervalSeconds` is `TimeInterval` (Double) on iOS but `Int` on Android. Fractional seconds are truncated on Android.
> - Session replay and surveys may require additional setup on each platform. See the [PostHog session replay docs](https://posthog.com/docs/session-replay) and [surveys docs](https://posthog.com/docs/surveys).
> - `remoteConfig` is deprecated in newer PostHog SDK versions and is now always enabled.

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

