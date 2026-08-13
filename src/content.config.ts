import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// News articles — written by humans or by the AI journalist agent (via PR).
const news = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/news' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    author: z.string().default('INFONET AI Reporter'),
    category: z.enum(['research', 'web3', 'ai', 'lab', 'biz', 'education']).default('lab'),
    summary: z.string(),
    source: z.string().optional(),       // e.g. slack thread, paper DOI
    media: z.object({
      audio: z.string().optional(),      // TTS podcast URL
      video: z.string().optional(),      // YouTube / shorts URL
      slides: z.string().optional(),     // presentation PDF
    }).optional(),
  }),
});

export const collections = { news };
