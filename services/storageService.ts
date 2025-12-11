import { FeedingEntry } from '../types';

const STORAGE_KEY = 'nurturetrack_entries';

export const getStoredEntries = (): FeedingEntry[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error("Failed to load entries", e);
    return [];
  }
};

export const saveEntry = (entry: FeedingEntry): FeedingEntry[] => {
  const current = getStoredEntries();
  const updated = [...current, entry];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
};

export const deleteEntry = (id: string): FeedingEntry[] => {
  const current = getStoredEntries();
  const updated = current.filter(e => e.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
};

export const updateEntry = (updatedEntry: FeedingEntry): FeedingEntry[] => {
  const current = getStoredEntries();
  const updated = current.map(e => (e.id === updatedEntry.id ? updatedEntry : e));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
};
