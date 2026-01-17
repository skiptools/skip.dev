---
title:  "Skip is Free for Free Software"
date:   2023-11-20
tags: [skip, open-source, announcement, cross-platform, swift]
layout: post
permalink: /blog/skip-is-free-for-free-software/
author: the Skip Team
---

Skip brings your iPhone app to Android. With Skip, you can create a modern SwiftUI app with the standard iOS development tools, and Skip transforms it into a Kotlin app for Android. With Skip you can iteratively design, build, test, run, debug, and deploy a single app for both major mobile platforms using a single language (Swift) and a single IDE (Xcode). Watch our [12-minute tour](/tour) for a glimpse of the magic.

Today we are pleased to announce that Skip will be **free** for all free open-source software.

There are two halves to the Skip project. The first is SkipStone, our integrated Xcode plugin that transpiles your Swift source code into Kotlin as part of the normal build process. SkipStone is commercial software. It is currently a public technology preview, with early adopter pricing to be announced soon[^1]. 

The other half is Skip's ecosystem of libraries and frameworks, which is free and open-source software. These frameworks constitute the essential building blocks of any modern application, and include low-level adaptors from Darwin's Foundation API to the equivalent Android Java API (`skip-foundation`), as well as the high-level SwiftUI user interface widgets that are manifested by Jetpack Compose views on Android (`skip-ui`). In addition, the growing constellation of community frameworks at [github.com/skiptools](http://github.com/skiptools/) provides essential functionality such as SQL database support, media player components, and more. 

These frameworks are free and open-source software whose advancement will rely heavily on community contributions. And so we've made the SkipStone transpiler free, for free software. What this means is that Skip can be used – without cost – for building projects that consist exclusively of source code licensed under one of the General Public Licenses as published by the Free Software Foundation.

This applies not just to framework development, but also to your own app projects: if your iOS app is free software, then Skip can be used to transpile it into an equivalent free Android app. In this way we hope to encourage and support the proliferation of genuinely native dual-platform apps created with the Skip transpiler and powered by the community-supported ecosystem of high-quality libraries and frameworks.

Skip is advancing by leaps and bounds, but it is still a technology *preview*. You can use it today to create a greenfield app for iOS and Android, provided you are willing to iterate carefully and to work around (or implement and contribute!) some missing pieces. Read the [getting started](/docs/gettingstarted/) guide to begin the adventure.

The reward will be well worth the effort. Your genuinely native app, created from a single modern Swift codebase, running on both Android and iOS, will be priceless.

<small>More details can be found at our [FAQ](/docs/faq/#free_commercial) and [documentation](/docs/). Follow us on Mastodon at [mas.to/@skiptools](https://mas.to/@skiptools) or with [RSS](/blog/rss.xml).</small>


[^1]: <small>Commercial pricing will be announced soon, but you can qualify for an early adopter discount by [registering](/eval/) during the tech preview period.</small>
