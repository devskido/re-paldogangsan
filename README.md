# K-Mall Aggregator (대한민국 지자체 쇼핑몰 통합 플랫폼)

## 🚀 Quick Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fdevskido%2Fre-paldogangsan)

## Overview
K-Mall Aggregator is a unified platform that aggregates products from 100+ Korean local government shopping malls. Built with Next.js and TypeScript, it provides a modern interface for discovering local products across all regions of Korea.

## Data Structures

### Product Schema
```typescript
interface Product {
  id: string;              // Unique product identifier (e.g., "seoul-mall-001")
  name: string;            // Product name in Korean
  price: number;           // Price in KRW
  image_url: string;       // Product image URL
  mall_name: string;       // Mall name in Korean
  mall_id: string;         // Mall identifier
  mall_engname: string;    // Mall English name for URLs
  mall_region: string;     // Region code (seoul, busan, etc.)
  product_url: string;     // Original product page URL
  categories: string[];    // Product categories
  search_text: string;     // Searchable text (Korean + English)
  created_at: string;      // ISO 8601 timestamp
}
```

### Mall Schema
```typescript
interface Mall {
  id: string;              // Unique mall identifier
  name: string;            // Mall name in Korean
  engname: string;         // English name for URLs
  region: string;          // Region code
  url: string;             // Mall website URL
  logo_url?: string;       // Mall logo URL
  description?: string;    // Mall description
  product_count: number;   // Number of products
  last_updated: string;    // Last update timestamp
  status: 'active' | 'inactive' | 'error';
}
```

### Search Index Schema
```typescript
interface SearchIndex {
  version: string;         // Index version
  created_at: string;      // Index creation timestamp
  index: Record<string, string[]>;        // keyword -> product IDs
  consonant_index?: Record<string, string[]>; // Korean consonant search
}
```

### Supported Regions
- `seoul` - 서울특별시
- `busan` - 부산광역시
- `daegu` - 대구광역시
- `incheon` - 인천광역시
- `gwangju` - 광주광역시
- `daejeon` - 대전광역시
- `ulsan` - 울산광역시
- `sejong` - 세종특별자치시
- `gyeonggi` - 경기도
- `gangwon` - 강원도
- `chungbuk` - 충청북도
- `chungnam` - 충청남도
- `jeonbuk` - 전라북도
- `jeonnam` - 전라남도
- `gyeongbuk` - 경상북도
- `gyeongnam` - 경상남도
- `jeju` - 제주특별자치도

## Data Files Structure
```
data/
├── products/
│   ├── all-products.json      # All products aggregated
│   └── by-region/             # Products by region
│       ├── seoul.json
│       ├── busan.json
│       └── ...
├── malls.json                 # All mall information
├── search-index.json          # Pre-built search index
└── samples/                   # Sample data for testing
    ├── sample-products.json
    ├── sample-malls.json
    └── sample-search-index.json
```

## Project Setup

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

### Build
```bash
npm run build
```

## Tech Stack
- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui
- **Map**: react-simple-south-korea-map-chart
- **Search**: Fuse.js
- **Deployment**: Vercel / GitHub Pages

## Architecture
- Static site generation with JSON data files
- Client-side search and filtering
- Zero backend infrastructure (MVP)
- Automated scraping with individual mall scrapers

## License
MIT