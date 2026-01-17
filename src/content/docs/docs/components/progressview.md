---
title: ProgressView
layout: docs
permalink: /docs/components/progressview/
component: ProgressView
---

Skip support for [SwiftUI.ProgressView](https://developer.apple.com/documentation/swiftui/progressview) on Android.
Consult the SkipUI module for a [complete list of supported SwiftUI](/docs/modules/skip-ui/#supported-swiftui).

The following example screens and source code is from SkipUI's
[Showcase](/docs/samples/skipapp-showcase/) sample app
[`ProgressViewPlayground.swift`](https://github.com/skiptools/skipapp-showcase/tree/main/Sources/Showcase/ProgressViewPlayground.swift)


<div class="showcase-screenshot-container">
<img alt="Android screenshot for ProgressView component (light mode)" src="http://assets.skip.dev/showcase/ProgressView-android-light_framed.png" />
<img alt="iPhone screenshot for ProgressView component (light mode)" src="http://assets.skip.dev/showcase/ProgressView-iphone-light_framed.png" />
<img alt="iPhone screenshot for ProgressView component (dark mode)" src="http://assets.skip.dev/showcase/ProgressView-iphone-dark_framed.png" />
<img alt="Android screenshot for ProgressView component (dark mode)" src="http://assets.skip.dev/showcase/ProgressView-android-dark_framed.png" />
</div>


```swift
import SwiftUI

struct ProgressViewPlayground: View {
    var body: some View {
        ScrollView {
            VStack(spacing: 16.0) {
                HStack {
                    Text("Indeterminate")
                    Spacer()
                    ProgressView()
                }
                HStack {
                    Text("Progress nil")
                    Spacer()
                    ProgressView(value: nil, total: 1.0)
                }
                HStack {
                    Text("Progress 0.5")
                    Spacer()
                    ProgressView(value: 0.5)
                }
                HStack {
                    Text("Indeterminate linear")
                    Spacer()
                    ProgressView()
                        .progressViewStyle(.linear)
                }
                HStack {
                    Text("Progress 0.5 circular")
                    Spacer()
                    ProgressView(value: 0.5)
                        .progressViewStyle(.circular)
                }
                HStack {
                    Text("Indeterminate, .tint(.red)")
                    Spacer()
                    ProgressView()
                        .tint(.red)
                }
                HStack {
                    Text("Progress 0.5, .tint(.red)")
                    Spacer()
                    ProgressView(value: 0.5)
                        .tint(.red)
                }
            }
            .padding()
        }
        .toolbar {
            PlaygroundSourceLink(file: "ProgressViewPlayground.swift")
        }
    }
}
```

