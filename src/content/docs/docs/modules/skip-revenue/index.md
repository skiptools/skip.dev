---
title: RevenueCat
description: Documentation for RevenueCat fetched from GitHub.
note: This documentation section is derived from the GitHub README.md source using the scripts/sync-modules.mjs script. Do not make edits to the file here, change it there.
editUrl: https://github.com/skiptools/skip-revenue/edit/main/README.md
---

:::note[Source Repository <a href='https://github.com/skiptools/skip-revenue/releases' alt='Releases for skip-revenue'><img decoding='async' loading='lazy' alt='Releases for skip-revenue' src='https://img.shields.io/github/v/release/skiptools/skip-revenue.svg?style=flat' /></a>]{icon="github"}
This framework is available at [github.com/skiptools/skip-revenue](https://github.com/skiptools/skip-revenue) and can be checked out and improved locally as described in the [Contribution Guide](/docs/contributing/#local-libraries).
:::


This is a free Skip Swift/Kotlin framework that provides
integration with the [RevenueCat](https://www.revenuecat.com) SDK for in-app purchases and subscriptions
on [iOS](https://www.revenuecat.com/docs/getting-started/installation/ios)
and [Android](https://www.revenuecat.com/docs/getting-started/installation/android).

The framework contains two modules:

- **SkipRevenue** — Core service for configuring RevenueCat, loading offerings, purchasing packages, restoring purchases, and managing customer info.
- **SkipRevenueUI** — A `RCFusePaywallView` SwiftUI component that presents RevenueCat's native paywall UI on both platforms.

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
        .package(url: "https://source.skip.dev/skip-revenue.git", "0.0.0"..<"2.0.0"),
    ],
    targets: [
        .target(name: "MyTarget", dependencies: [
            .product(name: "SkipRevenue", package: "skip-revenue"),
            .product(name: "SkipRevenueUI", package: "skip-revenue")
        ])
    ]
)
```

If you only need the core purchase APIs without the paywall UI, you can depend on `SkipRevenue` alone.

### RevenueCat Account Setup

Before using this framework you must create a [RevenueCat](https://www.revenuecat.com) account and configure your project with API keys for both platforms. See the RevenueCat [Getting Started](https://www.revenuecat.com/docs/getting-started) guide and [Configuring Products](https://www.revenuecat.com/docs/getting-started/entitlements) documentation for details on setting up your products, offerings, and entitlements in the RevenueCat dashboard.

## Usage

### Configuration

Configure the RevenueCat SDK early in your app's lifecycle, typically in your `App` init or `onAppear`:

```swift
import SkipRevenue

@main struct MyApp: App {
    init() {
        #if !SKIP
        RevenueCatFuse.shared.configure(apiKey: "appl_your_ios_api_key")
        #else
        RevenueCatFuse.shared.configure(apiKey: "goog_your_android_api_key")
        #endif
    }

    var body: some Scene {
        WindowGroup {
            ContentView()
        }
    }
}
```

See the RevenueCat [API Keys](https://www.revenuecat.com/docs/getting-started/projects#api-keys) documentation for information on obtaining your platform-specific API keys.

### User Identification

Identify users with their own user IDs, or let RevenueCat generate anonymous IDs:

```swift
// Log in with a known user ID
try await RevenueCatFuse.shared.loginUser(userId: "user-123")

// Log out when the user signs out
try await RevenueCatFuse.shared.logoutUser()
```

See [Identifying Users](https://www.revenuecat.com/docs/customers/user-ids) for more on user identification strategies.

### Loading Offerings and Products

Offerings represent the products you've configured in the RevenueCat dashboard:

```swift
import SwiftUI
import SkipRevenue

struct StoreView: View {
    @State var packages: [RCFusePackage] = []
    @State var errorMessage: String?

    var body: some View {
        List(packages, id: \.identifier) { package in
            HStack {
                Text(package.identifier)
                Spacer()
                Text(package.storeProduct.localizedPriceString)
            }
        }
        .task {
            do {
                packages = try await RevenueCatFuse.shared.loadProducts()
            } catch {
                errorMessage = error.localizedDescription
            }
        }
    }
}
```

You can also load the full offerings tree to access specific offerings by identifier:

```swift
let offerings = try await RevenueCatFuse.shared.loadOfferings()

// Access the default offering
if let current = offerings.current {
    let packages = current.availablePackages
}

// Access a specific offering
if let premium = offerings.offering(identifier: "premium") {
    let packages = premium.availablePackages
}
```

See [Displaying Products](https://www.revenuecat.com/docs/getting-started/displaying-products) for more on configuring and presenting offerings.

### Purchasing

The purchase API differs slightly between platforms because Android requires an `Activity` reference:

```swift
// iOS
#if !SKIP
let customerInfo = try await RevenueCatFuse.shared.purchase(package: package)
#else
// Android — pass the current activity
let customerInfo = try await RevenueCatFuse.shared.purchase(
    package: package,
    activity: ProcessInfo.processInfo.androidContext
)
#endif
```

Handle purchase errors, including user cancellation:

```swift
do {
    #if !SKIP
    let customerInfo = try await RevenueCatFuse.shared.purchase(package: package)
    #else
    let customerInfo = try await RevenueCatFuse.shared.purchase(
        package: package,
        activity: ProcessInfo.processInfo.androidContext
    )
    #endif
    // Purchase succeeded — check entitlements
    let active = customerInfo.activeEntitlements
} catch let error as StoreError where error == .userCancelled {
    // User cancelled — no action needed
} catch {
    // Handle other errors
}
```

See [Making Purchases](https://www.revenuecat.com/docs/getting-started/making-purchases) for more details.

### Restoring Purchases

Allow users to restore purchases on a new device or after reinstalling:

```swift
let customerInfo = try await RevenueCatFuse.shared.restorePurchases()
let activeEntitlements = customerInfo.activeEntitlements
```

See [Restoring Purchases](https://www.revenuecat.com/docs/getting-started/restoring-purchases) for platform-specific considerations.

### Checking Customer Info

Query the current customer's entitlement status at any time:

```swift
let customerInfo = try await RevenueCatFuse.shared.getCustomerInfo()

if customerInfo.activeEntitlements.contains("pro") {
    // User has the "pro" entitlement
}

let purchasedProducts = customerInfo.allPurchasedProductIdentifiers
```

See [Customer Info](https://www.revenuecat.com/docs/customers/customer-info) for more on working with customer data and [Entitlements](https://www.revenuecat.com/docs/getting-started/entitlements) for configuring access levels.

### Paywall UI

The `SkipRevenueUI` module provides `RCFusePaywallView`, which presents RevenueCat's native paywall UI. On iOS this uses `PaywallView` from RevenueCatUI, and on Android it uses the RevenueCat Compose `Paywall` component.

```swift
import SwiftUI
import SkipRevenue
import SkipRevenueUI

struct SubscriptionView: View {
    @State var showPaywall = false

    var body: some View {
        Button("Subscribe") {
            showPaywall = true
        }
        .sheet(isPresented: $showPaywall) {
            RCFusePaywallView(
                onPurchaseCompleted: { userId in
                    // Purchase succeeded — userId is the customer's user ID
                    showPaywall = false
                },
                onRestoreCompleted: { userId in
                    // Restore succeeded
                    showPaywall = false
                },
                onDismiss: {
                    showPaywall = false
                }
            )
        }
    }
}
```

To display a specific offering in the paywall, pass an `RCFuseOffering`:

```swift
let offerings = try await RevenueCatFuse.shared.loadOfferings()
if let premium = offerings.offering(identifier: "premium") {
    RCFusePaywallView(
        offering: premium,
        onPurchaseCompleted: { userId in },
        onDismiss: { }
    )
}
```

See the RevenueCat [Paywalls](https://www.revenuecat.com/docs/tools/paywalls) documentation for information on designing and configuring paywall templates in the RevenueCat dashboard.

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

## Contributing

We welcome contributions to SkipRevenue. The Skip product [documentation](/docs/contributing/) includes helpful instructions and tips on local Skip library development.

