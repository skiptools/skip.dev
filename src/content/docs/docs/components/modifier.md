---
title: Modifier
layout: docs
permalink: /docs/components/modifier/
component: Modifier
---

Skip support for [custom View Modifiers](https://developer.apple.com/documentation/swiftui/configuring-views) on Android.
Consult the SkipUI module for a [complete list of supported SwiftUI](/docs/modules/skip-ui/#supported-swiftui).

The following example screens and source code is from SkipUI's
[Showcase](/docs/samples/skipapp-showcase/) sample app
[`ModifierPlayground.swift`](https://github.com/skiptools/skipapp-showcase/tree/main/Sources/Showcase/ModifierPlayground.swift)


<div class="showcase-screenshot-container">
<img alt="Android screenshot for Modifier component (light mode)" src="http://assets.skip.dev/showcase/Modifier-android-light_framed.png" />
<img alt="iPhone screenshot for Modifier component (light mode)" src="http://assets.skip.dev/showcase/Modifier-iphone-light_framed.png" />
<img alt="iPhone screenshot for Modifier component (dark mode)" src="http://assets.skip.dev/showcase/Modifier-iphone-dark_framed.png" />
<img alt="Android screenshot for Modifier component (dark mode)" src="http://assets.skip.dev/showcase/Modifier-android-dark_framed.png" />
</div>


```swift
import SwiftUI

struct ModifierPlayground: View {
    var body: some View {
        Text("This text uses a custom modifier that adds a Dismiss button to the navigation bar above")
            .padding()
            .dismissable()
            .toolbar {
                PlaygroundSourceLink(file: "ModifierPlayground.swift")
            }
    }
}

extension View {
    public func dismissable() -> some View {
        modifier(DismissModifier())
    }
}

struct DismissModifier: ViewModifier {
    @State var isConfirmationPresented = false
    @Environment(\.dismiss) var dismiss

    func body(content: Content) -> some View {
        content
            .toolbar {
                Button(action: { isConfirmationPresented = true }) {
                    Label("Dismiss", systemImage: "trash")
                }
            }
            .confirmationDialog("Dismiss", isPresented: $isConfirmationPresented) {
                Button("Dismiss", role: .destructive, action: { dismiss() })
            }
    }
}
```

