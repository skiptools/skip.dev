---
title: Label
layout: docs
permalink: /docs/components/label/
component: Label
---

Skip support for [SwiftUI.Label](https://developer.apple.com/documentation/swiftui/label) on Android.
Consult the SkipUI module for a [complete list of supported SwiftUI](/docs/modules/skip-ui/#supported-swiftui).

The following example screens and source code is from SkipUI's
[Showcase](/docs/samples/skipapp-showcase/) sample app
[`LabelPlayground.swift`](https://github.com/skiptools/skipapp-showcase/tree/main/Sources/Showcase/LabelPlayground.swift)


<div class="showcase-screenshot-container">
<img alt="Android screenshot for Label component (light mode)" src="http://assets.skip.dev/showcase/Label-android-light_framed.png" />
<img alt="iPhone screenshot for Label component (light mode)" src="http://assets.skip.dev/showcase/Label-iphone-light_framed.png" />
<img alt="iPhone screenshot for Label component (dark mode)" src="http://assets.skip.dev/showcase/Label-iphone-dark_framed.png" />
<img alt="Android screenshot for Label component (dark mode)" src="http://assets.skip.dev/showcase/Label-android-dark_framed.png" />
</div>


```swift
import SwiftUI

struct LabelPlayground: View {
    var body: some View {
        ScrollView {
            VStack(spacing: 16.0) {
                Label {
                    Text(".init(_:icon:)")
                } icon: {
                    Image(systemName: "star.fill")
                }
                Label(".init(_:systemImage:)", systemImage: "star.fill")
                Label(".font(.title)", systemImage: "star.fill")
                    .font(.title)
                Label(".foregroundStyle(.red)", systemImage: "star.fill")
                    .foregroundStyle(.red)
                Label(".tint(.red)", systemImage: "star.fill")
                    .tint(.red)
                Text("Note: tint should not affect Label appearance")
                    .font(.caption)
            }
            .padding()
        }
        .toolbar {
            PlaygroundSourceLink(file: "LabelPlayground.swift")
        }
    }
}
```

