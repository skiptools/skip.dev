---
title: Firebase
description: Documentation for Firebase fetched from GitHub.
note: This documentation section is derived from the GitHub README.md source using the scripts/sync-modules.mjs script. Do not make edits to the file here, change it there.
editUrl: https://github.com/skiptools/skip-firebase/edit/main/README.md
---

:::note[Source Repository <a href='https://github.com/skiptools/skip-firebase/releases' alt='Releases for skip-firebase'><img decoding='async' loading='lazy' alt='Releases for skip-firebase' src='https://img.shields.io/github/v/release/skiptools/skip-firebase.svg?style=flat' /></a>]{icon="github"}
This framework is available at [github.com/skiptools/skip-firebase](https://github.com/skiptools/skip-firebase) and can be checked out and improved locally as described in the [Contribution Guide](/docs/contributing/#local-libraries).
:::


This package provides Firebase support for Skip Swift projects.
The Swift side uses the official Firebase iOS SDK directly,
with the various `SkipFirebase*` modules passing the transpiled calls
through to the Firebase Android SDK.

For an example of using Firebase in a [Skip Fuse](/docs/modes/#fuse) app, see the
[FiresideFuse Sample](/docs/samples/skipapp-fireside-fuse). For a [Skip Lite](/docs/modes/#lite) app, see the [Fireside Sample](/docs/samples/skipapp-fireside).

## Package

The modules in the SkipFirebase framework project mirror the division of the SwiftPM
modules in the Firebase iOS SDK (at [https://github.com/firebase/firebase-ios-sdk.git](https://github.com/firebase/firebase-ios-sdk.git)),
which is also mirrored in the division of the Firebase Kotlin Android gradle modules (at [https://github.com/firebase/firebase-android-sdk.git](https://github.com/firebase/firebase-android-sdk.git)).

See the `Package.swift` files in the
[FiresideFuse](/docs/samples/skipapp-fireside-fuse) and [Fireside](/docs/samples/skipapp-fireside) apps for examples of integrating Firebase dependencies.

## Module Coverage

`skip-firebase` exposes Swift API parity with the Firebase iOS SDK for the most common use cases on Android. The Android-side implementation lives in each `Sources/SkipFirebase*` Swift file (transpiled to Kotlin) and forwards calls to the official Firebase Android SDK. The table below summarizes, per module, the approximate share of the iOS API surface that has been bridged, along with the major gaps.

| Module | iOS API Coverage | Highlights | Notable Gaps |
|---|:---:|---|---|
| `SkipFirebaseCore` | ~80% | `FirebaseApp.configure` (default + named + custom `FirebaseOptions`), app lifecycle, `Timestamp`, deep Kotlin↔Swift value conversion helpers | Custom `FirebaseLogger`, advanced data-collection toggles |
| `SkipFirebaseFirestore` | ~90% | Collections, documents, batched writes, queries, `Filter.and`/`.or` composition, `FieldPath`, aggregate queries (`count`/`average`/`sum`), snapshot listeners, `FieldValue` sentinels, `LoadBundleTaskProgress`, `GeoPoint`, `FirestoreSettings` with persistent/memory cache configuration, `DocumentSnapshot.metadata`/`reference`/`get(FieldPath)`, completion-based `addDocument`, `getDocument(source:)`, `setData(mergeFields:)`, `Codable` encoding/decoding via `FirestoreEncoder`/`FirestoreDecoder`, errors mapped to `NSError` with `FirestoreErrorDomain`/`FirestoreErrorCode` | `runTransaction` (`Transaction` is currently a passthrough wrapper), `InputStream`-based bundle loading, `Codable` decoding uses `snapshot.decoded()` on Android (not `data(as:)` due to a Skip transpiler limitation with `T.Type` parameters) |
| `SkipFirebaseAuth` | ~60% | Email/password sign-in, anonymous sign-in, email-link sign-in, interactive OAuth provider sign-in (Activity-based), state-change listener, ID-token retrieval, profile changes, account linking, reauthentication, `fetchSignInMethods`, `ActionCodeSettings`, partial `AuthErrorCode` mapping | Phone auth (`PhoneAuthProvider`, SMS verification), multi-factor (`MultiFactor`/`MultiFactorResolver`), `applyActionCode`/`checkActionCode`/`confirmPasswordReset`/`verifyPasswordResetCode`, custom-token sign-in, `GameCenterAuthProvider`, language/tenant configuration, `updateEmail`/`updatePassword` |
| `SkipFirebaseStorage` | ~80% | Bucket and reference resolution, upload (`putFile`/`putData` in both callback and `async` forms), download (`getData`/`write(toFile:)`), `StorageMetadata` read/write, `downloadURL`, `delete`, pause/resume/cancel on uploads, `list`/`listAll` with pagination (`pageToken`), live `Progress` snapshot observers on uploads and file downloads | Full `StorageError` code mapping, `putStream`/`putString` |
| `SkipFirebaseMessaging` | ~70% | FCM token retrieval + auto-refresh, topic subscribe/unsubscribe, `MessagingDelegate`, `MessagingService` integrating with iOS-style `UNUserNotificationCenterDelegate`, intent routing, localized `loc_key`/`loc_args` title/body, `RemoteMessage` → `UNNotification` translation | Per-sender FCM token APIs and notification-service-extension helpers (`populateNotificationContent`, `exportDeliveryMetricsToBigQuery`) are stubbed out as `@available(*, unavailable)` |
| `SkipFirebaseAnalytics` | ~70% | `logEvent`, user properties/ID, consent (`setConsent` with `ConsentType`/`ConsentStatus`), session ID, `setSessionTimeoutInterval`, `setDefaultEventParameters`, `appInstanceID`, all standard event/parameter/user-property name constants, SwiftUI `.analyticsScreen` modifier | `initiateOnDeviceConversionMeasurement` (email/phone variants), `handleEvents(forSession:)`, deep-link helpers |
| `SkipFirebaseRemoteConfig` | ~70% | `fetch`/`activate`/`fetchAndActivate`, `ensureInitialized`, value retrieval, keys-by-prefix, `RemoteConfigSettings` (intervals + timeout), defaults, `RemoteConfigValue` (string/bool/number/data/json/source) | `addOnConfigUpdateListener` (real-time config updates), `setCustomSignals` |
| `SkipFirebaseAppCheck` | ~60% | Token retrieval (`token(forcingRefresh:)`, `limitedUseToken`), token-change listener bridged through `NotificationCenter`, debug provider factory, `AppCheckErrorCode` | iOS-only `DeviceCheckProviderFactory`/`AppAttestProviderFactory` (no Android equivalent), custom `AppCheckProvider` implementations |
| `SkipFirebaseCrashlytics` | ~75% | `log`, `setCustomValue`/`setCustomKeysAndValues`, `setUserID`, `didCrashDuringPreviousExecution`, `checkForUnsentReports`/`sendUnsentReports`/`deleteUnsentReports`, `record(error:userInfo:)`, `recordExceptionModel`, `FIRExceptionModel`/`FIRStackFrame` | `logWithFormat` and `checkAndUpdateUnsentReports` are marked `@available(*, unavailable)`; no per-`FirebaseApp` instance accessor |
| `SkipFirebaseFunctions` | ~75% | Default/regional/emulator instance, `httpsCallable(_:)` and `httpsCallable(_:options:)` (name and URL-based), `HTTPSCallableOptions` with `requireLimitedUseAppCheckTokens`, `async`/`await` `call`, completion-based `call`, `timeoutInterval`, automatic Kotlin→Swift result conversion via `deepSwift` | Streaming RPCs (`stream`), `Callable<Request, Response>` Codable wrapper, `customDomain`-based factory |
| `SkipFirebaseDatabase` | ~5% | `Database.database()` / `Database.database(app:)` singleton accessors | Effectively the entire API: `DatabaseReference`, `child`/`push`/`setValue`/`updateChildValues`/`removeValue`, `observe`/`observeSingleEvent`, queries, `DataSnapshot`, `ServerValue`, online/offline toggle |
| `SkipFirebaseInstallations` | ~75% | Singleton accessor (`installations()`/`installations(app:)`), `installationID()`, `authToken()`, `authTokenForcingRefresh(_:)`, `delete()`, `InstallationsAuthTokenResult` (`authToken`, `expirationDate`) | `installationIDDidChangeNotification`, per-`FirebaseApp` notification keys |
| `SkipFirebasePerformance` | ~65% | `Performance.sharedInstance()`, `isDataCollectionEnabled`, `trace(name:)`, `HTTPMetric(url:httpMethod:)`, full `Trace` API (start/stop, `incrementMetric`, `valueForMetric`, attributes), full `HTTPMetric` API (start/stop, `responseCode`, payload sizes, content type, attributes), `HTTPMethod` enum | `isInstrumentationEnabled` (no Android equivalent, marked unavailable), `Performance.startTrace(name:)` static convenience, per-`FirebaseApp` instance accessor |

**Overall coverage across the fourteen modules: roughly 60% of the iOS API surface.** The most production-used modules — Core, Firestore, Auth, Storage, Messaging, Analytics, Crashlytics, and RemoteConfig — sit in the 60–80% range and cover the standard read/write/sign-in/log/notify paths. `SkipFirebaseDatabase` (Realtime Database) is mostly a stub.

### What is working well

- **Firestore** is the most complete module: all common CRUD, queries (including `Filter` combinators and `FieldPath` predicates), snapshot listeners (with `MetadataChanges` support), batched writes, aggregate queries, `FieldValue` sentinels, `GeoPoint`, and `FirestoreSettings` (persistent and memory cache) round-trip correctly between Swift and the Firestore Android SDK. `Codable` models can be encoded with `setData(from:)` and decoded with `snapshot.decoded()` on Android (note: use `snapshot.data(as:)` from `FirebaseFirestoreSwift` on iOS). Errors are mapped to `NSError` with `FirestoreErrorDomain`/`FirestoreErrorCode` so error handling looks the same on both platforms.
- **Auth** covers the most common sign-in flows (email/password, anonymous, interactive OAuth via the system browser, email-link) and exposes a familiar `User` API with profile changes, account linking, reauthentication, ID-token retrieval, and a state-change listener.
- **Messaging** handles the full FCM lifecycle: token retrieval and auto-refresh, topic subscribe/unsubscribe, `RemoteMessage` → `UNNotification` translation (including localized `loc_key`/`loc_args` substitution from the app's `Localizable.strings`), and a `MessagingService` that integrates with iOS-style `UNUserNotificationCenterDelegate`.
- **Storage** supports both data-based and file-based uploads/downloads in callback and `async` forms, plus full `StorageMetadata` read/write.
- **Analytics**, **RemoteConfig**, **AppCheck**, and **Crashlytics** all expose the workhorse APIs that apps need day-to-day, including a SwiftUI `.analyticsScreen` modifier and a `NotificationCenter`-backed AppCheck token-change listener.

### What still needs to be implemented

- **Realtime Database** (`SkipFirebaseDatabase`) is currently only a stub. `DatabaseReference`, `observe`/`observeSingleEvent`, queries, and writes have not been bridged. Apps that rely on the Realtime Database should use Firestore instead or contribute the missing wrappers.
- **Phone-number authentication and multi-factor flows** in `SkipFirebaseAuth` are not bridged. Apps requiring SMS verification or MFA need to drop into `#if SKIP` blocks and call the Android Firebase SDK directly.
- **`runTransaction`** in Firestore is not implemented — the `Transaction` class is currently a passthrough wrapper with no operations. Multi-document atomic reads-then-writes need to be expressed as `WriteBatch` commits or as Kotlin-side code today.
- **`Codable` decoding API differs by platform** — on Android use `snapshot.decoded()` with explicit type annotation (`let m: MyModel = try snapshot.decoded()`); on iOS use `FirebaseFirestoreSwift`'s `snapshot.data(as: MyModel.self)`. The `setData(from:)` encoding API works identically on both platforms.
- **`SkipFirebaseFunctions`** does not support streaming RPCs (`stream`). The Firebase Android SDK has no SSE/streaming equivalent to the iOS `AsyncThrowingStream`-based `stream` API — Android Functions calls are always one-shot request/response. Any code that iterates over `.stream(...)` on iOS will not compile on Android. The `Callable<Request, Response>` Codable convenience wrapper is also not bridged; use `call(_ data: Any?)` directly and decode the result manually on Android.
- **`SkipFirebaseRemoteConfig`** does not yet expose `addOnConfigUpdateListener` (real-time config updates) or custom signals.
- **`SkipFirebaseAppCheck`** ships only the `Debug` provider factory; custom provider implementations are not yet bridgeable.
- **`SkipFirebaseInstallations`** cannot bridge the `InstallationIDDidChange` notification or the `InstallationIDDidChangeAppNameKey` userInfo key. The Firebase Android SDK has no equivalent push-notification mechanism for installation ID changes — it exposes no broadcast, callback, or listener that fires when the ID rotates. As a result, any code that observes `NotificationCenter.default.publisher(for: .InstallationIDDidChange)` on iOS will compile on Android but never receive an event. If your app relies on this to, for example, re-upload the installation ID to your backend after it changes, you will need an alternative strategy on Android (such as fetching the ID on every app foreground, or polling after Firebase SDK upgrades).

### Firebase modules not yet wrapped

The following Firebase iOS SDK products do not yet have a `SkipFirebase*` counterpart in this package: `FirebaseABTesting`, `FirebaseAI` / Vertex AI, `FirebaseAppDistribution`, `FirebaseDataConnect`, `FirebaseDynamicLinks` (deprecated upstream), `FirebaseInAppMessaging`, and `FirebaseMLModelDownloader`. Pull requests adding any of these are welcome.

<!--
An example of a Skip Lite app projects using the `Firestore` API at the model layer and the `Messaging` API at the app layer can be seen from the command:

```console
skip init --show-tree --icon-color='1abc9c' --no-zero --appid=skip.fireside.App --version 0.0.1 skipapp-fireside FireSide:skip-ui/SkipUI:skip-firebase/SkipFirebaseMessaging FireSideModel:skip-foundation/SkipFoundation:skip-model/SkipModel:skip-firebase/SkipFirebaseFirestore:skip-firebase/SkipFirebaseAuth
```

This will create an SwiftPM project in `skipapp-fireside/Package.swift` like:

```swift
// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "skipapp-fireside",
    defaultLocalization: "en",
    platforms: [.iOS(.v16), .macOS(.v13), .tvOS(.v16), .watchOS(.v9), .macCatalyst(.v16)],
    products: [
        .library(name: "FireSideApp", type: .dynamic, targets: ["FireSide"]),
        .library(name: "FireSideModel", targets: ["FireSideModel"]),
    ],
    dependencies: [
        .package(url: "https://source.skip.dev/skip.git", from: "1.0.0"),
        .package(url: "https://source.skip.dev/skip-ui.git", from: "1.0.0"),
        .package(url: "https://source.skip.dev/skip-foundation.git", from: "1.0.0"),
        .package(url: "https://source.skip.dev/skip-model.git", from: "1.0.0"),
        .package(url: "https://source.skip.dev/skip-firebase.git", "0.0.0"..<"2.0.0")
    ],
    targets: [
        .target(name: "FireSide", dependencies: [
            "FireSideModel", 
            .product(name: "SkipUI", package: "skip-ui"),
            .product(name: "SkipFirebaseMessaging", package: "skip-firebase")
        ], resources: [.process("Resources")], plugins: [.plugin(name: "skipstone", package: "skip")]),
        .testTarget(name: "FireSideTests", dependencies: [
            "FireSide", 
            .product(name: "SkipTest", package: "skip")
        ], resources: [.process("Resources")], plugins: [.plugin(name: "skipstone", package: "skip")]),
        
        .target(name: "FireSideModel", dependencies: [
            .product(name: "SkipFoundation", package: "skip-foundation"), 
            .product(name: "SkipModel", package: "skip-model"), 
            .product(name: "SkipFirebaseFirestore", package: "skip-firebase"),  
            .product(name: "SkipFirebaseAuth", package: "skip-firebase")
        ], resources: [.process("Resources")], plugins: [.plugin(name: "skipstone", package: "skip")]),
        .testTarget(name: "FireSideModelTests", dependencies: [
            "FireSideModel", 
            .product(name: "SkipTest", package: "skip")
        ], resources: [.process("Resources")], plugins: [.plugin(name: "skipstone", package: "skip")]),
    ]
)
```
-->

## Setup

For a Skip app, the simplest way to setup Firebase support is to
create a Firebase project at [https://console.firebase.google.com/project](https://console.firebase.google.com/project).
Follow the Firebase setup instructions to obtain the 
`GoogleService-Info.plist` and `google-services.json` files and
add them to the iOS and Android sides of the project:

- The `GoogleService-Info.plist` file should be placed in the `Darwin/` folder of the Skip project
- The `google-services.json` file should be placed in the `Android/app/` folder of the Skip project

In addition, the `com.google.gms.google-services` plugin will need to be added to the 
Android app's `Android/app/build.gradle.kts` file in order to process the `google-services.json`
file for the app, like so:

```kotlin
plugins {
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.android.application)
    id("skip-build-plugin")
    id("com.google.gms.google-services") version "4.4.4" apply true
    id("com.google.firebase.crashlytics") version "3.0.2" apply true # (if using Crashlytics)
}
```

For concrete examples, see the [FireSideFuse Sample](/docs/samples/skipapp-fireside-fuse) project.
{: class="callout info"}

Once Firebase has been added to your project, you need to configure the `FirebaseApp` on app startup. This is typically done in the `onInit()` callback of the `*AppDelegate` in your `*App.swift` file. Here is a snippet from the FireSideFuse sample app:

```swift
import SkipFirebaseCore
...

/* SKIP @bridge */public final class FireSideFuseAppDelegate : Sendable {
    /* SKIP @bridge */public static let shared = FireSideFuseAppDelegate()

    ...

    /* SKIP @bridge */public func onInit() {
        logger.debug("onInit")

        FirebaseApp.configure()
        ...
    }

    ...
}
```

After configuring the `FirebaseApp`, you will be able to access the singleton type for each of the
imported Firebase modules. For example, the following actor uses the `Firestore` singleton:

```swift
// Sources/FireSideFuse/FireSideFuseApp.swift

import SkipFirebaseFirestore

...

public actor Model {
    /// The shared model singleton
    public static let shared = Model()

    private let firestore: Firestore

    private init() {
        self.firestore = Firestore.firestore()
    }
    
    public func queryData() async throws -> [DataModel] { ... }
    public func saveData(model: DataModel) async throws { ... }

    ...
}
```

## Messaging

After [setting up](#setup) your app to use Firebase, enabling push notifications via Firebase Cloud Messaging (FCM) requires a number of additional steps.

1. Follow Firebase's [instructions](https://firebase.google.com/docs/cloud-messaging/ios/client) for creating and uploading your Apple Push Notification Service (APNS) key.
1. Use Xcode to [add the Push capability](https://developer.apple.com/documentation/xcode/adding-capabilities-to-your-app/) to your iOS app.
1. Add Skip's Firebase messaging service and default messaging channel to `Android/app/src/main/AndroidManifest.xml`:

    ```xml
    ...
    <application ...>
        ...
        <service
            android:name="skip.firebase.messaging.MessagingService"
            android:exported="false">
            <intent-filter>
                <action android:name="com.google.firebase.MESSAGING_EVENT" />
            </intent-filter>
        </service>
        <meta-data
            android:name="com.google.firebase.messaging.default_notification_channel_id"
            android:value="tools.skip.firebase.messaging" />
    </application>
    ```

1. Consider increasing the `minSdk` version of your Android app. Prior to SDK 33, Android does not provide any control over asking the user for push notification permissions. Rather, the system will prompt the user for permission only after receiving a notification and opening the app. Increasing your `minSdk` will allow you to decide when to request notification permissions. To do so, edit your `Android/app/build.gradle.kts` file and change the `minSdk` value to 33.
1. Define a delegate to receive notification callbacks. In keeping with Skip's philosophy of *transparent adoption*, both the iOS and Android sides of your app will receive callbacks via iOS's standard `UNUserNotificationCenterDelegate` API, as well as the Firebase iOS SDK's `MessagingDelegate`. Here are example [Skip Fuse](/docs/modes/#fuse) delegate implementations that works across both platforms:

```swift
import SwiftFuseUI
import SkipFirebaseMessaging

final class NotificationDelegate : NSObject, UNUserNotificationCenterDelegate, Sendable {
    public func requestPermission() {
        let authOptions: UNAuthorizationOptions = [.alert, .badge, .sound]
        Task { @MainActor in
            do {
                if try await UNUserNotificationCenter.current().requestAuthorization(options: authOptions) {
                    logger.info("notification permission granted")
                } else {
                    logger.info("notification permission denied")
                }
            } catch {
                logger.error("notification permission error: \(error)")
            }
        }
    }

    public func userNotificationCenter(_ center: UNUserNotificationCenter, willPresent notification: UNNotification) async -> UNNotificationPresentationOptions {
        let content = notification.request.content
        logger.info("willPresentNotification: \(content.title): \(content.body) \(content.userInfo)")
        return [.banner, .sound]
    }

    public func userNotificationCenter(_ center: UNUserNotificationCenter, didReceive response: UNNotificationResponse) async {
        let content = response.notification.request.content
        logger.info("didReceiveNotification: \(content.title): \(content.body) \(content.userInfo)")
        #if os(Android) || !os(macOS)
        // Example of using a deep_link key passed in the notification to route to the app's `onOpenURL` handler
        if let deepLink = response.notification.request.content.userInfo["deep_link"] as? String, let url = URL(string: deepLink) {
            Task { @MainActor in
                await UIApplication.shared.open(url)
            }
        }
        #endif
    }
}

// Your Firebase MessageDelegate must bridge because we use the Firebase Kotlin API on Android.
/* SKIP @bridge */final class MessageDelegate : NSObject, MessagingDelegate, Sendable {
    /* SKIP @bridge */public func messaging(_ messaging: Messaging, didReceiveRegistrationToken token: String?) {
        logger.info("didReceiveRegistrationToken: \(token ?? "nil")")
    }
}
```

1. Wire everything up. This includes assigning your shared delegate, registering for remote notifications, and other necessary steps. Below we build on our [previous Firebase setup code](#setup) to perform these actions. This is taken from our FireSideFuse sample app:

```swift
// Sources/FireSideFuse/FireSideFuseApp.swift

import SkipFirebaseCore

...

/* SKIP @bridge */public final class FireSideFuseAppDelegate : Sendable {
    /* SKIP @bridge */public static let shared = FireSideFuseAppDelegate()

    private let notificationDelegate = NotificationDelegate()
    private let messageDelegate = MessageDelegate()

    private init() {
    }

    /* SKIP @bridge */public func onInit() {
        logger.debug("onInit")

        // Configure Firebase and notifications
        FirebaseApp.configure()
        Messaging.messaging().delegate = messageDelegate
        UNUserNotificationCenter.current().delegate = notificationDelegate
    }

    /* SKIP @bridge */public func onLaunch() {
        logger.debug("onLaunch")
        // Ask for permissions at a time appropriate for your app
        notificationDelegate.requestPermission()
    }

    ...
}
```

```swift
// Darwin/Sources/Main.swift

...

class AppMainDelegate: NSObject, AppMainDelegateBase {
    ...

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey : Any]? = nil) -> Bool {
        AppDelegate.shared.onLaunch()
        application.registerForRemoteNotifications() // <-- Insert
        return true
    }

    ...
}
```

```kotlin
// Android/app/src/main/kotlin/.../Main.kt

...

open class MainActivity: AppCompatActivity {
    ...

    override fun onCreate(savedInstanceState: android.os.Bundle?) {
        ...

        setContent {
            ...
        }

        skip.firebase.messaging.Messaging.messaging().onActivityCreated(this) // <-- Insert
        FireSideFuseAppDelegate.shared.onLaunch()

        ...
    }

    ...
}
```

1. See Firebase's [iOS instructions](https://firebase.google.com/docs/cloud-messaging/ios/client) and [Android instructions](https://firebase.google.com/docs/cloud-messaging/android/client) for additional details and options, including how to send test messages to your apps!

The [FiresideFuse](/docs/samples/skipapp-fireside-fuse) and [Fireside](/docs/samples/skipapp-fireside) projects are great references for seeing complete, working Skip Fuse and Skip Lite apps using Firebase push notifications.
{: class="callout info"}

## Error handling

### Firestore

The Firestore API converts `com.google.firebase.firestore.FirebaseFirestoreException` to NSError so you can handle errors the same way on both platforms:

```swift
do {
    try await Firestore.firestore().collection("foo").document("bar").updateData(...)
} catch let error as NSError {
    if error.domain == FirestoreErrorDomain && error.code == FirestoreErrorCode.notFound.rawValue {
        ...
    }
}
```

### Catching other errors

Other parts of this library have not been updated to this unified error handling. Instead, you can access the underlying Kotlin exceptions in SKIP blocks according to the documentation:

- FirebaseAuth: https://firebase.google.com/docs/reference/android/com/google/firebase/auth/FirebaseAuth
- FirebaseMessaging.MessagingService.onSendError: https://firebase.google.com/docs/reference/android/com/google/firebase/messaging/SendException
- FirebaseStorage: https://firebase.google.com/docs/reference/android/com/google/firebase/storage/StorageException

```swift
do {
    try await Storage.storage().reference().child("nonexistent").delete()
} catch {
    #if !SKIP
    let error = error as NSError
    let errorCode = error.domain == StorageError.errorDomain ? error.code : nil
    #else
    let exception = (error as Exception).cause as? com.google.firebase.storage.StorageException
    let errorCode = exception?.code.value()
    #endif
    if errorCode == -13010 { 
        // Object not found
    }
}
```

## Testing

For unit testing, where there isn't a standard place to store the
`GoogleService-Info.plist` and `google-services.json` configuration files,
you can create an configure the app using the `SkipFirebaseCore.FirebaseApp`
API manually from the information provided from the Firebase console, like so:

```swift
import SkipFirebaseCore
import SkipFirebaseAuth
import SkipFirebaseStorage
import SkipFirebaseDatabase
import SkipFirebaseAppCheck
import SkipFirebaseFunctions
import SkipFirebaseFirestore
import SkipFirebaseMessaging
import SkipFirebaseCrashlytics
import SkipFirebaseRemoteConfig
import SkipFirebaseInstallations
import SkipFirebasePerformance

let appName = "myapp"
let options = FirebaseOptions(googleAppID: "1:GCM:ios:HASH", gcmSenderID: "GCM")
options.projectID = "some-firebase-projectid"
options.storageBucket = "some-firebase-demo.appspot.com"
options.apiKey = "some-api-key"

FirebaseApp.configure(name: appName, options: options)
guard let app = FirebaseApp.app(name: appName) else {
    fatalError("Cannot load Firebase config")
}

// customize the app here
app.isDataCollectionDefaultEnabled = false

// use the app to create and test services
let auth = Auth.auth(app: app)
let storage = Storage.storage(app: app)
let database = Database.database(app: app)
let appcheck = AppCheck.appCheck(app: app)
let functions = Functions.functions(app: app)
let firestore = Firestore.firestore(app: app)
let crashlytics = Crashlytics.crashlytics(app: app)
let remoteconfig = RemoteConfig.remoteConfig(app: app)
let installations = Installations.installations(app: app)
```

## Common Errors 

```plaintext
Error in adb logcat: FirebaseApp: Default FirebaseApp failed to initialize because no default options were found.
This usually means that com.google.gms:google-services was not applied to your gradle project.
```

The app's `com.google.gms:google-services` plugin must be applied to the `build.gradle.kts` file for the app's target.

