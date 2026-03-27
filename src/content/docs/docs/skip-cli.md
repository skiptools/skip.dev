---
title: Skip CLI Reference
permalink: /docs/skip-cli/
---

The Skip command-line interface (CLI) is a tool that can be
run from the terminal on macOS, Linux, or Windows. It provides an interface for creating new
Skip projects (both framework and app projects), building and testing for Android,
managing the Swift Android SDK and emulators, and exporting built artifacts for publication.

## Installing

The `skip` CLI is installed using [Homebrew](https://brew.sh). Skip is distributed as a binary Homebrew "Cask" for macOS, Linux, and Windows (with [WSL 2](https://learn.microsoft.com/en-us/windows/wsl/about)). For complete details, see the [Getting Started Guide](/docs/gettingstarted/).

Once Homebrew is set up, Skip can be installed (and updated) by running the Terminal command:

```shell
brew install skiptools/skip/skip
```

This will download and install the `skip` tool itself, as well as the Android SDK dependencies that are necessary for building and testing the Kotlin/Android side of your apps.

To upgrade to the latest version:

```shell
skip upgrade
```

:::note
The `skip` tool installed via Homebrew is the exact same binary that is used by the Skip Xcode plugin, but they are installed in separate locations and updated through different mechanisms (the Homebrew [Cask](https://source.skip.dev/homebrew-skip/blob/main/Casks/skip.rb) for the CLI and the [skip/Package.swift](https://source.skip.dev/skip/blob/main/Package.swift) for the SwiftPM plugin).
:::

:::caution
Linux and Windows support is preliminary and currently doesn't support many features, but it can be used for creating, building, testing, and exporting framework projects as well as running the `skip android` frontend for the Swift SDK for Android. For creating and building full app projects, macOS is required.
:::

---

## Command Overview {#intro}

```
USAGE: skip <subcommand>

SUBCOMMANDS:
  version                 Print the skip version
  doctor                  Evaluate and diagnose Skip development environment
  checkup                 Run tests to ensure Skip is in working order
  upgrade                 Upgrade to the latest Skip version
  create                  Create a new Skip project interactively
  init                    Initialize a new Skip project
  verify                  Verify Skip project
  icon                    Create and manage app icons
  android                 Build, run, and test Swift packages for Android
  export                  Export the Gradle project and built artifacts
  devices                 List connected devices and emulators/simulators
  test                    Run parity tests and generate reports
```

Run `skip help <subcommand>` for detailed help on any command, or `skip <subcommand> --help` for the full list of flags.

### Common Flags

Most commands share a set of common option groups:

**Output Options** control how results are displayed:

| Flag | Description |
|------|-------------|
| `-v, --verbose` | Display verbose messages |
| `-q, --quiet` | Suppress output |
| `-J, --json` | Emit output as formatted JSON |
| `-j, --json-compact` | Emit output as compact JSON |
| `-M, --message-plain` | Show messages as plain text |
| `--plain/--no-plain` | Disable colors and progress animations |
| `--log-file <path>` | Write log output to a file |

**Tool Options** override the default paths for external tools:

| Flag | Description |
|------|-------------|
| `--swift <path>` | Swift command path |
| `--gradle <path>` | Gradle command path |
| `--adb <path>` | ADB command path |
| `--emulator <path>` | Android emulator path |
| `--sdkmanager <path>` | Android SDK Manager path |
| `--avdmanager <path>` | Android AVD Manager path |
| `--java-home <path>` | Path to JAVA_HOME |

---

## Project Commands

### skip create {#create}

Create a new Skip project through interactive prompts. This will ask you to choose between a native (Fuse) or transpiled (Lite) project, app or library, and walk you through configuration options.

```shell
skip create
```

For non-interactive project creation, use `skip init` instead.

### skip init {#init}

Initialize a new Skip project with a single command. This is the non-interactive alternative to `skip create`.

```shell
# Create a native (Fuse) app project
skip init --native-app --appid=com.example.myapp my-app MyApp

# Create a transpiled (Lite) app project
skip init --transpiled-app --appid=com.example.myapp my-app MyApp

# Create a native library project
skip init --native-model my-lib MyModule

# Create a transpiled library project
skip init --transpiled-model my-lib MyModule

# Create an app with multiple modules
skip init --native-app --appid=com.example.myapp my-app MyApp DataModel
```

Key flags:

| Flag | Description |
|------|-------------|
| `--native-app` | Create a Skip Fuse (native compiled) app |
| `--transpiled-app` | Create a Skip Lite (transpiled) app |
| `--native-model` | Create a native library module |
| `--transpiled-model` | Create a transpiled library module |
| `--appid <bundleID>` | Bundle identifier for app projects |
| `--open-xcode` | Open the project in Xcode after creation |
| `--icon <path>` | Path to an icon image (SVG, PDF, or PNG) |
| `-c, --configuration <c>` | Build configuration: `debug` or `release` |

:::tip
After creating a project, run it in Xcode against an iPhone simulator destination. The Skip build plugin will automatically build the Android side and launch it on a running emulator simultaneously.
:::

### skip verify {#verify}

Validate the structure and configuration of a Skip project. Checks Package.swift layout, skip.yml files, and module dependencies.

```shell
# Verify the current project
skip verify

# Verify a specific project
skip verify --project path/to/project

# Attempt to automatically fix issues
skip verify --fix
```

### skip icon {#icon}

Create and manage app icons for both iOS and Android. Generates all required sizes from a single input image.

```shell
# Resize a PNG for all required icon sizes
skip icon app_icon.png

# Generate icons with a colored background and SVG overlay
skip icon --background #5C6BC0-#3B3F54 symbol.svg

# Preview the generated icons
skip icon --open-preview --random-icon --random-background
```

Key flags:

| Flag | Description |
|------|-------------|
| `--background <color>` | Background color or gradient (e.g. `skyblue` or `#3E8E41-#2F4F4F`) |
| `--inset <decimal>` | Amount of inset around the image |
| `--shadow <decimal>` | Shadow radius around the icon |
| `--android <path>` | Separate icon file for Android |
| `--darwin <path>` | Separate icon file for iOS/macOS |

### skip export {#export}

Build and export Skip modules as distributable artifacts. Libraries are exported as `.aar` files and apps as `.apk`/`.aab` files.

```shell
# Export debug archives
skip export --debug

# Export a specific module
skip export --module ModuleName

# Export to a custom output folder
skip export --dir output/
```

---

## Environment Commands

### skip doctor {#doctor}

Check system configuration and prerequisites for Skip development. Validates Xcode, Android Studio, JDK, Gradle, and SDK versions.

```shell
# Run basic environment checks
skip doctor

# Include checks for native Swift-on-Android support
skip doctor --native
```

This is a subset of `skip checkup` (which also creates and builds a sample project).

### skip checkup {#checkup}

Perform a full system evaluation by running all the checks from `skip doctor` and then creating and building a sample Skip project to verify everything works end to end.

```shell
# Full system checkup
skip checkup

# Include native app support checks
skip checkup --native
```

:::tip
Run `skip checkup` after installing Skip or upgrading your development tools. It will surface configuration issues before they block your actual project builds.
:::

### skip upgrade {#upgrade}

Check for and install the latest version of the Skip toolchain.

```shell
skip upgrade
```

### skip devices {#devices}

List all connected Android emulators/devices (via `adb`) and iOS simulators/devices (via `simctl` and `devicectl`). Useful for verifying which targets are available before running or testing.

```shell
skip devices
```

Output includes device IDs, platform, type, and model information in JSON format.

---

## Test Commands

### skip test {#test}

Build and run Swift (XCTest) and transpiled Kotlin (JUnit) tests, then produce a side-by-side parity report. By default, Kotlin tests run locally via Robolectric. Use `--android-serial` to run instrumented tests on a connected device or emulator.

```shell
# Run parity tests locally (Robolectric)
skip test

# Run tests for a specific project
skip test --project path/to/project

# Run instrumented tests on a connected device
skip test --android-serial auto

# Target a specific emulator
skip test --android-serial emulator-5554
```

Key flags:

| Flag | Description |
|------|-------------|
| `--project <dir>` | Project folder (default: `.`) |
| `--test/--no-test` | Run tests (default: `--test`) |
| `--android-serial <serial>` | Target device for instrumented tests (omit for Robolectric) |
| `--xunit <path>` | Path to XUnit test report |
| `--junit <path>` | Path to JUnit test report folder |
| `-c, --configuration <c>` | Build configuration (default: `debug`) |

:::note
When `--android-serial` is omitted, Kotlin tests run locally on the JVM using Robolectric, which is faster and does not require a running emulator. Pass `--android-serial auto` to run on a connected device, or provide a specific serial like `emulator-5554`.
:::

---

## Android Commands {#android}

The `skip android` command group provides tools for cross-compiling Swift packages with the Swift Android SDK, running executables and tests on Android devices or emulators, and managing the SDK, toolchain, and emulator images.

```
USAGE: skip android <subcommand>

SUBCOMMANDS:
  build                   Build the native project for Android
  run                     Run the executable target on an Android device or emulator
  test                    Test the native project on an Android device or emulator
  home                    Install and manage the Android SDK in ANDROID_HOME
  sdk                     Manage installation of Swift Android SDK
  emulator                Manage Android emulators
  toolchain               Manage installation of Swift Android Host Toolchain
```

### skip android build {#android-build}

Cross-compile a Swift package for Android using the installed Swift Android SDK.

```shell
# Build for Android (debug)
skip android build

# Build for release
skip android build --configuration release

# Build and archive output to a folder
skip android build --dir output/

# Build for a specific architecture
skip android build --arch aarch64
```

Additional `swift build` flags can be passed as trailing arguments.

### skip android run {#android-run}

Build a Swift package for Android, push the executable and shared library dependencies to a connected device or emulator, and run it.

```shell
# Run the default executable
skip android run

# Run a specific executable with arguments
skip android run MyExecutable -- --flag value

# Target a specific emulator
skip android run --android-serial emulator-5554
```

Key flags:

| Flag | Description |
|------|-------------|
| `--android-serial <serial>` | Target device (default: `auto`) |
| `--cleanup/--no-cleanup` | Clean up temp files after running (default: `--cleanup`) |
| `--remote-folder <path>` | Custom staging folder on device |
| `--env <key=value>` | Environment variables for remote execution |
| `--copy <path>` | Additional files to push to the device |

### skip android test {#android-test}

Build Swift tests for Android, push them to a device or emulator, and execute them. By default, tests run as a native executable via `adb shell`. With `--apk`, tests are packaged as an Android APK and run via instrumentation.

```shell
# Run tests on a connected device
skip android test

# Run tests as an APK (instrumented tests)
skip android test --apk

# Target a specific emulator
skip android test --android-serial emulator-5554

# Run only Swift Testing tests
skip android test --testing-library testing

# Run only XCTest tests
skip android test --testing-library xctest
```

Key flags:

| Flag | Description |
|------|-------------|
| `--android-serial <serial>` | Target device (default: `auto`) |
| `--android-connect-timeout <seconds>` | Wait for device boot before installing (default: `5`) |
| `--apk/--no-apk` | Package tests as an APK for instrumented testing |
| `--testing-library <lib>` | Testing library: `all`, `xctest`, or `testing` (default: `all`) |
| `--event-stream-output-path <path>` | Write JSON test event stream to file |
| `--cleanup/--no-cleanup` | Clean up after tests (default: `--cleanup`) |

:::tip
Use `--apk` when your tests need an Android application context (e.g., for accessing Android resources or APIs that require a running Activity). For pure logic tests, the default executable mode is faster.
:::

### Toolchain Options

The `build`, `run`, and `test` subcommands share these toolchain options for controlling the cross-compilation:

| Flag | Description |
|------|-------------|
| `--swift-version <v>` | Swift version to use |
| `--sdk <path>` | Swift Android SDK path |
| `--ndk <path>` | Android NDK path |
| `--toolchain <path>` | Swift toolchain path |
| `--package-path <path>` | Path to the Swift package |
| `-c, --configuration <c>` | Build configuration: `debug` or `release` |
| `--arch <arch>` | Target architecture: `automatic`, `current`, `all`, `aarch64`, `armv7`, `x86_64` |
| `--android-api-level <level>` | Android API level (default: `28`) |
| `--bridge/--no-bridge` | Enable SKIP_BRIDGE bridging to Kotlin (default: `--bridge`) |
| `-Xswiftc <flag>` | Pass flag to the Swift compiler |
| `-Xcc <flag>` | Pass flag to the C compiler |
| `-Xlinker <flag>` | Pass flag to the linker |

---

### skip android sdk {#android-sdk}

Manage the Swift cross-compilation SDK for Android. The SDK is required for compiling Swift code to run natively on Android (Skip Fuse mode).

<span id="android-sdk-upgrade"></span>

#### skip android sdk install {#android-sdk-install}

Install the Swift Android SDK. By default, installs the latest released version.

```shell
# Install the latest release
skip android sdk install

# Install a specific version
skip android sdk install --version 6.3

# Install the latest nightly build
skip android sdk install --version nightly-main
```

#### skip android sdk list {#android-sdk-list}

List installed Swift Android SDKs.

```shell
# List locally installed SDKs
skip android sdk list

# List available remote SDKs
skip android sdk list --remote
```

#### skip android sdk uninstall {#android-sdk-uninstall}

Remove installed Swift Android SDKs.

```shell
# Uninstall all installed SDKs
skip android sdk uninstall

# Uninstall a specific version
skip android sdk uninstall --version swift-6.3-RELEASE_android
```

---

### skip android emulator {#android-emulator}

Create, list, and launch Android emulator images (AVDs). Emulators are used for testing when no physical Android device is connected.

#### skip android emulator create {#android-emulator-create}

Install a system image and create an Android Virtual Device (AVD).

```shell
# Create the default emulator (API 34)
skip android emulator create

# Create a custom emulator
skip android emulator create \
  --name pixel_7_api_36 \
  --device-profile pixel_7 \
  --android-api-level 36 \
  --system-image google_apis_playstore_ps16k
```

#### skip android emulator launch {#android-emulator-launch}

Launch an Android emulator. If only one AVD is installed, it is launched automatically. Otherwise, the default emulator name is used, or you can specify one with `--name`.

```shell
# Launch the default emulator
skip android emulator launch

# Launch a specific emulator
skip android emulator launch --name emulator-34-medium_phone

# Launch in the background (returns after boot completes)
skip android emulator launch --background

# Launch headless (no window, for CI)
skip android emulator launch --headless --background
```

Key flags:

| Flag | Description |
|------|-------------|
| `-n, --name <name>` | AVD name to launch |
| `--background/--no-background` | Background the process after boot (default: `--no-background`) |
| `--headless/--no-headless` | Run without a window (default: auto-detected from `CI` env var) |
| `--logcat <filter>` | Logcat filter expression (default: `*:D`) |
| `--android-connect-timeout <seconds>` | Seconds to wait for boot (default: `90`) |

:::tip
On CI, combine `--headless --background` to launch the emulator, wait for it to fully boot, and then continue with your test script. The command will not return until `sys.boot_completed` reports `1`, so subsequent `adb` commands are safe to run immediately.
:::

#### skip android emulator list {#android-emulator-list}

List installed Android emulator images (AVDs).

```shell
skip android emulator list
```

---

### skip android home install {#android-home}

Set up the base Android SDK in your `ANDROID_HOME` directory. Installs cmdline-tools, platform-tools, and the emulator component.

```shell
skip android home install
```

This is typically only needed once, or after a fresh system setup. Most users will have Android Studio handle SDK installation.

### skip android toolchain version {#android-toolchain}

Show the version of the installed Swift Android Host Toolchain.

```shell
skip android toolchain version
```

---

## Tips and Troubleshooting

### Verbose output

Add `-v` or `--verbose` to any command to see detailed output, including the exact shell commands being executed. This is invaluable for diagnosing build or configuration issues.

```shell
skip android test --verbose
```

### Multiple connected devices

When multiple Android devices or emulators are connected, commands that target a device will automatically prefer emulators over physical devices. To target a specific device, use the `--android-serial` flag:

```shell
# List connected devices to find serial numbers
skip devices

# Target a specific device
skip android test --android-serial emulator-5554
```

You can also set the `ANDROID_SERIAL` environment variable, which will be respected by all commands.

### CI/CD usage

For continuous integration, a typical setup looks like:

```shell
# Install Skip and the Android SDK
brew install skiptools/skip/skip
skip android sdk install
skip android emulator create

# Launch an emulator in the background (headless, waits for boot)
skip android emulator launch --background --headless

# Run tests
skip android test
```

The emulator launch command waits until the device is fully booted before returning, so the test command can run immediately after.

### Getting help

Every command supports `--help` for a full list of available flags:

```shell
skip android test --help
```

For further assistance, visit the [Skip forums](https://forums.skip.dev) or join our [Slack](/slack/).
