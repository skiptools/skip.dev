---
title: Debugging
permalink: /docs/debugging/
---

Skip generates fully native apps for both iOS and Android. That means you can utilize the power of each platform's native debugging tools. 

## Using the Debugger

For bugs affecting the shared or iOS-only Swift portions of your app, use Xcode's debugging tools just as you would for any other iOS app. Any fixes you make to shared logic written in Swift will of course fix the same logic bug in your Android build. And you can always write [unit tests](/docs/testing/) to help.

To debug an Android-specific problem, you can run your Android app [right in Android Studio](/docs/platformcustomization/#android-studio) and utilize its own debugging tools.

## Compiled Swift

A crash in native Swift code on Android will surface similarly to a crash caused by an uncaught Kotlin or Java exception, but instead of a detailed stack trace with line numbers, you will only receive the mangled name of the Swift function in which the crash took place. Mangled names are close enough to actual Swift class and function names, however, for you to find the offending function.

Following is an abridged sample of the Logcat contents when a crash occurs from a call to `fatalError("CRASHME")` in native code:

```
12-02 14:33:26.163 12075 12075 F SwiftRuntime: HelloSwiftModel/ViewModel.swift:92: Fatal error: CRASHME
12-02 14:33:26.171 12075 12075 F libc    : Fatal signal 5 (SIGTRAP), code 1 (TRAP_BRKPT), fault addr 0x763f841d04 in tid 12075 (.xyz.HelloSwift), pid 12075 (.xyz.HelloSwift)
12-02 14:33:26.198 12146 12146 I crash_dump64: obtaining output fd from tombstoned, type: kDebuggerdTombstoneProto
12-02 14:33:26.200   207   207 I tombstoned: received crash request for pid 12075
12-02 14:33:26.201 12146 12146 I crash_dump64: performing dump of process 12075 (target tid = 12075)
12-02 14:33:26.636   163   163 I logd    : logdr: UID=10296 GID=10296 PID=12146 n tail=500 logMask=8 pid=12075 start=0ns deadline=0ns
12-02 14:33:26.648   163   163 I logd    : logdr: UID=10296 GID=10296 PID=12146 n tail=500 logMask=1 pid=12075 start=0ns deadline=0ns
12-02 14:33:26.663 12146 12146 F DEBUG   : *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** ***
12-02 14:33:26.663 12146 12146 F DEBUG   : Build fingerprint: 'google/sdk_gphone64_arm64/emu64a:14/UE1A.230829.050/12077443:userdebug/dev-keys'
12-02 14:33:26.663 12146 12146 F DEBUG   : Revision: '0'
12-02 14:33:26.663 12146 12146 F DEBUG   : ABI: 'arm64'
12-02 14:33:26.663 12146 12146 F DEBUG   : Timestamp: 2024-12-02 14:33:26.204647577-0500
12-02 14:33:26.663 12146 12146 F DEBUG   : Process uptime: 44s
12-02 14:33:26.663 12146 12146 F DEBUG   : Cmdline: com.xyz.HelloSwift
12-02 14:33:26.663 12146 12146 F DEBUG   : pid: 12075, tid: 12075, name: .xyz.HelloSwift  >>> com.xyz.HelloSwift <<<
12-02 14:33:26.663 12146 12146 F DEBUG   : uid: 10296
12-02 14:33:26.663 12146 12146 F DEBUG   : tagged_addr_ctrl: 0000000000000001 (PR_TAGGED_ADDR_ENABLE)
12-02 14:33:26.663 12146 12146 F DEBUG   : pac_enabled_keys: 000000000000000f (PR_PAC_APIAKEY, PR_PAC_APIBKEY, PR_PAC_APDAKEY, PR_PAC_APDBKEY)
12-02 14:33:26.663 12146 12146 F DEBUG   : signal 5 (SIGTRAP), code 1 (TRAP_BRKPT), fault addr 0x000000763f841d04
12-02 14:33:26.663 12146 12146 F DEBUG   : Abort message: 'HelloSwiftModel/ViewModel.swift:92: Fatal error: CRASHME'
12-02 14:33:26.663 12146 12146 F DEBUG   :     x0  0087000000000000  x1  00000079939ab7c4  x2  00000079939ab7c4  x3  0000007fcd3d0cd8
12-02 14:33:26.663 12146 12146 F DEBUG   : 392 total frames
12-02 14:33:26.663 12146 12146 F DEBUG   : backtrace:
12-02 14:33:26.663 12146 12146 F DEBUG   :       #00 pc 000000000035dd04  /data/app/~~sl7j-wAIm5OGrYysAOiRvQ==/com.xyz.HelloSwift-l1KlzOX9df6cdVUNJI0-kw==/base.apk!libswiftCore.so (offset 0x999c000) ($ss17_assertionFailure__4file4line5flagss5NeverOs12StaticStringV_SSAHSus6UInt32VtF+560) (BuildId: 2e6f82a13c9518ce846bebc261661833fa34b7de)
12-02 14:33:26.663 12146 12146 F DEBUG   :       #01 pc 00000000000381b0  /data/app/~~sl7j-wAIm5OGrYysAOiRvQ==/com.xyz.HelloSwift-l1KlzOX9df6cdVUNJI0-kw==/base.apk (offset 0xabcc000) ($s15HelloSwiftModel04ViewC0C9saveItems33_AA1DA8893D92B109DC6527A80C9D3046LLyyF+1244)
12-02 14:33:26.663 12146 12146 F DEBUG   :       #02 pc 000000000003c63c  /data/app/~~sl7j-wAIm5OGrYysAOiRvQ==/com.xyz.HelloSwift-l1KlzOX9df6cdVUNJI0-kw==/base.apk (offset 0xabcc000) ($s15HelloSwiftModel04ViewC0C6_items33_AA1DA8893D92B109DC6527A80C9D3046LLSayAA4ItemVGvW+24)
12-02 14:33:26.663 12146 12146 F DEBUG   :       #03 pc 000000000003c704  /data/app/~~sl7j-wAIm5OGrYysAOiRvQ==/com.xyz.HelloSwift-l1KlzOX9df6cdVUNJI0-kw==/base.apk (offset 0xabcc000) ($s15HelloSwiftModel04ViewC0C6_items33_AA1DA8893D92B109DC6527A80C9D3046LLSayAA4ItemVGvs+96)
12-02 14:33:26.663 12146 12146 F DEBUG   :       #04 pc 0000000000038514  /data/app/~~sl7j-wAIm5OGrYysAOiRvQ==/com.xyz.HelloSwift-l1KlzOX9df6cdVUNJI0-kw==/base.apk (offset 0xabcc000) ($s15HelloSwiftModel04ViewC0C5itemsSayAA4ItemVGvsyyXEfU_+64)
12-02 14:33:26.663 12146 12146 F DEBUG   :       #05 pc 000000000003aa8c  /data/app/~~sl7j-wAIm5OGrYysAOiRvQ==/com.xyz.HelloSwift-l1KlzOX9df6cdVUNJI0-kw==/base.apk (offset 0xabcc000) ($s15HelloSwiftModel04ViewC0C5itemsSayAA4ItemVGvsyyXEfU_TA+24)
12-02 14:33:26.663 12146 12146 F DEBUG   :       #06 pc 000000000000cd04  /data/app/~~sl7j-wAIm5OGrYysAOiRvQ==/com.xyz.HelloSwift-l1KlzOX9df6cdVUNJI0-kw==/base.apk!libswiftObservation.so (offset 0xa3bc000) ($s11Observation0A9RegistrarV12withMutation2of7keyPath_q0_x_s03KeyG0Cyxq_Gq0_yKXEtKAA10ObservableRzr1_lF+88) (BuildId: 0698d39971241cca206c1100e2aa89fe94109d35)
12-02 14:33:26.663 12146 12146 F DEBUG   :       #07 pc 000000000010d844  /data/app/~~sl7j-wAIm5OGrYysAOiRvQ==/com.xyz.HelloSwift-l1KlzOX9df6cdVUNJI0-kw==/base.apk (offset 0x5cdc000) ($s10SkipBridge11ObservationV0C9RegistrarV12withMutation2of7keyPath_q0_x_s03KeyI0Cyxq_Gq0_yKXEtKAB10ObservableRzr1_lF+336)
12-02 14:33:26.663 12146 12146 F DEBUG   :       #08 pc 000000000003d44c  /data/app/~~sl7j-wAIm5OGrYysAOiRvQ==/com.xyz.HelloSwift-l1KlzOX9df6cdVUNJI0-kw==/base.apk (offset 0xabcc000) ($s15HelloSwiftModel04ViewC0C12withMutation7keyPath_q_s03KeyH0CyACxG_q_yKXEtKr0_lF+252)
12-02 14:33:26.663 12146 12146 F DEBUG   :       #09 pc 000000000003c890  /data/app/~~sl7j-wAIm5OGrYysAOiRvQ==/com.xyz.HelloSwift-l1KlzOX9df6cdVUNJI0-kw==/base.apk (offset 0xabcc000) ($s15HelloSwiftModel04ViewC0C5itemsSayAA4ItemVGvs+136)
12-02 14:33:26.663 12146 12146 F DEBUG   :       #10 pc 000000000003d260  /data/app/~~sl7j-wAIm5OGrYysAOiRvQ==/com.xyz.HelloSwift-l1KlzOX9df6cdVUNJI0-kw==/base.apk (offset 0xabcc000) ($s15HelloSwiftModel04ViewC0C4save4itemyAA4ItemV_tF+456)
12-02 14:33:26.663 12146 12146 F DEBUG   :       #11 pc 0000000000040e98  /data/app/~~sl7j-wAIm5OGrYysAOiRvQ==/com.xyz.HelloSwift-l1KlzOX9df6cdVUNJI0-kw==/base.apk (offset 0xabcc000) ($s15HelloSwiftModel04Viewc1_B7_save_3yySpySPySo18JNINativeInterfaceVGSgG_Svs5Int64VSvtF+324)
12-02 14:33:26.663 12146 12146 F DEBUG   :       #12 pc 0000000000040d48  /data/app/~~sl7j-wAIm5OGrYysAOiRvQ==/com.xyz.HelloSwift-l1KlzOX9df6cdVUNJI0-kw==/base.apk (offset 0xabcc000) (Java_hello_swift_model_ViewModel_Swift_1save_13+8)
12-02 14:33:26.663 12146 12146 F DEBUG   :       #13 pc 0000000000377030  /apex/com.android.art/lib64/libart.so (art_quick_generic_jni_trampoline+144) (BuildId: b10f5696fea1b32039b162aef3850ed3)
12-02 14:33:26.663 12146 12146 F DEBUG   :       #14 pc 00000000003605a4  /apex/com.android.art/lib64/libart.so (art_quick_invoke_stub+612) (BuildId: b10f5696fea1b32039b162aef3850ed3)
12-02 14:33:26.663 12146 12146 F DEBUG   :       #15 pc 00000000004906b4  /apex/com.android.art/lib64/libart.so (bool art::interpreter::DoCall<false>(art::ArtMethod*, art::Thread*, art::ShadowFrame&, art::Instruction const*, unsigned short, bool, art::JValue*)+1248) (BuildId: b10f5696fea1b32039b162aef3850ed3)
12-02 14:33:26.663 12146 12146 F DEBUG   :       #16 pc 000000000050a5d4  /apex/com.android.art/lib64/libart.so (void art::interpreter::ExecuteSwitchImplCpp<false>(art::interpreter::SwitchImplContext*)+2380) (BuildId: b10f5696fea1b32039b162aef3850ed3)
12-02 14:33:26.663 12146 12146 F DEBUG   :       #17 pc 00000000003797d8  /apex/com.android.art/lib64/libart.so (ExecuteSwitchImplAsm+8) (BuildId: b10f5696fea1b32039b162aef3850ed3)
12-02 14:33:26.663 12146 12146 F DEBUG   :       #18 pc 00000000000020b8  /data/app/~~sl7j-wAIm5OGrYysAOiRvQ==/com.xyz.HelloSwift-l1KlzOX9df6cdVUNJI0-kw==/base.apk (hello.swift.model.ViewModel.save+0)
```

To extract a human-readable name from the manged swift function, you can use the `xcrun swift-demangle` command, like so:

```
zap ~ % echo '$s15HelloSwiftModel04ViewC0C9saveItems33_AA1DA8893D92B109DC6527A80C9D3046LLyyF+1244' | xcrun swift-demangle
HelloSwiftModel.ViewModel.(saveItems in _AA1DA8893D92B109DC6527A80C9D3046)() -> ()+1244
```

:::note
We are collaborating with the Swift on Android Working Group to improve the Swift debugging experience on Android. For more details, see this [Swift forums discussion post](https://forums.swift.org/t/swift-debugging-on-android-current-state/84155).
:::

---

## Logging

Messages that you `print` do not appear in Android logging. Instead, Skip supports the standard `OSLog.Logger` API for dual-platform logging. Import `SkipFuse` to use `OSLog` APIs across iOS and Android:

```swift
import SkipFuse
...
let logger = Logger(subsystem: "my.subsystem", category: "MyCategory")
...
logger.info("My message")
```

:::tip
If you are using [Skip Lite](/docs/status/#skip_fuse), import `OSLog` instead of `SkipFuse`.
:::

When you log a message in your app, the `OSLog` messages from the Swift side of the app will appear in Xcode's console as you'd expect. Skip's Android implementation of `OSLog.Logger`, on the other hand, forwards log messages to [Logcat](https://developer.android.com/tools/logcat), which is Android's native logging mechanism. Using the Logcat tab in Android Studio is a good way to browse and filter the app's log messages on the Android side. You can also view Logcat output in the Terminal using the command `adb logcat`, which has a variety of filtering flags that can applied to the default (verbose) output.

---

## Accessing Generated Source {#accessing-transpiled-output}

The location of the Kotlin and Swift source Skip generates during bridging and transpiling differs for app and framework targets. We discuss how to access your generated source in Xcode below. The Cross-Platform Topics documentation covers how to work with your Android code [in Android Studio](/docs/platformcustomization/#android-studio).

<img alt="Framework Transpilation Browse Screenshot" src="https://assets.skip.dev/framework-dev/framework-xcode-test-browse.png" style="width: 100%; XXXmax-width: 750px;" />

### Dual-Platform Apps

For dual-platform apps, Xcode places Skip's generated source in a `plugins` directory deep within Xcode's `DerivedData` folder. Skip surfaces this directory as the `SkipStone/plugins` group in your Xcode project. 

<img width="300" alt="Transpiled source location" src="https://assets.skip.dev/images/transpiled-source-location.png" />

:::note
The first time you build - and each first re-build after deleting `DerivedData` - Xcode may not allow you to expand the `SkipStone/plugins` group. Restarting Xcode fixes the issue, but you can fix it without restarting by explicitly marking `SkipStone/plugins` as a folder. Highlight the `SkipStone/plugins` group, then use Xcode's right panel to set the group `Type` to `Folder`.
:::

<img width="300" alt="Transpiled source location" src="https://assets.skip.dev/images/plugins-folder.png" />

### Frameworks {#skiplink}

Skip includes the `Create SkipLink` command plugin to link to the plugin output of your framework targets in Xcode. To invoke the command, control-click your Skip-ified package or highlight the package and use the `File → Packages` menu.

<img alt="Framework SkipLink Screenshot" src="https://assets.skip.dev/framework-dev/framework-xcode-skiplink.png" style="width: 100%; XXXmax-width: 750px;" />

After running the `Create SkipLink` command, the new `SkipLink` Xcode group will allow you to access your framework's Android project and generated source.

### Jumping to Generated Source

After linking to the generated source files using the instructions above, you can jump to generated files using Xcode's `Open Quickly (cmd-shift-O)` command, just as you can jump to your own Swift files. Generated files have the same names as their Swift counterparts, but use the `_Bridge.swift` suffix for bridging files, or the `.kt` file extension for Kotlin files.

Keep in mind that in order to work around limitations on Kotlin extension properties and functions, Skip typically moves code from your Swift extensions into the declaring Kotlin class during generation. If you defined an extension in a separate file from its declaring type, you may find its representation in the Kotlin file of the declaring type rather than the Kotlin file for the extension.

You can also jump to a generated file from an Xcode build error message. When the Android Swift or Kotlin compiler outputs an error message, Skip's Xcode plugin surfaces it as an Xcode. Clicking the build error for the generated source file will jump to the offending bridging or Kotlin code.
