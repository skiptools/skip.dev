---
title: Toggle
layout: docs
permalink: /docs/components/toggle/
component: Toggle
---

Skip support for [SwiftUI.Toggle](https://developer.apple.com/documentation/swiftui/toggle) on Android.
Consult the SkipUI module for a [complete list of supported SwiftUI](/docs/modules/skip-ui/#supported-swiftui).

The following example screens and source code is from SkipUI's
[Showcase](/docs/samples/skipapp-showcase/) sample app
[`TogglePlayground.swift`](https://github.com/skiptools/skipapp-showcase/tree/main/Sources/Showcase/TogglePlayground.swift)


<div class="showcase-screenshot-container">
<img alt="Android screenshot for Toggle component (light mode)" src="http://assets.skip.dev/showcase/Toggle-android-light_framed.png" />
<img alt="iPhone screenshot for Toggle component (light mode)" src="http://assets.skip.dev/showcase/Toggle-iphone-light_framed.png" />
<img alt="iPhone screenshot for Toggle component (dark mode)" src="http://assets.skip.dev/showcase/Toggle-iphone-dark_framed.png" />
<img alt="Android screenshot for Toggle component (dark mode)" src="http://assets.skip.dev/showcase/Toggle-android-dark_framed.png" />
</div>


```swift
import SwiftUI

struct TogglePlayground: View {
    @State var isOn = false

    var body: some View {
        ScrollView {
            VStack(spacing: 16.0) {
                Toggle(isOn: $isOn) {
                    Text("Viewbuilder init")
                }
                Toggle("String init", isOn: $isOn)
                Toggle("Fixed width", isOn: $isOn)
                    .frame(width: 200.0)
                VStack {
                    Text(".labelsHidden():")
                    Toggle("Label", isOn: $isOn)
                }
                .labelsHidden()
                Toggle(".disabled(true)", isOn: $isOn)
                    .disabled(true)
                Toggle(".foregroundStyle(.red)", isOn: $isOn)
                    .foregroundStyle(.red)
                Toggle(".tint(.red)", isOn: $isOn)
                    .tint(.red)
            }
            .padding()
        }
        .toolbar {
            PlaygroundSourceLink(file: "TogglePlayground.swift")
        }
    }
}
```

