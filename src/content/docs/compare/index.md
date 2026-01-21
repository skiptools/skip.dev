---
title: Skip Comparison Matrix
permalink: /compare/
tableOfContents: false
---

<style>
table {
    font-family: system-ui;
    border-collapse: collapse;
    width: 100%;
    margin: 0 auto;
    /* settings so the table has its own scroll bar and doesn't make the page wider */
    overflow-x: auto;
    max-width: fit-content;
    display: block;
}

th, td {
    text-align: left;
    padding: 12px;
    font-size: 70%;
}

th {
    background-color: var(--sl-color-accent);
    color: var(--sl-color-black);
    min-width: 55pt;
}

td:nth-child(1) {
    /* font-weight: 400; */
}

/* Highlight the second "Skip" column */
td:nth-child(2999) {
    /* background-color: var(--sl-color-gray-4); */
    /* color: var(--text-background-color); */
    font-weight: bolder;
}

tr:nth-child(even) {
    background-color: var(--sl-color-gray-6);
}

tr:hover {
    background-color: var(--sl-color-gray-7);
}

td {
    border: 1px solid var(--sl-color-gray-5);
    font-weight: normal;
}

h1 {
    text-align: center;
    padding: 1em;
}

img.table-icon {
    width: 22pt;
    height: 22pt;
    padding: 10px;
}
</style>

This table presents a comparison between using Skip for dual-platform iOS and Android development versus 
some of the other cross-platform app builder technologies that are available.

| | Write<br/>Twice | Skip | Flutter | React<br/>Native | Compose<br/>Multiplatform | |
|-:|:-:|:-:|:-:|:-:|:-:|:-|
| Develop with a single language<br/>in a single codebase | ❌ | ✅ | ✅ | ✅ | ✅ |
| Modern memory-safe language | ✅ | ✅  | ✅  | ✅ | ✅ |
| Natively Compiled | ✅ | ✅ | ✅ | ❌ | ✅ | |
| Memory efficient<br/>(no added garbage collection) | ✅<br/>✅ | ✅<br/>✅ | ❌<br/>❌ | ❌<br/>❌ | ❌<br/>✅ | iOS<br/>Android |
| Platform-native widgets | ✅<br/>✅ | ✅<br/>✅  | ❌<br/>❌ | ✅<br/>✅ | ❌<br/>✅ | iOS: native UIKit<br/>Android: native Views |
| Vendor-recommended toolkit | ✅<br/>✅ | ✅<br/>✅  | ❌<br/>❌ | ❌<br/>❌ | ❌<br/>✅ | Apple: SwiftUI<br/>Google: Jetpack Compose |
| Effortless platform API access | ✅<br/>✅ | ✅<br/>✅ | ❌<br/>❌ | ❌<br/>❌ | ❌<br/>✅ | iOS: Swift<br/>Android: Kotlin |
| Ejectable | N/A | ✅ | ❌ | ❌ | ❌ |


# Technology Comparison Table

This table summarizes the various underlying technologies that each of the popular cross-platform development frameworks use.

|                         | Skip       | Flutter          | React Native | Xamarin          | KMP Compose      | Ionic/Cordova |
|------------------------:|:-----------|:-----------------|:-------------|:-----------------|:-----------------|:--------------|
| Development Language    | Swift      | Dart             | JavaScript   | C#               | Kotlin           | JavaScript    |
| UI Framework            | SwiftUI    | Flutter          | HTML/JSX+CSS | XAML/MAUI        | Compose          | HTML+CSS      |
| Package Manager         | SwiftPM    | Pub/CocoaPods    | NPM          | NuGet/CocoaPods  | Gradle/CocoaPods | Varies        |
| IDE                     | Xcode      | Android Studio   | VSCode       | Visual Studio    | IntelliJ IDEA    | VSCode        |
| iOS UX                  | Native     | Mimicked         | Native       | Native           | Mimicked         | HTML          |
| Android UX              | Native     | Mimicked         | Native       | Native           | Native           | HTML          |
| Rendering Canvas        | Native     | Impeller/Skia    | Flexbox      | Native           | Skia             | WebView       |
| Code Execution          | Compiled   | Compiled         | Interpreted  | Compiled         | Compiled         | Interpreted   |
| Call Platform API       | Direct     | Bridged          | Bridged      | Bridged          | Mixed            | Bridged       |
| Added VM/Runtime        | None       | Flutter Engine   | Hermes       | Mono             | Kotlin/Native    | Varies        |
| Added Garbage Collector | None       | Yes              | Yes          | Yes              | Yes              | Yes           |


