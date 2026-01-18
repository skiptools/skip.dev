import { defineCollection, z } from 'astro:content';
import { docsLoader, i18nLoader } from '@astrojs/starlight/loaders';
import { docsSchema, i18nSchema } from '@astrojs/starlight/schema';
import { blogSchema } from 'starlight-blog/schema';

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

export const collections = {
    i18n: defineCollection({ loader: i18nLoader(), schema: i18nSchema() }),
    docs: defineCollection({ loader: docsLoader(), schema: docsSchema({
      extend: (context) => blogSchema(context)
    }) }),
    tour: tourCollection,
};
