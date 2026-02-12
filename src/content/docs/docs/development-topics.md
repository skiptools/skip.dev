---
title: Common Topics
permalink: /docs/development-topics/

---

This chapter covers how to perform a variety of common development tasks across platforms with Skip. 

## Configuration with `Skip.env`

Skip app customization should be primarily done by directly editing the included `Skip.env` file, rather than changing the app's settings in Xcode. Only properties that are set in the `Skip.env` file, such as `PRODUCT_NAME`, `PRODUCT_BUNDLE_IDENTIFIER` and `MARKETING_VERSION`, will carry through to both `HelloSkip.xcconfig` and `AndroidManifest.xml`. This is how a subset of the app's metadata can be kept in sync between the iOS and Android versions, but it requires that you forgo using the Xcode Build Settings interface (which does not modify the `.xcconfig` file, but instead overrides the settings in the local `.xcodeproj/` folder).

---

## Localization

Localizing your app into multiple languages gives it the maximum possible reach. Localization is a critical part of making your app accessible to users all around the world. Skip helps unlock the promise of true universality for your app by bringing SwiftUI to Android, but the other half of the equation is ensuring that your users can understand the content of your app.

Skip embraces the `xcstrings` catalog format, new in Xcode 15, to provide a simple and easy solution to adding support for multiple languages to your app.

### Localization example {#example}

Consider the following SwiftUI snippet from the default "Hello" app of a screen in a tab bar with a "Hello Skipper!" message.

```swift
VStack {
    Text("Hello \(name)!")
    Image(systemName: "heart.fill")
        .foregroundStyle(.red)
}
.font(.largeTitle)
.tabItem { Label("Welcome", systemImage: "heart.fill") }

```

For users with their device language set to French, we want the tab item to be "Bienvenue" and the message to be displayed as "Bonjour Skipper!". This can be accomplished by editing the `Localizable.xcstrings` file in Xcode and filling in the translations for each supported language. String interpolation is handled by substituting the variable (e.g., `"\(name)"`) with the token `"%@"`, which will cause the translated string to insert any variables that need to be substituted at runtime.

To localize strings used outside of SwiftUI, use iOS's standard `NSLocalizedString` function, which also requires you to insert tokens for any variables:

```swift
let localizedTitle = NSLocalizedString("License key for %@")
sendLicenseKey(key, to: user, title: String(format: localizedTitle, user.fullName))
```

Xcode 15 has native support for editing string catalogs with a convenient user interface:

<img style="width: 100%; object-fit: contain;" alt="Xcode screenshot of editing an .xcstrings file" src="https://assets.skip.dev/screens/xcode-xcstrings-edit.png" />

The result is that by updating this single file, you can localize your app into many languages, enabling native speakers of those languages to use your app with ease. For example, the default "Hello" app has localizations for English, French, Spanish, Japanese, and Chinese, shown here for both the iOS and Android versions of the app:

<div class="localization-screenshot-container">
<img alt="Localization screenshot" src="https://assets.skip.dev/hello/en/ios/welcome_light_framed.png" />
<img alt="Localization screenshot" src="https://assets.skip.dev/hello/fr/ios/welcome_dark_framed.png" />
<img alt="Localization screenshot" src="https://assets.skip.dev/hello/es/ios/welcome_light_framed.png" />
<img alt="Localization screenshot" src="https://assets.skip.dev/hello/ja/ios/welcome_dark_framed.png" />
<img alt="Localization screenshot" src="https://assets.skip.dev/hello/zh/ios/welcome_light_framed.png" />
</div>
<div class="localization-screenshot-container">
<img alt="Localization screenshot" src="https://assets.skip.dev/hello/en/android/welcome_dark_framed.png" />
<img alt="Localization screenshot" src="https://assets.skip.dev/hello/fr/android/welcome_light_framed.png" />
<img alt="Localization screenshot" src="https://assets.skip.dev/hello/es/android/welcome_dark_framed.png" />
<img alt="Localization screenshot" src="https://assets.skip.dev/hello/ja/android/welcome_light_framed.png" />
<img alt="Localization screenshot" src="https://assets.skip.dev/hello/zh/android/welcome_dark_framed.png" />
</div>

