# K-Mall Aggregator Scraper Architecture

## Overview
This directory contains the scraping infrastructure for collecting product data from 100+ Korean local government shopping malls.

## Structure
```
scrapers/
├── base/                    # Base scraper classes and interfaces
│   ├── interfaces.ts       # TypeScript interfaces
│   ├── BaseScraper.ts      # Abstract base scraper class
│   └── HttpScraper.ts      # HTTP-based scraper implementation
├── malls/                  # Individual mall scrapers by region
│   ├── seoul/
│   ├── busan/
│   └── ...
└── scripts/                # Pipeline scripts
    ├── run-all.ts          # Run all scrapers
    ├── generate-json.ts    # Generate JSON files
    ├── build-search-index.ts # Build search index
    └── data-pipeline.ts    # Full pipeline orchestration
```

## Usage

### Running the Full Pipeline
```bash
# Run complete pipeline (scraping + JSON generation + search index)
npm run pipeline

# With automatic Git commit
npm run pipeline:full

# With automatic Git commit and push
npm run pipeline:deploy
```

### Running Individual Steps
```bash
# Run all scrapers
npm run scrape:all

# Generate JSON files from scraped data
npm run generate-json

# Build search index
npm run build-index
```

### Pipeline Options
```bash
# Run only specific steps
npm run pipeline -- --scrape-only
npm run pipeline -- --generate-only
npm run pipeline -- --index-only

# Skip Git commit
npm run pipeline -- --no-commit
```

## Creating a New Scraper

1. Create a new file in the appropriate region directory:
   ```
   scrapers/malls/{region}/{mall-id}.ts
   ```

2. Implement the scraper using the base classes:
   ```typescript
   import { HttpScraper } from '../../base/HttpScraper';
   import { ScraperConfig } from '../../base/interfaces';

   const config: ScraperConfig = {
     id: 'mall-id',
     name: 'Mall Name',
     url: 'https://mall-website.kr',
     region: 'seoul',
     selectors: {
       // CSS selectors for data extraction
     }
   };

   const scraper = new HttpScraper(config);
   export default scraper;
   ```

3. For complex scrapers requiring JavaScript rendering, extend BaseScraper:
   ```typescript
   import { BaseScraper } from '../../base/BaseScraper';
   
   class CustomScraper extends BaseScraper {
     async scrape(): Promise<ScraperResult> {
       // Custom implementation
     }
   }
   ```

## Data Flow

1. **Scraping**: Each mall scraper collects product data
2. **Storage**: Raw data saved to `data/scraped/{region}/`
3. **Generation**: JSON files created in `data/products/`
4. **Indexing**: Search index built in `data/search-index.json`
5. **Deployment**: Data committed to Git and deployed

## Output Structure
```
data/
├── scraped/              # Raw scraped data
│   └── {region}/
│       ├── {mall-id}-products.json
│       ├── {mall-id}-mall.json
│       └── {mall-id}-stats.json
├── products/             # Generated product files
│   ├── all-products.json
│   ├── metadata.json
│   └── by-region/
│       └── {region}.json
└── search-index.json     # Search index
```

## Environment Variables

- `AUTO_COMMIT=true` - Automatically commit changes to Git
- `AUTO_PUSH=true` - Automatically push to remote (requires AUTO_COMMIT)

## Notes

- Each mall requires its own scraper due to unique website structures
- Scrapers should implement rate limiting to avoid being blocked
- Use Claude Code to generate scrapers for each mall based on their HTML structure
- Test scrapers individually before running the full pipeline