---
title: Border
layout: docs
permalink: /docs/components/border/
component: Border
---

Skip support for [SwiftUI.View.border](https://developer.apple.com/documentation/swiftui/view/border(_:width:)) on Android.
Consult the SkipUI module for a [complete list of supported SwiftUI](/docs/modules/skip-ui/#supported-swiftui).

The following example screens and source code is from SkipUI's
[Showcase](/docs/samples/skipapp-showcase/) sample app
[`BorderPlayground.swift`](https://github.com/skiptools/skipapp-showcase/tree/main/Sources/Showcase/BorderPlayground.swift)


<div class="showcase-screenshot-container">
<img alt="Android screenshot for Border component (light mode)" src="http://assets.skip.dev/showcase/Border-android-light_framed.png" />
<img alt="iPhone screenshot for Border component (light mode)" src="http://assets.skip.dev/showcase/Border-iphone-light_framed.png" />
<img alt="iPhone screenshot for Border component (dark mode)" src="http://assets.skip.dev/showcase/Border-iphone-dark_framed.png" />
<img alt="Android screenshot for Border component (dark mode)" src="http://assets.skip.dev/showcase/Border-android-dark_framed.png" />
</div>


```swift
import SwiftUI

struct BorderPlayground: View {
    var body: some View {
        ScrollView {
            VStack(spacing: 16.0) {
                HStack {
                    Text(".border")
                    Spacer()
                    Color.red
                        .frame(width: 100.0, height: 100.0)
                        .border(.primary)
                }
                HStack {
                    Text(".padding()")
                    Spacer()
                    Color.red
                        .frame(width: 100.0, height: 100.0)
                        .padding()
                        .border(.primary)
                }
                HStack {
                    Text(".padding([.top, .leading])")
                    Spacer()
                    Color.red
                        .frame(width: 100.0, height: 100.0)
                        .padding([.top, .leading], 32.0)
                        .border(.primary)
                }
                HStack {
                    Text(".blue, 5.0")
                    Spacer()
                    Color.red
                        .frame(width: 100.0, height: 100.0)
                        .border(.blue, width: 5.0)
                }
                HStack {
                    Text(".blue.gradient, 10.0")
                    Spacer()
                    Color.red
                        .frame(width: 100.0, height: 100.0)
                        .border(.blue.gradient, width: 10.0)
                }
                HStack {
                    Text("VStack")
                    Spacer()
                    VStack {
                        Color.red
                            .frame(width: 100.0, height: 100.0)
                            .padding()
                        Color.red
                            .frame(width: 100.0, height: 100.0)
                            .padding()
                    }
                    .border(.primary)
                }
            }
            .padding()
        }
        .toolbar {
            PlaygroundSourceLink(file: "BorderPlayground.swift")
        }
    }
}
```

