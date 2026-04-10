---
title: SkipBridge
description: Documentation for SkipBridge fetched from GitHub.
note: This documentation section is derived from the GitHub README.md source using the scripts/sync-modules.mjs script. Do not make edits to the file here, change it there.
editUrl: https://github.com/skiptools/skip-bridge/edit/main/README.md
---

:::note[Source Repository <a href='https://github.com/skiptools/skip-bridge/releases' alt='Releases for skip-bridge'><img decoding='async' loading='lazy' alt='Releases for skip-bridge' src='https://img.shields.io/github/v/release/skiptools/skip-bridge.svg?style=flat' /></a>]{icon="github"}
This framework is available at [github.com/skiptools/skip-bridge](https://github.com/skiptools/skip-bridge) and can be checked out and improved locally as described in the [Contribution Guide](/docs/contributing/#local-libraries).
:::


Bidirectional bridging between Swift and Kotlin/Java for Skip Fuse apps.

> **Note:** Most developers will never use SkipBridge directly. It is an internal infrastructure package that powers Skip's transparent Swift/Kotlin interoperability in Fuse mode. When you enable `bridging: true` in a module's `skip.yml`, the Skip build plugin automatically generates the JNI glue code that calls into SkipBridge — no manual integration is required.

For a complete reference of which Swift language features and types can be bridged, see the [Bridging Reference](/docs/bridging/) documentation.

## Overview

SkipBridge enables compiled Swift code (running via the Swift Android SDK) and Kotlin/Java code (running on the JVM or Android runtime) to call each other across the JNI boundary. It handles:

- **Object lifecycle management** — Swift objects held by Kotlin are reference-counted via opaque `Int64` pointers (`SwiftObjectPointer`), preventing premature deallocation while avoiding retain cycles.
- **Type conversion** — Automatic marshalling between Swift and Kotlin/Java types (e.g., `Array` ↔ `List`, `Dictionary` ↔ `Map`, `Date` ↔ `java.util.Date`, `URL` ↔ `java.net.URI`, `UUID` ↔ `java.util.UUID`).
- **Closure bridging** — Swift closures map to Kotlin `FunctionN` lambda objects (up to 5 parameters), with support for async/suspend variants.
- **Inheritance** — Bridged class hierarchies are preserved across the boundary (up to 4 levels of inheritance).
- **Async/await** — Swift async functions and properties bridge to Kotlin suspend functions, and `AsyncStream`/`AsyncThrowingStream` bridge to `kotlinx.coroutines.flow.Flow`.
- **Dynamic access** — `AnyDynamicObject` provides `@dynamicMemberLookup`-based access to arbitrary Kotlin/Java objects from Swift, backed by a Kotlin `Reflector` class that handles property access and method dispatch with overload resolution.

## Architecture

### Swift Side

The core Swift types live in the `SkipBridge` module:

| Type | Purpose |
|------|---------|
| `SwiftObjectPointer` | `Int64` alias representing an opaque pointer to a Swift object, managed with `Unmanaged` retain/release semantics |
| `BridgedToKotlin` | Protocol marking Swift types that are projected to Kotlin |
| `BridgedFromKotlin` | Protocol marking Kotlin projections back to Swift |
| `BridgedTypes` | Enum cataloging all bridgeable types (primitives, collections, dates, URLs, etc.) with conversion logic |
| `AnyDynamicObject` | `@dynamicMemberLookup` wrapper for calling into arbitrary Kotlin/Java objects via reflection |
| `JavaBackedClosure<R>` | Wraps a Kotlin lambda (`JObject`) so it can be invoked from Swift, with variants for 0–5 parameters and suspend support |
| `SwiftEquatable` / `SwiftHashable` | Wrappers that project Swift `Equatable`/`Hashable` conformances to Kotlin's `equals`/`hashCode` |

### Kotlin Side

The `skip.bridge.Reflector` class provides the Kotlin-side reflection engine for `AnyDynamicObject`. It supports:

- Constructing Kotlin objects by class name with arguments
- Reading and writing properties by name with type conversion
- Invoking methods with overload resolution scored by argument compatibility

### Native Library Loading

`System.swift` handles loading the compiled Swift `.so` libraries into the JVM/Android runtime across multiple build scenarios — Xcode-launched tests with an embedded JVM, SwiftPM-launched tests, Gradle test execution via Robolectric, and on-device Android execution via `System.loadLibrary`.

## Module Configuration

SkipBridge itself is configured as a native-mode module (`mode: 'native'` in its `skip.yml`). Its Gradle build configuration orchestrates the Android NDK toolchain to compile Swift source into `.so` shared libraries that are packaged into the app's JNI library directory.

Modules that depend on SkipBridge typically declare bridging in their own `skip.yml`:

```yaml
skip:
  mode: 'native'
  bridging: true
```

An optional `kotlincompat` bridging mode translates Swift collection and standard library types to their Kotlin equivalents (e.g., `Array` → `kotlin.collections.List`) for more natural consumption from pure Kotlin code:

```yaml
skip:
  mode: 'native'
  bridging:
    enabled: true
    options: 'kotlincompat'
```

## Dependencies

- [swift-jni](https://source.skip.dev/swift-jni) — JNI C headers and Swift JNI wrapper
- [SkipLib](/docs/modules/skip-lib) — Swift standard library extensions for Skip

