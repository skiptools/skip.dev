---
title:  "Add a Custom Shadow to Any Content in Compose"
date:   2024-01-15
tags:
  - jetpack-compose
  - android-ui
  - custom-modifiers
  - graphics
  - swiftui
  - skipui
  - cross-platform
  - ui-frameworks
layout: post
permalink: /blog/shadow-content-in-compose/
author: Abe White
---

<img alt="Drop shadow on complex content" src="https://assets.skip.dev/images/compose-shadow-content.png" />

Skip's open-source [SkipUI library](https://source.skip.tools/skip-ui) implements the SwiftUI API for Android. To do so, SkipUI leverages [Compose](https://developer.android.com/jetpack/compose), Android's own modern, declarative UI framework.

The SwiftUI `shadow(color:radius:x:y:)` modifier adds a drop shadow with a customizable color, blur radius, and offset to any SwiftUI content. Implementing this in Compose posed a problem, because Compose's own `shadow(elevation:shape:clip:ambientColor:spotColor:)` modifier works very differently. The most critical difference is readily apparent from the modifier's signature: you have to supply the shadow's shape (or be satisfied with the rectangular default). SwiftUI's `shadow`, on the other hand, is more akin to a real shadow, automatically mirroring the outline of its target content.

Luckily, Compose is a powerful UI framework. We were able to create a composable function that adds a drop shadow to any content, without affecting your layout and while mirroring the content's shape (as defined by its non-transparent pixels) exactly. To do so, we used a combination of techniques:

- `Modifier.drawWithContent` to re-render the given content as its own shadow
- A custom `ColorMatrix` to paint the content in the specified shadow color
- `Layout` to place the shadow behind the content with the specified offset, without affecting your layout

The resulting code is below. *Note: SkipUI's implementation is tied to SwiftUI internals, so this is an untested and simplified port of the actual code.*

```kotlin
// Compose the given content with a drop shadow on all
// non-transparent pixels
@Composable fun Shadowed(modifier: Modifier, color: Color, offsetX: Dp, offsetY: Dp, blurRadius: Dp, content: @Composable () -> Unit) {
    val density = LocalDensity.current
    val offsetXPx = with(density) { offsetX.toPx() }.toInt()
    val offsetYPx = with(density) { offsetY.toPx() }.toInt()
    val blurRadiusPx = ceil(with(density) {
        blurRadius.toPx()
    }).toInt()

    // Modifier to render the content in the shadow color, then
    // blur it by blurRadius
    val shadowModifier = Modifier
        .drawWithContent {
            val matrix = shadowColorMatrix(color)
            val filter = ColorFilter.colorMatrix(matrix)
            val paint = Paint().apply {
                colorFilter = filter
            }
            drawIntoCanvas { canvas ->
                canvas.saveLayer(Rect(0f, 0f, size.width, size.height), paint)
                drawContent()
                canvas.restore()
            }
        }
        .blur(radius = blurRadius, BlurredEdgeTreatment.Unbounded)
        .padding(all = blurRadius) // Pad to prevent clipping blur

    // Layout based solely on the content, placing shadow behind it
    Layout(modifier = modifier, content = {
        // measurables[0] = content, measurables[1] = shadow
        content() 
        Box(modifier = shadowModifier) { content() }
    }) { measurables, constraints ->
        // Allow shadow to go beyond bounds without affecting layout
        val contentPlaceable = measurables[0].measure(constraints)
        val shadowPlaceable = measurables[1].measure(Constraints(maxWidth = contentPlaceable.width + blurRadiusPx * 2, maxHeight = contentPlaceable.height + blurRadiusPx * 2))
        layout(width = contentPlaceable.width, height = contentPlaceable.height) {
            shadowPlaceable.placeRelative(x = offsetXPx - blurRadiusPx, y = offsetYPx - blurRadiusPx)
            contentPlaceable.placeRelative(x = 0, y = 0)
        }
    }
}

// Return a color matrix with which to paint our content
// as a shadow of the given color
private fun shadowColorMatrix(color: Color): ColorMatrix {
    return ColorMatrix().apply {
        set(0, 0, 0f) // Do not preserve original R
        set(1, 1, 0f) // Do not preserve original G
        set(2, 2, 0f) // Do not preserve original B

        set(0, 4, color.red * 255) // Use given color's R
        set(1, 4, color.green * 255) // Use given color's G
        set(2, 4, color.blue * 255) // Use given color's B
        set(3, 3, color.alpha) // Multiply by given color's alpha
    }
}
```

You can see this in action in the [Skip Showcase app's](https://github.com/skiptools/skipapp-showcase) shadow playground, and in the image at the top of this article.

We hope that you find this useful! If you have questions or suggestions for improvements, please reach out to us on Mastodon [@skiptools@mas.to](https://mas.to/@skiptools), via chat [skiptools.slack.com](https://skiptools.slack.com), or in our [discussion forums](http://forums.skip.dev).
