import type { GenericEntry } from "@/types";

export const sortByDate = (entries: GenericEntry[]): GenericEntry[] => {
  const sortedEntries = entries.sort(
    (a: any, b: any) =>
      new Date(b.data.created && b.data.created).valueOf() -
      new Date(a.data.created && a.data.created).valueOf(),
  );
  return sortedEntries;
};

export const sortByUpdate = (entries: GenericEntry[]): GenericEntry[] => {
  const sortedEntries = entries.sort(
    (a: any, b: any) =>
      new Date(b.data.updated && b.data.updated).valueOf() -
      new Date(a.data.updated && a.data.updated).valueOf(),
  );
  return sortedEntries;
};

export const sortByTitle = (entries: GenericEntry[]): GenericEntry[] => {
  const sortedEntries = entries.sort((a: any, b: any) =>
    a.data.title.localeCompare(b.data.title),
  );
  return sortedEntries;
};

export const sortByRandom = (entries: GenericEntry[]): GenericEntry[] => {
  const sortedEntries = entries.sort(() => Math.random() - 0.5);
  return sortedEntries;
};
