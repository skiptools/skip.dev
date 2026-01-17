---
title: Firebase
layout: docs
note: This documentation section is derived from https://raw.githubusercontent.com/skiptools/skip-firebase/main/README.md using the scripts/syncdocs.sh script. Do not change the file here, change it there.
---

:::note[Source Repository]{icon="github"}
The skip-firebase framework is available at [https://github.com/skiptools/skip-firebase.git](https://source.skip.tools/skip-firebase.git), which can be checked out and tested with `skip test` once Skip is [installed](/docs/gettingstarted/).
:::

This package provides Firebase support for Skip Swift projects.
The Swift side uses the official Firebase iOS SDK directly,
with the various `SkipFirebase*` modules passing the transpiled calls
through to the Firebase Android SDK.

For an example of using Firebase in a [Skip Fuse](/docs/status/#skip_fuse) app, see the
[FiresideFuse Sample](/docs/samples/skipapp-fireside-fuse). For a [Skip Lite](/docs/status/#skip_fuse) app, see the [Fireside Sample](/docs/samples/skipapp-fireside).

## Package

The modules in the SkipFirebase framework project mirror the division of the SwiftPM
modules in the Firebase iOS SDK (at [https://github.com/firebase/firebase-ios-sdk.git](https://github.com/firebase/firebase-ios-sdk.git)),
which is also mirrored in the division of the Firebase Kotlin Android gradle modules (at [https://github.com/firebase/firebase-android-sdk.git](https://github.com/firebase/firebase-android-sdk.git)).

See the `Package.swift` files in the
[FiresideFuse](/docs/samples/skipapp-fireside-fuse) and [Fireside](/docs/samples/skipapp-fireside) apps for examples of integrating Firebase dependencies.

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
        .package(url: "https://source.skip.tools/skip.git", from: "1.0.0"),
        .package(url: "https://source.skip.tools/skip-ui.git", from: "1.0.0"),
        .package(url: "https://source.skip.tools/skip-foundation.git", from: "1.0.0"),
        .package(url: "https://source.skip.tools/skip-model.git", from: "1.0.0"),
        .package(url: "https://source.skip.tools/skip-firebase.git", "0.0.0"..<"2.0.0")
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

:::tip
For concrete examples, see the [FireSideFuse Sample](/docs/samples/skipapp-fireside-fuse) project.
:::

Once Firebase has been added to your project, you need to configure the `FirebaseApp` on app startup. This is typically done in the `onInit()` callback of the `*AppDelegate` in your `*App.swift` file. Here is a snippet from the FireSideFuse sample app:

```swift
#if os(Android)
import SkipFirebaseCore
#else
import FirebaseCore
#endif

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

#if os(Android)
import SkipFirebaseFirestore
#else
import FirebaseFirestore
#endif

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
1. Define a delegate to receive notification callbacks. In keeping with Skip's philosophy of *transparent adoption*, both the iOS and Android sides of your app will receive callbacks via iOS's standard `UNUserNotificationCenterDelegate` API, as well as the Firebase iOS SDK's `MessagingDelegate`. Here are example [Skip Fuse](/docs/status/#skip_fuse) delegate implementations that works across both platforms:

```swift
import SwiftFuseUI
#if os(Android)
import SkipFirebaseMessaging
#else
import FirebaseMessaging
#endif

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

#if os(Android)
import SkipFirebaseCore
#else
import FirebaseCore
#endif

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

:::tip
The [FiresideFuse](/docs/samples/skipapp-fireside-fuse) and [Fireside](/docs/samples/skipapp-fireside) projects are great references for seeing complete, working Skip Fuse and Skip Lite apps using Firebase push notifications.
:::

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

