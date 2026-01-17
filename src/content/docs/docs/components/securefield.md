---
title: SecureField
layout: docs
permalink: /docs/components/securefield/
component: SecureField
---

Skip support for [SwiftUI.SecureField](https://developer.apple.com/documentation/swiftui/securefield) on Android.
Consult the SkipUI module for a [complete list of supported SwiftUI](/docs/modules/skip-ui/#supported-swiftui).

The following example screens and source code is from SkipUI's
[Showcase](/docs/samples/skipapp-showcase/) sample app
[`SecureFieldPlayground.swift`](https://github.com/skiptools/skipapp-showcase/tree/main/Sources/Showcase/SecureFieldPlayground.swift)


<div class="showcase-screenshot-container">
<img alt="Android screenshot for SecureField component (light mode)" src="http://assets.skip.dev/showcase/SecureField-android-light_framed.png" />
<img alt="iPhone screenshot for SecureField component (light mode)" src="http://assets.skip.dev/showcase/SecureField-iphone-light_framed.png" />
<img alt="iPhone screenshot for SecureField component (dark mode)" src="http://assets.skip.dev/showcase/SecureField-iphone-dark_framed.png" />
<img alt="Android screenshot for SecureField component (dark mode)" src="http://assets.skip.dev/showcase/SecureField-android-dark_framed.png" />
</div>


```swift
import SwiftUI

struct SecureFieldPlayground: View {
    @State var text = ""

    var body: some View {
        ScrollView {
            VStack(spacing: 16.0) {
                SecureField("Default", text: $text)
                SecureField("With prompt", text: $text, prompt: Text("Prompt"))
                SecureField("Fixed width", text: $text)
                    .frame(width: 200.0)
                SecureField(".disabled(true)", text: $text)
                    .disabled(true)
                SecureField(".foregroundStyle(.red)", text: $text)
                    .foregroundStyle(.red)
                SecureField(".tint(.red)", text: $text)
                    .tint(.red)
            }
            .textFieldStyle(.roundedBorder)
            .padding()
        }
        .toolbar {
            PlaygroundSourceLink(file: "SecureFieldPlayground.swift")
        }
    }
}
```

