---
title: Showcase (Fuse)
description: Documentation for Showcase (Fuse) fetched from GitHub.
note: This documentation section is derived from the GitHub README.md source using the scripts/sync-modules.mjs script. Do not make edits to the file here, change it there.
editUrl: https://github.com/skiptools/skipapp-showcase-fuse/edit/main/README.md
---

:::note[Source Repository <a href='https://github.com/skiptools/skipapp-showcase-fuse/releases' alt='Releases for skipapp-showcase-fuse'><img decoding='async' loading='lazy' alt='Releases for skipapp-showcase-fuse' src='https://img.shields.io/github/v/release/skiptools/skipapp-showcase-fuse.svg?style=flat' /></a>]{icon="github"}
This sample app is available at [github.com/skiptools/skipapp-showcase-fuse](https://github.com/skiptools/skipapp-showcase-fuse) and can be checked out and improved locally as described in the [Contribution Guide](/docs/contributing/#local-libraries).
:::


A comprehensive demonstration app for Skip, showcasing cross-platform SwiftUI development for iOS and Android. This is a [Skip Fuse](/docs/modes/) app where Swift runs natively on both platforms, with [SkipUI](/docs/modules/skip-ui) converting SwiftUI views into Jetpack Compose on Android.

The app contains 90+ interactive playgrounds, each demonstrating a specific SwiftUI component, layout technique, or framework integration. Every playground renders natively on both iOS and Android from the same Swift source code.

<div align="center">
  <a href="https://play.google.com/store/apps/details?id=org.appfair.app.Showcase" style="display: inline-block;"><img src="https://appfair.org/assets/badges/google-play-store.svg" alt="Download on the Google Play Store" style="height: 60px; vertical-align: middle; object-fit: contain;" /></a>
  <a href="https://apps.apple.com/us/app/skip-showcase/id6474885022" style="display: inline-block;"><img src="https://appfair.org/assets/badges/apple-app-store.svg" alt="Download on the Apple App Store" style="height: 60px; vertical-align: middle; object-fit: contain;" /></a>
</div>

## iPhone Screenshots

<div align="center" style="margin: 0 auto; justify-content: center; box-sizing: border-box; display: flex; gap: 8px; align-items: center;">
<img alt="iPhone Screenshot" src="https://raw.githubusercontent.com/skiptools/skipapp-showcase-fuse/main/Darwin/fastlane/screenshots/en-US/1_en-US.png" style="width: 18%" /> <img alt="iPhone Screenshot" src="https://raw.githubusercontent.com/skiptools/skipapp-showcase-fuse/main/Darwin/fastlane/screenshots/en-US/2_en-US.png" style="width: 18%" /> <img alt="iPhone Screenshot" src="https://raw.githubusercontent.com/skiptools/skipapp-showcase-fuse/main/Darwin/fastlane/screenshots/en-US/3_en-US.png" style="width: 18%" /> <img alt="iPhone Screenshot" src="https://raw.githubusercontent.com/skiptools/skipapp-showcase-fuse/main/Darwin/fastlane/screenshots/en-US/4_en-US.png" style="width: 18%" /> <img alt="iPhone Screenshot" src="https://raw.githubusercontent.com/skiptools/skipapp-showcase-fuse/main/Darwin/fastlane/screenshots/en-US/5_en-US.png" style="width: 18%" />
</div>


## Android Screenshots

<div align="center" style="margin: 0 auto; justify-content: center; box-sizing: border-box; display: flex; gap: 8px; align-items: center;">
<img alt="Android Screenshot" src="https://raw.githubusercontent.com/skiptools/skipapp-showcase-fuse/main/Android/fastlane/metadata/android/en-US/images/phoneScreenshots/1_en-US.png" style="width: 18%" /> <img alt="Android Screenshot" src="https://raw.githubusercontent.com/skiptools/skipapp-showcase-fuse/main/Android/fastlane/metadata/android/en-US/images/phoneScreenshots/2_en-US.png" style="width: 18%" /> <img alt="Android Screenshot" src="https://raw.githubusercontent.com/skiptools/skipapp-showcase-fuse/main/Android/fastlane/metadata/android/en-US/images/phoneScreenshots/3_en-US.png" style="width: 18%" /> <img alt="Android Screenshot" src="https://raw.githubusercontent.com/skiptools/skipapp-showcase-fuse/main/Android/fastlane/metadata/android/en-US/images/phoneScreenshots/4_en-US.png" style="width: 18%" /> <img alt="Android Screenshot" src="https://raw.githubusercontent.com/skiptools/skipapp-showcase-fuse/main/Android/fastlane/metadata/android/en-US/images/phoneScreenshots/5_en-US.png" style="width: 18%" />
</div>


## App Structure

The app uses a three-tab layout defined in [ContentView.swift](https://source.skip.dev/skipapp-showcase-fuse/blob/main/Sources/ShowcaseFuse/ContentView.swift):

- **About** — App info and version details
- **Showcase** — Searchable list of all playgrounds ([PlaygroundListView.swift](https://source.skip.dev/skipapp-showcase-fuse/blob/main/Sources/ShowcaseFuse/PlaygroundListView.swift))
- **Settings** — Appearance and configuration

Each playground is registered as a case in the `PlaygroundType` enum, which provides the title and view. The list is searchable and navigable via `NavigationStack`.

## Framework Dependencies

The showcase integrates 10 Skip framework libraries beyond the core SkipUI, demonstrating how optional frameworks can be composed into a single app:

| Framework | Repository | Purpose |
|---|---|---|
| [SkipFuseUI](/docs/modules/skip-fuse-ui) | [skip-fuse-ui](https://source.skip.tools/skip-fuse-ui) | Core SwiftUI-to-Compose bridge for Fuse mode |
| [SkipKit](/docs/modules/skip-kit) | [skip-kit](https://source.skip.tools/skip-kit) | Permissions, document/media pickers, haptics, device info |
| [SkipAV](/docs/modules/skip-av) | [skip-av](https://source.skip.tools/skip-av) | Video playback (AVKit on iOS, ExoPlayer on Android) |
| [SkipWeb](/docs/modules/skip-web) | [skip-web](https://source.skip.tools/skip-web) | Embedded web views (WKWebView / android.webkit.WebView) |
| [SkipDevice](/docs/modules/skip-device) | [skip-device](https://source.skip.tools/skip-device) | Sensors (accelerometer, gyroscope, magnetometer, barometer) and location |
| [SkipMotion](/docs/modules/skip-motion) | [skip-motion](https://source.skip.tools/skip-motion) | Lottie animations |
| [SkipKeychain](/docs/modules/skip-keychain) | [skip-keychain](https://source.skip.tools/skip-keychain) | Keychain / EncryptedSharedPreferences |
| [SkipSQL](/docs/modules/skip-sql) | [skip-sql](https://source.skip.tools/skip-sql) | SQLite database access |
| [SkipNotify](/docs/modules/skip-notify) | [skip-notify](https://source.skip.tools/skip-notify) | Push and local notifications |
| [SkipAuthenticationServices](/docs/modules/skip-authentication-services) | [skip-authentication-services](https://source.skip.tools/skip-authentication-services) | Web authentication sessions (OAuth flows) |

## Playground Guide

Every playground file is in [Sources/ShowcaseFuse/](https://source.skip.dev/skipapp-showcase-fuse/blob/main/Sources/ShowcaseFuse/) and links to its source via the toolbar "Source" button. The entries below link to the playground source code and the relevant SkipUI documentation for each component.

### Controls

Interactive input elements that accept user actions.

| Playground | Components | Source |
|---|---|---|
| [Button](/docs/modules/skip-ui/#supported-swiftui) | Button, Label, button roles, `.bordered`, `.borderedProminent`, `.plain` styles | [ButtonPlayground.swift](https://source.skip.dev/skipapp-showcase-fuse/blob/main/Sources/ShowcaseFuse/ButtonPlayground.swift) |
| [Toggle](/docs/modules/skip-ui/#supported-swiftui) | Toggle, `.labelsHidden`, `.tint`, `.disabled` | [TogglePlayground.swift](https://source.skip.dev/skipapp-showcase-fuse/blob/main/Sources/ShowcaseFuse/TogglePlayground.swift) |
| [Slider](/docs/modules/skip-ui/#supported-swiftui) | Slider with ranges, steps, `onEditingChanged` | [SliderPlayground.swift](https://source.skip.dev/skipapp-showcase-fuse/blob/main/Sources/ShowcaseFuse/SliderPlayground.swift) |
| [Stepper](/docs/modules/skip-ui/#supported-swiftui) | Stepper with Int/Double values, custom bounds | [StepperPlayground.swift](https://source.skip.dev/skipapp-showcase-fuse/blob/main/Sources/ShowcaseFuse/StepperPlayground.swift) |
| [Picker](/docs/modules/skip-ui/#supported-swiftui) | Picker with `.segmented`, `.menu` styles | [PickerPlayground.swift](https://source.skip.dev/skipapp-showcase-fuse/blob/main/Sources/ShowcaseFuse/PickerPlayground.swift) |
| [DatePicker](/docs/modules/skip-ui/#supported-swiftui) | DatePicker with date/time modes | [DatePickerPlayground.swift](https://source.skip.dev/skipapp-showcase-fuse/blob/main/Sources/ShowcaseFuse/DatePickerPlayground.swift) |
| [Menu](/docs/modules/skip-ui/#supported-swiftui) | Menu with primary action, sections, dividers | [MenuPlayground.swift](https://source.skip.dev/skipapp-showcase-fuse/blob/main/Sources/ShowcaseFuse/MenuPlayground.swift) |
| [ProgressView](/docs/modules/skip-ui/#supported-swiftui) | Circular and linear progress, determinate/indeterminate | [ProgressViewPlayground.swift](https://source.skip.dev/skipapp-showcase-fuse/blob/main/Sources/ShowcaseFuse/ProgressViewPlayground.swift) |

### Text and Typography

Text display, input, and formatting.

| Playground | Components | Source |
|---|---|---|
| [Text](/docs/modules/skip-ui/#supported-swiftui) | Text with bold, italic, strikethrough, underline, markdown, all font sizes, custom fonts | [TextPlayground.swift](https://source.skip.dev/skipapp-showcase-fuse/blob/main/Sources/ShowcaseFuse/TextPlayground.swift) |
| [TextField](/docs/modules/skip-ui/#supported-swiftui) | TextField with `.roundedBorder`, `.plain`, custom styles | [TextFieldPlayground.swift](https://source.skip.dev/skipapp-showcase-fuse/blob/main/Sources/ShowcaseFuse/TextFieldPlayground.swift) |
| [SecureField](/docs/modules/skip-ui/#supported-swiftui) | SecureField with prompts, disabled states | [SecureFieldPlayground.swift](https://source.skip.dev/skipapp-showcase-fuse/blob/main/Sources/ShowcaseFuse/SecureFieldPlayground.swift) |
| [TextEditor](/docs/modules/skip-ui/#supported-swiftui) | Multi-line text editing | [TextEditorPlayground.swift](https://source.skip.dev/skipapp-showcase-fuse/blob/main/Sources/ShowcaseFuse/TextEditorPlayground.swift) |
| [Label](/docs/modules/skip-ui/#supported-swiftui) | Label with `.titleAndIcon`, `.titleOnly`, `.iconOnly` styles | [LabelPlayground.swift](https://source.skip.dev/skipapp-showcase-fuse/blob/main/Sources/ShowcaseFuse/LabelPlayground.swift) |
| Line Spacing | `.lineSpacing` modifier with various values | [LineSpacingPlayground.swift](https://source.skip.dev/skipapp-showcase-fuse/blob/main/Sources/ShowcaseFuse/LineSpacingPlayground.swift) |
| Tracking | `.tracking` modifier for letter spacing | [TrackingPlayground.swift](https://source.skip.dev/skipapp-showcase-fuse/blob/main/Sources/ShowcaseFuse/TrackingPlayground.swift) |
| MinimumScaleFactor | `.minimumScaleFactor` for responsive text sizing | [MinimumScaleFactorPlayground.swift](https://source.skip.dev/skipapp-showcase-fuse/blob/main/Sources/ShowcaseFuse/MinimumScaleFactorPlayground.swift) |

### Layout

Spatial arrangement of views.

| Playground | Components | Source |
|---|---|---|
| [Stacks](/docs/modules/skip-ui/#layout) | HStack, VStack, fixed vs expanding, nested stacks | [StackPlayground.swift](https://source.skip.dev/skipapp-showcase-fuse/blob/main/Sources/ShowcaseFuse/StackPlayground.swift) |
| [Spacer](/docs/modules/skip-ui/#layout) | Spacer with `minLength`, variable dimensions | [SpacerPlayground.swift](https://source.skip.dev/skipapp-showcase-fuse/blob/main/Sources/ShowcaseFuse/SpacerPlayground.swift) |
| [Frame](/docs/modules/skip-ui/#layout) | `.frame` with width, height, `.infinity`, aspect ratio | [FramePlayground.swift](https://source.skip.dev/skipapp-showcase-fuse/blob/main/Sources/ShowcaseFuse/FramePlayground.swift) |
| [Grids](/docs/modules/skip-ui/#grids) | LazyVGrid, LazyHGrid with `.adaptive`, `.flexible`, `.fixed` columns | [GridPlayground.swift](https://source.skip.dev/skipapp-showcase-fuse/blob/main/Sources/ShowcaseFuse/GridPlayground.swift) |
| [Divider](/docs/modules/skip-ui/#supported-swiftui) | Horizontal/vertical dividers, custom dimensions | [DividerPlayground.swift](https://source.skip.dev/skipapp-showcase-fuse/blob/main/Sources/ShowcaseFuse/DividerPlayground.swift) |
| [GeometryReader](/docs/modules/skip-ui/#supported-swiftui) | Size reading, safe area insets, local vs global frames | [GeometryReaderPlayground.swift](https://source.skip.dev/skipapp-showcase-fuse/blob/main/Sources/ShowcaseFuse/GeometryReaderPlayground.swift) |
| GeometryChange | `onGeometryChange` for size/position tracking | [GeometryChangePlayground.swift](https://source.skip.dev/skipapp-showcase-fuse/blob/main/Sources/ShowcaseFuse/GeometryChangePlayground.swift) |
| [SafeArea](/docs/modules/skip-ui/#safe-area) | `.ignoresSafeArea`, edge-to-edge rendering | [SafeAreaPlayground.swift](https://source.skip.dev/skipapp-showcase-fuse/blob/main/Sources/ShowcaseFuse/SafeAreaPlayground.swift) |
| [ViewThatFits](/docs/modules/skip-ui/#supported-swiftui) | Adaptive layout along horizontal/vertical axes | [ViewThatFitsPlayground.swift](https://source.skip.dev/skipapp-showcase-fuse/blob/main/Sources/ShowcaseFuse/ViewThatFitsPlayground.swift) |
| ContentMargins | `.contentMargins`, `scrollContentPlacement` | [ContentMarginsPlayground.swift](https://source.skip.dev/skipapp-showcase-fuse/blob/main/Sources/ShowcaseFuse/ContentMarginsPlayground.swift) |

### Navigation and Presentation

Screen flow and modal presentation.

| Playground | Components | Source |
|---|---|---|
| [NavigationStack](/docs/modules/skip-ui/#navigation) | NavigationStack, NavigationLink, path binding, `navigationDestination` | [NavigationStackPlayground.swift](https://source.skip.dev/skipapp-showcase-fuse/blob/main/Sources/ShowcaseFuse/NavigationStackPlayground.swift) |
| [Sheet](/docs/modules/skip-ui/#modals) | Sheet, FullScreenCover, PresentationDetent, `onDismiss` | [SheetPlayground.swift](https://source.skip.dev/skipapp-showcase-fuse/blob/main/Sources/ShowcaseFuse/SheetPlayground.swift) |
| [Alert](/docs/modules/skip-ui/#supported-swiftui) | Alert with text/secure field inputs | [AlertPlayground.swift](https://source.skip.dev/skipapp-showcase-fuse/blob/main/Sources/ShowcaseFuse/AlertPlayground.swift) |
| [ConfirmationDialog](/docs/modules/skip-ui/#supported-swiftui) | Action sheets with custom cancel, scrolling content | [ConfirmationDialogPlayground.swift](https://source.skip.dev/skipapp-showcase-fuse/blob/main/Sources/ShowcaseFuse/ConfirmationDialogPlayground.swift) |
| [ContextMenu](/docs/modules/skip-ui/#supported-swiftui) | Long-press menus with labels and destructive actions | [ContextMenuPlayground.swift](https://source.skip.dev/skipapp-showcase-fuse/blob/main/Sources/ShowcaseFuse/ContextMenuPlayground.swift) |
| [TabView](/docs/modules/skip-ui/#supported-swiftui) | Tabs with badges, custom icons, programmatic selection | [TabViewPlayground.swift](https://source.skip.dev/skipapp-showcase-fuse/blob/main/Sources/ShowcaseFuse/TabViewPlayground.swift) |
| [Toolbar](/docs/modules/skip-ui/#supported-swiftui) | ToolbarItem placement, custom bar colors, `ToolbarTitleMenu` | [ToolbarPlayground.swift](https://source.skip.dev/skipapp-showcase-fuse/blob/main/Sources/ShowcaseFuse/ToolbarPlayground.swift) |

### Data Display

Lists, scroll views, and content presentation.

| Playground | Components | Source |
|---|---|---|
| [List](/docs/modules/skip-ui/#lists) | Sections, edit actions (move/delete), refresh, badges, plain style | [ListPlayground.swift](https://source.skip.dev/skipapp-showcase-fuse/blob/main/Sources/ShowcaseFuse/ListPlayground.swift) |
| [ScrollView](/docs/modules/skip-ui/#scrolling) | ScrollViewReader, LazyVStack/LazyHStack, scroll targets, anchors | [ScrollViewPlayground.swift](https://source.skip.dev/skipapp-showcase-fuse/blob/main/Sources/ShowcaseFuse/ScrollViewPlayground.swift) |
| [Form](/docs/modules/skip-ui/#supported-swiftui) | Form with mixed control types, button styling, nested sections | [FormPlayground.swift](https://source.skip.dev/skipapp-showcase-fuse/blob/main/Sources/ShowcaseFuse/FormPlayground.swift) |
| [DisclosureGroup](/docs/modules/skip-ui/#supported-swiftui) | Expandable sections, `isExpanded` binding, nested groups | [DisclosureGroupPlayground.swift](https://source.skip.dev/skipapp-showcase-fuse/blob/main/Sources/ShowcaseFuse/DisclosureGroupPlayground.swift) |
| [Searchable](/docs/modules/skip-ui/#supported-swiftui) | `.searchable` on List, Grid, LazyVStack, `onSubmit` | [SearchablePlayground.swift](https://source.skip.dev/skipapp-showcase-fuse/blob/main/Sources/ShowcaseFuse/SearchablePlayground.swift) |

### Colors and Styling

Visual appearance customization.

| Playground | Components | Source |
|---|---|---|
| [Color](/docs/modules/skip-ui/#colors) | System colors, RGB, HSV, opacity, custom asset colors | [ColorPlayground.swift](https://source.skip.dev/skipapp-showcase-fuse/blob/main/Sources/ShowcaseFuse/ColorPlayground.swift) |
| [ColorScheme](/docs/modules/skip-ui/#colorscheme) | `.preferredColorScheme`, light/dark switching | [ColorSchemePlayground.swift](https://source.skip.dev/skipapp-showcase-fuse/blob/main/Sources/ShowcaseFuse/ColorSchemePlayground.swift) |
| Color Effects | `.brightness`, `.contrast`, `.saturation`, `.hueRotation`, `.grayscale`, `.colorInvert` | [ColorEffectsPlayground.swift](https://source.skip.dev/skipapp-showcase-fuse/blob/main/Sources/ShowcaseFuse/ColorEffectsPlayground.swift) |
| [Gradient](/docs/modules/skip-ui/#supported-swiftui) | LinearGradient, RadialGradient, EllipticalGradient | [GradientPlayground.swift](https://source.skip.dev/skipapp-showcase-fuse/blob/main/Sources/ShowcaseFuse/GradientPlayground.swift) |
| Background | `.background` with colors, gradients, shapes | [BackgroundPlayground.swift](https://source.skip.dev/skipapp-showcase-fuse/blob/main/Sources/ShowcaseFuse/BackgroundPlayground.swift) |

### Shapes and Visual Effects

Drawing, shapes, and visual modifiers.

| Playground | Components | Source |
|---|---|---|
| [Shape](/docs/modules/skip-ui/#shapes-and-paths) | Circle, Capsule, Rectangle, RoundedRectangle, Ellipse, UnevenRoundedRectangle | [ShapePlayground.swift](https://source.skip.dev/skipapp-showcase-fuse/blob/main/Sources/ShowcaseFuse/ShapePlayground.swift) |
| Border | `.border`, padding, `.clipShape` | [BorderPlayground.swift](https://source.skip.dev/skipapp-showcase-fuse/blob/main/Sources/ShowcaseFuse/BorderPlayground.swift) |
| Blur | `.blur(radius:)` on shapes and text | [BlurPlayground.swift](https://source.skip.dev/skipapp-showcase-fuse/blob/main/Sources/ShowcaseFuse/BlurPlayground.swift) |
| Shadow | `.shadow` with color, radius, x/y offset | [ShadowPlayground.swift](https://source.skip.dev/skipapp-showcase-fuse/blob/main/Sources/ShowcaseFuse/ShadowPlayground.swift) |
| BlendMode | `.blendMode` (multiply, screen, overlay, and 10+ others) | [BlendModePlayground.swift](https://source.skip.dev/skipapp-showcase-fuse/blob/main/Sources/ShowcaseFuse/BlendModePlayground.swift) |
| Mask | `.mask` with shapes, gradients, and text | [MaskPlayground.swift](https://source.skip.dev/skipapp-showcase-fuse/blob/main/Sources/ShowcaseFuse/MaskPlayground.swift) |
| Overlay | `.overlay` with colors, shapes, custom content | [OverlayPlayground.swift](https://source.skip.dev/skipapp-showcase-fuse/blob/main/Sources/ShowcaseFuse/OverlayPlayground.swift) |
| Redacted | `.redacted(reason: .placeholder)` content masking | [RedactedPlayground.swift](https://source.skip.dev/skipapp-showcase-fuse/blob/main/Sources/ShowcaseFuse/RedactedPlayground.swift) |
| ZIndex | `.zIndex` for layering control in ZStack | [ZIndexPlayground.swift](https://source.skip.dev/skipapp-showcase-fuse/blob/main/Sources/ShowcaseFuse/ZIndexPlayground.swift) |

### Images and Symbols

Image display, remote loading, and iconography.

| Playground | Components | Source |
|---|---|---|
| [Image](/docs/modules/skip-ui/#images) | Asset images (JPEG, SVG), system images, AsyncImage (remote URLs), `.aspectRatio`, `.clipShape` | [ImagePlayground.swift](https://source.skip.dev/skipapp-showcase-fuse/blob/main/Sources/ShowcaseFuse/ImagePlayground.swift) |
| [Icons](/docs/modules/skip-ui/#images) | Custom asset icons with various colors | [IconPlayground.swift](https://source.skip.dev/skipapp-showcase-fuse/blob/main/Sources/ShowcaseFuse/IconPlayground.swift) |
| [Symbol](/docs/modules/skip-ui/#system-symbols) | `Image(systemName:)` with font sizing, multiple variations | [SymbolPlayground.swift](https://source.skip.dev/skipapp-showcase-fuse/blob/main/Sources/ShowcaseFuse/SymbolPlayground.swift) |
| Graphics | `.grayscale`, image composition, rotation effects | [GraphicsPlayground.swift](https://source.skip.dev/skipapp-showcase-fuse/blob/main/Sources/ShowcaseFuse/GraphicsPlayground.swift) |

### Gestures and Interaction

Touch handling and user input.

| Playground | Components | Source |
|---|---|---|
| [Gesture](/docs/modules/skip-ui/#gestures) | TapGesture, LongPressGesture, DragGesture, MagnificationGesture, RotationGesture, `@GestureState` | [GesturePlayground.swift](https://source.skip.dev/skipapp-showcase-fuse/blob/main/Sources/ShowcaseFuse/GesturePlayground.swift) |
| Offset/Position | `.offset(x:y:)`, `.position`, coordinate visualization | [OffsetPositionPlayground.swift](https://source.skip.dev/skipapp-showcase-fuse/blob/main/Sources/ShowcaseFuse/OffsetPositionPlayground.swift) |
| Transform | `.rotation3DEffect`, `.scaleEffect` with anchors | [TransformPlayground.swift](https://source.skip.dev/skipapp-showcase-fuse/blob/main/Sources/ShowcaseFuse/TransformPlayground.swift) |
| [Haptic Feedback](/docs/modules/skip-ui/#haptics) | SensoryFeedback types (success, warning, error, impact, selection) | [HapticFeedbackPlayground.swift](https://source.skip.dev/skipapp-showcase-fuse/blob/main/Sources/ShowcaseFuse/HapticFeedbackPlayground.swift) |

### Animation and Transitions

Animated property changes and view transitions.

| Playground | Components | Source |
|---|---|---|
| [Animation](/docs/modules/skip-ui/#animation) | `.animation` modifier for opacity, blur, brightness, saturation, scale, border, corner radius | [AnimationPlayground.swift](https://source.skip.dev/skipapp-showcase-fuse/blob/main/Sources/ShowcaseFuse/AnimationPlayground.swift) |
| Transition | `.transition`, `withAnimation`, `.id()`, combined scale/opacity | [TransitionPlayground.swift](https://source.skip.dev/skipapp-showcase-fuse/blob/main/Sources/ShowcaseFuse/TransitionPlayground.swift) |

### State and Data Flow

State management, observation, and persistence.

| Playground | Components | Source |
|---|---|---|
| State | `@State`, `@Binding`, struct mutations, optional state | [StatePlayground.swift](https://source.skip.dev/skipapp-showcase-fuse/blob/main/Sources/ShowcaseFuse/StatePlayground.swift) |
| Observable | `@Observable` (Observation framework), `@Environment` | [ObservablePlayground.swift](https://source.skip.dev/skipapp-showcase-fuse/blob/main/Sources/ShowcaseFuse/ObservablePlayground.swift) |
| [Environment](/docs/modules/skip-ui/#environment-keys) | Custom EnvironmentKey, `@Environment`, `@Bindable` | [EnvironmentPlayground.swift](https://source.skip.dev/skipapp-showcase-fuse/blob/main/Sources/ShowcaseFuse/EnvironmentPlayground.swift) |
| Preferences | Custom PreferenceKey, `onPreferenceChange` | [PreferencePlayground.swift](https://source.skip.dev/skipapp-showcase-fuse/blob/main/Sources/ShowcaseFuse/PreferencePlayground.swift) |
| Storage | `@AppStorage` for Bool, Double, and Enum types | [StoragePlayground.swift](https://source.skip.dev/skipapp-showcase-fuse/blob/main/Sources/ShowcaseFuse/StoragePlayground.swift) |
| OnSubmit | `.onSubmit` with nested form submission handlers | [OnSubmitPlayground.swift](https://source.skip.dev/skipapp-showcase-fuse/blob/main/Sources/ShowcaseFuse/OnSubmitPlayground.swift) |

### Keyboard and Input

Input method customization.

| Playground | Components | Source |
|---|---|---|
| Keyboard | `.keyboardType`, `.autocorrectionDisabled`, `.scrollDismissesKeyboard`, `.submitLabel`, `.textInputAutocapitalization` | [KeyboardPlayground.swift](https://source.skip.dev/skipapp-showcase-fuse/blob/main/Sources/ShowcaseFuse/KeyboardPlayground.swift) |
| FocusState | `@FocusState` with boolean and enum bindings, programmatic focus | [FocusStatePlayground.swift](https://source.skip.dev/skipapp-showcase-fuse/blob/main/Sources/ShowcaseFuse/FocusStatePlayground.swift) |

### System Integration

Platform features accessible through SwiftUI.

| Playground | Components | Source |
|---|---|---|
| ScenePhase | `@Environment(\.scenePhase)` monitoring (active, background, inactive) | [ScenePhasePlayground.swift](https://source.skip.dev/skipapp-showcase-fuse/blob/main/Sources/ShowcaseFuse/ScenePhasePlayground.swift) |
| [Localization](/docs/modules/skip-ui/#supported-swiftui) | Bundle localizations, `LocalizedStringResource`, locale-aware date formatting | [LocalizationPlayground.swift](https://source.skip.dev/skipapp-showcase-fuse/blob/main/Sources/ShowcaseFuse/LocalizationPlayground.swift) |
| Accessibility | `.accessibilityLabel`, `.accessibilityValue`, `.accessibilityAddTraits`, `.accessibilityHidden` | [AccessibilityPlayground.swift](https://source.skip.dev/skipapp-showcase-fuse/blob/main/Sources/ShowcaseFuse/AccessibilityPlayground.swift) |
| Link | `Link`, `@Environment(\.openURL)`, `OpenURLAction` | [LinkPlayground.swift](https://source.skip.dev/skipapp-showcase-fuse/blob/main/Sources/ShowcaseFuse/LinkPlayground.swift) |
| ShareLink | `ShareLink` with text and URL sharing, subject/message | [ShareLinkPlayground.swift](https://source.skip.dev/skipapp-showcase-fuse/blob/main/Sources/ShowcaseFuse/ShareLinkPlayground.swift) |
| Pasteboard | `UIPasteboard.general` for copy/paste operations | [PasteboardPlayground.swift](https://source.skip.dev/skipapp-showcase-fuse/blob/main/Sources/ShowcaseFuse/PasteboardPlayground.swift) |
| Timer | Timer-based updates and scheduling | [TimerPlayground.swift](https://source.skip.dev/skipapp-showcase-fuse/blob/main/Sources/ShowcaseFuse/TimerPlayground.swift) |

### Framework Integrations

Playgrounds that demonstrate optional Skip framework libraries beyond core SkipUI.

| Playground | Framework | What it demonstrates | Source |
|---|---|---|---|
| Video Player | [SkipAV](/docs/modules/skip-av) | VideoPlayer with local, remote, and HLS sources; looping | [VideoPlayerPlayground.swift](https://source.skip.dev/skipapp-showcase-fuse/blob/main/Sources/ShowcaseFuse/VideoPlayerPlayground.swift) |
| Lottie Animation | [SkipMotion](/docs/modules/skip-motion) | Lottie playback, speed control, loop modes, progress scrubbing | [LottiePlayground.swift](https://source.skip.dev/skipapp-showcase-fuse/blob/main/Sources/ShowcaseFuse/LottiePlayground.swift) |
| WebView | [SkipWeb](/docs/modules/skip-web) | WebEngine, navigation, JavaScript evaluation | [WebViewPlayground.swift](https://source.skip.dev/skipapp-showcase-fuse/blob/main/Sources/ShowcaseFuse/WebViewPlayground.swift) |
| WebBrowser | [SkipKit](/docs/modules/skip-kit) | Embedded/system browser launch, custom actions | [WebBrowserPlayground.swift](https://source.skip.dev/skipapp-showcase-fuse/blob/main/Sources/ShowcaseFuse/WebBrowserPlayground.swift) |
| Web Auth Session | [SkipAuthenticationServices](/docs/modules/skip-authentication-services) | OAuth-style web authentication, callback URL parsing | [WebAuthenticationSessionPlayground.swift](https://source.skip.dev/skipapp-showcase-fuse/blob/main/Sources/ShowcaseFuse/WebAuthenticationSessionPlayground.swift) |
| Document/Media Pickers | [SkipKit](/docs/modules/skip-kit) | Document and media picking, camera integration | [DocumentPickerPlayground.swift](https://source.skip.dev/skipapp-showcase-fuse/blob/main/Sources/ShowcaseFuse/DocumentPickerPlayground.swift) |
| Keychain | [SkipKeychain](/docs/modules/skip-keychain) | Keychain read/write, key management | [KeychainPlayground.swift](https://source.skip.dev/skipapp-showcase-fuse/blob/main/Sources/ShowcaseFuse/KeychainPlayground.swift) |
| Notifications | [SkipNotify](/docs/modules/skip-notify) | Push permission, local notifications | [NotificationPlayground.swift](https://source.skip.dev/skipapp-showcase-fuse/blob/main/Sources/ShowcaseFuse/NotificationPlayground.swift) |
| SQL | [SkipSQL](/docs/modules/skip-sql) | SQLite CRUD operations, observable database list | [SQLPlayground.swift](https://source.skip.dev/skipapp-showcase-fuse/blob/main/Sources/ShowcaseFuse/SQLPlayground.swift) |
| Map | MapKit (iOS) / [Google Maps Compose](https://developers.google.com/maps/documentation/android-sdk/maps-compose) (Android) | Map display with coordinates, platform-specific rendering | [MapPlayground.swift](https://source.skip.dev/skipapp-showcase-fuse/blob/main/Sources/ShowcaseFuse/MapPlayground.swift) |
| Sensors | [SkipDevice](/docs/modules/skip-device) | Accelerometer, gyroscope, magnetometer, barometer, location | [SensorsPlayground.swift](https://source.skip.dev/skipapp-showcase-fuse/blob/main/Sources/ShowcaseFuse/SensorsPlayground.swift) |

### Android-Specific Integration

These playgrounds demonstrate Skip's escape hatches for accessing native Android APIs from SwiftUI.

| Playground | Technique | Source |
|---|---|---|
| [Compose](/docs/modules/skip-ui/#composeview) | `ComposeView` with custom `ContentComposer` for direct Jetpack Compose rendering | [ComposePlayground.swift](https://source.skip.dev/skipapp-showcase-fuse/blob/main/Sources/ShowcaseFuse/ComposePlayground.swift) |
| [Modifiers](/docs/modules/skip-ui/#composemodifier) | `.composeModifier()` for applying native Compose modifiers, custom `ViewModifier` | [ModifierPlayground.swift](https://source.skip.dev/skipapp-showcase-fuse/blob/main/Sources/ShowcaseFuse/ModifierPlayground.swift) |

### Game

| Playground | Description | Source |
|---|---|---|
| Easter Egg | A complete Block Blast game with drag-and-drop piece placement, line clearing, combos, scoring, and haptic feedback. Demonstrates complex state management with `@Observable`, `GeometryReader` for board sizing, and `DragGesture` with global coordinate space. | [GamePlayground.swift](https://source.skip.dev/skipapp-showcase-fuse/blob/main/Sources/ShowcaseFuse/GamePlayground.swift) |

## Notable Techniques

### Platform Branching with `#if os(Android)`

Several playgrounds demonstrate how to provide platform-specific implementations when SwiftUI alone is insufficient. The [MapPlayground](https://source.skip.dev/skipapp-showcase-fuse/blob/main/Sources/ShowcaseFuse/MapPlayground.swift) is the clearest example: it uses SwiftUI `Map` on iOS and `ComposeView` with Google Maps Compose on Android, sharing the same coordinate data.

### ComposeView for Native Android UI

The [ComposePlayground](https://source.skip.dev/skipapp-showcase-fuse/blob/main/Sources/ShowcaseFuse/ComposePlayground.swift) shows how to embed raw Jetpack Compose code within a SwiftUI hierarchy using `ComposeView` and a custom `ContentComposer`. This is Skip's escape hatch for rendering Android-native UI that has no SwiftUI equivalent. The [MapPlayground](https://source.skip.dev/skipapp-showcase-fuse/blob/main/Sources/ShowcaseFuse/MapPlayground.swift) uses this technique in production to embed Google Maps.

### Custom ViewModifier

The [ModifierPlayground](https://source.skip.dev/skipapp-showcase-fuse/blob/main/Sources/ShowcaseFuse/ModifierPlayground.swift) demonstrates reusable `ViewModifier` implementations (like `DismissModifier`) and the `.composeModifier()` API for applying native Compose modifiers on Android. This is useful for Material 3 theming or Android-specific visual effects.

### Complex State Management

The [GamePlayground](https://source.skip.dev/skipapp-showcase-fuse/blob/main/Sources/ShowcaseFuse/GamePlayground.swift) demonstrates managing complex interactive state across a game board, piece tray, and score system using `@Observable` and multiple `@State` variables. It shows how `DragGesture` with `.global` coordinate space, `GeometryReader` for layout measurement, and `DispatchQueue.main.asyncAfter` for timed effects all work cross-platform.

### Sensor Visualization

The [SensorsPlayground](https://source.skip.dev/skipapp-showcase-fuse/blob/main/Sources/ShowcaseFuse/SensorsPlayground.swift) demonstrates `AsyncThrowingStream` consumption from device sensors using the `.task(id:)` modifier pattern. Each sensor card starts/stops monitoring based on a boolean toggle, and the task automatically cancels when the toggle changes. Location monitoring includes runtime permission handling via `PermissionManager`.

### Gradle Dependencies in skip.yml

The Map playground requires an Android Gradle dependency for Google Maps Compose. This is configured in [Sources/ShowcaseFuse/Skip/skip.yml](https://source.skip.dev/skipapp-showcase-fuse/blob/main/Sources/ShowcaseFuse/Skip/skip.yml):

```yaml
build:
  contents:
    - block: 'dependencies'
      contents:
        - 'implementation("com.google.maps.android:maps-compose:6.4.1")'
```

## Building

This project is both a stand-alone Swift Package Manager module,
as well as an Xcode project that builds and transpiles the project
into a Kotlin Gradle project for Android using the Skip plugin.

## Testing

The module can be tested using the standard `swift test` command
or by running the test target for the macOS destination in Xcode,
which will run the Swift tests as well as the transpiled
Kotlin JUnit tests in the Robolectric Android simulation environment.

Parity testing can be performed with `skip test`,
which will output a table of the test results for both platforms.

## Running

Xcode and Android Studio must be downloaded and installed in order to
run the app in the iOS simulator / Android emulator.
An Android emulator must already be running, which can be launched from
Android Studio's Device Manager.

To run both the Swift and Kotlin apps simultaneously,
launch the ShowcaseFuseApp target from Xcode.
A build phases runs the "Launch Android APK" script that
will deploy the transpiled app a running Android emulator or connected device.
Logging output for the iOS app can be viewed in the Xcode console, and in
Android Studio's logcat tab for the transpiled Kotlin app.
