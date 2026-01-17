---
title: ConfirmationDialog
layout: docs
permalink: /docs/components/confirmationdialog/
component: ConfirmationDialog
---

Skip support for [SwiftUI.View.confirmationDialog](https://developer.apple.com/documentation/swiftui/modal-presentations#getting-confirmation-for-an-action) on Android.
Consult the SkipUI module for a [complete list of supported SwiftUI](/docs/modules/skip-ui/#supported-swiftui).

The following example screens and source code is from SkipUI's
[Showcase](/docs/samples/skipapp-showcase/) sample app
[`ConfirmationDialogPlayground.swift`](https://github.com/skiptools/skipapp-showcase/tree/main/Sources/Showcase/ConfirmationDialogPlayground.swift)


<div class="showcase-screenshot-container">
<img alt="Android screenshot for ConfirmationDialog component (light mode)" src="http://assets.skip.dev/showcase/ConfirmationDialog-android-light_framed.png" />
<img alt="iPhone screenshot for ConfirmationDialog component (light mode)" src="http://assets.skip.dev/showcase/ConfirmationDialog-iphone-light_framed.png" />
<img alt="iPhone screenshot for ConfirmationDialog component (dark mode)" src="http://assets.skip.dev/showcase/ConfirmationDialog-iphone-dark_framed.png" />
<img alt="Android screenshot for ConfirmationDialog component (dark mode)" src="http://assets.skip.dev/showcase/ConfirmationDialog-android-dark_framed.png" />
</div>


```swift
import SwiftUI

struct ConfirmationDialogPlayground: View {
    @State var value = ""
    @State var data: Int? = nil
    @State var defaultIsPresented = false
    @State var titleIsPresented = false
    @State var titleMessageIsPresented = false
    @State var customCancelIsPresented = false
    @State var dataIsPresented = false
    @State var scrollingIsPresented = false

    var body: some View {
        VStack(spacing: 16.0) {
            Text(value).bold()
            Button("Default") {
                defaultIsPresented = true
            }
            Button("Title") {
                titleIsPresented = true
            }
            Button("Title + Message") {
                titleMessageIsPresented = true
            }
            Button("Custom Cancel") {
                customCancelIsPresented = true
            }
            Button("Scrolling") {
                scrollingIsPresented = true
            }
            Divider()
            Text("Present with data")
            Button("Data: \(String(describing: data))") {
                if data == nil {
                    data = 1
                } else {
                    data = data! + 1
                }
            }
            Button("Nil Data") {
                data = nil
            }
            Button("Present") {
                dataIsPresented = true
            }
        }
        .padding()
        .toolbar {
            PlaygroundSourceLink(file: "ConfirmationDialogPlayground.swift")
        }
        .confirmationDialog("Title", isPresented: $defaultIsPresented) {
            Button("Destructive", role: .destructive) {
                value = "Destructive"
            }
            Button("Option") {
                value = "Option"
            }
        }
        .confirmationDialog("Title", isPresented: $titleIsPresented, titleVisibility: .visible) {
            Button("Destructive", role: .destructive) {
                value = "Destructive"
            }
            Button("Option") {
                value = "Option"
            }
        }
        .confirmationDialog("Title", isPresented: $titleMessageIsPresented, titleVisibility: .visible) {
            Button("Destructive", role: .destructive) {
                value = "Destructive"
            }
            Button("Option") {
                value = "Option"
            }
        } message: {
            Text("This is the message")
        }
        .confirmationDialog("Title", isPresented: $customCancelIsPresented) {
            Button("Custom Cancel", role: .cancel) {
                value = "Custom Cancel"
            }
            Button("Destructive", role: .destructive) {
                value = "Destructive"
            }
            Button("Option") {
                value = "Option"
            }
        }
        .confirmationDialog("Title", isPresented: $scrollingIsPresented) {
            Button("Destructive", role: .destructive) {
                value = "Destructive"
            }
            ForEach(0..<20) { i in
                Button("Option \(i)") {
                    value = "Option \(i)"
                }
            }
        }
        .confirmationDialog("Title", isPresented: $dataIsPresented, presenting: data) { d in
            Button("Data: \(d)") {
                value = "\(d)"
            }
            Button("Nil Data", role: .destructive) {
                data = nil
            }
        }
    }
}
```

