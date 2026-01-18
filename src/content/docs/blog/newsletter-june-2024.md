---
title:  "June Skip Newsletter"
date: 2024-06-30
tags: [newsletter, announcements, product-updates, skip-modules, fastlane, kotlin-multiplatform, wwdc, google-io, community]
layout: post
permalink: /blog/newsletter-june-2024/
author: The Skip Team
draft: false
---

<p>Welcome to the June edition of the Skip.tools newsletter! This month we will showcase some of the improvements and advancements we&#39;ve made to the Skip platform, along with some current events and a peek at our upcoming roadmap.</p>

<p>
    <b>New Skip Intro Video</b>
</p>

<p>
    We&#39;ve posted a new Skip &quot;Showreel&quot; video, providing a quick 3-minute overview of Skip and the highlights of using it to build native dual-platform apps. You can find it on YouTube at: 
    <a href="https://www.youtube.com/watch?v=lQjaaAqgxp4">https://www.youtube.com/watch?v=lQjaaAqgxp4</a>. This and other videos are also available from our Tour page at: 
    <a href="/tour/">/tour/</a>. We will be posting new videos in the coming weeks and months, so consider either following us on YouTube, or subscribing to our RSS feed from 
    <a href="/blog/">/blog/</a>.
</p>

<p>
    <img alt="skip-showreel-poster.png" src="https://assets.skip.dev/tour/showreel_video_poster.png"/>
</p>

<p>
    <b>Skip Showcase on the Stores</b>
</p>

<p>
    The Skip Showcase app (<a href="/docs/samples/skipapp-showcase/">/docs/samples/skipapp-showcase/</a>) has long been our go-to for providing a side-by-side comparison of SwiftUI components with the Jetpack Compose equivalents that SkipUI provides. Browsing thought these components simultaneously on an iPhone and Android device gives a good sense Skip&#39;s capabilities and power, and is a great way to demonstrate Skip&#39;s benefits to project managers and stakeholders before breaking ground on a new project.
</p>

<p>
    In order to make it even easier to get this handy app on your devices, we&#39;ve published the Skip Showcase app to both the 
    <a href="https://apps.apple.com/us/app/skip-showcase/id6474885022">Apple App Store</a>
     as well as the 
    <a href="https://play.google.com/store/apps/details?id=org.appfair.app.Showcase">Google Play Store</a>. This enables you to quickly grab a demo app that highlights Skip&#39;s power, and feel for yourself the benefit of using a genuinely native app on both platforms. Download it today and see for yourself what Skip can do!
</p>

<p>
    <b>New Framework: SkipKeychain</b>
</p>

<p>
    Using the Keychain has long been the standard way to store bits of sensitive data, such as passwords and notes, on your iOS device. We&#39;re happy to announce a brand-new SkipKeychain module that provides an API to read and write sensitive data both on iOS and Android. As with the rest of Skip&#39;s library ecosystem, it is free and open-source and available on GitHub at: 
    <a href="https://github.com/skiptools/skip-keychain/">https://github.com/skiptools/skip-keychain/</a>. We&#39;re only on version 0.0.1 right now, but we expect to be able to iterate quickly to add features and functionality that the community wants to see in this nascent project.
</p>

<p>
    <b>Skip and Kotlin Multiplatform</b>
</p>

<p>
    Skip and Kotlin Multiplatform (KMP) are two sides of the same coin. Skip brings your Swift/iOS codebase to Android, and KMP brings your Kotlin/Android codebase to iOS. Many people have assumed that this diametrical opposition means that the two technologies are incompatible. But this is not the case! KMP modules can be embedded in Skip apps, and they work seamlessly, for the most part, with the Swift-to-Kotlin code transpilation that Skip provides. Check out our deep dive into the integration at 
    <a href="/blog/skip-and-kotlin-multiplatform/">/blog/skip-and-kotlin-multiplatform/</a>
     and learn how you can take your business-logic KMP modules and integrate them in both the iOS and Android sides of your Skip app.
</p>

<p>
    <b>Skip Slack Group</b>
</p>

<p>
    By popular demand, we are starting to migrate away from our gitter.im Matrix chat system to a new Skiptools Slack group. Going forward, this will be the preferred medium for live discussions and getting technical help. The Skip team will be standing by to answer questions and help with any issues that members of the community may encounter. You can sign up and join the conversation at: 
    <a href="/slack/">/slack/</a>.
</p>

<p>
    <b>Skip and Fastlane</b>
</p>

<p>The last mile of app development can be the most grueling. Taking your tested and polished 1.0 app and getting it into the hands of your users ought to be quick and simple, but it isn&#39;t. Running the gauntlet of the app store submission process is hard enough when you only target one platform, but when you target both iOS and Android, you need to contend with a plethora of hurdles for both the Apple App Store and the Google Play Store.</p>

<p>
    Fortunately, the popular Fastlane tool (
    <a href="https://fastlane.tools/">https://fastlane.tools/</a>
    ) has evolved over the years to help alleviate some of the drudgery of submitting new apps, as well as updated releases, to these storefronts. And we&#39;re happy to report that new projects created with the `skip init` command will now include Fastlane templates that provide everything you need to automate your app distributions. Read more about it on our blog post: 
    <a href="/blog/skip-and-fastlane/">/blog/skip-and-fastlane/</a>.
</p>

<p>
    <b>WWDC, Google I/O, and Skip</b>
</p>

<p>Google I/O 2024 and WWDC 2024, the preeminent conferences for Google and Apple developers alike, went back-to-back in June. These exciting events unveiled a lot of new features to the languages and frameworks that are used daily by mobile app developers. We here on the Skip team are working hard to take advantage of many of the new features that were announced.</p>

<p>Language evolution was announced as well: Kotlin 2.0 (final) was released, and Swift 6.0 (beta) was offered up in preview. As we march towards a Skip 1.0 release, we are going to make sure that all the code we process and generate is compatible with both these next-generation language releases, and takes advantages of as many of the new features as possible, while still remaining compatible with prior source and binary releases. Skip 1.0 is right around the corner, and it will be right up to date with the latest and greatest!</p>

<p>
    <b>Thanks!</b>
</p>

<p>
    You can follow us on Mastodon at 
    <a href="https://mas.to/@skiptools">https://mas.to/@skiptools</a>, and join in the Skip discussions at 
    <a href="http://forums.skip.dev/">http://forums.skip.dev/</a>. The Skip FAQ at 
    <a href="/docs/faq/">/docs/faq/</a>
     is there to answer any questions, and be sure to check out the video tours at 
    <a href="/tour/">/tour/</a>. And, as always, you can reach out directly to us on our Slack channel at 
    <a href="/slack/">/slack/</a>.
</p>

<p>Happy Skipping!</p>
