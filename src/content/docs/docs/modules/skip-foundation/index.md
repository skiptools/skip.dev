---
title: SkipFoundation
layout: docs
note: This documentation section is derived from https://raw.githubusercontent.com/skiptools/skip-foundation/main/README.md using the scripts/syncdocs.sh script. Do not change the file here, change it there.
---

:::note[Source Repository]{icon="github"}
The skip-foundation framework is available at [https://github.com/skiptools/skip-foundation.git](https://source.skip.tools/skip-foundation.git), which can be checked out and tested with `skip test` once Skip is [installed](/docs/gettingstarted/).
:::

Foundation support for [Skip Lite](/docs/status#skip_lite) transpiled Swift.

See what API is currently implemented [here](#foundation-support).

## About 

SkipFoundation vends the `skip.foundation` Kotlin package. It is a reimplementation of Foundation for Kotlin on Android. Its goal is to mirror as much of Foundation as possible, allowing Skip developers to use Foundation API with confidence.

SkipFoundation also implements portions of the CryptoKit API.

## Dependencies

SkipFoundation depends on the [skip](https://source.skip.tools/skip) transpiler plugin as well as the [SkipLib](/docs/modules/skip-lib) package.

SkipFoundation is part of the core *Skip Core Frameworks* and is not intended to be imported directly.
The module is transparently adopted through the translation of `import Foundation` into `import skip.foundation.*` by the Skip transpiler.

### Android Libraries

- SkipFoundation includes source code from the [UrlEncoderUtil](https://github.com/ethauvin/urlencoder) library to implement percent escaping.

## Status

SkipFoundation supports many of the Foundation framework's most common APIs, but there are many more that are not yet ported. See [Foundation Support](#foundation-support).

When you want to use a Foundation API that has not been implemented, you have options. You can try to find a workaround using only supported API, embed Kotlin code directly as described in the [Skip docs](/docs), or [add support to SkipFoundation](#contributing). If you choose to enhance SkipFoundation itself, please consider [contributing](#contributing) your code back for inclusion in the official release.

## Contributing

We welcome contributions to SkipFoundation. The Skip product [documentation](/docs/contributing/) includes helpful instructions and tips on local Skip library development. 

The most pressing need is to implement more of the most-used Foundation APIs.
To help fill in unimplemented API in SkipFoundation:

1. Find unimplemented API.
1. Write an appropriate Kotlin implementation. See [Implementation Strategy](#implementation-strategy) below.
1. Edit the corresponding tests to make sure they are no longer skipped, and that they pass. If there aren't existing tests, write some. See [Tests](#tests).
1. [Submit a PR.](https://source.skip.tools/skip-foundation/pulls)

Other forms of contributions such as test cases, comments, and documentation are also welcome!

## Implementation Strategy

The goal of SkipFoundation is to mirror the Foundation framework for Android. When possible, `SkipFoundation` types wrap corresponding Kotlin or Java foundation types. When a `SkipFoundation` type wraps a corresponding Kotlin or Java type, please conform to the `skip.lib.KotlinConverting<T>` protocol, which means adding a `.kotlin()` function:

```swift
#if SKIP
extension Calendar: KotlinConverting<java.util.Calendar> {
    public override func kotlin(nocopy: Bool = false) -> java.util.Calendar {
        return nocopy ? platformValue : platformValue.clone() as java.util.Calendar
    }
}
#endif
```

You should also implement a constructor that accepts the equivalent Kotlin or Java object.

## Tests

SkipFoundation's `Tests/` folder contains the entire set of official Foundation framework test cases. Through the magic of [SkipUnit](/docs/modules/skip-unit), this allows us to validate our SkipFoundation API implementations on Android against the same test suite used by the Foundation team on iOS.

It is SkipFoundation's goal to include - and pass - as much of the official test suite as possible.

## Foundation Support

The following table summarizes SkipFoundation's Foundation API support on Android. Anything not listed here is likely not supported. Note that in your iOS-only code - i.e. code within `#if !SKIP` blocks - you can use any Foundation API you want.

Support levels:

  - ✅ – Full
  - 🟢 – High
  - 🟡 – Medium 
  - 🟠 – Low

<table>
  <thead><th>Support</th><th>API</th></thead>
  <tbody>
    <tr>
      <td>🟠</td>
      <td>
        <details>
          <summary><code>AttributedString</code></summary>
          <ul>
<li><code>init()</code></li>
<li><code>init(stringLiteral: String)</code></li>
<li><code>init(markdown: String)</code></li>
<li><code>init(localized keyAndValue: String.LocalizationValue, table: String? = nil, bundle: Bundle? = nil, locale: Locale? = nil, comment: String? = nil)</code></li>
<li><code>init(localized key: String, table: String? = nil, bundle: Bundle? = nil, locale: Locale = Locale.current, comment: String? = nil)</code></li>
          </ul>
        </details> 
      </td>
    </tr>
    <tr>
      <td>🟡</td>
      <td>
        <details>
          <summary><code>Bundle</code></summary>
          <ul>
<li><code>static var main: Bundle</code></li>
<li><code>static var module: Bundle</code></li>
<li><code>init?(path: String)</code></li>
<li><code>init?(url: URL)</code></li>
<li><code>init(for forClass: AnyClass)</code></li>
<li><code>init()</code></li>
<li><code>var bundleURL: URL</code></li>
<li><code>var resourceURL: URL?</code></li>
<li><code>var bundlePath: String</code></li>
<li><code>var resourcePath: String?</code></li>
<li><code>func url(forResource: String? = nil, withExtension: String? = nil, subdirectory: String? = nil, localization: String? = nil) -> URL?</code></li>
<li><code>func path(forResource: String? = nil, ofType: String? = nil, inDirectory: String? = nil, forLocalization: String? = nil) -> String?</code></li>
<li><code>var developmentLocalization: String</code></li>
<li><code>var localizations: [String]</code></li>
<li><code>func localizedString(forKey key: String, value: String?, table tableName: String?) -> String</code></li>
<li><code>var localizations: [String]</code></li>
          </ul>
        </details> 
      </td>
    </tr>
   <tr>
      <td>🟡</td>
      <td>
        <details>
          <summary><code>Calendar</code></summary>
          <ul>
            <li>Only <code>.gregorian</code> and <code>.iso8601</code> identifiers are supported</li>           
<li><code>init(identifier: Calendar.Identifier)</code></li>
<li><code>static var current: Calendar</code></li>
<li><code>var locale: Locale</code></li>
<li><code>var timeZone: TimeZone</code></li>
<li><code>var identifier: Calendar.Identifier</code></li>
<li><code>var eraSymbols: [String]</code></li>
<li><code>var monthSymbols: [String]</code></li>
<li><code>var shortMonthSymbols: [String]</code></li>
<li><code>var weekdaySymbols: [String]</code></li>
<li><code>var shortWeekdaySymbols: [String]</code></li>
<li><code>var amSymbol: String</code></li>
<li><code>var pmSymbol: String</code></li>
<li><code>func date(from components: DateComponents) -> Date?</code></li>
<li><code>func dateComponents(in zone: TimeZone? = nil, from date: Date) -> DateComponents</code></li>
<li><code>func dateComponents(_ components: Set&lt;Calendar.Component>, from start: Date, to end: Date) -> DateComponents</code></li>
<li><code>func dateComponents(_ components: Set&lt;Calendar.Component>, from date: Date) -> DateComponents</code></li>
<li><code>func component(_ component: Calendar.Component, from date: Date) -> Int</code></li>
<li><code>func date(byAdding components: DateComponents, to date: Date, wrappingComponents: Bool = false) -> Date?</code></li>
<li><code>func date(byAdding component: Calendar.Component, value: Int, to date: Date, wrappingComponents: Bool = false) -> Date?</code></li>
<li><code>func isDateInWeekend(_ date: Date) -> Bool</code></li>
          </ul>
        </details> 
      </td>
    </tr>
   <tr>
      <td>🟠</td>
      <td>
        <details>
          <summary><code>CharacterSet</code></summary>
          <ul>
            <li>Vended character sets are not complete</li>
<li><code>static var whitespaces: CharacterSet</code></li>
<li><code>static var whitespacesAndNewlines: CharacterSet</code></li>
<li><code>static var newlines: CharacterSet</code></li>
<li><code>static var urlHostAllowed: CharacterSet</code></li>
<li><code>static var urlFragmentAllowed: CharacterSet</code></li>
<li><code>static var urlPathAllowed: CharacterSet</code></li>
<li><code>static var urlQueryAllowed: CharacterSet</code></li>
<li><code>init()</code></li>
<li><code>init(charactersIn: String)</code></li>
<li><code>func insert(_ character: Unicode.Scalar) -> (inserted: Bool, memberAfterInsert: Unicode.Scalar)</code></li>
<li><code>mutating func insert(charactersIn: String)</code></li>
<li><code>func update(with character: Unicode.Scalar) -> Unicode.Scalar?</code></li>
<li><code>func remove(_ character: Unicode.Scalar) -> Unicode.Scalar?</code></li>
<li><code>mutating func remove(charactersIn: String)</code></li>
<li><code>func contains(_ member: Unicode.Scalar) -> Bool</code></li>
<li><code>func union(_ other: CharacterSet) -> CharacterSet</code></li>
<li><code>mutating func formUnion(_ other: CharacterSet)</code></li>
<li><code>func intersection(_ other: CharacterSet) -> CharacterSet</code></li>
<li><code>mutating func formIntersection(_ other: CharacterSet)</code></li>
<li><code>func subtracting(_ other: CharacterSet)</code></li>
<li><code>mutating func subtract(_ other: CharacterSet)</code></li>
<li><code>func symmetricDifference(_ other: CharacterSet) -> CharacterSet</code></li>
<li><code>mutating func formSymmetricDifference(_ other: CharacterSet)</code></li>
<li><code>func isSuperset(of other: CharacterSet) -> Bool</code></li>
<li><code>func isSubset(of other: CharacterSet) -> Bool</code></li>
<li><code>func isDisjoint(with other: CharacterSet) -> Bool</code></li>
<li><code>func isStrictSubset(of other: CharacterSet) -> Bool</code></li>
<li><code>func isStrictSuperset(of other: CharacterSet) -> Bool</code></li>
<li><code>var isEmpty: Bool</code></li>
          </ul>
        </details> 
      </td>
    </tr>
    <tr>
      <td>✅</td>
      <td><code>CocoaError</code></td>
    </tr>
    <tr>
      <td>✅</td>
      <td><code>ComparisonResult</code></td>
    </tr>
   <tr>
      <td>🟠</td>
      <td>
        <details>
          <summary><code>CryptoKit</code></summary>
          <ul>
            <li>See the <a href="#cryptokit">CryptoKit</a> topic for details on supported API.</li>
          </ul>
        </details> 
      </td>
    </tr>
    <tr>
      <td>✅</td>
      <td><code>CustomNSError</code></td>
    </tr>
   <tr>
      <td>🟡</td>
      <td>
        <details>
          <summary><code>Data</code></summary>
          <ul>
<li><code>Data</code> does <strong>not</strong> conform to <code>Collection</code> protocols</li>
<li><code>init()</code></li>
<li><code>init(count: Int)</code></li>
<li><code>init(capacity: Int)</code></li>
<li><code>init(_ data: Data)</code></li>
<li><code>init(_ bytes: [UInt8], length: Int? = nil)</code></li>
<li><code>init(_ checksum: Digest)</code></li>
<li><code>init?(base64Encoded: String, options: Data.Base64DecodingOptions = [])</code></li>
<li><code>init(contentsOfFile filePath: String) throws</code></li>
<li><code>init(contentsOf url: URL, options: Data.ReadingOptions = [])</code></li>
<li><code>var count: Int</code></li>
<li><code>var isEmpty: Bool</code></li>
<li><code>var bytes: [UInt8]</code></li>
<li><code>var utf8String: String?</code></li>
<li><code>func base64EncodedString() -> String</code></li>
<li><code>func sha256() -> Data</code></li>
<li><code>func hex() -> String</code></li>
<li><code>mutating func reserveCapacity(_ minimumCapacity: Int)</code></li>
<li><code>mutating func append(_ other: Data)</code></li>
<li><code>mutating func append(contentsOf bytes: [UInt8])</code></li>
<li><code>mutating func append(contentsOf data: Data)</code></li>
<li><code>subscript(index: Int) -> UInt8</code></li>
<li><code>func write(to url: URL, options: Data.WritingOptions = []) throws</code></li>
          </ul>
        </details> 
      </td>
    </tr>
   <tr>
      <td>🟡</td>
      <td>
        <details>
          <summary><code>Date</code></summary>
          <ul>
<li>Formatting functions not supported with the exception of:</li>
<li><code>func ISO8601Format(_ style: Date.ISO8601FormatStyle = .iso8601) -> String</code></li>
<li><code>func formatted(date: Date.FormatStyle.DateStyle, time: Date.FormatStyle.TimeStyle) -> String</code></li>
          </ul>
        </details> 
      </td>
    </tr>
   <tr>
      <td>🟢</td>
      <td>
        <details>
          <summary><code>DateComponents</code></summary>
          <ul>
            <li><code>nanosecond</code>, <code>weekdayOrdinal</code>, <code>quarter</code>, <code>yearForWeekOfYear</code> are not supported</li>
          </ul>
        </details> 
      </td>
    </tr>
   <tr>
      <td>🟡</td>
      <td>
        <details>
          <summary><code>DateFormatter</code></summary>
          <ul>
<li><code>var dateStyle: DateFormatter.Style</code></li>
<li><code>var timeStyle: DateFormatter.Style</code></li>
<li><code>var isLenient: Bool</code></li>
<li><code>var dateFormat: String</code></li>
<li><code>func setLocalizedDateFormatFromTemplate(dateFormatTemplate: String)</code></li>
<li><code>static func dateFormat(fromTemplate: String, options: Int, locale: Locale?) -> String?</code></li>
<li><code>static func localizedString(from date: Date, dateStyle: DateFormatter.Style, timeStyle: DateFormatter.Style) -> String</code></li>
<li><code>var timeZone: TimeZone?</code></li>
<li><code>var locale: Locale?</code></li>
<li><code>var calendar: Calendar?</code></li>
<li><code>func date(from string: String) -> Date?</code></li>
<li><code>func string(from date: Date) -> String</code></li>
<li><code>func string(for obj: Any?) -> String?</code></li>
          </ul>
        </details> 
      </td>
    </tr>
    <tr>
      <td>✅</td>
      <td><code>DateInterval</code></td>
    </tr>
   <tr>
      <td>🟠</td>
      <td>
        <details>
          <summary><code>Decimal</code></summary>
          <ul>
<li>Aliased to <code>java.math.BigDecimal</code></li>
          </ul>
        </details> 
      </td>
    </tr>
    <tr>
      <td>🟠</td>
      <td>
        <details>
          <summary><code>DispatchQueue</code></summary>
          <ul>
<li><code>static let main: DispatchQueue</code></li>
<li><code>func async(execute: () -> Void)</code></li>
<li><code>func asyncAfter(deadline: DispatchTime, execute: () -> Void)</code></li>
<li><code>func asyncAfter(wallDeadline: DispatchWallTime, execute: () -> Void)</code></li>
          </ul>
        </details> 
      </td>
    </tr>
    <tr>
      <td>🟢</td>
      <td>
        <details>
          <summary><code>FileManager</code></summary>
          <ul>
<li><code>static let `default`: FileManager</code></li>
<li><code>let temporaryDirectory: URL</code></li>
<li><code>let currentDirectoryPath: String</code></li>
<li><code>func createSymbolicLink(at url: URL, withDestinationURL destinationURL: URL) throws</code></li>
<li><code>func createSymbolicLink(atPath path: String, withDestinationPath destinationPath: String) throws</code></li>
<li><code>func createDirectory(at url: URL, withIntermediateDirectories: Bool, attributes: [FileAttributeKey : Any]? = nil) throws</code></li>
<li><code>func createDirectory(atPath path: String, withIntermediateDirectories: Bool, attributes: [FileAttributeKey : Any]? = nil) throws</code></li>
<li><code>func destinationOfSymbolicLink(atPath path: String) throws</code></li>
<li><code>func attributesOfItem(atPath path: String) throws -> [FileAttributeKey: Any]</code></li>
<li><code>func setAttributes(_ attributes: [FileAttributeKey : Any], ofItemAtPath path: String) throws</code></li>
<li><code>func createFile(atPath path: String, contents: Data? = nil, attributes: [FileAttributeKey : Any]? = nil) -> Bool</code></li>
<li><code>func copyItem(atPath path: String, toPath: String) throws</code></li>
<li><code>func copyItem(at url: URL, to: URL) throws</code></li>
<li><code>func moveItem(atPath path: String, toPath: String) throws</code></li>
<li><code>func moveItem(at path: URL, to: URL) throws</code></li>
<li><code>func subpathsOfDirectory(atPath path: String) throws -> [String]</code></li>
<li><code>func subpaths(atPath path: String) -> [String]?</code></li>
<li><code>func removeItem(atPath path: String) throws</code></li>
<li><code>func removeItem(at url: URL) throws</code></li>
<li><code>func fileExists(atPath path: String) -> Bool</code></li>
<li><code>func isReadableFile(atPath path: String) -> Bool</code></li>
<li><code>func isExecutableFile(atPath path: String) -> Bool</code></li>
<li><code>func isDeletableFile(atPath path: String) -> Bool</code></li>
<li><code>func isWritableFile(atPath path: String) -> Bool</code></li>
<li><code>func contentsOfDirectory(at url: URL, includingPropertiesForKeys: [URLResourceKey]?) throws -> [URL]</code></li>
<li><code>func contentsOfDirectory(atPath path: String) throws -> [String]</code></li>
<li><code>func url(for directory: FileManager.SearchPathDirectory, in domain: FileManager.SearchPathDomainMask, appropriateFor url: URL?, create shouldCreate: Bool) throws -> URL</code></li>
          </ul>
        </details> 
      </td>
    </tr>
    <tr>
      <td>✅</td>
      <td><code>HTTPURLResponse</code></td>
    </tr>
   <tr>
      <td>🟢</td>
      <td>
        <details>
          <summary><code>IndexPath</code></summary>
          <ul>
            <li>Cannot assign from an array literal</li>
            <li>Cannot assign to a range subscript</li>
          </ul>
        </details> 
      </td>
    </tr>
   <tr>
      <td>🟡</td>
      <td>
        <details>
          <summary><code>IndexSet</code></summary>
          <ul>
            <li>This is an <b>inefficient</b> implementation using an internal <code>Set</code></li>
            <li><code>init(integersIn range: any RangeExpression&lt;Int>)</code></li>
            <li><code>init(integer: Int)</code></li>
            <li><code>init()</code></li>
            <li><code>func integerGreaterThan(_ integer: Int) -> Int?</code></li>
            <li><code>func integerLessThan(_ integer: Int) -> Int?</code></li>
            <li><code>func integerGreaterThanOrEqualTo(_ integer: Int) -> Int?</code></li>
            <li><code>func integerLessThanOrEqualTo(_ integer: Int) -> Int?</code></li>
            <li><code>func count(in range: any RangeExpression&lt;Int>) -> Int</code></li>
            <li><code>func contains(integersIn range: any RangeExpression&lt;Int>) -> Bool</code></li>
            <li><code>func contains(integersIn indexSet: IntSet) -> Bool</code></li>
            <li><code>func intersects(integersIn range: any RangeExpression&lt;Int>) -> Bool</code></li>
            <li><code>mutating func insert(integersIn range: any RangeExpression&lt;Int>)</code></li>
            <li><code>mutating func remove(integersIn range: any RangeExpression&lt;Int>)</code></li>
            <li><code>func filteredIndexSet(in range: any RangeExpression&lt;Int>, includeInteger: (Int) throws -> Bool) rethrows -> IndexSet</code></li>
            <li><code>func filteredIndexSet(includeInteger: (Int) throws -> Bool) rethrows -> IndexSet</code></li>
            <li>Supports the full <code>SetAlgebra</code> protocol</li>
          </ul>
        </details> 
      </td>
    </tr>
   <tr>
      <td>🟡</td>
      <td>
        <details>
          <summary><code>ISO8601DateFormatter</code></summary>
          <ul>
<li><code>static func string(from date: Date, timeZone: TimeZone) -> String</code></li>
<li><code>var timeZone: TimeZone?</code></li>
<li><code>func date(from string: String) -> Date?</code></li>
<li><code>func string(from date: Date) -> String</code></li>
<li><code>func string(for obj: Any?) -> String?</code></li>
          </ul>
        </details> 
      </td>
    </tr>
   <tr>
      <td>✅</td>
      <td><code>JSONDecoder</code></td>
    </tr>
   <tr>
      <td>✅</td>
      <td><code>JSONEncoder</code></td>
    </tr>
    <tr>
      <td>✅</td>
      <td><code>JSONSerialization</code></td>
    </tr>
    <tr>
      <td>✅</td>
      <td><code>Locale</code></td>
    </tr>
    <tr>
      <td>✅</td>
      <td><code>LocalizedError</code></td>
    </tr>
    <tr>
      <td>✅</td>
      <td><code>LocalizedStringResource</code></td>
    </tr>
    <tr>
      <td>✅</td>
      <td>
        <details>
          <summary><code>OSLog.Logger</code></summary>
          <ul>
<li><code>Log messages on Android can be viewed with the adb logcat command, or in the Android Studio console</code></li>
          </ul>
        </details> 
      </td>
    </tr>
    <tr>
      <td>✅</td>
      <td><code>Notification</code></td>
    </tr>
    <tr>
      <td>🟡</td>
      <td>
        <details>
          <summary><code>NotificationCenter</code></summary>
          <ul>
<li><code>static let default: NotificationCenter</code></li>
<li><code>func addObserver(forName name: Notification.Name?, object: Any?, queue: OperationQueue?, using block: (Notification) -> Void) -> Any</code></li>
<li><code>func removeObserver(_ observer: Any)</code></li>
<li><code>func post(_ notification: Notification)</code></li>
<li><code>func post(name: Notification.Name, object: Any?, userInfo: [AnyHashable: Any]? = nil)</code></li>
<li><code>func notifications(named: Notification.Name, object: AnyObject? = nil) -> Notifications</code></li>
<li>Also see support for <code>NotificationCenter.publisher</code> in the <code>SkipModel</code> module</li>
          </ul>
        </details> 
      </td>
    </tr>
    <tr>
      <td>✅</td>
      <td><code>NSError</code></td>
    </tr>
    <tr>
      <td>✅</td>
      <td><code>NSLock</code></td>
    </tr>
    <tr>
      <td>✅</td>
      <td><code>NSLocalizedString</code></td>
    </tr>
    <tr>
      <td>✅</td>
      <td><code>NSRecursiveLock</code></td>
    </tr>
   <tr>
      <td>🟢</td>
      <td>
        <details>
          <summary><code>Number</code></summary>
          <ul>
<li><code>init(value: Int8)</code></li>
<li><code>init(value: Int16)</code></li>
<li><code>init(value: Int32)</code></li>
<li><code>init(value: Int64)</code></li>
<li><code>init(value: UInt8)</code></li>
<li><code>init(value: UInt16)</code></li>
<li><code>init(value: UInt32)</code></li>
<li><code>init(value: UInt64)</code></li>
<li><code>init(value: Float)</code></li>
<li><code>init(value: Double)</code></li>
<li><code>init(_ value: Int8)</code></li>
<li><code>init(_ value: Int16)</code></li>
<li><code>init(_ value: Int32)</code></li>
<li><code>init(_ value: Int64)</code></li>
<li><code>init(_ value: UInt8)</code></li>
<li><code>init(_ value: UInt16)</code></li>
<li><code>init(_ value: UInt32)</code></li>
<li><code>init(_ value: UInt64)</code></li>
<li><code>init(_ value: Float)</code></li>
<li><code>init(_ value: Double)</code></li>
<li><code>var doubleValue: Double</code></li>
<li><code>var intValue: Int</code></li>
<li><code>var longValue: Int64</code></li>
<li><code>var int64Value: Int64</code></li>
<li><code>var int32Value: Int32</code></li>
<li><code>var int16Value: Int16</code></li>
<li><code>var int8Value: Int8</code></li>
          </ul>
        </details> 
      </td>
    </tr>
   <tr>
      <td>🟢</td>
      <td>
        <details>
          <summary><code>NumberFormatter</code></summary>
          <ul>
<li>The following styles are supported: <code>.none, .decimal, .currency, .percent</code></li>
<li><code>var numberStyle: NumberFormatter.Style</code></li>
<li><code>var locale: Locale?</code></li>
<li><code>var format: String</code></li>
<li><code>var groupingSize: Int</code></li>
<li><code>var generatesDecimalNumbers: Bool</code></li>
<li><code>var alwaysShowsDecimalSeparator: Bool</code></li>
<li><code>var usesGroupingSeparator: Bool</code></li>
<li><code>var multiplier: NSNumber?</code></li>
<li><code>var groupingSeparator: String?</code></li>
<li><code>var percentSymbol: String?</code></li>
<li><code>var currencySymbol: String?</code></li>
<li><code>var zeroSymbol: String?</code></li>
<li><code>var minusSign: String?</code></li>
<li><code>var exponentSymbol: String?</code></li>
<li><code>var negativeInfinitySymbol: String</code></li>
<li><code>var positiveInfinitySymbol: String</code></li>
<li><code>var internationalCurrencySymbol: String?</code></li>
<li><code>var decimalSeparator: String?</code></li>
<li><code>var currencyCode: String?</code></li>
<li><code>var currencyDecimalSeparator: String?</code></li>
<li><code>var notANumberSymbol: String?</code></li>
<li><code>var positiveSuffix: String?</code></li>
<li><code>var negativeSuffix: String?</code></li>
<li><code>var positivePrefix: String?</code></li>
<li><code>var negativePrefix: String?</code></li>
<li><code>var maximumFractionDigits: Int</code></li>
<li><code>var minimumFractionDigits: Int</code></li>
<li><code>var maximumIntegerDigits: Int</code></li>
<li><code>var minimumIntegerDigits: Int</code></li>
<li><code>func string(from number: NSNumber) -> String?</code></li>
<li><code>func string(from number: Int) -> String?</code></li>
<li><code>func string(for object: Any?) -> String?</code></li>
<li><code>func number(from string: String) -> NSNumber?</code></li>
          </ul>
        </details> 
      </td>
    </tr>
    <tr>
      <td>🟠</td>
      <td>
        <details>
          <summary><code>OperationQueue</code></summary>
          <ul>
<li><code>static let main: OperationQueue </code></li>
          </ul>
        </details> 
      </td>
    </tr>
   <tr>
      <td>🟢</td>
      <td>
        <details>
          <summary><code>OSAllocatedUnfairLock</code></summary>
          <ul>
<li><code>init()</code></li>
<li><code>init(initialState: State)</code></li>
<li><code>init(uncheckedState initialState: State)</code></li>
<li><code>func lock()</code></li>
<li><code>func unlock()</code></li>
<li><code>func lockIfAvailable() -> Bool</code></li>
<li><code>func withLockUnchecked&lt;R>(_ body: (inout State) throws -> R) rethrows -> R</code></li>
<li><code>func func withLockUnchecked&lt;R>(_ body: () throws -> R) rethrows -> R</code></li>
<li><code>func withLock&lt;R>(_ body: (inout State) throws -> R) rethrows -> R</code></li>
<li><code>func withLock&lt;R>(_ body: () throws -> R) rethrows -> R</code></li>
<li><code>func withLockIfAvailableUnchecked&lt;R>(_ body: (inout State) throws -> R) rethrows -> R?</code></li>
<li><code>func withLockIfAvailableUnchecked&lt;R>(_ body: () throws -> R) rethrows -> R?</code></li>
<li><code>func withLockIfAvailable&lt;R>(_ body: @Sendable (inout State) throws -> R) rethrows -> R?</code></li>
<li><code>func withLockIfAvailable&lt;R>(_ body: () throws -> R) rethrows -> R?</code></li>
          </ul>
        </details> 
      </td>
    </tr>
    <tr>
      <td>✅</td>
      <td><code>POSIXError</code></td>
    </tr>
    <tr>
      <td>🟡</td>
      <td>
        <details>
          <summary><code>ProcessInfo</code></summary>
          <ul>
<li><code>static let processInfo: ProcessInfo</code></li>
<li><code>var globallyUniqueString: String</code></li>
<li><code>var systemProperties: [String: String]</code></li>
<li><code>var environment: [String : String]</code></li>
<li><code>var processIdentifier: Int32</code></li>
<li><code>var arguments: [String]</code></li>
<li><code>var hostName: String</code></li>
<li><code>var processorCount: Int</code></li>
<li><code>var operatingSystemVersionString: String</code></li>
<li><code>var isMacCatalystApp: Bool</code></li>
<li><code>var isiOSAppOnMac: Bool</code></li>
          </ul>
        </details> 
      </td>
    </tr>
    <tr>
      <td>🟠</td>
      <td>
        <details>
          <summary><code>PropertyListSerialization</code></summary>
          <ul>
<li><code>static func propertyList(from: Data, options: PropertyListSerialization.ReadOptions = [], format: Any?) throws -> [String: String]?</code></li>
<li>Ignores any given <code>options</code> and <code>format</code></li>
          </ul>
        </details> 
      </td>
    </tr>
    <tr>
      <td>🟠</td>
      <td>
        <details>
          <summary><code>RelativeDateTimeFormatter</code></summary>
          <ul>
<li><code>localizedString(from dateComponents: DateComponents) -> String</code></li>
<li><code>func localizedString(fromTimeInterval timeInterval: TimeInterval) -> String</code></li>
<li><code>func localizedString(for date: Date, relativeTo referenceDate: Date) -> String</code></li>
<li><code>func string(for obj: Any?) -> String?</code></li>
          </ul>
        </details> 
      </td>
    </tr>
    <tr>
      <td>🟠</td>
      <td>
        <details>
          <summary><code>RunLoop</code></summary>
          <ul>
<li><code>static let main: RunLoop</code></li>
          </ul>
        </details> 
      </td>
    </tr>
    <tr>
      <td>✅</td>
      <td><code>RecoverableError</code></td>
    </tr>
    <tr>
      <td>🟢</td>
      <td>
        <details>
          <summary><code>String</code></summary>
          <ul>
<li>Core <code>String</code> API is defined in <code>SkipLib</code>. These extensions are defined in <code>SkipFoundation</code></li>
<li><code>init(data: Data, encoding: StringEncoding)</code></li>
<li><code>init(bytes: [UInt8], encoding: StringEncoding)</code></li>
<li><code>init(contentsOf: URL)</code></li>
<li><code>var capitalized: String</code></li>
<li><code>var deletingLastPathComponent: String</code></li>
<li><code>func replacingOccurrences(of search: String, with replacement: String) -> String</code></li>
<li><code>func components(separatedBy separator: String) -> [String]</code></li>
<li><code>func trimmingCharacters(in set: CharacterSet) -> String</code></li>
<li><code>func addingPercentEncoding(withAllowedCharacters: CharacterSet) -> String?</code></li>
<li><code>var removingPercentEncoding: String?</code></li>
<li><code>var utf8Data: Data</code></li>
<li><code>var utf8: [UInt8]</code></li>
<li><code>var utf16: [UInt8]</code></li>
<li><code>var utf32: [UInt8]</code></li>
<li><code>var unicodeScalars: [UInt8]</code></li>
<li><code>func data(using: StringEncoding, allowLossyConversion: Bool = true) -> Data?</code></li>
<li><code>func write(to url: URL, atomically useAuxiliaryFile: Bool, encoding enc: StringEncoding) throws</code></li>
<li><code>func write(toFile path: String, atomically useAuxiliaryFile: Bool, encoding enc: StringEncoding) throws</code></li>
          </ul>
        </details> 
      </td>
    </tr>
    <tr>
      <td>✅</td>
      <td><code>StringLocalizationValue</code></td>
    </tr>
    <tr>
      <td>✅</td>
      <td><code>func strlen(_ string: String) -> Int</code></td>
    </tr>
    <tr>
      <td>✅</td>
      <td><code>func strncmp(_ str1: String, _ str2: String) -> Int</code></td>
    </tr>
   <tr>
      <td>🟡</td>
      <td>
        <details>
          <summary><code>Thread</code></summary>
          <ul>
<li><code>current</code></li>
<li><code>main</code></li>
<li><code>isMainThread</code></li>
<li><code>sleep(for: TimeInterval)</code></li>
<li><code>sleep(until: Date)</code></li>
<li><code>callStackSymbols</code></li>
<li>Starting and stopping threads is not implemented, nor is constructing a Thread with a block</li>
          </ul>
        </details> 
      </td>
    </tr>
    <tr>
      <td>🟡</td>
      <td>
        <details>
          <summary><code>Timer</code></summary>
          <ul>
<li><code>init(timeInterval: TimeInterval, repeats: Bool, block: (Timer) -> Void)</code></li>
<li><code>static func scheduledTimer(withTimeInterval interval: TimeInterval, repeats: Bool, block: (Timer) -> Void) -> Timer</code></li>
<li><code>var timeInterval: TimeInterval</code></li>
<li><code>func invalidate()</code></li>
<li><code>var isValid: Bool</code></li>
<li><code>var userInfo: Any?</code></li>
<li>Also see support for <code>Timer.publish</code> in the <code>SkipModel</code> module</li>
          </ul>
        </details> 
      </td>
    </tr>
    <tr>
      <td>🟢</td>
      <td>
        <details>
          <summary><code>TimeZone</code></summary>
          <ul>
<li><code>static var current: TimeZone</code></li>
<li><code>static var autoupdatingCurrent: TimeZone</code></li>
<li><code>static var `default`: TimeZone</code></li>
<li><code>static var system: TimeZone</code></li>
<li><code>static var local: TimeZone</code></li>
<li><code>static var gmt: TimeZone</code></li>
<li><code>init?(identifier: String)</code></li>
<li><code>init?(abbreviation: String)</code></li>
<li><code>init?(secondsFromGMT seconds: Int)</code></li>
<li><code>var identifier: String</code></li>
<li><code>func abbreviation(for date: Date = Date()) -> String?</code></li>
<li><code>func secondsFromGMT(for date: Date = Date()) -> Int</code></li>
<li><code>func isDaylightSavingTime(for date: Date = Date()) -> Bool</code></li>
<li><code>func daylightSavingTimeOffset(for date: Date = Date()) -> TimeInterval</code></li>
<li><code>var nextDaylightSavingTimeTransition: Date?</code></li>
<li><code>func nextDaylightSavingTimeTransition(after date: Date) -> Date?</code></li>
<li><code>static var knownTimeZoneIdentifiers: [String]</code></li>
<li><code>static var knownTimeZoneNames: [String]</code></li>
<li><code>static var abbreviationDictionary: [String : String]</code></li>
<li><code>func localizedName(for style: NameStyle, locale: Locale?) -> String?</code></li>
          </ul>
        </details> 
      </td>
    </tr>
    <tr>
      <td>✅</td>
      <td><code>UnknownNSError</code></td>
    </tr>
    <tr>
      <td>🟢</td>
      <td>
        <details>
          <summary><code>URL</code></summary>
          <ul>
<li><code>init(_ url: URL)</code></li>
<li><code>init?(string: String, relativeTo baseURL: URL? = nil)</code></li>
<li><code>init?(string: String, encodingInvalidCharacters: Bool)</code></li>
<li><code>init(fileURLWithPath path: String, isDirectory: Bool? = nil, relativeTo base: URL? = nil)</code></li>
<li><code>static func currentDirectory() -> URL</code></li>
<li><code>static var homeDirectory: URL</code></li>
<li><code>static var temporaryDirectory: URL</code></li>
<li><code>static var cachesDirectory: URL</code></li>
<li><code>static var documentsDirectory: URL</code></li>
<li><code>let baseURL: URL?</code></li>
<li><code>var scheme: String?</code></li>
<li><code>var host: String?</code></li>
<li><code>func host(percentEncoded: Bool = true) -> String?</code></li>
<li><code>var port: Int?</code></li>
<li><code>var path: String?</code></li>
<li><code>func path(percentEncoded: Bool = true) -> String?</code></li>
<li><code>var hasDirectoryPath: Bool</code></li>
<li><code>var query: String?</code></li>
<li><code>func query(percentEncoded: Bool = true) -> String?</code></li>
<li><code>var fragment: String?</code></li>
<li><code>func fragment(percentEncoded: Bool = true) -> String?</code></li>
<li><code>var standardized: URL</code></li>
<li><code>var standardizedFileURL: URL</code></li>
<li><code>mutating func standardize()</code></li>
<li><code>var absoluteURL: URL</code></li>
<li><code>var absoluteString: String</code></li>
<li><code>var relativePath: String</code></li>
<li><code>var relativeString: String</code></li>
<li><code>var pathComponents: [String]</code></li>
<li><code>var lastPathComponent: String</code></li>
<li><code>var pathExtension: String</code></li>
<li><code>var isFileURL: Bool</code></li>
<li><code>func appendingPathComponent(_ pathComponent: String) -> URL</code></li>
<li><code>mutating func appendPathComponent(_ pathComponent: String)</code></li>
<li><code>func appendingPathComponent(_ pathComponent: String, isDirectory: Bool) -> URL</code></li>
<li><code>mutating func appendPathComponent(_ pathComponent: String, isDirectory: Bool)</code></li>
<li><code>func appendingPathExtension(_ pathExtension: String) -> URL</code></li>
<li><code>mutating func appendPathExtension(_ pathExtension: String)</code></li>
<li><code>func deletingLastPathComponent() -> URL</code></li>
<li><code>mutating func deleteLastPathComponent() -> URL</code></li>
<li><code>func deletingPathExtension() -> URL</code></li>
<li><code>mutating func deletePathExtension()</code></li>
<li><code>func resolvingSymlinksInPath() -> URL</code></li>
<li><code>mutating func resolveSymlinksInPath() -> URL</code></li>
<li><code>func checkResourceIsReachable() throws -> Bool</code></li>
          </ul>
        </details> 
      </td>
    </tr>
    <tr>
      <td>🟢</td>
      <td>
        <details>
          <summary><code>URLComponents</code></summary>
          <ul>
<li><code>init()</code></li>
<li><code>init?(url: URL, resolvingAgainstBaseURL resolve: Bool)</code></li>
<li><code>init?(string: String)</code></li>
<li><code>init?(string: String, encodingInvalidCharacters: Bool)</code></li>
<li><code>var url: URL?</code></li>
<li><code>func url(relativeTo base: URL?) -> URL?</code></li>
<li><code>var string: String?</code></li>
<li><code>var scheme: String?</code></li>
<li><code>var host: String?</code></li>
<li><code>var port: Int?</code></li>
<li><code>var path: String</code></li>
<li><code>var fragment: String?</code></li>
<li><code>var query: String?</code></li>
<li><code>var queryItems: [URLQueryItem]?</code></li>
<li><code>var percentEncodedHost: String?</code></li>
<li><code>var encodedHost: String?</code></li>
<li><code>var percentEncodedPath: String</code></li>
<li><code>var percentEncodedQuery: String?</code></li>
<li><code>var percentEncodedFragment: String?</code></li>
<li><code>var percentEncodedQueryItems: [URLQueryItem]?</code></li>
          </ul>
        </details> 
      </td>
    </tr>
    <tr>
      <td>✅</td>
      <td><code>URLError</code></td>
    </tr>
    <tr>
      <td>✅</td>
      <td><code>URLQueryItem</code></td>
    </tr>
   <tr>
      <td>🟡</td>
      <td>
        <details>
          <summary><code>URLRequest</code></summary>
          <ul>
<li>Many properties are currently ignored by <code>URLSession</code></li>
<li><code>httpBodyStream</code> is not supported</li>
          </ul>
        </details> 
      </td>
    </tr>
    <tr>
      <td>✅</td>
      <td><code>URLResponse</code></td>
    </tr>
    <tr>
      <td>🟡</td>
      <td>
        <details>
          <summary><code>URLSession</code></summary>
          <ul>
<li><code>static let shared: URLSession</code></li>
<li><code>init(configuration: URLSessionConfiguration, delegate: URLSessionDelegate? = nil, delegateQueue: OperationQueue? = nil)</code></li>
<li><code>var configuration: URLSessionConfiguration</code></li>
<li><code>var sessionDescription: String?</code></li>
<li><code>var delegate: URLSessionDelegate?</code></li>
<li><code>var delegateQueue: OperationQueue?</code></li>
<li><code>func data(for request: URLRequest, delegate: URLSessionTaskDelegate? = nil) async throws -> (Data, URLResponse)</code></li>
<li><code>func data(from url: URL, delegate: URLSessionTaskDelegate? = nil) async throws -> (Data, URLResponse)</code></li>
<li><code>func upload(for request: URLRequest, fromFile fileURL: URL, delegate: URLSessionTaskDelegate? = nil) async throws -> (Data, URLResponse)</code></li>
<li><code>func upload(for request: URLRequest, from bodyData: Data, delegate: URLSessionTaskDelegate? = nil) async throws -> (Data, URLResponse)</code></li>
<li><code>func bytes(for request: URLRequest, delegate: URLSessionTaskDelegate? = nil) async throws -> (AsyncBytes, URLResponse)</code></li>
<li><code>func bytes(from url: URL, delegate: URLSessionTaskDelegate? = nil) async throws -> (AsyncBytes, URLResponse)</code></li>
<li><code>func dataTask(with url: URL, completionHandler: ((Data?, URLResponse?, Error?) -> Void)? = nil) -> URLSessionDataTask</code></li>
<li><code>func dataTask(with request: URLRequest, completionHandler: ((Data?, URLResponse?, Error?) -> Void)? = nil) -> URLSessionDataTask</code></li>
<li><code>func uploadTask(with: URLRequest, from: Data?, completionHandler: ((Data?, URLResponse?, Error?) -> Void)? = nil) -> URLSessionUploadTask</code></li>
<li><code>func uploadTask(with: URLRequest, fromFile: URL, completionHandler: ((Data?, URLResponse?, Error?) -> Void)?) -> URLSessionUploadTask</code></li>
<li><code>func webSocketTask(with url: URL) -> URLSessionWebSocketTask</code></li>
<li><code>func webSocketTask(with request: URLRequest) -> URLSessionWebSocketTask</code></li>
<li><code>func webSocketTask(with url: URL, protocols: [String]) -> URLSessionWebSocketTask</code></li>
<li><code>func finishTasksAndInvalidate()</code></li>
<li><code>func getTasksWithCompletionHandler(_ handler: ([URLSessionDataTask], [URLSessionUploadTask], [URLSessionDownloadTask]) -> Void)</code></li>
<li><code>var tasks: ([URLSessionDataTask], [URLSessionUploadTask], [URLSessionDownloadTask])</code></li>
<li><code>func getAllTasks(handler: ([URLSessionTask]) -> Void)</code></li>
<li><code>var allTasks: [URLSessionTask]</code></li>
<li><code>func invalidateAndCancel()</code></li>
<li><code>struct AsyncBytes: AsyncSequence</code></li>
          </ul>
        </details> 
      </td>
    </tr>
   <tr>
      <td>🟡</td>
      <td>
        <details>
          <summary><code>URLSessionConfiguration</code></summary>
          <ul>
<li>Many properties are currently ignored by <code>URLSession</code></li>
          </ul>
        </details> 
      </td>
    </tr>
    <tr>
      <td>🟢</td>
      <td>
        <details>
          <summary><code>URLSessionDataTask</code></summary>
          <ul>
<li><code>static let defaultPriority: Float</code></li>
<li><code>static let lowPriority: Float</code></li>
<li><code>static let highPriority: Float</code></li>
<li><code>var taskIdentifier: Int</code></li>
<li><code>var taskDescription: String?</code></li>
<li><code>var originalRequest: URLRequest?</code></li>
<li><code>var delegate: URLSessionTaskDelegate?</code></li>
<li><code>var state: URLSessionTask.State</code></li>
<li><code>var error: Error?</code></li>
<li><code>var priority: Float</code></li>
<li><code>func suspend()</code></li>
<li><code>func resume()</code></li>
<li><code>func cancel()</code></li>
          </ul>
        </details> 
      </td>
    </tr>
    <tr>
      <td>🟢</td>
      <td>
        <details>
          <summary><code>URLSessionUploadTask</code></summary>
          <ul>
<li><code>static let defaultPriority: Float</code></li>
<li><code>static let lowPriority: Float</code></li>
<li><code>static let highPriority: Float</code></li>
<li><code>var taskIdentifier: Int</code></li>
<li><code>var taskDescription: String?</code></li>
<li><code>var originalRequest: URLRequest?</code></li>
<li><code>var delegate: URLSessionTaskDelegate?</code></li>
<li><code>var state: URLSessionTask.State</code></li>
<li><code>var error: Error?</code></li>
<li><code>var priority: Float</code></li>
<li><code>func suspend()</code></li>
<li><code>func resume()</code></li>
<li><code>func cancel()</code></li>
          </ul>
        </details> 
      </td>
    </tr>
    <tr>
      <td>🟢</td>
      <td>
        <details>
          <summary><code>URLSessionWebSocketTask</code></summary>
          <ul>
<li><code>static let defaultPriority: Float</code></li>
<li><code>static let lowPriority: Float</code></li>
<li><code>static let highPriority: Float</code></li>
<li><code>var taskIdentifier: Int</code></li>
<li><code>var taskDescription: String?</code></li>
<li><code>var originalRequest: URLRequest?</code></li>
<li><code>var delegate: URLSessionTaskDelegate?</code></li>
<li><code>var state: URLSessionTask.State</code></li>
<li><code>var error: Error?</code></li>
<li><code>var priority: Float</code></li>
<li><code>func suspend()</code></li>
<li><code>func resume()</code></li>
<li><code>func cancel()</code></li>
<li><code>func cancel(with closeCode: CloseCode, reason: Data?)</code></li>
<li><code>var maximumMessageSize: Int</code></li>
<li><code>var closeCode: CloseCode</code></li>
<li><code>var closeReason: Data?</code></li>
<li><code>func send(_ message: Message) async throws -> Void</code></li>
<li><code>func receive() async throws -> Message</code></li>
          </ul>
        </details> 
      </td>
    </tr>
   <tr>
      <td>🟢</td>
      <td>
        <details>
          <summary><code>UserDefaults</code></summary>
          <ul>
<li><code>static var standard: UserDefaults</code></li>
<li><code>init(suiteName: String?)</code></li>
<li><code>func register(defaults registrationDictionary: [String : Any])</code></li>
<li><code>func set(_ value: Int, forKey defaultName: String)</code></li>
<li><code>func set(_ value: Boolean, forKey defaultName: String)</code></li>
<li><code>func set(_ value: Double, forKey defaultName: String)</code></li>
<li><code>func set(_ value: String, forKey defaultName: String)</code></li>
<li><code>func set(_ value: Any?, forKey defaultName: String)</code></li>
<li><code>func removeObject(forKey defaultName: String)</code></li>
<li><code>func object(forKey defaultName: String) -> Any?</code></li>
<li><code>func string(forKey defaultName: String) -> String?</code></li>
<li><code>func double(forKey defaultName: String) -> Double?</code></li>
<li><code>func integer(forKey defaultName: String) -> Int?</code></li>
<li><code>func bool(forKey defaultName: String) -> Bool?</code></li>
<li><code>func url(forKey defaultName: String) -> URL?</code></li>
<li><code>func data(forKey defaultName: String) -> Data?</code></li>
<li><code>func dictionaryRepresentation() -> [String : Any]</code></li>
<li>Array and dictionary values are not supported</li>
          </ul>
        </details> 
      </td>
    </tr>
   <tr>
      <td>🟢</td>
      <td>
        <details>
          <summary><code>UUID</code></summary>
          <ul>
<li><code>init()</code></li>
<li><code>init?(uuidString: String)</code></li>
<li><code>static func fromString(uuidString: String) -> UUID?</code></li>
<li><code>var uuidString: String</code></li>
          </ul>
        </details> 
      </td>
    </tr>
  </tbody>
</table>

## Topics

### CryptoKit

SkipFoundation vends portions of the CryptoKit framework by delegating to the built-in Java implementations:

- `SHA256`
- `SHA256Digest`
- `SHA384`
- `SHA384Digest`
- `SHA512`
- `SHA512Digest`
- `Insecure.MD5`
- `Insecure.MD5Digest`
- `Insecure.SHA1`
- `Insecure.SHA1Digest`
- `HMACMD5`
- `HMACSHA1`
- `HMACSHA256`
- `HMACSHA384`
- `HMACSHA512`

Each supported algorithm includes the following API:

```
associatedtype Digest
    
public static func hash(data: Data) -> Digest
public func update(_ data: DataProtocol)
public func finalize() -> Digest
```

The returned `Digest` in turn acts as a sequence of `UInt8` bytes. 

### Files

Skip implements much of `Foundation.FileManager`, which should be
the primary interface for interacting with the file system.

The app-specific folder can be accessed like:

```swift
// on Android, this is Context.getFilesDir()
let folder = URL.documentsDirectory

// which is shorthand for the following:
let folder = try FileManager.default.url(for: FileManager.SearchPathDirectory.documentDirectory, in: FileManager.SearchPathDomainMask.userDomainMask, appropriateFor: nil, create: false)
```

And to read and write to the cache folders:

```swift
// on Android, this is Context.getCachesDir()
let caches = URL.cachesDirectory

// which is shorthand for the following:
let caches = try FileManager.default.url(for: FileManager.SearchPathDirectory.cachesDirectory, in: FileManager.SearchPathDomainMask.userDomainMask, appropriateFor: nil, create: false)
```

And the system temporary folder can be accessed with:

```swift
// on Android, this will be the same as Context.getCachesDir()
let tmpdir = URL.temporaryDirectory

// you can also use:
let tmpdir = NSTemporaryDirectory()
```

None of the other `FileManager.SearchPathDirectory` enumerations are implemented in Skip.

Both `Data` and `String` have the ability to read and write to and from URLs and path strings.


