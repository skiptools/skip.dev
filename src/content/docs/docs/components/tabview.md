---
title: TabView
layout: docs
permalink: /docs/components/tabview/
component: TabView
---

Skip support for [SwiftUI.TabView](https://developer.apple.com/documentation/swiftui/tabview) on Android.
Consult the SkipUI module for a [complete list of supported SwiftUI](/docs/modules/skip-ui/#supported-swiftui).

The following example screens and source code is from SkipUI's
[Showcase](/docs/samples/skipapp-showcase/) sample app
[`TabViewPlayground.swift`](https://github.com/skiptools/skipapp-showcase/tree/main/Sources/Showcase/TabViewPlayground.swift)


<div class="showcase-screenshot-container">
<img alt="Android screenshot for TabView component (light mode)" src="http://assets.skip.dev/showcase/TabView-android-light_framed.png" />
<img alt="iPhone screenshot for TabView component (light mode)" src="http://assets.skip.dev/showcase/TabView-iphone-light_framed.png" />
<img alt="iPhone screenshot for TabView component (dark mode)" src="http://assets.skip.dev/showcase/TabView-iphone-dark_framed.png" />
<img alt="Android screenshot for TabView component (dark mode)" src="http://assets.skip.dev/showcase/TabView-android-dark_framed.png" />
</div>


```swift
import SwiftUI

struct TabViewPlayground: View {
    @State var selectedTab = "Home"

    var body: some View {
        TabView(selection: $selectedTab) {
            TabPlaygroundContentView(label: "Home", selectedTab: $selectedTab)
                .tabItem { Label("Home", systemImage: "house.fill") }
                .tag("Home")
            TabPlaygroundContentView(label: "Favorites", selectedTab: $selectedTab)
                .tabItem { Label("Favorites", systemImage: "heart.fill") }
                .tag("Favorites")
            TabPlaygroundContentView(label: "Info", selectedTab: $selectedTab)
                .tabItem { Label("Info", systemImage: "info.circle.fill") }
                .tag("Info")
        }
        .toolbar {
            PlaygroundSourceLink(file: "TabViewPlayground.swift")
        }
    }
}

struct TabPlaygroundContentView: View {
    let label: String
    @Binding var selectedTab: String

    var body: some View {
        VStack {
            Text(label).bold()
            if label != "Home" {
                Button("Switch to Home") {
                    selectedTab = "Home"
                }
            }
            if label != "Favorites" {
                Button("Switch to Favorites") {
                    selectedTab = "Favorites"
                }
            }
            if label != "Info" {
                Button("Switch to Info") {
                    selectedTab = "Info"
                }
            }
        }
    }
}
```

