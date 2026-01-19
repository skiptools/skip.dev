---
title: Skip Fuse vs Lite
permalink: /docs/modes/
---

Skip supports both *native* mode - in which your Swift is compiled natively for Android - and *transpiled* mode - in which your Swift is converted to Kotlin. The mode is specified at the level of a Swift module. We refer to apps that primarily use native mode as **Skip Fuse** apps, and apps that primarily use transpiled mode as **Skip Lite** apps. It is not uncommon, however, to use both native and transpiled modules within a single Swift-on-Android app. 

## Native Mode: Skip Fuse {#native}

Skip's *native* mode compiles your Swift natively with the [Swift SDK for Android](https://www.swift.org/documentation/articles/swift-sdk-for-android-getting-started.html), and it is the mode we recommend for most apps. It is a combination of:

- A native Swift toolchain for Android.
- Integration of Swift functionality like logging and networking with the Android operating system.
- Bridging technology for using Kotlin/Java API from compiled Swift, and for using compiled Swift API from Kotlin/Java.
- Xcode integration and tooling to compile and deploy your Swift across both iOS and Android.

The following diagram depicts a native project:

<div class="diagram-vector">
  
![Skip Native Diagram](https://assets.skip.dev/diagrams/skip-diagrams-native.svg)

</div>

### Advantages

Skip's documentation discusses its [advantages](/docs/#advantages) over writing separate apps or using other cross-platform technologies. But why use native rather than [transpiled](#transpiled) Swift? Here are several important reasons you might prefer compiled Swift:

- **Full Swift language**. While Skip's intelligent Swift-to-Kotlin transpiler can translate [the vast majority](/docs/swiftsupport/) of the Swift language, there are some language features that cannot be mapped to Kotlin.
- **Faithful runtime behavior**. Some aspects of Swift's runtime behavior will never be the same when translated to Kotlin and run atop the JVM. For example, Swift's deterministic object deallocation cannot be replicated on the JVM, which uses indeterministic garbage collection to manage memory.
- **Full stdlib and Foundation**. The [SkipLib](/docs/modules/skip-lib/) and [SkipFoundation](/docs/modules/skip-foundation/) libraries replicate much of the Swift standard library and Foundation in Kotlin. Native Swift on Android, however, has more complete coverage.
- **Third-party Swift libraries**. [Thousands of Swift packages](https://swiftpackageindex.com/search?query=platform%3Aios%2Candroid) compile for Android, and it often [isn't difficult](/docs/porting/) to port others. This gives you access to a world of third-party packages without needing to turn them into Skip modules.
- **Seamless C and C++ integration**. While the [SkipFFI](/docs/modules/skip-ffi/) framework enables transpiled Kotlin to interface with native C code on Android, the process of creating the interface between the two languages can be cumbersome. Native Swift on Android unlocks Swift's excellent integration with the C and C++ languages. 
- **High performance**. Java on Android is very fast, but it is a garbage-collected and heap-allocated runtime. Swift's value types like structs and enums, which can be stack-allocated, offer the fastest bare-metal performance possible on a device. And deterministic deallocations can keep memory watermarks low and avoid hitches that result from garbage collection pauses.

### Disadvantages

Using native Swift doesn't come without tradeoffs. Here are some notable disadvantages versus Skip's transpilation:

- **App size**. Bundling the Swift standard library, Foundation, and Swift internationalization libraries adds approximately 60 megabytes to your final Android app bundle size. We are exploring ways to reduce this overhead in future releases.
- **Kotlin/Java Bridging**. Transpiled Swift can interact directly with Kotlin and Java API. For this reason, Skip allows your native Swift to [incorporate transpiled code](/docs/platformcustomization/#calling-kotlin-api). But moving data between compiled Swift and Kotlin or Java still requires [bridging](#bridging).
- **Debugging**. [Debugging](/docs/debugging/) native code on Android is more difficult than debugging generated Kotlin, where you can take full advantage of Android Studio's built-in Kotlin/Java debugging tools.
- **Build time**. Building and deploying native Swift using the Android toolchain is slower than building using transpilation, due to overhead with the native compilation and packaging of the shared object files into the `.apk`.
- **Ejectability**. One benefit of purely-transpiled code is that you can always "eject" from Skip and continue to iterate separately on *both* your Swift and transpiled Kotlin code. If you eject Skip when using native mode, only your iOS app would remain fully intact.

### Conclusion

We believe that Skip Fuse's advantages outweigh its disadvantages for most use cases, and that even these disadvantages will lessen over time as it matures. We expect, therefore, that most developers will choose to use native mode where possible. Transpiled mode, however, is excellent for cross-platform libraries that must interface intimately with Kotlin/Java API, so many apps will depend on transpiled libraries for using platform services.

## Transpiled Mode: Skip Lite {#transpiled}

Transpilation is the process of converting one computer language into another language with a similar level of abstraction. Skip's *transpiled* mode converts your Swift source code into the equivalent Kotlin for running on Android. It is a combination of:

- A Swift-to-Kotlin transpiler.
- A suite of open source [libraries](/docs/modules/) that mirror core frameworks like the Swift standard library and Foundation for transpiled Swift.
- Xcode integration and tooling to transpile and deploy your Swift across both iOS and Android.

The following diagram depicts a pure transpiled project:

<div class="diagram-vector">
  
![Skip Non-Native Diagram](https://assets.skip.dev/diagrams/skip-diagrams-non-native.svg)

</div>

### Advantages

Transpiled mode's advantages and disadvantages are mirror opposites of native mode's.

- **Integration with Android APIs**. The primary benefit of transpilation is near-perfect integration with Android's Kotlin and Java APIs. Because your Swift code is converted to Kotlin, it can [directly call other Kotlin API](/docs/platformcustomization/), just as if it were calling Swift. And because the Kotlin language features seamless integration with Java, your Swift code can call Java API as well. Unlike native mode, no [bridging](#bridging) is required.
- **Transparency**. Transpilation allows you to see and understand all of Skip’s output. Skip’s Kotlin is fully human-readable and even overridable: Skip includes the ability to [insert or substitute literal Kotlin](/docs/platformcustomization/#skip-comments) inline with your Swift. This is of particular use during [debugging](/docs/debugging/), where you get full stack traces and can take full advantage of Andriod's debugging tools to step through your generated Kotlin.
- **Ejectability**. If Skip were to disappear, transpiled mode still gives you the full source code to both the iOS and Android versions of your app. You could continue to evolve the app as separate iOS and Android codebases (which is how many dual-platform apps are developed). Skip does not have any required runtime components other than the libraries it uses to provide the Foundation, SwiftUI, etc APIs on Android, and these libraries are all [free and open-source](https://source.skip.tools). 
- **App size**. Transpiled apps don't have to bundle anything but Skip's relatively slim compatibility libraries, while native apps have to include the much larger Swift Foundation and internationalization libraries.
- **Build time**. The combination of Skip's transpiler and the Android Kotlin compiler is faster than building with the full native Swift toolchain when iterating on your Android code.

### Disadvantages

- **It isn't real Swift**. While Skip's intelligent Swift-to-Kotlin transpiler can translate [the vast majority](/docs/swiftsupport/) of the Swift language, there are some language features that cannot be mapped to Kotlin. Additionally, some aspects of Swift's runtime behavior will never be the same when translated to Kotlin and run atop the JVM. For example, Swift's deterministic object deallocation cannot be replicated on the JVM, which uses indeterministic garbage collection to manage memory.
- **Limited stdlib and Foundation**. The [`SkipLib`](/docs/modules/skip-lib/) and [`SkipFoundation`](/docs/modules/skip-foundation/) libraries replicate much of the Swift standard library and Foundation in Kotlin. Native Swift on Android, however, has more complete coverage.
- **Few third-party libraries**. There are relatively few third-party transpiled libraries for Skip. Meanwhile, [thousands of Swift packages](https://swiftpackageindex.com/search?query=platform%3Aios%2Candroid) compile for Android, and it often [isn't difficult](/docs/porting/) to port others.
- **C and C++ integration**. While the [SkipFFI](/docs/modules/skip-ffi/) framework enables transpiled Kotlin to interface with native C code on Android, the process of creating the interface between the two languages can be cumbersome. Native Swift on Android unlocks Swift's excellent integration with the C and C++ languages. 
- **Performance**. Java on Android is very fast, but it is a garbage-collected and heap-allocated runtime. It often has a high memory watermark. Native Swift's value types like structs and enums, which can be stack-allocated, offer the fastest bare-metal performance possible on a device.

### Conclusion

Transpiled mode's ease of interacting with Kotlin and Java API makes it ideal for use cases involving tight integration with Android platform services, such as cross-platform libraries like [Skip Keychain](https://github.com/skiptools/skip-keychain). For shared business logic and other general use cases, however, we believe that most developers will choose native mode - primarily for its complete language coverage and the availability of third-party packages. Many apps will use a combination of native app logic and transpiled libraries for accessing platform services.

## Configuration

Every Skip module must include a `Skip/skip.yml` file in its source directory. The `skip create` command creates this file for you automatically when you [start a new project](/docs/gettingstarted/). The `mode` that you declare in `skip.yml` determines whether a module is compiled as native Swift or transpiled into Kotlin:

```yml title="skip.yml"
skip:
  mode: 'native'|'transpiled'
```

If the `mode` is not specified, it defaults to `'transpiled'`. A project can contain a mix of native and transpiled modules. As we will see later, you also configure [bridging](#bridging) between the native Swift and transpiled Swift/Kotlin/Java in `skip.yml`.

The `skip create` command will also generate the appropriate dependencies for your target mode in `Package.swift`. For model-level code, a native module will typically depend on SkipFuse and SkipModel, while a transpiled module will depend on SkipModel alone. For UI code, a native module will depend on SkipFuseUI, while a transpiled module will depend on SkipUI. Here is an example `Package.swift` for a native app with separate model and logic modules:

```yml title="Package.swift"
import PackageDescription

let package = Package(
    name: "skipapp-hiya",
    defaultLocalization: "en",
    platforms: [.iOS(.v17), .macOS(.v14), .tvOS(.v17), .watchOS(.v10), .macCatalyst(.v17)],
    products: [
        .library(name: "HiyaSkipApp", type: .dynamic, targets: ["HiyaSkip"]),
        .library(name: "HiyaSkipModel", type: .dynamic, targets: ["HiyaSkipModel"]),
        .library(name: "HiyaSkipLogic", type: .dynamic, targets: ["HiyaSkipLogic"]),
    ],
    dependencies: [
        .package(url: "https://source.skip.tools/skip.git", from: "1.2.7"),
        .package(url: "https://source.skip.tools/skip-model.git", from: "1.0.0"),
        .package(url: "https://source.skip.tools/skip-fuse.git", from: "1.0.0"),
        .package(url: "https://source.skip.tools/skip-fuse-ui.git", from: "1.0.0")
    ],
    targets: [
        .target(name: "HiyaSkip", dependencies: [
            "HiyaSkipModel",
            .product(name: "SkipFuseUI", package: "skip-fuse-ui")
        ], resources: [.process("Resources")], plugins: [.plugin(name: "skipstone", package: "skip")]),
        .target(name: "HiyaSkipModel", dependencies: [
            "HiyaSkipLogic",
            .product(name: "SkipModel", package: "skip-model"),
            .product(name: "SkipFuse", package: "skip-fuse")
        ], plugins: [.plugin(name: "skipstone", package: "skip")]),
        .testTarget(name: "HiyaSkipModelTests", dependencies: [
            "HiyaSkipModel",
            .product(name: "SkipTest", package: "skip")
        ], plugins: [.plugin(name: "skipstone", package: "skip")]),
        .target(name: "HiyaSkipLogic", dependencies: []),
    ]
)
```

## Bridging {#bridging}

Under normal circumstances, the only way for native code to communicate with Kotlin/Java is through the limited and cumbersome [Java Native Interface](https://docs.oracle.com/javase/8/docs/technotes/guides/jni/), and the only way for Kotlin/Java to communicate with native code is through "native" or "external" [functions](https://docs.oracle.com/en/java/javase/21/docs/specs/jni/design.html#compiling-loading-and-linking-native-methods). 
 
Just as Xcode can generate "bridging headers" that allow your Swift and Objective C to interoperate, however, the SkipStone build plugin can generate code that enables transparent interaction between your native Swift and the Kotlin/Java world of Android services and UI. Bridging allows you to automatically project your *compiled* Swift types and API to Kotlin/Java, and to project your *transpiled* Swift as well as other Kotlin/Java types and API to native Swift. Bridged API can be used exactly as if it were written in the target language, just as Swift can use bridged Objective C and vice versa.

### Configuration

You can use bridging with any Skip module - that is, any module that includes the SkipStone build [plugin](/docs/dependencies/) and has a [`skip.yml`](#configuration) file. To bridge a type or API, add a `// SKIP @bridge` [Skip comment](/docs/platformcustomization/#skip-comments) to its declaration. The following example bridges the `Person` class minus its `age` property.

```swift title="Person.swift"
// SKIP @bridge
public class Person {
    // SKIP @bridge
    public init() { ... }
 
    // SKIP @bridge
    public var firstName = ""

    // SKIP @bridge
    public var lastName = "" 

    public var age = 0

    // SKIP @bridge
    public func fullName() -> String { ... } 

    ...
} 
```

Assuming this is a native Swift module, bridging allows `Person` to be used from Kotlin code:

```kotlin title="PersonClient.kt"
fun personClient(): String {
  val p = Person()
  p.firstName = "Tim"
  p.lastName = "Apple"
  // p.age = 10 This would be a compile error! Age is not bridged
  return p.fullName()
} 
```

Following sections will cover [Swift to Kotlin/Java](#bridgetokotlin) and [Kotlin/Java to Swift](#bridgetoswift) bridging in more detail.

To bridge a type and include its members by default, use `// SKIP @bridgeMembers`. This will bridge all members with the same or greater declared visibility as the type. In other words, adding this to a `public` type will bridge all of its `public` members, while adding it to a type with default visibility will bridge all members with at least default visibility. To exclude a member from being bridged, add the `// SKIP @nobridge` comment. Here is the `Person` class using `@bridgeMembers`:

```swift title="Person.swift"
// SKIP @bridgeMembers
public class Person {
    public init() { ... }
 
    public var firstName = ""

    public var lastName = "" 

    // SKIP @nobridge
    public var age = 0

    public func fullName() -> String { ... } 

    ...
} 
```

Rather than annotate every bridged API, you can use `skip.yml` to enable auto-bridging. When auto-bridging is enabled for a module, all public API is bridged by default. To turn on auto-bridging, simply add `bridging: true` to your module's `skip.yml`. No additional configuration is required.

For example, the following `skip.yml` configures a native Swift module whose public types and API will be bridged for consumption by Kotlin/Java code:

```yml title="skip.yml"
skip:
  mode: 'native'
  bridging: true 
```

Use `// SKIP @nobridge` to exclude a type or API from auto-bridging. Here is the equivalent of our previous `Person` definition under auto-bridging:

```swift title="Person.swift"
public class Person {
    public init() { ... }
 
    public var firstName = ""

    public var lastName = "" 

    // SKIP @nobridge
    public var age = 0

    public func fullName() -> String { ... } 

    ...
} 
```

Note that `bridging: true` is actually shorthand for the following full configuration syntax, which we'll see more of below:

```yml title="skip.yml"
skip:
  mode: 'native'
  bridging:
    auto: true 
```

### Bridging Swift to Kotlin/Java {#bridgetokotlin}

Enabling bridging on a native Swift module allows its API to be used from Kotlin/Java code. The most common use case is writing your app's business logic in native Swift, then enabling bridging so that your bespoke Android UI layer can access it.

When Skip bridges native Swift to Kotlin, it generates Kotlin wrappers that delegate to your native Swift. By default, these wrappers are optimized for consumption by Skip's transpiled Swift. For example:

```swift title="URLManager.swift"
// In module NetworkUtils

public class URLManager {
    public var urls: [URL] = []

    public func perform(_ action: (URL) -> Void) {
        ...
    }

    ...
}
```

Generates a Kotlin wrapper like the following:

```kotlin title="URLManager.kt"
package network.utils

class URLManager {
    var urls: skip.lib.Array<skip.foundation.URL>
        get() {
            // Delegate to native code ...
        }
        set(newValue) {
            // Delegate to native code ...
        }

    fun perform(action: (skip.foundation.URL) -> Unit) {
        // Delegate to native code...
    }

    ...
}  

```

This allows any other Kotlin/Java code to interact with this API, but notice its use of `skip.lib.Array` and `skip.foundation.URL`. These are types from Skip's suite of [open-source libraries](/docs/modules/) that mirror Swift API in Kotlin. Using them makes sense when your API will be consumed by transpiled Swift, because they are the same types Skip uses in its transpilation output. You get perfect interoperability, including expected Swift behavior like value semantics for the `Array` struct.

### Kotlin Compatibility Option {#kotlincompat}

If you plan on consuming your native Swift directly from Kotlin/Java instead - for example, a Compose UI for Android - you can configure `skip.yml` to optimize for Kotlin compatibility:

```yml title="skip.yml"
skip:
  mode: 'native'
  bridging:
    auto: true
    options: 'kotlincompat'
``` 

Under this configuration, the generated Kotlin wrapper will use standard Kotlin/Java types:

```kotlin title="URLManager.kt"
package network.utils

class URLManager {
    var urls: kotlin.collections.List<java.net.URI>
        get() {
            // Delegate to native code ...
        }
        set(newValue) {
            // Delegate to native code ...
        }

    fun perform(action: (java.net.URI) -> Unit) {
        // Delegate to native code...
    }

    ...
} 
```

See the [Bridging Support Reference](/docs/bridging/) for additional information on what standard types and Swift language constructs can be bridged.

### Bridging Kotlin/Java to Swift {#bridgetoswift}

Skip offers multiple options for consuming Kotlin/Java API in native Swift. The most comprehensive is to bridge a transpiled Swift module.

Skip's ability to transpile Swift to Kotlin is one of its strengths. Transpiled Swift code effectively *is* Kotlin, which gives it a superpower: it can directly call any other Kotlin/Java APIs, with no bridging or configuration, just as if they were written in Swift. The Skip [documentation](/docs/platformcustomization/#calling-kotlin-api) provides details.

When you enable bridging on a transpiled module and expose its API to native Swift, you are also exposing this superpower. How? Let's consider an example. Suppose that your native Swift wants to store sensitive data in Android's encrypted shared preferences, which are only accessible via Kotlin. We choose to make a reusable library to expose this functionality to Swift.

First, we create a transpiled module and enable bridging:

```yml title="skip.yml"
skip:
  mode: 'transpiled'
  bridging: true
```

Then we write our Swift interface to the Android service, directly calling Android's Kotlin API as needed. Recall that we can do this because Skip is transpiling our Swift into Kotlin for the Android build.

```swift title="SecureStorage.swift"
#if !SKIP_BRIDGE
#if os(Android)
import Foundation

import android.content.Context
import android.content.SharedPreferences
import android.security.keystore.KeyGenParameterSpec
import android.security.keystore.KeyProperties
import androidx.security.crypto.EncryptedSharedPreferences
import androidx.security.crypto.MasterKeys

/// Secure storage using Android encrypted shared preferences.
public final class SecureStorage {
    /// The shared keychain.
    public static let shared = SecureStorage()

    private let lock = NSLock()

    /// Retrieve a value.
    public func string(forKey key: String) -> String? {
        let prefs = initializePreferences()
        return prefs.getString(key, nil)
    }

    // Additional getters omitted...

    /// Store a key value pair.
    public func set(_ string: String, forKey key: String) {
        let prefs = initializePreferences()
        let editor = prefs.edit()
        editor.putString(key, string)
        editor.apply()
    }

    // Additional setters omitted...

    private var preferences: SharedPreferences?

    private func initializePreferences() -> SharedPreferences {
        lock.lock()
        defer { lock.unlock() }

        if let preferences {
            return preferences
        }

        let context = ProcessInfo.processInfo.androidContext
        let alias = MasterKeys.getOrCreate(MasterKeys.AES256_GCM_SPEC)
        preferences = EncryptedSharedPreferences.create("tools.skip.SecureStorage", alias, context, EncryptedSharedPreferences.PrefKeyEncryptionScheme.AES256_SIV, EncryptedSharedPreferences.PrefValueEncryptionScheme.AES256_GCM)
        return preferences!
    }
}
#endif
#endif
``` 

:::note
While this example is Android-only, we could instead have written a cross-platform secure storage implementation that you could use from **both** iOS (delegating to the Keychain) and Android (delegating to encrypted shared preferences). That is exactly what SkipKeychain does. Check out the cross-platform Swift [implementation](https://github.com/skiptools/skip-keychain/blob/main/Sources/SkipKeychain/SkipKeychain.swift).
:::

Finally, we add this module as a dependency of our native Swift module. Now our native Swift can import and use `SecureStorage` exactly as if it were just another Swift type!

:::caution
When bridging is enabled on a transpiled module, enclose all code in `#if !SKIP_BRIDGE` to avoid duplicate symbol errors, as in our example above. The SkipStone build plugin will warn you if this is missing.
:::

#### Example Bridging Diagram: SkipKeychain

The following visualization summarizes how the Skip generated bridging works in the context of the
[SkipKeychain](https://github.com/skiptools/skip-keychain) framework, which exposes a direct
Swift interface to the iOS-only 
[Security Keychain services](https://developer.apple.com/documentation/security/keychain-services)
framework, and whose transpiled version uses the
equivalent functionality in the 
[`androidx.security.crypto.EncryptedSharedPreferences`](https://developer.android.com/reference/androidx/security/crypto/EncryptedSharedPreferences)
package on Android.

<div class="diagram-vector">

![Skip Bridging Diagram](https://assets.skip.dev/diagrams/skip-diagrams-bridging.svg)

</div>

### `AnyDynamicObject`

We believe that creating an ecosystem of Swift-API modules like [SkipKeychain](https://github.com/skiptools/skip-keychain/tree/main) to access both cross-platform and Android-only services is the best long-term approach, and that using transpiled Skip modules is a great pathway. You can also [embed transpiled Swift](/docs/platformcustomization/#calling-kotlin-api) in a native module. Sometimes, however, you may want to use a few Kotlin/Java types from your native Swift without using transpiled Swift. For this use case, we provide the `AnyDynamicObject` type.

`AnyDynamicObject` is a native Swift class vended by the SkipFuse framework that can represent any Kotlin/Java type. It uses Swift's dynamic features to allow you to access any property or call any function, and it uses Kotlin/Java's powerful reflection abilities to invoke your call on the underlying JVM object. The following is an example of using `AnyDynamicObject` in its bare form:

```swift title="AnyDynamicContextExample.swift"
import SkipFuse

...

// Specify the Kotlin or Java class name and any constructor arguments
let date = try AnyDynamicObject(className: "java.util.Date", 999) // java.util.Date(999)

// All calls must specify their return type and unwrap if non-optional
// All function calls are `throws`
let time1: Int64 = try date.getTime()! // 999 

// Like Kotlin, `AnyDynamicObject` allows property syntax for Java getters and setters
// Property access is not `throws`
let time2: Int64 = date.time! // 999

// Java calls must use positional args. Kotlin calls may use labeled args and omit defaulted args
// Even `Void` function calls need to specify a return type 
try date.setTime(1000) as Void

// But property setters do not
date.time = 1001

// Retrieve other objects as `AnyDynamicObject`
let instant: AnyDynamicObject? = date.instant
let s1: String? = try instant?.toString()

// Freely chain calls through other objects
let s2: String = try date.instant!.toString()!
let s3: String = try date.getInstant()!.toString()!

// Types with bridging support can be assigned from their Kotlin/Java equivalents
// See the Bridging Support Reference
let urls: [URL] = // ... call that returns any kotlin.collections.List<java.net.URI> 
```

:::note
`AnyDynamicObject` defaults to applying [Kotlin compatibility mode](#kotlincompat) when translating between Swift and Kotlin/Java data types. You can change this behavior with the optional `options: JConvertibleOptions` argument to the constructor, as in: `let date = AnyDynamicObject(className: "java.util.Date", options: [], 999)`.
:::

This raw use of `AnyDynamicObject` has certain disadvantages, though. Constructing an object relies on always specifying the full class name, and there is no way to `typealias` it. Accessing static members is non-intuitive: it requires creating another `AnyDynamicObject` that uses a different constructor:

```swift
let dateStatics = try AnyDynamicObject(forStaticsOfClassName: "java.util.Date")
let date: AnyDynamicObject? = try? dateStatics.parse(dateString)
```

Skip offers some optional syntactic sugar for these issues. To use it, set a `dynamicroot` string in your `skip.yml` configuration. The specified string turns into a magic namespace from which you can access fully-qualified Kotlin/Java types. For example, with the following `skip.yml`:

```yml title="skip.yml"
skip:
  mode: 'native'
  dynamicroot: 'D' 
```

You can write code like the following:

```swift
let date = try D.java.util.Date(999)
let time: Int64 = date.time!  
```

How does this work? Skip's build plugin detects your use of `D.java.util.Date` and generates a matching subclass of `AnyDynamicObject`. To access static members, the generated subclass includes a `Companion(options:)` function, mirroring Kotlin's use of `Companion` for statics.

```swift
let date: AnyDynamicObject = try D.java.util.Date.Companion().parse(dateString)! 
```

Because `D.java.util.Date` is a real type, you can create a `typealias`:

```swift
typealias JDate = D.java.util.Date

...

let d1 = JDate(999)
let s: String? = try d1.instant?.toString() 
let d2: JDate? = try JDate.Companion().parse(dateString)
```

If you have a reference to a base `AnyDynamicObject` value and you want to convert it to a generated `dynamicroot` type, use the `as()` function:

```swift
let object: AnyDynamicObject = ...
let date: D.java.util.Date = object.as(D.java.util.Date.self)

// or...

let date: JDate = object.as(JDate.self)
```

When using `dynamicroot`, keep the following in mind:

1. Generated types have `internal` visibility, so they are only visible to your current module. This prevents conflicts when multiple linked modules use the same Kotlin/Java types.
1. The types are only generated for the Android build of your code. After all, iOS can't use Kotlin/Java API. So you must only use these generated types in code guarded with `#if os(Android)`. See [Cross-Platform Topics](/docs/platformcustomization/).

:::caution
`AnyDynamicObject` is convenient, but remember that your calls are completely unchecked by the compiler. Attempting to use the wrong API will result in a runtime error. For a strongly-typed alternative, consider Apple's [swift-java](https://github.com/swiftlang/swift-java) project.
:::

### Bridging with `AnyDynamicObject`

The previous sections described two approaches to using Kotlin/Java from native Swift: bridging transpiled Swift code or using `AnyDynamicObject`. These approaches can also be combined. 

Suppose that you've wrapped a Kotlin API in transpiled Swift for bridging. You may still want to expose the underlying Kotlin objects to your Android code for certain advanced use cases. Skip's [Firebase package](/docs/modules/skip-firebase/) mapping the iOS Firebase API to Android uses this pattern often. Here is a code excerpt:

```swift title="FirebaseApp.swift"
#if SKIP
public final class FirebaseApp {
    // Allow code to access underlying Kotlin object if needed
    public let app: com.google.firebase.FirebaseApp

    public init(app: com.google.firebase.FirebaseApp) {
        self.app = app
    }

    public var name: String {
        app.name
    }

    public var options: FirebaseOptions {
        FirebaseOptions(options: app.options)
    }

    ...
}
#endif
```

But how will the `com.google.firebase.FirebaseApp` type be represented to native Swift? This is a native Kotlin type, so Skip has no knowledge of its API. The answer is that Skip will map it to `AnyDynamicObject`. The bridged Swift implementation of `FirebaseApp` would look something like:

```swift title="FirebaseApp.swift"
public final class FirebaseApp {
    public var app: AnyDynamicObject {
        // Delegate to Kotlin code ...
    }

    public init(app: AnyDynamicObject) {
        // Delegate to Kotlin code ...
    }

    public var name: String {
        // Delegate to Kotlin code ...
    }

    ...
}
```

You must specify an explicit type and use the fully-qualified Kotlin/Java class name on any Swift API that should map to `AnyDynamicObject`. The following transpiled Swift will correctly bridge to `AnyDynamicObject`:

```swift
let app: com.google.firebase.FirebaseApp = ...

func f(app: com.google.firebase.FirebaseApp) {
    ...
} 
```

But the following examples will produce build-time errors:

```swift
import com.google.firebase.FirebaseApp
 
let app: FirebaseApp = ... // Not fully qualified
let app = com.google.firebase.FirebaseApp() // No explicit type  

func f(app: FirebaseApp) { // Not fully qualified
    ...
} 
```

The combination of transpiled bridging and `AnyDynamicObject` allows you to provide a natural Swift API to important Kotlin and Java services while still exposing the raw Kotlin or Java objects for advanced use cases.

## Migrating Between Modes {#migration}

Whether you are using native or transpiled modes, you are writing your code in Swift. Migrating between them, therefore, is much easier than moving between different programming languages - in fact it is often trivial. This is particularly true when migrating from transpiled to native mode, given that transpiled mode supports only a subset of native mode's Swift syntax, and native mode offers far more third-party libraries. 

The first step in migration is to update your `skip.yml` and `Package.swift` files, as described in the [Configuration](#configuration) section. Then it is a matter of migrating any code that behaves differently under each mode. See the chapters on [Development](/docs/app-development/) and [Cross-Platform Topics](/docs/platformcustomization/) in particular.

