'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import SearchBar from '@/components/SearchBar';
import SearchResults from '@/components/SearchResults';
import { useProductSearch } from '@/src/hooks/useProductSearch';
import { Product } from '@/src/types';

// Import sample data for development
import sampleProducts from '@/data/samples/sample-products.json';

export default function SearchPage() {
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

  const handleProductClick = (product: Product) => {
    window.open(product.product_url, '_blank');
  };

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">검색 준비 중...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Search Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">상품 검색</h1>
          
          <SearchBar
            value={query}
            onChange={setQuery}
            suggestions={suggestions}
            onSuggestionClick={setQuery}
            isLoading={isSearching}
            autoFocus={true}
            className="max-w-2xl"
          />
          
          {/* Quick stats */}
          {query && !isSearching && (
            <div className="mt-4 text-sm text-gray-600">
              {resultCount > 0 ? (
                <>총 <span className="font-medium">{resultCount}</span>개의 검색 결과</>
              ) : (
                '검색 결과가 없습니다'
              )}
            </div>
          )}
        </div>
      </div>

      {/* Search Results */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {query ? (
          <SearchResults
            query={query}
            results={results}
            isSearching={isSearching}
            onProductClick={handleProductClick}
          />
        ) : (
          <div className="text-center py-12">
            <h2 className="text-lg font-medium text-gray-900 mb-2">
              검색어를 입력해 주세요
            </h2>
            <p className="text-gray-600">
              상품명, 몰 이름, 카테고리로 검색할 수 있습니다
            </p>
            
            {/* Popular searches */}
            <div className="mt-8">
              <h3 className="text-sm font-medium text-gray-700 mb-3">인기 검색어</h3>
              <div className="flex flex-wrap gap-2 justify-center">
                {['한우', '사과', '인삼', '막걸리', '김치', '전통주'].map((term) => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full 
                             text-sm text-gray-700 transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}