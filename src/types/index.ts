// src/types/index.ts

// 1. Backend'den Beklenen Veri Yapısı
export interface PageData {
  title: string;
  slug: string;
  excerpt: string;
  meta_title: string;
  meta_description: string;
  focus_keyword: string;
  robots_index: boolean;
  robots_follow: boolean;
  language_id: number;
  header_id: number;
  parent_id: number;
  footer_id: number; // Bunu da ekledik
  
  // --- Standart Listeler ---
  heroes: ComponentItem[];
  cards: ComponentItem[];
  before_afters: ComponentItem[];
  processes: ComponentItem[];     // Eklendi
  contact_forms: ComponentItem[]; // Eklendi
  
  // --- Artık Bunlar da LİSTE (Array) Oldu ---
  // Eskiden SingleComponentItem idi, şimdi [] oldu
  blogs: ComponentItemWithEnabled[];
  services: ComponentItemWithEnabled[];
  social_media: ComponentItemWithEnabled[];
  reviews: ComponentItemWithEnabled[];
}

// Standart Bileşen Yapısı
export interface ComponentItem {
  id: number;
  order: number;
  grid_columns: GridSize;
}

// "Enabled" Özelliği Olan Bileşen Yapısı (Blog, Social Media vb. için)
export interface ComponentItemWithEnabled extends ComponentItem {
  enabled: boolean;
}

export type GridSize = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

// 2. Frontend Tipleri
export type ComponentType = 
  | 'hero' 
  | 'card' 
  | 'process' 
  | 'before_after' 
  | 'contact_form' 
  | 'blog' 
  | 'service' 
  | 'social_media' 
  | 'review';

export interface BuilderStateItem {
  id: string; // Frontend için UUID
  type: ComponentType;
  grid_columns: GridSize;
  order: number;
  dbId?: number;
  // isSingle?: boolean; // Artık buna ihtiyacımız kalmadı çünkü hepsi çoklu oldu
}