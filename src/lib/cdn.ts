/**
 * Utility functions for CDN image optimization
 * Uses Cloudflare Images for image delivery and optimization
 */

// Cloudflare Images configuration
const CLOUDFLARE_ACCOUNT_HASH = process.env.NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_HASH || 'your-account-hash';
const CLOUDFLARE_IMAGES_URL = `https://imagedelivery.net/${CLOUDFLARE_ACCOUNT_HASH}`;

// Cloudflare image variants
export const CF_VARIANTS = {
  thumbnail: 'thumbnail', // 150x150
  small: 'small',        // 320x320
  medium: 'medium',      // 640x640
  large: 'large',        // 1280x1280
  public: 'public',      // Original size
} as const;

export type CloudflareVariant = typeof CF_VARIANTS[keyof typeof CF_VARIANTS];

/**
 * Convert a local image URL to Cloudflare CDN URL
 * @param imageUrl - The original image URL or Cloudflare image ID
 * @param variant - The Cloudflare variant to use
 * @returns Optimized CDN URL
 */
export function getCDNImageUrl(
  imageUrl: string, 
  variant: CloudflareVariant = CF_VARIANTS.public
): string {
  // If already a CDN URL, return as is
  if (imageUrl.includes('imagedelivery.net') || imageUrl.includes('cloudflare')) {
    return imageUrl;
  }
  
  // If it's an external URL, we can optionally proxy through Cloudflare
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    // For now, return as is. In production, you might want to proxy these
    return imageUrl;
  }
  
  // Extract image ID from path or use as is
  const imageId = imageUrl.replace(/^\/+/, '').replace(/\.[^/.]+$/, '');
  
  // Construct Cloudflare Images URL
  return `${CLOUDFLARE_IMAGES_URL}/${imageId}/${variant}`;
}

/**
 * Get optimized image URL with specific dimensions using Cloudflare variants
 * @param imageUrl - The original image URL
 * @param width - Desired width to determine variant
 * @param height - Desired height to determine variant
 * @returns CDN URL with appropriate variant
 */
export function getOptimizedImageUrl(
  imageUrl: string,
  width?: number,
  height?: number
): string {
  // Determine best variant based on requested dimensions
  let variant: CloudflareVariant = CF_VARIANTS.public;
  
  if (width || height) {
    const size = Math.max(width || 0, height || 0);
    
    if (size <= 150) {
      variant = CF_VARIANTS.thumbnail;
    } else if (size <= 320) {
      variant = CF_VARIANTS.small;
    } else if (size <= 640) {
      variant = CF_VARIANTS.medium;
    } else if (size <= 1280) {
      variant = CF_VARIANTS.large;
    }
  }
  
  return getCDNImageUrl(imageUrl, variant);
}

/**
 * Generate srcset for responsive images using Cloudflare variants
 * @param imageUrl - The original image URL
 * @returns srcset string with Cloudflare variants
 */
export function generateSrcSet(imageUrl: string): string {
  // If it's an external URL, return single source
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return `${imageUrl} 1x`;
  }
  
  // Generate srcset with Cloudflare variants
  return [
    `${getCDNImageUrl(imageUrl, CF_VARIANTS.thumbnail)} 150w`,
    `${getCDNImageUrl(imageUrl, CF_VARIANTS.small)} 320w`,
    `${getCDNImageUrl(imageUrl, CF_VARIANTS.medium)} 640w`,
    `${getCDNImageUrl(imageUrl, CF_VARIANTS.large)} 1280w`,
  ].join(', ');
}

/**
 * Check if we should use CDN for this image
 * @param imageUrl - The image URL to check
 * @returns boolean indicating if CDN should be used
 */
export function shouldUseCDN(imageUrl: string): boolean {
  // Don't use CDN for data URLs or blob URLs
  if (imageUrl.startsWith('data:') || imageUrl.startsWith('blob:')) {
    return false;
  }
  
  // Don't use CDN for already optimized URLs
  if (
    imageUrl.includes('imagedelivery.net') || 
    imageUrl.includes('cloudflare') ||
    imageUrl.includes('cdn.')
  ) {
    return false;
  }
  
  // Use CDN for local images
  return !imageUrl.startsWith('http://') && !imageUrl.startsWith('https://');
}

/**
 * Get Cloudflare Image Upload URL
 * This would be used server-side to upload images to Cloudflare
 * @returns Upload endpoint URL
 */
export function getCloudflareUploadUrl(): string {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;
  
  if (!accountId || !apiToken) {
    throw new Error('Cloudflare credentials not configured');
  }
  
  return `https://api.cloudflare.com/client/v4/accounts/${accountId}/images/v1`;
}