---
title: Getting Help
permalink: /docs/help/
---

The best way to get help and connect with fellow Skip users is to join the community [Slack](/slack/), where you can find real-time support and the community expertise to help you succeed with your project. You can also use the Skip [discussion forums](http://forums.skip.dev) to send feedback, ask questions, or search for solutions to issues. For bug reports, use the [issue tracker](https://source.skip.dev/skip/issues).

Please include the output of the `skip checkup` command in any communication related to technical issues.

## Troubleshooting Common Issues {#troubleshooting}

Skip's architecture relies on the Swift Package Manager build plugin system. When unexpected issues arise, often the best first step is to clean your Xcode build (`Product` -> `Clean Build Folder`) and reset packages (`File` -> `Packages` -> `Reset Package Caches`). Restarting Xcode is sometimes warranted, and trashing the local `DerivedData` folder as well as your app directory's `.build` folder might even be needed.

### First build is very slow or appears to hang

The first build of a Skip project downloads all required Gradle dependencies and builds the Compose libraries. This can take several minutes and download over 1 GB of files. Subsequent builds are much faster because the dependencies are cached. Run with `--verbose` or check the Xcode build log to see progress.

### "No such module" errors after updating Skip

After upgrading Skip versions, you may need to reset your package caches. In Xcode, use `File` -> `Packages` -> `Reset Package Caches`, then clean and rebuild. If the error persists, delete the `.build` folder in your project directory.

### Android emulator not found

If Skip reports that no Android emulator is running, verify with `adb devices` that a device is listed. You can create and launch an emulator with `skip android emulator create` followed by `skip android emulator launch`. See the [CLI reference](/docs/skip-cli/#android-emulator) for details.

### Gradle build failures

Gradle errors are surfaced through the Xcode build log. Common causes include network issues (Gradle needs internet to resolve dependencies on the first build), Java version mismatches, and stale caches. Run `skip doctor` to verify your environment, and try deleting the `.build` folder in your project directory to clear the Gradle caches.

### Plugin trust dialog in Xcode

The first time you build a Skip project in Xcode, you may see a dialog asking you to trust the Skip build plugin. Select "Trust & Enable" to proceed. This is a standard Xcode security prompt for all SwiftPM build plugins.

Search the [documentation](/docs), [issues](https://source.skip.dev/skip/issues), and [discussions](http://forums.skip.dev) for more information and to report problems.

