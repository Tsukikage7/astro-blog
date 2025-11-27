import { defineCollection, reference, z } from "astro:content";
import { glob } from "astro/loaders";

const baseContent = z.object({
  title: z.string(),
  description: z.string().optional(),
  draft: z.boolean().default(false),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

const social = z.object({
  discord: z.string().optional(),
  email: z.string().optional(),
  facebook: z.string().optional(),
  github: z.string().optional(),
  instagram: z.string().optional(),
  linkedIn: z.string().optional(),
  pinterest: z.string().optional(),
  tiktok: z.string().optional(),
  website: z.string().optional(),
  youtube: z.string().optional(),
  wechat: z.string().optional(),
  xhs: z.string().optional(),
  weibo: z.string().optional(),
  rss: z.string().optional(),
});

const about = defineCollection({
  loader: glob({ pattern: "-index.{md,mdx}", base: "./src/content/about" }),
  schema: ({ image }) =>
    baseContent.extend({
      image: image().optional(),
      imageAlt: z.string().default(""),
      skills: z.array(z.string()).optional(),
      experience: z
        .array(
          z.object({
            title: z.string(),
            company: z.string(),
            period: z.string(),
            description: z.string().optional(),
          }),
        )
        .optional(),
      education: z
        .array(
          z.object({
            degree: z.string(),
            school: z.string(),
            period: z.string(),
          }),
        )
        .optional(),
      social: social.optional(),
    }),
});

const blog = defineCollection({
  loader: glob({ pattern: "**\/[^_]*.{md,mdx}", base: "./src/content/blog" }),
  schema: ({ image }) =>
    baseContent.extend({
      featuredImg: z.string().optional(),
      
      image: z.union([image(), z.string()]).optional(),
      imageAlt: z.string().default(""),
      author: z.string().optional(),
      categories: z.array(z.string().optional()),
      tags: z.array(z.string()).optional(),
      status: z.enum(["draft", "published", "archived"]).default("published"),
      featured: z.boolean().default(false),
      recommended: z.boolean().default(false),
      views: z.number().default(0),
      publishedAt: z.date().optional(),
      hideToc: z.boolean().default(false),
      draft: z.boolean().default(false),
    }),
});

const categories = defineCollection({
  loader: glob({
    pattern: "**\/[^_]*.{md,mdx}",
    base: "./src/content/categories",
  }),
  schema: ({ image }) =>
    baseContent.extend({
      slug: z.string().optional(),
      icon: z.string().optional(),
      image: image().optional(),
      imageAlt: z.string().default(""),
      color: z.string().default("#007bff"),
      parentId: z.string().optional(),
    }),
});

const tags = defineCollection({
  loader: glob({ pattern: "**\/[^_]*.{md,mdx}", base: "./src/content/tags" }),
  schema: baseContent.extend({
    color: z.string().default("#007bff"),
  }),
});

const notes = defineCollection({
  loader: glob({ pattern: "**\/[^_]*.{md,mdx}", base: "./src/content/notes" }),
  schema: ({ image }) =>
    baseContent.extend({
      
      images: z
        .array(
          z.object({
            src: image(),
            alt: z.string().default(""),
          }),
        )
        .optional(),
      
      image: image().optional(),
      imageAlt: z.string().default(""),
      tags: z.array(z.string()).optional(),
      mood: z.string().optional(),
      location: z.string().optional(),
    }),
});

const pages = defineCollection({
  loader: glob({ pattern: "**\/[^_]*.{md,mdx}", base: "./src/content/pages" }),
  schema: ({ image }) =>
    baseContent.extend({
      image: image().optional(),
      imageAlt: z.string().default(""),
      layout: z.string().optional(),
      hideToc: z.boolean().default(false),
    }),
});

const home = defineCollection({
  loader: glob({ pattern: "-index.{md,mdx}", base: "./src/content/home" }),
  schema: ({ image }) =>
    baseContent.extend({
      image: image().optional(),
      imageAlt: z.string().default(""),
      hero: z
        .object({
          title: z.string(),
          subtitle: z.string().optional(),
          backgroundImage: z.string().optional(),
          ctaButton: z
            .object({
              text: z.string(),
              link: z.string(),
            })
            .optional(),
        })
        .optional(),
      features: z
        .array(
          z.object({
            title: z.string(),
            description: z.string(),
            icon: z.string().optional(),
          }),
        )
        .optional(),
    }),
});

const search = defineCollection({
  loader: glob({ pattern: "-index.{md,mdx}", base: "./src/content/search" }),
  schema: baseContent.extend({
    searchableCollections: z
      .array(z.string())
      .default(["blog", "notes", "pages"]),
    searchConfig: z
      .object({
        placeholder: z.string().default("搜索内容..."),
        maxResults: z.number().default(10),
        enableHighlight: z.boolean().default(true),
      })
      .optional(),
  }),
});

const socialConfig = defineCollection({
  loader: glob({ pattern: "-index.{md,mdx}", base: "./src/content/social" }),
  schema: baseContent.extend({
    platforms: social,
    displayOrder: z.array(z.string()).optional(),
    showInHeader: z.boolean().default(true),
    showInFooter: z.boolean().default(true),
  }),
});

const terms = defineCollection({
  loader: glob({ pattern: "-index.{md,mdx}", base: "./src/content/terms" }),
  schema: baseContent,
});

export const collections = {
  about,
  blog,
  categories,
  tags,
  notes,
  pages,
  home,
  search,
  social: socialConfig,
  terms,
};
