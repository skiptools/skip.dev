---
title: Offset
layout: docs
permalink: /docs/components/offset/
component: Offset
---

Skip support for [SwiftUI.View.offset](https://developer.apple.com/documentation/swiftui/view/offset(x:y:)) on Android.
Consult the SkipUI module for a [complete list of supported SwiftUI](/docs/modules/skip-ui/#supported-swiftui).

The following example screens and source code is from SkipUI's
[Showcase](/docs/samples/skipapp-showcase/) sample app
[`OffsetPlayground.swift`](https://github.com/skiptools/skipapp-showcase/tree/main/Sources/Showcase/OffsetPlayground.swift)


<div class="showcase-screenshot-container">
<img alt="Android screenshot for Offset component (light mode)" src="http://assets.skip.dev/showcase/Offset-android-light_framed.png" />
<img alt="iPhone screenshot for Offset component (light mode)" src="http://assets.skip.dev/showcase/Offset-iphone-light_framed.png" />
<img alt="iPhone screenshot for Offset component (dark mode)" src="http://assets.skip.dev/showcase/Offset-iphone-dark_framed.png" />
<img alt="Android screenshot for Offset component (dark mode)" src="http://assets.skip.dev/showcase/Offset-android-dark_framed.png" />
</div>


```swift
import SwiftUI

struct OffsetPlayground: View {
    var body: some View {
        ScrollView {
            VStack(spacing: 16.0) {
                HStack {
                    Text(".offset(0, 0)")
                    Spacer()
                    ZStack {
                        Color.clear
                            .frame(width: 100.0, height: 100.0)
                            .border(.primary)
                        Color.red
                            .frame(width: 20.0, height: 20.0)
                            .offset(x: 0.0, y: 0.0)
                    }
                }
                HStack {
                    Text(".offset(50, -50)")
                    Spacer()
                    ZStack {
                        Color.clear
                            .frame(width: 100.0, height: 100.0)
                            .border(.primary)
                        Color.red
                            .frame(width: 20.0, height: 20.0)
                            .offset(x: 50.0, y: -50.0)
                    }
                }
                HStack {
                    Text(".offset(-50, 50)")
                    Spacer()
                    ZStack {
                        Color.clear
                            .frame(width: 100.0, height: 100.0)
                            .border(.primary)
                        Color.red
                            .frame(width: 20.0, height: 20.0)
                            .offset(x: -50.0, y: 50.0)
                    }
                }
                HStack {
                    Text(".offset(CGSize(50, 50))")
                    Spacer()
                    ZStack {
                        Color.clear
                            .frame(width: 100.0, height: 100.0)
                            .border(.primary)
                        Color.red
                            .frame(width: 20.0, height: 20.0)
                            .offset(CGSize(width: 50.0, height: 50.0))
                    }
                }
            }
            .padding()
        }
        .toolbar {
            PlaygroundSourceLink(file: "OffsetPlayground.swift")
        }
    }
}
```

