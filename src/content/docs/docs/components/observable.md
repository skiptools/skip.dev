---
title: Observable
layout: docs
permalink: /docs/components/observable/
component: Observable
---

Skip support for [Observable state](https://developer.apple.com/documentation/observation/observable) on Android.
Consult the SkipUI module for a [complete list of supported SwiftUI](/docs/modules/skip-ui/#supported-swiftui).

The following example screens and source code is from SkipUI's
[Showcase](/docs/samples/skipapp-showcase/) sample app
[`ObservablePlayground.swift`](https://github.com/skiptools/skipapp-showcase/tree/main/Sources/Showcase/ObservablePlayground.swift)


<div class="showcase-screenshot-container">
<img alt="Android screenshot for Observable component (light mode)" src="http://assets.skip.dev/showcase/Observable-android-light_framed.png" />
<img alt="iPhone screenshot for Observable component (light mode)" src="http://assets.skip.dev/showcase/Observable-iphone-light_framed.png" />
<img alt="iPhone screenshot for Observable component (dark mode)" src="http://assets.skip.dev/showcase/Observable-iphone-dark_framed.png" />
<img alt="Android screenshot for Observable component (dark mode)" src="http://assets.skip.dev/showcase/Observable-android-dark_framed.png" />
</div>


```swift
import SwiftUI
#if canImport(Observation)
import Observation
#endif

struct ObservablePlayground: View {
    var body: some View {
        if #available(iOS 17.0, macOS 14.0, *) {
            ObservablesOuterView()
                .environmentObject(PlaygroundEnvironmentObject(text: "initialEnvironment"))
                .toolbar {
                    PlaygroundSourceLink(file: "ObservablePlayground.swift")
                }
        } else {
            Text("iOS 17 / macOS 14 required for Observation framework")
        }
    }
}

class PlaygroundEnvironmentObject: ObservableObject {
    @Published var text: String
    init(text: String) {
        self.text = text
    }
}

@available(iOS 17.0, macOS 14.0, *)
@Observable class PlaygroundObservable {
    var text = ""
    init(text: String) {
        self.text = text
    }
}

@available(iOS 17.0, macOS 14.0, *)
struct ObservablesOuterView: View {
    @State var stateObject = PlaygroundObservable(text: "initialState")
    @EnvironmentObject var environmentObject: PlaygroundEnvironmentObject
    var body: some View {
        VStack {
            Text(stateObject.text)
            Text(environmentObject.text)
            ObservablesObservableView(observable: stateObject)
                .border(Color.red)
            ObservablesBindingView(text: $stateObject.text)
                .border(Color.blue)
        }
    }
}

@available(iOS 17.0, macOS 14.0, *)
struct ObservablesObservableView: View {
    let observable: PlaygroundObservable
    @EnvironmentObject var environmentObject: PlaygroundEnvironmentObject
    var body: some View {
        Text(observable.text)
        Text(environmentObject.text)
        Button("Button") {
            observable.text = "observableState"
            environmentObject.text = "observableEnvironment"
        }
    }
}

struct ObservablesBindingView: View {
    @Binding var text: String
    var body: some View {
        Button("Button") {
            text = "bindingState"
        }
        .accessibilityIdentifier("binding-button")
    }
}
```

