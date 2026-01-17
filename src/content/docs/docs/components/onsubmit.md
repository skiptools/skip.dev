---
title: OnSubmit
layout: docs
permalink: /docs/components/onsubmit/
component: OnSubmit
---

Skip support for [SwiftUI.View.onSubmit](https://developer.apple.com/documentation/swiftui/view/onsubmit(of:_:)) on Android.
Consult the SkipUI module for a [complete list of supported SwiftUI](/docs/modules/skip-ui/#supported-swiftui).

The following example screens and source code is from SkipUI's
[Showcase](/docs/samples/skipapp-showcase/) sample app
[`OnSubmitPlayground.swift`](https://github.com/skiptools/skipapp-showcase/tree/main/Sources/Showcase/OnSubmitPlayground.swift)


<div class="showcase-screenshot-container">
<img alt="Android screenshot for OnSubmit component (light mode)" src="http://assets.skip.dev/showcase/OnSubmit-android-light_framed.png" />
<img alt="iPhone screenshot for OnSubmit component (light mode)" src="http://assets.skip.dev/showcase/OnSubmit-iphone-light_framed.png" />
<img alt="iPhone screenshot for OnSubmit component (dark mode)" src="http://assets.skip.dev/showcase/OnSubmit-iphone-dark_framed.png" />
<img alt="Android screenshot for OnSubmit component (dark mode)" src="http://assets.skip.dev/showcase/OnSubmit-android-dark_framed.png" />
</div>


```swift
import SwiftUI

struct OnSubmitPlayground: View {
    @State var text1 = ""
    @State var text2 = ""
    @State var submitText = ""

    var body: some View {
        Form {
            HStack {
                Text(submitText)
                Spacer()
                Button("Clear") {
                    submitText = ""
                }
            }
            TextField("Text1", text: $text1)
                .onSubmit {
                    submitText = submitText + "Text1 "
                }
            TextField("Text2", text: $text2)
                .onSubmit {
                    submitText = submitText + "Text2 "
                }
        }
        .onSubmit {
            submitText = submitText + "Form "
        }
        .toolbar {
            PlaygroundSourceLink(file: "OnSubmitPlayground.swift")
        }
    }
}
```