<!-- 
<div class="localization-screenshot-container">
<img alt="Localization screenshot" src="https://assets.skip.dev/hello/en/ios/home_light_framed.png" />
<img alt="Localization screenshot" src="https://assets.skip.dev/hello/fr/ios/home_dark_framed.png" />
<img alt="Localization screenshot" src="https://assets.skip.dev/hello/es/ios/home_light_framed.png" />
<img alt="Localization screenshot" src="https://assets.skip.dev/hello/ja/ios/home_dark_framed.png" />
<img alt="Localization screenshot" src="https://assets.skip.dev/hello/zh/ios/home_light_framed.png" />
</div>
<div class="localization-screenshot-container">
<img alt="Localization screenshot" src="https://assets.skip.dev/hello/en/android/home_dark_framed.png" />
<img alt="Localization screenshot" src="https://assets.skip.dev/hello/fr/android/home_light_framed.png" />
<img alt="Localization screenshot" src="https://assets.skip.dev/hello/es/android/home_dark_framed.png" />
<img alt="Localization screenshot" src="https://assets.skip.dev/hello/ja/android/home_light_framed.png" />
<img alt="Localization screenshot" src="https://assets.skip.dev/hello/zh/android/home_dark_framed.png" />
</div>
 -->
 
<!-- 
<div class="localization-screenshot-container">
<img alt="Localization screenshot" src="https://assets.skip.dev/hello/en/ios/settings_light_framed.png" />
<img alt="Localization screenshot" src="https://assets.skip.dev/hello/fr/ios/settings_dark_framed.png" />
<img alt="Localization screenshot" src="https://assets.skip.dev/hello/es/ios/settings_light_framed.png" />
<img alt="Localization screenshot" src="https://assets.skip.dev/hello/ja/ios/settings_dark_framed.png" />
<img alt="Localization screenshot" src="https://assets.skip.dev/hello/zh/ios/settings_light_framed.png" />
</div>
<div class="localization-screenshot-container">
<img alt="Localization screenshot" src="https://assets.skip.dev/hello/en/android/settings_dark_framed.png" />
<img alt="Localization screenshot" src="https://assets.skip.dev/hello/fr/android/settings_light_framed.png" />
<img alt="Localization screenshot" src="https://assets.skip.dev/hello/es/android/settings_dark_framed.png" />
<img alt="Localization screenshot" src="https://assets.skip.dev/hello/ja/android/settings_light_framed.png" />
<img alt="Localization screenshot" src="https://assets.skip.dev/hello/zh/android/settings_dark_framed.png" />
</div>
 -->

### The `xcstrings` Format {#xcstrings}

The Skip plugin handles the `.xcstrings` localization format, which is used by Xcode 15 as a single source of truth for the app's localization. The default project created by `skip init --appid=… hello-skip HelloSkip` will create a `Sources/HelloSkip/Resources/Localizable.xcstrings` file which can be used as a starting point for adding new languages and string translations to your project.

:::tip
Xcode 15 will automatically fill in any strings that it finds in common SwiftUI components, such as `Text`, `Label`, and `Button`. This happens in the background, as part of a "Sync Localizations" operation that periodically scans your code for new and updated strings. You will rarely, if ever, need to manually add a localization key to the `Localizable.xcstrings` catalog.
:::

The `Localizable.xcstrings` file is a simple JSON file which can be either edited through Xcode or handed off to specialist translators and then re-integrated back into your application. The structure is simple, and can be edited either by hand or using machine translation tools. An excerpt of the format is as follows:

```json
{
  "sourceLanguage" : "en",
  "strings" : {
    "Hello %@!" : {
      "localizations" : {
        "es" : {
          "stringUnit" : {
            "state" : "translated",
            "value" : "¡Hola %@!"
          }
        },
        "fr" : {
          "stringUnit" : {
            "state" : "translated",
            "value" : "Bonjour %@!"
          }
        },
        "ja" : {
          "stringUnit" : {
            "state" : "translated",
            "value" : "こんにちは、%@!"
          }
        },
        "zh-Hans" : {
          "stringUnit" : {
            "state" : "translated",
            "value" : "你好，%@!"
          }
        }
      }
    },
    "Welcome" : {
      "localizations" : {
        "es" : {
          "stringUnit" : {
            "state" : "translated",
            "value" : "Bienvenido"
          }
        },
        "fr" : {
          "stringUnit" : {
            "state" : "translated",
            "value" : "Bienvenue"
          }
        },
        "ja" : {
          "stringUnit" : {
            "state" : "translated",
            "value" : "ようこそ"
          }
        },
        "zh-Hans" : {
          "stringUnit" : {
            "state" : "translated",
            "value" : "欢迎"
          }
        }
      }
    }
  },
  "version" : "1.0"
}
```

