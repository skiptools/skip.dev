---
title:  "A SwiftUI Block Blast Game in Skip Showcase"
date:   2026-04-02
tags: [swift, android, cross-platform, game, SDK, fuse]
layout: post
author: Marc Prud'hommeaux
tableOfContents: false
draft: false
---

Easter Eggs in software are hidden delights, small features that are orthogonal to the core purpose of the product but which spark a little surprise and joy. Before they lost their collective senses of humor and whimsey, big tech companies routinely[^easteregg] included easter eggs in their products, such as a flight simulator in a spreadsheet or a pinball game in a word processor.

Just in time for Easter, the [Skip Showcase](/docs/samples/skipapp-showcase-fuse/) app has released version 2.3.6 to both the [Apple App Store](https://apps.apple.com/us/app/skip-showcase/id6474885022) and [Google Play Store](https://play.google.com/store/apps/details?id=org.appfair.app.Showcase). This version contains a hidden gem: a completely native Swift and SwiftUI "Block Blast" style puzzle game.

<div align="center" style="margin: 0 auto; justify-content: center; box-sizing: border-box; display: flex; gap: 8px; align-items: center;">
  <img alt="Screenshot of Block Blast on iPhone" src="https://assets.skip.dev/posts/blockblast/skip_block_blast_iphone.png" style="height: 400px;" />
  <img alt="Screenshot of Block Blast on Android" src="https://assets.skip.dev/posts/blockblast/skip_block_blast_android.png" style="height: 400px;" />
</div>

Easter eggs were historically activated via some secret gesture and sequence of actions that can only be stumbled upon by chance or learned about via word of mouth. As it turns out, modern app store policies frown on these sorts of hidden features (c.f. the aforementioned dearth of humor and whimsey), so our Block Blast game is rather conspicuously labelled "Easter Egg" at the bottom of the Showcase tab's list of playgrounds.

<div align="center">
<img alt="Screenshot of Skip Showcase Easter egg" src="https://assets.skip.dev/posts/blockblast/easter_egg_not_so_secret.png" style="height: 400px;" />
</div>

## Games in SwiftUI

Cross-platform gaming has historically been the provenance of specialized SDKs such a Godot[^godot], Unity[^unity], or Unreal[^unreal]. However, for casual games like board or puzzle games, these full-fledged engines can be overkill: you can just build it yourself with the view and gesture primitives that SwiftUI provides.

Our implementation of the Block Blast game is done in under 1,000 lines of pure Swift: see [GamePlayground.swift](https://github.com/skiptools/skipapp-showcase-fuse/blob/main/Sources/ShowcaseFuse/GamePlayground.swift) for the whole thing. This code works out of the box on iOS, and on Android it builds with the newly-released Swift SDK for Android[^ss4a], using Skip Fuse to translate the SwiftUI into [SkipUI's](/docs/modules/skip-ui) Jetpack Compose on Android and handle all the details of packaging and running the app. Shapes, gestures, haptic feedback, high score persistence, and everything: all done in straightforward declarative SwiftUI, exactly the same on Android as it is on iOS.

Now, do we think that the next Grand Theft Auto ought be written in SwiftUI? Probably not. But for a large segment of casual games and game-like experiences, Xcode and SwiftUI may be all that you need. And augmenting your project with Skip will enable you to bring it to Android and [triple the market reach](/docs/) of your app!

<div align="center" style="margin: 0 auto; justify-content: center; box-sizing: border-box; display: flex; gap: 8px; align-items: center;">
  <img alt="Screenshot of Block Blast on iPhone Game Over" src="https://assets.skip.dev/posts/blockblast/skip_block_blast_iphone_gameover.png" style="height: 400px;" />
  <img alt="Screenshot of Block Blast on Android Game Over" src="https://assets.skip.dev/posts/blockblast/skip_block_blast_android_gameover.png" style="height: 400px;" />
</div>

<br />

<div align="center" style="margin: 0 auto; justify-content: center; box-sizing: border-box; display: flex; gap: 8px; align-items: center;">
  <a href="https://apps.apple.com/us/app/skip-showcase/id6474885022" style="display: inline-block;"><img src="https://assets.skip.dev/badges/apple-app-store.svg" alt="Download on the Apple App Store" style="height: 60px; vertical-align: middle; object-fit: contain;" /></a>
  <a href="https://play.google.com/store/apps/details?id=org.appfair.app.Showcase" style="display: inline-block;"><img src="https://assets.skip.dev/badges/google-play-store.svg" alt="Download on the Google Play Store" style="height: 60px; vertical-align: middle; object-fit: contain;" /></a>
</div>

[^easteregg]: Easter Eggs in Software — https://en.wikipedia.org/wiki/Easter_egg_(media)#Software
[^godot]: Godot Game Engine — https://en.wikipedia.org/wiki/Godot_(game_engine)
[^unity]: Unity Game Engine — https://en.wikipedia.org/wiki/Unity_(game_engine)
[^unreal]: Unreal Game Engine — https://en.wikipedia.org/wiki/Unreal_Engine
[^ss4a]: Swift 6.3 released with Android SDK — https://www.swift.org/blog/swift-6.3-released/#android
