---
title: PostHog
description: Documentation for PostHog fetched from GitHub.
note: This documentation section is derived from the GitHub README.md source using the scripts/sync-modules.mjs script. Do not make edits to the file here, change it there.
editUrl: https://github.com/skiptools/skip-posthog/edit/main/README.md
---

:::note[Source Repository <a href='https://github.com/skiptools/skip-posthog/releases' alt='Releases for skip-posthog'><img decoding='async' loading='lazy' alt='Releases for skip-posthog' src='https://img.shields.io/github/v/release/skiptools/skip-posthog.svg?style=flat' /></a>]{icon="github"}
This framework is available at [github.com/skiptools/skip-posthog](https://github.com/skiptools/skip-posthog) and can be checked out and improved locally as described in the [Contribution Guide](/docs/contributing/#local-libraries).
:::


A Skip interface for integrating PostHog analytics into your cross-platform iOS and Android applications.

## About PostHog

[PostHog](https://posthog.com) is an open-source product analytics platform that helps you understand user behavior, track events, conduct A/B tests, and analyze feature usage. It provides powerful analytics capabilities including event tracking, user identification, feature flags, session recording, and more—all while giving you full control over your data.

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
        .package(url: "https://source.skip.dev/skip-posthog.git", "0.0.0"..<"2.0.0"),
    ],
    targets: [
        .target(name: "MyTarget", dependencies: [
            .product(name: "SkipPostHog", package: "skip-posthog")
        ])
    ]
)
```

## API Compatibility

SkipPostHog provides the same API surface as the [PostHog iOS SDK](https://posthog.com/docs/libraries/ios), ensuring a familiar development experience. All methods behave identically on both iOS and Android platforms, allowing you to write once and deploy everywhere. On Android, the API calls are forwarded to their equivalents in the [PostHog Android SDK](https://posthog.com/docs/libraries/android).

## Configuration

Initialize PostHog when your app starts, typically in your app's initialization code:

```swift
import SkipPostHog

PostHogSDK.shared.setup(
    PostHogConfig(apiKey: "your-api-key")
)
```

For self-hosted PostHog instances, specify your custom host:

```swift
PostHogSDK.shared.setup(
    PostHogConfig(apiKey: "your-api-key", host: "https://your-posthog-instance.com")
)
```

## Usage Examples

### Tracking Events

Capture events to understand what users are doing in your app:

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
```

### Identifying Users

Associate events with specific users:

```swift
// Identify a user
PostHogSDK.shared.identify("user_12345")

// Identify with user properties
PostHogSDK.shared.identify(
    "user_12345",
    userProperties: [
        "email": "user@example.com",
        "plan": "premium",
        "signup_date": "2024-01-15"
    ]
)
```

### Setting User Properties

Update properties for the current user:

```swift
PostHogSDK.shared.identify(
    PostHogSDK.shared.getDistinctId(),
    userProperties: [
        "theme_preference": "dark",
        "notifications_enabled": true
    ]
)
```

### Screen Tracking

Track screen views to understand navigation patterns:

```swift
PostHogSDK.shared.screen("Home Screen")

// With additional properties
PostHogSDK.shared.screen(
    "Product Details",
    properties: [
        "product_id": "xyz789",
        "category": "Electronics"
    ]
)
```

### Aliasing Users

Link anonymous users with identified users:

```swift
// When a user signs up or logs in
PostHogSDK.shared.alias("user_12345")
```

### Feature Flags

Check feature flags to control feature rollouts:

```swift
// Check if a feature is enabled
if PostHogSDK.shared.isFeatureEnabled("new_checkout_flow") {
    // Show new checkout flow
} else {
    // Show original checkout flow
}

// Get feature flag payload
if let payload = PostHogSDK.shared.getFeatureFlag("experiment_variant") as? String {
    switch payload {
    case "control":
        // Show control variant
    case "test":
        // Show test variant
    default:
        // Default behavior
    }
}
```

### Resetting User Data

Clear user data when logging out:

```swift
PostHogSDK.shared.reset()
```

### Advanced Configuration

Configure additional options during setup:

```swift
let config = PostHogConfig(
    apiKey: "your-api-key",
    host: "https://app.posthog.com"
)

// Customize capture settings
config.captureScreenViews = true
config.captureApplicationLifecycleEvents = true
config.flushAt = 20
config.flushIntervalSeconds = 30

PostHogSDK.shared.setup(config)
```

### Getting the Distinct ID

Retrieve the current user's distinct ID:

```swift
let distinctId = PostHogSDK.shared.getDistinctId()
print("Current user ID: \(distinctId)")
```

## Privacy Considerations

PostHog respects user privacy. Make sure to:

- Comply with applicable privacy laws (GDPR, CCPA, etc.)
- Provide clear privacy policies to your users
- Only track necessary data
- Use `PostHogSDK.shared.optOut()` to allow users to opt out of tracking

```swift
// Allow users to opt out
PostHogSDK.shared.optOut()

// Re-enable tracking
PostHogSDK.shared.optIn()
```

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

