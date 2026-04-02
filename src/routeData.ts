import { defineRouteMiddleware } from '@astrojs/starlight/route-data'

export const onRequest = defineRouteMiddleware((context) => {
  const { starlightRoute } = context.locals
  // Disable the right-side table of contents on blog index/listing pages.
  // Individual blog posts keep their TOC.
  const slug = starlightRoute.id
  if (slug === 'blog' || /^blog\/\d+$/.test(slug) || /^blog\/tags\//.test(slug) || /^blog\/authors\//.test(slug)) {
    starlightRoute.toc = undefined
  }
})
