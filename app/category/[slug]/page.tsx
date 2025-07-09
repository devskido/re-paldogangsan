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
const KOREAN_TO_SLUG: Record<string, string> = Object.entries(CATEGORY_NAMES).reduce(
  (acc, [slug, korean]) => ({ ...acc, [korean]: slug }),
  {}
);

export async function generateStaticParams() {
  // Generate params for all known categories
  return Object.keys(CATEGORY_NAMES).map((slug) => ({
    slug: slug,
  }));
}

export default function CategoryPage({
  params,
}: {
  params: { slug: string };
}) {
  const categoryName = CATEGORY_NAMES[params.slug] || decodeURIComponent(params.slug);
  
  // Filter products by category
  const products: Product[] = sampleProducts.products as Product[];
  const categoryProducts = products.filter(product => 
    product.categories.includes(categoryName) || 
    product.categories.some(cat => KOREAN_TO_SLUG[cat] === params.slug)
  );

  // Get related categories
  const relatedCategories = new Set<string>();
  categoryProducts.forEach(product => {
    product.categories.forEach(cat => {
      if (cat !== categoryName) {
        relatedCategories.add(cat);
      }
    });
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link 
            href="/categories" 
            className="inline-flex items-center text-primary hover:underline mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            카테고리 목록으로
          </Link>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {categoryName}
          </h1>
          
          <p className="text-gray-600">
            {categoryProducts.length}개 상품
          </p>
        </div>

        {relatedCategories.size > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-3">관련 카테고리</h2>
            <div className="flex flex-wrap gap-2">
              {Array.from(relatedCategories).map(category => (
                <CategoryTag key={category} category={category} />
              ))}
            </div>
          </div>
        )}

        {categoryProducts.length > 0 ? (
          <ProductGrid products={categoryProducts} />
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">
              해당 카테고리에 상품이 없습니다.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
