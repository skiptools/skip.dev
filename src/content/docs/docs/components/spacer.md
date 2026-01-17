---
title: Spacer
layout: docs
permalink: /docs/components/spacer/
component: Spacer
---

Skip support for [SwiftUI.Spacer](https://developer.apple.com/documentation/swiftui/spacer) on Android.
Consult the SkipUI module for a [complete list of supported SwiftUI](/docs/modules/skip-ui/#supported-swiftui).

The following example screens and source code is from SkipUI's
[Showcase](/docs/samples/skipapp-showcase/) sample app
[`SpacerPlayground.swift`](https://github.com/skiptools/skipapp-showcase/tree/main/Sources/Showcase/SpacerPlayground.swift)


<div class="showcase-screenshot-container">
<img alt="Android screenshot for Spacer component (light mode)" src="http://assets.skip.dev/showcase/Spacer-android-light_framed.png" />
<img alt="iPhone screenshot for Spacer component (light mode)" src="http://assets.skip.dev/showcase/Spacer-iphone-light_framed.png" />
<img alt="iPhone screenshot for Spacer component (dark mode)" src="http://assets.skip.dev/showcase/Spacer-iphone-dark_framed.png" />
<img alt="Android screenshot for Spacer component (dark mode)" src="http://assets.skip.dev/showcase/Spacer-android-dark_framed.png" />
</div>


```swift
import SwiftUI

struct SpacerPlayground: View {
    var body: some View {
        ScrollView {
            VStack(spacing: 16.0) {
                HStack {
                    Text("Before")
                    Spacer()
                    Text("After")
                }
                HStack {
                    Text("Before fixed")
                    Spacer()
                        .frame(width: 100.0)
                    Text("After fixed")
                }
                VStack {
                    Text("Before vstack")
                    Spacer()
                        .frame(height: 100.0)
                    Text("After vstack")
                }
            }
            .padding()
        }
        .toolbar {
            PlaygroundSourceLink(file: "SpacerPlayground.swift")
        }
    }
}
```

