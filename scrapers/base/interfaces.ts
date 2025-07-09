import { Product, Mall } from '@/src/types';

export interface ScraperConfig {
  id: string;
  name: string;
  url: string;
  region: string;
  selectors: {
    productList: string;
    productName: string;
    productPrice: string;
    productImage: string;
    productLink: string;
    pagination?: string;
    categories?: string;
  };
  options?: {
    maxPages?: number;
    delay?: number;
    timeout?: number;
    userAgent?: string;
  };
}

export interface ScraperResult {
  success: boolean;
  mall: Mall;
  products: Product[];
  errors: string[];
  stats: {
    totalProducts: number;
    pagesScraped: number;
    duration: number;
    timestamp: string;
  };
}

export interface ScraperLogger {
  info(message: string): void;
  error(message: string, error?: any): void;
  warn(message: string): void;
  debug(message: string): void;
}