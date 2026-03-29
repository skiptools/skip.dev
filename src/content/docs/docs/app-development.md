---
title: App Development
permalink: /docs/app-development/
---

Skip allows you to share as much or as little code as you want between the iOS and Android versions of your app. The  [Cross-Platform Topics](/docs/platformcustomization/) chapter details how to integrate Android-specific or iOS-specific code. This chapter focuses on shared dual-platform development.

The following sections assume you are already familiar with iOS development. We focus on where dual-platform Skip development differs from standard iOS development, including how to use Skip’s tools and what to do when things go wrong.

## Philosophy

:::tip
A Skip or Android build error does not mean you cannot use a particular iOS feature. You can always wrap unsupported code in a [platform check](/docs/platformcustomization/#compiler-directives) and provide an Android alternative.
:::

All multi-platform tools have limitations, and Skip is no exception. That is why we made it straightforward to [exclude unsupported iOS code](/docs/platformcustomization/#compiler-directives) from your Android build. You can use any iOS feature on the iOS side of your app without compromising your project structure. When a feature is not available on Android, you provide a fallback or alternative. You may be able to find a solution among the [thousands of cross-platform modules](https://swiftpackageindex.com/search?query=platform%3Aios%2Candroid) Skip already supports, or to [port](/docs/porting/) a Swift package that doesn't yet compile for Android.

Skip also makes it easy to [integrate Android-specific solutions](/docs/platformcustomization/), whether to work around limitations or to differentiate your Android experience. 

So remember: build errors show you what may not yet be supported out of the box on Android. They might require extra work to overcome, but they are not blockers! 

## Building and Running

In order to run and test your app on Android, you will need either an Android emulator or a
paired Android device with developer mode enabled. You can set up an emulator by running 
`skip android emulator create` and then `skip android emulator launch`, as described in
the [command line reference](/docs/skip-cli/#android-emulator-create).

Alternatively, you can install and launch `Android Studio.app`, 
and then open the Device Manager from the ellipsis menu of the Welcome dialog 
to create an emulator of your choice.
You can then use the Device Manager to launch the emulator, or you can run it from the terminal with a command like `~/Library/Android/sdk/emulator/emulator @Pixel_6_API_33`.

<img alt="Screenshot of the Android Studio Device Manager" src="https://assets.skip.dev/intro/device_manager.png" style="width: 100%; max-width: 600px;" />

<!--
Once an emulator has been setup, you can choose to launch it from the command line rather than running Android Studio. To run the emulator without Android Studio, use the terminal command: 

```console
gradle -p Android launchDebug
```
-->

:::note
Android Studio does not need to be kept running in order to use the Android emulator, but it can be useful for attaching the adb debugger to the running process.
:::

### Running on an Android Device {#running-on-device}

In order to install and run an app on a connected Android device, you must enable USB debugging on the device, as per the [ADB documentation](https://developer.android.com/tools/adb#Enabling). Then pair the Android device with your development machine.

Make sure only one device *or* emulator is running at a time. Otherwise Skip cannot know where to launch your app. Alternatively, set the `ANDROID_SERIAL` variable in your project's `.xcconfig` file to the desired device or emulator's identifier. Running the `/opt/homebrew/bin/adb devices` command will show the available paired identifiers.

:::tip
There is often a significant difference between Debug and Release build performance on Android devices. Always use a Release build when evaluating real-world performance.
:::

### Dual-Platform Apps

Assuming you followed the [app creation](/docs/gettingstarted/) instructions using `skip create`, each successful build of your Skip app will automatically attempt to launch it on the running Android emulator or device. Exactly one emulator or device must be running in order for the Skip project's `Launch APK` script phase to install and run the app successfully. 

If you are having trouble with Skip's Xcode plugin, check the [Troubleshooting](/docs/help/#troubleshooting) section for help.

<!-- Xcode Previews will not work in Skip apps until you have performed one full build. After an initial successful build, you can iterate using Previews. -->

:::caution
There is an incompatibility between the new Xcode Previews and Skip apps. Xcode no longer sets the appropriate environment variable to identify Preview builds, causing every update to attempt a full Android rebuild. This issue is discussed at [https://github.com/orgs/skiptools/discussions/263](https://github.com/orgs/skiptools/discussions/263). The workaround is to enable `Editor > Canvas > Use Legacy Previews Execution`. We have filed a bug with Apple, and we hope this workaround is unnecessary in the future.
:::

#### Building and Running iOS-Only {#ios-only}

By default, whenever you run your iOS app from Xcode, Skip will also create and run the Android app. Building and running the app side-by-side is very useful for ensuring that both sides of the app look and behave the same while iterating on the app.

When debugging an iOS-specific issue, you can disable the Android launch by editing the `AppName.xcconfig` file (in your project's root directory alongside `Package.swift`) and changing `SKIP_ACTION = launch` to `SKIP_ACTION = build`. This still builds the Android side but does not launch it on the emulator.

To skip the Android build entirely, set `SKIP_ACTION = none` in the same file. This makes builds faster when you are focused only on iOS.

:::tip
It is not recommended to leave `SKIP_ACTION = none` for long periods of time, since it may result in Android-specific errors accumulating without any indication.
:::

### Separate iOS and Android Apps

If you've chosen to create separate iOS and Android apps that share dual-platform Swift frameworks, then you will build and run each app in its respective IDE. The [Project Types](/docs/project-types/#separate-apps) guide contains tips for integrating dual-platform frameworks into your development workflow. 

### Frameworks

Building a dual-platform framework in Xcode builds your iOS code and runs the SkipStone build plugin. It does **not**, however, perform an Android build. Due to limitations on Xcode plugins, the only way to invoke the Android compiler is to run the module's unit test suite against the macOS destination, or to export the framework's build artifacts. For more information, see the [testing](/docs/testing/) and [deployment](/docs/deployment/) documentation.

<img alt="Framework Test Development Screenshot" src="https://assets.skip.dev/framework-dev/framework-xcode-test-failure.png" style="width: 100%; max-width: 750px;" />

:::caution
You must run your tests against a macOS destination in order to perform an Android framework build. Testing against the iOS destination will not run the Android tests.
:::

---

## Coding {#coding}

Writing dual-platform code with Skip resembles coding a standard iOS app, and seeing your Swift and SwiftUI run on Android is a great experience. But writing for two platforms does introduce complications not found in pure iOS development:

1. At some point, you will likely want to use an iOS API, framework, or feature that is not yet supported on Android. [This section](#unsupported-ios-features) discusses your options when you encounter a limitation in dual-platform coverage.
1. Our [porting](/docs/porting/) guide covers some of the common issues you'll run into when compiling cross-platform Swift. Additionally, compiled Swift must use [bridging](/docs/modes/#bridging) to interact with Android's Kotlin and Java APIs.
1. Writing a dual-platform apps means using dual-platform libraries. Our documentation on [dependencies](/docs/dependencies/) discusses how to use other dual-platform libraries as well as iOS and Android-specific libraries.

:::caution
If you are using [Skip Lite](/docs/modes/#lite), you may run into limitations in the Swift that can be transpiled. For more information on what Swift language features the transpiler supports, see the [Transpilation Reference](/docs/swiftsupport/).
:::

### Build Errors

Skip tries to warn you as quickly as possible when you're going down the wrong path. For example, the Skip build plugin may report warnings and errors even before Skip attempts to compile your project for Android. Skip also attempts to map all errors back to the offending Swift source code and surface them in Xcode, whether they come from bridging, transpilation, Kotlin compilation, or native compilation.  Each error message therefore typically appears in two places: once inline in your Swift source code, and once in Xcode's sidebar issue navigator. Clicking an entry will jump you to the offending code.

:::tip
When an error comes from compiling Kotlin, the Xcode sidebar will also include a message linking to the generated Kotlin source.
:::

<img alt="Framework Development Screenshot" src="https://assets.skip.dev/development/kotlin-compiler-error.png" style="width: 100%; max-width: 750px;" />

The most common build errors are:

- Using an API without Android support. We discuss your options when an API you want to use has not yet been ported to Android [below](#unsupported-ios-features).
- Needing to modify your `imports` for cross-platform Swift. Consult the [porting](/docs/porting/) guide for details.

### Runtime Errors and Debugging

Dealing with errors is an integral part of development. Be sure to read the [Debugging](/docs/debugging/) chapter to learn how to access generated code, view your log statements, and debug the Android side of your Skip framework or application.

---

## UI and View Model Coding {#ui}

Google recommends [Jetpack Compose](https://developer.android.com/develop/ui/compose) for Android user interface development. Skip can translate a [large subset](/docs/modules/skip-ui/#supported-swiftui) of SwiftUI into Compose, allowing you to build cross-platform iOS and Android UI in SwiftUI. Or you can write a separate Android UI in pure Compose using your Android IDE of choice. Skip even allows you to move fluidly between SwiftUI and Compose, as described in our [Cross-Platform Topics](/docs/platformcustomization/#swiftui-and-compose) documentation. In the end, the choice between using SwiftUI, Jetpack Compose, or a combination of the two is up to you.

### `@Observables`

Regardless of whether you use Skip's translated SwiftUI or write to the Compose API in Kotlin, Skip ensures that your `@Observable` model types participate in Compose state tracking. This allows them to seamlessly power your Android user interface just as they power your iOS one. 

`@Observable` integration is transparent, but some caveats apply when you use a Swift model to power a bespoke Compose UI: 

- You must `import SkipFuse` in any Swift file that defines an `@Observable` type. This import enables the state tracking that keeps the Android UI in sync with your Swift model. The SkipStone build plugin will warn you if this import is missing.
- In order to use an `@Observable` from a Kotlin UI, ensure that your `@Observable` is [bridged](/docs/modes/#bridging).
- Finally, if you are writing a bespoke Compose UI, you must add a SwiftPM dependency on `SkipModel` for your `@Observables` to work properly on Android, as in the following example. This is not necessary when you use a SwiftUI interface, because `SkipModel` will be included in your dependency on `SkipFuseUI`.

```swift
...
let package = Package(
    name: "travel-posters-model",
    ...
    dependencies: [
        .package(url: "https://source.skip.tools/skip.git", from: "1.2.0"),
        .package(url: "https://source.skip.tools/skip-model.git", from: "1.0.0"), // <-- Insert
        .package(url: "https://source.skip.tools/skip-fuse.git", from: "1.0.0")
    ],
    targets: [
        .target(name: "TravelPostersModel",
            dependencies: [
                .product(name: "SkipFuse", package: "skip-fuse"), 
                .product(name: "SkipModel", package: "skip-model")                // <-- Insert
            ],
            plugins: [.plugin(name: "skipstone", package: "skip")]),
        ...
    ]
)
```

The [`CityManager`](https://github.com/skiptools/skipapp-travelposters-native/blob/main/travel-posters-model/Sources/TravelPostersModel/CityManager.swift) type in the [TravelPosters](https://github.com/skiptools/skipapp-travelposters-native) sample is an example of an `@Observable` that is shared between separate iOS and Android apps.

:::note
This section only applies to [Skip Fuse](/docs/modes/#fuse). A [Skip Lite](/docs/modes/#lite) transpiled model layer does not require additional imports or dependencies to power a Compose UI.
:::

### SwiftUI

Skip lets you share all or parts of your user interface across both platforms. Because Skip translates your SwiftUI views to Jetpack Compose on Android, the result is a fully native user interface on both platforms, not a cross-platform approximation.

On Android, `import SwiftUI` provides SkipFuseUI, which bridges SwiftUI views to Jetpack Compose. Your Views and their SwiftUI properties must use **default (internal) or public visibility**. Private views and properties are not visible to Skip's bridging layer and will not appear on Android. Here is an example of a valid cross-platform SwiftUI view:

```swift
import SwiftUI

struct MyView : View {
    @State var counter = 1 // Use internal or public access for all SwiftUI types and members
    private let title = "..." // OK to use private for non-SwiftUI members 
    ...

    var body: some View {
        ...
    } 
}
```

:::note
These restrictions do not apply to transpiled [Skip Lite](/docs/modes/#lite) SwiftUI.
:::

Under the hood, SkipFuseUI uses the SkipUI user interface library. The SkipUI documentation includes a list of [supported SwiftUI components](/docs/modules/skip-ui/#supported-swiftui) and coverage of various [SkipUI topics](/docs/modules/skip-ui/#topics). Reviewing these will help you avoid common issues when writing cross-platform SwiftUI.

---

## iOS Features without Android Support {#unsupported-ios-features}

Skip's coverage of iOS APIs is growing with each release, but some iOS frameworks and features are not yet available on Android. Check the [SkipUI supported components](/docs/modules/skip-ui/#supported-swiftui) for current coverage.

:::tip
With Skip, you *never* have to compromise your iOS app. You can always use [compiler directives](/docs/platformcustomization/#compiler-directives) to exclude unsupported iOS code from your Android build. Then create an alternate Android code path that either falls back to a supported solution or implements a solution using native Android API.
:::

### API 

Using an iOS API that is not yet supported on Android will result in either an unavailable API error or build error from the Android Swift compiler. If you encounter an error, check the [porting guide](/docs/porting/#skipfuse) to see if the API is actually available, but requires different imports for Android. If you are writing SwiftUI code, consult the [SkipUI module](/docs/modules/skip-ui/#supported-swiftui) to learn what is supported.

:::note
If you are using [Skip Lite](/docs/modes/#lite), each of Skip's transpiled [core modules](/docs/modules/) specifies its Android-supported API set.
:::

When you encounter missing API on Android, you have options! You may be able to use alternate, supported APIs to accomplish the task. The [Swift Package Index](https://swiftpackageindex.com/search?query=platform%3Aios%2Candroid) site lists many cross-platform Swift packages that are known to build for Android. If you can't find an existing solution, you can use Skip's [iOS and Android integration](/docs/platformcustomization/) techniques to implement separate iOS and Android code paths, taking advantage of each platforms' respective native solutions. And if the API you want to use is in a framework already mirrored for Android - either as a [Skip open source library](https://source.skip.tools) or a [community library](/docs/contributing/#community-libraries) - you may be able to easily add the missing API to the existing library. If you augment an existing library, please consider [contributing](/docs/contributing/) your improvements back to the Skip community. Follow the instructions [here](/docs/contributing/#local-libraries) to configure Xcode for local Skip library development.    

### Frameworks

Skip Fuse supports [thousands of third-party modules](https://swiftpackageindex.com/search?query=platform%3Aios%2Candroid). If these do not meet your needs and there are no [Skip](/docs/modules/) or [community](/docs/contributing/#community-libraries) libraries available for the desired functionality, you might consider [creating your own](/docs/dependencies/#implementation) dual-platform library or shared API. Again, please consider contributing your work as a [community library](/docs/contributing/#community-libraries).

### Features

Some iOS app extensions and features are not yet implemented for Android, or have no direct Android counterpart. Use the techniques in [Cross-Platform Topics](/docs/platformcustomization/) to implement iOS-only or Android-only solutions. For example, you might use a [compiler directive](/docs/platformcustomization/#compiler-directives) to exclude your iOS widget from your Android build, and include a [Kotlin file](/docs/platformcustomization/#kotlin-files) implementing a native widget for Android instead.

---

## Embedding Custom SwiftUI and Compose Views {#custom-views}

Skip makes it easy to use platform-specific UI frameworks side by side with your shared SwiftUI code. On iOS you can use any SwiftUI view (including those backed by MapKit, Charts, or other Apple frameworks), while on Android you can drop into Jetpack Compose directly using `ComposeView` inside a `#if SKIP` block.

The key pattern is:

1. Use `#if !SKIP` to wrap your iOS-specific imports and view code.
2. Use `#if SKIP` (or the `#else` branch) to wrap your Android-specific Compose imports and view code.
3. On Android, use `ComposeView` to bridge from the SkipUI view hierarchy into raw Jetpack Compose composables.

The following example from the [Skip Showcase app](https://github.com/skiptools/skipapp-showcase/blob/main/Sources/Showcase/MapPlayground.swift) demonstrates this pattern by embedding an Apple MapKit `Map` on iOS and a Google Maps `GoogleMap` composable on Android:

```swift
// Copyright 2023–2026 Skip
import SwiftUI
#if !SKIP
import MapKit
#else
// add dependency in skip.yml: implementation("com.google.maps.android:maps-compose:6.4.1")
import com.google.maps.android.compose.__
import com.google.android.gms.maps.model.CameraPosition
import com.google.android.gms.maps.model.LatLng
#endif

struct MapPlayground: View {
    var body: some View {
        MapView(latitude: 48.8566, longitude: 2.3522)
    }
}

struct MapView : View {
    let latitude: Double
    let longitude: Double

    var body: some View {
        #if !SKIP
        // on Darwin platforms, we use the new SwiftUI Map type
        if #available(iOS 17.0, macOS 14.0, *) {
            Map(initialPosition: .region(MKCoordinateRegion(center: CLLocationCoordinate2D(latitude: latitude, longitude: longitude), span: MKCoordinateSpan(latitudeDelta: 0.1, longitudeDelta: 0.1))))
        } else {
            Text("Map requires iOS 17")
                .font(.title)
        }
        #else
        // on Android platforms, we use com.google.maps.android.compose.GoogleMap within in a ComposeView
        ComposeView { ctx in
            GoogleMap(cameraPositionState: rememberCameraPositionState {
                position = CameraPosition.fromLatLngZoom(LatLng(latitude, longitude), Float(12.0))
            })
        }
        #endif
    }
}
```

---

## Embedding Legacy UIKit and Android XML Views {#legacy-views}

You can also embed legacy platform views — UIKit `UIView` subclasses on iOS and traditional Android XML-based `View` subclasses on Android — into your Skip app. This is useful when you need to integrate existing platform components that don't have SwiftUI or Compose equivalents.

On iOS, you use `UIViewRepresentable` (or `NSViewRepresentable` on macOS) to wrap a UIKit view for use in SwiftUI. On Android, you use Compose's `AndroidView` factory inside a `ComposeView` to wrap a traditional Android view for use in the SkipUI view hierarchy.

:::tip
For a full-featured embedded web browser with navigation controls and JavaScript support, consider using the [SkipWeb](/docs/modules/skip-web/) package rather than building your own `WebView` wrapper.
:::

The following example from the [Skip Bookings app](https://github.com/skiptools/skipapp-bookings/blob/main/Sources/TravelBookings/WebView.swift) shows how to embed a `WKWebView` on iOS and an `android.webkit.WebView` on Android:

```swift
import SwiftUI
#if !SKIP
import WebKit
#else
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.compose.ui.viewinterop.AndroidView
#endif

// the platform-specific View supertype that is needed to adapt legacy UIKit.UIView/AndroidView to SwiftUI/Compose
#if canImport(UIKit)
typealias ViewAdapter = UIViewRepresentable
#elseif canImport(AppKit)
typealias ViewAdapter = NSViewRepresentable
#else
typealias ViewAdapter = View
#endif

/// This is a very minimal WebView that can be used as an embedded browser view.
/// It has no address bar or navigation buttons.
/// For a more advanced web component, use http://source.skip.tools/skip-web
struct WebView: ViewAdapter {
    let url: URL
    var enableJavaScript: Bool = true

    #if SKIP
    // for Android platforms, we take a WebView and wrap it in an AndroidView, which
    // adapts traditional views in a Compose context, and then wrap that in a
    // ComposeView, which integrates it with the SwiftUI view hierarchy
    var body: some View {
        ComposeView { context in
            AndroidView(factory: { ctx in
                let webView = WebView(ctx)
                let client = WebViewClient()
                webView.webViewClient = client
                webView.settings.javaScriptEnabled = enableJavaScript
                webView.setBackgroundColor(0x000000)
                webView.loadUrl(url.absoluteString)
                return webView
            }, modifier: context.modifier, update: { webView in
            })
        }
    }
    #else
    // for Darwin platforms, we take a WKWebView and load it using the
    // UIViewRepresentable/NSViewRepresentable system for adapting traditional
    // UIKit views to SwiftUI view hierarchy
    func makeCoordinator() -> WKWebView {
        let webView = WKWebView(frame: .zero)
        webView.configuration.defaultWebpagePreferences.allowsContentJavaScript = enableJavaScript
        webView.load(URLRequest(url: url))
        return webView
    }

    func update(webView: WKWebView) {
    }

    #if canImport(UIKit)
    func makeUIView(context: Context) -> WKWebView { context.coordinator }
    func updateUIView(_ uiView: WKWebView, context: Context) { update(webView: uiView) }
    #elseif canImport(AppKit)
    func makeNSView(context: Context) -> WKWebView { context.coordinator }
    func updateNSView(_ nsView: WKWebView, context: Context) { update(webView: nsView) }
    #endif
    #endif
}
```

---

## Common Topics

For instructions on how to handle common development tasks like localization, resource and image loading, and JSON coding across platforms with Skip, see [Common Topics](/docs/development-topics/).
