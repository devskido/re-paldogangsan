'use client';

import { useState, useMemo } from 'react';
import { Product } from '@/src/types';
import ProductCard from './ProductCard';
import Pagination from './Pagination';

interface ProductGridProps {
  products: Product[];
  title?: string;
  itemsPerPage?: number;
  onProductClick?: (product: Product) => void;
}

export default function ProductGrid({ 
  products, 
  title = "전체 상품", 
  itemsPerPage = 24,
  onProductClick 
}: ProductGridProps) {
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate pagination
  const totalPages = Math.ceil(products.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = useMemo(
    () => products.slice(startIndex, endIndex),
    [products, startIndex, endIndex]
  );

  return (
    <section className="py-12 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
            <p className="text-gray-600 mt-1">
              총 {products.length.toLocaleString()}개 상품
            </p>
          </div>
          
          {/* Sort/Filter options can be added here */}
        </div>

        {/* Product Grid */}
        {currentProducts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {currentProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onClick={onProductClick}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">상품이 없습니다.</p>
          </div>
        )}
      </div>
    </section>
  );
}