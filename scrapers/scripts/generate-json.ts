import * as fs from 'fs';
import * as path from 'path';
import { Product, ProductsData, RegionalProductsData } from '@/src/types';
import { REGION_NAMES } from '@/src/types/mall';

async function generateJson() {
  console.log('🔧 Generating JSON files...\n');
  
  const scrapedDir = path.join(process.cwd(), 'data', 'scraped');
  const outputDir = path.join(process.cwd(), 'data', 'products');
  const byRegionDir = path.join(outputDir, 'by-region');
  
  // Create output directories
  [outputDir, byRegionDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
  
  // Collect all products
  const allProducts: Product[] = [];
  const productsByRegion: Record<string, Product[]> = {};
  const mallsCount: Record<string, number> = {};
  
  // Initialize region maps
  Object.keys(REGION_NAMES).forEach(region => {
    productsByRegion[region] = [];
    mallsCount[region] = 0;
  });
  
  // Read scraped data
  const regions = fs.readdirSync(scrapedDir).filter(f => 
    fs.statSync(path.join(scrapedDir, f)).isDirectory()
  );
  
  for (const region of regions) {
    const regionDir = path.join(scrapedDir, region);
    const productFiles = fs.readdirSync(regionDir).filter(f => f.endsWith('-products.json'));
    
    console.log(`Processing ${region}: ${productFiles.length} malls`);
    
    for (const file of productFiles) {
      try {
        const filePath = path.join(regionDir, file);
        const products = JSON.parse(fs.readFileSync(filePath, 'utf-8')) as Product[];
        
        allProducts.push(...products);
        productsByRegion[region].push(...products);
        mallsCount[region]++;
        
      } catch (error) {
        console.error(`  Error reading ${file}:`, error);
      }
    }
  }
  
  // Generate all-products.json
  const allProductsData: ProductsData = {
    metadata: {
      last_updated: new Date().toISOString(),
      total_products: allProducts.length,
      total_malls: Object.values(mallsCount).reduce((sum, count) => sum + count, 0)
    },
    products: allProducts
  };
  
  const allProductsPath = path.join(outputDir, 'all-products.json');
  fs.writeFileSync(allProductsPath, JSON.stringify(allProductsData, null, 2));
  console.log(`\n✅ Generated all-products.json (${allProducts.length} products)`);
  
  // Generate regional JSON files
  for (const [region, products] of Object.entries(productsByRegion)) {
    if (products.length === 0) continue;
    
    const regionalData: RegionalProductsData = {
      region,
      metadata: {
        last_updated: new Date().toISOString(),
        total_products: products.length,
        malls_count: mallsCount[region] || 0
      },
      products
    };
    
    const regionalPath = path.join(byRegionDir, `${region}.json`);
    fs.writeFileSync(regionalPath, JSON.stringify(regionalData, null, 2));
    console.log(`✅ Generated ${region}.json (${products.length} products)`);
  }
  
  // Generate metadata file
  const metadataPath = path.join(outputDir, 'metadata.json');
  fs.writeFileSync(metadataPath, JSON.stringify({
    last_updated: new Date().toISOString(),
    total_products: allProducts.length,
    total_malls: Object.values(mallsCount).reduce((sum, count) => sum + count, 0),
    regions: Object.entries(productsByRegion).map(([region, products]) => ({
      region,
      name: REGION_NAMES[region as keyof typeof REGION_NAMES],
      products: products.length,
      malls: mallsCount[region] || 0
    })).filter(r => r.products > 0)
  }, null, 2));
  
  console.log('\n✨ JSON generation complete!');
}

// Run if called directly
if (require.main === module) {
  generateJson().catch(console.error);
}

export default generateJson;