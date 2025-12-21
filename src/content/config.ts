import { defineCollection, reference, z } from "astro:content";
import { glob } from "astro/loaders";

const baseContent = z.object({
  title: z.string(),
  description: z.string().optional(),
  created: z.coerce.date().optional(),
  updated: z.coerce.date().optional(),
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
      imageAlt: z.string().optional(),
      // 个人信息
      info: z.object({
        name: z.string(),
        title: z.string(),
        location: z.string().optional(),
        age: z.number().optional(),
      }).optional(),
      // 技能分类
      skillCategories: z.array(
        z.object({
          name: z.string(),
          icon: z.string().optional(),
          skills: z.array(z.string()),
        })
      ).optional(),
      // 兼容旧的 skills 字段
      skills: z.array(z.string()).optional(),
      // 工作经历
      experience: z
        .array(
          z.object({
            title: z.string(),
            company: z.string(),
            period: z.string(),
            location: z.string().optional(),
            description: z.string().optional(),
            highlights: z.array(z.string()).optional(),
          }),
        )
        .optional(),
      // 教育背景
      education: z
        .array(
          z.object({
            degree: z.string(),
            school: z.string(),
            period: z.string(),
            badge: z.string().optional(),
            location: z.string().optional(),
          }),
        )
        .optional(),
      // 开源项目
      openSource: z.array(
        z.object({
          name: z.string(),
          role: z.string(),
          period: z.string(),
          description: z.string().optional(),
          url: z.string().optional(),
          contributions: z.array(z.string()).optional(),
        })
      ).optional(),
      social: social.optional(),
    }),
});

const blog = defineCollection({
  loader: glob({ pattern: "**\/[^_]*.{md,mdx}", base: "./src/content/blog" }),
  schema: ({ image }) =>
    baseContent.extend({
      image: z.union([image(), z.string()]).optional(),
      categories: z.array(z.string().optional()),
      tags: z.array(z.string()).optional(),
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
      tags: z.array(z.string()).optional(),
      mood: z.string().optional(),
      location: z.string().optional(),
    }),
});


const home = defineCollection({
  loader: glob({ pattern: "-index.{md,mdx}", base: "./src/content/home" }),
  schema: ({ image }) =>
    baseContent.extend({
      image: image().optional(),
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
  home,
  search,
  social: socialConfig,
  terms,
};
