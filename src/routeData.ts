import { defineRouteMiddleware } from '@astrojs/starlight/route-data'

export const onRequest = defineRouteMiddleware((context) => {
  const { starlightRoute } = context.locals
  const slug = starlightRoute.id

  // Disable the right-side table of contents on blog index/listing pages.
  // Individual blog posts keep their TOC.
  if (slug === 'blog' || /^blog\/\d+$/.test(slug) || /^blog\/tags\//.test(slug) || /^blog\/authors\//.test(slug)) {
    starlightRoute.toc = undefined
  }

  // Inject per-page Open Graph image meta tags.
  const ogImageUrl = new URL(`/og/${slug}.png`, context.site)
  starlightRoute.head.push(
    { tag: 'meta', attrs: { property: 'og:image', content: ogImageUrl.href } },
    { tag: 'meta', attrs: { property: 'og:image:width', content: '1200' } },
    { tag: 'meta', attrs: { property: 'og:image:height', content: '630' } },
    { tag: 'meta', attrs: { property: 'og:image:type', content: 'image/png' } },
    { tag: 'meta', attrs: { name: 'twitter:card', content: 'summary_large_image' } },
    { tag: 'meta', attrs: { name: 'twitter:image', content: ogImageUrl.href } },
  )
})
