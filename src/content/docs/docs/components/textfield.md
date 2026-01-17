---
title: TextField
layout: docs
permalink: /docs/components/textfield/
component: TextField
---

Skip support for [SwiftUI.TextField](https://developer.apple.com/documentation/swiftui/textfield) on Android.
Consult the SkipUI module for a [complete list of supported SwiftUI](/docs/modules/skip-ui/#supported-swiftui).

The following example screens and source code is from SkipUI's
[Showcase](/docs/samples/skipapp-showcase/) sample app
[`TextFieldPlayground.swift`](https://github.com/skiptools/skipapp-showcase/tree/main/Sources/Showcase/TextFieldPlayground.swift)


<div class="showcase-screenshot-container">
<img alt="Android screenshot for TextField component (light mode)" src="http://assets.skip.dev/showcase/TextField-android-light_framed.png" />
<img alt="iPhone screenshot for TextField component (light mode)" src="http://assets.skip.dev/showcase/TextField-iphone-light_framed.png" />
<img alt="iPhone screenshot for TextField component (dark mode)" src="http://assets.skip.dev/showcase/TextField-iphone-dark_framed.png" />
<img alt="Android screenshot for TextField component (dark mode)" src="http://assets.skip.dev/showcase/TextField-android-dark_framed.png" />
</div>


```swift
import SwiftUI

struct TextFieldPlayground: View {
    @State var text = ""

    var body: some View {
        ScrollView {
            VStack(spacing: 16.0) {
                TextField(text: $text) {
                    Text(".init(text:label:)")
                }
                .textFieldStyle(.roundedBorder)
                TextField(".init(_:text:)", text: $text)
                    .textFieldStyle(.roundedBorder)
                TextField("With prompt", text: $text, prompt: Text("Prompt"))
                    .textFieldStyle(.roundedBorder)
                TextField("Fixed width", text: $text)
                    .textFieldStyle(.roundedBorder)
                    .frame(width: 200.0)
                TextField(".disabled(true)", text: $text)
                    .textFieldStyle(.roundedBorder)
                    .disabled(true)
                TextField(".foregroundStyle(.red)", text: $text)
                    .textFieldStyle(.roundedBorder)
                    .foregroundStyle(.red)
                TextField(".tint(.red)", text: $text)
                    .textFieldStyle(.roundedBorder)
                    .tint(.red)
                TextField(".plain", text: $text)
                    .textFieldStyle(.roundedBorder)
                TextField(".plain .disabled(true)", text: $text)
                    .textFieldStyle(.plain)
                    .disabled(true)
                TextField(".plain .foregroundStyle(.red)", text: $text)
                    .textFieldStyle(.plain)
                    .foregroundStyle(.red)
                TextField(".plain .tint(.red)", text: $text)
                    .textFieldStyle(.plain)
                    .tint(.red)
                TextField("Custom background", text: $text)
                    .textFieldStyle(.plain)
                    .background {
                        RoundedRectangle(cornerRadius: 20.0)
                            .fill(.yellow)
                    }
            }
            .padding()
        }
        .toolbar {
            PlaygroundSourceLink(file: "TextFieldPlayground.swift")
        }
    }
}
```

