---
title: State
layout: docs
permalink: /docs/components/state/
component: State
---

Skip support for [SwiftUI State](https://developer.apple.com/documentation/swiftui/state) on Android.
Consult the SkipUI module for a [complete list of supported SwiftUI](/docs/modules/skip-ui/#supported-swiftui).

The following example screens and source code is from SkipUI's
[Showcase](/docs/samples/skipapp-showcase/) sample app
[`StatePlayground.swift`](https://github.com/skiptools/skipapp-showcase/tree/main/Sources/Showcase/StatePlayground.swift)


<div class="showcase-screenshot-container">
<img alt="Android screenshot for State component (light mode)" src="http://assets.skip.dev/showcase/State-android-light_framed.png" />
<img alt="iPhone screenshot for State component (light mode)" src="http://assets.skip.dev/showcase/State-iphone-light_framed.png" />
<img alt="iPhone screenshot for State component (dark mode)" src="http://assets.skip.dev/showcase/State-iphone-dark_framed.png" />
<img alt="Android screenshot for State component (dark mode)" src="http://assets.skip.dev/showcase/State-android-dark_framed.png" />
</div>


```swift
import SwiftUI

class TapCountObservable: ObservableObject {
    @Published var tapCount = 0
}

struct TapCountStruct : Identifiable {
    var id = 0
    var tapCount = 0
}

class TapCountRepository: ObservableObject {
    @Published var items: [TapCountStruct] = []

    func add() {
        items.append(TapCountStruct(id: items.count))
    }

    func increment() {
        if !items.isEmpty {
            items[items.count - 1].tapCount += 1
        }
    }
}

struct StatePlayground: View {
    @State var tapCount = 0
    @State var hasStateTapped: Bool? // Test optional vars
    @StateObject var tapCountObservable: TapCountObservable
    @State var tapCountStruct: TapCountStruct
    @StateObject var tapCountRepository = TapCountRepository() // Test ForEach observable

    init() {
        // Test that we can initialze state property wrappers
        _tapCountObservable = StateObject(wrappedValue: TapCountObservable())
        _tapCountStruct = State(wrappedValue: TapCountStruct())
    }

    var body: some View {
        List {
            Section {
                NavigationLink("Push another", value: PlaygroundType.state)
                NavigationLink("Push binding view") {
                    StatePlaygroundDestinationBindingView(tapCount: $tapCount)
                }
            }
            Section {
                if hasStateTapped == true {
                    Text("State tap count: \(tapCount)")
                } else {
                    Text("Tap below to increment state tap count")
                }
                Button("State") {
                    tapCount += 1
                    hasStateTapped = true
                }
                StatePlaygroundBindingView(tapCount: $tapCount)
            }
            Section {
                Text("Observable tap count: \(tapCountObservable.tapCount)")
                Button("Observable") {
                    tapCountObservable.tapCount += 1
                }
                StatePlaygroundBindingView(tapCount: $tapCountObservable.tapCount)
            }
            Section {
                Text("Struct tap count: \(tapCountStruct.tapCount)")
                Button("Struct") {
                    tapCountStruct.tapCount += 1
                }
                StatePlaygroundStructBindingView(tapCountStruct: $tapCountStruct)
            }
            Section {
                Text("Struct tap count (field): \(tapCountStruct.tapCount)")
                Button("Struct (field)") {
                    tapCountStruct.tapCount += 1
                }
                StatePlaygroundBindingView(tapCount: $tapCountStruct.tapCount)
            }
            Section {
                ForEach(tapCountRepository.items) { item in
                    Text("Repository item tap count: \(item.tapCount)")
                }
                Button("Add item") { tapCountRepository.add() }
                Button("Increment last") { tapCountRepository.increment() }
            }
        }
        .onChange(of: tapCount) {
            logger.log("onChange(of: tapCount): \($0)")
        }
        .onChange(of: tapCountObservable.tapCount) {
            logger.log("onChange(of: tapCountObservable.tapCount): \($0)")
        }
        .onChange(of: tapCountStruct.tapCount) {
            logger.log("onChange(of: tapCountStruct.tapCount): \($0)")
        }
        .toolbar {
            PlaygroundSourceLink(file: "StatePlayground.swift")
        }
    }
}

struct StatePlaygroundBindingView: View {
    @Binding var tapCount: Int
    var body: some View {
        Button("Binding") {
            tapCount += 1
        }
    }
}

struct StatePlaygroundStructBindingView: View {
    @Binding var tapCountStruct: TapCountStruct
    var body: some View {
        Button("Binding") {
            tapCountStruct.tapCount += 1
        }
    }
}

struct StatePlaygroundDestinationBindingView: View {
    @Binding var tapCount: Int

    var body: some View {
        VStack {
            SubView1(tapCount: _tapCount)
            SubView2(tapCount: _tapCount)
        }
        .navigationTitle("Binding View")
    }

    struct SubView1: View {
        @Binding var tapCount: Int

        var body: some View {
            Button("Bound tap count 1: \(tapCount)") {
                tapCount += 1
            }
            .buttonStyle(.bordered)
        }
    }

    struct SubView2: View {
        @Binding var tapCount: Int

        var body: some View {
            Button("Bound tap count 2: \(tapCount)") {
                tapCount += 1
            }
            .buttonStyle(.bordered)
        }
    }
}
```

