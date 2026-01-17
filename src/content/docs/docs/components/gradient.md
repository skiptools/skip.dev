---
title: Gradient
layout: docs
permalink: /docs/components/gradient/
component: Gradient
---

Skip support for [SwiftUI.Gradient](https://developer.apple.com/documentation/swiftui/gradient) on Android.
Consult the SkipUI module for a [complete list of supported SwiftUI](/docs/modules/skip-ui/#supported-swiftui).

The following example screens and source code is from SkipUI's
[Showcase](/docs/samples/skipapp-showcase/) sample app
[`GradientPlayground.swift`](https://github.com/skiptools/skipapp-showcase/tree/main/Sources/Showcase/GradientPlayground.swift)


<div class="showcase-screenshot-container">
<img alt="Android screenshot for Gradient component (light mode)" src="http://assets.skip.dev/showcase/Gradient-android-light_framed.png" />
<img alt="iPhone screenshot for Gradient component (light mode)" src="http://assets.skip.dev/showcase/Gradient-iphone-light_framed.png" />
<img alt="iPhone screenshot for Gradient component (dark mode)" src="http://assets.skip.dev/showcase/Gradient-iphone-dark_framed.png" />
<img alt="Android screenshot for Gradient component (dark mode)" src="http://assets.skip.dev/showcase/Gradient-android-dark_framed.png" />
</div>


```swift
import SwiftUI

struct GradientPlayground: View {
    var body: some View {
        ScrollView {
            VStack(spacing: 16.0) {
                HStack {
                    Text(".red.gradient")
                    Spacer()
                    Rectangle()
                        .fill(.red.gradient)
                        .frame(width: 100.0, height: 100.0)
                }
                HStack {
                    Text("EllipitcalGradient")
                    Spacer()
                    EllipticalGradient(colors: [.red, .blue], center: UnitPoint(x: 0.5, y: 0.5), startRadiusFraction: 0.25)
                        .frame(width: 50.0, height: 100.0)
                }
                HStack {
                    Text("LinearGradient")
                    Spacer()
                    LinearGradient(colors: [.red, .blue], startPoint: UnitPoint(x: 0.0, y: 0.0), endPoint: UnitPoint(x: 1.0, y: 1.0))
                        .frame(width: 100.0, height: 100.0)
                }
                HStack {
                    Text("RadialGradient")
                    Spacer()
                    RadialGradient(colors: [.red, .blue], center: UnitPoint(x: 0.5, y: 0.5), startRadius: 25.0, endRadius: 50.0)
                        .frame(width: 100.0, height: 100.0)
                }
            }
            .padding()
        }
        .toolbar {
            PlaygroundSourceLink(file: "GradientPlayground.swift")
        }
    }
}
```

