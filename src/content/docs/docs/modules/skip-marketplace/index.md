---
title: Marketplace
description: Documentation for Marketplace fetched from GitHub.
note: This documentation section is derived from the GitHub README.md source using the scripts/sync-modules.mjs script. Do not make edits to the file here, change it there.
editUrl: https://github.com/skiptools/skip-marketplace/edit/main/README.md
---

:::note[Source Repository <a href='https://github.com/skiptools/skip-marketplace/releases' alt='Releases for skip-marketplace'><img decoding='async' loading='lazy' alt='Releases for skip-marketplace' src='https://img.shields.io/github/v/release/skiptools/skip-marketplace.svg?style=flat' /></a>]{icon="github"}
This framework is available at [github.com/skiptools/skip-marketplace](https://github.com/skiptools/skip-marketplace) and can be checked out and improved locally as described in the [Contribution Guide](/docs/contributing/#local-libraries).
:::


In-app purchases, subscriptions, app reviews, and update prompts for Skip apps on both iOS and Android.

On iOS this wraps Apple's [StoreKit](https://developer.apple.com/documentation/storekit) framework. On Android it uses the [Google Play Billing Library](https://developer.android.com/google/play/billing) and [Play Core](https://developer.android.com/guide/playcore) libraries.

## Setup

Add the dependency to your `Package.swift` file:

```swift
let package = Package(
    name: "my-package",
    products: [
        .library(name: "MyProduct", targets: ["MyTarget"]),
    ],
    dependencies: [
        .package(url: "https://source.skip.dev/skip-marketplace.git", "0.0.0"..<"2.0.0"),
    ],
    targets: [
        .target(name: "MyTarget", dependencies: [
            .product(name: "SkipMarketplace", package: "skip-marketplace")
        ])
    ]
)
```

### Android Configuration

Add the billing permission to your `AndroidManifest.xml`:

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    <uses-permission android:name="com.android.vending.BILLING"/>
</manifest>
```

## In-App Purchases

:::tip
SkipMarketplace works best for non-consumable one-time-product entitlements. For subscriptions with server-side management, consider using [RevenueCat](https://www.revenuecat.com/) via the [skip-revenue](/docs/modules/skip-revenue) library.
:::

### Configure Products

Define your products in [App Store Connect](https://developer.apple.com/help/app-store-connect/manage-in-app-purchases/create-consumable-or-non-consumable-in-app-purchases/) and/or the [Google Play Console](https://support.google.com/googleplay/android-developer/answer/16430488).

### Fetch Products and Prices

```swift
import SkipMarketplace

// One-time purchases
let products = try await Marketplace.current.fetchProducts(
    for: ["product1", "product2"],
    subscription: false
)

for product in products {
    print("\(product.displayName): \(product.displayPrice ?? "")")
    print("  Description: \(product.productDescription)")
    print("  Is subscription: \(product.isSubscription)")

    if let offers = product.oneTimePurchaseOfferInfo {
        for offer in offers {
            print("  Price: \(offer.displayPrice) (\(offer.price))")
        }
    }
}
```

### Fetch Subscription Products

```swift
let subscriptions = try await Marketplace.current.fetchProducts(
    for: ["sub_monthly", "sub_annual"],
    subscription: true
)

for product in subscriptions {
    print("\(product.displayName): \(product.displayPrice ?? "")")

    if let offers = product.subscriptionOffers {
        for offer in offers {
            for phase in offer.pricingPhases {
                print("  Phase: \(phase.displayPrice)")
                print("  Period: \(phase.billingPeriod ?? "unknown")")
                print("  Cycles: \(phase.billingCycleCount)")
                print("  Mode: \(phase.recurrenceMode)")
            }
        }
    }
}
```

### Purchase a Product

```swift
let product = try await Marketplace.current.fetchProducts(
    for: ["premium_upgrade"],
    subscription: false
).first!

if let transaction = try await Marketplace.current.purchase(item: product) {
    print("Purchased: \(transaction.products)")
    print("Order ID: \(transaction.id ?? "unknown")")
    print("Date: \(transaction.purchaseDate)")
    print("Quantity: \(transaction.quantity)")

    // Always finish (acknowledge) the transaction
    try await Marketplace.current.finish(purchaseTransaction: transaction)
}
```

### Purchase with an Offer

```swift
let product = try await Marketplace.current.fetchProducts(
    for: ["premium_upgrade"],
    subscription: false
).first!

if let offer = product.oneTimePurchaseOfferInfo?.first {
    if let transaction = try await Marketplace.current.purchase(
        item: product,
        offer: offer
    ) {
        try await Marketplace.current.finish(purchaseTransaction: transaction)
    }
}
```

### Query Entitlements

Check what the user currently owns:

```swift
let entitlements = try await Marketplace.current.fetchEntitlements()
for transaction in entitlements {
    print("Owns: \(transaction.products)")
    print("  Purchased: \(transaction.purchaseDate)")
    print("  Acknowledged: \(transaction.isAcknowledged)")
    if let expiration = transaction.expirationDate {
        print("  Expires: \(expiration)")
    }
    // Finish each transaction to acknowledge receipt
    try await Marketplace.current.finish(purchaseTransaction: transaction)
}
```

### Listen for Transaction Updates

Observe purchase and subscription state changes in real time:

```swift
Task {
    for try await transaction in Marketplace.current.getPurchaseTransactionUpdates() {
        print("Transaction update: \(transaction.products)")
        try await Marketplace.current.finish(purchaseTransaction: transaction)
    }
}
```

### Testing Purchases

- **iOS**: [Setting up StoreKit testing in Xcode](https://developer.apple.com/documentation/xcode/setting-up-storekit-testing-in-xcode)
- **Android**: [Test your Google Play Billing Library integration](https://developer.android.com/google/play/billing/test)

## App Review Requests

Prompt the user to rate your app, with built-in throttling:

```swift
import SkipMarketplace

// Request a review at most once every 31 days
Marketplace.current.requestReview(period: .days(31))

// Use the default period (31 days)
Marketplace.current.requestReview()

// Custom review logic
Marketplace.current.requestReview(period: Marketplace.ReviewRequestDelay(shouldCheckReview: {
    return launchCount > 5 && hasCompletedOnboarding
}))
```

For guidance on when to request reviews, see the documentation for the
[Apple App Store](https://developer.apple.com/design/human-interface-guidelines/ratings-and-reviews#Best-practices)
and
[Google Play Store](https://developer.android.com/guide/playcore/in-app-review#when-to-request).

## App Update Prompts

Automatically prompt users when a newer version is available:

```swift
import SkipMarketplace

struct ContentView: View {
    var body: some View {
        YourViewCode()
            .appUpdatePrompt()
    }
}
```

On iOS, this queries `https://itunes.apple.com/lookup?bundleId=...` for the latest version and presents an [`.appStoreOverlay()`](https://developer.apple.com/documentation/swiftui/view/appstoreoverlay%28ispresented%3Aconfiguration%3A%29) when an update is available.

On Android, this uses the [Google Play In-App Updates Library](https://developer.android.com/guide/playcore/in-app-updates) to display a fullscreen "immediate" update flow. See Google's guide to [test in-app updates](https://developer.android.com/guide/playcore/in-app-updates/test).

The prompt is throttled to once per 24 hours by default. Use `forcePrompt: true` to bypass throttling:

```swift
.appUpdatePrompt(forcePrompt: true)
```

## Installation Source

Determine where the app was installed from:

```swift
switch await Marketplace.current.installationSource {
case .appleAppStore:
    print("Installed from Apple App Store")
case .googlePlayStore:
    print("Installed from Google Play Store")
case .testFlight:
    print("Installed from TestFlight")
case .marketplace(let bundleId):
    print("Installed from marketplace: \(bundleId)")
case .web:
    print("Installed from the web")
case .other(let name):
    print("Installed from: \(name ?? "unknown")")
case .unknown:
    print("Installation source unknown")
}
```

## API Reference

### Marketplace

The main entry point, accessed via `Marketplace.current`.

| Method / Property | Description |
|---|---|
| `current` | The singleton marketplace instance |
| `installationSource` | Where the app was installed from (async) |
| `fetchProducts(for:subscription:)` | Fetch product details by ID |
| `purchase(item:offer:purchaseOptions:)` | Initiate a purchase |
| `fetchEntitlements()` | Get all current entitlements |
| `finish(purchaseTransaction:)` | Acknowledge/finish a transaction |
| `getPurchaseTransactionUpdates()` | Stream of transaction updates |
| `requestReview(period:)` | Request an app store review |

### ProductInfo

| Property | Description |
|---|---|
| `id: String` | Product identifier |
| `displayName: String` | Localized product name |
| `productDescription: String` | Localized product description |
| `displayPrice: String?` | Formatted price string |
| `isSubscription: Bool` | Whether this is a subscription product |
| `oneTimePurchaseOfferInfo` | One-time purchase offers (nil for subscriptions) |
| `subscriptionOffers` | Subscription offers (nil for one-time purchases) |

### PurchaseTransaction

| Property | Description |
|---|---|
| `id: String?` | Order/transaction ID |
| `products: [String]` | Purchased product identifiers |
| `purchaseDate: Date` | When the purchase was made |
| `quantity: Int` | Number of items purchased |
| `expirationDate: Date?` | Subscription expiration (iOS only) |
| `isAcknowledged: Bool` | Whether the transaction has been finished |
| `isAutoRenewing: Bool` | Whether a subscription auto-renews |
| `revocationDate: Date?` | When the purchase was revoked, if at all (iOS only) |
| `originalID: String?` | Original transaction ID (for renewals) |
| `purchaseToken: String?` | Token for server verification (Android only) |

### OneTimePurchaseOfferInfo

| Property | Description |
|---|---|
| `id: String?` | Offer identifier |
| `price: Decimal` | Numeric price |
| `displayPrice: String` | Formatted price string |
| `fullPrice: Decimal?` | Original price before discount (Android only) |
| `discountAmount: Decimal?` | Discount value (Android only) |
| `discountDisplayAmount: String?` | Formatted discount (Android only) |
| `discountPercentage: Int?` | Discount percentage (Android only) |

### SubscriptionOfferInfo

| Property | Description |
|---|---|
| `id: String?` | Offer identifier |
| `pricingPhases: [SubscriptionPricingPhase]` | Pricing phases in this offer |
| `offerToken: String?` | Offer token for purchase (Android only) |

### SubscriptionPricingPhase

| Property | Description |
|---|---|
| `price: Decimal` | Numeric price for this phase |
| `displayPrice: String` | Formatted price string |
| `billingPeriod: String?` | ISO 8601 duration (e.g. "P1M", "P1Y") |
| `billingCycleCount: Int` | Number of cycles (0 = infinite) |
| `recurrenceMode: String` | "INFINITE_RECURRING", "FINITE_RECURRING", or "NON_RECURRING" |

### InstallationSource

| Case | Description |
|---|---|
| `.appleAppStore` | Apple App Store |
| `.googlePlayStore` | Google Play Store |
| `.testFlight` | TestFlight |
| `.marketplace(bundleId:)` | Alternative marketplace (EU) |
| `.web` | Direct web install |
| `.other(String?)` | Other source (e.g. F-Droid, Amazon) |
| `.unknown` | Unknown source |

### ReviewRequestDelay

| Factory | Description |
|---|---|
| `.default` | Once every 31 days |
| `.days(Int)` | Once every N days |
| `init(shouldCheckReview:)` | Custom logic |

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

