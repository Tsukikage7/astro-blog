import { slug } from "github-slugger";
import { marked } from "marked";

marked.use({
  mangle: false,
  headerIds: false, 
  gfm: true, 
  breaks: true, 
  pedantic: false,
  sanitize: false,
  smartLists: true,
  smartypants: false,
});

const renderer = new marked.Renderer();

renderer.heading = function(text: string, level: number) {
  const escapedText = slug(text);
  return `<h${level} id="${escapedText}">
    <a href="#${escapedText}" class="anchor-link">${text}</a>
  </h${level}>`;
};

renderer.code = function(code: string, language: string | undefined) {
  const validLang = language && language !== '' ? language : 'text';
  return `<div class="code-block-wrapper">
    <div class="code-block-header">
      <span class="code-language">${validLang}</span>
      <button class="copy-code-btn" onclick="copyCode(this)" title="复制代码">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
        </svg>
      </button>
    </div>
    <pre><code class="language-${validLang}">${code}</code></pre>
  </div>`;
};

renderer.table = function(header: string, body: string) {
  return `<div class="table-wrapper">
    <table class="markdown-table">
      <thead>${header}</thead>
      <tbody>${body}</tbody>
    </table>
  </div>`;
};

renderer.link = function(href: string, title: string | null, text: string) {
  
  const isExternal = href.startsWith('http://') || href.startsWith('https://');
  const target = isExternal ? ' target="_blank" rel="noopener noreferrer"' : '';
  const titleAttr = title ? ` title="${title}"` : '';
  return `<a href="${href}"${titleAttr}${target}>${text}</a>`;
};

renderer.image = function(href: string, title: string | null, text: string) {
  const titleAttr = title ? ` title="${title}"` : '';
  return `<figure class="markdown-image">
    <img src="${href}" alt="${text}"${titleAttr} loading="lazy" class="responsive-image" />
    ${text ? `<figcaption>${text}</figcaption>` : ''}
  </figure>`;
};

renderer.blockquote = function(quote: string) {
  return `<blockquote class="markdown-blockquote">${quote}</blockquote>`;
};

marked.setOptions({ renderer });

export const slugify = (content: string) => {
  if (!content) return '';
  return slug(content.toString());
};

export const markdownify = async (content: string, div?: boolean) => {
  const options = { renderer };
  
  return div ? marked.parse(content, options) : marked.parseInline(content, options);
};

async function extractImageUrls(content: string): Promise<string> {
  const regex = /!\[.*?\]\((.*?)\)/g;
  const matches = content.match(regex);
  if (matches) {
    matches.forEach(match => {
      const url = match.match(/\((.*?)\)/)?.[1];
      console.log("图片URL",url)
      if (url) {
        content = content.replace(url, transformImageUrl(url));
      }
    });
  }
  console.log("替换后的文章内容",content)
  return content;
}

function transformImageUrl(url: string): string {
  if (url.indexOf("/_image?href=") !== -1) {
    return url;
  }
  return `/_image?href=${encodeURI(url)}`;
}

export const upperHumanize = (content: string | undefined) => {
  if (!content) return '';
  return content
    .toLowerCase()
    .replace(/-/g, " ")
    .replace(/(^\w{1})|(\s{1}\w{1})/g, (match) => match.toUpperCase());
};

export const lowerHumanize = (content: string | undefined) => {
  if (!content) return '';
  return content
    .toLowerCase()
    .replace(/-/g, " ");
};

export const plainify = (content: string) => {
  const parseMarkdown = marked.parse(content);
  const filterBrackets = parseMarkdown.replace(/<\/?[^>]+(>|$)/gm, "");
  const filterSpaces = filterBrackets.replace(/[\r\n]\s*[\r\n]/gm, "");
  const stripHTML = htmlEntityDecoder(filterSpaces);
  return stripHTML;
};

const htmlEntityDecoder = (htmlWithEntities: string) => {
  let entityList: { [key: string]: string } = {
    "&nbsp;": " ",
    "&lt;": "<",
    "&gt;": ">",
    "&amp;": "&",
    "&quot;": '"',
    "&#39;": "'",
  };
  let htmlWithoutEntities: string = htmlWithEntities.replace(
    /(&amp;|&lt;|&gt;|&quot;|&#39;)/g,
    (entity: string): string => {
      return entityList[entity];
    },
  );
  return htmlWithoutEntities;
};
