---
title:  "December Skip Newsletter"
date: 2024-12-17
tags: [newsletter, announcements, native-swift, skipfuse, swift, android, swiftui, skipui, product-updates]
layout: post
permalink: /blog/newsletter-december-2024/
author: The Skip Team
draft: false
---

<p>
    <b>Skip December Newsletter</b>
</p>

<p>Welcome to the December edition of the Skip.tools newsletter! This month we will showcase some of the improvements and advancements we've made to the Skip platform, along with some current events and a peek at our upcoming roadmap.</p>

<p>
    <b>Skip and Compiled Swift on Android</b>
</p>

<p>
    The big news this month is the release of the Skip's 
    <b>native</b>
     compiled Swift technology preview! Now you are not limited to just using transpiled packages in Skip apps: you can also embed fully native Swift using our Android toolchain and transparent bridge generation. The SkipFuse framework enables you to move seamlessly between native Swift and your transpiled Jetpack Compose user interface. This unlocks the entire universe of pure-Swift packages for use in your Android app! Read the introductory blog post at 
    <a href="/blog/skip-native-tech-preview/">/blog/skip-native-tech-preview/</a>
     and then browse the full documentation at 
    <a href="/docs/native/">/docs/native/</a>.
</p>

<p>
    <img alt="Screenshot of native toochain development" src="https://assets.skip.dev/screens/skip-native-splash.png"/>
</p>

<p>
    <b>New SkipUI Features</b>
</p>

<p>SkipUI is the framework that turns your SwiftUI into Jetpack Compose for Android. It enables you to write a single user-interface for both platforms using their platform-native toolkits. SkipUI supports converting nearly all SwiftUI constructs into Compose, but there are sometimes minor deficiencies and quirks that need to be implemented separately for Android. Over the past weeks, we've improved SkipUI with:</p>

<ul>
    <li>Support for custom SVG images in asset catalogs</li>
    <li>Enabling .alert() sheets to containTextField and SecureField views</li>
    <li>Support for .rotation3DEffect for all views</li>
    <li>Implementing .interactiveDismissDisabled to conditionally prevent interactive dismissal of sheets</li>
</ul>

<p>
    You can always get the latest Skip features and fixes from right within Xcode, by simply clicking 
    <code>File > Packages > Update to Latest Versions</code>. And if you are building from the command-line, 
    <code>swift package update</code>
     will do the same thing.
</p>

<p>
    <b>Tip: Customizing with Android-only SwiftUI modifiers</b>
</p>

<p>
    SkipUI supports Android-specific SwiftUI modifiers to customize Material colors, components, and effects. Check out the "Material" section of our SkipUI documentation to see how: 
    <a href="/docs/modules/skip-ui/#material">/docs/modules/skip-ui/#material</a>
</p>

<p>
    <b>Skip on Talking Kotlin</b>
</p>

<p>
    We were thrilled to join hosts Sebastian and 
    <meta charset="UTF-8"/>
    Márton on the JetBrains 
    <em>Talking Kotlin</em>
     podcast! The episode was just released, and you can listen to it at 
    <a href="https://talkingkotlin.com/going-from-swift-to-kotlin-with-skip/">https://talkingkotlin.com/going-from-swift-to-kotlin-with-skip/</a>
     or watch it at 
    <a href="https://www.youtube.com/watch?v=mig81rSWVqM">https://www.youtube.com/watch?v=mig81rSWVqM</a>. “Going from Swift to Kotlin with Skip: In a slightly unconventional episode, Sebastian and Márton talk to the founders of Skip, an iOS-to-Android, Swift-to-Kotlin transpiler solution. Marc and Abe have a background working on both Apple platforms and the JVM, and their latest project is a bridge across these two ecosystems.”
</p>

<p>
    <b>Android Police Interview</b>
</p>

<p>
    Another instance of Skip in the press was an interview with the popular 
    <i>Android Police</i>
     publication, titled: “How the development wall between Android and iOS may soon come down”. You can read the whole thing at: 
    <a href="https://www.androidpolice.com/skip-interview">https://www.androidpolice.com/skip-interview</a>
</p>

<p>
    <b>That's all for now</b>
</p>

<p>
    You can follow us on Mastodon at 
    <a href="https://mas.to/@skiptools">https://mas.to/@skiptools</a>, and join in the Skip discussions at 
    <a href="http://community.skip.tools/">http://community.skip.tools/</a>. The Skip FAQ at 
    <a href="/docs/faq/">/docs/faq/</a>
     is there to answer any questions, and be sure to check out the video tours at 
    <a href="/tour/">/tour/</a>. And, as always, you can reach out directly to us on our Slack channel at 
    <a href="/slack/">/slack/</a>.
</p>

<p>Happy Skipping!</p>



