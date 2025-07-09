import { Product } from '@/src/types';
import { MapPin, ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { REGION_NAMES } from '@/src/types/mall';

interface ProductCardProps {
  product: Product;
  onClick?: (product: Product) => void;
}

export default function ProductCard({ product, onClick }: ProductCardProps) {
  const handleClick = () => {
    if (onClick) {
      onClick(product);
    } else {
      // Open product URL in new tab
      window.open(product.product_url, '_blank');
    }
  };

  const regionName = REGION_NAMES[product.mall_region as keyof typeof REGION_NAMES] || product.mall_region;

  return (
    <div 
      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden group"
      onClick={handleClick}
    >
      {/* Product Image */}
      <div className="relative h-48 w-full overflow-hidden bg-gray-100">
        <Image
          src={product.image_url}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          onError={(e) => {
            // Fallback for broken images
            e.currentTarget.src = '/images/placeholder-product.svg';
          }}
        />
        
        {/* Region Badge */}
        <div className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
          <MapPin className="w-3 h-3" />
          {regionName}
        </div>
      </div>
      
      {/* Product Info */}
      <div className="p-4">
        <h3 className="font-medium text-gray-900 mb-1 line-clamp-2 min-h-[48px]">
          {product.name}
        </h3>
        
        <p className="text-sm text-gray-500 mb-2">
          {product.mall_name}
        </p>
        
        {/* Categories */}
        <div className="flex flex-wrap gap-1 mb-3">
          {product.categories.slice(0, 2).map((category, index) => (
            <Link
              key={index}
              href={`/category/${encodeURIComponent(category)}`}
              className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded hover:bg-gray-200 transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              {category}
            </Link>
          ))}
          {product.categories.length > 2 && (
            <span className="inline-block text-gray-400 text-xs px-1">
              +{product.categories.length - 2}
            </span>
          )}
        </div>
        
        {/* Price and Action */}
        <div className="flex items-center justify-between">
          <div className="text-xl font-bold text-blue-600">
            ₩{product.price.toLocaleString()}
          </div>
          <button
            className="p-2 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
            aria-label="상품 보기"
            onClick={(e) => {
              e.stopPropagation();
              handleClick();
            }}
          >
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}