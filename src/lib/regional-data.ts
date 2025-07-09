import { Product } from '@/src/types';

// Region codes matching the map component
export const REGION_CODES = [
  'seoul', 'busan', 'daegu', 'incheon', 'gwangju', 'daejeon', 'ulsan', 'sejong',
  'gyeonggi', 'gangwon', 'chungbuk', 'chungnam', 'jeonbuk', 'jeonnam', 
  'gyeongbuk', 'gyeongnam', 'jeju'
] as const;

export type RegionCode = typeof REGION_CODES[number];

// Dynamic import function for regional product data
export async function loadRegionalProducts(region: RegionCode): Promise<Product[]> {
  try {
    // In production, these would be actual regional JSON files
    // For now, we'll filter from the sample data
    const response = await import('@/data/samples/sample-products.json');
    const allProducts = response.default.products as Product[];
    
    return allProducts.filter(product => product.mall_region === region);
  } catch (error) {
    console.error(`Failed to load products for region ${region}:`, error);
    return [];
  }
}

// Load all regional data at once
export async function loadAllRegionalData(): Promise<Record<RegionCode, Product[]>> {
  const regionalData: Partial<Record<RegionCode, Product[]>> = {};
  
  await Promise.all(
    REGION_CODES.map(async (region) => {
      regionalData[region] = await loadRegionalProducts(region);
    })
  );
  
  return regionalData as Record<RegionCode, Product[]>;
}

// Get product count for a specific region
export function getRegionProductCount(products: Product[], region: RegionCode): number {
  return products.filter(product => product.mall_region === region).length;
}

// Get product counts for all regions
export function getAllRegionProductCounts(products: Product[]): Record<string, number> {
  const counts: Record<string, number> = {};
  
  REGION_CODES.forEach(region => {
    counts[region] = getRegionProductCount(products, region);
  });
  
  return counts;
}