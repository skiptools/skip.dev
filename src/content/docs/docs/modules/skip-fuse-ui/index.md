---
title: SkipFuseUI
description: Documentation for SkipFuseUI fetched from GitHub.
note: This documentation section is derived from the GitHub README.md source using the scripts/sync-modules.mjs script. Do not make edits to the file here, change it there.
editUrl: https://github.com/skiptools/skip-fuse-ui/edit/main/README.md
---

:::note[Source Repository <a href='https://github.com/skiptools/skip-fuse-ui/releases' alt='Releases for skip-fuse-ui'><img decoding='async' loading='lazy' alt='Releases for skip-fuse-ui' src='https://img.shields.io/github/v/release/skiptools/skip-fuse-ui.svg?style=flat' /></a>]{icon="github"}
This framework is available at [github.com/skiptools/skip-fuse-ui](https://github.com/skiptools/skip-fuse-ui) and can be checked out and improved locally as described in the [Contribution Guide](/docs/contributing/#local-libraries).
:::


SkipFuseUI provides the SwiftUI API surface for [Skip Fuse](/docs/modes/#fuse) apps on Android. It acts as a thin Swift bridging layer that delegates rendering to [SkipUI](/docs/modules/skip-ui/), which implements SwiftUI views as Jetpack Compose composables. On iOS, `import SwiftUI` resolves to Apple's framework as usual; on Android, it resolves to SkipFuseUI, giving you a single SwiftUI codebase that runs natively on both platforms.

## How It Works

SkipFuseUI sits between your SwiftUI code and SkipUI's Compose implementation. Your Swift views are compiled natively for Android by the Swift Android SDK, and at render time each view produces a Kotlin-side SkipUI counterpart that Compose renders on screen.

```mermaid
flowchart LR
    A["Your SwiftUI Code"] --> B["SkipFuseUI\n(Swift on Android)"]
    B -->|"Java_view"| C["SkipUI\n(Kotlin/Compose)"]
    C --> D["Jetpack Compose\nUI on Screen"]

    style A fill:#f5f5f5,stroke:#333,color:#fff
    style B fill:#f0e6ff,stroke:#7b2fbe,color:#fff
    style C fill:#e6f0ff,stroke:#4a90d9,color:#fff
    style D fill:#e6ffe6,stroke:#2d8a2d,color:#fff
```

The key mechanism is the `SkipUIBridging` protocol. Every SkipFuseUI view type conforms to it by exposing a `Java_view` property that returns the equivalent SkipUI Kotlin object. When Compose needs to render your view hierarchy, it walks the tree of `Java_view` references — each one backed by [SkipBridge](/docs/modules/skip-bridge/) JNI calls between Swift and Kotlin.

### Module Relationships

```mermaid
flowchart TB
    subgraph "Your App"
        APP["App SwiftUI Code"]
    end

    subgraph "SkipFuseUI Package"
        SFUI["SkipFuseUI\n(re-exports SwiftUI\non Android)"]
        SSU["SkipSwiftUI\n(Swift view types,\nproperty wrappers,\nmodifiers)"]
    end

    subgraph "Bridging Infrastructure"
        SB["SkipBridge\n(JNI object lifecycle,\ntype conversion)"]
        SF["SkipFuse\n(@Observable,\nOSLog, bridging\nsupport)"]
        SAB["SkipAndroidBridge\n(Android-specific\nJNI helpers)"]
        SJNI["SwiftJNI\n(low-level JNI\nC/Swift wrapper)"]
    end

    subgraph "Compose Implementation"
        SUI["SkipUI\n(SwiftUI → Jetpack\nCompose mapping)"]
        SM["SkipModel\n(Compose state\ntracking)"]
    end

    APP --> SFUI
    SFUI --> SSU
    SSU --> SB
    SSU --> SF
    SSU --> SUI
    SB --> SAB
    SB --> SJNI
    SUI --> SM

    style APP fill:#f5f5f5,stroke:#333,color:#fff
    style SFUI fill:#f0e6ff,stroke:#7b2fbe,color:#fff
    style SSU fill:#f0e6ff,stroke:#7b2fbe,color:#fff
    style SB fill:#ffe6e6,stroke:#cc3333,color:#fff
    style SF fill:#ffe6e6,stroke:#cc3333,color:#fff
    style SAB fill:#ffe6e6,stroke:#cc3333,color:#fff
    style SJNI fill:#ffe6e6,stroke:#cc3333,color:#fff
    style SUI fill:#e6f0ff,stroke:#4a90d9,color:#fff
    style SM fill:#e6f0ff,stroke:#4a90d9,color:#fff
```

On iOS, `SkipFuseUI` simply re-exports Apple's `SwiftUI` — the entire SkipSwiftUI layer is compiled away.

### Bridging Pattern

Every SwiftUI type in SkipFuseUI follows the same pattern: a Swift struct or class holds the view's parameters, and its `Java_view` property constructs the Kotlin equivalent on demand.

```mermaid
sequenceDiagram
    participant App as Your View (Swift)
    participant Fuse as SkipFuseUI VStack (Swift)
    participant Bridge as SkipBridge (JNI)
    participant UI as SkipUI VStack (Kotlin)
    participant Compose as Jetpack Compose

    App->>Fuse: VStack { Text("Hello") }
    Note over Fuse: Stores alignment,<br/>spacing, content
    Compose->>Fuse: Request Java_view
    Fuse->>Bridge: Create SkipUI.VStack<br/>with bridged content
    Bridge->>UI: JNI call → Kotlin object
    UI->>Compose: Emit Column composable
```

Content views are recursively bridged via `Java_viewOrEmpty`, which walks the view tree and converts each Swift view into its Kotlin counterpart.

### State Bridging

SwiftUI property wrappers (`@State`, `@Binding`, `@AppStorage`) are backed by bridge-aware box types that synchronize values between Swift and Compose's reactive state system:

```mermaid
flowchart LR
    S["@State var count = 0\n(Swift)"] -->|"BridgedStateBox"| K["StateSupport\n(Kotlin/Compose)"]
    K -->|"MutableState"| C["Compose\nRecomposition"]
    C -->|"read triggers\naccess()"| S

    style S fill:#f0e6ff,stroke:#7b2fbe,color:#fff
    style K fill:#e6f0ff,stroke:#4a90d9,color:#fff
    style C fill:#e6ffe6,stroke:#2d8a2d,color:#fff
```

When Swift code writes to a `@State` property, the `BridgedStateBox` notifies Compose's `MutableState`, triggering recomposition. When Compose reads the value, it calls back into Swift via the bridge. This two-way sync ensures that SwiftUI's declarative state model works identically on Android.

`@Observable` types require `import SkipFuse` to enable this state tracking. See the [App Development](/docs/app-development/#ui) guide for details.

## What SkipFuseUI Covers

SkipFuseUI mirrors the SwiftUI API surface for iOS 16+, including:

- **Containers**: `VStack`, `HStack`, `ZStack`, `List`, `ScrollView`, `LazyVGrid`, `LazyHGrid`, `NavigationStack`, `TabView`, `Form`, `Section`, `Group`
- **Controls**: `Button`, `Toggle`, `Slider`, `Stepper`, `Picker`, `DatePicker`, `TextField`, `SecureField`, `TextEditor`
- **Components**: `Text`, `Image`, `AsyncImage`, `Label`, `Link`, `ProgressView`, `Divider`, `ShareLink`
- **Graphics**: `Color`, `Gradient`, `Shape` (Circle, Rectangle, Capsule, etc.), `Path`, `Material`
- **Layout**: `GeometryReader`, `Alignment`, `EdgeInsets`, `ViewThatFits`, `Grid`
- **State**: `@State`, `@Binding`, `@Environment`, `@AppStorage`, `@FocusState`
- **Modifiers**: `.padding`, `.frame`, `.background`, `.overlay`, `.opacity`, `.rotation`, `.shadow`, `.clipShape`, `.sheet`, `.alert`, `.onAppear`, `.task`, and many more
- **Navigation**: `NavigationStack`, `NavigationLink`, `NavigationPath`, `.navigationTitle`, `.toolbar`
- **Gestures**: `TapGesture`, `LongPressGesture`, `DragGesture`
- **Animation**: `withAnimation`, `.animation`, `.transition`, `Spring`
- **UIKit compatibility**: `UIApplication`, `UIColor`, `UIImage`, `UIPasteboard`

For the full list of supported SwiftUI components, see the [SkipUI documentation](/docs/modules/skip-ui/#supported-swiftui).

## Related Documentation

- [App Development](/docs/app-development/) — Building dual-platform apps with Skip, including UI and view model coding
- [Skip Modes](/docs/modes/) — Fuse vs. Lite mode and when to use each
- [Bridging Reference](/docs/bridging/) — Supported Swift language features and types for bridging
- [Cross-Platform Topics](/docs/platformcustomization/) — Integrating platform-specific code with `#if SKIP` and `#if os(Android)`
- [SkipUI Module](/docs/modules/skip-ui/) — Supported SwiftUI components and Compose integration topics
- [SkipBridge Module](/docs/modules/skip-bridge/) — The JNI bridging infrastructure that SkipFuseUI depends on
- [SkipFuse Module](/docs/modules/skip-fuse/) — Observable state tracking and Android runtime support

