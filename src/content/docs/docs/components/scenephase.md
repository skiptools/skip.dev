---
title: ScenePhase
layout: docs
permalink: /docs/components/scenephase/
component: ScenePhase
---

Skip support for [SwiftUI.ScenePhase](https://developer.apple.com/documentation/swiftui/scenephase).

The following example screens and source code is from SkipUI's
[Showcase](/docs/samples/skipapp-showcase/) sample app
[`ScenePhasePlayground.swift`](https://github.com/skiptools/skipapp-showcase/tree/main/Sources/Showcase/ScenePhasePlayground.swift)


<!-- 
<div class="showcase-screenshot-container">
<img alt="Android screenshot for ScenePhase component (light mode)" src="http://assets.skip.dev/showcase/ScenePhase-android-light.png" />
<img alt="iPhone screenshot for ScenePhase component (light mode)" src="http://assets.skip.dev/showcase/ScenePhase-iphone-light.png" />
<img alt="iPhone screenshot for ScenePhase component (dark mode)" src="http://assets.skip.dev/showcase/ScenePhase-iphone-dark.png" />
<img alt="Android screenshot for ScenePhase component (dark mode)" src="http://assets.skip.dev/showcase/ScenePhase-android-dark.png" />
</div>
 -->

```swift
import SwiftUI

struct ScenePhasePlayground: View {
    @Environment(\.scenePhase) var scenePhase
    @State var history: [ScenePhase] = []

    var body: some View {
        List {
            Section("ScenePhase history") {
                ForEach(Array(history.enumerated()), id: \.offset) { phase in
                    Text(verbatim: String(describing: phase.element))
                }
            }
        }
        .onChange(of: scenePhase) { phase in
            logger.log("onChange(of: schenePhase): \(String(describing: phase))")
            history.append(phase)

        }
        .toolbar {
            PlaygroundSourceLink(file: "ScenePhasePlayground.swift")
        }
    }
}
```

