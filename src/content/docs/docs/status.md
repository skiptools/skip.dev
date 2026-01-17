---
layout: docs
title: Skip Fuse vs Lite
permalink: /docs/status/
---

### Skip Fuse {#skip_fuse}
**Skip Fuse** uses the native Swift-on-Android toolchain to compile your Swift for Android, auto-generating [JNI](https://docs.oracle.com/javase/8/docs/technotes/guides/jni/) bridging code to communicate with [Kotlin](https://kotlinlang.org) and Java.

### Skip Lite {#skip_lite}
**Skip Lite** transpiles[^1] your Swift source to Kotlin source, which is then compiled using the standard Kotlin compiler.

[^1]: [_Transpilation_](https://en.wiktionary.org/wiki/transpile) is the process of converting one programming language into another.

Except where otherwise noted, this documentation focuses on Skip Fuse. To learn more about Skip Lite and the tradeoffs between native and transpiled modes, read [Native and Transpiled](/docs/modes/).

## Status

Skip is stable and powers many production apps on the App Store and Play Store. 

Skip Fuse is a recent advance in Skip's capabilities. We appreciate your [feedback](/docs/help/) to continue to improve its functionality and tooling.

Continue reading the Skip documentation to learn more. The best way to get help and connect with fellow Skip users is to join the community [Slack](/slack/). We also have forums for both general [discussions](http://community.skip.tools) and specific [issues and bug reports](https://source.skip.tools/skip/issues).
