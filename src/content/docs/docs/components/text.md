---
title: Text
layout: docs
permalink: /docs/components/text/
component: Text
---

Skip support for [SwiftUI.Text](https://developer.apple.com/documentation/swiftui/text) on Android.
Consult the SkipUI module for a [complete list of supported SwiftUI](/docs/modules/skip-ui/#supported-swiftui).

The following example screens and source code is from SkipUI's
[Showcase](/docs/samples/skipapp-showcase/) sample app
[`TextPlayground.swift`](https://github.com/skiptools/skipapp-showcase/tree/main/Sources/Showcase/TextPlayground.swift)


<div class="showcase-screenshot-container">
<img alt="Android screenshot for Text component (light mode)" src="http://assets.skip.dev/showcase/Text-android-light_framed.png" />
<img alt="iPhone screenshot for Text component (light mode)" src="http://assets.skip.dev/showcase/Text-iphone-light_framed.png" />
<img alt="iPhone screenshot for Text component (dark mode)" src="http://assets.skip.dev/showcase/Text-iphone-dark_framed.png" />
<img alt="Android screenshot for Text component (dark mode)" src="http://assets.skip.dev/showcase/Text-android-dark_framed.png" />
</div>


```swift
import SwiftUI

struct TextPlayground: View {
    var body: some View {
        ScrollView {
            VStack(spacing: 16) {
                Text("Plain")
                Text("Bold").bold()
                Text("Italic").italic()
                Text("Title bold italic").font(.title).bold().italic()
                VStack {
                    Text("Thin footnote container")
                    Text("Overridden to title font").font(.title)
                }
                .font(.footnote).fontWeight(.thin)
                .border(.primary)

                Divider()

                Text("Custom Font")
                    .font(Font.custom("Protest Guerrilla", size: 30.0)) // protest_guerrilla.ttf

                Divider()

                Text("Font.largeTitle").font(.largeTitle)
                Text("Font.title").font(.title)
                Text("Font.title2").font(.title2)
                Text("Font.title3").font(.title3)
                Text("Font.headline").font(.headline)
                Text("Font.subheadline").font(.subheadline)
                Text("Font.body").font(.body)
                Text("Font.callout").font(.callout)
                Text("Font.footnote").font(.footnote)
                Text("Font.caption").font(.caption)
                Text("Font.caption2").font(.caption2)

                Divider()

                Text("Wrap: This is some long text that should wrap when it exceeds the width of its frame")
                    .frame(width: 200)
                    .border(Color.blue)
                Text(".lineLimit(1): This is some long text that should wrap when it exceeds the width of its frame")
                    .lineLimit(1)
                    .frame(width: 200)
                    .border(Color.blue)
            }
            .padding()
        }
        .toolbar {
            PlaygroundSourceLink(file: "TextPlayground.swift")
        }
    }
}
```

