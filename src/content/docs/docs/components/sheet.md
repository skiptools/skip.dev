---
title: Sheet
layout: docs
permalink: /docs/components/sheet/
component: Sheet
---

Skip support for [SwiftUI.View.sheet](https://developer.apple.com/documentation/SwiftUI/View/sheet(isPresented:onDismiss:content:)) on Android.
Consult the SkipUI module for a [complete list of supported SwiftUI](/docs/modules/skip-ui/#supported-swiftui).

The following example screens and source code is from SkipUI's
[Showcase](/docs/samples/skipapp-showcase/) sample app
[`SheetPlayground.swift`](https://github.com/skiptools/skipapp-showcase/tree/main/Sources/Showcase/SheetPlayground.swift)


<div class="showcase-screenshot-container">
<img alt="Android screenshot for Sheet component (light mode)" src="http://assets.skip.dev/showcase/Sheet-android-light_framed.png" />
<img alt="iPhone screenshot for Sheet component (light mode)" src="http://assets.skip.dev/showcase/Sheet-iphone-light_framed.png" />
<img alt="iPhone screenshot for Sheet component (dark mode)" src="http://assets.skip.dev/showcase/Sheet-iphone-dark_framed.png" />
<img alt="Android screenshot for Sheet component (dark mode)" src="http://assets.skip.dev/showcase/Sheet-android-dark_framed.png" />
</div>


```swift
import SwiftUI

struct SheetPlayground: View {
    @State var isPresented = false

    var body: some View {
        Button("Present sheet") {
            isPresented = true
        }
        .sheet(isPresented: $isPresented) {
            SheetContentView(dismissSheet: { isPresented = false })
        }
        .toolbar {
            PlaygroundSourceLink(file: "SheetPlayground.swift")
        }
    }
}

struct SheetContentView: View {
    @State var isPresented = false
    @State var counter = 0
    @Environment(\.dismiss) var dismiss
    let dismissSheet: () -> Void

    var body: some View {
        NavigationStack {
            List {
                Button("Present another") {
                    isPresented = true
                }
                Button("Dismiss via state") {
                    dismissSheet()
                }
                Button("Dismiss via environment") {
                    dismiss()
                }
                Button("Increment counter: \(counter)") {
                    counter += 1
                }
                ForEach(0..<40) { index in
                    Text("Content row \(index)")
                }
            }
            .navigationTitle("Sheet")
        }
        .sheet(isPresented: $isPresented) {
            SheetContentView(dismissSheet: { isPresented = false })
        }
    }
}
```

