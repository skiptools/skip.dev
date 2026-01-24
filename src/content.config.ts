import { defineCollection, z } from 'astro:content';
import { docsLoader, i18nLoader } from '@astrojs/starlight/loaders';
import { docsSchema, i18nSchema } from '@astrojs/starlight/schema';
import { blogSchema } from 'starlight-blog/schema';

/*
const tourCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    duration: z.string(),
    video: z.string().url(),
    poster: z.string().url(),
    yt: z.string().url().optional(),
    description: z.string(),
  }),
});
*/

/*
const gallery = defineCollection({
  type: "data",
  schema: z.object({
    name: z.string(),
    tagline: z.string(),
    description: z.string(),

    website: z.string().url().optional(),
    appStore: z.string().url().optional(),
    playStore: z.string().url().optional(),
    source: z.string().url().optional(),

    platforms: z.array(z.enum(["iOS", "Android"])),
    tags: z.array(z.string()).default([]),

    screenshots: z.array(z.string())
  })
});
*/


export const collections = {
    docs: defineCollection({ loader: docsLoader(), schema: docsSchema({
      extend: (context) => blogSchema(context)
    }) }),
    i18n: defineCollection({
        loader: i18nLoader(),
        schema: i18nSchema({
            extend: z.object({
                'header.link.docs': z.string().optional(),
                'header.link.blog': z.string().optional(),
                'header.link.sponsor': z.string().optional(),
            }),
        }),
    }),
    //tour: tourCollection,
    //gallery: gallery,
};
