'use client';

import { Suspense } from 'react';
import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Hero from '@/components/Hero';
import KoreaMap from '@/components/KoreaMap';
import ProductGrid from '@/components/ProductGrid';
import { Product } from '@/src/types';

// Import sample data for development
import sampleProducts from '@/data/samples/sample-products.json';

function HomeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<string | undefined>();
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Calculate product counts by region
  const productCountsByRegion = products.reduce((acc, product) => {
    acc[product.mall_region] = (acc[product.mall_region] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Load products and handle URL parameters
  useEffect(() => {
    // In production, this would load from /data/products/all-products.json
    setProducts(sampleProducts.products);
    
    // Check for region parameter in URL
    const regionParam = searchParams?.get('region');
    if (regionParam) {
      setSelectedRegion(regionParam);
      filterProducts(searchQuery, regionParam);
    } else {
      setFilteredProducts(sampleProducts.products);
    }
    
    setIsLoading(false);
  }, [searchParams]);

  // Filter products by search and region
  const filterProducts = (query: string, region?: string) => {
    let filtered = products;
    
    if (query) {
      const queryLower = query.toLowerCase();
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(queryLower) ||
        product.mall_name.toLowerCase().includes(queryLower) ||
        product.categories.some(cat => cat.toLowerCase().includes(queryLower))
      );
    }
    
    if (region) {
      filtered = filtered.filter(product => product.mall_region === region);
    }
    
    setFilteredProducts(filtered);
  };

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    filterProducts(query, selectedRegion);
  };

  // Handle region click
  const handleRegionClick = (region: string) => {
    const params = new URLSearchParams(searchParams?.toString() || '');
    
    if (selectedRegion === region) {
      // Deselect if clicking the same region
      setSelectedRegion(undefined);
      params.delete('region');
      filterProducts(searchQuery, undefined);
    } else {
      // Select new region
      setSelectedRegion(region);
      params.set('region', region);
      filterProducts(searchQuery, region);
    }
    
    // Update URL
    const newUrl = params.toString() ? `/?${params.toString()}` : '/';
    router.push(newUrl);
  };

  // Update filters when products or search params change
  useEffect(() => {
    filterProducts(searchQuery, selectedRegion);
  }, [products, searchQuery, selectedRegion]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Hero onSearch={handleSearch} />
      
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            지역별 상품 둘러보기
          </h2>
          
          <div className="max-w-4xl mx-auto mb-8">
            <KoreaMap 
              onRegionClick={handleRegionClick}
              productCounts={productCountsByRegion}
              selectedRegion={selectedRegion}
            />
          </div>
          
          {selectedRegion && (
            <div className="text-center mb-8">
              <p className="text-lg text-gray-600">
                선택한 지역: <span className="font-semibold">{selectedRegion}</span>
              </p>
              <button
                onClick={() => handleRegionClick(selectedRegion)}
                className="text-primary hover:underline mt-2"
              >
                전체 지역 보기
              </button>
            </div>
          )}
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">
              {selectedRegion ? `${selectedRegion} 지역 상품` : '인기 상품'}
            </h2>
            <Link 
              href="/search" 
              className="text-primary hover:underline"
            >
              모든 상품 보기 →
            </Link>
          </div>
          
          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : filteredProducts.length > 0 ? (
            <ProductGrid products={filteredProducts.slice(0, 12)} />
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">
                {selectedRegion 
                  ? `${selectedRegion} 지역에 등록된 상품이 없습니다.`
                  : '등록된 상품이 없습니다.'
                }
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            전국 지자체 쇼핑몰을 한 곳에서
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            100개 이상의 지자체 쇼핑몰 상품을 편리하게 검색하고 구매하세요
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/search"
              className="bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary/90 transition-colors"
            >
              상품 검색하기
            </Link>
            <Link
              href="/malls"
              className="bg-white text-primary px-8 py-3 rounded-lg border-2 border-primary hover:bg-gray-50 transition-colors"
            >
              쇼핑몰 둘러보기
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50">
        <div className="animate-pulse">
          <div className="h-96 bg-gray-200"></div>
          <div className="container mx-auto px-4 py-16">
            <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-12"></div>
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}