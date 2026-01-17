---
title: Frame
layout: docs
permalink: /docs/components/frame/
component: Frame
---

Skip support for [SwiftUI.View.frame](https://developer.apple.com/documentation/swiftui/layout-adjustments) on Android.
Consult the SkipUI module for a [complete list of supported SwiftUI](/docs/modules/skip-ui/#supported-swiftui).

The following example screens and source code is from SkipUI's
[Showcase](/docs/samples/skipapp-showcase/) sample app
[`FramePlayground.swift`](https://github.com/skiptools/skipapp-showcase/tree/main/Sources/Showcase/FramePlayground.swift)


<div class="showcase-screenshot-container">
<img alt="Android screenshot for Frame component (light mode)" src="http://assets.skip.dev/showcase/Frame-android-light_framed.png" />
<img alt="iPhone screenshot for Frame component (light mode)" src="http://assets.skip.dev/showcase/Frame-iphone-light_framed.png" />
<img alt="iPhone screenshot for Frame component (dark mode)" src="http://assets.skip.dev/showcase/Frame-iphone-dark_framed.png" />
<img alt="Android screenshot for Frame component (dark mode)" src="http://assets.skip.dev/showcase/Frame-android-dark_framed.png" />
</div>


```swift
import SwiftUI

struct FramePlayground: View {
    var body: some View {
        ScrollView {
            VStack(spacing: 16.0) {
                VStack {
                    Text("width: 100")
                    HStack {
                        Text("A")
                        Color.red
                            .frame(width: 100.0)
                        Text("B")
                    }
                }
                .frame(height: 50.0)
                VStack {
                    Text("height: 50")
                    HStack {
                        Text("A")
                        Color.red
                            .frame(height: 50.0)
                        Text("B")
                    }
                }
                VStack {
                    Text("width: 100, height: 50")
                    HStack {
                        Text("A")
                        Color.red
                            .frame(width: 100.0, height: 50.0)
                        Text("B")
                    }
                }
                VStack {
                    Text("minWidth: 0, maxWidth: .infinity,\n  minHeight: 0, maxHeight: .infinity")
                    HStack {
                        Text("A")
                        Color.red
                            .frame(minWidth: 0.0, maxWidth: .infinity, minHeight: 0.0, maxHeight: .infinity)
                        Text("B")
                    }
                }
                VStack {
                    Text("minWidth: 0, maxWidth: .infinity,\n  minHeight: 0, maxHeight: .infinity")
                    HStack {
                        Text("A")
                        Color.red
                            .frame(minWidth: 0.0, maxWidth: .infinity, minHeight: 0.0, maxHeight: .infinity)
                        Color.blue
                            .frame(minWidth: 0.0, maxWidth: .infinity, minHeight: 0.0, maxHeight: .infinity)
                        Text("B")
                    }
                }
                VStack {
                    Text("minWidth: 300, maxWidth: .infinity,\n  minHeight: 100, maxHeight: .infinity")
                    HStack {
                        Text("A")
                        Color.red
                            .frame(minWidth: 300.0, maxWidth: .infinity, minHeight: 100.0, maxHeight: .infinity)
                        Color.blue
                            .frame(minWidth: 0.0, maxWidth: .infinity, minHeight: 0.0, maxHeight: .infinity)
                        Text("B")
                    }
                }
                VStack {
                    Text("minWidth: 100,\n  minHeight: 0, maxHeight: .infinity")
                    HStack {
                        Text("A")
                        Color.red
                            .frame(minWidth: 100.0, minHeight: 0.0, maxHeight: .infinity)
                        Color.blue
                            .frame(minWidth: 0.0, maxWidth: .infinity, minHeight: 0.0, maxHeight: .infinity)
                        Text("B")
                    }
                }
                VStack {
                    Text("width: 100, height: 100")
                    Text("A")
                        .frame(width: 100.0, height: 100.0)
                        .border(.primary)
                }
                VStack {
                    Text("alignment: .bottomTrailing")
                    Text("A")
                        .frame(width: 100.0, height: 100.0, alignment: .bottomTrailing)
                        .border(.primary)
                }
            }
            .padding()
        }
        .toolbar {
            PlaygroundSourceLink(file: "FramePlayground.swift")
        }
    }
}
```

