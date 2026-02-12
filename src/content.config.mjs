import { defineCollection, z } from 'astro:content';
import { docsLoader, i18nLoader } from '@astrojs/starlight/loaders';
import { docsSchema, i18nSchema } from '@astrojs/starlight/schema';
import { glob, file } from 'astro/loaders';
import { blogSchema } from 'starlight-blog/schema';

const docs = defineCollection({
  loader: docsLoader(),
  schema: docsSchema({
    extend: (context) => blogSchema(context)
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
      'header.link.blog': z.string().optional(),
      'header.link.sponsor': z.string().optional(),
    }),
  }),
});

/*
const tour = defineCollection({
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


export const collections = {
    docs: docs,
    talks: talks,
    i18n: i18n,
    //tour: tour,
};
