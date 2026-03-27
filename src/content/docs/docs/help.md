---
title: Getting Help
permalink: /docs/help/
---

The best way to get help and connect with fellow Skip users is to join the community [Slack](/slack/), where you can find real-time support and the community expertise to help you succeed with your project. You can also use the Skip [discussion forums](http://forums.skip.dev) to send feedback, ask questions, or search for solutions to issues. For bug reports, use the [issue tracker](https://source.skip.dev/skip/issues).

Please include the output of the `skip checkup` command in any communication related to technical issues.

## Troubleshooting Common Issues {#troubleshooting}

Skip's architecture relies on the Swift Package Manager build plugin system. When unexpected issues arise, often the best first step is to clean your Xcode build (`Product` -> `Clean Build Folder`) and reset packages (`File` -> `Packages` -> `Reset Package Caches`). Restarting Xcode is sometimes warranted, and trashing the local `DerivedData` folder as well as your app directory's `.build` folder might even be needed. 

Specific known error conditions are listed below. Search the [documentation](/docs), [issues](https://source.skip.dev/skip/issues), and [discussions](http://forums.skip.dev) for more information and to report problems.

