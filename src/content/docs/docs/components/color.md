---
title: Color
layout: docs
permalink: /docs/components/color/
component: Color
---

Skip support for [SwiftUI.Color](https://developer.apple.com/documentation/swiftui/color) on Android.
Consult the SkipUI module for a [complete list of supported SwiftUI](/docs/modules/skip-ui/#supported-swiftui).

The following example screens and source code is from SkipUI's
[Showcase](/docs/samples/skipapp-showcase/) sample app
[`ColorPlayground.swift`](https://github.com/skiptools/skipapp-showcase/tree/main/Sources/Showcase/ColorPlayground.swift)


<div class="showcase-screenshot-container">
<img alt="Android screenshot for Color component (light mode)" src="http://assets.skip.dev/showcase/Color-android-light_framed.png" />
<img alt="iPhone screenshot for Color component (light mode)" src="http://assets.skip.dev/showcase/Color-iphone-light_framed.png" />
<img alt="iPhone screenshot for Color component (dark mode)" src="http://assets.skip.dev/showcase/Color-iphone-dark_framed.png" />
<img alt="Android screenshot for Color component (dark mode)" src="http://assets.skip.dev/showcase/Color-android-dark_framed.png" />
</div>


```swift
import SwiftUI

struct ColorPlayground: View {
    var body: some View {
        ScrollView {
            VStack(spacing: 16.0) {
                colorRow(label: Text("Red"), color: .red)
                colorRow(label: Text("Red, .opacity(0.5)"), color: Color.red)
                colorRow(label: Text("RGB"), color: Color(red: 1.0, green: 0.0, blue: 0.0))
                colorRow(label: Text("White, Opacity"), color: Color(white: 0.5, opacity: 1.0))
                colorRow(label: Text("Accent color"), color: .accentColor)
                colorRow(label: Text("Red"), color: .red)
                colorRow(label: Text("Orange"), color: .orange)
                colorRow(label: Text("Yellow"), color: .yellow)
                colorRow(label: Text("Green"), color: .green)
                colorRow(label: Text("Mint"), color: .mint)
                colorRow(label: Text("Teal"), color: .teal)
                colorRow(label: Text("Cyan"), color: .cyan)
                colorRow(label: Text("Blue"), color: .blue)
                colorRow(label: Text("Indigo"), color: .indigo)
                colorRow(label: Text("Purple"), color: .purple)
                colorRow(label: Text("Pink"), color: .pink)
                colorRow(label: Text("Brown"), color: .brown)
                colorRow(label: Text("White"), color: .white)
                colorRow(label: Text("Gray"), color: .gray)
                colorRow(label: Text("Black"), color: .black)
                colorRow(label: Text("Clear"), color: .clear)
                colorRow(label: Text("Primary"), color: .primary)
                colorRow(label: Text("Secondary"), color: .secondary)
            }
            .padding()
        }
        .toolbar {
            PlaygroundSourceLink(file: "ColorPlayground.swift")
        }
    }

    func colorRow(label: Text, color: Color) -> some View {
        HStack {
            label
            Spacer()
            color
                .frame(width: 100.0, height: 100.0)
        }
    }
}
```

