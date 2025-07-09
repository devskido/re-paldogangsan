'use client';

import { useState, useEffect, useMemo } from 'react';
import MallCard from '@/components/MallCard';
import SearchBar from '@/components/SearchBar';
import { Mall, MallsData } from '@/src/types/mall';
import { REGION_NAMES } from '@/src/types/mall';
import { Filter, ArrowUpDown, Store } from 'lucide-react';

// Import sample data for development
import sampleMalls from '@/data/samples/sample-malls.json';

type SortOption = 'name' | 'product_count' | 'last_updated' | 'opening_year';
type StatusFilter = 'all' | 'active' | 'inactive' | 'error';

export default function MallsPage() {
  const [malls, setMalls] = useState<Mall[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [sortBy, setSortBy] = useState<SortOption>('product_count');
  const [isLoading, setIsLoading] = useState(true);

  // Load malls data
  useEffect(() => {
    const mallsData = sampleMalls as MallsData;
    setMalls(mallsData.malls);
    setIsLoading(false);
  }, []);

  // Filter and sort malls
  const filteredMalls = useMemo(() => {
    let filtered = [...malls];

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(mall => 
        mall.name.toLowerCase().includes(query) ||
        mall.description?.toLowerCase().includes(query) ||
        mall.categories?.some(cat => cat.toLowerCase().includes(query))
      );
    }

    // Filter by region
    if (selectedRegion !== 'all') {
      filtered = filtered.filter(mall => mall.region === selectedRegion);
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(mall => mall.status === statusFilter);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name, 'ko');
        case 'product_count':
          return b.product_count - a.product_count;
        case 'last_updated':
          return new Date(b.last_updated).getTime() - new Date(a.last_updated).getTime();
        case 'opening_year':
          return (b.opening_year || 0) - (a.opening_year || 0);
        default:
          return 0;
      }
    });

    return filtered;
  }, [malls, searchQuery, selectedRegion, statusFilter, sortBy]);

  // Get unique regions
  const regions = useMemo(() => {
    const uniqueRegions = Array.from(new Set(malls.map(mall => mall.region)));
    return uniqueRegions.sort();
  }, [malls]);

  // Get mall stats
  const stats = useMemo(() => {
    const activeMalls = malls.filter(m => m.status === 'active').length;
    const totalProducts = malls.reduce((sum, mall) => sum + mall.product_count, 0);
    return { activeMalls, totalProducts };
  }, [malls]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">쇼핑몰 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              지자체 쇼핑몰 목록
            </h1>
            <p className="text-gray-600">
              전국 {malls.length}개 지자체 쇼핑몰에서 {stats.totalProducts.toLocaleString()}개의 상품을 만나보세요
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-6">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="쇼핑몰 이름, 상품 카테고리 검색..."
            />
          </div>

          {/* Filters and Sort */}
          <div className="flex flex-wrap gap-4 justify-center">
            {/* Region Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">모든 지역</option>
                {regions.map(region => (
                  <option key={region} value={region}>
                    {REGION_NAMES[region as keyof typeof REGION_NAMES] || region}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <Store className="w-4 h-4 text-gray-500" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">모든 상태</option>
                <option value="active">운영중</option>
                <option value="inactive">일시중단</option>
                <option value="error">오류</option>
              </select>
            </div>

            {/* Sort Options */}
            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-4 h-4 text-gray-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="product_count">상품 수 많은 순</option>
                <option value="name">이름 순</option>
                <option value="last_updated">최근 업데이트 순</option>
                <option value="opening_year">최근 개설 순</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Results Stats */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <p className="text-sm text-gray-600">
          총 <span className="font-medium">{filteredMalls.length}개</span>의 쇼핑몰이 검색되었습니다
        </p>
      </div>

      {/* Mall Grid */}
      <section className="max-w-7xl mx-auto px-4 pb-12">
        {filteredMalls.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMalls.map((mall) => (
              <MallCard key={mall.id} mall={mall} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Store className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              검색 결과가 없습니다
            </h3>
            <p className="text-gray-600">
              다른 검색어나 필터를 사용해 보세요.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}