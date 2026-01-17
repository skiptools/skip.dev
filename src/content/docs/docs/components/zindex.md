---
title: ZIndex
layout: docs
permalink: /docs/components/zindex/
component: ZIndex
---

Skip support for [SwiftUI.View.zindex](https://developer.apple.com/documentation/swiftui/view/zindex(_:)) on Android.
Consult the SkipUI module for a [complete list of supported SwiftUI](/docs/modules/skip-ui/#supported-swiftui).

The following example screens and source code is from SkipUI's
[Showcase](/docs/samples/skipapp-showcase/) sample app
[`ZIndexPlayground.swift`](https://github.com/skiptools/skipapp-showcase/tree/main/Sources/Showcase/ZIndexPlayground.swift)


<div class="showcase-screenshot-container">
<img alt="Android screenshot for ZIndex component (light mode)" src="http://assets.skip.dev/showcase/ZIndex-android-light_framed.png" />
<img alt="iPhone screenshot for ZIndex component (light mode)" src="http://assets.skip.dev/showcase/ZIndex-iphone-light_framed.png" />
<img alt="iPhone screenshot for ZIndex component (dark mode)" src="http://assets.skip.dev/showcase/ZIndex-iphone-dark_framed.png" />
<img alt="Android screenshot for ZIndex component (dark mode)" src="http://assets.skip.dev/showcase/ZIndex-android-dark_framed.png" />
</div>


```swift
import SwiftUI

struct ZIndexPlayground: View {
    var body: some View {
        ScrollView {
            VStack(spacing: 16.0) {
                HStack {
                    Text("Without zIndex")
                    Spacer()
                    ZStack {
                        Color.blue.opacity(0.5)
                            .frame(width: 20.0, height: 20.0)
                        Color.green.opacity(0.5)
                            .frame(width: 60.0, height: 60.0)
                        Color.red.opacity(0.5)
                            .frame(width: 100.0, height: 100.0)
                    }
                }
                HStack {
                    Text("With zIndex")
                    Spacer()
                    ZStack {
                        Color.blue.opacity(0.5)
                            .frame(width: 20.0, height: 20.0)
                            .zIndex(2.0)
                        Color.green.opacity(0.5)
                            .frame(width: 60.0, height: 60.0)
                            .zIndex(1.0)
                        Color.red.opacity(0.5)
                            .frame(width: 100.0, height: 100.0)
                    }
                }
                HStack {
                    Text("With zIndex before frame")
                    Spacer()
                    ZStack {
                        Color.blue.opacity(0.5)
                            .zIndex(2.0)
                            .frame(width: 20.0, height: 20.0)
                        Color.green.opacity(0.5)
                            .zIndex(1.0)
                            .frame(width: 60.0, height: 60.0)
                        Color.red.opacity(0.5)
                            .frame(width: 100.0, height: 100.0)
                    }
                }
            }
            .padding()
        }
    }
}
```

