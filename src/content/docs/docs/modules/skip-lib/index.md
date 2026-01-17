---
title: SkipLib
layout: docs
note: This documentation section is derived from https://raw.githubusercontent.com/skiptools/skip-lib/main/README.md using the scripts/syncdocs.sh script. Do not change the file here, change it there.
---

:::note[Source Repository]{icon="github"}
The skip-lib framework is available at [https://github.com/skiptools/skip-lib.git](https://source.skip.tools/skip-lib.git), which can be checked out and tested with `skip test` once Skip is [installed](/docs/gettingstarted/).
:::

Swift standard library for [Skip Lite](/docs/status#skip_lite) transpiled Swift.

See what API is currently implemented [here](#swift-standard-library-support).

## About 

SkipLib vends the `skip.lib` Kotlin package. It serves two purposes:

1. SkipLib is a reimplementation of the Swift standard library for Kotlin on Android. Its goal is to mirror as much of the Swift standard library as possible, allowing Skip developers to use Swift standard library API with confidence.
1. SkipLib contains custom Kotlin API that the Skip transpiler takes advantage of when translating your Swift source to the equivalent Kotlin code. For example, the Kotlin language does not have tuples. Instead, SkipLib's `Tuple.kt` defines bespoke Kotlin `Tuple` classes. When the transpiler translates Swift code that references tuples, it uses these `Tuple` classes in the Kotlin it generates.

## Dependencies

SkipLib depends on the [skip](https://source.skip.tools/skip) transpiler plugin and has no additional library dependencies.

It is part of the core *Skip Core Frameworks* and is not intended to be imported directly.
The module is transparently adopted through the automatic addition of `import skip.lib.*` to transpiled files by the Skip transpiler.

## Status

- SkipLib's Swift symbol files (see [Implementation Strategy](#implementation-strategy)) are nominally complete. They should declare all Swift standard library API. This is difficult to validate, however, so if you find anything missing, please [report it](https://source.skip.tools/skip-lib/issues) to us.
- Unimplemented API is appropriately marked with `@available(*, unavailable)` annotations. Skip will generate an error when you attempt to use an unimplemented API.
- In particular, a significant portion of the [collections](#collections) API is not yet implemented.
- Unit testing is not comprehensive.

See [Swift Standard Library Support](#swift-standard-library-support).

## Contributing

We welcome contributions to SkipLib. The Skip product [documentation](/docs/contributing/) includes helpful instructions and tips on local Skip library development. 

The most pressing need is to reduce the amount of unimplemented API. To help fill in unimplemented API in SkipLib:

1. Find unimplemented API. Unimplemented API should be marked with `@available(*, unavailable)` in the Swift symbol files.
1. Write an appropriate Kotlin implementation. See [Implementation Strategy](#implementation-strategy) below. For [collections](#collections) API, make sure your implementation is duplicated for `String` as well.
1. Write unit tests.
1. [Submit a PR.](https://source.skip.tools/skip-lib/pulls)

Other forms of contributions such as test cases, comments, and documentation are also welcome!

## Implementation Strategy

Apart from the Skip transpiler itself, SkipLib implements the lowest levels of the Swift language. Its implementation strategy, therefore, differs from other Skip libraries. 

Most Skip libraries *call* Kotlin API, but are *written* in Swift, relying on the Skip transpiler for translation to Kotlin. Most of SkipLib, however, is written in pure Kotlin. Consider SkipLib's implementation of Swift's `Array`. SkipLib divides its `Array` support into two files:

1. `Sources/SkipLib/Array.swift` acts as a Swift header file, declaring the `Array` type's Swift API but stubbing out the implementation. The `// SKIP SYMBOLFILE` comment at the top of the file marks it as such. Read more about special Skip comments in the Skip product [documentation](/docs/platformcustomization/#skip-comments).
1. `Sources/SkipLib/Skip/Array.kt` contains the actual `Array` implementation in Kotlin. 

This pattern is used for most Swift types throughout SkipLib. Meanwhile, SwiftLib implementations of constructs built directly into the Swift language - e.g. tuples or `inout` parameters - only have a Kotlin file, with no corresponding Swift symbol file.

## Swift Standard Library Support

The following table summarizes SkipLib's Swift Standard Library API support on Android. Anything not listed here is likely not supported. Note that in your iOS-only code - i.e. code within `#if !SKIP` blocks - you can use any API you want.

Support levels:

  - ✅ – Full
  - 🟢 – High
  - 🟡 - Medium
  - 🟠 – Low

<table>
  <thead><th>Support</th><th>API</th></thead>
  <tbody>
    <tr>
      <td>🟢</td>
      <td>
        <details>
          <summary><code>Actor</code></summary>
          <ul>
            <li>Non-private mutable properties are not supported</li>
          </ul>
        </details> 
      </td>
    </tr>
    <tr>
      <td>✅</td>
      <td><code>Any</code></td>
    </tr>
    <tr>
      <td>✅</td>
      <td><code>AnyActor</code></td>
    </tr>
    <tr>
      <td>✅</td>
      <td><code>AnyHashable</code></td>
    </tr>
    <tr>
      <td>✅</td>
      <td><code>AnyObject</code></td>
    </tr>
    <tr>
      <td>🟢</td>
      <td>
        <details>
          <summary><code>Array</code></summary>
          <ul>
<li><code>init()</code></li>
<li><code>init(repeating: Element, count: Int)</code></li>
<li><code>init(_ sequence: any Sequence&lt;Element&gt;)</code></li>
<li>See <code>Collection</code> for collection API support</li>
          </ul>
        </details> 
      </td>
    </tr>
    <tr>
      <td>✅</td>
      <td><code>assert</code></td>
    </tr>
    <tr>
      <td>✅</td>
      <td><code>assertionFailure</code></td>
    </tr>
    <tr>
      <td>✅</td>
      <td><code>AsyncSequence</code></td>
    </tr>
    <tr>
      <td>✅</td>
      <td>
        <details>
          <summary><code>AsyncStream</code></summary>
          <ul>
<li>When invoking the <code>init(unfolding:)</code> constructor, use a labeled argument rather than a trailing closure</li>
          </ul>
        </details> 
      </td>
    </tr>
    <tr>
      <td>🟢</td>
      <td>
        <details>
          <summary><code>Bool</code></summary>
          <ul>
<li><code>static func random() -> Bool</code></li>
<li><code>static func random(using gen: inout RandomNumberGenerator) -> Bool</code></li>
          </ul>
        </details> 
      </td>
    </tr>
    <tr>
      <td>✅</td>
      <td><code>CaseIterable</code></td>
    </tr>
    <tr>
      <td>✅</td>
      <td><code>CGAffineTransform</code></td>
    </tr>
    <tr>
      <td>✅</td>
      <td><code>CGFloat</code></td>
    </tr>
    <tr>
      <td>✅</td>
      <td><code>CGPoint</code></td>
    </tr>
    <tr>
      <td>✅</td>
      <td><code>CGRect</code></td>
    </tr>
    <tr>
      <td>✅</td>
      <td><code>CGSize</code></td>
    </tr>
    <tr>
      <td>🟢</td>
      <td>
        <details>
          <summary><code>Character</code></summary>
          <ul>
<li><code>init(_: Character)</code></li>
<li><code>init(_: String)</code></li>
<li><code>var isNewline: Bool</code></li>
<li><code>var isWhitespace: Bool</code></li>
<li><code>var isUppercase: Bool</code></li>
<li><code>var isLowercase: Bool</code></li>
<li><code>func lowercased() -> String</code></li>
<li><code>func uppercased() -> String</code></li>
          </ul>
        </details> 
      </td>
    </tr>
    <tr>
      <td>🟢</td>
      <td>
        <details>
          <summary><code>Codable</code></summary>
          <ul>
            <li>See <a href="#codable">Codable</a></li>
          </ul>
        </details> 
      </td>
    </tr>
    <tr>
      <td>🟡</td>
      <td>
        <details>
          <summary><code>Collection</code></summary>
          <ul>
<li>Note: This list represents the combined supported API of Swift's many collection types: <code>Sequence</code>, <code>Collection</code>, <code>BidirectionalCollection</code>, etc</li>
<li><code>func allSatisfy(_ predicate: (Element) throws -&gt; Bool) rethrows -&gt; Bool</code></li>
<li><code>mutating func append(_ newElement: Element)</code></li>
<li><code>mutating func append(contentsOf newElements: any Sequence&lt;Element&gt;)</code></li>
<li><code>func contains(_ element: Element) -&gt; Bool</code></li>
<li><code>func contains(where predicate: (Element) throws -&gt; Bool) rethrows -&gt; Bool</code></li>
<li><code>func distance(from start: Int, to end: Int) -&gt; Int</code></li>
<li><code>func drop(while predicate: (Element) throws -&gt; Bool) rethrows -&gt; [Element]</code></li>
<li><code>func dropFirst(_ k: Int = 1) -&gt; [Element]</code></li>
<li><code>func dropLast(_ k: Int = 1) -&gt; [Element]</code></li>
<li><code>func elementsEqual(_ other: any Sequence&lt;Element&gt;) -&gt; Bool</code></li>
<li><code>func elementsEqual(_ other: any Sequence&lt;Element&gt;, by areEquivalent: (Element, Element) throws -&gt; Bool) rethrows -&gt; Bool</code></li>
<li><code>func enumerated() -&gt; any Sequence&lt;(offset: Int, element: Element)&gt;</code></li>
<li><code>var endIndex: Int</code></li>
<li><code>func filter(_ isIncluded: (Element) throws -&gt; Bool) rethrows -&gt; [Element]</code></li>
<li><code>func first(where predicate: (Element) throws -&gt; Bool) rethrows -&gt; Element?</code></li>
<li><code>func firstIndex(of element: Element) -&gt; Int?</code></li>
<li><code>func firstIndex(where predicate: (Element) throws -&gt; Bool) rethrows -&gt; Int?</code></li>
<li><code>var first: Element?</code></li>
<li><code>func flatMap&lt;RE&gt;(_ transform: (Element) throws -&gt; any Sequence&lt;RE&gt;) rethrows -&gt; [RE]</code></li>
<li><code>func formIndex(_ i: inout Int, offsetBy distance: Int)</code></li>
<li><code>func formIndex(after i: inout Int)</code></li>
<li><code>func index(_ i: Int, offsetBy distance: Int) -&gt; Int</code></li>
<li><code>func index(after i: Int) -&gt; Int</code></li>
<li><code>var indices: any Sequence&lt;Int&gt;</code></li>
<li><code>var isEmpty: Bool</code></li>
<li><code>func joined&lt;RE&gt;() -&gt; [RE] where Element: Sequence&lt;RE&gt;</code></li>
<li><code>func joined&lt;RE&gt;(separator: any Sequence&lt;RE&gt;) -&gt; [RE] where Element: Sequence&lt;RE&gt;</code></li>
<li><code>func joined(separator: String) -&gt; String</code></li>
<li><code>func makeIterator() -&gt; any IteratorProtocol&lt;Element&gt;</code></li>
<li><code>func map&lt;RE&gt;(_ transform: (Element) throws -&gt; RE) rethrows -&gt; [RE]</code></li>
<li><code>func max() -&gt; Element?</code></li>
<li><code>func max(by areInIncreasingOrder: (Element, Element) throws -&gt; Bool) rethrows -&gt; Element?</code></li>
<li><code>func min() -&gt; Element?</code></li>
<li><code>func min(by areInIncreasingOrder: (Element, Element) throws -&gt; Bool) rethrows -&gt; Element?</code></li>
<li><code>var underestimatedCount: Int</code></li>
<li><code>func prefix(_ maxLength: Int) -&gt; [Element]</code></li>
<li><code>func prefix(through end: Int) -&gt; [Element]</code></li>
<li><code>func prefix(upTo end: Int) -&gt; [Element]</code></li>
<li><code>mutating func popFirst() -&gt; Element?</code></li>
<li><code>mutating func popLast() -&gt; Element?</code></li>
<li><code>func randomElement() -&gt; Element?</code></li>
<li><code>func randomElement(using generator: inout any RandomNumberGenerator) -&gt; Element?</code></li>
<li><code>func reduce&lt;R&gt;(_ initialResult: R, _ nextPartialResult: (_ partialResult: R, Element) throws -&gt; R) rethrows -&gt; R</code></li>
<li><code>func reduce&lt;R&gt;(into initialResult: R, _ updateAccumulatingResult: (_ partialResult: inout R, Element) throws -&gt; Void) rethrows -&gt; R</code></li>
<li><code>func remove(at i: Int) -&gt; Element</code></li>
<li><code>mutating func removeAll(keepingCapacity keepCapacity: Bool = false)</code></li>
<li><code>mutating func removeAll(where shouldBeRemoved: (Element) throws -&gt; Bool) rethrows</code></li>
<li><code>mutating func removeFirst() -&gt; Element</code></li>
<li><code>mutating func removeFirst(_ k: Int)</code></li>
<li><code>mutating func removeLast() -&gt; Element</code></li>
<li><code>mutating func removeLast(_ k: Int)</code></li>
<li><code>mutating func reverse()</code></li>
<li><code>func reversed() -&gt; [Element]</code></li>
<li><code>mutating func shuffle()</code></li>
<li><code>mutating func shuffle&lt;T: RandomNumberGenerator&gt;(using generator: inout T)</code></li>
<li><code>mutating func sort()</code></li>
<li><code>mutating func sort(by areIncreasingOrder: (Element, Element) throws -&gt; Bool) rethrows</code></li>
<li><code>mutating func swapAt(_ i: Int, _ j: Int)</code></li>
<li><code>subscript(bounds: Range&lt;Int&gt;) -&gt; any Collection&lt;Element&gt;</code></li>
<li><code>subscript(position: Int) -&gt; Element</code></li>
<li><code>func starts(with possiblePrefix: Any) -&gt; Bool</code></li>
<li><code>func starts(with possiblePrefix: Any, by areEquivalent: (Element, Element) throws -&gt; Bool) rethrows -&gt; Bool</code></li>
<li><code>func suffix(from start: Int) -&gt; [Element]</code></li>
<li><code>func suffix(_ maxLength: Int) -&gt; [Element]</code></li>
<li><code>func sorted() -&gt; [Element]</code></li>
<li><code>func sorted(by areInIncreasingOrder: (Element, Element) throws -&gt; Bool) rethrows -&gt; [Element]</code></li>
<li><code>var startIndex: Int</code></li>
<li><code>var count: Int</code></li>
<li><code>func count&lt;E&gt;(where: (E) throws -> Bool) rethrows -> Int</code></li>
<li><code>func withContiguousStorageIfAvailable&lt;R&gt;(_ body: (Any) throws -&gt; R) rethrows -&gt; R?</code></li>
<li><code>func forEach(_ body: (Element) throws -&gt; Void) rethrows</code></li>
<li><code>func drop(while predicate: (Element) throws -&gt; Bool) rethrows -&gt; [Element]</code></li>
<li><code>func dropFirst(_ k: Int = 1) -&gt; [Element]</code></li>
<li><code>func dropLast(_ k: Int = 1) -&gt; [Element]</code></li>
<li><code>func enumerated() -&gt; any Sequence&lt;(offset: Int, element: Element)&gt;</code></li>
<li><code>func filter(_ isIncluded: (Element) throws -&gt; Bool) rethrows -&gt; [Element]</code></li>
<li><code>func first(where predicate: (Element) throws -&gt; Bool) rethrows -&gt; Element?</code></li>
<li><code>func map&lt;RE&gt;(_ transform: (Element) throws -&gt; RE) rethrows -&gt; [RE]</code></li>
<li><code>func max(by areInIncreasingOrder: (Element, Element) throws -&gt; Bool) rethrows -&gt; Element?</code></li>
<li><code>func min(by areInIncreasingOrder: (Element, Element) throws -&gt; Bool) rethrows -&gt; Element?</code></li>
<li><code>func reduce&lt;R&gt;(_ initialResult: R, _ nextPartialResult: (_ partialResult: R, Element) throws -&gt; R) rethrows -&gt; R</code></li>
<li><code>func reduce&lt;R&gt;(into initialResult: R, _ updateAccumulatingResult: (_ partialResult: inout R, Element) throws -&gt; Void) rethrows -&gt; R</code></li>
<li><code>func reversed() -&gt; [Element]</code></li>
<li><code>func shuffled() -&gt; [Element]</code></li>
<li><code>func shuffled&lt;T: RandomNumberGenerator&gt;(using generator: inout T) -&gt; [Element]</code></li>
<li><code>func flatMap&lt;RE&gt;(_ transform: (Element) throws -&gt; any Sequence&lt;RE&gt;) rethrows -&gt; [RE]</code></li>
<li><code>func compactMap&lt;RE&gt;(_ transform: (Element) throws -&gt; RE?) rethrows -&gt; [RE]</code></li>
<li><code>func sorted(by areInIncreasingOrder: (Element, Element) throws -&gt; Bool) rethrows -&gt; [Element]</code></li>
<li><code>func joined&lt;RE&gt;() -&gt; [RE] where Element: Sequence&lt;RE&gt;</code></li>
<li><code>func joined&lt;RE&gt;(separator: any Sequence&lt;RE&gt;) -&gt; [RE] where Element: Sequence&lt;RE&gt;</code></li>
<li><code>func joined(separator: String) -&gt; String</code></li>
<li><code>func starts(with possiblePrefix: Any) -&gt; Bool</code></li>
<li><code>func contains(_ element: Element) -&gt; Bool</code></li>
<li><code>func min() -&gt; Element?</code></li>
<li><code>func max() -&gt; Element?</code></li>
<li><code>func sorted() -&gt; [Element]</code></li>
<li><code>var startIndex: Int</code></li>
<li><code>var endIndex: Int</code></li>
<li><code>var indices: any Sequence&lt;Int&gt;</code></li>
<li><code>func index(_ i: Int, offsetBy distance: Int) -&gt; Int</code></li>
<li><code>func distance(from start: Int, to end: Int) -&gt; Int</code></li>
<li><code>func index(after i: Int) -&gt; Int</code></li>
<li><code>func formIndex(after i: inout Int)</code></li>
<li><code>func formIndex(_ i: inout Int, offsetBy distance: Int)</code></li>
<li><code>func randomElement() -&gt; Element?</code></li>
<li><code>func randomElement(using generator: inout any RandomNumberGenerator) -&gt; Element?</code></li>
<li><code>mutating func popFirst() -&gt; Element?</code></li>
<li><code>var first: Element?</code></li>
<li><code>func prefix(upTo end: Int) -&gt; [Element]</code></li>
<li><code>func suffix(from start: Int) -&gt; [Element]</code></li>
<li><code>func prefix(through end: Int) -&gt; [Element]</code></li>
<li><code>mutating func removeFirst() -&gt; Element</code></li>
<li><code>mutating func removeFirst(_ k: Int)</code></li>
<li><code>func firstIndex(of element: Element) -&gt; Int?</code></li>
<li><code>func firstIndex(where predicate: (Element) throws -&gt; Bool) rethrows -&gt; Int?</code></li>
<li><code>mutating func shuffle()</code></li>
<li><code>mutating func shuffle&lt;T: RandomNumberGenerator&gt;(using generator: inout T)</code></li>
<li><code>mutating func sort()</code></li>
<li><code>mutating func sort(by areIncreasingOrder: (Element, Element) throws -&gt; Bool) rethrows</code></li>
<li><code>mutating func reverse()</code></li>
<li><code>mutating func swapAt(_ i: Int, _ j: Int)</code></li>
<li><code>mutating func append(_ newElement: Element)</code></li>
<li><code>mutating func append(contentsOf newElements: any Sequence&lt;Element&gt;)</code></li>
<li><code>mutating func insert(_ newElement: Element, at i: Int)</code></li>
<li><code>mutating func insert(contentsOf newElements: any Sequence&lt;Element&gt;, at i: Int)</code></li>
<li><code>mutating func remove(at i: Int) -&gt; Element</code></li>
<li><code>mutating func removeAll(keepingCapacity keepCapacity: Bool = false)</code></li>
<li><code>mutating func removeAll(where shouldBeRemoved: (Element) throws -&gt; Bool) rethrows</code></li>
<li><code>mutating func popLast() -&gt; Element?</code></li>
<li><code>mutating func removeLast() -&gt; Element</code></li>
<li><code>mutating func removeLast(_ k: Int)</code></li>
<li><code>subscript(bounds: Range&lt;Int&gt;) -&gt; any Collection&lt;Element&gt;</code></li>
<li><code>subscript(position: Int) -&gt; Element</code></li>
</ul>
        </details> 
      </td>
    </tr>
    <tr>
      <td>✅</td>
      <td><code>Comparable</code></td>
    </tr>
    <tr>
      <td>✅</td>
      <td><code>CustomDebugStringConvertible</code></td>
    </tr>
    <tr>
      <td>✅</td>
      <td><code>CustomStringConvertible</code></td>
    </tr>
    <tr>
      <td>🟢</td>
      <td>
        <details>
          <summary><code>Decodable</code></summary>
          <ul>
            <li>See <a href="#codable">Codable</a></li>
          </ul>
        </details> 
      </td>
    </tr>
    <tr>
      <td>🟢</td>
      <td>
        <details>
          <summary><code>Dictionary</code></summary>
          <ul>
<li><code>init()</code></li>
<li><code>init(minimumCapacity: Int)</code></li>
<li><code>init(uniqueKeysWithValues keysAndValues: any Sequence&lt;(Key, Value)&gt;)</code></li>
<li><code>func filter(_ isIncluded: ((Key, Value)) throws -&gt; Bool) rethrows -&gt; Dictionary&lt;Key, Value&gt;</code></li>
<li><code>subscript(key: Key) -&gt; Value?</code></li>
<li><code>subscript(key: Key, default defaultValue: Value) -&gt; Value</code></li>
<li><code>func mapValues&lt;T&gt;(_ transform: (Value) throws -&gt; T) rethrows -&gt; Dictionary&lt;Key, T&gt;</code></li>
<li><code>func compactMapValues&lt;T&gt;(_ transform: (Value) throws -&gt; T?) rethrows -&gt; Dictionary&lt;Key, T&gt;</code></li>
<li><code>mutating func updateValue(_ value: Value, forKey key: Key) -&gt; Value?</code></li>
<li><code>mutating func removeValue(forKey key: Key) -&gt; Value?</code></li>
<li><code>var keys: any Collection&lt;Key&gt;)</code></li>
<li><code>var values: any Collection&lt;Value&gt;</code></li>
<li><code>mutating func removeAll(keepingCapacity keepCapacity: Bool = false) </code></li>
<li>See <code>Collection</code> for collection API support</li>
          </ul>
        </details> 
      </td>
    </tr>
    <tr>
      <td>✅</td>
      <td><code>DiscardingTaskGroup</code></td>
    </tr>
    <tr>
      <td>🟢</td>
      <td>
        <details>
          <summary><code>Double</code></summary>
          <ul>
<li><code>static var nan: Double </code></li>
<li><code>static var infinity: Double </code></li>
<li><code>static var pi: Double </code></li>
<li><code>var isNan: Bool</code></li>
<li><code>var isFinite: Bool </code></li>
<li><code>var isInfinite: Bool </code></li>
<li><code>static func random(in range: Range&lt;Double&gt;) -> Double</code></li>
<li><code>func rounded() -> Double </code></li>
<li><code>func rounded(_ rule: FloatingPointRoundingRule) -> Double</code></li>
          </ul>
        </details> 
      </td>
    </tr>
    <tr>
      <td>🟢</td>
      <td>
        <details>
          <summary><code>Encodable</code></summary>
          <ul>
            <li>See [Codable](#codable)</li>
          </ul>
        </details> 
      </td>
    </tr>
    <tr>
      <td>✅</td>
      <td><code>Equatable</code></td>
    </tr>
    <tr>
      <td>✅</td>
      <td><code>Error</code></td>
    </tr>
    <tr>
      <td>✅</td>
      <td><code>fatalError</code></td>
    </tr>
    <tr>
      <td>🟢</td>
      <td>
        <details>
          <summary><code>Float</code></summary>
          <ul>
<li><code>static var nan: Float</code></li>
<li><code>static var infinity: Float</code></li>
<li><code>static var pi: Float</code></li>
<li><code>var isNan: Bool</code></li>
<li><code>var isFinite: Bool </code></li>
<li><code>var isInfinite: Bool </code></li>
<li><code>static func random(in range: Range&lt;Float>) -> Float</code></li>
<li><code>func rounded() -> Float</code></li>
<li><code>func rounded(_ rule: FloatingPointRoundingRule) -> Float</code></li>
          </ul>
        </details> 
      </td>
    </tr>
   <tr>
      <td>✅</td>
      <td><code>Hashable</code></td>
    </tr>
   <tr>
      <td>✅</td>
      <td><code>Hasher</code></td>
    </tr>
   <tr>
      <td>✅</td>
      <td><code>Identifiable</code></td>
    </tr>
    <tr>
      <td>🟢</td>
      <td>
        <details>
          <summary><code>Int8</code></summary>
          <ul>
<li><code>static var min: Int8</code></li>
<li><code>static var max: Int8</code></li>
<li><code>static func random(in range: Range&lt;Int8&gt;) -> Int8</code></li>
<li><code>static func random(in range: Range&lt;Int8&gt;, using gen: inout RandomNumberGenerator) -> Int8</code></li>
          </ul>
        </details> 
      </td>
    </tr>
    <tr>
      <td>🟢</td>
      <td>
        <details>
          <summary><code>Int16</code></summary>
          <ul>
<li><code>static var min: Int16 </code></li>
<li><code>static var max: Int16 </code></li>
<li><code>static func random(in range: Range&lt;Int16&gt;) -> Int16</code></li>
<li><code>static func random(in range: Range&lt;Int16&gt;, using gen: inout RandomNumberGenerator) -> Int16</code></li>
          </ul>
        </details> 
      </td>
    </tr>
    <tr>
      <td>🟢</td>
      <td>
        <details>
          <summary><code>Int32</code></summary>
          <ul>
<li><code>static var min: Int32 </code></li>
<li><code>static var max: Int32 </code></li>
<li><code>static func random(in range: Range&lt;Int32&gt;) -> Int32</code></li>
<li><code>static func random(in range: Range&lt;Int32&gt;, using gen: inout RandomNumberGenerator) -> Int32</code></li>
          </ul>
        </details> 
      </td>
    </tr>
    <tr>
      <td>🟢</td>
      <td>
        <details>
          <summary><code>Int</code></summary>
          <ul>
            <li>Kotlin <code>Ints</code> are 32 bit</li>
<li><code>static var min: Int </code></li>
<li><code>static var max: Int </code></li>
<li><code>static func random(in range: Range&lt;Int&gt;) -> Int</code></li>
<li><code>static func random(in range: Range&lt;Int&gt;, using gen: inout RandomNumberGenerator) -> Int</code></li>
          </ul>
        </details> 
      </td>
    </tr>
    <tr>
      <td>🟢</td>
      <td>
        <details>
          <summary><code>Int64</code></summary>
          <ul>
<li><code>static var min: Int64 </code></li>
<li><code>static var max: Int64 </code></li>
<li><code>static func random(in range: Range&lt;Int64&gt;) -> Int64</code></li>
<li><code>static func random(in range: Range&lt;Int64&gt;, using gen: inout RandomNumberGenerator) -> Int64</code></li>
          </ul>
        </details> 
      </td>
    </tr>
    <tr>
      <td>🟢</td>
      <td><code>@MainActor</code></td>
    </tr>
    <tr>
      <td>🟢</td>
      <td>
        <details>
          <summary><code>MainActor</code></summary>
          <ul>
            <li><code>static func run&lt;T>(body: () throws -> T) async -> T</code></li>
          </ul>
        </details> 
      </td>
    </tr>
    <tr>
      <td>🟢</td>
      <td>
       <details>
          <summary><code>math.h</code></summary>
<ul>
<li><code>var M_E: Double</code></li>
<li><code>var M_LOG2E: Double</code></li>
<li><code>var M_LOG10E: Double</code></li>
<li><code>var M_LN2: Double</code></li>
<li><code>var M_LN10: Double</code></li>
<li><code>var M_PI: Double</code></li>
<li><code>func acosf(_ x: Float) -> Float</code></li>
<li><code>func acos(_ x: Double) -> Double</code></li>
<li><code>func acosl(_ x: Double) -> Double</code></li>
<li><code>func asinf(_ x: Float) -> Float</code></li>
<li><code>func asin(_ x: Double) -> Double</code></li>
<li><code>func asinl(_ x: Double) -> Double</code></li>
<li><code>func atanf(_ x: Float) -> Float</code></li>
<li><code>func atan(_ x: Double) -> Double</code></li>
<li><code>func atanl(_ x: Double) -> Double</code></li>
<li><code>func atan2f(_ x: Float, _ y: Float) -> Float</code></li>
<li><code>func atan2(_ x: Double, _ y: Double) -> Double</code></li>
<li><code>func atan2l(_ x: Double, _ y: Double) -> Double</code></li>
<li><code>func cosf(_ x: Float) -> Float</code></li>
<li><code>func cos(_ x: Double) -> Double</code></li>
<li><code>func cosl(_ x: Double) -> Double</code></li>
<li><code>func sinf(_ x: Float) -> Float</code></li>
<li><code>func sin(_ x: Double) -> Double</code></li>
<li><code>func sinl(_ x: Double) -> Double</code></li>
<li><code>func tanf(_ x: Float) -> Float</code></li>
<li><code>func tan(_ x: Double) -> Double</code></li>
<li><code>func tanl(_ x: Double) -> Double</code></li>
<li><code>func acoshf(_ x: Float) -> Float</code></li>
<li><code>func acosh(_ x: Double) -> Double</code></li>
<li><code>func acoshl(_ x: Double) -> Double</code></li>
<li><code>func asinhf(_ x: Float) -> Float</code></li>
<li><code>func asinh(_ x: Double) -> Double</code></li>
<li><code>func asinhl(_ x: Double) -> Double</code></li>
<li><code>func atanhf(_ x: Float) -> Float</code></li>
<li><code>func atanh(_ x: Double) -> Double</code></li>
<li><code>func atanhl(_ x: Double) -> Double</code></li>
<li><code>func coshf(_ x: Float) -> Float</code></li>
<li><code>func cosh(_ x: Double) -> Double</code></li>
<li><code>func coshl(_ x: Double) -> Double</code></li>
<li><code>func sinhf(_ x: Float) -> Float</code></li>
<li><code>func sinh(_ x: Double) -> Double</code></li>
<li><code>func sinhl(_ x: Double) -> Double</code></li>
<li><code>func tanhf(_ x: Float) -> Float</code></li>
<li><code>func tanh(_ x: Double) -> Double</code></li>
<li><code>func tanhl(_ x: Double) -> Double</code></li>
<li><code>func expf(_ x: Float) -> Float</code></li>
<li><code>func exp(_ x: Double) -> Double</code></li>
<li><code>func expl(_ x: Double) -> Double</code></li>
<li><code>func exp2f(_ x: Float) -> Float</code></li>
<li><code>func exp2(_ x: Double) -> Double</code></li>
<li><code>func exp2l(_ x: Double) -> Double</code></li>
<li><code>func expm1f(_ x: Float) -> Float</code></li>
<li><code>func expm1(_ x: Double) -> Double</code></li>
<li><code>func expm1l(_ x: Double) -> Double</code></li>
<li><code>func logf(_ x: Float) -> Float</code></li>
<li><code>func log(_ x: Double) -> Double</code></li>
<li><code>func logl(_ x: Double) -> Double</code></li>
<li><code>func log10f(_ x: Float) -> Float</code></li>
<li><code>func log10(_ x: Double) -> Double</code></li>
<li><code>func log10l(_ x: Double) -> Double</code></li>
<li><code>func log2f(_ x: Float) -> Float</code></li>
<li><code>func log2(_ x: Double) -> Double</code></li>
<li><code>func log2l(_ x: Double) -> Double</code></li>
<li><code>func log1pf(_ x: Float) -> Float</code></li>
<li><code>func log1p(_ x: Double) -> Double</code></li>
<li><code>func log1pl(_ x: Double) -> Double</code></li>
<li><code>func logbf(_ x: Float) -> Float</code></li>
<li><code>func logb(_ x: Double) -> Double</code></li>
<li><code>func logbl(_ x: Double) -> Double</code></li>
<li><code>func abs(_ x: Double) -> Double</code></li>
<li><code>func abs(_ x: Int) -> Int</code></li>
<li><code>func abs(_ x: Int64) -> Int64</code></li>
<li><code>func fabsf(_ x: Float) -> Float</code></li>
<li><code>func fabs(_ x: Double) -> Double</code></li>
<li><code>func fabsl(_ x: Double) -> Double</code></li>
<li><code>func cbrtf(_ x: Float) -> Float</code></li>
<li><code>func cbrt(_ x: Double) -> Double</code></li>
<li><code>func cbrtl(_ x: Double) -> Double</code></li>
<li><code>func hypotf(_ x: Float, _ y: Float) -> Float</code></li>
<li><code>func hypot(_ x: Double, _ y: Double) -> Double</code></li>
<li><code>func hypotl(_ x: Double, _ y: Double) -> Double</code></li>
<li><code>func powf(_ x: Float, _ y: Float) -> Float</code></li>
<li><code>func pow(_ x: Double, _ y: Double) -> Double</code></li>
<li><code>func powl(_ x: Double, _ y: Double) -> Double</code></li>
<li><code>func sqrtf(_ x: Float) -> Float</code></li>
<li><code>func sqrt(_ x: Double) -> Double</code></li>
<li><code>func sqrtl(_ x: Double) -> Double</code></li>
<li><code>func ceilf(_ x: Float) -> Float</code></li>
<li><code>func ceil(_ x: Double) -> Double</code></li>
<li><code>func ceill(_ x: Double) -> Double</code></li>
<li><code>func floorf(_ x: Float) -> Float</code></li>
<li><code>func floor(_ x: Double) -> Double</code></li>
<li><code>func floorl(_ x: Double) -> Double</code></li>
<li><code>func roundf(_ x: Float) -> Float</code></li>
<li><code>func round(_ x: Double) -> Double</code></li>
<li><code>func roundl(_ x: Double) -> Double</code></li>
<li><code>func fmodf(_ x: Float, _ y: Float) -> Float</code></li>
<li><code>func fmod(_ x: Double, _ y: Double) -> Double</code></li>
<li><code>func fmodl(_ x: Double, _ y: Double) -> Double</code></li>
<li><code>func remainderf(_ x: Float, _ y: Float) -> Float</code></li>
<li><code>func remainder(_ x: Double, _ y: Double) -> Double</code></li>
<li><code>func remainderl(_ x: Double, _ y: Double) -> Double</code></li>
<li><code>func fmaxf(_ x: Float, _ y: Float) -> Float</code></li>
<li><code>func fmax(_ x: Double, _ y: Double) -> Double</code></li>
<li><code>func fmaxl(_ x: Double, _ y: Double) -> Double</code></li>
<li><code>func fminf(_ x: Float, _ y: Float) -> Float</code></li>
<li><code>func fmin(_ x: Double, _ y: Double) -> Double</code></li>
<li><code>func fminl(_ x: Double, _ y: Double) -> Double</code></li>
</ul>
        </details> 
      </td>
    </tr>
    <tr>
      <td>✅</td>
      <td><code>max(_:_:)</code></td>
    </tr>
    <tr>
      <td>✅</td>
      <td><code>min(_:_:)</code></td>
    </tr>
    <tr>
      <td>✅</td>
      <td><code>ObjectIdentifier</code></td>
    </tr>
    <tr>
      <td>✅</td>
      <td><code>OptionSet</code></td>
    </tr>
    <tr>
      <td>✅</td>
      <td><code>precondition</code></td>
    </tr>
    <tr>
      <td>✅</td>
      <td><code>preconditionFailure</code></td>
    </tr>
    <tr>
      <td>✅</td>
      <td><code>RandomNumberGenerator</code></td>
    </tr>
    <tr>
      <td>🟠</td>
      <td>
        <details>
          <summary><code>Range</code></summary>
          <ul>
            <li>Only <code>Range&lt;Int&gt;</code> is generally supported</li>
<li><code>var lowerBound: Bound</code></li>
<li><code>var upperBound: Bound</code></li>
<li><code>func contains(_ element: Bound) -> Bool</code></li>
<li><code>var isEmpty: Bool</code></li>
<li><code>func map&lt;RE&gt;(_ transform: (Bound) throws -> RE) rethrows -> [RE]</code></li>
          </ul>
        </details> 
      </td>
    </tr>
    <tr>
      <td>✅</td>
      <td><code>RawRepresentable</code></td>
    </tr>
    <tr>
      <td>🟠</td>
      <td>
       <details>
          <summary><code>Regex</code></summary>
          <ul>
            <li><code>init(_ string: String)</code></li>
            <li><code>func matches(_ string: String) -> [Match]</code></li>
            <li><code>func replace(_ string: String, with replacement: String) -> String</code></li>
          </ul>
        </details> 
      </td>
    </tr>
    <tr>
      <td>🟠</td>
      <td>
       <details>
          <summary><code>Regex.Match</code></summary>
          <ul>
            <li><code>var count: Int</code></li>
            <li><code>subscript(index: Int) -> MatchGroup</code></li>
          </ul>
        </details> 
      </td>
    </tr>
    <tr>
      <td>🟠</td>
      <td>
       <details>
          <summary><code>Regex.MatchGroup</code></summary>
          <ul>
            <li><code>var substring: Substring?</code></li>
          </ul>
        </details> 
      </td>
    </tr>
    <tr>
      <td>✅</td>
      <td><code>Result</code></td>
    </tr>
    <tr>
      <td>🟡</td>
      <td>
       <details>
          <summary><code>swap(_:_:)</code></summary>
          <ul>
            <li>Does not support swapping values in arrays and other data structures</li>
          </ul>
        </details> 
      </td>
    </tr>
    <tr>
      <td>🟢</td>
      <td>
       <details>
          <summary><code>Set</code></summary>
          <ul>
<li><code>init()</code></li>
<li><code>init(_ sequence: any Sequence&lt;Element>)</code></li>
            <li>See <code>Collection</code></li>
            <li>See <code>SetAlgebra</code></li>
          </ul>
        </details> 
      </td>
    </tr>
    <tr>
      <td>🟢</td>
      <td>
       <details>
          <summary><code>SetAlgebra</code></summary>
          <ul>
<li><code>func contains(_ element: Element) -&gt; Bool</code></li>
<li><code>func union(_ other: Self) -&gt; Self</code></li>
<li><code>func intersection(_ other: Self) -&gt; Self</code></li>
<li><code>func symmetricDifference(_ other: Self) -&gt; Self</code></li>
<li><code>mutating func insert(_ newMember: Element) -&gt; (inserted: Bool, memberAfterInsert: Element)</code></li>
<li><code>mutating func remove(_ member: Element) -&gt; Element?</code></li>
<li><code>mutating func update(with newMember: Element) -&gt; Element?</code></li>
<li><code>mutating func formUnion(_ other: Self)</code></li>
<li><code>mutating func formIntersection(_ other: Self)</code></li>
<li><code>mutating func formSymmetricDifference(_ other: Self)</code></li>
<li><code>func subtracting(_ other: Self) -&gt; Self</code></li>
<li><code>func isSubset(of other: Self) -&gt; Bool</code></li>
<li><code>func isDisjoint(with other: Self) -&gt; Bool</code></li>
<li><code>func isSuperset(of other: Self) -&gt; Bool</code></li>
<li><code>var isEmpty: Bool</code></li>
<li><code>mutating func subtract(_ other: Self)</code></li>
<li><code>func isStrictSubset(of other: Self) -&gt; Bool</code></li>
<li><code>func isStrictSuperset(of other: Self) -&gt; Bool</code></li>
          </ul>
        </details> 
      </td>
    </tr>
    <tr>
      <td>🟢</td>
      <td>
       <details>
          <summary><code>String</code></summary>
          <ul>
            <li>Kotlin strings are **not** mutable</li>
<li><code>init(data: Data, encoding: StringEncoding)</code></li>
<li><code>init(bytes: [UInt8], encoding: StringEncoding)</code></li>
<li><code>init(contentsOf: URL)</code></li>
<li><code>var capitalized: String</code></li>
<li><code>var deletingLastPathComponent: String</code></li>
<li><code>func replacingOccurrences(of search: String, with replacement: String) -> String</code></li>
<li><code>func components(separatedBy separator: String) -> [String]</code></li>
<li><code>func trimmingCharacters(in set: CharacterSet) -> String</code></li>
<li><code>var utf8Data: Data</code></li>
<li><code>func data(using: StringEncoding, allowLossyConversion: Bool = true) -> Data?</code></li>
<li><code>var utf8: [UInt8]</code></li>
<li><code>var utf16: [UInt8]</code></li>
<li><code>var unicodeScalars: [UInt8]</code></li>
            <li>See <code>Collection</code></li>
            <li>See <code>SkipFoundation</code> for additional string API from <code>Foundation</code></li>
          </ul>
        </details> 
      </td>
    </tr>
    <tr>
      <td>✅</td>
      <td><code>strlen</code></td>
    </tr>
    <tr>
      <td>✅</td>
      <td><code>strncmp</code></td>
    </tr>
    <tr>
      <td>🟢</td>
      <td>
       <details>
          <summary><code>Substring</code></summary>
          <ul>
            <li>See <code>String</code></li>
          </ul>
        </details> 
      </td>
    </tr>
    <tr>
      <td>✅</td>
      <td><code>SystemRandomNumberGenerator</code></td>
    </tr>
    <tr>
      <td>🟡</td>
      <td>
        <details>
          <summary><code>Task</code></summary>
          <ul>
<li><code>init(priority: TaskPriority? = nil, operation: @escaping () async throws -> Success)</code></li>
<li><code>static func detached(priority: TaskPriority? = nil, operation: @escaping () async -> Success) -> Task&lt;Success, Failure></code></li>
<li><code>var value: Success</code></li>
<li><code>func cancel()</code></li>
<li><code>static func yield() async</code></li>
<li><code>var isCancelled: Bool</code></li>
<li><code>static var isCancelled: Bool</code></li>
<li><code>static func checkCancellation() throws</code></li>
<li><code>static func sleep(nanoseconds duration: UInt64) async throws</code></li>
<li><code>static var min: UInt8 </code></li>
          </ul>
        </details> 
      </td>
    </tr>
    <tr>
      <td>✅</td>
      <td><code>TaskGroup</code></td>
    </tr>
    <tr>
      <td>✅</td>
      <td><code>ThrowingDiscardingTaskGroup</code></td>
    </tr>
    <tr>
      <td>✅</td>
      <td><code>ThrowingTaskGroup</code></td>
    </tr>
    <tr>
      <td>✅</td>
      <td><code>type(of:)</code></td>
    </tr>
    <tr>
      <td>🟢</td>
      <td>
        <details>
          <summary><code>UInt8</code></summary>
          <ul>
<li><code>static var min: UInt8 </code></li>
<li><code>static var max: UInt8 </code></li>
<li><code>static func random(in range: Range&lt;UInt8&gt;) -> UInt8</code></li>
<li><code>static func random(in range: Range&lt;UInt8&gt;, using gen: inout RandomNumberGenerator) -> UInt8</code></li>
          </ul>
        </details> 
      </td>
    </tr>
    <tr>
      <td>🟢</td>
      <td>
        <details>
          <summary><code>UInt16</code></summary>
          <ul>
<li><code>static var min: UInt16 </code></li>
<li><code>static var max: UInt16 </code></li>
<li><code>static func random(in range: Range&lt;UInt16&gt;) -> UInt16</code></li>
<li><code>static func random(in range: Range&lt;UInt16&gt;, using gen: inout RandomNumberGenerator) -> UInt16</code></li>
          </ul>
        </details> 
      </td>
    </tr>
    <tr>
      <td>🟢</td>
      <td>
        <details>
          <summary><code>UInt32</code></summary>
          <ul>
<li><code>static var min: UInt32 </code></li>
<li><code>static var max: UInt32 </code></li>
<li><code>static func random(in range: Range&lt;UInt32&gt;) -> UInt32</code></li>
<li><code>static func random(in range: Range&lt;UInt32&gt;, using gen: inout RandomNumberGenerator) -> UInt32</code></li>
          </ul>
        </details> 
      </td>
    </tr>
    <tr>
      <td>🟢</td>
      <td>
        <details>
          <summary><code>UInt</code></summary>
          <ul>
            <li>Kotlin <code>UInts</code> are 32 bit</li>
<li><code>static var min: UInt </code></li>
<li><code>static var max: UInt </code></li>
<li><code>static func random(in range: Range&lt;UInt&gt;) -> UInt</code></li>
<li><code>static func random(in range: Range&lt;UInt&gt;, using gen: inout RandomNumberGenerator) -> UInt</code></li>
          </ul>
        </details> 
      </td>
    </tr>
    <tr>
      <td>🟢</td>
      <td>
        <details>
          <summary><code>UInt64</code></summary>
          <ul>
<li><code>static var min: UInt64 </code></li>
<li><code>static var max: UInt64 </code></li>
<li><code>static func random(in range: Range&lt;UInt64&gt;) -> UInt64</code></li>
<li><code>static func random(in range: Range&lt;UInt64&gt;, using gen: inout RandomNumberGenerator) -> UInt64</code></li>
          </ul>
        </details> 
      </td>
    </tr>
    <tr>
      <td>✅</td>
      <td><code>withDiscardingTaskGroup</code></td>
    </tr>
    <tr>
      <td>✅</td>
      <td><code>withTaskCancellationHandler</code></td>
    </tr>
    <tr>
      <td>✅</td>
      <td><code>withThrowingTaskGroup</code></td>
    </tr>
    <tr>
      <td>✅</td>
      <td><code>withThrowingDiscardingTaskGroup</code></td>
    </tr>
    <tr>
      <td>✅</td>
      <td><code>withThrowingTaskGroup</code></td>
    </tr>
  </tbody>
</table>

## Topics

### Collections

Collections are perhaps the most complex part of the Swift standard library, and of SkipLib. Swift's comprehensive collection protocols allow `Array`, `Set`, `Dictionary`, `String`, and other types to all share a common set of API, including iteration, `map`, `reduce`, and much more.

Corresponding Kotlin types - `List`, `Set`, `Map`, `String`, etc - do not share a similarly rich API set. As a result, SkipLib must duplicate collection protocol implementations in both `Collections.kt` and `String.kt`, and must duplicate `SetAlgebra` implementations in both `Set.kt` and `OptionSet.kt`.

See the explanatory comments in `Collections.kt` for more information on the design of SkipLib's internal collections support.

#### Converting between Skip and Kotlin collections

It is important to note that Skip's `skip.lib.Array` is not the same as a Java/Kotlin `kotlin.Array`, so if you need to pass a Skip array into a Java API that expects a Java-style Array, you need to convert it like so:

```swift
#if SKIP
let skipArray: skip.lib.Array<String> = ["ABC", "DEF"]
let kotlinList: kotlin.collections.List<String> = skipArray.toList()
let kotlinArray: kotlin.Array<String> = kotlinList.toTypedArray()
java.util.Arrays.sort(kotlinArray) // same as a Java array
#endif
```

### Codable

Skip is able to synthesize default `Codable` conformance for the Android versions of your Swift types. The Android versions will encode and decode exactly like their Swift source types. Skip also supports your custom `CodingKeys` as well as your custom `encode(to:)` and `init(from:)` functions for encoding and decoding. 

There are, however, a few restrictions:

- Skip cannot synthesize `Codable` conformance for enums that are not `RawRepresentable`. You must implement the required protocol functions yourself.
- If you implement your own `encode` function or `init(from:)` decoding constructor and you use `CodingKeys`, you must declare your own `CodingKeys` enum. You cannot rely on the synthesized enum.
- `Array`, `Set`, and `Dictionary` are fully supported, but nesting of these types is limited. So for example Skip can encode and decode `Array<MyCodableType>` and `Dictionary<String, MyCodableType>`, but not `Array<Dictionary<String, MyCodableType>>`. Two forms of container nesting **are** currently supported: arrays-of-arrays - e.g. `Array<Array<MyCodableType>>` - and dictionaries-of-array-values - e.g. `Dictionary<String, Array<MyCodableType>>`. In practice, other nesting patters are rare.
- When calling `decode`, **you must supply a concrete type literal to decode**. This applies to both top-level `Decoders` like `JSONDecoder` as well as containers like `KeyedDecodingContainer`. The following will work:

    ```swift
    let object = try decoder.decode(MyType.self, from: jsonData) 
    ```

    But these examples will not work:

    ```swift
    let type = MyType.self
    let object = try decoder.decode(type, from: jsonData)

    // T is a generic type
    let object = try decoder.decode(T.self, from: jsonData)
    ```

It is common for developers to take advantage of `Decodable`-typed generic functions to be able to decode arbitrary types, so this last limitation is the most onerous. You must consider it when writing your decoding code, and it often requires refactoring existing decoding code being ported to Skip.

One mechanism to ease this restriction and allow you to decode unknown generic types is to write `inline` decoding functions that take advantage of Kotlin's *reified types*. Inline functions, however, come with their own limitations and tradeoffs. You can read more about this topic in the [Kotlin language documentation](https://kotlinlang.org/docs/inline-functions.html#reified-type-parameters). Skip automatically converts any Swift function with the `@inline(__always)` attribute into a Kotlin inline function with reified generics. 

For example, a function like the following **will work** with Skip, so long as you call it with a concrete `Response` type or with a generic `Response` type from another `inline` function:

```swift
@inline(__always) public func send<R: Request, Response: Decodable>(request: R) async throws -> Response {
    let data = try await download(request: request)
    return try jsonDecoder.decode(Response.self, from: data)
}
```

It transpiles to code like:

```kotlin
inline suspend fun <reified R, reified Response> send(request: R): Response where R: Request, Response: Decodable {
    val data = download(request = request)
    return jsonDecoder.decode(Response::class, from = data) 
} 
```

