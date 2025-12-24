// src/types/index.ts

// 1. Grid Boyutları
export type GridSize = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

// 2. Bileşen Tipleri 
export type ComponentType = 
  | 'hero' 
  | 'card' 
  | 'process' 
  | 'before_after' 
  | 'contact_form'
  | 'slider'            
  | 'package'           
  | 'price_compare'     
  | 'promotional_landing'
  | 'blog' 
  | 'service' 
  | 'social_media' 
  | 'faq' 
  | 'review';

// 3. Frontend State
export interface BuilderStateItem {
  id: string;        
  type: ComponentType;
  dbId?: number;     
  grid_columns: GridSize;
  order: number;
}

// 4. Backend İçin Standart Öğe Yapısı (Hero, Card vb.)
export interface BackendComponentItem {
  id: number;
  order: number;
  grid_columns: number;
}

// 5. Backend İçin Config Yapısı (Blog, Service vb.)
export interface BackendComponentConfig {
  enabled: boolean;
  order: number;
  grid_columns: number;
}

// 6. Sayfa Ayarları Formu
export interface PageData {
  title: string;
  slug: string;
  meta_title: string;
  meta_description: string;
  robots_index: boolean;
  robots_follow: boolean;
  focus_keyword: string;
  excerpt?: string;
  faq_style?: string;
}

export interface Language {
  id: number;
  name: string;
  code: string;
  flag_url?: string; 
  is_default?: boolean;
}


// 7. BACKEND PAYLOAD (Sunucuya Giden Nihai JSON)
export interface BackendPagePayload {
  // Metadata
  title: string;
  slug: string;
  excerpt: string;
  meta_title: string;
  meta_description: string;
  focus_keyword: string;
  robots_index: boolean;
  robots_follow: boolean;
  
  language_id: number;
  header_id: number | null;
  footer_id: number | null;
  parent_id: number | null;
  faq_style: string;

  // --- Standart Listeler  ---
  heroes: BackendComponentItem[]; 
  cards: BackendComponentItem[];
  processes: BackendComponentItem[];
  before_afters: BackendComponentItem[];
  contact_forms: BackendComponentItem[];
  promotional_landings: BackendComponentItem[];
  sliders: BackendComponentItem[];      
  packages: BackendComponentItem[];     
  price_compares: BackendComponentItem[]; 

  // Config Objeleri
  blogs: BackendComponentConfig;
  services: BackendComponentConfig;
  social_media: BackendComponentConfig;
  reviews: BackendComponentConfig;
}