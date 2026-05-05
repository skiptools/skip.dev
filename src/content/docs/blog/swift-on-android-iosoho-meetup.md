---
title:  "Swift on Android at the iOSoho Meetup"
date:   2026-05-05
tags: [skip, swift, android, talk, meetup, compose-multiplatform, kotlin-multiplatform, swift-android-workgroup]
layout: post
permalink: /blog/swift-on-android-iosoho-meetup/
author: Marc Prud'hommeaux
draft: true
---

Last month I gave a talk on Swift on Android at the [iOSoho meetup](https://www.meetup.com/iosoho/events/314173946/) in New York. Capital One hosted the event at their 19th Street offices, Runway kept everyone fed, and the recording is now live.

The evening was a Kotlin and Swift cross-platform doubleheader. Clinton Teegarden, a Distinguished Engineer at Capital One, opened with a deep dive into Kotlin Multiplatform and Compose Multiplatform. He built a Flappy Bird style game from scratch to walk through how shared UI rendering works in CMP, with detours through iOS interop and architectural gotchas. Hearing how the JetBrains stack tackles the cross-platform problem made for a useful contrast with the Swift-first approach we take at Skip.

My segment came next, and the talk traced the path of Swift on Android from its earliest community origins through to the official [Swift SDK for Android](https://www.swift.org/blog/swift-6.3-released/#android) that shipped with [Swift 6.3](/blog/swift-6.3-android-support/), the culmination of over ten years of community effort. I worked through the full stack:

- the lowest-level manual native interaction with the Android NDK and SDK
- the synthesized Java bindings produced by the [swift-java](https://github.com/swiftlang/swift-java) project
- full Jetpack Compose powered apps written entirely in SwiftUI on top of [Skip](https://skip.dev)

If you want a single place to see how all of these layers fit together, this is the talk. My segment starts at 37:09, and the Compose Multiplatform talk before it is well worth watching for context.

<iframe width="100%" height="400" src="https://www.youtube.com/embed/KPf2QTZAIZY?start=2229" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

Turnout was strong both in person and on the simulcast, which went out to the New York Android, DC Android, DC iOS, and Dallas iOS Developers groups, each running its own watch party. Pulling off a four-way live broadcast on a single evening takes serious coordination, and huge credit goes to Paul Miard for organizing iOSoho and to Madona Wambua at New York Android Engineers, Scott Luxenberg at DC iOS, and Jared at DC Android for keeping their sites in lockstep. Running one good meetup is hard. Running four at once, with a shared stream and a shared audience, is no small feat.

The audience came with thoughtful questions about debugging, packaging, third-party Swift packages on Android, and how Skip Fuse fits alongside the official SDK. I wish Q&A had run longer, but the after-hours conversation that spilled over into [Old Town Bar](https://www.oldtownbar.com/) more than made up for it.

Thanks again to Paul and the iOSoho crew, to Capital One for hosting, to Runway for the food, and to everyone who attended in person or remotely. For follow-up questions, the [Swift Forums thread](https://forums.swift.org/t/swift-on-android-talk-at-iosoho-meetup-w-compose-multiplatform/86493) is a good place to start, and you can always reach us on [Slack](/slack/) or the [Skip discussion forums](https://forums.skip.dev).
