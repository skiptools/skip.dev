---
title:  "July Skip Newsletter"
date: 2024-07-31
tags: [newsletter, announcements, swift-6, kotlin-2, swiftui, skipui, product-updates, community, open-source]
layout: post
permalink: /blog/newsletter-july-2024/
author: The Skip Team
draft: false
---

<p>Welcome to the July edition of the Skip.tools newsletter! This month we will showcase some of the improvements and advancements we&#39;ve made to the Skip platform, along with some current events and a peek at our upcoming roadmap.</p>

<p>
    <b>Swift 6 and Kotlin 2 Support</b>
</p>

<p>The past couple of months saw two important major releases that affect anyone writing modern iOS and Android apps. Kotlin 2 was released at the end of May, and a preview of Swift 6 was added to the Xcode 16 beta in June. Both of these language releases are evolutionary, but they did include some important changes and enhancements.</p>

<p>
    Skip has kept pace: we now generate Kotlin 2 Android projects by default, and you can use Swift 6 language features like 
    <a href="https://www.hackingwithswift.com/swift/6.0/typed-throws">typed throws</a>. Some minor Android build file tweaks may be necessary to modernize pre-existing Skip projects, but overall we are delighted how smooth the transition has been. Skip is designed to enable your apps to keep up with the constant evolution of the primary development languages for both iOS and Android.
</p>

<p>
    <b>From Scrumdinger to Scrumskipper</b>
</p>

<p>
    Honed and updated over the years, Apple&rsquo;s 
    <a href="https://developer.apple.com/tutorials/app-dev-training/getting-started-with-scrumdinger">Scrumdinger tutorial</a>
     is an hours-long step-by-step guide to building a complete, modern SwiftUI app. It exercises both built-in UI components and custom drawing, and it takes advantage of Swift language features like Codable for persistence. As its rather unique name implies, the Scrumdinger app allows users to create and manage agile programming scrums on their phones.
</p>

<p>
    In our 
    <a href="https://skip.tools/blog/scrumskipper/">blog post</a>, we show how we took the Scrumdinger app and brought it to Android through the power of Skip. This new &quot;Scrumskipper&quot; app demonstrates how an existing iOS-only app can be incrementally turned into a dual-platform iOS+Android app.
</p>

<p>
    <b>Refreshable lists, GeometryReader, and ScrollViewReader</b>
</p>

<p>The pull-to-refresh gesture has been a standard affordance in mobile apps for updating list contents for some time now, and SwiftUI has had built-in support for the operation since last year. We&#39;ve brought this great feature over to Android by bridging SwiftUI&rsquo;s .refreshable() modifier to an experimental Compose API for supporting the pull-to-refresh operation, enabling you to add in support for list refreshability with one line of code.</p>

<p>In addition, we&#39;ve added some more advanced SwiftUI API support, including the ability to exactly identify locations in SwiftUI views using GeometryReader and the ability to jump to individual list elements using ScrollViewReader.</p>

<p>
    <b>User Contributions: SkipAV and SkipFirebase</b>
</p>

<p>
    All the Skip runtime frameworks are free and open-source software, from the low-level 
    <a href="https://skip.tools/docs/modules/skip-foundation/">SkipFoundation</a>
     to the high level 
    <a href="https://skip.tools/docs/modules/skip-ui/">SkipUI</a>. In addition, we have a whole constellation of optional frameworks that enable additional functionality, from SQLite database support (<a href="https://skip.tools/docs/modules/skip-sql/">SkipSQL</a>) to Lottie animations (<a href="https://skip.tools/docs/modules/skip-motion/">SkipMotion</a>).
</p>

<p>
    One of our frameworks &ndash; 
    <a href="https://github.com/skiptools/skip-av">SkipAV</a>
     &ndash; enables bridging a subset of the AVKit framework for audio and video support. The initial release included only very basic support for playing videos, but recently a user who was interested in the project added support for recording from the microphone, along with some audio playback improvements.
</p>

<p>
    Another of our frameworks, 
    <a href="https://github.com/skiptools/skip-firebase">SkipFirebase</a>, provides support for Google Firebase, a very popular backend-as-a-service platform used in many mobile applications. And while our original release mostly just supported Firestore &ndash; the database layer of Firebase &ndash; another interested user recently contributed support for the Auth component, which greatly improves the utility of the framework for all Skip users.
</p>

<p>
    These are just two examples of recent community contributions to the Skip ecosystem. If you would like to learn more about how to help improve Skip&#39;s support for various Android features, check out our 
    <a href="https://skip.tools/docs/contributing/">contribution guide</a>.
</p>

<p>
    <b>That&#39;s all for now</b>
</p>

<p>
    You can follow us on Mastodon at 
    <a href="https://mas.to/@skiptools">https://mas.to/@skiptools</a>, and join in the Skip discussions at 
    <a href="http://community.skip.tools/">http://community.skip.tools/</a>. The Skip FAQ at 
    <a href="https://skip.tools/docs/faq/">https://skip.tools/docs/faq/</a>
     is there to answer any questions, and be sure to check out the video tours at 
    <a href="https://skip.tools/tour/">https://skip.tools/tour/</a>. And, as always, you can reach out directly to us on our Slack channel at 
    <a href="https://skip.tools/slack/">https://skip.tools/slack/</a>.
</p>

<p>Happy Skipping!</p>
