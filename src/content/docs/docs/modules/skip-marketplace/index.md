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

On iOS this wraps Apple's [StoreKit](https://developer.apple.com/documentation/storekit) framework. On Android it uses the [Google Play Billing Library](https://developer.android.com/google/play/billing) and [Play Core](https://developer.android.com/guide/playcore) libraries. The cross-platform surface mostly conforms to the [OpenIAP](https://www.openiap.dev) specification.

## Contents

- [Setup](#setup)
- [In-App Purchases](#in-app-purchases)
- [App Review Requests](#app-review-requests)
- [App Update Prompts](#app-update-prompts)
- [Installation Source](#installation-source)
- [API Reference](#api-reference)

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

The Google Play [Billing Library](https://developer.android.com/google/play/billing/getting-ready#dependency), [In-App Review](https://developer.android.com/guide/playcore/in-app-review), and [In-App Updates](https://developer.android.com/guide/playcore/in-app-updates) Gradle dependencies are added automatically by SkipMarketplace's `skip.yml`.

## In-App Purchases

:::tip
SkipMarketplace works best for non-consumable one-time-product entitlements. For subscriptions with server-side management, consider using [RevenueCat](https://www.revenuecat.com/) via the [skip-revenue](/docs/modules/skip-revenue) library.
:::

### Configure Products

Define your products in:

- **App Store Connect**: [Create consumable or non-consumable in-app purchases](https://developer.apple.com/help/app-store-connect/manage-in-app-purchases/create-consumable-or-non-consumable-in-app-purchases/), [Create subscriptions](https://developer.apple.com/help/app-store-connect/manage-subscriptions/create-auto-renewable-subscriptions/)
- **Google Play Console**: [Create one-time products](https://support.google.com/googleplay/android-developer/answer/16430488), [Create subscriptions](https://support.google.com/googleplay/android-developer/answer/140504)

Use the same product identifiers across both stores so a single call to `fetchProducts(for:subscription:)` returns the appropriate product for the platform the app is running on.

### Fetch Products and Prices

Fetch one or more one-time-purchase products by their identifier. Wraps [`Product.products(for:)`](https://developer.apple.com/documentation/storekit/product/products(for:)) on iOS and [`BillingClient.queryProductDetails()`](https://developer.android.com/reference/com/android/billingclient/api/BillingClient#queryProductDetails(com.android.billingclient.api.QueryProductDetailsParams,com.android.billingclient.api.ProductDetailsResponseListener)) on Android.

```swift
import SkipMarketplace

let products = try await Marketplace.current.fetchProducts(
    for: ["premium_upgrade", "remove_ads"],
    subscription: false
)

for product in products {
    print("\(product.displayName): \(product.displayPrice ?? "")")
    print("  ID: \(product.id)")
    print("  Description: \(product.productDescription)")
    print("  Is subscription: \(product.isSubscription)")

    if let offers = product.oneTimePurchaseOfferInfo {
        for offer in offers {
            print("  Offer price: \(offer.displayPrice) (raw: \(offer.price))")
            if let discount = offer.discountPercentage {
                print("  Discount: \(discount)%")
            }
        }
    }
}
```

Identifiers that don't correspond to a real product are silently omitted from the result — always check what was actually returned before assuming a product exists. See [`Product.products(for:)`](https://developer.apple.com/documentation/storekit/product/products(for:)) for Apple's behavior and [`QueryProductDetailsResult`](https://developer.android.com/reference/com/android/billingclient/api/QueryProductDetailsResult) for Google's.

### Fetch Subscription Products

For subscriptions, pass `subscription: true`. This corresponds to [`Product.SubscriptionInfo`](https://developer.apple.com/documentation/storekit/product/subscriptioninfo) on iOS and [`ProductDetails.SubscriptionOfferDetails`](https://developer.android.com/reference/com/android/billingclient/api/ProductDetails.SubscriptionOfferDetails) on Android.

```swift
let subscriptions = try await Marketplace.current.fetchProducts(
    for: ["sub_monthly", "sub_annual"],
    subscription: true
)

for product in subscriptions {
    print("\(product.displayName): \(product.displayPrice ?? "")")

    // Each subscription product can have multiple offers (introductory, promotional, win-back).
    // Each offer can have multiple pricing phases (free trial → discounted intro → standard).
    if let offers = product.subscriptionOffers {
        for offer in offers {
            print("  Offer ID: \(offer.id ?? "base")")
            for phase in offer.pricingPhases {
                print("    Phase: \(phase.displayPrice)")
                print("      Period: \(phase.billingPeriod ?? "unknown")") // ISO 8601 duration
                print("      Cycles: \(phase.billingCycleCount)") // 0 = infinite
                print("      Mode: \(phase.recurrenceMode)") // INFINITE_RECURRING / FINITE_RECURRING / NON_RECURRING
            }
        }
    }
}
```

The `billingPeriod` is an [ISO 8601 duration string](https://en.wikipedia.org/wiki/ISO_8601#Durations) (e.g. `P1M` for one month, `P1Y` for one year, `P7D` for a seven-day trial), normalized across platforms.

### Display Products in a Paywall

A minimal SwiftUI paywall showing fetched products:

```swift
import SwiftUI
import SkipMarketplace

struct PaywallView: View {
    @State private var products: [ProductInfo] = []
    @State private var error: String?
    @State private var purchasing: String?

    var body: some View {
        List {
            if let error {
                Text(error).foregroundStyle(.red)
            }
            ForEach(products, id: \.id) { product in
                Button {
                    Task { await buy(product) }
                } label: {
                    HStack {
                        VStack(alignment: .leading) {
                            Text(product.displayName).font(.headline)
                            Text(product.productDescription).font(.caption)
                        }
                        Spacer()
                        if purchasing == product.id {
                            ProgressView()
                        } else {
                            Text(product.displayPrice ?? "—")
                        }
                    }
                }
                .disabled(purchasing != nil)
            }
        }
        .task { await load() }
    }

    func load() async {
        do {
            products = try await Marketplace.current.fetchProducts(
                for: ["premium_upgrade", "remove_ads"],
                subscription: false
            )
        } catch {
            self.error = "Failed to load products: \(error.localizedDescription)"
        }
    }

    func buy(_ product: ProductInfo) async {
        purchasing = product.id
        defer { purchasing = nil }
        do {
            if let transaction = try await Marketplace.current.purchase(item: product) {
                // Grant entitlement, then acknowledge — see "Acknowledging Purchases" above
                try await Marketplace.current.finish(purchaseTransaction: transaction)
            }
        } catch {
            self.error = "Purchase failed: \(error.localizedDescription)"
        }
    }
}
```

### Purchase a Product

Initiate a purchase. Returns the resulting [`PurchaseTransaction`](#purchasetransaction), or `nil` if the user cancelled or the purchase is pending. Wraps [`Product.purchase(options:)`](https://developer.apple.com/documentation/storekit/product/purchase(options:)) on iOS and [`BillingClient.launchBillingFlow()`](https://developer.android.com/reference/com/android/billingclient/api/BillingClient#launchBillingFlow(android.app.Activity,com.android.billingclient.api.BillingFlowParams)) on Android.

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

    // Grant the entitlement to the user here.
    await unlock(transaction)

    // Always finish the transaction.
    // On Android, Google Play will auto-refund within 3 days if this is skipped.
    try await Marketplace.current.finish(purchaseTransaction: transaction)
} else {
    // nil = user cancelled, or the purchase is in a pending state (e.g. parental approval).
    // Listen via getPurchaseTransactionUpdates() to be notified when a pending purchase resolves.
}
```

### Purchase with an Offer

Subscription products may have introductory, promotional, or [win-back offers](https://developer.apple.com/documentation/storekit/product/subscriptionoffer). On Android, [subscription offers](https://developer.android.com/google/play/billing/subscriptions#offer) require an offer token — SkipMarketplace handles that automatically when you pass the offer.

```swift
let product = try await Marketplace.current.fetchProducts(
    for: ["sub_annual"],
    subscription: true
).first!

// Pick the first subscription offer; in production, choose based on offer.id and pricingPhases
if let offer = product.subscriptionOffers?.first {
    if let transaction = try await Marketplace.current.purchase(
        item: product,
        offer: offer
    ) {
        await unlock(transaction)
        try await Marketplace.current.finish(purchaseTransaction: transaction)
    }
}
```

:::note
On iOS, **introductory offers** are applied automatically by StoreKit when eligible — do not pass them via the `offer` parameter. **Promotional offers** require a server-signed JWS signature and must be applied via `purchaseOptions` (not yet exposed through SkipMarketplace's cross-platform surface; drop down to `item.product` for now). **Win-back offers** (iOS 18+) and Android subscription offers are passed through `offer:`.
:::

### Finish (Acknowledge) Transactions

`finish(purchaseTransaction:)` performs the platform-appropriate acknowledgement:

```swift
try await Marketplace.current.finish(purchaseTransaction: transaction)
```

| Platform | What happens |
|---|---|
| iOS | Calls [`Transaction.finish()`](https://developer.apple.com/documentation/storekit/transaction/finish()), removing the transaction from the unfinished queue. |
| Android | Calls [`BillingClient.acknowledgePurchase()`](https://developer.android.com/reference/com/android/billingclient/api/BillingClient#acknowledgePurchase(com.android.billingclient.api.AcknowledgePurchaseParams,com.android.billingclient.api.AcknowledgePurchaseResponseListener)) with the purchase's token. **Required within 3 days** — see [Google's documented rule](https://developer.android.com/google/play/billing/integrate#process). |

For **consumable** products on Android (e.g., in-game currency packs), you should call [`BillingClient.consumeAsync()`](https://developer.android.com/reference/com/android/billingclient/api/BillingClient#consumeAsync(com.android.billingclient.api.ConsumeParams,com.android.billingclient.api.ConsumeResponseListener)) instead of `acknowledgePurchase()`. SkipMarketplace's `finish()` always acknowledges, so if you need consumption semantics drop down to the underlying `transaction.purchaseTransaction` (a `com.android.billingclient.api.Purchase`) and call `consumeAsync` directly inside a `#if SKIP` block.

:::note
Every successful purchase **must** be finished by calling `Marketplace.current.finish(purchaseTransaction:)`. On Android, failing to acknowledge a purchase within **three days** will cause Google Play to **automatically refund the purchase and revoke the entitlement** — even if your app has already granted it to the user.
:::
>
> See Google's documentation for the exact rule: [Process purchases — Acknowledge a purchase](https://developer.android.com/google/play/billing/integrate#process)

### Query Entitlements

Check what the user currently owns. Wraps [`Transaction.currentEntitlements`](https://developer.apple.com/documentation/storekit/transaction/currententitlements) on iOS and [`BillingClient.queryPurchasesAsync()`](https://developer.android.com/reference/com/android/billingclient/api/BillingClient#queryPurchasesAsync(com.android.billingclient.api.QueryPurchasesParams,com.android.billingclient.api.PurchasesResponseListener)) on Android (called twice — once for `INAPP` and once for `SUBS`).

This is what you should call on app launch to **restore purchases** — there's no separate "restore" API needed.

```swift
@MainActor
func restorePurchases() async throws {
    let entitlements = try await Marketplace.current.fetchEntitlements()
    for transaction in entitlements {
        print("Owns: \(transaction.products)")
        print("  Purchased: \(transaction.purchaseDate)")
        print("  Acknowledged: \(transaction.isAcknowledged)")
        print("  Auto-renews: \(transaction.isAutoRenewing)")
        if let expiration = transaction.expirationDate {
            print("  Expires: \(expiration)") // subscriptions only, iOS only
        }
        if let revoked = transaction.revocationDate {
            print("  Revoked: \(revoked)") // iOS only — refunded or family-shared revoke
            continue
        }

        // Apply the entitlement
        await unlock(transaction)

        // If the transaction wasn't already acknowledged (e.g. from a prior session
        // that crashed before finishing), acknowledge it now to avoid auto-refund.
        if !transaction.isAcknowledged {
            try await Marketplace.current.finish(purchaseTransaction: transaction)
        }
    }
}
```

The `isAcknowledged` property reflects [`Purchase.isAcknowledged()`](https://developer.android.com/reference/com/android/billingclient/api/Purchase#isAcknowledged()) on Android. On iOS, transactions returned from `currentEntitlements` are already verified, so this is always `true`.

### Listen for Transaction Updates

Observe purchase and subscription state changes in real time. Wraps [`Transaction.updates`](https://developer.apple.com/documentation/storekit/transaction/updates) on iOS and [`PurchasesUpdatedListener`](https://developer.android.com/reference/com/android/billingclient/api/PurchasesUpdatedListener) on Android.

This catches:
- **Pending purchases** that resolve later (e.g. [SCA approval](https://developer.android.com/google/play/billing/integrate#pending), [Ask to Buy](https://support.apple.com/en-us/HT201089)).
- **Subscription renewals** that happen while the app is running.
- **Out-of-band purchases** initiated outside your app (e.g. App Store promoted IAPs).

Start the listener early in your app's lifecycle, before any UI that depends on purchases:

```swift
@main
struct MyApp: App {
    init() {
        Task {
            for try await transaction in Marketplace.current.getPurchaseTransactionUpdates() {
                print("Transaction update: \(transaction.products)")
                await applyEntitlement(transaction)
                try? await Marketplace.current.finish(purchaseTransaction: transaction)
            }
        }
    }

    var body: some Scene {
        WindowGroup { ContentView() }
    }
}
```

:::note
This is the primary path for handling **pending purchases** on Android (parent approval, slow card processing, cash payments). A pending purchase causes `purchase(item:)` to return `nil`; when it eventually resolves to `PURCHASED`, the result is delivered through `getPurchaseTransactionUpdates()` — **not** as a return value from the original `purchase()` call. See [Handle pending transactions](https://developer.android.com/google/play/billing/integrate#pending).
:::

### Testing Purchases

| Platform | Documentation |
|---|---|
| iOS | [Setting up StoreKit testing in Xcode](https://developer.apple.com/documentation/xcode/setting-up-storekit-testing-in-xcode) — local StoreKit configuration file, no App Store Connect required. Also: [Sandbox accounts](https://developer.apple.com/apple-pay/sandbox-testing/). |
| Android | [Test your Google Play Billing Library integration](https://developer.android.com/google/play/billing/test) — license testers, [static response product IDs](https://developer.android.com/google/play/billing/test#test-static) (`android.test.purchased`, `android.test.canceled`, etc.). |

For end-to-end Android testing, the app must be installed from a track (internal/closed/open testing) of the **same package name** that holds the configured products in the Play Console. Sideloaded debug builds will return `BILLING_UNAVAILABLE`.

## App Review Requests

Prompt the user to rate your app, with built-in throttling. Wraps [`AppStore.requestReview(in:)`](https://developer.apple.com/documentation/storekit/appstore/requestreview(in:)) on iOS and the [In-App Review API](https://developer.android.com/guide/playcore/in-app-review/kotlin-java) on Android.

```swift
import SkipMarketplace

// Request a review at most once every 31 days (default)
Marketplace.current.requestReview()

// Custom interval
Marketplace.current.requestReview(period: .days(60))

// Custom predicate — only ask after the user has had a positive interaction
Marketplace.current.requestReview(period: Marketplace.ReviewRequestDelay(shouldCheckReview: {
    return launchCount > 5 && hasCompletedOnboarding && lastTaskWasSuccess
}))
```

The default period (31 days) reflects the platforms' guidance:

- Apple's [`requestReview`](https://developer.apple.com/documentation/storekit/requestreviewaction#overview) is limited to **3 prompts per 365-day window**, and the system may not actually display a prompt every time.
- Google's [In-App Review quotas](https://developer.android.com/guide/playcore/in-app-review#quotas) similarly throttle requests internally; calling the API too often is a no-op.

In short: **the OS already throttles you.** SkipMarketplace's `period` is a hint about when *your code* should bother making the call; the OS still has the final say.

For UX guidance on *when* to ask, see:
- [Apple HIG — Ratings and Reviews](https://developer.apple.com/design/human-interface-guidelines/ratings-and-reviews#Best-practices)
- [Google Play — When to request a review](https://developer.android.com/guide/playcore/in-app-review#when-to-request)

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

The prompt fires when the view becomes active (via `scenePhase`), is throttled to once per 24 hours by default, and behaves differently per platform:

| Platform | Mechanism |
|---|---|
| iOS | Queries `https://itunes.apple.com/lookup?bundleId=...` for the latest published version, compares it to `CFBundleShortVersionString`, and presents an [`.appStoreOverlay()`](https://developer.apple.com/documentation/swiftui/view/appstoreoverlay(ispresented:configuration:)) with an [`SKOverlay.AppConfiguration`](https://developer.apple.com/documentation/storekit/skoverlay/appconfiguration) if a newer version exists. Respects the store's `minimumOsVersion`. |
| Android | Uses the [In-App Updates Library](https://developer.android.com/guide/playcore/in-app-updates) to launch an [`IMMEDIATE`](https://developer.android.com/guide/playcore/in-app-updates#immediate) (fullscreen, blocking) update flow when [`UpdateAvailability.UPDATE_AVAILABLE`](https://developer.android.com/reference/com/google/android/play/core/install/model/UpdateAvailability#UPDATE_AVAILABLE) is reported. Falls back to opening the Play Store listing if the in-app flow fails. |

Bypass the 24-hour throttle when you need to force the prompt (e.g., a mandatory update):

```swift
.appUpdatePrompt(forcePrompt: true)
```

To test the Android in-app update flow, follow Google's [Test in-app updates](https://developer.android.com/guide/playcore/in-app-updates/test) guide — `IMMEDIATE` requires an internal-test-track install with a higher version code published.

## Installation Source

Determine where the app was installed from. On iOS this uses [`AppDistributor.current`](https://developer.apple.com/documentation/marketplacekit/appdistributor) (iOS 17.4+, returns `.unknown` on earlier versions). On Android it uses [`PackageManager.getInstallSourceInfo()`](https://developer.android.com/reference/android/content/pm/PackageManager#getInstallSourceInfo(java.lang.String)) (Android 11+) or the deprecated `getInstallerPackageName()` on older versions.

```swift
switch await Marketplace.current.installationSource {
case .appleAppStore:
    print("Installed from Apple App Store")
case .googlePlayStore:
    print("Installed from Google Play Store")
case .testFlight:
    print("Installed from TestFlight")
case .marketplace(let bundleId):
    print("Installed from EU alternative marketplace: \(bundleId)")
case .web:
    print("Installed via Web Distribution (EU)")
case .other(let name):
    // e.g. "org.fdroid.fdroid" (F-Droid), "com.amazon.venezia" (Amazon Appstore),
    // "com.rileytestut.AltStore" (AltStore), "com.sec.android.app.samsungapps" (Galaxy Store)
    print("Installed from: \(name ?? "unknown")")
case .unknown:
    print("Installation source unknown (sideload, debug build, or pre-Android 11 missing data)")
}
```

The convenience property `isFirstPartyAppStore` returns `true` only for `.appleAppStore` and `.googlePlayStore` — useful for gating features like in-app reviews or IAPs that only make sense on official stores:

```swift
let source = await Marketplace.current.installationSource
if source.isFirstPartyAppStore {
    Marketplace.current.requestReview()
}
```

## API Reference

### Marketplace

The main entry point, accessed via `Marketplace.current`.

| Method / Property | Description |
|---|---|
| `current` | The singleton marketplace instance |
| `installationSource` | Where the app was installed from (`async`) |
| `fetchProducts(for:subscription:)` | Fetch product details by ID. Wraps [`Product.products(for:)`](https://developer.apple.com/documentation/storekit/product/products(for:)) / [`BillingClient.queryProductDetails`](https://developer.android.com/reference/com/android/billingclient/api/BillingClient#queryProductDetails(com.android.billingclient.api.QueryProductDetailsParams,com.android.billingclient.api.ProductDetailsResponseListener)) |
| `purchase(item:offer:)` | Initiate a purchase. Wraps [`Product.purchase(options:)`](https://developer.apple.com/documentation/storekit/product/purchase(options:)) / [`BillingClient.launchBillingFlow`](https://developer.android.com/reference/com/android/billingclient/api/BillingClient#launchBillingFlow(android.app.Activity,com.android.billingclient.api.BillingFlowParams)) |
| `fetchEntitlements()` | Get all current entitlements. Wraps [`Transaction.currentEntitlements`](https://developer.apple.com/documentation/storekit/transaction/currententitlements) / [`BillingClient.queryPurchasesAsync`](https://developer.android.com/reference/com/android/billingclient/api/BillingClient#queryPurchasesAsync(com.android.billingclient.api.QueryPurchasesParams,com.android.billingclient.api.PurchasesResponseListener)) |
| `finish(purchaseTransaction:)` | **Acknowledge/finish a transaction.** Wraps [`Transaction.finish()`](https://developer.apple.com/documentation/storekit/transaction/finish()) / [`BillingClient.acknowledgePurchase`](https://developer.android.com/reference/com/android/billingclient/api/BillingClient#acknowledgePurchase(com.android.billingclient.api.AcknowledgePurchaseParams,com.android.billingclient.api.AcknowledgePurchaseResponseListener)). Must be called within 3 days on Android — [see why](https://developer.android.com/google/play/billing/integrate#process). |
| `getPurchaseTransactionUpdates()` | `AsyncThrowingStream` of transaction updates. Wraps [`Transaction.updates`](https://developer.apple.com/documentation/storekit/transaction/updates) / [`PurchasesUpdatedListener`](https://developer.android.com/reference/com/android/billingclient/api/PurchasesUpdatedListener) |
| `requestReview(period:)` | Request an app store review. Wraps [`AppStore.requestReview(in:)`](https://developer.apple.com/documentation/storekit/appstore/requestreview(in:)) / [`ReviewManager.launchReviewFlow`](https://developer.android.com/reference/com/google/android/play/core/review/ReviewManager#launchReviewFlow(android.app.Activity,com.google.android.play.core.review.ReviewInfo)) |

### View Modifier

| Modifier | Description |
|---|---|
| `.appUpdatePrompt(forcePrompt:)` | Prompt the user to update when a newer version is available. Uses [`.appStoreOverlay`](https://developer.apple.com/documentation/swiftui/view/appstoreoverlay(ispresented:configuration:)) on iOS, [In-App Updates](https://developer.android.com/guide/playcore/in-app-updates) on Android. |

### ProductInfo

Wraps [`StoreKit.Product`](https://developer.apple.com/documentation/storekit/product) on iOS / [`ProductDetails`](https://developer.android.com/reference/com/android/billingclient/api/ProductDetails) on Android. Access the underlying platform object via `product.product` for platform-specific functionality.

| Property | Description |
|---|---|
| `id: String` | Product identifier |
| `displayName: String` | Localized product name |
| `productDescription: String` | Localized product description |
| `displayPrice: String?` | Formatted price string for the default offer |
| `isSubscription: Bool` | Whether this is a subscription product |
| `oneTimePurchaseOfferInfo: [OneTimePurchaseOfferInfo]?` | One-time purchase offers (nil for subscriptions) |
| `subscriptionOffers: [SubscriptionOfferInfo]?` | Subscription offers (nil for one-time purchases) |

### PurchaseTransaction

Wraps [`StoreKit.Transaction`](https://developer.apple.com/documentation/storekit/transaction) on iOS / [`com.android.billingclient.api.Purchase`](https://developer.android.com/reference/com/android/billingclient/api/Purchase) on Android. Access the underlying platform object via `transaction.purchaseTransaction` for platform-specific details.

| Property | Description |
|---|---|
| `id: String?` | Order/transaction ID |
| `products: [String]` | Purchased product identifiers |
| `purchaseDate: Date` | When the purchase was made |
| `quantity: Int` | Number of items purchased |
| `expirationDate: Date?` | Subscription expiration (iOS only — Android subscriptions require server verification) |
| `isAcknowledged: Bool` | Whether the transaction has been finished. Maps to [`Purchase.isAcknowledged()`](https://developer.android.com/reference/com/android/billingclient/api/Purchase#isAcknowledged()) on Android; always `true` on iOS for entitlements from `currentEntitlements` |
| `isAutoRenewing: Bool` | Whether a subscription auto-renews |
| `revocationDate: Date?` | When the purchase was revoked (iOS only) |
| `originalID: String?` | Original transaction ID (for renewals) |
| `purchaseToken: String?` | Token for [server-side verification](https://developer.android.com/google/play/billing/security#verify) (Android only). Use this with the [Google Play Developer API](https://developers.google.com/android-publisher) `purchases.products.get` / `purchases.subscriptions.get` to verify on your backend. iOS uses [JWS signed transactions](https://developer.apple.com/documentation/storekit/verificationresult) instead. |
| `purchaseTransaction` | The underlying platform transaction object |

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

Wraps [`Product.SubscriptionOffer`](https://developer.apple.com/documentation/storekit/product/subscriptionoffer) on iOS / [`ProductDetails.SubscriptionOfferDetails`](https://developer.android.com/reference/com/android/billingclient/api/ProductDetails.SubscriptionOfferDetails) on Android.

| Property | Description |
|---|---|
| `id: String?` | Offer identifier |
| `pricingPhases: [SubscriptionPricingPhase]` | Pricing phases in this offer |
| `offerToken: String?` | Offer token used by the billing flow (Android only) |
| `type` | Offer type — `.introductory`, `.promotional`, `.winBack` (iOS only) |

### SubscriptionPricingPhase

| Property | Description |
|---|---|
| `price: Decimal` | Numeric price for this phase |
| `displayPrice: String` | Formatted price string |
| `billingPeriod: String?` | ISO 8601 duration (e.g. `P1M`, `P1Y`, `P7D`) |
| `billingCycleCount: Int` | Number of cycles (0 = infinite) |
| `recurrenceMode: String` | `"INFINITE_RECURRING"`, `"FINITE_RECURRING"`, or `"NON_RECURRING"` |

### InstallationSource

| Case | Description |
|---|---|
| `.appleAppStore` | Apple App Store |
| `.googlePlayStore` | Google Play Store |
| `.testFlight` | TestFlight beta |
| `.marketplace(bundleId:)` | EU alternative marketplace ([MarketplaceKit](https://developer.apple.com/documentation/marketplacekit)) |
| `.web` | EU Web Distribution |
| `.other(String?)` | Other installer (e.g. F-Droid, Amazon, Galaxy Store, AltStore) |
| `.unknown` | Unknown / sideloaded |
| `.isFirstPartyAppStore` | `true` only for `.appleAppStore` and `.googlePlayStore` |

### ReviewRequestDelay

| Factory | Description |
|---|---|
| `.default` | Once every 31 days |
| `.days(Int)` | Once every N days |
| `init(shouldCheckReview:)` | Custom predicate |

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

