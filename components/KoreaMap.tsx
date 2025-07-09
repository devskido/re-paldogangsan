'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';

const SouthKoreaMapChart = dynamic(
  () => import('react-simple-south-korea-map-chart').then(mod => mod.default || mod),
  { ssr: false }
) as any;
import { REGION_NAMES } from '@/src/types/mall';

interface KoreaMapProps {
  onRegionClick?: (regionId: string) => void;
  productCounts?: Record<string, number>;
  selectedRegion?: string;
}

export default function KoreaMap({ onRegionClick, productCounts = {}, selectedRegion }: KoreaMapProps) {
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);

  // Map component region IDs to our region codes
  const regionMapping: Record<string, string> = {
    'seoul': 'seoul',
    'busan': 'busan',
    'daegu': 'daegu',
    'incheon': 'incheon',
    'gwangju': 'gwangju',
    'daejeon': 'daejeon',
    'ulsan': 'ulsan',
    'sejong': 'sejong',
    'gyeonggi-do': 'gyeonggi',
    'gangwon-do': 'gangwon',
    'chungcheongbuk-do': 'chungbuk',
    'chungcheongnam-do': 'chungnam',
    'jeollabuk-do': 'jeonbuk',
    'jeollanam-do': 'jeonnam',
    'gyeongsangbuk-do': 'gyeongbuk',
    'gyeongsangnam-do': 'gyeongnam',
    'jeju': 'jeju'
  };

  const handleRegionClick = (regionId: string) => {
    const mappedRegion = regionMapping[regionId] || regionId;
    if (onRegionClick) {
      onRegionClick(mappedRegion);
    }
  };

  const getRegionColor = (regionId: string) => {
    const mappedRegion = regionMapping[regionId] || regionId;
    
    // Selected region
    if (selectedRegion === mappedRegion) {
      return '#1E40AF'; // blue-800
    }
    
    // Hovered region
    if (hoveredRegion === regionId) {
      return '#3B82F6'; // blue-500
    }
    
    // Color based on product count
    const count = productCounts[mappedRegion] || 0;
    if (count > 1000) return '#1E40AF'; // blue-800
    if (count > 500) return '#2563EB'; // blue-600
    if (count > 100) return '#3B82F6'; // blue-500
    if (count > 0) return '#60A5FA'; // blue-400
    return '#F3F4F6'; // gray-100
  };

  return (
    <section className="py-12 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">지역별 상품 찾기</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Map */}
          <div className="lg:col-span-2">
            <div className="bg-gray-50 rounded-lg p-4">
              <SouthKoreaMapChart
                onClick={handleRegionClick}
                onMouseEnter={(regionId: string) => setHoveredRegion(regionId)}
                onMouseLeave={() => setHoveredRegion(null)}
                customStyle={(regionId: string) => ({
                  fill: getRegionColor(regionId),
                  stroke: '#E5E7EB',
                  strokeWidth: 1,
                  cursor: 'pointer',
                  transition: 'fill 0.2s ease'
                })}
              />
            </div>
          </div>
          
          {/* Region Info */}
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">지역 정보</h3>
              
              {selectedRegion ? (
                <div>
                  <p className="text-lg font-medium text-blue-600 mb-2">
                    {REGION_NAMES[selectedRegion as keyof typeof REGION_NAMES]}
                  </p>
                  <p className="text-gray-600 mb-1">
                    등록 상품: {(productCounts[selectedRegion] || 0).toLocaleString()}개
                  </p>
                  <p className="text-sm text-gray-500">
                    클릭하여 해당 지역 상품 보기
                  </p>
                </div>
              ) : (
                <p className="text-gray-500">
                  지도에서 지역을 선택하세요
                </p>
              )}
            </div>
            
            {/* Color Legend */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">상품 수 범례</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-blue-800"></div>
                  <span className="text-sm text-gray-600">1,000개 이상</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-blue-600"></div>
                  <span className="text-sm text-gray-600">500 - 999개</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-blue-500"></div>
                  <span className="text-sm text-gray-600">100 - 499개</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-blue-400"></div>
                  <span className="text-sm text-gray-600">1 - 99개</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-gray-100"></div>
                  <span className="text-sm text-gray-600">등록 예정</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}