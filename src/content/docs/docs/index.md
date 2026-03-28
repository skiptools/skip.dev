---
title: What is Skip?
menutitle: Docs
permalink: /docs/
#tableOfContents: false
---

Skip lets you write one app in Swift and SwiftUI and ship it natively on both iOS and Android.

The mobile app market is split between iPhone and Android. iPhone leads in revenue per user, while Android reaches far more people worldwide.[^apprevenue]

[^apprevenue]: Spending Power: iOS users spend $140 annually on apps versus $69 for Android users. iOS also dominates subscription revenue, with 5× higher average revenue per user (ARPU). Source: [iOS vs Android: Subscription Metrics Compared — appenure.com](https://www.appeneure.com/blog/ios-vs-android-subscription-metrics-compared/seobot-blog)

<style>
:root {
  /* same colors as the Skip logo */
  --ios-color: #448CCE;
  --android-color: #29A768;
  --text-main: var(--sl-color-white);
  --text-muted: var(--sl-color-gray-3);
  --chart-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}

/* Handle Starlight Dark Mode */
:root[data-theme='dark'] {
  --text-main: var(--sl-color-white);
  --text-muted: var(--sl-color-gray-3);
}

.ecosystem-charts-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin: 2rem 0;
  /* align-items: flex-start; */
  /* align-items: stretch; */
  /* font-family: system-ui, -apple-system, sans-serif; */
}

.chart-card {
  flex: 1 1 300px;
  min-height: 400px;
  /* background: var(--bg-card); */
  border: 1px solid rgba(128, 128, 128, 0.2);
  border-radius: 16px;
  padding: 24px;
  box-shadow: var(--chart-shadow);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
}

.chart-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-main);
  margin-bottom: 4px;
  text-align: center;
}

.chart-subtitle {
  font-size: 0.875rem;
  color: var(--text-muted);
  margin-bottom: 24px;
  text-align: center;
}

/* PIE CHART STYLES */
.pie-wrapper {
  position: relative;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  /* iOS: ~66%, Android: ~$34 */
  background: conic-gradient(
    var(--ios-color) 0% 66%,
    var(--android-color) 34% 100%
  );
}

/* BAR CHART STYLES */
.bar-container {
  width: 100%;
  height: 240px;
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  padding-bottom: 20px;
}

.bar-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 60px;
}

.bar {
  width: 100%;
  border-radius: 8px 8px 0 0;
  transition: transform 0.3s ease;
}

.bar:hover {
  transform: scaleY(1.05);
}

.bar-ios {
  height: 70px; /* ~1.4B users */
  background-color: var(--ios-color);
}

.bar-android {
  height: 180px; /* ~3.7B users */
  background-color: var(--android-color);
}

.label {
  margin-top: 12px;
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--text-main);
}

.value-tag {
  font-size: 0.75rem;
  color: var(--text-muted);
  margin-bottom: 4px;
}

/* LEGEND STYLES */
.legend {
  display: flex;
  gap: 16px;
  margin-top: 20px;
}

.legend-item {
  display: flex;
  align-items: center;
  font-size: 0.85rem;
  color: var(--text-main);
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 3px;
  margin-right: 6px;
}

/* not sure why this is needed, but otherwise the chart elements are staggered */
.mialignment-correction {
    margin-top: 16px;
}
</style>

<div class="ecosystem-charts-container">
  <div class="chart-card mialignment-correction">
    <div>
      <h3 class="chart-title">Monetization Power</h3>
      <p class="chart-subtitle">Average Revenue Per User (Annual)</p>
    </div>
    <div class="pie-wrapper"></div>
    <div class="legend">
      <div class="legend-item mialignment-correction">
        <span class="dot" style="background: var(--ios-color)"></span> iOS (~$140)
      </div>
      <div class="legend-item">
        <span class="dot" style="background: var(--android-color)"></span> Android (~$69)
      </div>
    </div>
  </div>
  <div class="chart-card">
    <div>
      <h3 class="chart-title">Market Reach</h3>
      <p class="chart-subtitle">Total Active Users (Billions)</p>
    </div>
    <div class="bar-container">
      <div class="bar-group">
        <span class="value-tag">~1.4B</span>
        <div class="bar bar-ios"></div>
        <span class="label">iOS</span>
      </div>
      <div class="bar-group">
        <span class="value-tag">~3.7B</span>
        <div class="bar bar-android"></div>
        <span class="label">Android</span>
      </div>
    </div>
    <div class="legend">
       <div class="legend-item">Global OS Distribution (2026)</div>
    </div>
  </div>
</div>


If your app is only available on iOS, it is leaving out an enormous and growing segment of the market. Your absence from Android is leaving users behind. Skip is the [only framework](/compare/) that delivers genuinely native apps on both platforms from a single Swift codebase.

