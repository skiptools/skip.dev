---
title: Accessibility
layout: docs
permalink: /docs/components/accessibility/
component: Accessibility
---

Skip support for [SwiftUI.Accessibility](https://developer.apple.com/documentation/swiftui/view-accessibility).

The following example screens and source code is from SkipUI's
[Showcase](/docs/samples/skipapp-showcase/) sample app
[`AccessibilityPlayground.swift`](https://github.com/skiptools/skipapp-showcase/tree/main/Sources/Showcase/AccessibilityPlayground.swift)


<!-- 
<div class="showcase-screenshot-container">
<img alt="Android screenshot for Accessibility component (light mode)" src="http://assets.skip.dev/showcase/Accessibility-android-light.png" />
<img alt="iPhone screenshot for Accessibility component (light mode)" src="http://assets.skip.dev/showcase/Accessibility-iphone-light.png" />
<img alt="iPhone screenshot for Accessibility component (dark mode)" src="http://assets.skip.dev/showcase/Accessibility-iphone-dark.png" />
<img alt="Android screenshot for Accessibility component (dark mode)" src="http://assets.skip.dev/showcase/Accessibility-android-dark.png" />
</div>
 -->

```swift
import SwiftUI

struct AccessibilityPlayground: View {
    @State var isOn = false

    var body: some View {
        ScrollView {
            VStack(spacing: 16) {
                Text("Simulate a custom control with an accessibility label, value, and traits:")
                Text(isOn ? "+" : "-").font(.largeTitle)
                    .onTapGesture { isOn = !isOn }
                    .accessibilityLabel("My custom control")
                    .accessibilityValue(isOn ? "On" : "Off")
                    .accessibilityAddTraits(.isButton) // Use .isToggle on iOS 17+
                
                Divider()
                
                Text("Hide the following element from accessibility:")
                Text("Hidden").font(.largeTitle)
                    .accessibilityHidden(true)
            }
            .padding()
        }
        .toolbar {
            PlaygroundSourceLink(file: "AccessibilityPlayground.swift")
        }
    }
}
```

