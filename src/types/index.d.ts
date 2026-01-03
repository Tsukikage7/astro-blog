import type { CollectionEntry, CollectionKey } from "astro:content";
import type { MarkdownHeading } from "astro";

export type GenericEntry = CollectionEntry<CollectionKey>;

export type AboutEntry = CollectionEntry<"about">;
export type AuthorsEntry = CollectionEntry<"authors">;
export type BlogEntry = CollectionEntry<"blog">;
export type CategoriesEntry = CollectionEntry<"categories">;
export type TagsEntry = CollectionEntry<"tags">;
export type NotesEntry = CollectionEntry<"notes">;
export type GamesEntry = CollectionEntry<"games">;
export type HomeEntry = CollectionEntry<"home">;
export type SearchEntry = CollectionEntry<"search">;
export type SocialEntry = CollectionEntry<"social">;
export type DocsEntry = CollectionEntry<"docs">;
export type IndexCardsEntry = CollectionEntry<"indexCards">;
export type PoetryEntry = CollectionEntry<"poetry">;
export type PortfolioEntry = CollectionEntry<"portfolio">;
export type RecipesEntry = CollectionEntry<"recipes">;
export type TermsEntry = CollectionEntry<"terms">;
export type WritingsEntry = CollectionEntry<"writings">;
export type SearchableEntry =
  | AboutEntry
  | AuthorsEntry
  | BlogEntry
  | NotesEntry
  | DocsEntry
  | GamesEntry
  | PoetryEntry
  | PortfolioEntry
  | RecipesEntry
  | TermsEntry
  | WritingsEntry;
  
export type SocialLinks = {
  wechat?: string;
  xhs?: string;
  discord?: string;
  email?: string;
  facebook?: string;
  github?: string;
  instagram?: string;
  weibo?: string;
  pinterest?: string;
  tiktok?: string;
  website?: string;
  youtube?: string;
  rss?: string;
}

export type EntryReference = {
  id: string;
  collection: string;
};

declare global {
  interface Window {
    typewriterTimeout?: ReturnType<typeof setTimeout>;
  }
}

export interface HeadingHierarchy extends MarkdownHeading {
  subheadings: HeadingHierarchy[];
}

export type MenuItem = {
  title?: string;
  id: string;
  children: MenuItem[];
};

export type SideNavMenuProps = {
  items: MenuItem[];
  level: number;
};

export type ImageData = {
  src: string,
  width: number,
  height: number,
  format: string
};