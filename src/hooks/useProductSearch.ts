import { useState, useEffect, useCallback, useMemo } from 'react';
import Fuse from 'fuse.js';
import { Product } from '@/src/types';
import { createSearchInstance, searchProducts, getSearchSuggestions } from '@/src/lib/search';

interface UseProductSearchProps {
  products: Product[];
  initialQuery?: string;
  limit?: number;
  scoreThreshold?: number;
}

interface UseProductSearchReturn {
  query: string;
  setQuery: (query: string) => void;
  results: Product[];
  suggestions: string[];
  isSearching: boolean;
  resultCount: number;
  clearSearch: () => void;
}

export function useProductSearch({
  products,
  initialQuery = '',
  limit = 50,
  scoreThreshold = 0.5
}: UseProductSearchProps): UseProductSearchReturn {
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<Product[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Create Fuse instance
  const fuse = useMemo(() => {
    return createSearchInstance(products);
  }, [products]);

  // Debounced search function
  const performSearch = useCallback(
    (searchQuery: string) => {
      setIsSearching(true);
      
      try {
        if (!searchQuery || searchQuery.trim() === '') {
          setResults([]);
          setSuggestions([]);
        } else {
          // Get search results
          const searchResults = searchProducts(fuse, searchQuery, {
            limit,
            scoreThreshold
          });
          setResults(searchResults);
          
          // Get suggestions for autocomplete
          const searchSuggestions = getSearchSuggestions(fuse, searchQuery, 5);
          setSuggestions(searchSuggestions);
        }
      } finally {
        setIsSearching(false);
      }
    },
    [fuse, limit, scoreThreshold]
  );

  // Debounce search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      performSearch(query);
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [query, performSearch]);

  // Clear search
  const clearSearch = useCallback(() => {
    setQuery('');
    setResults([]);
    setSuggestions([]);
  }, []);

  return {
    query,
    setQuery,
    results,
    suggestions,
    isSearching,
    resultCount: results.length,
    clearSearch
  };
}