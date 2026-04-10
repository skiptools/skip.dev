---
title: SkipModel
description: Documentation for SkipModel fetched from GitHub.
note: This documentation section is derived from the GitHub README.md source using the scripts/sync-modules.mjs script. Do not make edits to the file here, change it there.
editUrl: https://github.com/skiptools/skip-model/edit/main/README.md
---

:::note[Source Repository <a href='https://github.com/skiptools/skip-model/releases' alt='Releases for skip-model'><img decoding='async' loading='lazy' alt='Releases for skip-model' src='https://img.shields.io/github/v/release/skiptools/skip-model.svg?style=flat' /></a>]{icon="github"}
This framework is available at [github.com/skiptools/skip-model](https://github.com/skiptools/skip-model) and can be checked out and improved locally as described in the [Contribution Guide](/docs/contributing/#local-libraries).
:::


Model object observation for [Skip Lite](/docs/modes/#lite) transpiled Swift. Parts of this package are also used by [Skip Fuse](/docs/modes/#fuse) to bridge `@Observables` to Compose.

See what API is included [here](#api-support).

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
        .package(url: "https://source.skip.dev/skip-model.git", from: "1.0.0"),
    ],
    targets: [
        .target(name: "MyTarget", dependencies: [
            .product(name: "SkipModel", package: "skip-model")
        ])
    ]
)
```

## About 

SkipModel vends the `skip.model` Kotlin package. This package contains `Observable` and `ObservableObject` interfaces, representing the two core protocols that SwiftUI uses to observe changes to model objects. It also includes limited `Publisher` support.

## Dependencies

SkipLib depends on the [skip](https://source.skip.dev/skip) transpiler plugin and the [SkipFoundation](/docs/modules/skip-foundation) package.

SkipModel is part of the core *SkipStack* and is not intended to be imported directly. The transpiler includes `import skip.model.*` in generated Kotlin for any Swift source that imports the `Combine`, `Observation`, or `SwiftUI` frameworks.

## Status

From the `Observation` package, SkipModel supports the `@Observable` and `@ObservationIgnored` macros.

From `Combine`, SkipModel supports the `ObservableObject` protocol, the `@Published` property wrapper, and limited `Publisher` functionality. See [API support](#api-support) below.

Much of Skip's model support is implemented directly in the Skip transpiler. The `Observable` and `ObservableObject` marker protocols are are sufficient for the Skip transpiler to recognize your observable types. When generating their corresponding Kotlin classes, the transpiler then adds the necessary code so that their state can be tracked by the Compose runtime.

## Contributing

We welcome contributions to SkipModel. The Skip product [documentation](/docs/contributing/) includes helpful instructions and tips on local Skip library development. When submitting code, please include unit tests in your [PR](https://source.skip.dev/skip-model/pulls).

## Model Objects

Like Skip itself, SkipModel objects are dual-platform! Not only do your `@Observable` and `ObservableObject` properties participate in SwiftUI state tracking, but they are tracked by Compose as well. The Skip transpiler backs your observable properties with `MutableState` values in Kotlin, so Compose automatically tracks reads and writes and [performs recomposition as needed](https://developer.android.com/jetpack/compose/state).

This means that you can write shared model-layer Swift code using observable objects, and use it to power both SwiftUI (whether iOS-only or dual-platform with Skip) as well as pure Android Compose UI code. For example, the following model class:

```swift
@Observable class TapCounter {
    var tapCount = 0 
}
```

could power a Compose UI:

```kotlin
val tapCounter = TapCounter()
...
TapIt(counter = tapCounter)
...
@Composable fun TapIt(counter: TapCounter) {
    Button(onClick = { counter.tapCount += 1 }) { 
        Text("Tap Count: ${counter.tapCount}")
    }
}
```

## API Support

The following table summarizes SkipModel's API support on Android. Anything not listed here is likely not supported. Note that in your iOS-only code - i.e. code within `#if !SKIP` blocks - you can use any Swift API you want. Additionally:

- In all Combine publishes and related API, the `Failure` type must be `Never`: throwing errors in Combine chains is not supported.
- In Skip, Combine is **not** automatically imported when you `import Foundation`. Make sure to `import Combine` or `import SwiftUI` explicitly.

Support levels:

  - ✅ – Full
  - 🟢 – High
  - 🟡 – Medium 
  - 🟠 – Low
  
<table>
  <thead><th>Support</th><th>API</th></thead>
  <tbody>
    <tr>
      <td>🟢</td>
      <td>
          <details>
              <summary><code>AnyCancellable</code></summary>
              <ul>
                  <li>See <code>Cancellable</code></li>
              </ul>
          </details> 
      </td>
    </tr>
    <tr>
      <td>🟠</td>
      <td>
            <details>
              <summary><code>AnyPublisher</code></summary>
              <ul>
                  <li><code>init(_ publisher: Publisher)</code></li>
                  <li>See <code>Publisher</code></li>
              </ul>
          </details> 
      </td>
    </tr>
    <tr>
      <td>🟢</td>
      <td>
          <details>
              <summary><code>Cancellable</code></summary>
              <ul>
                  <li>The <code>store(in:)</code> function only supports a <code>Set</code></li>
              </ul>
          </details> 
      </td>
    </tr>
    <tr>
      <td>🟠</td>
      <td>
          <details>
              <summary><code>ConnectablePublisher</code></summary>
              <ul>
                  <li><code>func connect()</code></li>
                  <li><code>func autoconnect()</code></li>
                  <li>See <code>Publisher</code></li>
              </ul>
          </details> 
      </td>
    </tr>
    <tr>
      <td>✅</td>
      <td><code>func NotificationCenter.publisher(for: Notification.Name, object: Any? = nil): Publisher&lt;Notification, Never&gt;</code></td>
    </tr>
    <tr>
      <td>🟢</td>
      <td>
          <details>
              <summary><code>@Observable</code></summary>
              <ul>
                  <li>Skip does not support calls to the generated <code>access(keyPath:)</code> and <code>withMutation(keyPath:_:)</code> functions</li>
              </ul>
          </details> 
      </td>
    </tr>
    <tr>
      <td>🟢</td>
      <td>
            <details>
              <summary><code>ObservableObject</code></summary>
              <ul>
                  <li>If you declare your own <code>objectWillChange</code> publisher, it must be of type <code>ObservableObjectPublisher</code></li>
              </ul>
          </details> 
      </td>
    </tr>
    <tr>
      <td>🟠</td>
      <td>
            <details>
              <summary><code>ObservableObjectPublisher</code></summary>
              <ul>
                  <li><code>func send()</code></li>
                  <li>See <code>Publisher</code></li>
              </ul>
          </details> 
      </td>
    </tr>
    <tr>
      <td>✅</td>
      <td><code>@ObservationIgnored</code></td>
    </tr>
    <tr>
      <td>🟠</td>
      <td>
          <details>
              <summary><code>PassthroughSubject</code></summary>
              <ul>
                  <li><code>func send(value: Output)</code></li>
                  <li>See <code>Publisher</code></li>
              </ul>
          </details> 
      </td>
    </tr>
    <tr>
      <td>✅</td>
      <td><code>@Published</code></td>
    </tr>
    <tr>
      <td>🟠</td>
      <td>
          <details>
              <summary><code>Publisher</code></summary>
              <ul>
<li><code>func assign&lt;Root&gt;(to: KeyPath&lt;Root, Output&gt;, on: Root) -> AnyCancellable</code></li>
<li><code>func sink(receiveValue: (Output) -> Unit) -> AnyCancellable</code></li>
<li><code>func combineLatest(_ with: Publisher) -> Publisher</code></li>
<li><code>func combineLatest3(_ with0: Publisher, _ with1: Publisher) -> Publisher</code></li>
<li><code>func combineLatest4(_ with0: Publisher, _ with1: Publisher, _ with2: Publisher) -> Publisher</code></li>
<li><code>func debounce(for: Double, scheduler: Scheduler) -> Publisher</code></li>
<li><code>func dropFirst(count: Int = 1) -> Publisher</code></li>
<li><code>func filter(isIncluded: (Output) -> Boolean) -> Publisher</code></li>
<li><code>func map&lt;T&gt;(transform: (Output) -> T) -> Publisher</code></li>
<li><code>func receive(on: Scheduler): Publisher</code></li>
<li><code>func eraseToAnyPublisher(): AnyPublisher</code></li>
              </ul>
          </details> 
      </td>
    </tr>
    <tr>
      <td>✅</td>
      <td><code>func Timer.publish(every: TimeInterval, tolerance: TimeInterval? = nil, on runLoop: RunLoop, in mode: RunLoop.Mode, options: RunLoop.SchedulerOptions? = nil) -> ConnectablePublisher&lt;Date, Never&gt;</code></td>
    </tr>
  </tbody>
</table>

