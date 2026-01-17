---
title: Localization
layout: docs
permalink: /docs/components/localization/
component: Localization
---

Skip support for [SwiftUI Localization](https://developer.apple.com/documentation/swiftui/preparing-views-for-localization) on Android.
Consult the SkipUI module for a [complete list of supported SwiftUI](/docs/modules/skip-ui/#supported-swiftui).

The following example screens and source code is from SkipUI's
[Showcase](/docs/samples/skipapp-showcase/) sample app
[`LocalizationPlayground.swift`](https://github.com/skiptools/skipapp-showcase/tree/main/Sources/Showcase/LocalizationPlayground.swift)


<div class="showcase-screenshot-container">
<img alt="Android screenshot for Localization component (light mode)" src="http://assets.skip.dev/showcase/Localization-android-light_framed.png" />
<img alt="iPhone screenshot for Localization component (light mode)" src="http://assets.skip.dev/showcase/Localization-iphone-light_framed.png" />
<img alt="iPhone screenshot for Localization component (dark mode)" src="http://assets.skip.dev/showcase/Localization-iphone-dark_framed.png" />
<img alt="Android screenshot for Localization component (dark mode)" src="http://assets.skip.dev/showcase/Localization-android-dark_framed.png" />
</div>


```swift
import SwiftUI
import Foundation

struct DemoPreviewView : View {
    var body: some View {
        VStack(spacing: 16.0) {
            Text("XYZ")
            Text("XYZ")
            Text("XYZ")
            Text("XYZ")
            Text("XYZ")
        }
    }
}

struct LocalizationPlayground: View {
    @Environment(\.locale) var currentLocale

    /// The list of available localizations in the current bundle
    static let bundleLocalizations: [Locale] = Bundle.module.localizations.map({ Locale(identifier: $0) })

    var body: some View {
        List(Self.bundleLocalizations.sorted(by: { $0.identifier < $1.identifier }), id: \.self) { type in
            NavigationLink(type.localizedNavigationTitle, value: type)
        }
        .navigationDestination(for: Locale.self) { locale in
            LocalizationPreview().environment(\.locale, locale)
        }
    }
}

struct LocalizationPreview: View {
    @Environment(\.locale) var currentLocale
    @State var date = Date.now

    func formatter(dateStyle: DateFormatter.Style, timeStyle: DateFormatter.Style) -> DateFormatter {
        let fmt = DateFormatter()
        fmt.dateStyle = dateStyle
        fmt.timeStyle = timeStyle
        fmt.locale = self.currentLocale
        return fmt
    }

    var body: some View {
        VStack {
            Text("Welcome", bundle: .module)
                .font(.largeTitle)
            Text(verbatim: currentLocale.localizedString(forLanguageCode: currentLocale.languageCode ?? currentLocale.identifier) ?? "")
                .font(.title)
            Text(verbatim: currentLocale.localizedString(forRegionCode: currentLocale.regionCode ?? currentLocale.identifier) ?? "")
                .font(.title2)
            Text(verbatim: currentLocale.localizedString(forScriptCode: currentLocale.scriptCode ?? currentLocale.identifier) ?? "")
                .font(.title2)

            Divider()

            Text(verbatim: formatter(dateStyle: .full, timeStyle: .short).string(from: date))
            Text(verbatim: formatter(dateStyle: .none, timeStyle: .full).string(from: date))

            Text(verbatim: formatter(dateStyle: .long, timeStyle: .none).string(from: date))
            Text(verbatim: formatter(dateStyle: .none, timeStyle: .long).string(from: date))

            Text(verbatim: formatter(dateStyle: .medium, timeStyle: .none).string(from: date))
            Text(verbatim: formatter(dateStyle: .none, timeStyle: .medium).string(from: date))

            Text(verbatim: formatter(dateStyle: .short, timeStyle: .none).string(from: date))
            Text(verbatim: formatter(dateStyle: .none, timeStyle: .short).string(from: date))

            DatePicker("", selection: $date)
        }
        .navigationTitle(currentLocale.localizedString(forIdentifier: currentLocale.identifier) ?? "???")
    }
}

extension Locale {
    /// The title of the language as the current locale language's name for the locale followed by the language name in the language itself. E.g., `French: français`
    var localizedNavigationTitle: String {
        (Locale.current.localizedString(forIdentifier: identifier) ?? "") + ": " + (localizedString(forIdentifier: identifier) ?? "")
    }
}
```

