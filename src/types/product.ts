export interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string;
  mall_name: string;
  mall_id: string;
  mall_engname: string;
  mall_region: string;
  product_url: string;
  categories: string[];
  search_text: string;
  created_at: string;
}

export interface ProductsData {
  metadata: {
    last_updated: string;
    total_products: number;
    total_malls: number;
  };
  products: Product[];
}

export interface RegionalProductsData {
  region: string;
  metadata: {
    last_updated: string;
    total_products: number;
    malls_count: number;
  };
  products: Product[];
}