:::tip
To jump right in and get started, please go straight to the [<u>getting started</u>](/docs/gettingstarted/) guide.
:::

With Skip, you write your shared code in Swift and SwiftUI. Your Swift compiles natively for both iOS and Android, with no added runtime, no interpreter, and no garbage collector on iOS. SwiftUI runs as-is on Apple platforms, and Skip produces native [Jetpack Compose](https://developer.android.com/compose) on Android. Your users get a platform-perfect experience, not a cross-platform approximation.

Use Skip for bits of shared logic and UI, for your entire app, or anything in between. Skip makes [integration](/docs/platformcustomization/) between your Swift and Android API as well as your SwiftUI and Compose views a snap, without significant overhead or complex bridging.

:::caution[Consider This…]{icon="starlight"}
Most teams design for iOS first and port to Android later. Clients ask for an iPhone app, then expect Android to follow. Skip is the only framework built for exactly this workflow: write Swift, ship everywhere.
:::

<img src="https://assets.skip.dev/images/skip-marketing-preview.jpg" alt="Screenshot" style="width: 90%"/>

---

## Skip Advantages {#advantages}

### Skip versus writing two separate native apps

Every team maintaining separate iOS and Android apps discovers the same thing: you are writing most of your code twice.

- The same model types. They’ll often have to communicate with the same network APIs, serialize to the same JSON format, and have the same persistence capabilities across platforms.
- The same logic to enforce your business rules.
- The same unit tests to ensure that your model and business logic are working.
- The same onboarding screens, settings screens, forms, lists, and other “standard” UI. Parts of your app might need careful tailoring for each mobile OS, but much of the experience may be identical across iOS and Android.

The traditional defense for this duplication is that cross-platform frameworks are not worth the trade-offs. And historically, those trade-offs have been real:

- Training or hiring for a new programming language (JavaScript, Dart, etc.) and set of application frameworks.
- Bloating the app with an added runtime and/or garbage collector.
- Degrading the user experience with non-native UI.

Skip eliminates these trade-offs. With Skip, you can:

- Develop with a programming language and set of frameworks you’re already using.
- Avoid the overhead of adding another runtime or garbage collector to either platform.
- Produce entirely native user interfaces - SwiftUI on iOS and Compose on Android - from common SwiftUI code.
- Call native API from your shared code whenever you need to.

You write your shared code in Swift and SwiftUI, the same language and frameworks you already use on iOS. On Android, Skip bridges your Swift and SwiftUI to Kotlin and Compose. The result is fully native code on both platforms. And because the resulting code is native, it means:

1. Your Swift code [integrates perfectly](/docs/platformcustomization/) with the parts of your app you choose to develop separately on iOS and Android.
1. You are never limited by what Skip does or does not support. You can always implement and call out to platform-specific solutions, just as you would when developing separate iOS and Android apps.

Skip can save you enormous amounts of time and effort, without requiring you to compromise your app.

### Skip versus other cross-platform mobile frameworks

Skip has many advantages over other cross platform solutions like Flutter and React Native:

- **Genuinely native.** Skip apps don't just “look native”, they *are* native: SwiftUI on iOS and Jetpack Compose on Android. You know the difference, and so do your users. Take full advantage of new platform features and get automatic integration with core functionality like accessibility, which is a requirement for compliance in many fields.
- **Zero footprint on iOS.** Your iOS app has no dependency on Skip whatsoever. It is pure, unmodified SwiftUI. The Android build depends only on standard open-source libraries.
- **Memory efficient.** Skip adds no garbage collector or managed runtime to your iOS app. On Android, Skip Fuse compiles Swift natively, keeping memory usage and battery consumption comparable to hand-written Kotlin.
- **Your IDE, your workflow.** Develop in Xcode with all your existing tools and workflows. Use Android Studio when you need platform-specific Kotlin.
- **Thousands of packages.** Skip supports [thousands of cross-platform modules](https://swiftpackageindex.com/search?query=platform%3Aios%2Candroid). It also bridges seamlessly with Kotlin and Compose, so integrating Android-specific libraries is straightforward.
- **Free and open source.** Swift-on-Android is only half the story. Skip's app development frameworks are all free and open-source.
- **Ejectable.** If you ever stop using Skip, your iOS app remains a pristine, fully functional SwiftUI project. You are never locked in.

<!--
- **CI friendly.** Skip has cross-platform unit tests too! Ensure that your logic performs identically across platforms. Run your tests either locally or remotely, making acceptance testing a breeze.
-->


Check out our [comparison matrix](/compare/) to see how Skip compares to several popular cross-platform solutions across various technical axes.
