---
title: VideoPlayer
layout: docs
permalink: /docs/components/videoplayer/
component: VideoPlayer
---

Skip support for [AVKit.VideoPlayer](https://developer.apple.com/documentation/avkit/videoplayer) on Android.
Consult the SkipUI module for a [complete list of supported SwiftUI](/docs/modules/skip-ui/#supported-swiftui).

The following example screens and source code is from SkipUI's
[Showcase](/docs/samples/skipapp-showcase/) sample app
[`VideoPlayerPlayground.swift`](https://github.com/skiptools/skipapp-showcase/tree/main/Sources/Showcase/VideoPlayerPlayground.swift)


<div class="showcase-screenshot-container">
<img alt="Android screenshot for VideoPlayer component (light mode)" src="http://assets.skip.dev/showcase/VideoPlayer-android-light_framed.png" />
<img alt="iPhone screenshot for VideoPlayer component (light mode)" src="http://assets.skip.dev/showcase/VideoPlayer-iphone-light_framed.png" />
<img alt="iPhone screenshot for VideoPlayer component (dark mode)" src="http://assets.skip.dev/showcase/VideoPlayer-iphone-dark_framed.png" />
<img alt="Android screenshot for VideoPlayer component (dark mode)" src="http://assets.skip.dev/showcase/VideoPlayer-android-dark_framed.png" />
</div>


```swift

import AVKit
import SwiftUI

struct VideoPlayerPlayground: View {
    @State var player = AVPlayer(playerItem: AVPlayerItem(url: URL(string: "https://skip.tools/assets/introduction.mov")!))
    @State var isPlaying: Bool = false

    var body: some View {
        VStack {
            Button {
                isPlaying ? player.pause() : player.play()
                isPlaying = !isPlaying
                player.seek(to: .zero)
            } label: {
                Image(systemName: isPlaying ? "stop" : "play")
                    .padding()
            }
            VideoPlayer(player: player)
        }
        .toolbar {
            PlaygroundSourceLink(file: "VideoPlayerPlayground.swift")
        }
    }
}
```

