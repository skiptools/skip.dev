---
layout: docs
title: Testing
permalink: /docs/testing/
---

## Unit Testing

![Testing Diagram](https://assets.skip.dev/diagrams/skip-diagrams-testing.svg)
{: .diagram-vector }

<!--
The [SkipUnit module](/docs/modules/skip-unit/) contains Skip's implementation of the iOS `XCTest` API for Android. Read its documentation to learn how to run **parity tests** across both iOS and Android to ensure that your logic is behaving identically on both platforms.
-->

Skip always transpiles your XCTest unit tests into JUnit tests for Android. This means that you can only perform Android tests on compiled Swift that has been [bridged](/docs/modes/#bridging) to Kotlin/Java. Unit tests involving unbridged types should be excluded from Android testing.

```swift
final class MyNativeSwiftTests: XCTestCase {
    ...
   
    #if !os(Android)
    func testSomeUnbridgedSwift() {
        ...
    }
    #endif 
   
    ...
}
```

:::note
We will offer Android unit testing of unbridged native code in a future release. If you are using [Skip Lite](/docs/status/#skip_fuse), *all* of your code is transpiled, so you do not have to limit your testing to bridged types.
:::

### Robolectric Testing

The [SkipUnit module](/docs/modules/skip-unit/) documentation describes  the ability to unit test your code in an Android environment running on your Mac, which can be faster than using the Android emulator. If you choose to test on your Mac, Skip uses a simulated Android environment called [Robolectric](https://robolectric.org). 

:::caution
`#if os(Android)` checks will evaluate to `false` under Robolectric, even though you should generally be exercising the Android code path. So Skip also defines the `ROBOLECTRIC` symbol in your Robolectric testing builds. If you want to be sure that your compiled Swift takes the Android code path whether running on device, emulator, *or in Robolectric*, use `#if os(Android) || ROBOLECTRIC`.
:::

### Android Emulator/Device Testing

To run your test cases on an Android device or emulator, you can specify the `ANDROID_SERIAL` environment variable in the Xcode scheme’s Run action arguments for the target. The default emulator is usually "emulator-5554", and to see the list of identifiers for any connected devices, run the command `adb devices`.

![Configuring running tests on emulator in Xcode](https://assets.skip.dev/screens/xcode-testing-scheme-emulator.png){: style="width: 80%; text-align: center; margin: auto;"}

Running tests against an emulator or device is slower than running against Robolectric, but the results will be much more representative of how the code will behave in the real world. This is true for both purely transpiled projects, as well as a natively-compiled SkipFuse project.

For an example of a repository that utilizes SkipFuse bridge testing, along with GitHub CI actions that automatically perform the testing against an Android emulator, see [https://github.com/skiptools/skip-fuse-samples](https://github.com/skiptools/skip-fuse-samples).

## Non-Skip Packages

Testing of native Swift packages that compile for both iOS and Android and do not have a `skip.yml` - such as the thousands of third-party packages tracked by [swiftpackageindex.com](https://swiftpackageindex.com/search?query=platform%3Aios%2Candroid)'s Android compatibility testing - is discussed in the [Porting Guide](/docs/porting/#testing).

## Performance Testing

There is often a significant difference between Debug and Release build performance on Android devices. Always [run on a device](/docs/app-development/#running-on-device) **using a Release build** when testing real-world performance.

