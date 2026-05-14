import { defineCollection, z } from 'astro:content';
import { docsLoader, i18nLoader } from '@astrojs/starlight/loaders';
import { docsSchema, i18nSchema } from '@astrojs/starlight/schema';
import { glob, file } from 'astro/loaders';
import { blogSchema } from 'starlight-blog/schema';

const docs = defineCollection({
  loader: docsLoader(),
  schema: docsSchema({
    extend: (context) => blogSchema(context).extend({
      showBanner: z.boolean().optional().default(true),
    }),
  })
});

/* FIXME: doesn't create a talks/ index */
const talks = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/docs/talks" }),
  //schema:
});

const i18n = defineCollection({
  loader: i18nLoader(),
  schema: i18nSchema({
    extend: z.object({
      'header.link.docs': z.string().optional(),
      'header.link.gallery': z.string().optional(),
      'header.link.blog': z.string().optional(),
      'header.link.sponsor': z.string().optional(),
      'banner.message': z.string().optional(),
    }),
  }),
});

const ratingSchema = z.object({
  score: z.number().min(0).max(5).optional(),
  count: z.number().int().nonnegative().optional(),
  downloads: z.string().optional(),
}).optional();

const screenshotSchema = z.object({
  url: z.string().url(),
  caption: z.string().optional(),
});

const gallery = defineCollection({
  loader: glob({ pattern: "*.yaml", base: "./src/content/gallery" }),
  schema: z.object({
    name: z.string(),
    developer: z.string(),
    tagline: z.string().optional(),
    description: z.string(),
    category: z.string().optional(),
    mode: z.enum(['SkipFuse', 'SkipLite', 'SkipBridge', 'partial']).optional(),
    featured: z.boolean().default(false),
    icon: z.string().url().optional(),
    releaseYear: z.number().int().optional(),
    tags: z.array(z.string()).default([]),
    links: z.object({
      appStore: z.string().url().optional(),
      playStore: z.string().url().optional(),
      website: z.string().url().optional(),
      source: z.string().url().optional(),
      article: z.string().url().optional(),
    }).default({}),
    ratings: z.object({
      appStore: ratingSchema,
      playStore: ratingSchema,
    }).default({}),
    screenshots: z.object({
      ios: z.array(screenshotSchema).default([]),
      android: z.array(screenshotSchema).default([]),
    }).default({}),
    available: z.boolean().default(true),
    notes: z.string().optional(),
  }),
});

export const collections = {
    docs: docs,
    talks: talks,
    i18n: i18n,
    gallery: gallery,
};
