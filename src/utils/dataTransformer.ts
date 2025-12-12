// src/utils/dataTransformer.ts
import { BuilderStateItem, PageData } from "@/types";

export const transformToBackendFormat = (
  items: BuilderStateItem[],
  pageSettings: Partial<PageData>,
  headerId: number,
  footerId: number
) => {
  const payload: any = {
    // Sayfa Ayarları
    title: pageSettings.title || "Adsız Sayfa",
    slug: pageSettings.slug || "",
    excerpt: pageSettings.excerpt || "",
    meta_title: pageSettings.meta_title || "",
    meta_description: pageSettings.meta_description || "",
    focus_keyword: pageSettings.focus_keyword || "",
    robots_index: pageSettings.robots_index ?? true,
    robots_follow: pageSettings.robots_follow ?? true,
    language_id: 1,
    header_id: headerId,
    parent_id: 0,
    footer_id: footerId,

    // TÜM ALANLAR ARTIK BOŞ DİZİ OLARAK BAŞLIYOR
    heroes: [],
    cards: [],
    processes: [],
    before_afters: [],
    contact_form: [],
    blogs: [],        
    services: [],     
    social_media: [], 
    reviews: [],      
  };

  items.forEach((item, index) => {
    // Standart Veri
    const backendItem = {
      id: 0, 
      order: index + 1, // Sıralama (Hepsi için ortak sayaç)
      grid_columns: item.grid_columns
    };

    // 'enabled: true' eklenmiş veri (Blog, Social Media vb. için)
    const enabledItem = {
      enabled: true,
      ...backendItem
    };

    switch (item.type) {
      // Standart Olanlar
      case 'hero':
        payload.heroes.push(backendItem);
        break;
      case 'card':
        payload.cards.push(backendItem);
        break;
      case 'process':
        payload.processes.push(backendItem);
        break;
      case 'before_after':
        payload.before_afters.push(backendItem);
        break;
      case 'contact_form':
        payload.contact_forms.push(backendItem);
        break;
      case 'blog':
        payload.blogs.push(enabledItem);
        break;
      case 'service':
        payload.services.push(enabledItem);
        break;
      case 'social_media':
        payload.social_media.push(enabledItem);
        break;
      case 'review':
        payload.reviews.push(enabledItem);
        break;
    }
  });

  return payload;
};