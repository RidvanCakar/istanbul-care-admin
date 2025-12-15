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
  | 'promotional_landing'
  | 'blog' 
  | 'service' 
  | 'social_media' 
  | 'review'

// 3. Frontend State
export interface BuilderStateItem {
  id: string;        
  type: ComponentType;
  dbId?: number;     
  grid_columns: GridSize;
  order: number;
}

// 4. Backend İçin Standart Öğe Yapısı (Hero, Card vb.)
// Örn: { id: 5, order: 1, grid_columns: 12 }
export interface BackendComponentItem {
  id: number;
  order: number;
  grid_columns: number;
}

// 5. Backend İçin Config Yapısı (Blog, Service vb.)
// Örn: { enabled: true, order: 2, grid_columns: 12 }
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
  // Ekstra alanlar eklenebilir
  excerpt?: string;
  faq_style?: string;
}

// 7. BACKEND PAYLOAD (Sunucuya Giden Nihai JSON)
export interface BackendPagePayload {
  // Metadata (Artık Root seviyesinde)
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

  // Standart Listeler (Artık Obje Dizisi)
  heroes: BackendComponentItem[]; // Dikkat: "heroes" (doğrusu bu)
  cards: BackendComponentItem[];
  processes: BackendComponentItem[];
  before_afters: BackendComponentItem[];
  contact_forms: BackendComponentItem[];
  promotional_landings: BackendComponentItem[];

  // Config Objeleri
  blogs: BackendComponentConfig;
  services: BackendComponentConfig;
  social_media: BackendComponentConfig;
  reviews: BackendComponentConfig;
}