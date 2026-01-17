---
title: NavigationStack
layout: docs
permalink: /docs/components/navigationstack/
component: NavigationStack
---

Skip support for [SwiftUI.NavigationStack](https://developer.apple.com/documentation/swiftui/navigationstack) on Android.
Consult the SkipUI module for a [complete list of supported SwiftUI](/docs/modules/skip-ui/#supported-swiftui).

The following example screens and source code is from SkipUI's
[Showcase](/docs/samples/skipapp-showcase/) sample app
[`NavigationStackPlayground.swift`](https://github.com/skiptools/skipapp-showcase/tree/main/Sources/Showcase/NavigationStackPlayground.swift)


<div class="showcase-screenshot-container">
<img alt="Android screenshot for NavigationStack component (light mode)" src="http://assets.skip.dev/showcase/NavigationStack-android-light_framed.png" />
<img alt="iPhone screenshot for NavigationStack component (light mode)" src="http://assets.skip.dev/showcase/NavigationStack-iphone-light_framed.png" />
<img alt="iPhone screenshot for NavigationStack component (dark mode)" src="http://assets.skip.dev/showcase/NavigationStack-iphone-dark_framed.png" />
<img alt="Android screenshot for NavigationStack component (dark mode)" src="http://assets.skip.dev/showcase/NavigationStack-android-dark_framed.png" />
</div>


```swift
import SwiftUI

struct NavigationStackPlayground: View {
    @Environment(\.dismiss) var dismiss

    var body: some View {
        Button("Pop") {
            dismiss()
        }
        .toolbar {
            PlaygroundSourceLink(file: "NavigationStackPlayground.swift")
        }
    }
}
```

