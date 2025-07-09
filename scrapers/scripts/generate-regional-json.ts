import * as fs from 'fs';
import * as path from 'path';
import { Product, ProductsData } from '../../src/types';
import { REGION_CODES } from '../../src/lib/regional-data';

/**
 * Generate regional JSON files from all-products.json
 * This creates separate JSON files for each region to enable dynamic loading
 */
export async function generateRegionalJSON() {
  console.log('📦 Generating regional JSON files...');
  
  const dataDir = path.join(process.cwd(), 'data', 'products');
  const allProductsPath = path.join(dataDir, 'all-products.json');
  const regionalDir = path.join(dataDir, 'regional');
  
  // Create regional directory if it doesn't exist
  if (!fs.existsSync(regionalDir)) {
    fs.mkdirSync(regionalDir, { recursive: true });
  }
  
  try {
    // Load all products
    const allProductsData = JSON.parse(
      fs.readFileSync(allProductsPath, 'utf-8')
    ) as ProductsData;
    
    const regionStats: Record<string, number> = {};
    
    // Generate a file for each region
    for (const region of REGION_CODES) {
      const regionalProducts = allProductsData.products.filter(
        product => product.mall_region === region
      );
      
      const regionalData = {
        metadata: {
          ...allProductsData.metadata,
          region,
          total_products: regionalProducts.length
        },
        products: regionalProducts
      };
      
      const regionalPath = path.join(regionalDir, `${region}-products.json`);
      fs.writeFileSync(
        regionalPath,
        JSON.stringify(regionalData, null, 2),
        'utf-8'
      );
      
      regionStats[region] = regionalProducts.length;
      console.log(`✅ Generated ${region}-products.json (${regionalProducts.length} products)`);
    }
    
    // Generate region summary file
    const summaryPath = path.join(regionalDir, 'region-summary.json');
    fs.writeFileSync(
      summaryPath,
      JSON.stringify({
        generated_at: new Date().toISOString(),
        total_regions: REGION_CODES.length,
        region_stats: regionStats
      }, null, 2),
      'utf-8'
    );
    
    console.log('\n🎯 Regional JSON generation complete!');
    console.log(`Generated ${REGION_CODES.length} regional files`);
    
  } catch (error) {
    console.error('❌ Error generating regional JSON:', error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  generateRegionalJSON().catch(console.error);
}