---
title: Link
layout: docs
permalink: /docs/components/link/
component: Link
---

Skip support for [SwiftUI.Link](https://developer.apple.com/documentation/swiftui/link) on Android.
Consult the SkipUI module for a [complete list of supported SwiftUI](/docs/modules/skip-ui/#supported-swiftui).

The following example screens and source code is from SkipUI's
[Showcase](/docs/samples/skipapp-showcase/) sample app
[`LinkPlayground.swift`](https://github.com/skiptools/skipapp-showcase/tree/main/Sources/Showcase/LinkPlayground.swift)


<div class="showcase-screenshot-container">
<img alt="Android screenshot for Link component (light mode)" src="http://assets.skip.tools/showcase/Link-android-light_framed.png" />
<img alt="iPhone screenshot for Link component (light mode)" src="http://assets.skip.tools/showcase/Link-iphone-light_framed.png" />
<img alt="iPhone screenshot for Link component (dark mode)" src="http://assets.skip.tools/showcase/Link-iphone-dark_framed.png" />
<img alt="Android screenshot for Link component (dark mode)" src="http://assets.skip.tools/showcase/Link-android-dark_framed.png" />
</div>


```swift
import SwiftUI

struct LinkPlayground: View {
    @Environment(\.openURL) var openURL
    let destination = URL(string: "https://skip.dev")!

    var body: some View {
        ScrollView {
            VStack(spacing: 16.0) {
                Link(destination: destination) {
                    Text(".init(destination:label:)")
                }
                Link(".init(_:destination:)", destination: destination)
                Link(destination: destination) {
                    Image(systemName: "heart.fill")
                }
                .border(.blue)
                Link(".buttonStyle(.bordered)", destination: destination)
                    .buttonStyle(.bordered)
                Link(".foregroundStyle(.red)", destination: destination)
                    .foregroundStyle(.red)
                Link(".tint(.red)", destination: destination)
                    .tint(.red)
                Button("@Environment(\\.openURL)") {
                    openURL(destination)
                }
            }
            .padding()
        }
        .toolbar {
            PlaygroundSourceLink(file: "LinkPlayground.swift")
        }
    }
}
```

