'use client';

import { Suspense } from 'react';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import SearchBar from '@/components/SearchBar';
import SearchResults from '@/components/SearchResults';
import { useProductSearch } from '@/src/hooks/useProductSearch';
import { Product } from '@/src/types';

// Import sample data for development
import sampleProducts from '@/data/samples/sample-products.json';

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams?.get('q') || '';
  const [products, setProducts] = useState<Product[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load products
  useEffect(() => {
    setProducts(sampleProducts.products);
    setIsInitialized(true);
  }, []);

  // Use search hook
  const {
    query,
    setQuery,
    results,
    suggestions,
    isSearching,
    resultCount
  } = useProductSearch({
    products,
    initialQuery,
    limit: 100,
    scoreThreshold: 0.5
  });

  // Update URL when query changes
  useEffect(() => {
    const params = new URLSearchParams(searchParams?.toString() || '');
    if (query) {
      params.set('q', query);
    } else {
      params.delete('q');
    }
    
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, '', newUrl);
  }, [query, searchParams]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">상품 검색</h1>
          <SearchBar
            value={query}
            onChange={setQuery}
            suggestions={suggestions}
            placeholder="상품명, 지역, 카테고리로 검색하세요..."
            autoFocus
            className="text-lg"
          />
        </div>

        <SearchResults
          results={results}
          query={query}
          isSearching={isSearching}
          resultCount={resultCount}
          totalCount={products.length}
        />
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">상품 검색</h1>
            <div className="animate-pulse">
              <div className="h-12 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}