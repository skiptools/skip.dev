---
title: Searchable
layout: docs
permalink: /docs/components/searchable/
component: Searchable
---

Skip support for [SwiftUI.View.searchable](https://developer.apple.com/documentation/swiftui/adding-a-search-interface-to-your-app) on Android.
Consult the SkipUI module for a [complete list of supported SwiftUI](/docs/modules/skip-ui/#supported-swiftui).

The following example screens and source code is from SkipUI's
[Showcase](/docs/samples/skipapp-showcase/) sample app
[`SearchablePlayground.swift`](https://github.com/skiptools/skipapp-showcase/tree/main/Sources/Showcase/SearchablePlayground.swift)


<div class="showcase-screenshot-container">
<img alt="Android screenshot for Searchable component (light mode)" src="http://assets.skip.dev/showcase/Searchable-android-light_framed.png" />
<img alt="iPhone screenshot for Searchable component (light mode)" src="http://assets.skip.dev/showcase/Searchable-iphone-light_framed.png" />
<img alt="iPhone screenshot for Searchable component (dark mode)" src="http://assets.skip.dev/showcase/Searchable-iphone-dark_framed.png" />
<img alt="Android screenshot for Searchable component (dark mode)" src="http://assets.skip.dev/showcase/Searchable-android-dark_framed.png" />
</div>


```swift
import Foundation
import SwiftUI

enum SearchablePlaygroundType: String, CaseIterable {
    case list
    case plainList
    case submit
    case isSearching

    var title: String {
        switch self {
        case .list:
            return "List"
        case .plainList:
            return "Plain style"
        case .submit:
            return "Submit"
        case .isSearching:
            return "isSearching"
        }
    }
}

struct SearchablePlayground: View {
    var body: some View {
        List(SearchablePlaygroundType.allCases, id: \.self) { type in
            NavigationLink(type.title, value: type)
        }
        .toolbar {
            PlaygroundSourceLink(file: "SearchablePlayground.swift")
        }
        .navigationDestination(for: SearchablePlaygroundType.self) {
            switch $0 {
            case .list:
                ListSearchablePlayground()
                    .navigationTitle($0.title)
            case .plainList:
                PlainListSearchablePlayground()
                    .navigationTitle($0.title)
            case .submit:
                SubmitSearchablePlayground()
                    .navigationTitle($0.title)
            case .isSearching:
                IsSearchingSearchablePlayground()
                    .navigationTitle($0.title)
            }
        }
    }
}

struct ListSearchablePlayground: View {
    @State var searchText = ""

    var body: some View {
        List {
            ForEach(matchingAnimals(), id: \.self) {
                Text($0)
            }
        }
        .searchable(text: $searchText)
    }

    func matchingAnimals() -> [String] {
        return animals().filter {
            $0.lowercased().starts(with: searchText.lowercased().trimmingCharacters(in: .whitespacesAndNewlines))
        }
    }
}

struct PlainListSearchablePlayground: View {
    @State var searchText = ""

    var body: some View {
        List {
            ForEach(matchingAnimals(), id: \.self) {
                Text($0)
            }
        }
        .listStyle(.plain)
        .searchable(text: $searchText)
    }

    func matchingAnimals() -> [String] {
        return animals().filter {
            $0.lowercased().starts(with: searchText.lowercased().trimmingCharacters(in: .whitespacesAndNewlines))
        }
    }
}

struct SubmitSearchablePlayground: View {
    @State var searchText = ""
    @State var matchingAnimals = animals()

    var body: some View {
        List {
            ForEach(matchingAnimals, id: \.self) {
                Text($0)
            }
        }
        .searchable(text: $searchText)
        .onSubmit(of: .search) {
            matchingAnimals = animals().filter {
                $0.lowercased().starts(with: searchText.lowercased().trimmingCharacters(in: .whitespacesAndNewlines))
            }
        }
    }
}

struct IsSearchingSearchablePlayground: View {
    @State var searchText = ""

    var body: some View {
        IsSearchingView()
            .searchable(text: $searchText)
    }

    private struct IsSearchingView: View {
        @Environment(\.isSearching) var isSearching

        var body: some View {
            List {
                Text("isSearching:")
                if isSearching {
                    Text("YES").foregroundStyle(.green)
                } else {
                    Text("NO").foregroundStyle(.red)
                }
            }
        }
    }
}

func animals() -> [String] {
    return [
        "Alligator",
        "Ant",
        "Bat",
        "Bear",
        "Cat",
        "Cheetah",
        "Dog",
        "Dolphin",
        "Eagle",
        "Elephant",
        "Flamingo",
        "Fox",
        "Goat",
        "Gorilla",
        "Hippo",
        "Horse",
        "Ibis",
        "Insect",
        "Jackrabbit",
        "Jellyfish",
        "Kangaroo",
        "Kingfisher",
        "Lampfish",
        "Llama",
        "Manitee",
        "Monkey",
        "Narwhal",
        "Nightingale",
        "Octopus",
        "Ocelot",
        "Penguin",
        "Pufferfish",
        "Quahog",
        "Quail",
        "Rat",
        "Rhinocerous",
        "Snake",
        "Squirrel",
        "Tarantula",
        "Turtle",
        "Unicorn",
        "Vole",
        "Vulture",
        "Walrus",
        "Whale",
        "Yak",
        "Zebra"
    ]
}
```

