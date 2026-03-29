---
title: Camera & Media
description: Documentation for Camera & Media fetched from GitHub.
note: This documentation section is derived from the GitHub README.md source using the scripts/sync-modules.mjs script. Do not make edits to the file here, change it there.
editUrl: https://github.com/skiptools/skip-kit/edit/main/README.md
---

:::note[Source Repository <a href='https://github.com/skiptools/skip-kit/releases' alt='Releases for skip-kit'><img decoding='async' loading='lazy' alt='Releases for skip-kit' src='https://img.shields.io/github/v/release/skiptools/skip-kit.svg?style=flat' /></a>]{icon="github"}
This framework is available at [github.com/skiptools/skip-kit](https://github.com/skiptools/skip-kit) and can be checked out and improved locally as described in the [Contribution Guide](/docs/contributing/#local-libraries).
:::


This Skip Lite module enhances the `SkipUI` package with commonly-used features,
such as a permission checker and a picker for photos and other media.

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
        .package(url: "https://source.skip.dev/skip-kit.git", "0.0.0"..<"2.0.0"),
    ],
    targets: [
        .target(name: "MyTarget", dependencies: [
            .product(name: "SkipKit", package: "skip-kit")
        ])
    ]
)
```

## Cache

The `Cache<Key, Value>` class manages a memory-pressure-aware cache that can be
used for storing temporary values.

Example usage:

```swift
// Create a cache that can store up to 100 bytes of Data instances
// and will evict everything when the app is put in the background
let cache = Cache<UUID, Data>(evictOnBackground: true, limit: 100, cost: \.count)

cache.putValue(Data(count: 1), for: UUID()) // total cost = 1
cache.putValue(Data(count: 99), for: UUID()) // total cost = 100
cache.putValue(Data(count: 1), for: UUID()) // total cost = 101, so cache will evict older entries
```


## PermissionManager

The `PermissionManager` provides the ability to request device permissions.

For example:

```swift
import SkipKit
import SkipDevice

let locationProvider = LocationProvider()

if await PermissionManager.requestPermission(.ACCESS_FINE_LOCATION) == true {
    let location = try await locationProvider.fetchCurrentLocation()
}
```

In addition to symbolic constants, there are also functions for requesting
specific permissions with various parameters:

```swift
static func queryLocationPermission(precise: Bool, always: Bool) -> PermissionAuthorization
static func requestLocationPermission(precise: Bool, always: Bool) async -> PermissionAuthorization

static func queryPostNotificationPermission() async -> PermissionAuthorization
static func requestPostNotificationPermission(alert: Bool = true, sound: Bool = true, badge: Bool = true) async throws -> PermissionAuthorization

static func queryCameraPermission() -> PermissionAuthorization
static func requestCameraPermission() async -> PermissionAuthorization

static func queryRecordAudioPermission() -> PermissionAuthorization
static func requestRecordAudioPermission() async -> PermissionAuthorization

static func queryContactsPermission(readWrite: Bool) -> PermissionAuthorization
static func requestContactsPermission(readWrite: Bool) async throws -> PermissionAuthorization

static func queryCalendarPermission(readWrite: Bool) -> PermissionAuthorization
static func requestCalendarPermission(readWrite: Bool) async throws -> PermissionAuthorization

static func queryReminderPermission(readWrite: Bool) -> PermissionAuthorization
static func requestReminderPermission(readWrite: Bool) async throws -> PermissionAuthorization

static func queryPhotoLibraryPermission(readWrite: Bool) -> PermissionAuthorization
static func requestPhotoLibraryPermission(readWrite: Bool) async -> PermissionAuthorization
```

To request an arbitrary Android permission for which there may be no
iOS equivalent, you can pass the string literal. For a list of common permission literals, see
[https://developer.android.com/reference/android/Manifest.permission](https://developer.android.com/reference/android/Manifest.permission).

For example, to request the SMS sending permission:

```swift
let granted = await PermissionManager.requestPermission("android.permission.SEND_SMS")
```

## Camera and Media selection

The `View.withMediaPicker(type:isPresented:selectedImageURL:)` extension function
can be used to enable the acquisition of an image from either the system camera 
or the user's media library. 

On iOS, this camera selector will be presented in a `fullScreenCover` view, 
whereas the media library browser will be presented in a `sheet`. In both cases,
a standad `UIImagePickerController` will be used to acquire the media.

On Android, the camera and library browser will be activated through 
an Intent after querying for the necessary permissions.

Following is an example of implementing a media selection button that 
will bring up the system user interface.

```swift
import SkipKit

