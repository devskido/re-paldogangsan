'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import ProductGrid from '@/components/ProductGrid';
import CategoryTag from '@/components/CategoryTag';
import { Product } from '@/src/types';

// Import sample data for development
import sampleProducts from '@/data/samples/sample-products.json';

// Category slug mapping (URL-friendly to display name)
const CATEGORY_NAMES: Record<string, string> = {
  'agricultural': '농산물',
  'fruits': '과일',
  'seafood': '수산물',
  'processed-food': '가공식품',
  'livestock': '축산물',
  'meat': '정육',
  'vegetables': '채소',
  'traditional': '전통식품',
  'snacks': '간식',
  'beverages': '음료',
  'health': '건강식품',
  'organic': '유기농'
};

// Reverse mapping for Korean to slug
const CATEGORY_SLUGS: Record<string, string> = Object.entries(CATEGORY_NAMES).reduce(
  (acc, [slug, name]) => ({ ...acc, [name]: slug }),
  {}
);

export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();
  const categorySlug = params?.slug as string;
  const [products, setProducts] = useState<Product[]>([]);
  const [relatedCategories, setRelatedCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Get category display name
  const categoryName = CATEGORY_NAMES[categorySlug] || decodeURIComponent(categorySlug);

  useEffect(() => {
    // Filter products by category
    const filteredProducts = sampleProducts.products.filter(product =>
      product.categories.some(cat => 
        CATEGORY_SLUGS[cat] === categorySlug || cat === categoryName
      )
    );

    setProducts(filteredProducts);

    // Find related categories (categories that appear with this category)
    const relatedCats = new Set<string>();
    filteredProducts.forEach(product => {
      product.categories.forEach(cat => {
        if (cat !== categoryName && CATEGORY_SLUGS[cat] !== categorySlug) {
          relatedCats.add(cat);
        }
      });
    });

    setRelatedCategories(Array.from(relatedCats));
    setIsLoading(false);
  }, [categorySlug, categoryName]);

  // Calculate category counts for all products
  const allCategoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    sampleProducts.products.forEach(product => {
      product.categories.forEach(cat => {
        counts[cat] = (counts[cat] || 0) + 1;
      });
    });
    return counts;
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">카테고리 상품을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => router.back()}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="뒤로 가기"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{categoryName}</h1>
              <p className="text-gray-600 mt-1">
                총 {products.length}개 상품
              </p>
            </div>
          </div>

          {/* Current Category Tag */}
          <div className="mb-6">
            <CategoryTag
              category={categoryName}
              count={products.length}
              isSelected={true}
              onRemove={() => router.push('/')}
              size="lg"
            />
          </div>

          {/* Related Categories */}
          {relatedCategories.length > 0 && (
            <div>
              <h2 className="text-sm font-medium text-gray-700 mb-3">관련 카테고리</h2>
              <div className="flex flex-wrap gap-2">
                {relatedCategories.map(cat => {
                  const slug = CATEGORY_SLUGS[cat] || encodeURIComponent(cat);
                  return (
                    <CategoryTag
                      key={cat}
                      category={cat}
                      count={allCategoryCounts[cat]}
                      href={`/category/${slug}`}
                      size="sm"
                    />
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Product Grid */}
      <ProductGrid
        products={products}
        title={`${categoryName} 상품`}
        onProductClick={(product) => window.open(product.product_url, '_blank')}
      />

      {/* All Categories Link */}
      <div className="text-center py-8">
        <Link
          href="/categories"
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          모든 카테고리 보기 →
        </Link>
      </div>
    </main>
  );
}