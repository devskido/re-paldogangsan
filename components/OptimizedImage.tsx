import Image, { ImageProps } from 'next/image';
import { getCDNImageUrl, shouldUseCDN, generateSrcSet, getOptimizedImageUrl, CF_VARIANTS } from '@/src/lib/cdn';

interface OptimizedImageProps extends Omit<ImageProps, 'src'> {
  src: string;
  fallbackSrc?: string;
  variant?: keyof typeof CF_VARIANTS;
}

/**
 * Optimized Image component that automatically uses Cloudflare CDN
 */
export default function OptimizedImage({
  src,
  fallbackSrc = '/images/placeholder-product.svg',
  alt,
  variant,
  width,
  height,
  ...props
}: OptimizedImageProps) {
  // Determine if we should use CDN
  const shouldOptimize = shouldUseCDN(src);
  
  // Get optimized URL based on dimensions or variant
  const optimizedSrc = shouldOptimize 
    ? variant 
      ? getCDNImageUrl(src, CF_VARIANTS[variant])
      : getOptimizedImageUrl(src, Number(width), Number(height))
    : src;
  
  // Generate srcset for responsive images
  const srcSet = shouldOptimize ? generateSrcSet(src) : undefined;
  
  return (
    <Image
      src={optimizedSrc}
      alt={alt}
      width={width}
      height={height}
      {...props}
      {...(srcSet && { srcSet })}
      onError={(e) => {
        // Use fallback image on error
        if (fallbackSrc && e.currentTarget.src !== fallbackSrc) {
          e.currentTarget.src = fallbackSrc;
        }
      }}
    />
  );
}