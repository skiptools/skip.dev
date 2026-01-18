---
title:  "Nested Dropdown Menus in Compose"
date:   2024-01-11
tags: [compose, jetpack-compose, android, ui-components, dropdown-menu, swiftui, skipui, kotlin]
layout: post
permalink: /blog/nested-menus-in-compose/
author: Abe White
---

Skip's open-source [SkipUI library](https://source.skip.tools/skip-ui) implements the SwiftUI API for Android. To do so, SkipUI leverages [Compose](https://developer.android.com/jetpack/compose), Android's own modern, declarative UI framework.

While implementing SwiftUI's `Menu`, we discovered that Compose doesn't build in support for nested dropdown menus. Googling revealed that we weren't the only devs wondering how to present a sub-menu from a Compose menu item, but [the answers we found](https://stackoverflow.com/questions/69456367/what-is-the-better-or-easier-way-to-create-nested-menus-in-jetpack-compose) didn't meet our needs. The code below represents our own simple, general solution to nested dropdown menus in Compose.

*Note: SkipUI's implementation is tied to SwiftUI internals, so this is an untested and simplified port of the actual code.*

```kotlin
// Simple menu model. You could expand this for icons, section
// headings, dividers, etc
class MenuModel(title: String, val items: List<MenuItem>): MenuItem(title, {})
open class MenuItem(val title: String, val action: () -> Unit)

// Display a menu model, whose items can include nested menu models
@Composable fun DropdownMenu(menu: MenuModel) {
    val isMenuExpanded = remember { mutableStateOf(false) }
    val nestedMenu = remember { mutableStateOf<MenuModel?>(null) }
    val coroutineScope = rememberCoroutineScope()

    // Action to replace the currently-displayed menu with the
    // given one on item selection. The hardcoded delays are
    // unfortunate but improve the user experience
    val replaceMenu: (MenuModel?) -> Unit = { menu ->
        coroutineScope.launch {
            // Allow selection animation before dismiss
            delay(200)
            isMenuExpanded.value = false
            // Prevent flash of primary menu on nested dismiss
            delay(100)
            nestedMenu.value = null
            if (menu != null) {
                nestedMenu.value = menu
                isMenuExpanded.value = true
            }
        }
    }

    DropdownMenu(expanded = isMenuExpanded.value, onDismissRequest = {
        isMenuExpanded.value = false
        coroutineScope.launch {
            // Prevent flash of primary menu on nested dismiss
            delay(100)
            nestedMenu.value = null
        }
    }) {
        for (item in menu.items) {
            DropdownMenuItem(text = { Text(item.title) }, onClick = {
                item.action()
                replaceMenu(item as? MenuModel)
            })
        }
    }
}
```

You can see this in action in the [Skip Showcase app's](https://github.com/skiptools/skipapp-showcase) menu playground:

<img style="height: 400px;" alt="Nested dropdown menus in the Skip Showcase app" src="https://assets.skip.dev/images/compose-nested-menus.gif" />

We hope that you find this useful! If you have questions or suggestions for improvements, please reach out to us on Mastodon [@skiptools@mas.to](https://mas.to/@skiptools), via chat [skiptools.slack.com](https://skiptools.slack.com), or in our [discussion forums](http://community.skip.tools).
