---
title: Marketplace
layout: docs
note: This documentation section is derived from https://raw.githubusercontent.com/skiptools/skip-marketplace/main/README.md using the scripts/syncdocs.sh script. Do not change the file here, change it there.
---

:::note[Source Repository]{icon="github"}
The skip-marketplace framework is available at [https://github.com/skiptools/skip-marketplace.git](https://source.skip.tools/skip-marketplace.git), which can be checked out and tested with `skip test` once Skip is [installed](/docs/gettingstarted/).
:::

This module provide support for interfacing with an app's
marketplace, such as the Google Play Store for Android
and the Apple App Store for iOS.

Currently, the framework provides the ability to request
a store rating for the app from the user. In the future,
this framework will provide the ability to perform
in-app purchases and subscription management.

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
        .package(url: "https://source.skip.tools/skip-marketplace.git", "0.0.0"..<"2.0.0"),
    ],
    targets: [
        .target(name: "MyTarget", dependencies: [
            .product(name: "SkipMarketplace", package: "skip-marketplace")
        ])
    ]
)
```

## App Review Requests

You can use this library to request that the app marketplace show a prompt to the user requesting a rating for the app for the given marketplace.

```swift
import SkipMarketplace

// request that the system show an app review request at most once every month
Marketplace.current.requestReview(period: .days(31))
```

For guidance on how and when to make these sorts of requests, see the
relevant documentation for the 
[Apple App Store](https://developer.android.com/guide/playcore/in-app-review#when-to-request)
and
[Google PlayStore](https://developer.apple.com/design/human-interface-guidelines/ratings-and-reviews#Best-practices).

## Querying App Installation Source

Determining which source was used to install the app (Apple App store, Google Play Store, AltStore, F-Droid, etc.) can be useful for determining what billing mechanism to use. This can be done by querying the `Marketplace.current.installationSource` property like:

```swift
switch await Marketplace.current.installationSource {
case .appleAppStore: canUseNativeBillling = true
case .googlePlayStore: canUseNativeBillling = true
case .other(let id): canUseNativeBillling = false // handle other markerplaces here
default: canUseNativeBillling = false
}
```

## Listing and purchasing in-app purchases
:::tip
> Managing in-app purchases in SkipMarketplace works best for non-consumable one-time-product entitlements, products that the user buys once and owns forever. You can use it for one-time-product consumables and subscriptions, but it's best to integrate those tightly with a server-side database that tracks purchases, consumptions and expirations. Your server-side web app can also sign promotional offers, accepts webhook notifications from the app stores, etc.
>
> Rather than building all of that yourself to integrate with SkipMarketplace, you might prefer to use [RevenueCat](https://www.revenuecat.com/) for this, using the [skip-revenue](/docs/modules/skip-revenue) library. (RevenueCat does cost money; if you want to roll your own subscription-management software, you can do it with SkipMarketplace.)
:::

### Android Configuration

You must set the `com.android.vending.BILLING` permission in your `AndroidManifest.xml` file like so:

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    <uses-permission android:name="com.android.vending.BILLING"/>
</manifest>
```

### Start by defining your products in App Store Connect and/or the Google Play Store

