---
title: Push Notifications
description: Documentation for Push Notifications fetched from GitHub.
note: This documentation section is derived from the GitHub README.md source using the scripts/sync-modules.mjs script. Do not make edits to the file here, change it there.
editUrl: https://github.com/skiptools/skip-notify/edit/main/README.md
---

:::note[Source Repository <a href='https://github.com/skiptools/skip-notify/releases' alt='Releases for skip-notify'><img decoding='async' loading='lazy' alt='Releases for skip-notify' src='https://img.shields.io/github/v/release/skiptools/skip-notify.svg?style=flat' /></a>]{icon="github"}
This framework is available at [github.com/skiptools/skip-notify](https://github.com/skiptools/skip-notify) and can be checked out and improved locally as described in the [Contribution Guide](/docs/contributing/#local-libraries).
:::


A Skip framework for cross-platform push notifications
on iOS and Android.

- **iOS**: Uses the native `UserNotifications` framework and APNs.
- **Android**: Communicates directly with Google Mobile Services (GMS) via
  the C2DM registration intent protocol to obtain FCM tokens, requiring
  only that GMS (Google Play Services) is installed on the device.

## Setup

Add the dependency to your `Package.swift` file:

```swift
let package = Package(
    name: "my-package",
    dependencies: [
        .package(url: "https://source.skip.dev/skip-notify.git", "0.0.0"..<"2.0.0"),
    ],
    targets: [
        .target(name: "MyTarget", dependencies: [
            .product(name: "SkipNotify", package: "skip-notify")
        ])
    ]
)
```

## Usage

### Fetching a Push Notification Token

```swift
import SkipNotify

do {
    // On Android, pass your Firebase project's numeric sender ID.
    // On iOS, the parameter is ignored (APNs uses bundle ID + entitlements).
    let token = try await SkipNotify.shared.fetchNotificationToken(
        firebaseProjectNumber: "123456789"
    )
    print("Push token: \(token)")
    // Send this token to your backend server to target this device
} catch {
    print("Failed to get push token: \(error)")
}
```

**Finding your Firebase project number:**
Open the [Firebase console](https://console.firebase.google.com/),
select your project, go to **Project settings** > **Cloud Messaging**,
and copy the **Sender ID** (a numeric string like `"123456789012"`).

On iOS, the returned token is the APNs device token as a hex string.
On Android, the returned token is an FCM registration token — the same
token that `FirebaseMessaging.getInstance().token` would produce.

### Checking GMS Availability

Before requesting a token on Android, you can check whether Google Mobile
Services is available:

```swift
if SkipNotify.shared.isGMSAvailable {
    let token = try await SkipNotify.shared.fetchNotificationToken(
        firebaseProjectNumber: "123456789"
    )
} else {
    print("GMS not available: \(SkipNotify.shared.gmsStatusDescription)")
}
```

| Property | iOS | Android (with GMS) | Android (without GMS) |
|---|---|---|---|
| `isGMSAvailable` | `false` | `true` | `false` |
| `gmsStatusDescription` | `"GMS not applicable (iOS)"` | `"GMS available"` | `"GMS not available"` |

## How It Works

### iOS

Standard APNs registration flow:

1. Calls `UIApplication.shared.registerForRemoteNotifications()`
2. Receives the device token via the `didRegisterForRemoteNotificationsWithDeviceToken`
   app delegate callback (bridged through `NotificationCenter`)
3. Returns the token as a hex-encoded string

Your app delegate must forward the token and error callbacks to
`NotificationCenter`. Skip projects created with `skip init` or
`skip create` include this automatically. For custom setups, add
the forwarding calls documented in the source.

### Android

SkipNotify communicates directly with Google Mobile Services using
the **C2DM registration intent protocol** — the same underlying
mechanism that the `firebase-messaging` SDK uses internally.

The registration flow:

1. **Availability check**: Verifies `com.google.android.gms` is
   installed and enabled on the device
2. **Register a BroadcastReceiver**: Listens for the
   `com.google.android.c2dm.intent.REGISTRATION` response broadcast
3. **Send the registration intent**: Sends
   `com.google.android.c2dm.intent.REGISTER` to GMS with:
   - `app`: A `PendingIntent` that GMS uses to verify the calling
     app's package identity
   - `sender`: The Firebase project number (sender ID)
   - `subtype`: Same as sender (signals standard app-level registration)
   - `gmsVersion`: The installed GMS version code
   - `scope`: `"GCM"` (the registration scope)
4. **Receive the token**: GMS responds asynchronously via the
   `REGISTRATION` broadcast with a `registration_id` extra containing
   the FCM token, or an `error` extra if registration failed

### Sending a Push Notification

Once you have the FCM token from `fetchNotificationToken`, send
messages from your server using the
[FCM HTTP v1 API](https://firebase.google.com/docs/cloud-messaging/send-message):

```
POST https://fcm.googleapis.com/v1/projects/YOUR_PROJECT_ID/messages:send
Authorization: Bearer <OAuth2-token>
Content-Type: application/json

{
  "message": {
    "token": "<the-token-from-fetchNotificationToken>",
    "notification": {
      "title": "Hello",
      "body": "World"
    }
  }
}
```

For iOS, use the
[APNs HTTP/2 API](https://developer.apple.com/documentation/usernotifications/sending-notification-requests-to-apns)
with the hex device token returned by `fetchNotificationToken`.

:::tip
For cross-platform notification sending, you may want to
:::
> utilize a tool like [gorush](https://github.com/appleboy/gorush)
> to simplify the configuration and authentication.

## Configuration

### iOS

Follow the steps described in the
[Registering your app with APNs](https://developer.apple.com/documentation/usernotifications/registering-your-app-with-apns)
documentation:

- Select your app from the App Store Connect [Certificates, Identifiers & Profiles](https://developer.apple.com/account/resources/identifiers/) page and select "Capabilities" and turn on Push Notifications then click "Save"
- Use the [Push Notifications Console](https://developer.apple.com/notifications/push-notifications-console/) to send a test message to your app.

### Android

No additional Gradle dependencies or `google-services.json` file is required.
GMS (Google Play Services) must be installed on the device.

To _receive_ push messages (not just register for tokens), your app
needs a `BroadcastReceiver` for the `com.google.android.c2dm.intent.RECEIVE`
action in `AndroidManifest.xml`:

```xml
<receiver android:name=".PushMessageReceiver"
    android:permission="com.google.android.c2dm.permission.SEND"
    android:exported="true">
    <intent-filter>
        <action android:name="com.google.android.c2dm.intent.RECEIVE" />
    </intent-filter>
</receiver>
```

The `android:permission` attribute is critical — it restricts delivery
to broadcasts sent by GMS (which holds the
`com.google.android.c2dm.permission.SEND` permission), preventing
other apps from injecting fake push messages.

Message payloads arrive as intent extras:

| Extra key | Description |
|---|---|
| `gcm.notification.title` | Notification title |
| `gcm.notification.body` | Notification body |
| `google.message_id` | Unique message ID |
| `collapse_key` | Collapse key (if set) |
| *(your custom keys)* | Data payload fields |

## Token Refresh

GMS may invalidate registration tokens after Play Services updates or
device resets. Re-register at app startup and compare the returned token
against the one stored on your server. If it differs, update the server.

You can also listen for the `com.google.android.c2dm.intent.REGISTRATION`
broadcast in your manifest to detect token refreshes:

```xml
<receiver android:name=".TokenRefreshReceiver"
    android:exported="true">
    <intent-filter>
        <action android:name="com.google.android.c2dm.intent.REGISTRATION" />
    </intent-filter>
</receiver>
```

The new token arrives in the `registration_id` extra of the broadcast intent.

