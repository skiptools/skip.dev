---
title: HapticFeedback
layout: docs
permalink: /docs/components/hapticfeedback/
component: HapticFeedback
---

Skip support for [SwiftUI.SensoryFeedback](https://developer.apple.com/documentation/swiftui/sensoryfeedback).

The following example screens and source code is from SkipUI's
[Showcase](/docs/samples/skipapp-showcase/) sample app
[`HapticFeedbackPlayground.swift`](https://github.com/skiptools/skipapp-showcase/tree/main/Sources/Showcase/HapticFeedbackPlayground.swift)


<!-- 
<div class="showcase-screenshot-container">
<img alt="Android screenshot for HapticFeedback component (light mode)" src="http://assets.skip.dev/showcase/HapticFeedback-android-light.png" />
<img alt="iPhone screenshot for HapticFeedback component (light mode)" src="http://assets.skip.dev/showcase/HapticFeedback-iphone-light.png" />
<img alt="iPhone screenshot for HapticFeedback component (dark mode)" src="http://assets.skip.dev/showcase/HapticFeedback-iphone-dark.png" />
<img alt="Android screenshot for HapticFeedback component (dark mode)" src="http://assets.skip.dev/showcase/HapticFeedback-android-dark.png" />
</div>
 -->

```swift
import SwiftUI

struct HapticFeedbackPlayground: View {
    var body: some View {
        ScrollView {
            VStack {
                #if os(macOS)
                #else
                Button("Impact: Soft") {
                    UIImpactFeedbackGenerator(style: .light).impactOccurred()
                }
                .tint(.cyan)
                Button("Impact: Medium") {
                    UIImpactFeedbackGenerator(style: .medium).impactOccurred()
                }
                .tint(.teal)
                Button("Impact: Heavy") {
                    UIImpactFeedbackGenerator(style: .heavy).impactOccurred()
                }
                .tint(.indigo)

                Divider()

                Button("Impact Intensity: 20%") {
                    UIImpactFeedbackGenerator().impactOccurred(intensity: 0.2)
                }

                Button("Impact Intensity: 40%") {
                    UIImpactFeedbackGenerator().impactOccurred(intensity: 0.4)
                }

                Button("Impact Intensity: 60%") {
                    UIImpactFeedbackGenerator().impactOccurred(intensity: 0.6)
                }

                Button("Impact Intensity: 80%") {
                    UIImpactFeedbackGenerator().impactOccurred(intensity: 0.8)
                }

                Button("Impact Intensity: 100%") {
                    UIImpactFeedbackGenerator().impactOccurred(intensity: 1.0)
                }

                Divider()

                Button("Selection: Changed") {
                    UISelectionFeedbackGenerator().selectionChanged()
                }

                Divider()

                Button("Notification: Success") {
                    UINotificationFeedbackGenerator().notificationOccurred(.success)
                }
                .tint(.green)

                Button("Notification: Warning") {
                    UINotificationFeedbackGenerator().notificationOccurred(.warning)
                }
                .tint(.yellow)

                Button("Notification: Error") {
                    UINotificationFeedbackGenerator().notificationOccurred(.error)
                }
                .tint(.red)
                #endif
            }
            .buttonStyle(.borderedProminent)
            .bold()
        }
        .toolbar {
            PlaygroundSourceLink(file: "HapticFeedbackPlayground.swift")
        }
    }
}
```