* One-time products
    * App Store Connect: [Create consumable or non-consumable In-App Purchases](https://developer.apple.com/help/app-store-connect/manage-in-app-purchases/create-consumable-or-non-consumable-in-app-purchases/)
    * Google Play Console: [Overview of one-time products](https://support.google.com/googleplay/android-developer/answer/16430488)
* Subscriptions
    * App Store Connect: [Offer auto-renewable subscriptions](https://developer.apple.com/help/app-store-connect/manage-subscriptions/offer-auto-renewable-subscriptions)
    * Google Play Console: [Create and manage subscriptions](https://support.google.com/googleplay/android-developer/answer/140504?hl=en)

### One-Time Purchases: Fetch ProductInfo and Prices

```swift
do {
    let productIdentifiers = ["product1", "product2", "product3"]
    let products: [ProductInfo] = try await Marketplace.current.fetchProducts(
        for: productIdentifiers,
        subscription: false
    )

    for product in products {
        print("product \(product.id) \(product.displayName)")
        let oneTimePurchaseOfferInfo: [OneTimePurchaseOfferInfo] = product.oneTimePurchaseOfferInfo!
        for offer in oneTimePurchaseOfferInfo {
            // On iOS, there will be only one offer, and its ID will be nil
            // On GPS, there may be multiple offers, if you configured additional offers in the console
            print("product \(product.id) offer \(offer.id ?? "nil") \(offer.displayPrice) \(offer.price)")
        }
    }
}
```

### Subscriptions: Fetch ProductInfo and Prices

```swift
do {
    let productIdentifiers = ["product1", "product2", "product3"]
    let products: [ProductInfo] = try await Marketplace.current.fetchProducts(for: productIdentifiers, subscription: true)

    for product in products {
        print("product \(product.id) \(product.displayName)")
        let subscriptionOffers: [SubscriptionOfferInfo] = product.subscriptionOffers!
        for offer in subscriptionOffers {
            #if !SKIP
            print("product \(product.id) offer \(offer.id ?? "nil") type \(offer.type)")
            #endif
            let pricingPhases: [SubscriptionPricingPhase] = offer.pricingPhases
            for pricingPhase in pricingPhases {
                print("product \(product.id) offer \(offer.id ?? "nil") \(pricingPhase.displayPrice) \(pricingPhase.price)")
            }
        }
    }
} catch {
    print("Error fetching products: \(error)")
}
```

### Purchasing (displaying a purchase sheet)

```swift
do {
    let product: ProductInfo = try await Marketplace.current.fetchProducts(for: ["productIdentifier"], subscription: false).first!
    if let purchaseTransaction: PurchaseTransaction = try await Marketplace.current.purchase(item: product) {
        print("Purchased \(purchaseTransaction.products)")
        // after you've stored the transaction somewhere, you should finish every PurchaseTransaction to acknowledge receipt
        try await Marketplace.current.finish(purchaseTransaction: purchaseTransaction)
    }
} catch {
    print("Error purchasing product: \(error)")
}
```

You can also pass in a purchase offer (with a discounted price).

```swift
do {
    let product: ProductInfo = try await Marketplace.current.fetchProducts(for: ["productIdentifier"], subscription: false).first!
    let offer = product.oneTimePurchaseOfferInfo.first!
    if let purchaseTransaction: PurchaseTransaction = try await Marketplace.current.purchase(item: product, offer: offer) {
        print("Purchased \(purchaseTransaction.products)")
        // after you've stored the transaction somewhere, you should finish every PurchaseTransaction to acknowledge receipt
        try await Marketplace.current.finish(purchaseTransaction: purchaseTransaction)
    }
} catch {
    print("Error purchasing product: \(error)")
}
```

### Querying for entitlements

"Entitlements" ane non-consumable one-time products and subscriptions, something that the user is entitled to because they've currently purchased it.

```swift
do {
    let entitlements: [PurchaseTransaction] = try await Marketplace.current.fetchEntitlements()
    for purchaseTransaction in entitlements {
        let products: [String] = purchaseTransaction.products
        print("You own \(products)")
        // after you've stored the transaction somewhere, you should finish every PurchaseTransaction to acknowledge receipt
        // it's OK to "finish" the same transaction more than once
        try await Marketplace.current.finish(purchaseTransaction: purchaseTransaction)
    }
} catch {
    print("Error fetching entitlements: \(error)")
}
```

### Handling updates to purchase transactions

```swift
do {
    for try await purchaseTransaction in Marketplace.current.getPurchaseTransactionUpdates() {
        print("Transaction update: \(purchaseTransaction)")
        // after you've stored the transaction somewhere, you should finish every PurchaseTransaction to acknowledge receipt
        // it's OK to "finish" the same transaction more than once
        try await Marketplace.current.finish(purchaseTransaction: purchaseTransaction)
    }
} catch {
    print("Error loading transaction updates: \(error)")
}
```

### Testing purchases during development

* iOS: [Setting up StoreKit testing in Xcode](https://developer.apple.com/documentation/xcode/setting-up-storekit-testing-in-xcode)
* Google Play: [Test your Google Play Billing Library integration](https://developer.android.com/google/play/billing/test)

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

