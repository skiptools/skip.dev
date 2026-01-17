---
title: Alert
layout: docs
permalink: /docs/components/alert/
component: Alert
---

Skip support for [SwiftUI.Alert](https://developer.apple.com/documentation/swiftui/alert).

The following example screens and source code is from SkipUI's
[Showcase](/docs/samples/skipapp-showcase/) sample app
[`AlertPlayground.swift`](https://github.com/skiptools/skipapp-showcase/tree/main/Sources/Showcase/AlertPlayground.swift)


<!-- 
<div class="showcase-screenshot-container">
<img alt="Android screenshot for Alert component (light mode)" src="http://assets.skip.dev/showcase/Alert-android-light.png" />
<img alt="iPhone screenshot for Alert component (light mode)" src="http://assets.skip.dev/showcase/Alert-iphone-light.png" />
<img alt="iPhone screenshot for Alert component (dark mode)" src="http://assets.skip.dev/showcase/Alert-iphone-dark.png" />
<img alt="Android screenshot for Alert component (dark mode)" src="http://assets.skip.dev/showcase/Alert-android-dark.png" />
</div>
 -->

```swift
import SwiftUI

struct AlertPlayground: View {
    @State var value = ""
    @State var error: AlertPlaygroundError? = nil
    @State var data: Int? = nil
    @State var titleIsPresented = false
    @State var titleMessageIsPresented = false
    @State var twoButtonsIsPresented = false
    @State var threeButtonsIsPresented = false
    @State var fiveButtonsIsPresented = false
    @State var dataIsPresented = false

    var body: some View {
        VStack(spacing: 16) {
            Text(value).bold()
            Group {
                Button("Title") {
                    titleIsPresented = true
                }
                Button("Title + Message") {
                    titleMessageIsPresented = true
                }
                Button("Two Buttons") {
                    twoButtonsIsPresented = true
                }
                Button("Three Buttons") {
                    threeButtonsIsPresented = true
                }
                Button("Five Buttons") {
                    fiveButtonsIsPresented = true
                }
            }
            Divider()
            Group {
                Text("Present with data")
                Button("Data: \(String(describing: data))") {
                    if data == nil {
                        data = 1
                    } else {
                        data = data! + 1
                    }
                }
                Button("Nil data") {
                    data = nil
                }
                Button("Present") {
                    dataIsPresented = true
                }
            }
        }
        .padding()
        .toolbar {
            PlaygroundSourceLink(file: "AlertPlayground.swift")
        }
        .alert("Title", isPresented: $titleIsPresented) {
        }
        .alert("Title + Message", isPresented: $titleMessageIsPresented) {
        } message: {
            Text("This is the alert message to show beneath the title")
        }
        .alert("Two Buttons", isPresented: $twoButtonsIsPresented) {
            Button("Option") {
                value = "Option"
            }
            Button("Cancel", role: .cancel) {
                value = "Custom Cancel"
            }
        }
        .alert("Three Buttons", isPresented: $threeButtonsIsPresented) {
            Button("Cancel", role: .cancel) {
                value = "Custom Cancel"
            }
            Button("Option") {
                value = "Option"
            }
            Button("Destructive", role: .destructive) {
                value = "Destructive"
            }
        }
        .alert("Five Buttons", isPresented: $fiveButtonsIsPresented) {
            Button("Cancel", role: .cancel) {
                value = "Custom Cancel"
            }
            Button("Destructive", role: .destructive) {
                value = "Destructive"
            }
            Button("Option 1") {
                value = "Option 1"
            }
            Button("Option 2") {
                value = "Option 2"
            }
            Button("Option 3") {
                value = "Option 3"
            }
        }
        .alert("Data", isPresented: $dataIsPresented, presenting: data) { d in
            Button("Data: \(d)") {
                value = "\(d)"
            }
            Button("Nil Data", role: .destructive) {
                data = nil
            }
        }
    }
}

enum AlertPlaygroundError: LocalizedError {
    case testError
}
```

