---
title:  "Going the last mile with Skip and Fastlane"
date: 2024-06-19
tags: [skip, fastlane, deployment, ios, android, automation, app-store-submission]
layout: post
permalink: /blog/skip-and-fastlane/
author: Marc Prud'hommeaux
draft: false
---

Getting your finished app into the hands of users can be a laborious process. The individual app stores – the Apple App Store the the Google Play Store, primarily – have their own cumbersome web-based processes for uploading the app binary, adding metadata and screenshots, and providing the necessarily content ratings and regulatory information required by various jurisdictions. And once you have gone through all the tedious manual steps needed to release the initial version of the app, each and every update will also need to follow many of those steps all over again.

Fortunately, this process has become so irksome, to so many developers, that a community tool called "Fastlane" was born. In the [documentation](https://docs.fastlane.tools), it describes itself as:

> fastlane is the easiest way to automate beta deployments and releases for your iOS and Android apps. 🚀 It handles all tedious tasks, like generating screenshots, dealing with code signing, and releasing your application.

Fastlane is architected as a collection of plugins that handle all manner of app distribution tasks, like packaging, signing, and uploading. It is configured with a platform-specific hierarchy of local text and ruby configuration files, one for [Android](https://docs.fastlane.tools/getting-started/android/setup/) and another for [iOS](https://docs.fastlane.tools/getting-started/ios/setup/).

Skip 0.8.50 now has built-in support for creating a default fastlane configuration for each of your iOS and Android projects. When you create a new project with the command:

```
skip init --fastlane --appid=app.bundle.id package-name AppName
```

The `Darwin/` and `Android/` folders will each contain a template for the fastlane project, which holds the metadata files that can be edited to fill in information like the app’s title, description, content ratings, and screenshots.

Once you fill in the generated text files with your app's specific details, such as the title, description, and keywords, you can then use the `fastlane release` command in each of the folders to create new releases of your app and submit them either to the store's beta test service, or to be reviewed for worldwide release.
 
Being able to quickly build and upload a new release with a single command is a great help in maintaining a rapid release cadence. It enables “continuous delivery”, defined by [Wikipedia](https://en.wikipedia.org/wiki/Continuous_delivery) as:

> Continuous delivery (CD) is a software engineering approach in which teams produce software in short cycles, ensuring that the software can be reliably released at any time. It aims at building, testing, and releasing software with greater speed and frequency. The approach helps reduce the cost, time, and risk of delivering changes by allowing for more incremental updates to applications in production. A straightforward and repeatable deployment process is important for continuous delivery.

We are using this process ourselves with those Skip apps that we are delivering to the app stores, like the [Skip Showcase](/docs/samples/skipapp-showcase/) app that demonstrates the various SkipUI components ([App Store link](https://apps.apple.com/us/app/skip-showcase/id6474885022), [Play Store link](https://play.google.com/store/apps/details?id=org.appfair.app.Showcase)).

Being able to submit a new release to both the major app storefronts with a single command is a joy. It can be used to submit quick fixes, or as part of a continuous integration workflow triggered by tagging your source release. However you use it, Fastlane eliminates much of the repetition and tedium of release management.
 
For more information on Skip's Fastlane integration, see the [deployment documentation](/docs/deployment/#fastlane).

