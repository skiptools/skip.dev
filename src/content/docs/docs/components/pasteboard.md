---
title: Pasteboard
layout: docs
permalink: /docs/components/pasteboard/
component: Pasteboard
---

Skip support for [SwiftUI Clipboard](https://developer.apple.com/documentation/swiftui/clipboard).

The following example screens and source code is from SkipUI's
[Showcase](/docs/samples/skipapp-showcase/) sample app
[`PasteboardPlayground.swift`](https://github.com/skiptools/skipapp-showcase/tree/main/Sources/Showcase/PasteboardPlayground.swift)


<!-- 
<div class="showcase-screenshot-container">
<img alt="Android screenshot for Pasteboard component (light mode)" src="http://assets.skip.dev/showcase/Pasteboard-android-light.png" />
<img alt="iPhone screenshot for Pasteboard component (light mode)" src="http://assets.skip.dev/showcase/Pasteboard-iphone-light.png" />
<img alt="iPhone screenshot for Pasteboard component (dark mode)" src="http://assets.skip.dev/showcase/Pasteboard-iphone-dark.png" />
<img alt="Android screenshot for Pasteboard component (dark mode)" src="http://assets.skip.dev/showcase/Pasteboard-android-dark.png" />
</div>
 -->

```swift
import SwiftUI

#if os(macOS)
struct PasteboardPlayground: View {
    var body: some View {
        Text("UIPasteboard is not available on macOS")
    }
}
#else
struct PasteboardPlayground: View {
    @State var pasteboardInfo = PasteboardInfo(UIPasteboard.general)
    @State var text = ""

    var body: some View {
        ScrollView {
            VStack(spacing: 16) {
                HStack {
                    TextField("Text / URL", text: $text)
                    Spacer()
                    Button("Copy") {
                        if let url = URL(string: text) {
                            UIPasteboard.general.url = url
                        } else {
                            UIPasteboard.general.string = text
                        }
                    }
                }
                Divider()
                HStack {
                    Text("Pasteboard count:")
                    Spacer()
                    Text(String(describing: pasteboardInfo.numberOfItems))
                }
                HStack {
                    Text("Has strings:")
                    Spacer()
                    Text(String(describing: pasteboardInfo.hasStrings))
                }
                HStack {
                    Text("Strings:")
                    Spacer()
                    Text("\(pasteboardInfo.strings == nil ? "nil" : pasteboardInfo.strings!.description)")
                }
                HStack {
                    Text("Has URLs:")
                    Spacer()
                    Text(String(describing: pasteboardInfo.hasURLs))
                }
                HStack {
                    Text("URLs:")
                    Spacer()
                    Text("\(pasteboardInfo.urls == nil ? "nil" : pasteboardInfo.urls!.description)")
                }
            }
            .padding()
        }
        .onReceive(NotificationCenter.default.publisher(for: UIPasteboard.changedNotification), perform: { notification in
            pasteboardInfo = PasteboardInfo(notification.object as! UIPasteboard)
        })
        .toolbar {
            PlaygroundSourceLink(file: "PasteboardPlayground.swift")
        }
    }
}

struct PasteboardInfo {
    let numberOfItems: Int
    let hasStrings: Bool
    let strings: [String]?
    let hasURLs: Bool
    let urls: [URL]?

    init(_ pasteboard: UIPasteboard) {
        self.numberOfItems = pasteboard.numberOfItems
        self.hasStrings = pasteboard.hasStrings
        self.strings = pasteboard.strings
        self.hasURLs = pasteboard.hasURLs
        self.urls = pasteboard.urls
    }
}
#endif
```

