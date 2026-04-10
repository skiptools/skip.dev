---
title: XML
description: Documentation for XML fetched from GitHub.
note: This documentation section is derived from the GitHub README.md source using the scripts/sync-modules.mjs script. Do not make edits to the file here, change it there.
editUrl: https://github.com/skiptools/skip-xml/edit/main/README.md
---

:::note[Source Repository <a href='https://github.com/skiptools/skip-xml/releases' alt='Releases for skip-xml'><img decoding='async' loading='lazy' alt='Releases for skip-xml' src='https://img.shields.io/github/v/release/skiptools/skip-xml.svg?style=flat' /></a>]{icon="github"}
This framework is available at [github.com/skiptools/skip-xml](https://github.com/skiptools/skip-xml) and can be checked out and improved locally as described in the [Contribution Guide](/docs/contributing/#local-libraries).
:::

SkipXML provides an XML document parser and in-memory tree representation for Skip apps. It parses XML data into `XMLNode` structures that can be queried, traversed, modified, and serialized back to XML strings.

On Darwin platforms (iOS, macOS) and in compiled [Skip Fuse](/docs/modes/#fuse) mode for Android, SkipXML uses Foundation's `XMLParser` and `XMLParserDelegate` for parsing. In transpiled [Skip Lite](/docs/modes/#lite) mode, the Swift source is transpiled to Kotlin, and parsing is handled by the Java `javax.xml.parsers.SAXParser` and `org.xml.sax.helpers.DefaultHandler` APIs to provide equivalent functionality. The resulting `XMLNode` tree API is identical across both platforms.

## Setup

Add the dependency to your `Package.swift` file:

```swift
.package(url: "https://source.skip.tools/skip-xml.git", from: "1.0.0")
```

And add the product to your target:

```swift
.target(name: "MyTarget", dependencies: [
    .product(name: "SkipXML", package: "skip-xml")
])
```

## Usage

### Parsing XML

Parse XML from `Data` or directly from a `String`:

```swift
import SkipXML

let xml = """
<library>
    <book id="1">
        <title>Swift Programming</title>
        <author>Apple</author>
    </book>
    <book id="2">
        <title>Kotlin in Action</title>
        <author>JetBrains</author>
    </book>
</library>
"""

let doc = try XMLNode.parse(string: xml)
```

The returned `XMLNode` is the document root. Access the top-level element with `elementChildren`:

```swift
let library = doc.elementChildren[0] // the <library> element
```

### Querying Elements

Find child elements by name:

```swift
let books = library.childElements(named: "book") // all <book> children
let firstBook = library.firstChildElement(named: "book") // first <book> or nil
```

Search recursively through all descendants:

```swift
let allTitles = library.descendants(named: "title") // finds <title> at any depth
```

### Reading Content and Attributes

Get the text content of an element:

```swift
let title = books[0].firstChildElement(named: "title")
title?.stringContent        // "Swift Programming"
title?.trimmedStringContent // "Swift Programming" (strips leading/trailing whitespace)
```

Look up a child element's trimmed text content by name:

```swift
books[0].childContentTrimmed(forElementName: "author") // "Apple"
```

Read attributes using subscript syntax:

```swift
books[0][attribute: "id"] // "1"
```

Convert an element's children into a flat dictionary:

```swift
let dict = books[0].elementDictionary(attributes: true, childNodes: true)
// ["id": "1", "title": "Swift Programming", "author": "Apple"]
```

### Building and Modifying XML

Create elements programmatically:

```swift
var root = XMLNode(elementName: "root")
root.addElement("name", content: "SkipXML")
root.addElement("version", attributes: ["major": "1"], content: "1.0")
```

Append existing nodes:

```swift
var child = XMLNode(elementName: "child", attributes: ["key": "value"])
root.append(child)
```

Remove children by name:

```swift
root.removeChildren(named: "version") // returns count of removed elements
```

### Serializing to XML

Convert any node back to an XML string:

```swift
let output = root.xmlString()
// <?xml version="1.0"?>
// <root><name>SkipXML</name>...</root>
```

Omit the XML declaration:

```swift
root.xmlString(declaration: nil)
```

Use compact self-closing tags:

```swift
// Produces <empty/> instead of <empty></empty>
root.xmlString(compactCloseTags: true)
```

### Namespace Processing

Enable namespace processing during parsing:

```swift
let doc = try XMLNode.parse(string: xml, options: [.processNamespaces])
```

When enabled, element names are reported without namespace prefixes, and the `namespaceURI` and `qualifiedName` properties are populated on each node.

### Child Node Types

Each `XMLNode` contains an array of `Child` values representing the different kinds of XML content:

- `.element(XMLNode)` -- nested elements
- `.content(String)` -- text content
- `.comment(String)` -- XML comments
- `.cdata(Data)` -- CDATA sections
- `.whitespace(String)` -- ignorable whitespace
- `.processingInstruction(target:data:)` -- processing instructions

## Building

This project is a Swift Package Manager module that uses the
Skip plugin to transpile Swift into Kotlin.

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

