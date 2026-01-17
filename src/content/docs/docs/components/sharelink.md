---
title: ShareLink
layout: docs
permalink: /docs/components/sharelink/
component: ShareLink
---

Skip support for [SwiftUI.ShareLink](https://developer.apple.com/documentation/swiftui/sharelink) on Android.
Consult the SkipUI module for a [complete list of supported SwiftUI](/docs/modules/skip-ui/#supported-swiftui).

The following example screens and source code is from SkipUI's
[Showcase](/docs/samples/skipapp-showcase/) sample app
[`ShareLinkPlayground.swift`](https://github.com/skiptools/skipapp-showcase/tree/main/Sources/Showcase/ShareLinkPlayground.swift)


<div class="showcase-screenshot-container">
<img alt="Android screenshot for ShareLink component (light mode)" src="http://assets.skip.tools/showcase/ShareLink-android-light_framed.png" />
<img alt="iPhone screenshot for ShareLink component (light mode)" src="http://assets.skip.tools/showcase/ShareLink-iphone-light_framed.png" />
<img alt="iPhone screenshot for ShareLink component (dark mode)" src="http://assets.skip.tools/showcase/ShareLink-iphone-dark_framed.png" />
<img alt="Android screenshot for ShareLink component (dark mode)" src="http://assets.skip.tools/showcase/ShareLink-android-dark_framed.png" />
</div>


```swift
import SwiftUI

struct ShareLinkPlayground: View {
    var body: some View {
        ScrollView {
            VStack(spacing: 16.0) {
                HStack {
                    Text("Default")
                    Spacer()
                    ShareLink(item: "My text")
                }
                HStack {
                    Text("Default URL")
                    Spacer()
                    ShareLink(item: URL(string: "https://skip.dev")!)
                }
                HStack {
                    Text("Subject & Message")
                    Spacer()
                    ShareLink(item: "My text", subject: Text("My subject"), message: Text("My message"))
                }
                HStack {
                    Text("Subject & Message URL")
                    Spacer()
                    ShareLink(item: URL(string: "https://skip.dev")!, subject: Text("My subject"), message: Text("My message"))
                }
                HStack {
                    Text("Title")
                    Spacer()
                    ShareLink("Title", item: "My text")
                }
                HStack {
                    Text(".buttonStyle(.bordered)")
                    Spacer()
                    ShareLink("Title", item: "My text")
                        .buttonStyle(.bordered)
                }
                HStack {
                    Text("Label")
                    Spacer()
                    ShareLink(item: "My text") {
                        Label("Title", systemImage: "heart.fill")
                    }
                }
            }
            .padding()
        }
        .toolbar {
            PlaygroundSourceLink(file: "ShareLinkPlayground.swift")
        }
    }
}
```

