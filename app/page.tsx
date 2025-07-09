'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Hero from '@/components/Hero';
import KoreaMap from '@/components/KoreaMap';
import ProductGrid from '@/components/ProductGrid';
import { Product } from '@/src/types';

// Import sample data for development
import sampleProducts from '@/data/samples/sample-products.json';

export default function Home() {
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

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    filterProducts(query, selectedRegion);
  };

  // Handle region selection
  const handleRegionClick = (regionId: string) => {
    const newRegion = selectedRegion === regionId ? undefined : regionId;
    setSelectedRegion(newRegion);
    
    // Update URL with region parameter
    const params = new URLSearchParams(searchParams?.toString() || '');
    if (newRegion) {
      params.set('region', newRegion);
    } else {
      params.delete('region');
    }
    router.push(`/?${params.toString()}`);
    
    filterProducts(searchQuery, newRegion);
  };

  // Filter products based on search and region
  const filterProducts = (search: string, region?: string) => {
    let filtered = products;

    // Filter by region
    if (region) {
      filtered = filtered.filter(p => p.mall_region === region);
    }

    // Filter by search query
    if (search) {
      const query = search.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(query) ||
        p.mall_name.toLowerCase().includes(query) ||
        p.categories.some(c => c.toLowerCase().includes(query)) ||
        p.search_text?.toLowerCase().includes(query)
      );
    }

    setFilteredProducts(filtered);
  };

  // Handle product click
  const handleProductClick = (product: Product) => {
    // Open product URL in new tab
    window.open(product.product_url, '_blank');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">상품을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <Hero 
        onSearch={handleSearch}
        totalMalls={sampleProducts.metadata.total_malls}
        totalProducts={sampleProducts.metadata.total_products}
      />

      {/* Korea Map */}
      <KoreaMap
        onRegionClick={handleRegionClick}
        productCounts={productCountsByRegion}
        selectedRegion={selectedRegion}
      />

      {/* Categories Link */}
      <div className="text-center py-8 bg-white">
        <Link
          href="/categories"
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          카테고리별 상품 보기 →
        </Link>
      </div>

      {/* Product Grid */}
      <ProductGrid
        products={filteredProducts}
        title={
          selectedRegion 
            ? `${selectedRegion} 지역 상품` 
            : searchQuery 
            ? `"${searchQuery}" 검색 결과`
            : "전체 상품"
        }
        onProductClick={handleProductClick}
      />
    </main>
  );
}