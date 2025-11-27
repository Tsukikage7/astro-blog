import { getEntry, getCollection, type CollectionKey } from "astro:content";
import type { GenericEntry } from "@/types";
import { SITE_INFO } from "@lib/config";

let blogCount = -1;
let categoriesCount = -1;
let tagsCount = -1;
let totalWordCount = -1;

export const getIndex = async (collection: CollectionKey): Promise<GenericEntry | undefined> => {
  const index = await getEntry(collection, "-index");
  return index as GenericEntry | undefined;
}

export const getEntries = async (
  collection: CollectionKey,
  sortFunction?: ((array: any[]) => any[]),
  noIndex = true,
  noDrafts = true
): Promise<GenericEntry[]> => {
  let entries: GenericEntry[] = await getCollection(collection);
  entries = noIndex
    ? entries.filter((entry: GenericEntry) => !entry.id.match(/^-/))
    : entries;
  entries = noDrafts
    ? entries.filter((entry: GenericEntry) => 'draft' in entry.data && !entry.data.draft)
    : entries;
  entries = sortFunction ? sortFunction(entries) : entries;
  return entries;
};

export const getEntriesBatch = async (
  collections: CollectionKey[],
  sortFunction?: ((array: any[]) => any[]),
  noIndex = true,
  noDrafts = true
): Promise<GenericEntry[]> => {
  const allCollections = await Promise.all(
    collections.map(async (collection) => {
      return await getEntries(collection, sortFunction, noIndex, noDrafts);
    })
  );
  return allCollections.flat();
};

export const getGroups = async (
  collection: CollectionKey,
  sortFunction?: ((array: any[]) => any[])
): Promise<GenericEntry[]> => {
  let entries = await getEntries(collection, sortFunction, false);
  entries = entries.filter((entry: GenericEntry) => {
    const segments = entry.id.split("/");
    return segments.length === 2 && segments[1] == "-index";
  });
  return entries;
};

export const getEntriesInGroup = async (
  collection: CollectionKey,
  groupSlug: string,
  sortFunction?: ((array: any[]) => any[]),
): Promise<GenericEntry[]> => {
  let entries = await getEntries(collection, sortFunction);
  entries = entries.filter((data: any) => {
    const segments = data.id.split("/");
    return segments[0] === groupSlug && segments.length > 1 && segments[1] !== "-index";
  });
  return entries;
};

export const getBlogCount = async (): Promise<number> => {
  if (blogCount !== -1) return blogCount;
  const entries = await getEntries("blog");
  const notes = await getEntries("notes");
  blogCount = entries.length + notes.length;
  return blogCount;
};

export const getCategoriesCount = async (): Promise<number> => {
  if (categoriesCount !== -1) return categoriesCount;
  try {
    const blogEntries = await getEntries("blog");
    const categories = new Set<string>();
    
    blogEntries.forEach((entry: any) => {
      
      if (entry.data.categories && Array.isArray(entry.data.categories)) {
        entry.data.categories.forEach((category: string) => {
          categories.add(category);
        });
      }
      
      if (entry.data.category) {
        categories.add(entry.data.category);
      }
    });
    
    categoriesCount = categories.size;
    return categoriesCount;
  } catch (error) {
    return 0;
  }
};

export const getTagsCount = async (): Promise<number> => {
  if (tagsCount !== -1) return tagsCount;
  try {
    const blogEntries = await getEntries("blog");
    const tags = new Set<string>();
    
    blogEntries.forEach((entry: any) => {
      if (entry.data.tags && Array.isArray(entry.data.tags)) {
        entry.data.tags.forEach((tag: string) => {
          tags.add(tag);
        });
      }
    });
    
    tagsCount = tags.size;
    return tagsCount;
  } catch (error) {
    return 0;
  }
};

const countWords = (text: string): number => {
  if (!text) return 0;
  
  
  const cleanText = text
    .replace(/<[^>]*>/g, '') 
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '') 
    .replace(/\[[^\]]*\]\([^)]*\)/g, '') 
    .replace(/#{1,6}\s/g, '') 
    .replace(/[*_]{1,2}([^*_]+)[*_]{1,2}/g, '$1') 
    .replace(/\n+/g, ' ') 
    .trim();
  
  if (!cleanText) return 0;
  
  
  const chineseChars = cleanText.match(/[\u4e00-\u9fff]/g) || [];
  const englishText = cleanText.replace(/[\u4e00-\u9fff]/g, ' ');
  const englishWords = englishText.match(/\b[a-zA-Z]+\b/g) || [];
  
  return chineseChars.length + englishWords.length;
};

export const getTotalWordCount = async (): Promise<string> => {
  if (totalWordCount !== -1) return totalWordCount.toString();
  try {
    const [blogEntries, notesEntries] = await Promise.all([
      getEntries("blog"),
      getEntries("notes").catch(() => []) 
    ]);
    
    let totalWords = 0;
    
    
    blogEntries.forEach((entry: any) => {
      totalWords += countWords(entry.body || '');
    });
    
    
    notesEntries.forEach((entry: any) => {
      totalWords += countWords(entry.body || '');
    });
    
    
    if (totalWords >= 1000000) {
      return `${(totalWords / 1000000).toFixed(1)}M`;
    } else if (totalWords >= 1000) {
      return `${(totalWords / 1000).toFixed(1)}K`;
    }
    totalWordCount = totalWords;
    return totalWordCount.toString();
  } catch (error) {
    console.error('Error calculating total word count:', error);
    return "0";
  }
};

export const getSiteRunningDays = (): number => {
  try {
    const startDate = new Date(SITE_INFO.START_DATE);
    const currentDate = new Date();
    const timeDiff = currentDate.getTime() - startDate.getTime();
    const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));
    return Math.max(0, daysDiff);
  } catch (error) {
    console.error('Error calculating site running days:', error);
    return 0;
  }
};

export const getSiteStats = async () => {
  const [blogCount, categoriesCount, tagsCount, totalWords] = await Promise.all([
    getBlogCount(),
    getCategoriesCount(),
    getTagsCount(),
    getTotalWordCount()
  ]);
  
  const runningDays = getSiteRunningDays();
  
  return {
    articles: blogCount,
    categories: categoriesCount,
    tags: tagsCount,
    totalWords: totalWords,
    runningDays: runningDays
  };
};

export const getEntriesWithDrafts = async (
  collection: CollectionKey,
  sortFunction?: ((array: any[]) => any[]),
  noIndex = true
): Promise<GenericEntry[]> => {
  return await getEntries(collection, sortFunction, noIndex, false); 
};

export const getEntriesForEnvironment = async (
  collection: CollectionKey,
  sortFunction?: ((array: any[]) => any[]),
  noIndex = true
): Promise<GenericEntry[]> => {
  const isDev = import.meta.env.DEV;
  return await getEntries(collection, sortFunction, noIndex, !isDev); 
};
