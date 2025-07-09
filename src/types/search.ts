export interface SearchIndex {
  version: string;
  created_at: string;
  index: Record<string, string[]>; // keyword -> product IDs
  consonant_index?: Record<string, string[]>; // Korean consonant search
}

export interface SearchResult {
  product_id: string;
  score: number;
}

export interface SearchOptions {
  limit?: number;
  threshold?: number;
  includeScore?: boolean;
  keys?: string[];
}