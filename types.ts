export type EntryType = 'MILK' | 'FOOD';

export interface FeedingEntry {
  id: string;
  timestamp: number; // Unix timestamp in milliseconds
  type: EntryType;
  amountMl?: number; // Only for MILK
  foodName?: string; // Only for FOOD
  note?: string;
}

export type ViewMode = 'TIMELINE' | 'CALENDAR' | 'STATS';

export interface DayAggregates {
  totalMilk: number;
  totalFoodEntries: number;
}
