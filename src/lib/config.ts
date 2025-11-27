/**
 * 全局配置文件
 * 统一管理项目中的常量和配置项
 */

// 分页配置
export const PAGINATION_CONFIG = {
  // 博客文章每页显示数量
  BLOG_ENTRIES_PER_PAGE: 10,
  // 站点动态默认每页显示数量
  NOTES_DEFAULT_PAGE_SIZE: 10,
  // 默认分页大小（与 astro.config.mjs 保持一致）
  DEFAULT_PAGE_SIZE: 8,
} as const;

// 从 astro.config.mjs 获取配置（如果需要的话）
// 注意：在 Astro 中，config 文件的配置通常不能直接在运行时访问
// 这里提供一个统一的配置管理方式


// 导出便捷的获取函数
export const getPageSize = (type: 'blog' | 'notes' = 'blog'): number => {
  switch (type) {
    case 'blog':
      return PAGINATION_CONFIG.BLOG_ENTRIES_PER_PAGE;
    case 'notes':
      return PAGINATION_CONFIG.NOTES_DEFAULT_PAGE_SIZE;
    default:
      return PAGINATION_CONFIG.DEFAULT_PAGE_SIZE;
  }
};

// 类型定义
export type PageType = 'blog' | 'notes';

//网站信息
export const SITE_INFO = {
  // 网站名称
  NAME: (import.meta.env.PUBLIC_SITE_NAME as string) || '重言',
  SITE_NAME: (import.meta.env.PUBLIC_SITE_NAME as string) || '重言的博客',
  SUBNAME: (import.meta.env.PUBLIC_SITE_SUBTITLE as string) || '无限进步',
  // 网站描述
  DESCRIPTION: (import.meta.env.PUBLIC_SITE_DESCRIPTION as string) || '全栈开发工程师，分享技术心得与生活感悟',
  // 网站 URL (生产环境)
  URL: (import.meta.env.PUBLIC_SITE_URL as string) || 'https://chongyan.cloud',
  AUTHOR: (import.meta.env.PUBLIC_SITE_AUTHOR as string) || '重言',
  // 本地开发 URL
  DEV_URL: 'http://localhost:4321' as const,
  LOGO_IMAGE: '/favicon/logo.png' as const,
  // 作者头像
  AUTHOR_AVATAR: '/avatar.webp' as const,
  KEY_WORDS: (import.meta.env.PUBLIC_SITE_KEYWORDS as string) || 'golang rust typeScript fullstack 全栈开发',
  GOOGLE_ANALYTICS_ID: (import.meta.env.PUBLIC_GOOGLE_ANALYTICS_ID as string) || '',
  BAIDU_ANALYTICS_ID: (import.meta.env.PUBLIC_BAIDU_ANALYTICS_ID as string) || '',
  // 网站初始时间（用于计算运行时长）
  START_DATE: '2023-01-01' as const,
};

// 全局液态玻璃效果
export const UI_CONFIG = {
  ENABLE_GLASS_EFFECT: true,
} as const;

// 获取当前环境的网站URL
export const getSiteUrl = () => {
  // 在构建时使用生产URL，开发时使用开发URL
  return import.meta.env.PUBLIC_ENV === 'production' ? SITE_INFO.URL : SITE_INFO.DEV_URL;
};
