---
title: Slider
layout: docs
permalink: /docs/components/slider/
component: Slider
---

Skip support for [SwiftUI.Slider](https://developer.apple.com/documentation/swiftui/slider) on Android.
Consult the SkipUI module for a [complete list of supported SwiftUI](/docs/modules/skip-ui/#supported-swiftui).

The following example screens and source code is from SkipUI's
[Showcase](/docs/samples/skipapp-showcase/) sample app
[`SliderPlayground.swift`](https://github.com/skiptools/skipapp-showcase/tree/main/Sources/Showcase/SliderPlayground.swift)


<div class="showcase-screenshot-container">
<img alt="Android screenshot for Slider component (light mode)" src="http://assets.skip.dev/showcase/Slider-android-light_framed.png" />
<img alt="iPhone screenshot for Slider component (light mode)" src="http://assets.skip.dev/showcase/Slider-iphone-light_framed.png" />
<img alt="iPhone screenshot for Slider component (dark mode)" src="http://assets.skip.dev/showcase/Slider-iphone-dark_framed.png" />
<img alt="Android screenshot for Slider component (dark mode)" src="http://assets.skip.dev/showcase/Slider-android-dark_framed.png" />
</div>


```swift
import SwiftUI

struct SliderPlayground: View {
    @State var value = 0.5

    var body: some View {
        ScrollView {
            VStack(spacing: 16.0) {
                Slider(value: $value)
                HStack {
                    Text(".disabled(true)")
                    Slider(value: $value)
                        .disabled(true)
                }
                HStack {
                    Text(".foregroundStyle(.red)")
                    Slider(value: $value)
                        .foregroundStyle(.red)
                }
                HStack {
                    Text(".tint(.red)")
                    Slider(value: $value)
                        .tint(.red)
                }
            }
            .padding()
        }
        .toolbar {
            PlaygroundSourceLink(file: "SliderPlayground.swift")
        }
    }
}
```

