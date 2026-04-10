---
title: RevenueCat
description: Documentation for RevenueCat fetched from GitHub.
note: This documentation section is derived from the GitHub README.md source using the scripts/sync-modules.mjs script. Do not make edits to the file here, change it there.
editUrl: https://github.com/skiptools/skip-revenue/edit/main/README.md
---

:::note[Source Repository <a href='https://github.com/skiptools/skip-revenue/releases' alt='Releases for skip-revenue'><img decoding='async' loading='lazy' alt='Releases for skip-revenue' src='https://img.shields.io/github/v/release/skiptools/skip-revenue.svg?style=flat' /></a>]{icon="github"}
This framework is available at [github.com/skiptools/skip-revenue](https://github.com/skiptools/skip-revenue) and can be checked out and improved locally as described in the [Contribution Guide](/docs/contributing/#local-libraries).
:::


[RevenueCat](https://www.revenuecat.com) in-app purchases and subscriptions for Skip apps on both iOS and Android.

The framework contains two modules:

- **SkipRevenue** — Core service for configuring RevenueCat, loading offerings, purchasing packages, restoring purchases, and managing customer info.
- **SkipRevenueUI** — A `RCFusePaywallView` SwiftUI component that presents RevenueCat's native paywall UI on both platforms.

## Setup

Add the dependency to your `Package.swift` file:

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

You can also configure with a known user ID:

```swift
RevenueCatFuse.shared.configure(apiKey: "appl_your_ios_api_key", appUserID: "user-123")
```

See the RevenueCat [API Keys](https://www.revenuecat.com/docs/getting-started/projects#api-keys) documentation for information on obtaining your platform-specific API keys.

### User Identification

Identify users with their own user IDs, or let RevenueCat generate anonymous IDs:

```swift
// Log in with a known user ID
try await RevenueCatFuse.shared.loginUser(userId: "user-123")

// Log out when the user signs out
try await RevenueCatFuse.shared.logoutUser()

// Check current user state
let userId = RevenueCatFuse.shared.appUserID
let isAnonymous = RevenueCatFuse.shared.isAnonymous
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
                VStack(alignment: .leading) {
                    Text(package.storeProduct.localizedTitle)
                    Text(package.storeProduct.localizedDescription)
                        .font(.caption)
                        .foregroundStyle(.secondary)
                }
                Spacer()
                Text(package.storeProduct.localizedPriceString)
                    .bold()
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
    let description = current.serverDescription

    // Access convenience package slots
    if let monthly = current.monthly {
        print("Monthly: \(monthly.storeProduct.localizedPriceString)")
    }
    if let annual = current.annual {
        print("Annual: \(annual.storeProduct.localizedPriceString)")
    }
}

// Access a specific offering
if let premium = offerings.offering(identifier: "premium") {
    let packages = premium.availablePackages
}

// Look up a specific package within an offering
if let offering = offerings.current {
    if let pkg = offering.package(identifier: "$rc_monthly") {
        print("Found package: \(pkg.identifier)")
    }
}
```

See [Displaying Products](https://www.revenuecat.com/docs/getting-started/displaying-products) for more on configuring and presenting offerings.

### Package Types

Each package has a `packageType` that indicates its duration:

```swift
for package in offering.availablePackages {
    switch package.packageType {
    case .annual:    print("Annual")
    case .monthly:   print("Monthly")
    case .weekly:    print("Weekly")
    case .lifetime:  print("Lifetime")
    case .sixMonth:  print("6 Month")
    case .threeMonth: print("3 Month")
    case .twoMonth:  print("2 Month")
    case .custom:    print("Custom: \(package.identifier)")
    case .unknown:   print("Unknown")
    }
}
```

### Store Product Details

Access product pricing and metadata:

```swift
let product = package.storeProduct

print("ID: \(product.productIdentifier)")
print("Title: \(product.localizedTitle)")
print("Description: \(product.localizedDescription)")
print("Price: \(product.localizedPriceString)")  // e.g., "$9.99"
print("Price value: \(product.price)")             // e.g., 9.99
print("Currency: \(product.currencyCode ?? "")")   // e.g., "USD"

// Introductory offer (iOS only)
if let introPrice = product.localizedIntroductoryPriceString {
    print("Intro price: \(introPrice)")
}
```

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
    if customerInfo.isEntitlementActive("pro") {
        // Unlock pro features
    }
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

// Check a specific entitlement
if customerInfo.isEntitlementActive("pro") {
    // User has the "pro" entitlement
}

// Check if the user has any active entitlements
if customerInfo.hasActiveEntitlements {
    // User is a subscriber
}

// Get all active entitlement identifiers
let activeEntitlements = customerInfo.activeEntitlements

// Get all purchased product identifiers
let purchasedProducts = customerInfo.allPurchasedProductIdentifiers

// Check expiration dates
if let expiration = customerInfo.expirationDate(forEntitlement: "pro") {
    print("Pro expires: \(expiration)")
}

// Check purchase dates
if let purchased = customerInfo.purchaseDate(forEntitlement: "pro") {
    print("Pro purchased: \(purchased)")
}

// First seen date
print("First seen: \(customerInfo.firstSeen)")

// Latest expiration across all entitlements
if let latestExpiration = customerInfo.latestExpirationDate {
    print("Latest expiration: \(latestExpiration)")
}
```

See [Customer Info](https://www.revenuecat.com/docs/customers/customer-info) for more on working with customer data and [Entitlements](https://www.revenuecat.com/docs/getting-started/entitlements) for configuring access levels.

### Subscriber Attributes

Set custom attributes for analytics, integrations, and customer segmentation:

```swift
RevenueCatFuse.shared.setAttributes([
    "source": "onboarding",
    "plan_interest": "premium"
])

RevenueCatFuse.shared.setEmail("user@example.com")
RevenueCatFuse.shared.setDisplayName("Jane Doe")
```

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

## API Reference

### RevenueCatFuse

The main service singleton for all RevenueCat operations.

| Method / Property | Description |
|---|---|
| `shared` | The singleton instance |
| `configure(apiKey:)` | Initialize with a platform-specific API key |
| `configure(apiKey:appUserID:)` | Initialize with an API key and known user ID |
| `isConfigured: Bool` | Whether the SDK is configured |
| `appUserID: String` | Current app user ID |
| `isAnonymous: Bool` | Whether the current user is anonymous |
| `loginUser(userId:) async throws` | Log in with a user ID |
| `logoutUser() async throws` | Log out to anonymous |
| `loadOfferings() async throws` | Load all offerings |
| `loadProducts(offeringIdentifier:) async throws` | Load packages from an offering |
| `purchase(package:) async throws` | Purchase a package (iOS) |
| `purchase(package:activity:) async throws` | Purchase a package (Android) |
| `restorePurchases() async throws` | Restore prior purchases |
| `getCustomerInfo() async throws` | Get current customer info |
| `setAttributes(_:)` | Set subscriber attributes |
| `setEmail(_:)` | Set user's email |
| `setDisplayName(_:)` | Set user's display name |

### RCFuseOfferings

| Property / Method | Description |
|---|---|
| `current: RCFuseOffering?` | The current (default) offering |
| `all: [String: RCFuseOffering]` | All offerings keyed by identifier |
| `offering(identifier:)` | Look up an offering by identifier |

### RCFuseOffering

| Property / Method | Description |
|---|---|
| `identifier: String` | The offering identifier |
| `serverDescription: String` | Description from the RevenueCat dashboard |
| `availablePackages: [RCFusePackage]` | All packages in this offering |
| `lifetime: RCFusePackage?` | Lifetime package, if available |
| `annual: RCFusePackage?` | Annual package, if available |
| `sixMonth: RCFusePackage?` | Six-month package, if available |
| `threeMonth: RCFusePackage?` | Three-month package, if available |
| `twoMonth: RCFusePackage?` | Two-month package, if available |
| `monthly: RCFusePackage?` | Monthly package, if available |
| `weekly: RCFusePackage?` | Weekly package, if available |
| `package(identifier:)` | Look up a package by identifier |

### RCFusePackage

| Property | Description |
|---|---|
| `identifier: String` | The package identifier |
| `packageType: RCFusePackageType` | The package type (`.monthly`, `.annual`, etc.) |
| `storeProduct: RCFuseStoreProduct` | The underlying store product |
| `localizedPeriodString: String?` | Human-readable subscription period |

### RCFuseStoreProduct

| Property | Description |
|---|---|
| `productIdentifier: String` | The store product identifier |
| `localizedTitle: String` | The product name |
| `localizedDescription: String` | The product description |
| `localizedPriceString: String` | Formatted price (e.g., "$9.99") |
| `price: Double` | Numeric price value |
| `currencyCode: String?` | Currency code (e.g., "USD") |
| `localizedIntroductoryPriceString: String?` | Intro offer price (iOS only) |

### RCFuseCustomerInfo

| Property / Method | Description |
|---|---|
| `originalAppUserId: String` | The original app user ID |
| `activeEntitlements: Set<String>` | Currently active entitlement identifiers |
| `allPurchasedProductIdentifiers: Set<String>` | All purchased product identifiers |
| `hasActiveEntitlements: Bool` | Whether the user has any active entitlements |
| `isEntitlementActive(_:) -> Bool` | Check if a specific entitlement is active |
| `firstSeen: Date` | When the user was first seen |
| `latestExpirationDate: Date?` | Latest expiration across all entitlements |
| `expirationDate(forEntitlement:) -> Date?` | Expiration date for a specific entitlement |
| `purchaseDate(forEntitlement:) -> Date?` | Purchase date for a specific entitlement |

### RCFusePackageType

| Case | Description |
|---|---|
| `.lifetime` | Lifetime (non-recurring) |
| `.annual` | Annual subscription |
| `.sixMonth` | Six-month subscription |
| `.threeMonth` | Three-month subscription |
| `.twoMonth` | Two-month subscription |
| `.monthly` | Monthly subscription |
| `.weekly` | Weekly subscription |
| `.custom` | Custom package |
| `.unknown` | Unknown type |

### StoreError

| Case | Description |
|---|---|
| `.userCancelled` | User cancelled the purchase |
| `.unknown` | Unknown error |
| `.noPurchasesFound` | No purchases found to restore |
| `.noProductsAvailable` | No products available in the offering |
| `.packageNotFound` | Package not found |
| `.notConfigured` | RevenueCat is not configured |

### RCFusePaywallView

| Parameter | Description |
|---|---|
| `offering: RCFuseOffering?` | Optional specific offering to display |
| `onPurchaseCompleted: ((String) -> Void)?` | Callback with user ID after purchase |
| `onRestoreCompleted: ((String) -> Void)?` | Callback with user ID after restore |
| `onDismiss: (() -> Void)?` | Called when user dismisses the paywall |

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

## Contributing

We welcome contributions to SkipRevenue. The Skip product [documentation](/docs/contributing/) includes helpful instructions and tips on local Skip library development.