/// A button that enables the selection of media from the library or the taking of a photo.
///
/// The selected/captured image will be communicated through the `selectedImageURL` binding,
/// which can be observed with `onChange` to perform an action when the media URL is acquired.
struct MediaButton : View {
    let type: MediaPickerType // either .camera or .library
    @Binding var selectedImageURL: URL?
    @State private var showPicker = false

    var body: some View {
        Button(type == .camera ? "Take Photo" : "Select Media") {
            showPicker = true // activate the media picker
        }
        .withMediaPicker(type: .camera, isPresented: $showPicker, selectedImageURL: $selectedImageURL)
    }
}
```

### Camera and Media Permissions

In order to access the device's photos or media library, you will need to 
declare the permissions in the app's metadata.

On iOS this can be done by editing the `Darwin/AppName.xcconfig` file and adding the lines:

```
INFOPLIST_KEY_NSCameraUsageDescription = "This app needs to access the camera";
INFOPLIST_KEY_NSPhotoLibraryUsageDescription = "This app needs to access the photo library.";
```

On Android, the `app/src/main/AndroidManifest.xml` file will need to be edited to include 
camera permissions as well as a FileProvider implementation so the camera can share a Uri with the app. For example:

```xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android" xmlns:tools="http://schemas.android.com/tools">
    <!-- features and permissions needed in order to use the camera and read/write photos -->
    <uses-feature
        android:name="android.hardware.camera"
        android:required="false" />
    <uses-feature
        android:name="android.hardware.camera.autofocus"
        android:required="false" />
    <uses-permission android:name="android.permission.CAMERA" />
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
    <application
        android:label="${PRODUCT_NAME}"
        android:name=".AndroidAppMain"
        android:supportsRtl="true"
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher">
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:configChanges="orientation|screenSize|screenLayout|keyboardHidden|mnc|colorMode|density|fontScale|fontWeightAdjustment|keyboard|layoutDirection|locale|mcc|navigation|smallestScreenSize|touchscreen|uiMode"
            android:theme="@style/Theme.AppCompat.DayNight.NoActionBar"
            android:windowSoftInputMode="adjustResize">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
        <!-- needed in order for the camera to be able to share the photo with the app -->
        <provider
            android:name="androidx.core.content.FileProvider"
            android:authorities="${applicationId}.fileprovider"
            android:exported="false"
            android:grantUriPermissions="true">
            <meta-data
                android:name="android.support.FILE_PROVIDER_PATHS"
                android:resource="@xml/file_paths" />
        </provider>
    </application>
</manifest>
```

In addition to editing the manifest, you must also manually create the `xml/file_paths` reference from the manifest's provider. This is done by creating the folder `Android/app/src/main/res/xml` in your Skip project and adding a file `file_paths.xml` with the following contents:

```xml
<?xml version="1.0" encoding="utf-8"?>
<paths>
    <external-path name="my_images" path="." />
    <cache-path name="*" path="." />
