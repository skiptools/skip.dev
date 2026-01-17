---
layout: wide
title: Skip Comparison Matrix
permalink: /compare/
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
    background-color: #333;
    color: white;
    min-width: 55pt;
}

td:nth-child(1) {
    /* font-weight: 400; */
}

/* Highlight the second "Skip" column */
td:nth-child(2999) {
    background-color: var(--system-teal-color-medium);
    /* color: var(--text-background-color); */
    font-weight: bolder;
}

tr:nth-child(even) {
    background-color: var(--alternating-content-background-color);
}

tr:hover {
    background-color: var(--system-teal-color-medium);
}

td {
    border: 1px solid var(--grid-color);
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

{% assign check = '<img class="table-icon icon system-green" alt="checkmark" src="/assets/icons/checkmark.circle.fill.svg"/>' %}
{% assign cross = '<img class="table-icon icon system-red" alt="cross" src="/assets/icons/x.circle.fill.svg"/>' %}

| | Write<br/>Twice | Skip | Flutter | React<br/>Native | Compose<br/>Multiplatform | |
|-:|:-:|:-:|:-:|:-:|:-:|:-|
| Develop with a single language<br/>in a single codebase | {{ cross }} | {{ check }} | {{ check }} | {{ check }} | {{ check }} |
| Modern memory-safe language | {{ check }} | {{ check }}  | {{ check }}  | {{ check }} | {{ check }} |
| Natively Compiled | {{ check }} | {{ check }} | {{ check }} | {{ cross }} | {{ check }} | |
| Memory efficient<br/>(no added garbage collection) | {{ check }}<br/>{{ check }} | {{ check }}<br/>{{ check }} | {{ cross }}<br/>{{ cross }} | {{ cross }}<br/>{{ cross }} | {{ cross }}<br/>{{ check }} | iOS<br/><br/>Android |
| Platform-native widgets | {{ check }}<br/>{{ check }} | {{ check }}<br/>{{ check }}  | {{ cross }}<br/>{{ cross }} | {{ check }}<br/>{{ check }} | {{ cross }}<br/>{{ check }} | iOS: native UIKit<br/><br/>Android: native Views |
| Vendor-recommended toolkit | {{ check }}<br/>{{ check }} | {{ check }}<br/>{{ check }}  | {{ cross }}<br/>{{ cross }} | {{ cross }}<br/>{{ cross }} | {{ cross }}<br/>{{ check }} | Apple: SwiftUI<br/><br/>Google: Jetpack Compose |
| Effortless platform API access | {{ check }}<br/>{{ check }} | {{ check }}<br/>{{ check }} | {{ cross }}<br/>{{ cross }} | {{ cross }}<br/>{{ cross }} | {{ cross }}<br/>{{ check }} | iOS: Swift<br/><br/>Android: Kotlin |
| Ejectable | N/A | {{ check }} | {{ cross }} | {{ cross }} | {{ cross }} |


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


