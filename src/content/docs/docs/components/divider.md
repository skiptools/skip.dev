---
title: Divider
layout: docs
permalink: /docs/components/divider/
component: Divider
---

Skip support for [SwiftUI.Divider](https://developer.apple.com/documentation/swiftui/divider) on Android.
Consult the SkipUI module for a [complete list of supported SwiftUI](/docs/modules/skip-ui/#supported-swiftui).

The following example screens and source code is from SkipUI's
[Showcase](/docs/samples/skipapp-showcase/) sample app
[`DividerPlayground.swift`](https://github.com/skiptools/skipapp-showcase/tree/main/Sources/Showcase/DividerPlayground.swift)


<div class="showcase-screenshot-container">
<img alt="Android screenshot for Divider component (light mode)" src="http://assets.skip.dev/showcase/Divider-android-light_framed.png" />
<img alt="iPhone screenshot for Divider component (light mode)" src="http://assets.skip.dev/showcase/Divider-iphone-light_framed.png" />
<img alt="iPhone screenshot for Divider component (dark mode)" src="http://assets.skip.dev/showcase/Divider-iphone-dark_framed.png" />
<img alt="Android screenshot for Divider component (dark mode)" src="http://assets.skip.dev/showcase/Divider-android-dark_framed.png" />
</div>


```swift
import SwiftUI

struct DividerPlayground: View {
    var body: some View {
        ScrollView {
            VStack(spacing: 16.0) {
                VStack {
                    Text("Default")
                    Divider()
                }
                VStack {
                    Text("Fixed width")
                    Divider()
                        .frame(width: 100.0)
                }
                HStack {
                    Text("Vertical")
                        .padding()
                    Divider()
                }
                .frame(height: 100.0)
                HStack {
                    Text("Vertical fixed height")
                        .padding()
                    Divider()
                        .frame(height: 50.0)
                }
                .frame(height: 100.0)
                VStack {
                    Text(".foregroundStyle(.red)")
                    Divider()
                        .foregroundStyle(.red)
                }
                VStack {
                    Text(".tint(.red)")
                    Divider()
                        .tint(.red)
                }
                Text("Note: colors should not affect Divider appearance")
                    .font(.caption)
            }
            .padding()
        }
        .toolbar {
            PlaygroundSourceLink(file: "DividerPlayground.swift")
        }
    }
}
```

