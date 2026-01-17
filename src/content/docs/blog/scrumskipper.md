---
title:  "Scrumskipper: Running Apple's SwiftUI sample app on Android"
date: 2024-07-12
tags:
  - swiftui
  - jetpack-compose
  - android
  - ios
  - cross-platform
  - skip
  - swift
  - kotlin
  - app-migration
  - scrumdinger
layout: post
permalink: /blog/scrumskipper/
author: Abe White
---

[Scrumdinger](https://developer.apple.com/tutorials/app-dev-training/getting-started-with-scrumdinger) is Apple's canonical SwiftUI iPhone app. In this post, we'll use [Skip](https://skip.dev) to run Scrumdinger as a native Android app as well!

:::note
You can also watch a [tour video](/tour/scrumskipper/) of this process.
:::

<img alt="Recording of Scrumdinger app operating on iOS and Android simultaneously" src="/assets/images/scrumskipper/launch.gif" style="width: 100%; max-width: 800; border: 1px solid #000" />
 
## Overview

Honed and updated over the years, Apple's [Scrumdinger tutorial](https://developer.apple.com/tutorials/app-dev-training/getting-started-with-scrumdinger) is an hours-long step-by-step guide to building a complete, modern SwiftUI app. It exercises both built-in UI components and custom drawing, and it takes advantage of Swift language features like `Codable` for persistence. As its rather unique name implies, the Scrumdinger app allows users to create and manage [agile programming scrums](https://www.atlassian.com/agile/scrum) on their phones. 

This blog post begins where Apple's tutorial ends. We'll start with the final Scrumdinger source code and walk you through the process of bringing the full app to Android using Skip. You'll learn the general steps involved in bringing an existing app to Android, and you'll become familiar with the types of issues you may encounter and how to overcome them. Let's get started!

## Scrumdinger for iPhone

You can get the full Scrumdinger source code from the [last page](https://developer.apple.com/tutorials/app-dev-training/transcribing-speech-to-text) of Apple's SwiftUI tutorial. Here's a direct link to the zipped Xcode project: 

[https://docs-assets.developer.apple.com/published/9d1c4a1d2dcd046ee8e30ad15f20f6f3/TranscribingSpeechToText.zip](https://docs-assets.developer.apple.com/published/9d1c4a1d2dcd046ee8e30ad15f20f6f3/TranscribingSpeechToText.zip)

Download and expand the zip file. Assuming you have the latest [Xcode](https://developer.apple.com/xcode/) installed, you can run the iPhone app by opening `TranscribingSpeechToText/Complete/Scrumdinger.xcodeproj`. The first time you attempt to open it, you may need to confirm that you trust the download. Once Xcode has loaded the project, select the iOS Simulator you'd like to use and hit the Run button!

<img alt="Screenshot of the iOS app's scrum list" src="/assets/images/scrumskipper/ios-final-scrums.png" style="width: 50%; max-width: 300px; border: 1px solid #000" />
<img alt="Screenshot of the iOS app's scrum detail" src="/assets/images/scrumskipper/ios-final-detail.png" style="width: 50%; max-width: 300px; border: 1px solid #000" />
<img alt="Screenshot of the iOS app's meeting view" src="/assets/images/scrumskipper/ios-final-meeting.png" style="width: 50%; max-width: 300px; border: 1px solid #000" />

Play around with the app - this is what we're going to bring to Android. First, however, we need to install Skip.

## Skip

[Skip](https://skip.dev) is a tool for building fully native iOS and Android apps from a single Swift and SwiftUI codebase. It works by transpiling your Swift into Android's [Kotlin](https://kotlinlang.org) development language and adapting your SwiftUI to Android's native [Jetpack Compose](https://developer.android.com/develop/ui/compose) UI framework. 

Skip's Android version of Scrumdinger won't be pixel-identical to the iOS version, and it shouldn't be. Rather, we believe in using the native UI framework and controls on each platform. This gives the best possible user experience, avoiding the uncanny-valley feel of non-native solutions.

Follow the [Getting Started](/docs/gettingstarted/) guide to install Skip and your Android environment, including [Android Studio](https://developer.android.com/studio). Next, launch Android Studio and open the Virtual Device Manager from the ellipsis menu of the Welcome dialog. From there, Create Device (e.g., “Pixel 6”) and then start the Emulator. Skip needs a connected Android device or Emulator to run the Android version of your app.

<img alt="Screenshot of Android Studio Device Manager" src="/assets/images/scrumskipper/emulator.png" style="width: 100%; max-width: 700px;" />

Now we're ready to turn Scrumdinger into a dual-platform Skip app.

## Scrumskipper

It [isn't too hard](/docs/project-types/#existing_development) to update an existing Swift Package Manager package to use Skip. Updating an existing *app*, however, is a different story. Building for Android requires a specific folder structure and `xcodeproj` configuration. We recommend creating a new Skip Xcode project, then importing the old project's code and resources.

Enter the following command in Terminal to initialize Scrumskipper, your dual-platform version of the Scrumdinger app.

```console
skip init --open-xcode --appid=com.xyz.Scrumskipper scrum-skipper Scrumskipper
```

This will create a template SwiftUI app and open it in Xcode. Let's run the template as-is to make sure it's working: select your desired iOS Simulator in Xcode, and hit the Run button. If you just installed or updated Skip, you may have to trust the Skip plugin:

<img alt="Xcode's Trust Plugin dialog" src="/assets/images/scrumskipper/trust-plugin.png" style="width: 100%; max-width: 200px;" />

If all goes well, you should see something like the following:

<img alt="Screenshot of template app running in iOS Simulator and Android Emulator" src="/assets/images/scrumskipper/template-app.png" style="width: 100%; max-width: 700px;" />

Great! Next, copy Scrumdinger's source code to Scrumskipper:

1. Drag the `Scrumdinger/Models` and `Scrumdinger/Views` folders from Scrumdinger's Xcode window into the `Scrumskipper/Sources/Scrumskipper/` folder in Scrumskipper's window.

    <img alt="Copy source folders from Scrumdinger to Scrumskipper" src="/assets/images/scrumskipper/copy-source.png" style="width: 100%; max-width: 600px;" />

1. Replace Scrumskipper's `ContentView` body with the content of Scrumdinger's primary `WindowGroup`. Scrumskipper's `ContentView` should now look like this:

```swift
import SwiftUI

public struct ContentView: View {
    @StateObject private var store = ScrumStore()
    @State private var errorWrapper: ErrorWrapper?

    public init() {
    }

    public var body: some View {
        ScrumsView(scrums: $store.scrums) {
            Task {
                do {
                    try await store.save(scrums: store.scrums)
                } catch {
                    errorWrapper = ErrorWrapper(error: error,
                                                guidance: "Try again later.")
                }
            }
        }
        .task {
            do {
                try await store.load()
            } catch {
                errorWrapper = ErrorWrapper(error: error,
                                            guidance: "Scrumdinger will load sample data and continue.")
            }
        }
        .sheet(item: $errorWrapper) {
            store.scrums = DailyScrum.sampleData
        } content: { wrapper in
            ErrorView(errorWrapper: wrapper)
        }
    }
}

#Preview {
    ContentView()
}
```

That's it! You've now created Scrumskipper, a dual-platform app with all of Scrumdinger's source code. 

## Migration Process

It's the moment of truth: hit that Xcode Run button! 

Almost immediately, you'll get an API unavailable error like this one:

<img alt="Xcode API unavailable error from Skip" src="/assets/images/scrumskipper/api-unavailable-error.png" style="width: 100%; max-width: 600px; border: 1px solid #000" />

This is our first hint that **migrating an existing iOS codebase to Android is not trivial**, even with Skip. Starting a *new* app with Skip can be a lot of fun, because it's relatively easy to avoid problematic patterns and APIs, and you can tackle any issues one at a time as they appear. But when you take on an existing codebase, you get hit with everything at once. Even if Skip perfectly translates 95+% of your original Swift source and API calls - code that was certainly never intended to be cross-platform - that can leave dozens or even hundreds of errors to deal with! 

It's important to remember, though, that while fixing that remaining 5% can be a [slog](https://www.merriam-webster.com/dictionary/slog), it is still 20 times less work than a 100% Android rewrite! And once you've worked through the errors, you'll have a wonderfully maintainable, unified Swift and SwiftUI codebase moving forward. So let's roll up our sleeves and get started, beginning with the error above.

The pictured error message says that the `Color(_ name:)` constructor isn't available in Skip. Each of Skip's major [frameworks](/docs/modules/) includes a listing you can consult of the API that is supported on Android. These listings are constantly expanding as we port additional functionality. For example, here is the table of [supported SwiftUI](/docs/modules/skip-ui/#supported-swiftui).

When an API is unsupported, that does *not* mean you can't use it in your app! Skip never forces you to compromise your iOS app. Rather, it means that you have to find a solution for your Android version. That could mean [contributing](/docs/contributing/) an implementation for the missing API, but more often you'll just want to take a different Android code path. To keep your iOS code intact but create an alternate Android code path, use `#if SKIP` (or `#if !SKIP`) compiler directives. The [Skip documentation](/docs/platformcustomization/) covers compiler directives and other platform customization techniques in detail. Let's update the problematic code in `Theme.swift` to use named colors on iOS, but fall back to a constant color on Android until we implement a solution:

Change:

```swift
var mainColor: Color {
    Color(rawValue)
}
```
To: 

```swift
var mainColor: Color {
    #if !SKIP
    Color(rawValue)
    #else
    // TODO
    Color.yellow
    #endif
}
```

This technique works for SwiftUI modifiers as well. For example, while Skip is able to translate many of SwiftUI's accessibility modifiers for Android (in fact Skip's native-UI approach excels in accessibility), it doesn't have a translation for the `.accessibilityElement(children:)` modifier. So, update from this:

```swift
HStack {
    Label("Length", systemImage: "clock")
    Spacer()
    Text("\(scrum.lengthInMinutes) minutes")
}
.accessibilityElement(children: .combine)
```

To this:

```swift
HStack {
    Label("Length", systemImage: "clock")
    Spacer()
    Text("\(scrum.lengthInMinutes) minutes")
}
#if !SKIP
.accessibilityElement(children: .combine)
#endif
```

The iOS version of the app is unaffected, and the Android build can proceed without the unsupported modifier.

## Rinse, Lather, Repeat

Getting Scrumskipper to successfully build as an iOS *and* Android app is a repetition of the process we began above:

1. Hit the Run button.
1. View the next batch of [Xcode errors](/docs/app-development/#build-errors) from the transpiler or the Kotlin compiler.
1. Use compiler directives to exclude the source causing the error from the Android build.

If you see this process through as we did, you'll end up using `#if SKIP` and `#if !SKIP` approximately 25 times in the ~1,500 lines of Scrumdinger's Swift and SwiftUI source. In addition to the aforementioned `Color(_ name:)` and `.accessibilityElement(children:)` APIs, here is a full accounting of Scrumdinger code that causes errors:

- The `Speech` and `AVFoundation` frameworks used in Scrumdinger are not supported. While Skip does have a minimal `AVFoundation` implementation for Android, it is not complete as of this writing. These are examples of cases where you would likely use Skip's [dependency](/docs/dependencies/) support to integrate Android-specific libraries for the missing functionality.
- `Timer.tolerance` is not supported.
- `.ultraThinMaterial` is not supported.
- `ListFormatter` is not supported. We replaced `ListFormatter.localizedString(byJoining: attendees.map { $0.name })` with `attendees.map { $0.name }.joined(separator: ", ")`.
- SwiftUI's `ProgressViewStyle` is not yet supported.
- SwiftUI's `LabelStyle` is not yet supported.
- The `Theme` enum's `name` property causes an error because all Kotlin enums inherit a built-in, non-overridable `name` property already. We changed the property to `themeName`.

You can view the final result in the source of our `skipapp-scrumskipper` [sample app](/docs/samples/skipapp-scrumskipper/). 

After using compiler directives to work around these errors, we have liftoff! Scrumskipper launches on both the iOS Simulator and Android Emulator. Clearly, however, it needs additional work.

<img alt="Screenshot of the Android app's scrum list" src="/assets/images/scrumskipper/android-initial-scrums.png" style="width: 50%; max-width: 300px;" />
<img alt="Screenshot of the Android app's scrum detail" src="/assets/images/scrumskipper/android-initial-detail.png" style="width: 50%; max-width: 300px;" />
<img alt="Screenshot of the Android app's meeting view" src="/assets/images/scrumskipper/android-initial-meeting.png" style="width: 50%; max-width: 300px;" />

## Fixups

As you explore the app, you'll find many things that are missing or broken. Fortunately, it turns out that the problems are all easily fixed. View our [sample app](/docs/samples/skipapp-scrumskipper/) to see the completed code. We give a brief description of each issue below.

### iOS App Resources

Copying over Scrumdinger's source code wasn't quite enough. We forgot to copy its `ding.wav` resource and more importantly, the `Info.plist` keys that give the app permission to use the microphone and speech recognition. Without these keys, the iOS app will crash when you attempt to start a meeting.

### Android SF Symbols

Scrumdinger uses SF Symbols for all of its in-app images. Android obviously doesn't include these out of the box, but Skip allows you to easily add symbols to your app. Just place vector images with the desired symbol names in your `Module` asset catalog, as described [here](/docs/modules/skip-ui/#system-symbols). For the purposes of this demo, we exported the symbols from Apple's SF Symbols app.

<img alt="Exporting a SF Symbol" src="/assets/images/scrumskipper/symbols-export.png" style="width: 100%; max-width: 700px;" />
<img alt="Copying SF Symbols to Scrumskipper" src="/assets/images/scrumskipper/symbols-copy.png" style="width: 100%; max-width: 700px;" />

### MeetingView

We made two additional tweaks to `MeetingView`. First, the custom `MeetingTimerView` was not rendering at all on Android. Layout issues like this are rare, but they do occur. Second, we didn't want the Android navigation bar background to be visible. We added a couple of `#if SKIP` blocks to the view `body` to correct these issues:

```swift
var body: some View {
    ZStack {
        ...
        VStack {
            MeetingHeaderView(...)
            MeetingTimerView(...)
                #if SKIP
                .frame(maxWidth: .infinity, maxHeight: .infinity)
                #endif
            MeetingFooterView(...)
        }
    }
    ...
    #if SKIP
    .toolbarBackground(.hidden, for: .navigationBar)
    #endif
}
```

### Persistence

Scrums were not being saved and restored in the Android version of the app. It turns out that Scrumdinger saved its state on transition to `ScenePhase.inactive`, but Android doesn't use this phase! Android apps transition directly from `active` to `background` and back. The following simple change fixed the issue:

```swift
struct ScrumsView: View {
    @Environment(\.scenePhase) private var scenePhase
    ...

    var body: some View {
        NavigationStack {
            ...
        }
        .onChange(of: scenePhase) { phase in
            #if !SKIP
            if phase == .inactive { saveAction() }
            #else
            if phase == .background { saveAction() }
            #endif
        }
    }
}
```

### Named Colors

Remember how we were going to circle back to the `Theme` enum's named colors on Android? We decided to forgo the asset catalog colors altogether and just define each color programmatically with RGB values.

### Results

The completed native Android app actually looks a lot like its iOS counterpart:

<img alt="Screenshot of the Android app's scrum list" src="/assets/images/scrumskipper/android-final-scrums.png" style="width: 50%; max-width: 300px;" />
<img alt="Screenshot of the Android app's scrum detail" src="/assets/images/scrumskipper/android-final-detail.png" style="width: 50%; max-width: 300px;" />
<img alt="Screenshot of the Android app's edit view" src="/assets/images/scrumskipper/android-final-edit.png" style="width: 50%; max-width: 300px;" />
<img alt="Screenshot of the Android app's meeting view" src="/assets/images/scrumskipper/android-final-meeting.png" style="width: 50%; max-width: 300px;" />

## Conclusion

Take a moment to reflect on how amazing it is that Apple's canonical SwiftUI iPhone sample now runs as a fully native Android app. Though Skip excels at *new* development and the process for bringing Scrumdinger's existing code to Android wasn't trivial, it was still an order of magnitude faster than a re-write and did not risk regressions to the iOS version. Moreover, future maintenance and improvements will be extremely efficient thanks to having a single shared Swift and SwiftUI codebase.

The Android version doesn't yet have all the features of the iOS one, but additional Android functionality can be added over time. Skip *never* forces you to compromise your iOS app, provides a fast path to a native Android version using your existing code, and has [excellent integration abilities](/docs/platformcustomization/) to enhance and specialize your Android app when the effort warrants it.
