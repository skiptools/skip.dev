---
title: Storage
layout: docs
permalink: /docs/components/storage/
component: Storage
---

Skip support for [SwiftUI.AppStorage](https://developer.apple.com/documentation/swiftui/appstorage) on Android.
Consult the SkipUI module for a [complete list of supported SwiftUI](/docs/modules/skip-ui/#supported-swiftui).

The following example screens and source code is from SkipUI's
[Showcase](/docs/samples/skipapp-showcase/) sample app
[`StoragePlayground.swift`](https://github.com/skiptools/skipapp-showcase/tree/main/Sources/Showcase/StoragePlayground.swift)


<div class="showcase-screenshot-container">
<img alt="Android screenshot for Storage component (light mode)" src="http://assets.skip.dev/showcase/Storage-android-light_framed.png" />
<img alt="iPhone screenshot for Storage component (light mode)" src="http://assets.skip.dev/showcase/Storage-iphone-light_framed.png" />
<img alt="iPhone screenshot for Storage component (dark mode)" src="http://assets.skip.dev/showcase/Storage-iphone-dark_framed.png" />
<img alt="Android screenshot for Storage component (dark mode)" src="http://assets.skip.dev/showcase/Storage-android-dark_framed.png" />
</div>


```swift
import SwiftUI

struct StoragePlayground: View {
    @AppStorage("boolAppStorage") var boolAppStorage = false
    @AppStorage("enumAppStorage") var enumAppStorage = E.first

    enum E: Int {
        case first, second, third
    }

    var body: some View {
        VStack(spacing: 16.0) {
            HStack {
                Text("Enum AppStorage")
                Spacer()
                Picker("Enum AppStorage", selection: $enumAppStorage) {
                    Text("First").tag(E.first)
                    Text("Second").tag(E.second)
                    Text("Third").tag(E.third)
                }
            }
            Toggle("Bool AppStorage", isOn: $boolAppStorage)
            NavigationLink("Push binding") {
                StoragePlaygroundBindingView(binding: $boolAppStorage)
            }
            NavigationLink("Push another", value: PlaygroundType.storage)
        }
        .padding()
        .toolbar {
            PlaygroundSourceLink(file: "StoragePlayground.swift")
        }
    }
}

struct StoragePlaygroundBindingView: View {
    @Binding var binding: Bool

    var body: some View {
        Toggle("Storage", isOn: $binding)
            .padding()
            .navigationTitle("Storage Binding")
    }
}
```

