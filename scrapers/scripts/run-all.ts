import * as fs from 'fs';
import * as path from 'path';
import { ScraperResult } from '../base/interfaces';

interface ScraperModule {
  default: {
    scrape(): Promise<ScraperResult>;
    saveResults(result: ScraperResult): Promise<void>;
  };
}

async function runAllScrapers() {
  console.log('🚀 Starting all scrapers...\n');
  
  const results: ScraperResult[] = [];
  const startTime = Date.now();
  
  // Get all scraper directories
  const mallsDir = path.join(__dirname, '..', 'malls');
  const regions = fs.readdirSync(mallsDir).filter(f => 
    fs.statSync(path.join(mallsDir, f)).isDirectory()
  );
  
  // Run scrapers for each region
  for (const region of regions) {
    const regionDir = path.join(mallsDir, region);
    const scraperFiles = fs.readdirSync(regionDir).filter(f => f.endsWith('.ts'));
    
    console.log(`\n📍 Scraping ${region} region (${scraperFiles.length} malls)`);
    
    for (const scraperFile of scraperFiles) {
      const scraperPath = path.join(regionDir, scraperFile);
      const mallId = scraperFile.replace('.ts', '');
      
      try {
        console.log(`  Scraping ${mallId}...`);
        
        // Dynamic import
        const module = await import(scraperPath) as ScraperModule;
        const scraper = module.default;
        
        // Run scraper
        const result = await scraper.scrape();
        results.push(result);
        
        // Save individual results
        await scraper.saveResults(result);
        
        console.log(`  ✅ ${mallId}: ${result.products.length} products`);
        
      } catch (error) {
        console.error(`  ❌ ${mallId}: Failed - ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
  }
  
  // Summary
  const totalTime = (Date.now() - startTime) / 1000;
  const totalProducts = results.reduce((sum, r) => sum + r.products.length, 0);
  const successfulMalls = results.filter(r => r.success).length;
  
  console.log('\n📊 Scraping Summary:');
  console.log(`Total time: ${totalTime.toFixed(2)}s`);
  console.log(`Malls scraped: ${successfulMalls}/${results.length}`);
  console.log(`Total products: ${totalProducts}`);
  
  // Save summary
  const summaryPath = path.join(process.cwd(), 'data', 'scraped', 'summary.json');
  fs.writeFileSync(summaryPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    duration: totalTime,
    mallsScraped: successfulMalls,
    totalMalls: results.length,
    totalProducts,
    results: results.map(r => ({
      mall: r.mall.id,
      success: r.success,
      products: r.products.length,
      errors: r.errors
    }))
  }, null, 2));
  
  console.log(`\n✨ Complete! Summary saved to ${summaryPath}`);
}

// Run if called directly
if (require.main === module) {
  runAllScrapers().catch(console.error);
}

export default runAllScrapers;