</paths>
```

For an example of a properly configured project, see the Photo Chat sample application.

## Document Picker

The `View.withDocumentPicker(isPresented: Binding<Bool>, allowedContentTypes: [UTType], selectedDocumentURL: Binding<URL?>, selectedFilename: Binding<String?>, selectedFileMimeType: Binding<String?>)` extension function can be used to select a document of the specified UTType from the device to use in the App. 

On iOS it will use an instance of `FileImporter` to display the system file picker, essentially allowing to select a file from the Files application, while on Android it relies on the the system document picker via the Activity result for the `ACTION_OPEN_DOCUMENT`. Once the user selects a file it will receive an `uri`, that need to be parsed to be used outside the scope of the caller. For doing so it will copy the file inside the App cache folder and expose the cached url instead of the original picked file url. 

For example:

```swift
Button("Pick Document") {
    presentPreview = true
}
.buttonStyle(.borderedProminent)
.withDocumentPicker(isPresented: $presentPreview, allowedContentTypes: [.image, .pdf], selectedDocumentURL: $selectedDocument, selectedFilename: $filename, selectedFileMimeType: $mimeType)
```

### Security-Scoped URLs on iOS

On iOS, files selected through the system document picker are *security-scoped* — the app is only granted temporary access to read them. The `withDocumentPicker` modifier acquires and releases this access internally during the picker callback, but your `onChange` handler runs **after** the access has already been released. If you need to read or copy the file contents (e.g., importing it into your app's documents directory), you must re-acquire access in your handler:

```swift
.withDocumentPicker(
    isPresented: $showPicker,
    allowedContentTypes: [.epub],
    selectedDocumentURL: $pickedURL,
    selectedFilename: $pickedName,
    selectedFileMimeType: $pickedType
)
.onChange(of: pickedURL) { oldURL, newURL in
    guard let url = newURL else { return }
    pickedURL = nil
    Task {
        #if !SKIP
        // Re-acquire security-scoped access for the picked file.
        // Without this, file operations like copy or read will fail
        // with a "you don't have permission to view it" error.
        let accessing = url.startAccessingSecurityScopedResource()
        defer { if accessing { url.stopAccessingSecurityScopedResource() } }
        #endif
        await importFile(from: url)
    }
}
```

This is only needed on iOS — Android handles file access differently by copying the selected file to the app's cache directory before returning the URL, so the `#if !SKIP` guard ensures the security-scoped calls are skipped on Android.

If you only need to display the file (e.g., pass it to a `DocumentPreview`) without reading its contents, re-acquiring access may not be necessary.

## Document Preview

The `View.withDocumentPreview(isPresented: Binding<Bool>, documentURL: URL?, filename: String?, type: String?)` extension function can be used to preview a document available to the app (either selected with the provided `Document Picker` or downloaded locally by the App). 
On iOS it will use an instance of `QLPreviewController` to display the file at the provided url while on Android it will open an Intent chooser for selecting the appropriate app for the provided file mime type. 
On iOS there's no need to provide a filename or a mime type, but sometimes on Android is necessary (for example when selecting a document using the document picker). On Android if no mime type is supplied it will try to guess it by the file url. If no mime type can be found the application chooser will be empty. 
A file provider (like the one used for using the `MediaPicker`) is necessary for the Intent to correctly pass reading permission to the receiving app. As long as your Skip already implements the FileProvider and the `file_paths.xml` as described in the `Camera and Media Permission` section there's nothing else needed, otherwise you need to follow the instructions in the mentioned section. 

## WebBrowser

For cases where you want to display a web page without the full power and complexity of an embedded `WebView` (from [SkipWeb](/docs/modules/skip-web)), SkipKit provides the `View.openWebBrowser()` modifier. This opens a URL in the platform's native in-app browser:

