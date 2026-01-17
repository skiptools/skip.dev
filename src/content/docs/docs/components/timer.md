---
title: Timer
layout: docs
permalink: /docs/components/timer/
component: Timer
---

Skip support for [Swift Timer](https://developer.apple.com/documentation/foundation/timer/timerpublisher).

The following example screens and source code is from SkipUI's
[Showcase](/docs/samples/skipapp-showcase/) sample app
[`TimerPlayground.swift`](https://github.com/skiptools/skipapp-showcase/tree/main/Sources/Showcase/TimerPlayground.swift)


<!-- 
<div class="showcase-screenshot-container">
<img alt="Android screenshot for Timer component (light mode)" src="http://assets.skip.dev/showcase/Timer-android-light.png" />
<img alt="iPhone screenshot for Timer component (light mode)" src="http://assets.skip.dev/showcase/Timer-iphone-light.png" />
<img alt="iPhone screenshot for Timer component (dark mode)" src="http://assets.skip.dev/showcase/Timer-iphone-dark.png" />
<img alt="Android screenshot for Timer component (dark mode)" src="http://assets.skip.dev/showcase/Timer-android-dark.png" />
</div>
 -->

```swift
import SwiftUI

struct TimerPlayground: View {
    @State var count = 0

    var body: some View {
        VStack(spacing: 16) {
            TimerPlaygroundTimerView(message: "Tap count: \(count)")
            Button("Tap to recompose in 1 sec") {
                DispatchQueue.main.asyncAfter(wallDeadline: .now() + 1.0) {
                    count += 1
                }
            }
        }
        .padding()
        .toolbar {
            PlaygroundSourceLink(file: "TimerPlayground.swift")
        }
    }
}

private struct TimerPlaygroundTimerView: View {
    let message: String
    let timer = Timer.publish(every: 1.0, on: .main, in: .default).autoconnect()
    @State var timerDate: Date?

    var body: some View {
        VStack {
            Text(message)
            Text("Timer date: \(timerDate == nil ? "nil" : timerDate!.description)")
        }
        .font(.largeTitle)
        .onReceive(timer) { date in
            timerDate = date
        }
    }
}
```

