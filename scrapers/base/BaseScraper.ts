import { ScraperConfig, ScraperResult, ScraperLogger } from './interfaces';
import { Product, Mall } from '@/src/types';
import * as fs from 'fs';
import * as path from 'path';

export abstract class BaseScraper {
  protected config: ScraperConfig;
  protected logger: ScraperLogger;
  protected results: Product[] = [];
  protected errors: string[] = [];
  protected startTime: number = 0;
  protected pagesScraped: number = 0;

  constructor(config: ScraperConfig, logger?: ScraperLogger) {
    this.config = config;
    this.logger = logger || this.createDefaultLogger();
  }

  private createDefaultLogger(): ScraperLogger {
    return {
      info: (msg: string) => console.log(`[${this.config.id}] INFO: ${msg}`),
      error: (msg: string, error?: any) => console.error(`[${this.config.id}] ERROR: ${msg}`, error || ''),
      warn: (msg: string) => console.warn(`[${this.config.id}] WARN: ${msg}`),
      debug: (msg: string) => console.debug(`[${this.config.id}] DEBUG: ${msg}`)
    };
  }

  /**
   * Main scraping method - must be implemented by each scraper
   */
  abstract scrape(): Promise<ScraperResult>;

  /**
   * Helper method to generate product ID
   */
  protected generateProductId(index: number): string {
    return `${this.config.id}-${Date.now()}-${index}`;
  }

  /**
   * Helper method to clean price string and convert to number
   */
  protected parsePrice(priceString: string): number {
    // Remove all non-numeric characters except comma and period
    const cleaned = priceString.replace(/[^0-9,.-]/g, '');
    // Remove commas used as thousands separator
    const normalized = cleaned.replace(/,/g, '');
    return Math.round(parseFloat(normalized) || 0);
  }

  /**
   * Helper method to create search text
   */
  protected createSearchText(name: string, categories: string[] = []): string {
    const parts = [name];
    
    // Add romanized version if contains Korean
    if (/[\u3131-\uD79D]/.test(name)) {
      // Simple romanization - in production, use a proper library
      parts.push(name.toLowerCase().replace(/\s+/g, ''));
    }
    
    // Add categories
    parts.push(...categories);
    
    return parts.join(' ').toLowerCase();
  }

  /**
   * Helper method to normalize URL
   */
  protected normalizeUrl(url: string, baseUrl?: string): string {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    
    const base = baseUrl || this.config.url;
    try {
      return new URL(url, base).href;
    } catch (error) {
      this.logger.warn(`Failed to normalize URL: ${url}`);
      return url;
    }
  }

  /**
   * Create mall object
   */
  protected createMall(productCount: number): Mall {
    return {
      id: this.config.id,
      name: this.config.name,
      engname: this.config.id,
      region: this.config.region,
      url: this.config.url,
      product_count: productCount,
      last_updated: new Date().toISOString(),
      status: 'active'
    };
  }

  /**
   * Create result object
   */
  protected createResult(products: Product[]): ScraperResult {
    const duration = Date.now() - this.startTime;
    const mall = this.createMall(products.length);

    return {
      success: products.length > 0,
      mall,
      products,
      errors: this.errors,
      stats: {
        totalProducts: products.length,
        pagesScraped: this.pagesScraped,
        duration,
        timestamp: new Date().toISOString()
      }
    };
  }

  /**
   * Save results to file
   */
  async saveResults(result: ScraperResult): Promise<void> {
    const outputDir = path.join(process.cwd(), 'data', 'scraped', this.config.region);
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Save products
    const productsPath = path.join(outputDir, `${this.config.id}-products.json`);
    fs.writeFileSync(productsPath, JSON.stringify(result.products, null, 2));
    
    // Save mall info
    const mallPath = path.join(outputDir, `${this.config.id}-mall.json`);
    fs.writeFileSync(mallPath, JSON.stringify(result.mall, null, 2));
    
    // Save scraping stats
    const statsPath = path.join(outputDir, `${this.config.id}-stats.json`);
    fs.writeFileSync(statsPath, JSON.stringify({
      stats: result.stats,
      errors: result.errors
    }, null, 2));

    this.logger.info(`Results saved to ${outputDir}`);
  }

  /**
   * Delay helper for rate limiting
   */
  protected async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}