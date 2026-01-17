---
title: OffsetPosition
layout: docs
permalink: /docs/components/offsetposition/
component: OffsetPosition
---

Skip support for [SwiftUI.offset](https://developer.apple.com/documentation/swiftui/view/offset(_:)).

The following example screens and source code is from SkipUI's
[Showcase](/docs/samples/skipapp-showcase/) sample app
[`OffsetPositionPlayground.swift`](https://github.com/skiptools/skipapp-showcase/tree/main/Sources/Showcase/OffsetPositionPlayground.swift)


<!-- 
<div class="showcase-screenshot-container">
<img alt="Android screenshot for OffsetPosition component (light mode)" src="http://assets.skip.dev/showcase/OffsetPosition-android-light.png" />
<img alt="iPhone screenshot for OffsetPosition component (light mode)" src="http://assets.skip.dev/showcase/OffsetPosition-iphone-light.png" />
<img alt="iPhone screenshot for OffsetPosition component (dark mode)" src="http://assets.skip.dev/showcase/OffsetPosition-iphone-dark.png" />
<img alt="Android screenshot for OffsetPosition component (dark mode)" src="http://assets.skip.dev/showcase/OffsetPosition-android-dark.png" />
</div>
 -->

```swift
import SwiftUI

struct OffsetPositionPlayground: View {
    var body: some View {
        ScrollView {
            VStack(spacing: 16) {
                HStack {
                    Text(".offset(0, 0)")
                    Spacer()
                    ZStack {
                        Color.clear
                            .frame(width: 100, height: 100)
                            .border(.primary)
                        Color.red
                            .frame(width: 20, height: 20)
                            .offset(x: 0, y: 0)
                    }
                }
                HStack {
                    Text(".offset(50, -50)")
                    Spacer()
                    ZStack {
                        Color.clear
                            .frame(width: 100, height: 100)
                            .border(.primary)
                        Color.red
                            .frame(width: 20, height: 20)
                            .offset(x: 50, y: -50)
                    }
                }
                HStack {
                    Text(".offset(-50, 50)")
                    Spacer()
                    ZStack {
                        Color.clear
                            .frame(width: 100, height: 100)
                            .border(.primary)
                        Color.red
                            .frame(width: 20, height: 20)
                            .offset(x: -50, y: 50)
                    }
                }
                HStack {
                    Text(".offset(CGSize(50, 50))")
                    Spacer()
                    ZStack {
                        Color.clear
                            .frame(width: 100, height: 100)
                            .border(.primary)
                        Color.red
                            .frame(width: 20, height: 20)
                            .offset(CGSize(width: 50, height: 50))
                    }
                }
                HStack {
                    Text(".position(0, 0)")
                    Spacer()
                    ZStack {
                        Color.red
                            .frame(width: 20, height: 20)
                            .position(x: 0, y: 0)
                    }
                    .frame(width: 100, height: 100)
                    .border(.primary)
                }
                HStack {
                    Text(".position(50, 50)")
                    Spacer()
                    ZStack {
                        Color.red
                            .frame(width: 20, height: 20)
                            .position(x: 50, y: 50)
                    }
                    .frame(width: 100, height: 100)
                    .border(.primary)
                }
                HStack {
                    Text(".position(CGPoint(75, 75))")
                    Spacer()
                    ZStack {
                        Color.red
                            .frame(width: 20, height: 20)
                            .position(CGPoint(x: 75, y: 75))
                    }
                    .frame(width: 100, height: 100)
                    .border(.primary)
                }
                NavigationLink("Push Text.position(100, 100)") {
                    Text("Over here!")
                        .background(.yellow)
                        .position(x: 100, y: 100)
                }
            }
            .padding()
        }
        .toolbar {
            PlaygroundSourceLink(file: "OffsetPositionPlayground.swift")
        }
    }
}
```

