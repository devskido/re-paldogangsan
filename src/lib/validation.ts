import { Product, Mall, SearchIndex, Region, REGION_NAMES } from '@/src/types';

export class ValidationError extends Error {
  constructor(message: string, public field?: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export function validateProduct(product: any): Product {
  const errors: string[] = [];

  // Required fields
  if (!product.id || typeof product.id !== 'string') {
    errors.push('Invalid or missing id');
  }
  if (!product.name || typeof product.name !== 'string') {
    errors.push('Invalid or missing name');
  }
  if (typeof product.price !== 'number' || product.price < 0) {
    errors.push('Invalid or missing price');
  }
  if (!product.image_url || typeof product.image_url !== 'string') {
    errors.push('Invalid or missing image_url');
  }
  if (!product.mall_name || typeof product.mall_name !== 'string') {
    errors.push('Invalid or missing mall_name');
  }
  if (!product.mall_id || typeof product.mall_id !== 'string') {
    errors.push('Invalid or missing mall_id');
  }
  if (!product.mall_engname || typeof product.mall_engname !== 'string') {
    errors.push('Invalid or missing mall_engname');
  }
  if (!product.mall_region || !isValidRegion(product.mall_region)) {
    errors.push('Invalid or missing mall_region');
  }
  if (!product.product_url || typeof product.product_url !== 'string') {
    errors.push('Invalid or missing product_url');
  }
  if (!Array.isArray(product.categories)) {
    errors.push('Invalid or missing categories array');
  }
  if (!product.search_text || typeof product.search_text !== 'string') {
    errors.push('Invalid or missing search_text');
  }
  if (!product.created_at || !isValidDate(product.created_at)) {
    errors.push('Invalid or missing created_at timestamp');
  }

  if (errors.length > 0) {
    throw new ValidationError(`Product validation failed: ${errors.join(', ')}`);
  }

  return product as Product;
}

export function validateMall(mall: any): Mall {
  const errors: string[] = [];

  if (!mall.id || typeof mall.id !== 'string') {
    errors.push('Invalid or missing id');
  }
  if (!mall.name || typeof mall.name !== 'string') {
    errors.push('Invalid or missing name');
  }
  if (!mall.engname || typeof mall.engname !== 'string') {
    errors.push('Invalid or missing engname');
  }
  if (!mall.region || !isValidRegion(mall.region)) {
    errors.push('Invalid or missing region');
  }
  if (!mall.url || typeof mall.url !== 'string' || !isValidUrl(mall.url)) {
    errors.push('Invalid or missing url');
  }
  if (typeof mall.product_count !== 'number' || mall.product_count < 0) {
    errors.push('Invalid or missing product_count');
  }
  if (!mall.last_updated || !isValidDate(mall.last_updated)) {
    errors.push('Invalid or missing last_updated timestamp');
  }
  if (!['active', 'inactive', 'error'].includes(mall.status)) {
    errors.push('Invalid status');
  }

  if (errors.length > 0) {
    throw new ValidationError(`Mall validation failed: ${errors.join(', ')}`);
  }

  return mall as Mall;
}

export function validateSearchIndex(index: any): SearchIndex {
  const errors: string[] = [];

  if (!index.version || typeof index.version !== 'string') {
    errors.push('Invalid or missing version');
  }
  if (!index.created_at || !isValidDate(index.created_at)) {
    errors.push('Invalid or missing created_at timestamp');
  }
  if (!index.index || typeof index.index !== 'object') {
    errors.push('Invalid or missing index object');
  }

  if (errors.length > 0) {
    throw new ValidationError(`SearchIndex validation failed: ${errors.join(', ')}`);
  }

  return index as SearchIndex;
}

// Helper functions
function isValidRegion(region: string): region is Region {
  return Object.keys(REGION_NAMES).includes(region);
}

function isValidDate(dateString: string): boolean {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
}

function isValidUrl(urlString: string): boolean {
  try {
    new URL(urlString);
    return true;
  } catch {
    return false;
  }
}

// Batch validation
export function validateProducts(products: any[]): Product[] {
  return products.map((product, index) => {
    try {
      return validateProduct(product);
    } catch (error) {
      throw new ValidationError(`Product at index ${index}: ${error instanceof Error ? error.message : String(error)}`);
    }
  });
}

export function validateMalls(malls: any[]): Mall[] {
  return malls.map((mall, index) => {
    try {
      return validateMall(mall);
    } catch (error) {
      throw new ValidationError(`Mall at index ${index}: ${error instanceof Error ? error.message : String(error)}`);
    }
  });
}