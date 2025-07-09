'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import ProductGrid from '@/components/ProductGrid';
import CategoryTag from '@/components/CategoryTag';
import TagCloud from '@/components/TagCloud';
import { Product } from '@/src/types';

// Import sample data for development
import sampleProducts from '@/data/samples/sample-products.json';

type FilterMode = 'AND' | 'OR';

export default function CategoriesPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());
  const [filterMode, setFilterMode] = useState<FilterMode>('OR');
  const [isLoading, setIsLoading] = useState(true);

  // Calculate category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    sampleProducts.products.forEach(product => {
      product.categories.forEach(cat => {
        counts[cat] = (counts[cat] || 0) + 1;
      });
    });
    return counts;
  }, []);

  // Get all unique categories sorted by count
  const allCategories = useMemo(() => {
    return Object.entries(categoryCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([category]) => category);
  }, [categoryCounts]);

  // Filter products based on selected categories
  useEffect(() => {
    if (selectedCategories.size === 0) {
      setProducts(sampleProducts.products);
    } else {
      const filtered = sampleProducts.products.filter(product => {
        const productCategories = new Set(product.categories);
        
        if (filterMode === 'AND') {
          // Product must have ALL selected categories
          return Array.from(selectedCategories).every(cat => 
            productCategories.has(cat)
          );
        } else {
          // Product must have AT LEAST ONE selected category
          return Array.from(selectedCategories).some(cat => 
            productCategories.has(cat)
          );
        }
      });
      
      setProducts(filtered);
    }
  }, [selectedCategories, filterMode]);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const toggleCategory = (category: string) => {
    const newSelected = new Set(selectedCategories);
    if (newSelected.has(category)) {
      newSelected.delete(category);
    } else {
      newSelected.add(category);
    }
    setSelectedCategories(newSelected);
  };

  const clearFilters = () => {
    setSelectedCategories(new Set());
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">카테고리를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">카테고리별 상품</h1>
          <p className="text-gray-600">
            원하는 카테고리를 선택하여 상품을 찾아보세요
          </p>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Selected Categories and Controls */}
          {selectedCategories.size > 0 && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-medium text-gray-900">
                  선택된 카테고리 ({selectedCategories.size})
                </h2>
                <div className="flex items-center gap-4">
                  {/* Filter Mode Toggle */}
                  <div className="flex items-center bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setFilterMode('OR')}
                      className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                        filterMode === 'OR'
                          ? 'bg-white text-blue-600 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      하나라도 포함
                    </button>
                    <button
                      onClick={() => setFilterMode('AND')}
                      className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                        filterMode === 'AND'
                          ? 'bg-white text-blue-600 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      모두 포함
                    </button>
                  </div>
                  <button
                    onClick={clearFilters}
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    초기화
                  </button>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {Array.from(selectedCategories).map(category => (
                  <CategoryTag
                    key={category}
                    category={category}
                    isSelected={true}
                    onRemove={() => toggleCategory(category)}
                    size="md"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Tag Cloud */}
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              모든 카테고리
            </h2>
            <TagCloud
              categories={allCategories}
              categoryCounts={categoryCounts}
              selectedCategories={selectedCategories}
              onCategoryClick={toggleCategory}
            />
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="bg-gray-50">
        <ProductGrid
          products={products}
          title={
            selectedCategories.size > 0
              ? `필터링된 상품 (${filterMode === 'AND' ? '모두 포함' : '하나라도 포함'})`
              : '전체 상품'
          }
          onProductClick={(product) => window.open(product.product_url, '_blank')}
        />
      </div>
    </main>
  );
}