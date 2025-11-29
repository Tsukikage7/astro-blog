import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { getSiteUrl } from '../lib/config';

export const GET: APIRoute = async ({ request }) => {
  try {
    
    const siteUrl = getSiteUrl();
    
    
    const [blogPosts, notes] = await Promise.all([
      getCollection('blog', ({filePath}) => !filePath?.endsWith('-index.md')),
      getCollection('notes', ({filePath}) => !filePath?.endsWith('-index.md'))
    ]);

    
    const urls: string[] = [];

    
    urls.push(`
  <url>
    <loc>${siteUrl}/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>`);

    
    blogPosts.forEach(post => {
      const lastmod = post.data.updated || post.data.created || new Date();
      urls.push(`
  <url>
    <loc>${siteUrl}/blog/${post.id}</loc>
    <lastmod>${lastmod.toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`);
    });

    

    
    notes.forEach(note => {
      const lastmod = note.data.updated || note.data.created || new Date();
      urls.push(`
  <url>
    <loc>${siteUrl}/notes/${note.id}</loc>
    <lastmod>${lastmod.toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`);
    });

    
    const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.join('')}
</urlset>`;

    return new Response(sitemapXml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600'
      }
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);
    
    
    const fallbackSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${new URL(request.url).origin}/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`;
    
    return new Response(fallbackSitemap, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=300' 
      }
    });
  }
};