---
title: WebView
description: Documentation for WebView fetched from GitHub.
note: This documentation section is derived from the GitHub README.md source using the scripts/sync-modules.mjs script. Do not make edits to the file here, change it there.
editUrl: https://github.com/skiptools/skip-web/edit/main/README.md
---

:::note[Source Repository <a href='https://github.com/skiptools/skip-web/releases' alt='Releases for skip-web'><img decoding='async' loading='lazy' alt='Releases for skip-web' src='https://img.shields.io/github/v/release/skiptools/skip-web.svg?style=flat' /></a>]{icon="github"}
This framework is available at [github.com/skiptools/skip-web](https://github.com/skiptools/skip-web) and can be checked out and improved locally as described in the [Contribution Guide](/docs/contributing/#local-libraries).
:::


SkipWeb provides two ways to display web content in Skip Lite apps:

- **[WebView](#webview-customizable-embedded-web-browser)** — A fully customizable embedded browser for app-integrated web content. Supports JavaScript execution, script messages, navigation control, scroll delegates, snapshots, popups, persistent tab engines, cookies/storage, profiles, and content blockers. Backed by `WKWebView` on iOS and `android.webkit.WebView` on Android.

- **[WebBrowser](#webbrowser-lightweight-in-app-browser)** — A lightweight View modifier that opens a URL in the platform's native in-app browser (`SFSafariViewController` on iOS, Chrome Custom Tabs on Android). Ideal for external links where you want a polished browsing experience with minimal code.

## When to use `openWebBrowser` vs `WebView`

| | `openWebBrowser` | `WebView` |
| --- | --- | --- |
| **Best for** | Links to external content: docs, terms of service, blog posts, OAuth flows | App-integrated web content where you need programmatic control |
| **Browser chrome** | Provided by the OS (address bar, back/forward, share) | You build your own toolbar and controls |
| **JavaScript access** | None — the page runs in a sandboxed browser | Full `evaluateJavaScript` support |
| **Navigation control** | None — the user navigates freely within the browser | Programmatic back/forward, reload, URL changes |
| **Cookie/session sharing** | Shares the user's browser cookies and autofill | Uses the app's WebView cookie store (shared across WebViews by default; not the same store as Safari/Chrome) |
| **Customization** | Custom share-sheet actions | Full layout control, scroll delegates, snapshot API |

Use `openWebBrowser` when you want to send the user to a web page with minimal code and maximum platform-native UX. Use `WebView` when you need to embed web content as part of your app's UI with programmatic control.

## Requirements

The package currently targets Apple platforms starting at iOS 17, macOS 14, tvOS 17, watchOS 10, and Mac Catalyst 17.

Current package dependencies are:

- `skip` from `1.8.9`
- `skip-ui` from `1.51.3`
- when `SKIP_BRIDGE` is enabled, `skip-bridge` in `0.0.0..<2.0.0` and `skip-fuse-ui` from `1.14.5`

## WebView: Customizable Embedded Web Browser

SkipWeb provides an embedded WebView for Skip Lite transpiled Swift.
On iOS it uses a [WKWebView](https://developer.apple.com/documentation/webkit/wkwebview)
and on Android it uses an [android.webkit.WebView](https://developer.android.com/develop/ui/views/layout/webapps/webview).

A simple example of using an embedded WebView with a static URL can be seen:

```swift
import Foundation
import SwiftUI
import SkipWeb

struct EmbeddedWebView : View {
    let url: URL

    var body: some View {
        WebView(url: url)
    }
}
```


### Customization

The [`WebView`](https://source.skip.dev/skip-web/blob/main/Sources/SkipWeb/WebView.swift) is backed by a
[`WebEngine`](https://source.skip.dev/skip-web/blob/main/Sources/SkipWeb/WebEngine.swift).
It can be configured with a [`WebEngineConfiguration`](https://source.skip.dev/skip-web/blob/main/Sources/SkipWeb/WebEngine.swift) instance. For example:

```swift
import Foundation
import SwiftUI
import SkipWeb

struct ConfigurableWebView : View {
    @State private var configuration = WebEngineConfiguration()
    @State private var navigator = WebViewNavigator(initialURL: URL(string: "https://skip.dev")!)
    @State private var state = WebViewState()

    var body: some View {
        WebView(configuration: configuration, navigator: navigator, state: $state)
    }
}

```

The main configuration knobs are:

```swift
let config = WebEngineConfiguration(
    javaScriptEnabled: true,
    javaScriptCanOpenWindowsAutomatically: false,
    allowsBackForwardNavigationGestures: true,
    allowsPullToRefresh: true,
    allowsInlineMediaPlayback: true,
    dataDetectorsEnabled: true,
    isScrollEnabled: true,
    pageZoom: 1.0,
    isOpaque: true,
    customUserAgent: nil,
    profile: .default,
    userScripts: [],
    scriptMessageHandlerNames: [],
    scriptMessageDelegate: nil,
    schemeHandlers: [:],
    uiDelegate: nil,
    navigationDelegate: nil,
    contentBlockers: nil
)
```

`messageHandlers` is still accepted for source compatibility, but it is deprecated. Prefer `scriptMessageHandlerNames` plus `scriptMessageDelegate` for new code.

`WebViewState.url` is the preferred typed URL state. `pageURL` is still present for source compatibility, but is deprecated:

```swift
if let currentURL = state.url {
    print(currentURL.absoluteString)
}
```

Profile selection is configured on `WebEngineConfiguration`:

```swift
let config = WebEngineConfiguration(
    profile: .named("account-a")
)
```

Use `.ephemeral` when the web view should avoid the normal persistent website data store:

```swift
let config = WebEngineConfiguration(
    profile: .ephemeral
)
```

On iOS this uses `WKWebsiteDataStore.nonPersistent()`. On Android this requires AndroidX WebKit
`WebViewFeature.MULTI_PROFILE`; SkipWeb creates a generated named profile for the engine so
cookies and storage do not share the default WebView store.

`WebViewNavigator` can keep a warm `WebEngine` and reuse it across view recreation.
When the same navigator is rebound to an engine that already has content/history, `initialURL`/`initialHTML` are not reloaded.
This lets apps preserve page state when navigating away and back with the same navigator instance.

### Managing multiple live tabs

If you are building a tabbed browser, `persistentWebViewID` is the mechanism you need to manage multiple live tabs.

Think of it as a stable parking spot for one browser engine. Each tab gets its own ID, and `SkipWeb`
reuses the same cached `WebEngine` whenever a `WebView` is mounted again with that ID.

```swift
WebView(
    configuration: configuration,
    navigator: navigator,
    url: tab.url,
    state: $state,
    persistentWebViewID: tab.id.uuidString
)
```

Use a stable per-tab identifier when engine identity should be tied to a tab ID instead of only
to a `WebViewNavigator` instance. A stable navigator can still preserve one warm engine across
view recreation; `persistentWebViewID` is for managing multiple live engines by explicit tab ID.

`SkipWeb` only provides the reuse and eviction primitives. The host browser feature should decide how many
tab engines stay warm, when engines are created lazily, and when to purge them.

When a tab closes or a background tab should no longer keep its engine alive, remove it explicitly:

```swift
WebView.removePersistentWebView(id: tab.id.uuidString)
```

For bulk purges, such as memory pressure or session changes, use:

```swift
WebView.removePersistentWebViews(ids: tabIDs.map(\.uuidString))
```

Content blockers are also configured on `WebEngineConfiguration`:

```swift
let config = WebEngineConfiguration(
    contentBlockers: WebContentBlockerConfiguration(
        iOSRuleListPaths: [
            Bundle.main.path(forResource: "content-blockers", ofType: "json")!
        ],
        whitelistedDomains: [
            "example.com",
            "*.example.org"
        ],
        popupWhitelistedSourceDomains: [
            "example.com"
        ],
        androidMode: .custom(MyAndroidContentBlockingProvider())
    )
)

_ = await config.iOSPrepareContentBlockers()
```

On Android, `AndroidCosmeticRule` can now carry current-frame guards directly:

```swift
AndroidCosmeticRule(
    hiddenSelectors: ["#subframe-ad"],
    urlFilterPattern: ".*\\/subframe\\.html",
    ifDomainList: ["127.0.0.1"],
    frameScope: .allFrames,
    preferredTiming: .documentStart
)
```

Think of it as "return selectors, render CSS once at the edge". `SkipWeb` installs the rule at document start for all frames, then the injected script checks the frame's own URL and host before turning the matching selectors into `display: none !important`. That is what makes subframe cosmetic blocking work on Android without needing a second late injection path.

For Android navigation callbacks, prefer `WebEngineConfiguration.navigationDelegate`.
`WebEngine.engineDelegate` remains available as a deprecated compatibility escape hatch, but SkipWeb now keeps blocker enforcement on an internal engine-owned `WebViewClient`.

For example, you can use `shouldOverrideURLLoading` to hand `mailto:` links or app deep links to native code before the `WebView` navigates:

```swift
final class AppNavigationDelegate: SkipWebNavigationDelegate {
    func webEngine(_ engine: WebEngine, shouldOverrideURLLoading url: URL) -> Bool {
        if url.scheme == "mailto" {
            openSystemMailComposer(url)
            return true
        }
        if url.scheme == "myapp" {
            routeIntoNativeScreen(url)
            return true
        }
        return false
    }
}

let config = WebEngineConfiguration()
config.navigationDelegate = AppNavigationDelegate()
```

Navigation APIs:

- `load(url:)` is fire-and-forget and logs load failures.
- `loadOrThrow(url:)` is async/throwing and should be used when callers need explicit error handling (including `WebProfileError` preflight failures).

### JavaScript

JavaScript can be executed against the browser with:

```swift
let json: String? = try await navigator.evaluateJavaScript(javaScriptInput)
```

The JSON string that is returned may be an object, or may be 
fragmentary (that is, a top-level string or number, null, or array), so care
should be taken when attempting to deserialize it.

**Note**: since the browser's JavaScript engines are quite different
(V8 and Blink on Android versus JavaScriptCore and WebKit on iOS), results
from script execution are expected to vary somewhat depending on the different
quirks of the implementations.

### User Scripts and Script Messages

Use `WebViewUserScript` for scripts that should run as pages load:

```swift
let config = WebEngineConfiguration(
    userScripts: [
        WebViewUserScript(
            source: "window.appReady = true",
            injectionTime: .atDocumentStart,
            forMainFrameOnly: true
        )
    ]
)
```

On iOS this maps to `WKUserScript`. On Android, SkipWeb uses AndroidX document-start scripts when `WebViewFeature.DOCUMENT_START_SCRIPT` is available. If that feature is unavailable, document-start scripts are injected from `onPageStarted` and document-end scripts are injected from `onPageFinished`, so timing is best-effort.

For JavaScript-to-native messages, register handler names and provide a `WebViewScriptMessageDelegate`:

```swift
@MainActor
final class ScriptSink: WebViewScriptMessageDelegate {
    func webEngine(_ webEngine: WebEngine, didReceiveScriptMessage message: WebViewScriptMessage) {
        print("handler=\(message.name), body=\(message.bodyJSON)")
    }
}

let scriptSink = ScriptSink()
let config = WebEngineConfiguration(
    scriptMessageHandlerNames: ["native"],
    scriptMessageDelegate: scriptSink
)
```

JavaScript can then post through the familiar WebKit shape on both platforms:

```javascript
window.webkit.messageHandlers.native.postMessage({
  kind: "ready",
  href: window.location.href
})
```

Think of `WebViewScriptMessage` as the portable envelope around the message:

- `name` is the registered handler name.
- `bodyJSON` is the canonical payload. SkipWeb JSON-encodes posted values before crossing the Swift/Kotlin bridge.
- `sourceURL` is the sending frame URL when available.
- `isMainFrame` tells you whether the message came from the top frame when available.

A full example of a browser that can evaluate JavaScript and display
the results in a sheet can be implemented with the following View:

```swift
import SwiftUI
import SkipWeb

/// This component uses the `SkipWeb` module from https://source.skip.dev/skip-web
struct WebViewPlayground: View {
    @State var config = WebEngineConfiguration()
    @State var navigator = WebViewNavigator()
    @State var state = WebViewState()
    @State var showScriptSheet = false
    @State var javaScriptInput = "document.body.innerText"
    @State var javaScriptOutput = ""

    var body: some View {
        VStack {
            WebView(configuration: config, navigator: navigator, url: URL(string: "https://skip.dev")!, state: $state)
        }
        .toolbar {
            Button {
                navigator.goBack()
            } label: {
                Image(systemName: "arrow.left")
            }
            .disabled(!state.canGoBack)
            .accessibilityLabel(Text("Back"))

            Button {
                navigator.reload()
            } label: {
                Image(systemName: "arrow.clockwise.circle")
            }
            .accessibilityLabel(Text("Reload"))

            Button {
                navigator.goForward()
            } label: {
                Image(systemName: "arrow.forward")
            }
            .disabled(!state.canGoForward)
            .accessibilityLabel(Text("Forward"))

            Button {
                self.showScriptSheet = true
            } label: {
                Image(systemName: "ellipsis")
            }
            .accessibilityLabel(Text("Evaluate JavaScript"))
        }
        .navigationTitle(state.pageTitle ?? "WebView")
        .navigationBarTitleDisplayMode(.inline)
        .sheet(isPresented: $showScriptSheet) {
            NavigationStack {
                VStack {
                    TextField("JavaScript", text: $javaScriptInput)
                        .textFieldStyle(.roundedBorder)
                        .autocorrectionDisabled()
                        .keyboardType(.asciiCapable) // also disables smart quotes
                        .textInputAutocapitalization(.never)
                        .onSubmit(of: .text) { evaluateJavaScript() }
                        .padding()
                    Text("Output")
                        .font(.headline)
                    TextEditor(text: $javaScriptOutput)
                        .font(Font.body.monospaced())
                        .border(Color.secondary)
                        .padding()
                }
                .toolbar {
                    ToolbarItem(placement: .confirmationAction) {
                        Button("Evaluate Script") {
                            evaluateJavaScript()
                        }
                        .disabled(javaScriptInput.isEmpty)
                    }

                    ToolbarItem(placement: .cancellationAction) {
                        Button("Close", role: .cancel) {
                            showScriptSheet = false
                        }
                    }
                }
            }
        }
    }

    /// Evaluate the script specified in the sheet
    func evaluateJavaScript() {
        let navigator = self.navigator
        Task {
            var scriptResult: String = ""
            do {
                if let resultJSON = try await navigator.evaluateJavaScript(javaScriptInput) {
                    // top-level fragments are nicer to display as strings, so we try to deserialize them
                    if let topLevelString = try? JSONSerialization.jsonObject(with: resultJSON.data(using: .utf8)!, options: .fragmentsAllowed) as? String {
                        scriptResult = topLevelString
                    } else {
                        scriptResult = resultJSON
                    }
                }
            } catch {
                scriptResult = error.localizedDescription
            }
            Task { @MainActor in
                self.javaScriptOutput = scriptResult
            }
        }
    }
}
```

### Window Creation & Popups

`SkipWeb` exposes popup/window creation through `SkipWebUIDelegate` on `WebEngineConfiguration`.
This delegate API lets host apps decide whether a popup should open and which child `WebEngine` should back it.

For full API details and usage examples, see [`SkipWebUIDelegate.md`](./SkipWebUIDelegate.md).

The `createWebViewWith` callback returns a `WebEngine?`:

- Return `nil` to deny child-window creation.
- Return a child `WebEngine` to allow child-window creation.
- Without `WebEngineConfiguration.uiDelegate`, `_blank` / `window.open(...)` falls back to platform defaults:
  on iOS the popup request is denied, while on Android the current `WebView` may navigate instead of opening a child window.

JavaScript popup behavior can be configured with:

- `WebEngineConfiguration.javaScriptCanOpenWindowsAutomatically` (maps to both iOS and Android platform settings).

#### Platform callback semantics

Callbacks are platform-agnostic, but invocation source differs:

| Callback | iOS (WebKit) | Android |
| --- | --- | --- |
| `webView(_:createWebViewWith:platformContext:)` | Called from `WKUIDelegate.createWebViewWith` | Called from `WebChromeClient.onCreateWindow` |
| `webViewDidClose(_:child:)` | Called from `WKUIDelegate.webViewDidClose` | Called from `WebChromeClient.onCloseWindow` |

`WebWindowRequest.targetURL` may be `nil` on Android during `onCreateWindow`.
`PlatformCreateWindowContext` aliases `WebKitCreateWindowParams` on iOS and `AndroidCreateWindowParams` on Android.

#### iOS WebKit popup contract

When handling iOS popups through `WKUIDelegate.createWebViewWith`, WebKit requires that the returned child `WKWebView` be initialized with the exact `WKWebViewConfiguration` provided by WebKit for that callback.

If this contract is violated, WebKit can raise `NSInternalInconsistencyException` with:
`Returned WKWebView was not created with the given configuration.`

SkipWeb validates this contract at popup creation time:
- A warning is logged when verification cannot be performed.
- An error is logged when a contract violation is detected.

For iOS parity, return a child created with `platformContext.makeChildWebEngine(...)`.
By default this mirrors the parent `WebEngineConfiguration` and inspectability on the popup child. Pass an explicit configuration only when you intentionally want the child to diverge.
This default mirroring is configuration-level. Platform delegate assignments on the returned child (`WKUIDelegate`, `WKNavigationDelegate`) are not automatically copied from the parent, so assign them explicitly if your app depends on that behavior.
Mirrored popup configuration also carries over `contentBlockers`, so children created with `makeChildWebEngine(...)` inherit the parent's blocker setup.
On Android, once a child is returned from the delegate, SkipWeb mirrors key parent web settings and inherits the parent `WebProfile` onto the child; if profile inheritance fails, popup creation is denied.

### Scroll Delegate

`SkipWeb` exposes a `WebView`-attached scroll delegate API that follows `UIScrollViewDelegate` naming where practical while remaining portable across iOS and Android.

Attach a delegate through `WebView(scrollDelegate:)`:

```swift
import SwiftUI
import SkipWeb

final class ScrollProbe: SkipWebScrollDelegate {
    func scrollViewDidEndDragging(_ scrollView: WebScrollViewProxy, willDecelerate decelerate: Bool) {
        print("ended drag at y=\(scrollView.contentOffset.y), decelerate=\(decelerate)")
    }

    func scrollViewDidEndDecelerating(_ scrollView: WebScrollViewProxy) {
        print("scroll settled at y=\(scrollView.contentOffset.y)")
    }
}

struct ScrollHostView: View {
    private let scrollDelegate = ScrollProbe()
    @State private var navigator = WebViewNavigator()

    var body: some View {
        WebView(
            navigator: navigator,
            url: URL(string: "https://example.com")!,
            scrollDelegate: scrollDelegate
        )
    }
}
```

Supported callbacks:

- `scrollViewDidScroll(_:)`
- `scrollViewWillBeginDragging(_:)`
- `scrollViewDidEndDragging(_:willDecelerate:)`
- `scrollViewWillBeginDecelerating(_:)`
- `scrollViewDidEndDecelerating(_:)`

`WebScrollViewProxy` exposes portable geometry through `WebScrollPoint` and `WebScrollSize`:

- `contentOffset`
- `contentSize`
- `visibleSize`
- `isTracking`
- `isDragging`
- `isDecelerating`
- `isScrollEnabled`

#### Platform callback semantics

| Callback | iOS | Android |
| --- | --- | --- |
| `scrollViewDidScroll(_:)` | Native `UIScrollViewDelegate.scrollViewDidScroll` | `WebView.setOnScrollChangeListener` |
| `scrollViewWillBeginDragging(_:)` | Native `UIScrollViewDelegate.scrollViewWillBeginDragging` | Inferred from touch-slop crossing, or synthesized from first scroll delta while touch is active if `ACTION_MOVE` is missed |
| `scrollViewDidEndDragging(_:willDecelerate:)` | Native `UIScrollViewDelegate.scrollViewDidEndDragging` | Inferred from touch end; `willDecelerate` is computed from fling velocity vs Android minimum fling velocity |
| `scrollViewWillBeginDecelerating(_:)` | Native `UIScrollViewDelegate.scrollViewWillBeginDecelerating` | Emitted when fling velocity crosses the deceleration threshold |
| `scrollViewDidEndDecelerating(_:)` | Native `UIScrollViewDelegate.scrollViewDidEndDecelerating` | Emitted after a short idle period (~120 ms) with no new scroll deltas during momentum |

Android deceleration is heuristic-based because `android.webkit.WebView` does not expose a direct `didEndDecelerating` callback.

#### Important differences from `UIScrollViewDelegate`

- `SkipWebScrollDelegate` intentionally exposes a focused subset: no `scrollViewDidScrollToTop(_:)`, zoom callbacks, or scrolling-animation callbacks in the public API.
- On iOS, callback timing comes directly from `UIScrollViewDelegate`; on Android, drag/deceleration lifecycle callbacks are synthesized from touch and scroll signals.
- On Android, `ACTION_CANCEL` is finalized with a short grace period so nested gesture interception does not prematurely end a drag.
- On Android, a new touch during momentum immediately ends the synthetic deceleration phase before starting a new drag sequence.
- `scrollViewDidScroll(_:)` is offset-change-driven (including programmatic scroll changes), while drag/deceleration lifecycle callbacks are user-gesture-driven.

### Snapshots

`SkipWeb` provides `WebEngine.takeSnapshot(configuration:)` and `WebViewNavigator.takeSnapshot(configuration:)`
using `SkipWebSnapshotConfiguration`, which mirrors the core `WKSnapshotConfiguration` fields:

- `rect` (`.null` captures the full visible web view bounds)
- `snapshotWidth` (output width while preserving aspect ratio)
- `afterScreenUpdates`

```swift
let snapshot = try await navigator.takeSnapshot(
    configuration: SkipWebSnapshotConfiguration(
        rect: .null,
        snapshotWidth: 240,
        afterScreenUpdates: true
    )
)

let png = snapshot.pngData
```

On Android, `afterScreenUpdates` is best-effort: SkipWeb captures on the next UI tick before drawing the `WebView` into a bitmap.
If that UI-tick wait cannot be scheduled (for example, when the view is detached), `takeSnapshot` throws `WebSnapshotError.afterScreenUpdatesUnavailable`.

## WebBrowser: Lightweight In-App Browser

For cases where you want to display a web page without the full power and complexity of an embedded `WebView`, SkipWeb provides the `View.openWebBrowser()` modifier. This opens a URL in the platform's native in-app browser:

- **iOS**: [SFSafariViewController](https://developer.apple.com/documentation/safariservices/sfsafariviewcontroller) — a full-featured Safari experience presented within your app, complete with the address bar, share sheet, and reader mode.
- **Android**: [Chrome Custom Tabs](https://developer.android.com/develop/ui/views/layout/webapps/in-app-browsing-embedded-web) — a Chrome-powered browsing experience that shares cookies, autofill, and saved passwords with the user's browser.

### Basic Usage

Open a URL in the platform's native in-app browser:

```swift
import SwiftUI
import SkipWeb

struct MyView: View {
    @State var showPage = false

    var body: some View {
        Button("Open Documentation") {
            showPage = true
        }
        .openWebBrowser(
            isPresented: $showPage,
            url: "https://skip.dev/docs",
            mode: .embeddedBrowser(params: nil)
        )
    }
}
```

### Launch in System Browser

To open the URL in the user's default browser app instead of an in-app browser:

```swift
Button("Open in Safari / Chrome") {
    showPage = true
}
.openWebBrowser(
    isPresented: $showPage,
    url: "https://skip.dev",
    mode: .launchBrowser
)
```

### Presentation Mode

By default the embedded browser slides up vertically as a modal sheet. Set `presentationMode` to `.navigation` for a horizontal slide transition that feels like a navigation push:

```swift
Button("Open with Navigation Style") {
    showPage = true
}
.openWebBrowser(
    isPresented: $showPage,
    url: "https://skip.dev",
    mode: .embeddedBrowser(params: EmbeddedParams(
        presentationMode: .navigation
    ))
)
```

| Mode | iOS | Android |
| --- | --- | --- |
| `.sheet` (default) | Full-screen cover (slides up vertically) | [Partial Custom Tabs](https://developer.chrome.com/docs/android/custom-tabs/guide-partial-custom-tabs/) bottom sheet (resizable, initially half-screen height). Falls back to full-screen if the browser does not support partial tabs. |
| `.navigation` | Navigation push (slides in horizontally) | Standard full-screen Chrome Custom Tabs launch |

**Limitations:**
- **iOS:** The `.navigation` presentation mode requires the calling view to be inside a `NavigationStack` (or `NavigationView`). If the view is not hosted in a navigation container, the modifier will have no effect.
- **Android:** In `.sheet` mode, if the user's browser does not support the Partial Custom Tabs API, the tab launches full-screen as a fallback.

### Custom Actions

Add custom actions that appear in the share sheet (iOS) or as menu items (Android):

```swift
Button("Open with Actions") {
    showPage = true
}
.openWebBrowser(
    isPresented: $showPage,
    url: "https://skip.dev",
    mode: .embeddedBrowser(params: EmbeddedParams(
        customActions: [
            WebBrowserAction(label: "Copy Link") { url in
                // handle the action with the current page URL
            },
            WebBrowserAction(label: "Bookmark") { url in
                // save the URL
            }
        ]
    ))
)
```

On iOS, custom actions appear as `UIActivity` items in the Safari share sheet. On Android, they appear as menu items in Chrome Custom Tabs (maximum 5 items).

### API Reference

```swift
/// Controls how the embedded browser is presented.
public enum WebBrowserPresentationMode {
    /// Present as a vertically-sliding modal sheet (default).
    case sheet
    /// Present as a horizontally-sliding navigation push.
    case navigation
}

/// The mode for opening a web page.
public enum WebBrowserMode {
    /// Open the URL in the system's default browser application.
    case launchBrowser
    /// Open the URL in an embedded browser within the app.
    case embeddedBrowser(params: EmbeddedParams?)
}

/// Configuration for the embedded browser.
public struct EmbeddedParams {
    public var presentationMode: WebBrowserPresentationMode
    public var customActions: [WebBrowserAction]
}

/// A custom action available on a web page.
public struct WebBrowserAction {
    public let label: String
    public let handler: (URL) -> Void
}

/// View modifier to open a web page.
extension View {
    public func openWebBrowser(
        isPresented: Binding<Bool>,
        url: String,
        mode: WebBrowserMode
    ) -> some View
}
```

## Cookies, Storage, and Cache

`SkipWeb` exposes portable browser-data APIs through `WebEngine` and `WebViewNavigator`:

- `cookies(for:)`
- `cookieHeader(for:)`
- `setCookie(_:requestURL:)`
- `applySetCookieHeaders(_:for:)`
- `clearCookies()`
- `removeData(ofTypes:modifiedSince:)`

Supporting types:

- `WebCookie` (`name`, `value`, optional `domain`/`path`/`expires`, plus `isSecure`/`isHTTPOnly`)
- `WebProfile` (`.default`, `.named(String)`, `.ephemeral`)
- `WebSiteDataType` (`cookies`, `diskCache`, `memoryCache`, `offlineWebApplicationCache`, `localStorage`, `sessionStorage`, `webSQLDatabases`, `indexedDBDatabases`)

Example:

```swift
let url = URL(string: "https://example.com/path")!

try await navigator.setCookie(
    WebCookie(name: "session", value: "abc123"),
    requestURL: url
)

let header = await navigator.cookieHeader(for: url)
try await navigator.applySetCookieHeaders(
    ["pref=1; Path=/; HttpOnly"],
    for: url
)
await navigator.clearCookies()
try await navigator.removeData(
    ofTypes: Set([.diskCache, .memoryCache, .localStorage]),
    modifiedSince: .distantPast
)
```

Platform behavior:

- Profile mapping:

| `WebProfile` | iOS data store | Android data store |
| --- | --- | --- |
| `.default` | `WKWebsiteDataStore.default()` | Default process-wide store |
| `.named("id")` | `WKWebsiteDataStore(forIdentifier: "id")` | AndroidX WebKit named profile (requires `WebViewFeature.MULTI_PROFILE`) |
| `.ephemeral` | `WKWebsiteDataStore.nonPersistent()` | Generated AndroidX WebKit named profile (requires `WebViewFeature.MULTI_PROFILE`) |

- iOS cookie scope follows the `WKWebsiteDataStore` attached to the `WKWebView`.
- Android `.default` uses `android.webkit.CookieManager` singleton.
- Android `.named("id")` requires `WebViewFeature.MULTI_PROFILE`; otherwise profile setup fails with `WebProfileError.unsupportedOnAndroid` (no fallback to default).
- Android `.ephemeral` also requires `WebViewFeature.MULTI_PROFILE`; otherwise profile setup fails with `WebProfileError.unsupportedOnAndroid` instead of falling back to the default store.
- Each Android `.ephemeral` engine receives a generated named profile. Popup child engines inherit the parent's resolved generated profile so opener and child share the same isolated store.
- On Android, always check profile support at runtime before using `.named("id")` or `.ephemeral` profiles. You can use `WebEngine.isAndroidMultiProfileSupported()` (or the underlying `WebViewFeature.isFeatureSupported(WebViewFeature.MULTI_PROFILE)` check directly).
- `cookies(for:)` returns URL-matching cookies; on Android this is best-effort because `CookieManager` reads as a cookie-header string (limited metadata).
- `setCookie(_:requestURL:)` requires either `cookie.domain` or a `requestURL` host; otherwise it throws `WebCookieError.missingCookieDomain`.
- `removeData(ofTypes:modifiedSince:)` maps to iOS `WKWebsiteDataStore.removeData`.
- On Android, `removeData` requires `modifiedSince == .distantPast` when `ofTypes` is non-empty; otherwise it throws `WebDataRemovalError.unsupportedModifiedSinceOnAndroid`.
- Android data removal is bucket-level (cookies/cache/storage), not timestamp-granular, and may clear a broader bucket than an individual requested data type.

## Content Blockers

`SkipWeb` exposes portable content-blocking hooks through `WebEngineConfiguration.contentBlockers`.

For a fuller guide with a quick integration example, whitelist behavior, and up-to-date blocker API shapes, see [`SkipWebContentBlockers.md`](./SkipWebContentBlockers.md).

Quick summary:

- `iOSRuleListPaths` points to WebKit content-blocker JSON files that are compiled into `WKContentRuleList` values and attached by SkipWeb.
- `whitelistedDomains` accepts WebKit-style entries such as `example.com` and `*.example.com`, normalizes them, and disables blocking for matching page domains across both platforms.
- `popupWhitelistedSourceDomains` is the popup-only override. A bare entry like `example.com` means "this site", so it covers both `example.com` and common subdomains such as `www.example.com`; `*.example.com` remains subdomains-only.
- `androidMode: .custom(...)` is the Android content-blocking entry point.
- `WebEngineConfiguration.iOSClearContentBlockerCache()` explicitly removes the persisted iOS compiled rule-list cache so the next install recompiles from source.
- `iOSPrepareContentBlockers()` lets apps prewarm iOS blocker setup without importing `WebKit`.
- Popup children and caller-supplied `WKWebView` instances inherit the configured blocker setup.

## Contribution

Many delegates that are provided by `WKWebView` are not yet implemented in this project,
and so deeper customization may require custom implementation work.
To implement these, you may need to fork the repository and add it to your workspace,
as described in the [Contributing guide](/docs/contributing/).
Please consider creating a [Pull Request](https://source.skip.dev/skip-web/pulls)
with features and fixes that you create, as this benefits the entire Skip community.

## Building

This project is a Swift Package Manager module that uses the
Skip plugin to build the package for both iOS and Android.
The package manifest is the source of truth for dependency versions; see [Requirements](#requirements) for the current values.

## Testing

The module can be tested using the standard `swift test` command
or by running the test target for the macOS destination in Xcode,
which will run the Swift tests as well as the transpiled
Kotlin JUnit tests in the Robolectric Android simulation environment.

Parity testing can be performed with `skip test`,
which will output a table of the test results for both platforms.

## Contributing

We welcome contributions to this package in the form of enhancements and bug fixes.

The general flow for contributing to this and any other Skip package is:

1. Fork this repository and enable actions from the "Actions" tab
2. Check out your fork locally
3. When developing alongside a Skip app, add the package to a [shared workspace](/docs/contributing) to see your changes incorporated in the app
4. Push your changes to your fork and ensure the CI checks all pass in the Actions tab
5. Add your name to the Skip [Contributor Agreement](https://source.skip.dev/clabot-config)
6. Open a Pull Request from your fork with a description of your changes