- **iOS**: [SFSafariViewController](https://developer.apple.com/documentation/safariservices/sfsafariviewcontroller) — a full-featured Safari experience presented within your app, complete with the address bar, share sheet, and reader mode.
- **Android**: [Chrome Custom Tabs](https://developer.android.com/develop/ui/views/layout/webapps/in-app-browsing-embedded-web) — a Chrome-powered browsing experience that shares cookies, autofill, and saved passwords with the user's browser.

### Basic Usage

Open a URL in the platform's native in-app browser:

```swift
import SwiftUI
import SkipKit

struct MyView: View {
    @State var showPage = false

    var body: some View {
        Button("Open Documentation") {
            showPage = true
        }
        .openWebBrowser(
            isPresented: $showPage,
            url: "https://skip.dev/docs",
            mode: .embeddedBrowser(params: nil)
        )
    }
}
```

### Launch in System Browser

To open the URL in the user's default browser app instead of an in-app browser:

```swift
Button("Open in Safari / Chrome") {
    showPage = true
}
.openWebBrowser(
    isPresented: $showPage,
    url: "https://skip.dev",
    mode: .launchBrowser
)
```

### Presentation Mode

By default the embedded browser slides up vertically as a modal sheet. Set `presentationMode` to `.navigation` for a horizontal slide transition that feels like a navigation push:

```swift
Button("Open with Navigation Style") {
    showPage = true
}
.openWebBrowser(
    isPresented: $showPage,
    url: "https://skip.dev",
    mode: .embeddedBrowser(params: EmbeddedParams(
        presentationMode: .navigation
    ))
)
```

| Mode | iOS | Android |
| --- | --- | --- |
| `.sheet` (default) | Full-screen cover (slides up vertically) | [Partial Custom Tabs](https://developer.chrome.com/docs/android/custom-tabs/guide-partial-custom-tabs/) bottom sheet (resizable, initially half-screen height). Falls back to full-screen if the browser does not support partial tabs. |
| `.navigation` | Navigation push (slides in horizontally) | Standard full-screen Chrome Custom Tabs launch |

**Limitations:**
- **iOS:** The `.navigation` presentation mode requires the calling view to be inside a `NavigationStack` (or `NavigationView`). If the view is not hosted in a navigation container, the modifier will have no effect.
- **Android:** In `.sheet` mode, if the user's browser does not support the Partial Custom Tabs API, the tab launches full-screen as a fallback.

### Custom Actions

Add custom actions that appear in the share sheet (iOS) or as menu items (Android):

```swift
Button("Open with Actions") {
    showPage = true
}
.openWebBrowser(
    isPresented: $showPage,
    url: "https://skip.dev",
    mode: .embeddedBrowser(params: EmbeddedParams(
        customActions: [
            WebBrowserAction(label: "Copy Link") { url in
                // handle the action with the current page URL
            },
            WebBrowserAction(label: "Bookmark") { url in
                // save the URL
            }
        ]
    ))
)
```

On iOS, custom actions appear as `UIActivity` items in the Safari share sheet. On Android, they appear as menu items in Chrome Custom Tabs (maximum 5 items).

### API Reference

```swift
/// Controls how the embedded browser is presented.
public enum WebBrowserPresentationMode {
    /// Present as a vertically-sliding modal sheet (default).
    case sheet
    /// Present as a horizontally-sliding navigation push.
    case navigation
}

/// The mode for opening a web page.
public enum WebBrowserMode {
    /// Open the URL in the system's default browser application.
    case launchBrowser
    /// Open the URL in an embedded browser within the app.
    case embeddedBrowser(params: EmbeddedParams?)
}

/// Configuration for the embedded browser.
public struct EmbeddedParams {
    public var presentationMode: WebBrowserPresentationMode
    public var customActions: [WebBrowserAction]
}

/// A custom action available on a web page.
public struct WebBrowserAction {
    public let label: String
    public let handler: (URL) -> Void
}

/// View modifier to open a web page.
extension View {
    public func openWebBrowser(
        isPresented: Binding<Bool>,
        url: String,
        mode: WebBrowserMode
    ) -> some View
}
```

## HapticFeedback

SkipKit provides a cross-platform haptic feedback API that works identically on iOS and Android. You define patterns using simple, platform-independent types, and SkipKit handles playback using [CoreHaptics](https://developer.apple.com/documentation/corehaptics) on iOS and [VibrationEffect.Composition](https://developer.android.com/reference/android/os/VibrationEffect.Composition) on Android.

### Playing Predefined Patterns

SkipKit includes a set of predefined patterns for common feedback scenarios:

```swift
import SkipKit

// Light tap for picking up a draggable element
HapticFeedback.play(.pick)

// Quick double-tick when snapping to a grid
HapticFeedback.play(.snap)

// Solid tap when placing an element
HapticFeedback.play(.place)

// Confirmation feedback
HapticFeedback.play(.success)

// Bouncy celebration for clearing a line or completing a task
HapticFeedback.play(.celebrate)

// Bigger celebration with escalating intensity
HapticFeedback.play(.bigCelebrate)

// Warning for an invalid action
HapticFeedback.play(.warning)

// Error feedback with three descending taps
HapticFeedback.play(.error)

// Heavy impact for collisions
HapticFeedback.play(.impact)
```

### Dynamic Patterns

Some patterns adjust based on parameters. The `combo` pattern escalates in intensity and length with higher streak counts, and finishes with a proportionally heavy thud:

```swift
// A 2x combo: two quick taps + light thud
HapticFeedback.play(.combo(streak: 2))

// A 5x combo: five escalating taps + heavy thud
HapticFeedback.play(.combo(streak: 5))

// Bouncing pattern with 4 taps of decreasing intensity
HapticFeedback.play(.bounce(count: 4, startIntensity: 0.9))
```

### Custom Patterns

You can define your own patterns using `HapticEvent` and `HapticPattern`. Each event has a type, intensity (0.0 to 1.0), and delay in seconds relative to the previous event:

```swift
// A custom "power-up" pattern: rising buzz, pause, two sharp taps
let powerUp = HapticPattern([
    HapticEvent(.rise, intensity: 0.6),
    HapticEvent(.rise, intensity: 1.0, delay: 0.1),
    HapticEvent(.tap, intensity: 1.0, delay: 0.15),
    HapticEvent(.tap, intensity: 0.8, delay: 0.06),
])

HapticFeedback.play(powerUp)
```

The available event types are:

| Type | Description | iOS | Android |
|------|-------------|-----|---------|
| `.tap` | Short, sharp tap | `CHHapticEvent` transient, sharpness 0.7 | `PRIMITIVE_CLICK` |
| `.tick` | Subtle, light tick | `CHHapticEvent` transient, sharpness 1.0 | `PRIMITIVE_TICK` |
| `.thud` | Heavy, deep impact | `CHHapticEvent` transient, sharpness 0.1 | `PRIMITIVE_THUD` |
| `.rise` | Increasing intensity | `CHHapticEvent` continuous | `PRIMITIVE_QUICK_RISE` |
| `.fall` | Decreasing intensity | `CHHapticEvent` continuous | `PRIMITIVE_QUICK_FALL` |
| `.lowTick` | Deep, low-frequency tick | `CHHapticEvent` transient, sharpness 0.3 | `PRIMITIVE_LOW_TICK` |

### Android Permissions

To use haptic feedback on Android, your `AndroidManifest.xml` must include the vibrate permission:

```xml
<uses-permission android:name="android.permission.VIBRATE"/>
```

The `VibrationEffect.Composition` API requires Android API level 31 (Android 12) or higher. On older devices, haptic calls are silently ignored.

### Platform Details

On iOS, `HapticFeedback` uses a `CHHapticEngine` instance that is created on first use and restarted automatically if the system reclaims it. Each `HapticPattern` is converted to a `CHHapticPattern` with appropriate `CHHapticEvent` types and parameters. For more details, see Apple's [CoreHaptics documentation](https://developer.apple.com/documentation/corehaptics).

On Android, patterns are converted to a `VibrationEffect.Composition` with the corresponding `PRIMITIVE_*` constants and played through the system `Vibrator` obtained from `VibratorManager`. For more details, see Android's [VibrationEffect documentation](https://developer.android.com/reference/android/os/VibrationEffect) and the guide on [custom haptic effects](https://developer.android.com/develop/ui/views/haptics/custom-haptic-effects).

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

We welcome contributions to this package in the form of enhancements and bug fixes.

The general flow for contributing to this and any other Skip package is:

1. Fork this repository and enable actions from the "Actions" tab
2. Check out your fork locally
3. When developing alongside a Skip app, add the package to a [shared workspace](/docs/contributing) to see your changes incorporated in the app
4. Push your changes to your fork and ensure the CI checks all pass in the Actions tab
5. Add your name to the Skip [Contributor Agreement](https://source.skip.dev/clabot-config)
6. Open a Pull Request from your fork with a description of your changes

