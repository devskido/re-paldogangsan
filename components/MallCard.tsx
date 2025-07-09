import { Mall } from '@/src/types/mall';
import { ExternalLink, MapPin, Package, Calendar, Tag } from 'lucide-react';
import Image from 'next/image';
import { REGION_NAMES } from '@/src/types/mall';

interface MallCardProps {
  mall: Mall;
}

export default function MallCard({ mall }: MallCardProps) {
  const regionName = REGION_NAMES[mall.region as keyof typeof REGION_NAMES] || mall.region;
  
  // Format last updated date
  const lastUpdated = new Date(mall.last_updated).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const handleVisitMall = () => {
    window.open(mall.url, '_blank');
  };

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      {/* Mall Header with Logo */}
      <div className="p-6">
        <div className="flex items-start gap-4">
          {/* Logo */}
          <div className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
            {mall.logo_url ? (
              <Image
                src={mall.logo_url}
                alt={`${mall.name} 로고`}
                fill
                className="object-contain p-2"
                onError={(e) => {
                  e.currentTarget.src = '/images/placeholder-mall.svg';
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Package className="w-8 h-8 text-gray-400" />
              </div>
            )}
          </div>
          
          {/* Mall Info */}
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 mb-1">
              {mall.name}
            </h3>
            
            {/* Status Badge */}
            <div className="flex items-center gap-2 mb-2">
              <span
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  mall.status === 'active'
                    ? 'bg-green-100 text-green-800'
                    : mall.status === 'inactive'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                {mall.status === 'active' ? '운영중' : mall.status === 'inactive' ? '일시중단' : '오류'}
              </span>
              
              <div className="flex items-center text-sm text-gray-500">
                <MapPin className="w-3 h-3 mr-1" />
                {regionName}
              </div>
            </div>
            
            {/* Description */}
            {mall.description && (
              <p className="text-sm text-gray-600 line-clamp-2">
                {mall.description}
              </p>
            )}
          </div>
        </div>
        
        {/* Stats */}
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">등록 상품</span>
              <Package className="w-4 h-4 text-gray-400" />
            </div>
            <p className="text-xl font-bold text-gray-900 mt-1">
              {mall.product_count.toLocaleString()}
            </p>
          </div>
          
          {mall.featured_products && (
            <div className="bg-blue-50 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">추천 상품</span>
                <Tag className="w-4 h-4 text-blue-400" />
              </div>
              <p className="text-xl font-bold text-blue-600 mt-1">
                {mall.featured_products}
              </p>
            </div>
          )}
        </div>
        
        {/* Categories */}
        {mall.categories && mall.categories.length > 0 && (
          <div className="mt-4">
            <div className="flex flex-wrap gap-1">
              {mall.categories.slice(0, 4).map((category, index) => (
                <span
                  key={index}
                  className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded"
                >
                  {category}
                </span>
              ))}
              {mall.categories.length > 4 && (
                <span className="inline-block text-gray-400 text-xs px-1">
                  +{mall.categories.length - 4}
                </span>
              )}
            </div>
          </div>
        )}
        
        {/* Footer */}
        <div className="mt-4 pt-4 border-t flex items-center justify-between">
          <div className="text-xs text-gray-500">
            <Calendar className="inline w-3 h-3 mr-1" />
            업데이트: {lastUpdated}
          </div>
          
          {mall.opening_year && (
            <div className="text-xs text-gray-500">
              {mall.opening_year}년 개설
            </div>
          )}
        </div>
      </div>
      
      {/* Action Button */}
      <div className="px-6 pb-6">
        <button
          onClick={handleVisitMall}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          쇼핑몰 방문하기
          <ExternalLink className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}