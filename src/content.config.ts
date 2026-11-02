import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const area = z.enum(['computer-vision', 'security', 'swe-ai']);

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      /** One sentence for cards and meta descriptions. */
      summary: z.string(),
      area,
      /** Other areas this project also belongs to. */
      tags: z.array(area).default([]),
      kind: z.string(),
      role: z.string().optional(),
      team: z.string().optional(),
      timeline: z.string().optional(),
      shipped: z.string().optional(),
      contributions: z.array(z.string()).default([]),
      stack: z.array(z.string()).default([]),
      highlights: z.array(z.object({ value: z.string(), label: z.string() })).default([]),
      links: z.array(z.object({ label: z.string(), href: z.string() })).default([]),
      cover: image().optional(),
      coverAlt: z.string().optional(),
      /** false = card only, no case-study page. */
      caseStudy: z.boolean().default(true),
      flagship: z.boolean().default(false),
      /** Lower numbers come first. */
      order: z.number().default(50),
    }),
});

export const collections = { projects };
