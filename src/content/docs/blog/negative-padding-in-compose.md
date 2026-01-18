---
title:  "Negative Padding in Compose"
date:   2024-05-02
tags: [compose, jetpack-compose, android, swiftui, layout, custom-modifier, skipui, kotlin]
layout: post
permalink: /blog/negative-padding-in-compose/
author: Abe White
---

Skip's open-source [SkipUI library](https://source.skip.tools/skip-ui) implements the SwiftUI API for Android. To do so, SkipUI leverages [Compose](https://developer.android.com/jetpack/compose), Android's own modern, declarative UI framework.

The parallels between SwiftUI and Compose are striking, especially when it comes to layout. SwiftUI uses `HStack`, `VStack`, and `ZStack` for basic layout, with modifiers like `offset` and `padding` to shift or pad the resulting placement. Compose uses `Row`, `Column`, and `Box` for basic layout, and it too has `offset` and `padding` modifiers. Compose has one odd omission, however: it doesn't support negative padding! Supplying a negative value will throw an `IllegalArgumentException`.

SkipUI must support whatever SwiftUI supports, so internally we've replaced the standard Compose `padding` modifier with our own custom layout that works for both positive and negative values. We present that layout below, in case you find it useful in your own Compose work. 

Notes:

1. SkipUI's implementation is tied to SwiftUI internals, so this is an untested and simplified port of the actual code.
1. **Important**: If you plan to use this in pure Compose code, expose it as a [custom modifier](https://developer.android.com/develop/ui/compose/custom-modifiers) for a more fluent API.

```kotlin
@Composable fun PaddingLayout(modifier: Modifier, top: Dp = 0.dp, leading: Dp = 0.dp, bottom: Dp = 0.dp, trailing: Dp = 0.dp, content: @Composable () -> Unit) {
    val density = LocalDensity.current
    val topPx = with(density) { top.roundToPx() }
    val bottomPx = with(density) { bottom.roundToPx() }
    val leadingPx = with(density) { leading.roundToPx() }
    val trailingPx = with(density) { trailing.roundToPx() }

    Layout(modifier = modifier, content = {
        // Compose content
        content()
    }) { measurables, constraints ->
        if (measurables.isEmpty()) {
            return layout(width: 0, height: 0) {}
        }
        // Subtract the padding from the available size the content can use
        val updatedConstraints = constraints.copy(
            minWidth = constraint(constraints.minWidth, subtracting = leadingPx + trailingPx), 
            minHeight = constraint(constraints.minHeight, subtracting = topPx + bottomPx),
            maxWidth = constraint(constraints.maxWidth, subtracting = leadingPx + trailingPx),
            maxHeight = constraint(constraints.maxHeight, subtracting = topPx + bottomPx)
        )
        val contentPlaceables = measurables.map { it.measure(updatedConstraints) }
        // Layout within the padded size
        layout(width = contentPlaceables[0].width + leadingPx + trailingPx, height = contentPlaceables[0].height + topPx + bottomPx) {
            // Offset the content position by the leading and top padding
            for (contentPlaceable in contentPlaceables) {
                contentPlaceable.placeRelative(x = leadingPx, y = topPx)
            }
        }
    }
}

// Subtract the given amount from a size constraint value, honoring Int.MAX_VALUE and preventing illegal negative constraints.
private fun constraint(value: Int, subtracting: Int): Int {
    if (value == Int.MAX_VALUE) {
        return value
    }
    return max(0, value - subtracting)
}
```

We hope that you find this useful! If you have questions or suggestions for improvements, please reach out to us on Mastodon [@skiptools@mas.to](https://mas.to/@skiptools), via chat [skiptools.slack.com](https://skiptools.slack.com), or in our [discussion forums](http://forums.skip.dev).
