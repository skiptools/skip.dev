---
title: Project Types
permalink: /docs/project-types/
---

The Skip [Getting Started](/docs/gettingstarted/) guide demonstrates using `skip create` to generate a basic app project interactively, but there are a variety of additional project types. This document discussed the various different project types that can be created and built with Skip.

## Creating an App with `skip init` {#app_development}

The `skip init` command is an alternative to the interactive `skip create` command, which facilitates the initialization of an app with a single, non-interactive command. Run `skip init --help` or see the the [command line reference](/docs/skip-cli/#init) for a complete listing of `skip init` options.

 <!-- The most common structure is as a single, dual-platform app project. Creating a dual-platform app project does not prevent you from [customizing](/docs/platformcustomization/) your app for Android, even to the point of e.g. writing your entire Android UI in Kotlin and Compose. But it generally assumes that you'll manage the iOS and Android versions of your app through Xcode as a single logical application. -->

<!-- The other common structure is to create separate iOS and Android apps that use a set of dual-platform frameworks for shared functionality. Using this option, it is up to you to create and manage the separate iOS and Android applications using Xcode and Android Studio (or your Android IDE of choice), respectively.  -->

### Creating a Dual-Platform App

Create a new dual-platform app project with the command:

```console
skip init --native-app --appid=bundle.id project-name AppName
```

:::tip
Passing `--native-app` creates a [Skip Fuse](/docs/status/#skip_fuse) app, and `--transpiled-app` will create a [Skip Lite](/docs/status/#skip_fuse) app.
:::

:::note
Your `appid` must contain at least two words, and each word must be separated by a `.`. It is conventional to use reverse-DNS naming, such as `com.companyname.AppName`. Also make sure that your `project-name` and `AppName` are different. It is conventional to use a lowercase, hyphenated name for your project (which Skip uses to create your app's main SwiftPM package name), and UpperCamelCase for your app name.
:::

Pass the `--open-xcode` argument to immediately open the project in Xcode. For example:

```console
skip init --open-xcode --native-app --appid=bundle.id.HelloSkip hello-skip HelloSkip
```
{: id="skip-init-cmd"}

This will create a `hello-skip/` folder with a new SwiftPM package containing a single module named `HelloSkip`, along with folders named `Darwin` and `Android` and the shared `Skip.env` app configuration file. The `Darwin` folder will contain a `HelloSkip.xcodeproj` project with a `HelloSkip` target, which you can open in Xcode.

:::note
See the [command line reference](/docs/skip-cli/#init) for a complete listing of `skip init` options.
:::

### Creating a Multi-Module App

Skip is designed to accommodate and encourage using multi-module projects. You can create a modularized project by specifying additional module names to `skip init` at the end of the chain. For example: 

```console
skip init --native-app --appid=bundle.id.HelloSkip multi-project HelloSkip HelloModel HelloCore
```

This command will create a SwiftPM project with three modules: `HelloSkip`, `HelloModel`, and `HelloCore`. The heuristics of such module creation is that the modules will all be dependent on their subsequent peer module, with the first module (`HelloSkip`) having an initial dependency on `SkipFuseUI` and the second module depending on `SkipFuse` and `SkipModel`. The `Package.swift` file can be manually edited to shuffle around dependencies, or to add new dependencies on additional frameworks.

### Creating Separate iOS and Android Apps {#separate-apps}

You might choose to share functionality using [dual-platform frameworks](#framework_development), but create separate iOS and Android apps. Some development teams, for example, would like to share common model and business logic layers, but write the UI separately for each platform.

The [Travel Posters](/docs/samples/skipapp-travelposters-native/) sample app provides an example of this pattern. You can read more about it in this [blog post](/blog/shared-swift-model/). It has the following top-level entries:

- `travel-posters-model`: This SwiftPM package builds a [dual-platform framework](#framework_development) containing a common model layer for the iOS and Android apps. Skip ensures that the `@Observable` types you write in Swift can power not only a SwiftUI interface, but a Compose interface as well. See the Development [documentation](/docs/app-development/#observables) for details.
- `iOS`: Directory containing the TravelPosters iOS app and Xcode project, which has `travel-posters-model` as a package dependency.
- `Android`: Directory containing the Android version of the app. The `Android/lib` directory contains exported archives of `travel-posters-model` and the various Skip frameworks that it depends on.
- `TravelPostersNative.xcworkspace`: A workspace that includes both the iOS app and the `travel-posters-model` package.

Use `TravelPostersNative.xcworkspace` to iterate on the iOS app and/or shared model layer. To donate the latest `travel-posters-model` code to the Android app:

```console
skip export --project travel-posters-model -d Android/lib/debug/ --debug
skip export --project travel-posters-model -d Android/lib/release/ --release
```

There are many ways to automate this process, from simple scripting to git submodules to publishing Skip’s generated Android `travel-posters-model` output to a local Maven repository. Use whatever system fits your team's workflow best.

:::note
See the [Deployment](/docs/deployment/#export) chapter for more information on `skip export`.
:::

Additional notes:

- You may need to “Sync Project with Gradle Files” in Android Studio after updating the exported libraries.
- Using an exported library function which has transitive dependencies on additional Android libraries can cause a runtime error. You must ensure that all transitive dependencies are in your own app's `build.gradle.kts`.

---

## Creating a Dual-Platform Framework {#framework_development}

[SkipFuse](/docs/status/#skip_fuse) apps can depend on pure SwiftPM packages as well as pure Kotlin/Java Android libraries. See the chapter covering [dependencies](/docs/dependencies) for details. This section describes how to create a Swift framework whose API can be used from both Swift and Kotlin. The most common use cases are powering [SkipLite](/docs/status/#skip_fuse) transpiled apps or [separate iOS and Android](#separate-apps) apps.

Dual-platform Skip frameworks are pure SwiftPM packages that encapsulate common functionality. Frameworks are simpler than app projects, as they do not need `Darwin/` and `Android/` folders.

<img alt="Framework Development Screenshot" src="https://assets.skip.dev/framework-dev/framework-skip-init.png" style="width: 100%; max-width: 750px;" />

A new framework project can be generated with:

```console
skip init --native-model lib-name ModuleName
```

This will create a new `lib-name` folder containing a `Package.swift` with targets of `ModuleName` and `ModuleNameTests`.

:::tip
Passing `--native-model` creates a [Skip Fuse](/docs/status/#skip_fuse) compiled Swift package. Omit this flag to create a [Skip Lite](/docs/status/#skip_fuse) transpiled package instead. Skip frameworks like [SkipLib](/docs/modules/skip-lib) and [SkipFoundation](/docs/modules/skip-foundation) are examples of transpiled packages, and they are rich sources of examples of various strategies for providing dual-platform functionality.
:::

The generated package can be opened in Xcode, which you can use to build and run the unit tests. Or use `swift build` and `swift test` from the Terminal for headless testing as part of a continuous integration process.

:::note
Due to limitations on Xcode plugins, building your framework target **only** builds the iOS version. To build the Android version, you must run your unit tests. The Android build occurs as part of the testing process.
:::

The `--native-model` option we passed to `skip init` will configure Skip to automatically bridge our model's public API from compiled Swift to Android's [ART](https://source.android.com/docs/core/runtime) Java runtime. This is done through the [`skip.yml`](/docs/modes/#configuration) configuration file included in every Skip module. See the documentation on [bridging](/docs/modes/#bridging) and [`skip.yml`](/docs/modes/#configuration) for details.

### Skip Framework Structure {#framework_structure}

The structure of a Skip framework is exactly the same as any other SwiftPM package:

```console
lib-name
├── Package.resolved
├── Package.swift
├── README.md
├── Sources
│   └── ModuleName
│       ├── ModuleName.swift
│       ├── Resources
│       │   └── Localizable.xcstrings
│       └── Skip
│           └── skip.yml
└── Tests
    └── ModuleNameTests
        ├── ModuleNameTests.swift
        ├── Resources
        │   └── TestData.json
        ├── Skip
        │   └── skip.yml
        └── XCSkipTests.swift

```

Skip frameworks use a standard `Package.swift` file, with the exception of added dependencies on Skip libraries and use of the `skipstone` plugin for transpilation:

```swift
// swift-tools-version: 5.8
import PackageDescription

let package = Package(
    name: "lib-name",
    defaultLocalization: "en",
    platforms: [.iOS(.v16), .macOS(.v13), .tvOS(.v16), .watchOS(.v9), .macCatalyst(.v16)],
    products: [
        .library(name: "ModuleName", targets: ["ModuleName"]),
    ],
    dependencies: [
        .package(url: "https://source.skip.tools/skip.git", from: "1.5.0"),
        .package(url: "https://source.skip.tools/skip-fuse.git", from: "1.0.0"),
        .package(url: "https://source.skip.tools/skip-model.git", from: "1.0.0"),
    ],
    targets: [
        .target(name: "ModuleName", , dependencies: [
            .product(name: "SkipFuse", package: "skip-fuse")
            .product(name: "SkipModel", package: "skip-model")
        ], plugins: [
            .plugin(name: "skipstone", package: "skip")
        ]),
        .testTarget(name: "ModuleNameTests", dependencies: ["ModuleName"], plugins: [.plugin(name: "skipstone", package: "skip")]),
    ]
)
```

This configuration includes the dependencies you need to write common model code, including `@Observables` that will work with both SwiftUI and Compose user interfaces. You are free to edit `Package.swift` for your particular needs.

---

## Migrating an Existing App to Skip {#existing_development}

Migrating an existing app to Skip is not trivial. Most apps contain many iOS-only dependencies that make an Android port challenging.

Additionally, when you use `skip create` or `skip init` to create a [new Skip app](#app_development), it handles all the messy details involved in making an app that can build for both iOS and Android. The process is complex enough that we do not recommend trying to migrate an existing Xcode project. Instead, choose one of two options to create an Android version of your existing app:

1. Use `skip create` or `skip init` to create a new Skip app, then add your existing app's dependencies and code.
1. Keep your existing Xcode app, and create a separate Android app using Android Studio or your IDE of choice. Manage the apps separately, but share code by creating [dual-platform frameworks](#framework_development).

Regardless of which option you choose, your first steps are the same:

1. Modularize your app into Swift Package Manager packages, if it isn't already.
1. Starting with your "base" module and working your way up the stack, attempt to get each module building for Android.

We recommend using [Skip Fuse](/docs/status/#skip_fuse) where possible, as it offers greater compatibility with existing Swift code and dependencies.

Porting an app to an entirely new platform isn't easy, even with Skip. Remember that [we're here to help](/docs/help/).