The following table lists the supported tokens that will be substituted at runtime:

Token | Meaning
--- | ---
$@ | String or stringified instance
%ld or %lld | integer number
%lf or %llf | floating point number
%.3f | formatted floating point number
%1$@ | maually-specified positional argument
%% | literal escaped percent sign

More information on the Xcode editor for the `xcstrings` format can be found at [https://developer.apple.com/documentation/xcode/localizing-and-varying-text-with-a-string-catalog](https://developer.apple.com/documentation/xcode/localizing-and-varying-text-with-a-string-catalog).

:::note
Android has a separate localization system that involved adding keys to a `res/values/strings.xml` file. Skip does _not_ use this system, as it is incompatible with modularization; adding entries to this XML file will not have any effect on a SkipUI app.
:::

### Localizing modules {#modules}

SwiftUI components that accept a `String`, such as `Text("Hello \(name)!")` or `Button("Click Me") { doSomething() }`, as well as the standard `NSLocalizedString` function assume that the localized string is defined in the `main` bundle. On the Android side, `Bundle.main` uses the resources defined in the primary app module, which is the module in the app that contains the entry point and top-level resources.

However, when you modularize your app by breaking it up into separate SwiftPM modules, references to these string keys will still assume that they are defined in the `main` bundle, rather than in the `module` bundle. This assumption is built in to both SwiftUI as well as the transpiled SkipUI. This means that if you create a separate library module of UI components to be shared between apps, you need to manually specify the bundle that should be referenced for the translated keys.

Each SwiftUI component that accepts a localization string will also have a constructor that accepts a `Bundle` parameter. The `NSLocalizedString` function takes an optional `Bundle` as well. You generally want to use the `Bundle.module` value as the argument, which will cause it to reference the component's module. For example:

```swift
VStack {
    Text("Hello \(name)!", bundle: .module)
    Button {
        doSomething()
    } label: {
        Text("Click Me", bundle: .module)
    }
}

...

let localizedTitle = NSLocalizedString("License key for %@", bundle: .module)
sendLicenseKey(key, to: user, title: String(format: localizedTitle, user.fullName))
```

The additional bundle parameter makes your code more verbose, but has the advantage that the component can be used irrespective of whether it is defined in the top-level app package on in a separate module.

### Localizing raw strings {#NSLocalizedString}

In addition to localizing SwiftUI components, the string localization dictionary can be accessed using the Foundation function `NSLocalizedString`, which enables the localization of strings that are constructed outside the context of user-interface elements.

For example, to create a local variable with a localized string:

```swift
let helloWorld = NSLocalizedString("Hello World", bundle: .module, comment: "greeting string")
```

The `comment` element is required and is used to provide context to translators.

Parameterizing strings localized in this manner is a bit more complex than SwiftUI elements, since automatic string interpolation being converted into the `%@` tokens does not take place:

```swift
let personName = "Skipper"
let greeting = String(format: NSLocalizedString("Hello, %@!", bundle: .module, comment: "parameterized greeting"), personName)
```

### Limitations {#limitations}

:::caution
Skip does not currently handle String Catalog Plural Variants (described at [https://developer.apple.com/documentation/xcode/localizing-and-varying-text-with-a-string-catalog#Add-pluralizations](https://developer.apple.com/documentation/xcode/localizing-and-varying-text-with-a-string-catalog#Add-pluralizations)).
:::

---

## Notifications

Skip supports the [core API](/docs/modules/skip-ui/#supported-usernotifications) of Apple's `UserNotifications` framework so that your iOS notification-handling code works across platforms. The setup for integrating notification functionality into your app, however, will vary depending on the push service you are using. Skip's [Firebase support](/docs/modules/skip-firebase/) includes push messaging out of the box. Follow [its instructions](/docs/modules/skip-firebase/#messaging) to support push notifications on top of Firebase Cloud Messaging in your dual-platform app. 

You often want to take a user to a particular part of your app when they tap on a notification. To do so, we recommend sending a [deep link](#deep-links) URL in the notification metadata. The next section discusses how to support deep links in your cross-platform app, and our [FireSide sample app](https://github.com/skiptools/skipapp-fireside-fuse) demonstrates push notifications, deep linking, and using them together. Here is an excerpt showing how you might send a user to a location in your app from your `UNUserNotificationCenterDelegate`:

```swift
public func userNotificationCenter(_ center: UNUserNotificationCenter, didReceive response: UNNotificationResponse) async {
    // Look for a custom 'deep_link' key in the notification payload, which should be a URL with our app's scheme
    let content = response.notification.request.content
    if let deepLink = content.userInfo["deep_link"] as? String, let url = URL(string: deepLink) {
        Task { @MainActor in
            await UIApplication.shared.open(url)
        }
    }
}
```

---

## Deep Links {#deep-links}

Deep links allow you to bring a user to a particular part of your app. Skip supports custom URL schemes and SwiftUI deep link handling.

### Darwin Setup

To support deep links in your iOS build, first follow Apple's instructions to register your [custom URL scheme](https://developer.apple.com/documentation/xcode/defining-a-custom-url-scheme-for-your-app) in Xcode.

<img style="width: 100%; object-fit: contain;" alt="Xcode screenshot of adding a custom URL scheme" src="https://assets.skip.dev/screens/xcode-customurlscheme.png" />

:::caution
**Only** pay attention to the instructions for registering your custom URL scheme. Ignore the remaining instructions about handling deep links in your code, because you'll be using SwiftUI's deep link processing instead. 
:::

### Android Setup

Edit your Android build's `AndroidManifest.xml` to add an `intent-filter` for your custom URL scheme. For example to support `myurlscheme`, add the following to your `AndroidManifest.xml`:

```
<manifest ...>
    ...
    <application ...>
        ...
        <activity ...>
            ...
            <intent-filter>
                <action android:name="android.intent.action.VIEW" />
                <category android:name="android.intent.category.BROWSABLE" />
                <category android:name="android.intent.category.DEFAULT" />
                <data android:scheme="myurlscheme" />
            </intent-filter>
        </activity>
    </application>
</manifest>
```

:::tip
While iOS is flexible, Android will expect deep link URLs with the general form `scheme://host` or `scheme://host/path`. 
:::

### SwiftUI

SwiftUI uses the [`onOpenURL`](https://developer.apple.com/documentation/swiftui/view/onopenurl(perform:)) view modifier to intercept and process deep links. Place the modifier on a view that will be rendered when the app opens, and use its action to process the given URL. This will typically involve updating your navigation bindings to take the user to a specified location in the app, as in the following sample:

```swift
enum Tab : String {
    case cities, favorites, settings
}

public struct ContentView: View {
    @AppStorage("tab") var tab = Tab.cities
    @State var cityListPath = NavigationPath()

    public var body: some View {
        TabView(selection: $tab) {
            NavigationStack(path: $cityListPath) {
                CityListView()
            }
            ...
            .tag(Tab.cities)

            NavigationStack {
                FavoriteCityListView()
            }
            ...
            .tag(Tab.favorites)

            SettingsView()
                ...
                .tag(Tab.settings)
        }
        // travel://<tab>[/<city>], e.g. travel://cities/London or travel://favorites
        .onOpenURL { url in
            if let tabName = url.host(), let tab = Tab(rawValue: tabName) {
                self.tab = tab // Select the encoded tab
                if tab == .cities, let city = city(forName: url.lastPathComponent)) {
                    // iOS needs an async dispatch after switching tabs to read navigationDestinations
                    DispatchQueue.main.async {
                        // Set nav stack to root + specified city
                        cityListPath.removeLast(cityListPath.count)
                        cityListPath.append(city.id)
                    }
                }
            }
        }
    }
}
```

### Testing

On iOS, the easiest way to test your deep link handling is by entering a URL with your custom scheme into Safari. You can also write a URL into a Calendar event or a Note. iOS will linkify the text so that tapping it will open your app.

Android includes an `adb` command for sending intents to the running emulator or device, including deep links. Building on our SwiftUI example above, enter a command like the following in Terminal:

```console
% adb shell am start -W -a android.intent.action.VIEW -d "travel://cities/London"
```

---

## `singleTop`

When a user taps a notification or deep link for your app on Android, the system fires an `Intent` to open your app. By default, this will initialize a new instance of your app's main `Activity`, even if your app is already running. That means that any transient UI state may be lost.

If you'd like the more iOS-like behavior of keeping your UI as-is when your app is brought to the foreground via a notification or deep link, you can use the `singleTop` launch mode. Edit your `Android/app/src/main/AndroidManifest.xml` as follows:

```xml
<manifest ...>
    ...
    <application ...>
        ...
        <activity 
             ...
             android:launchMode="singleTop">
            ...
        </activity>
    </application>
</manifest>
```

Read more about launch modes and other `Activity` options [here](https://developer.android.com/guide/topics/manifest/activity-element).

---

## Resources

Place shared resources in the `Sources/ModuleName/Resources/` folder. Skip will copy the files in this folder to your Android build and make them available to the standard `Bundle` loading APIs. For example, the following Swift loads the `Sources/ModuleName/Resources/sample.dat` file on both iOS and Android:

```
let resourceURL = Bundle.module.url(forResource: "sample", withExtension: "dat")
let resourceData = Data(contentsOf: resourceURL)
``` 

Resources are embedded in the `assets/` folder of the Android APK, and are accessed through
a custom URL handler for the "asset:" protocol that reads assets from the specified path.

:::caution
Unlike Darwin platforms, where resources are stored as individual files on disk, Android resources remain in their containing APK when the app is installed. For this reason, you can only access resources via the `Bundle.module.url(forResource:)` API. The `Bundle.module.path(forResource:)` functions will raise an exception if attempted on Android.
:::

### Colors

Skip supports named colors defined in asset catalogs as well as defining an app-wide `AccentColor` asset. See the [SkipUI module documentation](/docs/modules/skip-ui/#colors) for instructions on how to use named colors across both iOS and Android.

### Fonts

Skip allows you to use your own custom fonts on iOS and Android. The [SkipUI module documentation](/docs/modules/skip-ui/#custom-fonts) details how to install and use custom fonts.

### Images

Skip supports iOS asset catalogs containing PNG, JPG, and PDF image files, as well as exported [Google Material Icons](https://fonts.google.com/icons) and [SF Symbols](https://developer.apple.com/sf-symbols/) SVG files. Skip also supports network images and bundled image files. The [SkipUI module documentation](/docs/modules/skip-ui/#images) details where to place shared assets catalogs, how to supply SF Symbols to your Android app, and how to load and display images in your SwiftUI.

### App Icons

Skip can help manage your app icons by generating and updating icons from PNG or SVG files. For example:

```
$ skip icon --open-preview --foreground white --random-background https://raw.githubusercontent.com/google/material-design-icons/refs/heads/master/symbols/web/crowdsource/materialsymbolsrounded/crowdsource_40px.svg
```

For more information, see the [`skip icon` CLI reference](/docs/skip-cli/#icon).

---

## Themes {#themes}

Skip fully supports iOS and Android system color schemes, as well as SwiftUI styling modifiers like `.background`, `.foregroundStyle`, `.tint`, and so on. You may, however, want to customize aspects of your Android UI's colors and components that cannot be configured through SwiftUI's standard modifiers. Skip provides additional Android-only API for this purpose. These SwiftUI add-ons allow you to reach "under the covers" and manipulate Skip's underlying use of Compose. They are detailed in the SkipUI module documentation's [Material](/docs/modules/skip-ui/#material) topic.

:::caution
Material SwiftUI modifiers for [Skip Fuse](/docs/modes/#fuse) are a work in progress. They are currently only supported for [Skip Lite](/docs/modes/#lite) apps.
:::

