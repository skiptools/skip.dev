---
title: SkipMotion
description: Documentation for SkipMotion fetched from GitHub.
note: This documentation section is derived from the GitHub README.md source using the scripts/sync-modules.mjs script. Do not make edits to the file here, change it there.
editUrl: https://github.com/skiptools/skip-motion/edit/main/README.md
---

:::note[Source Repository]{icon="github"}
This framework is available at [github.com/skiptools/skip-motion](https://github.com/skiptools/skip-motion) and can be checked out and improved locally as described in the [Contribution Guide](/docs/contributing/#local-libraries).
:::
# SkipMotion

This is a [Skip](https://skip.dev) Swift/Kotlin library project that 
provides the ability to play Lottie animations in dual-platform Skip apps
for iOS and Android.

<video id="intro_video" style="width: 100%" controls autoplay>
  <source style="width: 100;" src="https://assets.skip.dev/videos/SkipMotionExample.mov" type="video/mp4">
  Your browser does not support the video tag.
</video>

On the Kotlin side, SkipMotion uses the [lottie-ios](https://github.com/airbnb/lottie-ios)
package, and on Android it uses the [lottie-android](https://github.com/airbnb/lottie-android).

Lottie is a mobile library for Android and iOS that parses [Adobe After Effects](http://www.adobe.com/products/aftereffects.html) animations exported as json with [Bodymovin](https://github.com/airbnb/lottie-web) and renders them natively, enabling
 designers and developers to create and ship beautiful and seamless animations in their apps.

Example:


```swift
import Foundation
import SwiftUI
import SkipMotion

struct ContentView: View {
    var body: some View {
        VStack(alignment: .center) {
            Text("Skip Motion Animation")
                .font(.largeTitle)
            MotionView(lottie: lottieData)
        }
    }
}

let lottieData = """
{"mn":"ADBE Vector Shape - Group"}
""".data(using: String.Encoding.utf8)!
```

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
        .package(url: "https://source.skip.dev/skip-motion.git", "0.0.0"..<"2.0.0"),
    ],
    targets: [
        .target(name: "MyTarget", dependencies: [
            .product(name: "SkipMotion", package: "skip-motion")
        ])
    ]
)
```

## Status

SkipMotion is in a very early stage, and lack any playback
controls or other customization of the animations.

You are encouraged to contribute to the project or
file an [issue](https://source.skip.dev/skip-motion/issues)
with needs and requests.

## Size

Adding `SkipMotion` as a dependency will add around 1MB to the
size of the release `.ipa` and `.apk` artifacts for your project.

## Example

See the [LottieDemo](https://source.skip.dev/skipapp-lottiedemo/releases)
project for an example of using `SkipMotion` in a Skip App project.

## Building

This project is a Swift Package Manager module that uses the
[Skip](https://skip.dev) plugin to transpile Swift into Kotlin.

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

