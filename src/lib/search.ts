import Fuse, { IFuseOptions } from 'fuse.js';
import { Product } from '@/src/types';

// Korean consonant search mapping
const KOREAN_CONSONANTS: Record<string, string> = {
  'ㄱ': '가-깋',
  'ㄴ': '나-닣',
  'ㄷ': '다-딯',
  'ㄹ': '라-맇',
  'ㅁ': '마-밓',
  'ㅂ': '바-빟',
  'ㅅ': '사-싷',
  'ㅇ': '아-잏',
  'ㅈ': '자-짛',
  'ㅊ': '차-칳',
  'ㅋ': '카-킿',
  'ㅌ': '타-팋',
  'ㅍ': '파-핗',
  'ㅎ': '하-힣'
};

// Fuse.js configuration optimized for Korean
export const fuseOptions: IFuseOptions<Product> = {
  keys: [
    { name: 'name', weight: 0.4 },
    { name: 'search_text', weight: 0.3 },
    { name: 'categories', weight: 0.2 },
    { name: 'mall_name', weight: 0.1 }
  ],
  threshold: 0.3,
  includeScore: true,
  minMatchCharLength: 1,
  shouldSort: true,
  findAllMatches: true,
  ignoreLocation: true,
  ignoreFieldNorm: false,
  useExtendedSearch: true
};

// Create search instance
export function createSearchInstance(products: Product[]): Fuse<Product> {
  return new Fuse(products, fuseOptions);
}

// Convert Korean consonants to regex pattern
export function convertConsonantsToPattern(query: string): string {
  let pattern = query;
  
  Object.entries(KOREAN_CONSONANTS).forEach(([consonant, range]) => {
    pattern = pattern.replace(new RegExp(consonant, 'g'), `[${range}]`);
  });
  
  return pattern;
}

// Process search query with Korean optimizations
export function processSearchQuery(query: string): string {
  // Remove spaces for better Korean search
  const noSpaceQuery = query.replace(/\s+/g, '');
  
  // Check if query contains Korean consonants
  const hasConsonants = Object.keys(KOREAN_CONSONANTS).some(consonant => 
    query.includes(consonant)
  );
  
  if (hasConsonants) {
    return convertConsonantsToPattern(noSpaceQuery);
  }
  
  return noSpaceQuery;
}

// Search function with Korean optimizations
export function searchProducts(
  fuse: Fuse<Product>,
  query: string,
  options?: {
    limit?: number;
    scoreThreshold?: number;
  }
): Product[] {
  if (!query || query.trim() === '') {
    return [];
  }

  const { limit = 50, scoreThreshold = 0.5 } = options || {};
  
  // Try original query first
  let results = fuse.search(query, { limit });
  
  // If no results, try processed query
  if (results.length === 0) {
    const processedQuery = processSearchQuery(query);
    results = fuse.search(processedQuery, { limit });
  }
  
  // If still no results, try no-space fallback
  if (results.length === 0 && query.includes(' ')) {
    const noSpaceQuery = query.replace(/\s+/g, '');
    results = fuse.search(noSpaceQuery, { limit });
  }
  
  // Filter by score threshold and return items
  return results
    .filter(result => result.score !== undefined && result.score <= scoreThreshold)
    .map(result => result.item);
}

// Get search suggestions based on partial query
export function getSearchSuggestions(
  fuse: Fuse<Product>,
  query: string,
  limit: number = 5
): string[] {
  if (!query || query.trim() === '') {
    return [];
  }

  const results = searchProducts(fuse, query, { limit: limit * 2 });
  const suggestions = new Set<string>();
  
  // Add product names
  results.forEach(product => {
    if (suggestions.size < limit) {
      suggestions.add(product.name);
    }
  });
  
  // Add categories if needed
  if (suggestions.size < limit) {
    results.forEach(product => {
      product.categories.forEach(category => {
        if (suggestions.size < limit && category.toLowerCase().includes(query.toLowerCase())) {
          suggestions.add(category);
        }
      });
    });
  }
  
  return Array.from(suggestions).slice(0, limit);
}