

export const PAGINATION_CONFIG = {
  
  BLOG_ENTRIES_PER_PAGE: 10,
  
  NOTES_DEFAULT_PAGE_SIZE: 10,
  
  DEFAULT_PAGE_SIZE: 8,
} as const;

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

export type PageType = 'blog' | 'notes';

export const SITE_INFO = {
  
  NAME: (import.meta.env.PUBLIC_SITE_NAME as string) || '重言',
  SITE_NAME: (import.meta.env.PUBLIC_SITE_NAME as string) || '重言的博客',
  SUBNAME: (import.meta.env.PUBLIC_SITE_SUBTITLE as string) || '无限进步',
  
  DESCRIPTION: (import.meta.env.PUBLIC_SITE_DESCRIPTION as string) || '全栈开发工程师，分享技术心得与生活感悟',
  
  URL: (import.meta.env.PUBLIC_SITE_URL as string) || 'https://chongyan.cloud',
  AUTHOR: (import.meta.env.PUBLIC_SITE_AUTHOR as string) || '重言',
  
  DEV_URL: 'http://localhost:4321' as const,
  LOGO_IMAGE: '/favicon/logo.png' as const,
  
  AUTHOR_AVATAR: '/avatar.webp' as const,
  KEY_WORDS: (import.meta.env.PUBLIC_SITE_KEYWORDS as string) || 'golang rust typeScript fullstack 全栈开发',
  GOOGLE_ANALYTICS_ID: (import.meta.env.PUBLIC_GOOGLE_ANALYTICS_ID as string) || '',
  BAIDU_ANALYTICS_ID: (import.meta.env.PUBLIC_BAIDU_ANALYTICS_ID as string) || '',
  
  START_DATE: '2023-01-01' as const,
};

export const UI_CONFIG = {
  ENABLE_GLASS_EFFECT: true,
} as const;

export const MUSIC_PLAYER_CONFIG = {
  
  ENABLED: true,
  
  PLAYLIST_ID: '2539599584',
  
  FIXED: true,
  
  SHOW_LRC: true,
  
  THEME_COLOR: '#FF6B6B',
  
  ORDER: 'random' as 'circulation' | 'order' | 'random' | 'single',
  
  PRELOAD: 'auto' as 'none' | 'metadata' | 'auto',
  
  AUTOPLAY: false,
} as const;

export const getSiteUrl = () => {
  
  return import.meta.env.PUBLIC_ENV === 'production' ? SITE_INFO.URL : SITE_INFO.DEV_URL;
};
