---
title:  "May Skip Newsletter"
date: 2024-05-23
tags: [newsletter, announcements, product-updates, swiftui, skipui, performance, accessibility, asset-catalogs, sample-app]
layout: post
permalink: /blog/newsletter-may-2024/
author: The Skip Team
# published: false
---

<p>
    Welcome to the May edition of the 
    <a href="https://skip.tools">Skip.tools</a>
     newsletter! This month we will showcase some of the notable improvements to the Skip transpiler and the ecosystem of free and open-source frameworks that power the dual-platform apps that Skip enables.
</p>

<p>
    <b>Early Adopter Pricing Ending Soon</b>
</p>

<p>
    Skip 1.0 is on the horizon, which means that we will be winding down our Early Adopter Program at the end of the month. So 
    <b>now</b>
     is the time to take advantage of the massive early adopter discount from 
    <a href="https://skip.tools/pricing">https://skip.tools/pricing</a>
    , as Skip will be switching to full pricing next month.
</p>

<p>
    <b>New Sample App: Travel Bookings</b>
</p>

<p>
    We've released a whole new sample application that shows off how Skip can make gorgeous apps for both iOS and Android. The Travel Bookings app demonstrates navigation, tabs, images, persistence, maps, weather, networking, and a whole lot more. Check it out at 
    <a href="/docs/samples/skipapp-bookings">/docs/samples/skipapp-bookings</a>
    .
</p>

<p>
    <img alt="skip-splash-poster.png" src="https://skip.tools/assets/video/skip-splash-poster.png"/>
</p>

<p>
    <b>Symbols and Images in Asset Catalogs</b>
</p>

<p>
    Images and icons are an essential part of any modern application. Skip has had good support for SwiftUI's AsyncImage for a while now, but we recently also added support for asset catalogs, enabling you to bundle static images and exported symbols directly in your app. And we support many of the common variants for assets, such as light and dark variants for images, as well as different weights for symbols. Read more about the new asset catalog support at 
    <a href="/docs/modules/skip-ui/#images">/docs/modules/skip-ui/#images</a>
    .
</p>

<p>
    <b>Major Performance Enhancements</b>
</p>

<p>
    We are delighted to report that we’ve reduced the number of re-compositions SkipUI performs on Android, resulting in a huge performance boost to some common operations like navigation. If your tabs or navigation bar was feeling a bit sluggish, run 
    <code>File / Packages / Update to Latest Package Versions</code>
     on your project to grab skip-ui 0.9.1 and enjoy the speed boost!
</p>

<p>
    <b>Tip: Embedding Kotlin Calls Directly in Swift</b>
</p>

<p>
    Unlike other cross-platform app development frameworks, custom native integration in Skip is a breeze. Rather than requiring cumbersome bridging infrastructure or platform channels, with Skip you merely add your Kotlin calls in an `#if SKIP` block, and it will be executed directly on the transpiled side. And since Skip does not intrude into the iOS side of your app, you'll continue to be able to integrate with any of the Darwin platform APIs directly, including UIKit and other Objective-C frameworks (as well as C and C++). Read more about the platform customization options at 
    <a href="/docs/platformcustomization">/docs/platformcustomization</a>
    .
</p>

<p>
    <b>Accessibility Improvements</b>
</p>

<p>May 16th was Global Accessibility Awareness Day. Skip celebrated by adding support for many additional SwiftUI accessibility modifiers. Being a truly universal app means not just reaching all the devices that people have, but also making those apps usable by everyone. Skip is proud to enable you to build uncompromisingly excellent apps that can reach the entire world: every device, every language, and every ability.</p>

<p>
    <b>Take Our Survey!</b>
</p>

<p>
    Our Skip Developer Survey is a great way to provide feedback and help us define Skip's direction in the coming weeks and months. It only takes a few minutes, and will help define Skip's focus and features: 
    <a href="https://skip.tools/survey">https://skip.tools/survey</a>
    .
</p>

<p>
    <b>Edge-to-edge Mode</b>
</p>

<p>In the "Improve the Experience of your Android App" session at Google I/O, the Android team promoted the use of the new edge-to-edge support APIs in Jetpack Compose, saying that “users significantly prefer edge-to-edge screens to non-edge-to-edge screens, and users feel these screens are more satisfying and premium.”</p>

<p>
    We agree, and so Skip now enables Android edge-to-edge mode by default in all new projects. Use the SwiftUI safe area APIs to control how your content renders under system bars. And you can enable edge-to-edge in existing projects with only a couple lines of code: 
    <a href="/docs/modules/skip-ui/#enabling-or-disabling-edge-to-edge">/docs/modules/skip-ui/#enabling-or-disabling-edge-to-edge</a>
    .
</p>

<p>
    <b>Skip Webinar Series</b>
</p>

<p>
    Sign up for our Skip webinar to see a hands-on tour of how Skip can help you build apps that reach the 
    <b>entire</b>
     mobile marketplace. We take questions and answers throughout, so this is a great opportunity to get some direct interaction with the Skip engineers. Sign up at 
    <a href="https://skip.tools/webinar/">https://skip.tools/webinar/</a>
     or watch a past webinar at 
    <a href="/tour/">/tour/</a>
    .
</p>

<p>
    <b>Get Your Project Featured</b>
</p>

<p>
    We are assembling a list of Skip projects to feature on our web site. If you have built – or are currently building – an interesting app using Skip, send us an email at 
    <a href="mailto:support@skip.tools">support@skip.tools</a>
     and we may promote it on our customers page! And, as always, we are seeking testimonials from happy Skip users that we can share with the rest of the community.
</p>

<p>
    <b>That's All Folks!</b>
</p>

<p>
    You can follow us on Mastodon at 
    <a href="https://mas.to/@skiptools">https://mas.to/@skiptools</a>
    , and join in the Skip discussions at 
    <a href="http://forums.skip.dev/">http://forums.skip.dev/</a>
    . The Skip FAQ at 
    <a href="/docs/faq/">/docs/faq/</a>
     is there to answer any questions, and be sure to check out the video tours at 
    <a href="/tour/">/tour/</a>
    .
</p>

<p>Happy Skipping!</p>
