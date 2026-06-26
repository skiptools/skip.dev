---
title: Testing
permalink: /docs/testing/
---

Skip builds and runs your Swift tests on both platforms from a single command, letting you confirm that your code behaves the same on Apple platforms and on Android. The primary command is **`skip test`**, and it works the same way for both [Skip Lite](/docs/modes/#lite) (Swift transpiled to Kotlin) and [Skip Fuse](/docs/modes/#fuse) (Swift compiled natively for Android) modules.

<div class="diagram-vector">

![Testing Diagram](https://assets.skip.dev/diagrams/skip-diagrams-testing.svg)

</div>

## `skip test`

From your package directory, run:

```shell
skip test
```

Skip runs your test suite on both sides — natively on the host (typically your Mac, shown as **Darwin (macOS)**; Linux is also supported, e.g. in CI) and on Android — and prints a side-by-side parity report:

```
| Test       | Case         | Darwin (macOS) | Android (Robolectric) |
| ---------- | ------------ | -------------- | --------------------- |
| MathTests  | testAdd()    | PASS (0.00s)   | PASS (0.01s)          |
| MathTests  | testDivide() | PASS (0.01s)   | PASS (0.02s)          |
|            |              | 100%           | 100%                  |
```

Each test is matched across platforms and reported with its result and run time, so a portability bug — a test that passes on Darwin but fails on Android — stands out immediately.

The same `skip test` command works for every module mode:

- **Skip Lite** modules have their XCTest and Swift Testing cases transpiled into Kotlin/JUnit and run on the JVM.
- **Skip Fuse** modules — including `mode: native` modules — have their test cases compiled natively for Android and run directly, driven through the same Gradle test pipeline.

:::note
**Native module testing now works through `skip test`.** Testing a natively-compiled Skip Fuse module used to require the separate `skip android test` command. That is no longer necessary for most projects: `skip test` builds and runs native test targets on Android for you. The older command is described under [Direct on-device testing with `skip android test`](#direct-on-device-testing-with-skip-android-test) at the end of this page.
:::

In Xcode, the same tests run from the standard test action (which invokes `swift test` under the hood), so the results appear as ordinary XCTest outcomes in the test navigator and in CI.

### Where the Android tests run

By default, the Android side runs locally on the host with [Robolectric](https://developer.android.com/training/testing/local-tests/robolectric), which simulates an Android environment on the host JVM. No emulator or device is involved, which makes it the fastest option and the right default for everyday development. Robolectric provides many framework APIs (`Context`, `SharedPreferences`, resources, and so on) — enough for the large majority of unit tests.

For higher fidelity, run against a connected emulator or device by setting `ANDROID_SERIAL`:

```shell
ANDROID_SERIAL=emulator-5554 skip test
```

Skip then runs the tests as [instrumented tests](https://developer.android.com/training/testing/instrumented-tests) on a real Android runtime, with the full framework available. This is slower than Robolectric but is the most accurate representation of production behavior. Use `adb devices` to list device IDs, and you can set `ANDROID_SERIAL` in your Xcode scheme's Run action.

![Configuring running tests on emulator in Xcode](https://assets.skip.dev/screens/xcode-testing-scheme-emulator.png)

Robolectric is close to Android but not identical. Notably, `#if os(Android)` is `false` under Robolectric because the code runs on the host JVM; Skip defines a `ROBOLECTRIC` symbol so you can take the Android path in every Android-like environment:

```swift
#if os(Android) || ROBOLECTRIC
// runs on a device and under Robolectric
#endif
```

### Test frameworks

Which test frameworks you can use depends on the module mode:

- **Skip Lite** modules support both **XCTest** and **Swift Testing** — both are transpiled to Kotlin/JUnit alongside the rest of your code.
- **Skip Fuse** native modules support **Swift Testing only** — they run the native Swift Testing runtime directly (via its `swt` entry point), and XCTest cases are not executed.

If your code is (or may become) a native Fuse module, write your tests with Swift Testing.

- **XCTest** — `XCTestCase` subclasses with `test`-prefixed methods; `XCTAssert*` functions map to the corresponding Android assertions. *(Skip Lite only.)*
- **Swift Testing** — `@Test` functions and `@Suite` types, with the `#expect` and `#require` macros. Freestanding `@Test` functions (not nested in a type) are wrapped automatically.

For Skip Lite modules, transpiled test cases are subject to the same rules as the rest of your Lite code, and a few Swift Testing features (parameterized tests, traits, and tags) are not yet transpiled. Skip Fuse native modules run the real Swift Testing runtime, so those constraints do not apply.

### The test harness

The Android side of the run is driven by a generated harness, `XCSkipTests.swift`. You normally never touch it — the Skip build plugin generates one for you during the build. If you need to customize it (for example, to change the Gradle task), add your own to your test target and the plugin will use it instead:

```swift
#if os(macOS) // Skip transpiled tests only run on macOS targets
import SkipTest

@available(macOS 13, *)
final class XCSkipTests: XCTestCase, XCGradleHarness {
    public func testSkipModule() async throws {
        try await runGradleTests()
    }
}
#endif
```

This harness is what connects Xcode and `swift test` to the Gradle pipeline: running it transpiles or compiles your tests for Android, runs them, and reports the results back as XCTest outcomes.

## Comparison

| | Robolectric (default) | Emulator / Device |
|---|---|---|
| **Command** | `skip test` | `ANDROID_SERIAL=… skip test` |
| **Runs on** | Host JVM | Connected Android emulator/device |
| **Android APIs** | Simulated via Robolectric | Full |
| **Speed** | Fastest | Slower |
| **Fidelity** | Good for unit tests | Highest |

Both Skip Lite and Skip Fuse modules use this same flow. For day-to-day work, Robolectric gives the tightest feedback loop; switch to an emulator or device when you need to verify behavior that depends on the real Android runtime.

For an example repository that runs Skip Fuse tests in GitHub CI against an Android emulator, see [skip-fuse-samples](https://github.com/skiptools/skip-fuse-samples).

## Non-Skip Packages

Testing of native Swift packages that compile for both iOS and Android and do not have a `skip.yml` (such as the thousands of third-party packages tracked by [swiftpackageindex.com](https://swiftpackageindex.com/search?query=platform%3Aios%2Candroid)'s Android compatibility testing) is discussed in the [Porting Guide](/docs/porting/#testing).

## Performance Testing

There is often a significant difference between Debug and Release build performance on Android devices. Always [run on a device](/docs/app-development/#running-on-device) **using a Release build** when testing real-world performance.

## Direct on-device testing with `skip android test`

`skip android test` cross-compiles a package's test target and runs it directly on a device or emulator without Gradle, in one of two modes:

- **Command-line mode** (default) — `skip android test` — cross-compiles the test target as an executable, uses `adb push` to copy the binary, its libraries, and any `.resources` directories to the device, then runs it via `adb shell`, like a command-line program on Linux. Because the `.resources` sit beside the binary, `Bundle.module` resource lookup works — but there is no JVM or JNI, so Android framework APIs are unavailable.
- **APK mode** — `skip android test --apk` — packages the tests into a real Android app (assembled with `aapt2`, `zipalign`, and `apksigner`), installs it with `adb install`, and runs it as an Android activity. This provides a full JNI environment and access to the entire Android framework, but resources loaded from the APK's native library directory are not resolved. Pass `--event-stream-output-path <file>` to capture the raw test event JSON locally.
