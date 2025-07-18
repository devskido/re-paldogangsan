export interface Mall {
  id: string;
  name: string;
  engname: string;
  region: string;
  url: string;
  logo_url?: string;
  description?: string;
  product_count: number;
  last_updated: string;
  status: 'active' | 'inactive' | 'error';
  featured_products?: number;
  categories?: string[];
  opening_year?: number;
}

export interface MallsData {
  metadata: {
    last_updated: string;
    total_malls: number;
    active_malls: number;
  };
  malls: Mall[];
}

export type Region = 
  | 'seoul'
  | 'busan'
  | 'daegu'
  | 'incheon'
  | 'gwangju'
  | 'daejeon'
  | 'ulsan'
  | 'sejong'
  | 'gyeonggi'
  | 'gangwon'
  | 'chungbuk'
  | 'chungnam'
  | 'jeonbuk'
  | 'jeonnam'
  | 'gyeongbuk'
  | 'gyeongnam'
  | 'jeju';

export const REGION_NAMES: Record<Region, string> = {
  seoul: '서울특별시',
  busan: '부산광역시',
  daegu: '대구광역시',
  incheon: '인천광역시',
  gwangju: '광주광역시',
  daejeon: '대전광역시',
  ulsan: '울산광역시',
  sejong: '세종특별자치시',
  gyeonggi: '경기도',
  gangwon: '강원도',
  chungbuk: '충청북도',
  chungnam: '충청남도',
  jeonbuk: '전라북도',
  jeonnam: '전라남도',
  gyeongbuk: '경상북도',
  gyeongnam: '경상남도',
  jeju: '제주특별자치도'
};