'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import SearchBar from './SearchBar';

interface HeroProps {
  onSearch?: (query: string) => void;
  totalMalls?: number;
  totalProducts?: number;
}

export default function Hero({ onSearch, totalMalls = 100, totalProducts = 50000 }: HeroProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearch = (query: string) => {
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-16 px-4">
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
          대한민국 지자체 쇼핑몰
          <span className="block text-blue-600 mt-2">모든 상품을 한 곳에서</span>
        </h1>
        
        <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-3xl mx-auto">
          전국 {totalMalls}개 이상의 지자체 쇼핑몰에서 판매하는 {totalProducts.toLocaleString()}개 이상의 
          지역 특산품을 한 번에 검색하고 찾아보세요
        </p>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onSubmit={handleSearch}
            placeholder="상품명, 지역명, 카테고리로 검색하세요..."
            autoFocus={false}
          />
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-2xl font-bold text-blue-600">{totalMalls}+</div>
            <div className="text-sm text-gray-600">지자체 쇼핑몰</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-2xl font-bold text-blue-600">{totalProducts.toLocaleString()}+</div>
            <div className="text-sm text-gray-600">등록 상품</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-2xl font-bold text-blue-600">17</div>
            <div className="text-sm text-gray-600">전국 시·도</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-2xl font-bold text-blue-600">실시간</div>
            <div className="text-sm text-gray-600">업데이트</div>
          </div>
        </div>
      </div>
    </section>
  );
}