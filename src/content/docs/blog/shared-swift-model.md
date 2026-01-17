---
title:  "Native Swift on Android, Part 3: Sharing a Swift Model Layer"
date:   2024-12-19
tags: [android, cross-platform, jetpack-compose, mobile, native, skip, swift, swiftui, toolchain]
layout: post
author: the Skip Team
permalink: /blog/shared-swift-model/
---

Native Swift on Android, Part 3: Sharing a Swift Model Layer

## Introduction

This is the third installment in our series exploring native Swift on Android. In [Part 1](/blog/native-swift-on-android-1/) we discuss bringing the Swift compiler and toolchain to Android. [Part 2](/blog/skip-native-tech-preview/) introduces Skip's tooling and technology for [Swift Android app development](/docs/native/) and leads you through the creation of your first cross-platform Swift app. 

:::note
If you haven't already, we highly recommend reading [Part 2](/blog/skip-native-tech-preview/) to familiarize yourself with Swift-on-Android app development.
:::

The app we create in Part 2 uses a compiled Swift model layer and a shared SwiftUI interface, which Skip [transpiles](https://en.wikipedia.org/wiki/Source-to-source_compiler) to Jetpack Compose on Android. The following diagram illustrates this dual-platform, single-codebase architecture:

![Skip Native Diagram](https://assets.skip.tools/diagrams/skip-diagrams-native-model.svg)
{: .diagram-vector }

In this article, by contrast, we create separate iOS and Android apps. The iOS app and shared model layer are written in Swift and SwiftUI using Xcode. The Android app is written in [Kotlin](https://kotlinlang.org) and [Jetpack Compose](https://developer.android.com/compose) using Android Studio, and it imports the compiled Swift model as a dependency. This structure  allows you to reuse the lower layers of your app logic while fully embracing the standard IDEs and UI toolkits on each platform: 

![Skip Shared Model Diagram](https://assets.skip.tools/diagrams/skip-diagrams-native-twoapps.svg)
{: .diagram-vector }

:::note
Thanks to Skip's ability to [move fluidly between SwiftUI and Compose](/docs/platformcustomization/#swiftui-and-compose), you could also choose to share *parts* of your SwiftUI interface between iOS and Android while maintaining the rest separately.
:::

## TravelPosters

<img alt="Simulators displaying the same app on iPhone and Android" src="https://assets.skip.tools/screens/skip-native-travelposters-sims.png" style="width: 100%; max-width: 600px;" />

Our sample apps in this installment are iOS and Android versions of `TravelPosters`, a simple scrolling grid displaying posters of famous cities. Each poster displays the city's name and current temperature. You can mark your favorites, and these favorites are remembered across app launches.

## The Shared Model

Our shared `TravelPostersModel`, therefore, has the following responsibilities:

- Provide a list of cities. Each city must supply its name and a poster image URL.
- Fetch the current temperature for each city.
- Allow the addition and removal of cities from an observable set of favorites.
- Persist and restore the set of favorites across uses of the app.

And given that our model will power both iOS *and Android* apps, we should add the following table-stakes Android requirements:

- We must be able to access our Swift model API naturally in Kotlin, just as in Swift.
- Our mutable set of favorites must be observable not only to SwiftUI state tracking, but to Jetpack Compose state tracking as well.

Fortunately, Swift is more than up to the task of meeting our model's general requirements, and Skip's *SkipFuse* technology will handle transparently bridging it all to Kotlin and Compose!

### Installing Skip

If you plan on following along and you haven't already installed Skip, follow [Part 2's installation instructions](/blog/skip-native-tech-preview/). This will quickly get you up and running with Skip, its requirements, and the native Swift Android toolchain.

:::tip
You can find the completed sample including iOS and Android apps at [https://github.com/skiptools/skipapp-travelposters-native](https://github.com/skiptools/skipapp-travelposters-native).
:::

### Creating the Model Package

As a good, modern citizen of the Swift ecosystem, Skip works atop [Swift Package Manager](https://www.swift.org/documentation/package-manager/). Our shared model will be a Swift package configured to use `skipstone`, the Skip build plugin. You could create this package and configure its use of Skip by hand, but Skip provides tooling to help.

First, create the folder structure we'll use to hold our shared model as well as our iOS and Android apps. You do not *have* to house your apps together, but this is the structure we'll use in this article.

```
mkdir travelposters
cd travelposters
mkdir iOS
mkdir Android    
```

Now use the `skip` tool to create the shared model package:

```
skip init --native-model travel-posters-model TravelPostersModel
```

<img alt="Output of running skip init --native-model" src="https://assets.skip.tools/screens/skip-native-package-init.png" style="width: 100%; max-width: 600px;" />

This command generates a `travel-posters-model` SwiftPM package containing the `TravelPostersModel` Swift module. The `--native-model` option ensures that the module will already be configured to compile natively on Android, and to bridge its public API to Kotlin. Our particular needs, however, require a couple of additional steps.

1. We know that parts of our model will be `@Observable`. In order for `@Observables` to work on Android, we need a dependency on `skip-model`. Edit the generated `Package.swift` to add it:

    ```swift
    ...
    let package = Package(
        name: "travel-posters-model",
        ...
        dependencies: [
            .package(url: "https://source.skip.tools/skip.git", from: "1.2.0"),
            .package(url: "https://source.skip.tools/skip-model.git", from: "1.0.0"), // <-- Insert
            .package(url: "https://source.skip.tools/skip-fuse.git", "0.0.0"..<"2.0.0")
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

2. The `--native-model` option we passed to `skip init` will configure Skip to automatically bridge our model's public API from compiled Swift to Android's [ART](https://source.android.com/docs/core/runtime) Java runtime. This is done through the [`skip.yml`](/docs/modes/#configuration) configuration file included in every Skip module. By default, however, Skip assumes that you'll be bridging to *transpiled* Swift and SwiftUI code. Instead, we'll be consuming the model from pure Kotlin, so we want to optimize the bridging for Kotlin compatibility. We do this by editing the `Sources/TravelPostersModel/Skip/skip.yml` file to look like this:

    ```yaml
    skip:
      mode: 'native'
      bridging:
        enabled: true
        options: 'kotlincompat'
    ```

You can read more about the magic of bridging in the [documentation](/docs/modes/#bridging).

With these updates in place, we're now ready to iterate on our shared Swift model code!

### Exploring the Code

The beauty of cross-platform Swift code is how boring it is. You can browse our model's complete content [on GitHub](https://github.com/skiptools/skipapp-travelposters-native/tree/main/travel-posters-model/Sources/TravelPostersModel), but it looks more or less exactly as you'd expect given the previously-enumerated requirements. It has some `Codable` structs to represent cities and weather:

```swift
public struct City : Identifiable, Codable {
    public typealias ID = Int

    public let id: ID
    public let name: String
    public let imageURL: URL
    ...
}

public struct WeatherConditions : Hashable, Codable {
    public let temperature: Double // 16.2
    public let windspeed: Double // 16.6
    ...
}
```

:::note
These structs are used in other Skip samples as well, so they contain more information than we strictly need for `TravelPosters`.
:::

The model uses `URLSession` and `JSONDecoder` to fetch the current weather:

```swift
public struct Weather : Hashable, Codable {
    public let latitude: Double // e.g.: 42.36515
    public let longitude: Double // e.g.: -71.0618
    public let time: Double // e.g.: 0.6880760192871094
    ...
    public let conditions: WeatherConditions

    enum CodingKeys: String, CodingKey {
        case latitude = "latitude"
        case longitude = "longitude"
        case time = "generationtime_ms"
        ...
        case conditions = "current_weather"
    }

    public static func fetch(latitude: Double, longitude: Double) async throws -> Weather {
        let factor = pow(10.0, 4.0) // API expects a lat/lon rounded to 4 places
        let lat = Double(round(latitude * factor)) / factor
        let lon = Double(round(longitude * factor)) / factor
        let url = URL(string: "https://api.open-meteo.com/v1/forecast?latitude=\(lat)&longitude=\(lon)&current_weather=true")!

        var request = URLRequest(url: url)
        request.setValue("skipapp-sample", forHTTPHeaderField: "User-Agent")

        let (data, response) = try await URLSession.shared.data(for: request)
        return try JSONDecoder().decode(Weather.self, from: data)
    }
}
```

And it includes an `@Observable CityManager` to provide the list of cities and to persist favorites:

```swift
@Observable public final class CityManager {
    private static let favoritesURL = URL.applicationSupportDirectory.appendingPathComponent("favorites.json")

    public static let shared = CityManager()

    private init() {
        do {
            self.allCities = try JSONDecoder().decode([City].self, from: localCitiesJSON.data(using: .utf8)!).sorted { c1, c2 in
                c1.name < c2.name
            }
        } catch {
            logger.log("error loading cities: \(error)")
        }
        do {
            self.favoriteIDs = try JSONDecoder().decode([City.ID].self, from: Data(contentsOf: Self.favoritesURL))
            logger.log("loaded favorites: \(self.favoriteIDs)")
        } catch {
            logger.log("error loading favorites: \(error)")
        }
    }

    public var allCities: [City] = []

    public var favoriteIDs: [City.ID] = [] {
        didSet {
            logger.log("saving favorites: \(self.favoriteIDs)")
            do {
                try FileManager.default.createDirectory(at: Self.favoritesURL.deletingLastPathComponent(), withIntermediateDirectories: true)
                try JSONEncoder().encode(favoriteIDs).write(to: Self.favoritesURL)
            } catch {
                logger.log("error saving favorites: \(error)")
            }
        }
    }
}

private let localCitiesJSON = """
...
"""
```

While this code is generally pretty standard, it does contain a few concessions to the realities of current Swift support on Android:

- In files that create an `OSLog.Logger` or that define an `@Observable` type, we also `import SkipFuse`. In fact, Skip will surface a build warning in Xcode if you attempt to define an `@Observable` in a bridged file that doesn't import the SkipFuse framework!

    [SkipFuse](/docs/modules/skip-fuse/) is an umbrella framework that "fuses" the Swift and Android worlds. It makes sure that your `OSLog` messages are routed to Android's Logcat logging service, that your `@Observable` state is tracked by Jetpack Compose, and more - all without changes to your normal code path.
- You may notice other unfamiliar `import` patterns as well. For example, `Foundation` on Linux and Android is divided into `Foundation`, `FoundationNetworking`, `FoundationInternationalization`, and `FoundationXML`. So in [`Weather.swift`](https://github.com/skiptools/skipapp-travelposters-native/blob/main/travel-posters-model/Sources/TravelPostersModel/Weather.swift) where we use `URLSession`, we have the following imports:

    ```swift
    import Foundation
    #if canImport(FoundationNetworking)
    import FoundationNetworking
    #endif
    ```

- Though we do not need them here, you may encounter `#if os(Android)` checks to conditionalize code for Android or Darwin platforms in other Android-supporting codebases, just as you'll often find `#if os(macOS)` conditions in macOS-supporting codebases.
- We're loading our cities JSON from a static string, but more tyically you would load the contents from a resource. SkipFuse supports bundling Swift module resources as idiomatic [Android assets](https://developer.android.com/guide/topics/resources/providing-resources#OriginalFiles).
- While many Swift packages like Apple's [swift-algorithms](https://github.com/apple/swift-algorithms) compile cleanly for Android out of the box, others will require minor changes, and still others - particularly those that tie into the hardware or use one of Apple's many OS "Kits" - may never work on Android. Swift on Android is still in its infancy, and it will take time for developers to build and test their packages on this new-to-Swift platform. 

:::tip
Just because a package isn't yet available on Android doesn't mean you can't use it in your iOS build! To do so, append `.when(platforms: [.iOS])` to the dependency in `Package.swift`, conditionalize your call sites using `#if !os(Android)`, and either omit the functionality from your Android app or find an alternate Android solution.
:::

You can read much more about both the advantages and the limitations of native Swift on Android in our [full native Swift documentation](/docs/native/). For the most part, though, relax and enjoy coding with the full power and expressiveness of Swift!

### Testing

Due to limitations on build plugins, building the `travel-posters-model` package in Xcode does **not** perform an Android build. It only builds for iOS. Rather, there are two simple ways to build for Android: use `skip export` to create an Android library archive, which we explore [later](#exporting) in this article, or run the unit tests.

Skip configures every native module with an extra unit test that builds the module for Android, transpiles your `XCTests` to `JUnit` tests, and runs them. Thus you'll see two sets of results on every test run: first from `XCTest` and then from `JUnit` on Android. Frequently running your tests is a great way to catch both logic bugs and Android compilation errors early. Read more in the [native testing documentation](/docs/porting/#testing).

:::caution
You must perform your tests against macOS - not an iOS simulator - for Skip to be able to build and run for Android.
:::

## The iOS App

Because our model is a standard SwiftPM package, you incorporate and use it on iOS like any other package. We briefly outline the steps we took to create and configure our sample iOS app below. *Feel free to skip this section!*

1. Use Xcode to create a new Workspace in the `travelposters` directory alongside the `travel-posters-model` package.
1. Use Xcode to create a new App project in the `travelposters/iOS` directory. Close the project after creating it, because we're going to add it to our Workspace instead.

    <img alt="Creating a new app project in Xcode" src="https://assets.skip.tools/screens/skip-native-travelposters-iosapp.png" style="width: 100%; max-width: 600px;" />

1. Add the `travel-posters-model` package to your Workspace.
1. Add the `iOS/TravelPosters/TravelPosters.xcodeproj` app to your Workspace.
1. Add a package dependency from the app to the `travel-posters-model` local package.

    <img alt="Adding a package dependency in Xcode" src="https://assets.skip.tools/screens/skip-native-travelposters-iosmodel.png" style="width: 100%; max-width: 600px;" />

You can now use your Xcode Workspace to iterate on both the shared model package and your iOS app. Browse the complete iOS `TravelPosters` app [here](https://github.com/skiptools/skipapp-travelposters-native/tree/main/iOS/TravelPostersNative/TravelPostersNative).

## The Android App

We create our `TravelPosters` Android app using Android Studio, starting with the "Empty Activity" template. Tell Android Studio to place the app in our `travelposters/Android` folder.

<img alt="Creating a new app project in Android Studio" src="https://assets.skip.tools/screens/skip-native-travelposters-androidapp.png" style="width: 100%; max-width: 600px;" />

Next, make `Android/lib`, `Android/lib/debug`, and `Android/lib/release` directories. This is where we'll place our compiled Swift model and Skip libraries.

<img alt="Creating directories for our compiled Swift model" src="https://assets.skip.tools/screens/skip-native-travelposters-lib.png" style="width: 100%; max-width: 600px;" />

We must also configure our project to *use* the new `lib` directories. Edit the `app` module's `build.gradle.kts` file to add these and other necessary dependencies:

```kotlin
...
dependencies {
    ...

    implementation("org.jetbrains.kotlin:kotlin-reflect:2.1.0") // For reflection used by Skip
    implementation("io.coil-kt:coil-compose:2.7.0") // For AsyncImage used to display posters

    debugImplementation(fileTree(mapOf(
        "dir" to "../lib/debug",
        "include" to listOf("*.aar", "*.jar"),
        "exclude" to listOf<String>()
    )))
    releaseImplementation(fileTree(mapOf(
        "dir" to "../lib/release",
        "include" to listOf("*.aar", "*.jar"),
        "exclude" to listOf<String>()
    )))
}
```

To prevent errors in the deployed app, include the following in `build.gradle.kts` as well:

```kotlin
android {
    packaging {
        jniLibs {
            // doNotStrip is needed to prevent errors like: java.lang.UnsatisfiedLinkError: dlopen failed: empty/missing DT_HASH/DT_GNU_HASH in "/data/app/…/base.apk!/lib/arm64-v8a/libdispatch.so" (new hash type from the future?) (see: https://github.com/finagolfin/swift-android-sdk/issues/67)
            keepDebugSymbols.add("**/*.so")
        }
    }
}
```

Finally, our app needs internet access permissions to fetch weather and display remote images. Update its `AndroidManifest.xml` file:

```xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools">

    <uses-permission android:name="android.permission.INTERNET" />
    
    ...
</manifest>
```

Find the complete `TravelPosters` Android app [here](https://github.com/skiptools/skipapp-travelposters-native/tree/main/Android). The next sections detail how to export our shared model to the Android app and how to use it from our Kotlin code.

## Exporting the Shared Model to Android {#exporting}

We've configured our Android app to look in the `Android/lib/debug` and `Android/lib/release` folders for our model, but how do we populate these folders? 

The `skip export` command generates Android archives of a target Swift package and all of its dependencies. It has many options, which you can explore with `skip export help`. The following Terminal command builds our `travel-posters-model` and its dependencies for Android in debug mode and places the resulting `.aar` library archives in the `Android/lib/debug` directory:

```
skip export --project travel-posters-model -d Android/lib/debug/ --debug
```

To generate release archives instead:

```
skip export --project travel-posters-model -d Android/lib/release/ --release
```

:::note
Make sure to sync Android Studio whenever you update the libraries so that it picks up the latest changes.
:::

<img alt="Syncing Android Studio" src="https://assets.skip.tools/screens/skip-native-travelposters-syncstudio.png" style="width: 100%; max-width: 600px;" />

### Automation

There are many ways to automate this process, from simple scripting to git submodules to publishing the Android `travel-posters-model` output to a local Maven repository. Use whatever system fits your team's workflow best.

For example, to re-build and re-launch the app after making changes to the Swift code, you might run:

```console
skip export --project travel-posters-model -d Android/lib/debug/ --debug
gradle -p Android installDebug
adb shell am start -a android.intent.action.MAIN -c android.intent.category.LAUNCHER -n tools.skip.travelposters/tools.skip.travelposters.MainActivity
```

## Using the Shared Model on Android

Now that we've set up the Android app to depend on our shared Swift model, what is it like to actually *use* the model in Kotlin and Compose code? The answer is that - thanks to SkipFuse [bridging](/docs/modes/#bridging) - it's surprisingly natural!

Before we dive into using our model, though, we have to make a single call in our Android app's main `Activity` to initialize integration. Skip has extended `Foundation.ProcessInfo` for this purpose:

```kotlin
// MainActivity.kt
...

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        skip.foundation.ProcessInfo.launch(context = this) // <-- INSERT

        enableEdgeToEdge(statusBarStyle = SystemBarStyle.dark(Color.TRANSPARENT))
        setContent {
            ...
        }
    }

    ...
}
```

No additional changes to Android's normal startup code path are needed. 

This article is not a tutorial on using Jetpack Compose. Rather, we will focus on the places where our Android UI interacts with Swift, starting with the `CityList` function for displaying the scrolling list of posters:

```kotlin
...
import travel.posters.model.CityManager // <-- 1

@Composable
fun CityList(...) {
    val cityManager = CityManager.shared // <-- 2
    LazyVerticalGrid(...) {
        for (city in cityManager.allCities) { // <-- 3
            item {
                CityPoster(city, isFavorite = { cityManager.favoriteIDs.contains(city.id) }, setFavorite = { isFavorite ->
                    // 4
                    val favoriteIDs = cityManager.favoriteIDs.toMutableList()
                    if (isFavorite && !favoriteIDs.contains(city.id)) {
                        favoriteIDs.add(city.id)
                        cityManager.favoriteIDs = favoriteIDs
                    } else if (!isFavorite) {
                        favoriteIDs.remove(city.id)
                        cityManager.favoriteIDs = favoriteIDs
                    }
                })
            }
        }
    }
}
```

We've annotated the code above with four numbered comments. Let's explain each:

1. Our `TravelPostersModel` module is exposed to Kotlin in the `travel.posters.model` package. Skip simply divides your CamelCase Swift module names into "."-separated Kotlin package names. Single-word packages are reserved in Kotlin, so if your module name consists of a single word, Skip appends ".module". For example, module `Util` turns into Kotlin package `util.module`.
2. Your Swift types and API have equivalent names and signatures in Kotlin.
3. The Swift `CityManager.allCities` property of type `[City]` bridges to a Kotlin `kotlin.collections.List<City>`. Consult the [bridging reference](/docs/bridging/) to learn more about specific type mappings.
4. Here we're performing standard Compose state hoisting to manage the favorites list. Notice that we simply update our model - we do not explicitly trigger a change to the UI. Like SwiftUI, Compose automatically reacts to change in observed state, and SkipFuse ensures that our `@Observable CityManager` is fully and transparently integrated in Compose state tracking.

Each item in the city list is a `CityPoster`. Let's examine that function as well:

```kotlin
...
import travel.posters.model.City
import travel.posters.model.Weather

@Composable
fun CityPoster(city: City, isFavorite: () -> Boolean, setFavorite: (Boolean) -> Unit) {
    Box {
        val url = city.imageURL // <-- 1
        AsyncImage(...)
        ...
        Column(...) {
            Row(...) {
                ...
                Icon(imageVector = Icons.Filled.Star,
                    modifier = Modifier.clickable {
                        setFavorite(!isFavoriteState.value)
                    }
                )
                ...
                Text(text = city.name, ...)
                ...
                Box {
                    ...
                    LaunchedEffect(city.id, degrees) {
                        try { // <-- 2
                            val c = Weather.fetch( // <-- 3
                                latitude = city.latitude,
                                longitude = city.longitude
                            ).conditions.temperature 
                            ...
                        } catch (exception: Exception) {
                            Log.e("TravelPosters", "Error fetching weather: $exception")
                        }
                    }
                    ...
                }
            }
        }
    }
}

```

Once again, we've added numbered comments to points of interest in the code above:

1. In addition to bridging your own types as well as built-in types like numbers, strings, arrays, and dictionaries, SkipFuse translates common Foundation types like `Data`, `Date`, `URL`, and `UUID` to their Kotlin equivalents. In this case the `City.imageURL` property of type `Foundation.URL` maps to a `java.net.URI`. Again, see the [bridging reference](/docs/bridging/) for details.
2. Our `Weather.fetch` Swift function is marked `throws`. If the native call produces an error, the bridged Kotlin call with throw a standard Kotlin exception.
3. `Weather.fetch` is an `async` Swift function. Skip therefore generates a Kotlin `suspend` function and integrates the call with Kotlin coroutines. Hence the use of a `LaunchedEffect` in our Compose code.

As you can see, you invoke your Swift APIs naturally in Kotlin - almost exactly as if they were written in Kotlin themselves! Swift custom types, built-in types, and common Foundation types all translate to Kotlin/Java equivalents, thrown errors cause Kotlin exceptions, async Swift functions use Kotlin coroutines, etc. The goal is that using a module written in Swift should be almost indistinguishable from using a package written in Kotlin.

:::note
Browse the complete Android Compose code [on GitHub](https://github.com/skiptools/skipapp-travelposters-native/tree/main/Android/app/src/main/java/tools/skip/travelposters).
:::

## Next Steps

If you haven't already, check out [Part 1](/blog/native-swift-on-android-1/) and especially [Part 2](/blog/skip-native-tech-preview/) of this series.

If you'd like to learn much more about SkipFuse, bridging, and native Swift on Android, consider reading our [Native Swift Tech Preview](/docs/native/) documentation. 

You may also be interested in the nascent [swift-java](https://github.com/swiftlang/swift-java) project, which is designed to facilitate communication between server-side Swift and Java libraries. While that is a very different environment than Android apps interacting with modern Kotlin APIs, they do overlap, and you might find `swift-java's` bridging approach useful. We anticipate that as it matures, this bridge and Skip's native bridging will begin to align more closely in their techniques and implementation details.

## Native Swift on Android Series {#next}

Additional posts in the native Swift on Android series:

- [Part 1: A native Swift toolchain for Android](/blog/native-swift-on-android-1/)
- [Part 2: Your first native Swift Android app](/blog/skip-native-tech-preview/)
- Part 3: Using a shared native Swift model to power separate SwiftUI iOS and Jetpack Compose Android apps
- Coming soon: Bridging Kotlin and Java API for consumption by native Swift
- Coming soon: Incorporating native Swift, C, and C++ dependencies into your cross-platform Swift apps

## Conclusion

Many cross-platform solutions allow you to share code, but they typically come with serious downsides:

- Performance issues from the use of interpreters and/or complex runtimes (Javascript)
- High memory watermarks and unpredictable hitches caused by garbage collection (Javascript, Kotlin)
- Lack of transparent integration with SwiftUI and/or Compose state tracking (C/C++)
- Portability and memory safety concerns (C/C++)

Swift exhibits none of these problems. Its safety, efficiency, and expressiveness make it an ideal choice for cross-platform development. Swift is already a first-class citizen on Apple platforms, and [Skip's native tooling and technology](/docs/native/) ensures seamless integration with Android and Compose as well. 

Whether you're creating a single dual-platform app like we did in [Part 1](/blog/skip-native-tech-preview/), separate iOS and Android apps with a shared model layer and bespoke interfaces like we did in this article, or anything in between, sharing code with Swift can save you significant time and effort when writing your app. More important than the up front savings, though, is the savings over time. A shared Swift codebase will eliminate endless hours of repeated bug fixes, enhancements, team coordination, and general maintenance over the life of your software.
