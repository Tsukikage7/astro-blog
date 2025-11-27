import { getCollection } from "astro:content";
import type { APIRoute } from "astro";
import { logger } from "@lib/env";

export const GET: APIRoute = async () => {
  try {
    console.log('开始获取博客文章...')
    
    const allPosts = await getCollection("blog", ({ data,filePath }) => {
      return data.status === "published" && !data.draft && filePath?.indexOf('-index') == -1;
    });

    
    const articles = allPosts.map((post) => ({
      slug: post.id, 
      title: post.data.title,
      description: post.data.description,
      publishedAt: post.data.publishedAt || post.data.createdAt,
      categories: post.data.categories,
      tags: post.data.tags || [],
    }));

    
    articles.sort((a, b) => {
      const dateA = new Date(a.publishedAt || 0);
      const dateB = new Date(b.publishedAt || 0);
      return dateB.getTime() - dateA.getTime();
    });

    return new Response(JSON.stringify(articles), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=3600", 
      },
    });
  } catch (error) {
    console.error("获取博客文章失败:", error);
    return new Response(
      JSON.stringify({ error: "获取博客文章失败" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
};