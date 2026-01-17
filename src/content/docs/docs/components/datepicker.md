---
title: DatePicker
layout: docs
permalink: /docs/components/datepicker/
component: DatePicker
---

Skip support for [SwiftUI.DatePicker](https://developer.apple.com/documentation/swiftui/datepicker) on Android.
Consult the SkipUI module for a [complete list of supported SwiftUI](/docs/modules/skip-ui/#supported-swiftui).

The following example screens and source code is from SkipUI's
[Showcase](/docs/samples/skipapp-showcase/) sample app
[`DatePickerPlayground.swift`](https://github.com/skiptools/skipapp-showcase/tree/main/Sources/Showcase/DatePickerPlayground.swift)


<div class="showcase-screenshot-container">
<img alt="Android screenshot for DatePicker component (light mode)" src="http://assets.skip.dev/showcase/DatePicker-android-light_framed.png" />
<img alt="iPhone screenshot for DatePicker component (light mode)" src="http://assets.skip.dev/showcase/DatePicker-iphone-light_framed.png" />
<img alt="iPhone screenshot for DatePicker component (dark mode)" src="http://assets.skip.dev/showcase/DatePicker-iphone-dark_framed.png" />
<img alt="Android screenshot for DatePicker component (dark mode)" src="http://assets.skip.dev/showcase/DatePicker-android-dark_framed.png" />
</div>


```swift
import SwiftUI

struct DatePickerPlayground: View {
    @State var selectedDate = Date.now

    var body: some View {
        ScrollView {
            VStack(spacing: 16.0) {
                DatePicker(selection: $selectedDate) {
                    Text("Viewbuilder init")
                }
                DatePicker("String init", selection: $selectedDate)
                VStack {
                    Text(".labelsHidden():")
                    DatePicker("Label", selection: $selectedDate)
                }
                .labelsHidden()
                DatePicker(".buttonStyle(.plain)", selection: $selectedDate)
                    .buttonStyle(.plain)
                DatePicker(".disabled(true)", selection: $selectedDate)
                    .disabled(true)
                DatePicker(".foregroundStyle(.red)", selection: $selectedDate)
                    .foregroundStyle(.red)
                DatePicker(".tint(.red)", selection: $selectedDate)
                    .tint(.red)
                DatePicker("Date only", selection: $selectedDate, displayedComponents: .date)
                DatePicker("Time only", selection: $selectedDate, displayedComponents: .hourAndMinute)
            }
            .padding()
        }
        .toolbar {
            PlaygroundSourceLink(file: "DatePickerPlayground.swift")
        }
    }
}
```

