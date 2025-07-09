'use client';

import { Product } from '@/src/types';
import ProductCard from './ProductCard';
import { Search } from 'lucide-react';

interface SearchResultsProps {
  query: string;
  results: Product[];
  isSearching: boolean;
  onProductClick?: (product: Product) => void;
}

export default function SearchResults({
  query,
  results,
  isSearching,
  onProductClick
}: SearchResultsProps) {
  if (!query) {
    return null;
  }

  if (isSearching) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">검색 중...</p>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-12">
        <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          검색 결과가 없습니다
        </h3>
        <p className="text-gray-600">
          <span className="font-medium">"{query}"</span>에 대한 상품을 찾을 수 없습니다.
        </p>
        <p className="text-sm text-gray-500 mt-2">
          다른 검색어를 사용해 보세요.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">
          <span className="font-medium">"{query}"</span> 검색 결과
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          총 {results.length}개의 상품을 찾았습니다
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {results.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onClick={onProductClick}
          />
        ))}
      </div>
    </div>
  );
}