---
title: Overlay
layout: docs
permalink: /docs/components/overlay/
component: Overlay
---

Skip support for [SwiftUI.View.overlay](https://developer.apple.com/documentation/swiftui/view/overlay(alignment:content:)) on Android.
Consult the SkipUI module for a [complete list of supported SwiftUI](/docs/modules/skip-ui/#supported-swiftui).

The following example screens and source code is from SkipUI's
[Showcase](/docs/samples/skipapp-showcase/) sample app
[`OverlayPlayground.swift`](https://github.com/skiptools/skipapp-showcase/tree/main/Sources/Showcase/OverlayPlayground.swift)


<div class="showcase-screenshot-container">
<img alt="Android screenshot for Overlay component (light mode)" src="http://assets.skip.dev/showcase/Overlay-android-light_framed.png" />
<img alt="iPhone screenshot for Overlay component (light mode)" src="http://assets.skip.dev/showcase/Overlay-iphone-light_framed.png" />
<img alt="iPhone screenshot for Overlay component (dark mode)" src="http://assets.skip.dev/showcase/Overlay-iphone-dark_framed.png" />
<img alt="Android screenshot for Overlay component (dark mode)" src="http://assets.skip.dev/showcase/Overlay-android-dark_framed.png" />
</div>


```swift
import SwiftUI

struct OverlayPlayground: View {
    var body: some View {
        ScrollView {
            VStack(spacing: 16.0) {
                HStack {
                    Text(".red.opacity(0.5)")
                    Spacer()
                    Text("Hello")
                        .padding()
                        .overlay(.red.opacity(0.5))
                }
                HStack {
                    Text("in: Capsule()")
                    Spacer()
                    Text("Hello")
                        .padding()
                        .overlay(.red.opacity(0.5), in: Capsule())
                }
                HStack {
                    Text("Circles")
                    Spacer()
                    Text("Hello")
                        .padding()
                        .overlay {
                            HStack {
                                Circle().fill(.red.opacity(0.5))
                                Circle().fill(.green.opacity(0.5))
                            }
                        }
                        .border(.blue)
                }
                HStack {
                    Text("Large circle")
                    Spacer()
                    Text("Hello")
                        .padding()
                        .overlay {
                            Circle()
                                .fill(.red.opacity(0.5))
                                .frame(width: 100.0, height: 100.0)
                        }
                        .border(.blue)
                }
                HStack {
                    Text(".clipped()")
                    Spacer()
                    Text("Hello")
                        .padding()
                        .overlay {
                            HStack {
                                Circle().fill(.red.opacity(0.5))
                                Circle().fill(.red.opacity(0.5))
                            }
                            .frame(width: 200.0, height: 100.0)
                        }
                        .clipped()
                        .border(.blue)
                }
                HStack {
                    Text("Small circle")
                    Spacer()
                    Text("Hello")
                        .padding()
                        .overlay {
                            Circle()
                                .fill(.red.opacity(0.5))
                                .frame(width: 20.0, height: 20.0)
                        }
                        .border(.blue)
                }
                HStack {
                    Text("alignment: .topLeading")
                    Spacer()
                    Text("Hello")
                        .padding()
                        .overlay(alignment: .topLeading) {
                            Circle()
                                .fill(.red.opacity(0.5))
                                .frame(width: 20.0, height: 20.0)
                        }
                        .border(.blue)
                }
                HStack {
                    Text("alignment: .bottomTrailing")
                    Spacer()
                    Text("Hello")
                        .padding()
                        .overlay(alignment: .bottomTrailing) {
                            Circle()
                                .fill(.red.opacity(0.5))
                                .frame(width: 20.0, height: 20.0)
                        }
                        .border(.blue)
                }
            }
            .padding()
        }
        .toolbar {
            PlaygroundSourceLink(file: "OverlayPlayground.swift")
        }
    }
}
```

