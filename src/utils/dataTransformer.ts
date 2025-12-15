// src/utils/dataTransformer.ts
import { BuilderStateItem, BackendPagePayload, PageData, BackendComponentItem } from "@/types";

export const transformToBackendFormat = (
  items: BuilderStateItem[],
  pageSettings: PageData,
  headerId: number,
  footerId: number
): BackendPagePayload => {
  
  // 1. Boş Şablonu Hazırla
  const payload: BackendPagePayload = {
    // --- Metadata (Root Seviyesi) ---
    title: pageSettings.title || "Adsız Sayfa",
    slug: pageSettings.slug || "",
    excerpt: pageSettings.excerpt || "",
    meta_title: pageSettings.meta_title || "",
    meta_description: pageSettings.meta_description || "",
    focus_keyword: pageSettings.focus_keyword || "",
    robots_index: pageSettings.robots_index ?? true,
    robots_follow: pageSettings.robots_follow ?? true,

    language_id: 1, 
    header_id: headerId || 0,
    footer_id: footerId || 0,
    parent_id: 0,
    faq_style: pageSettings.faq_style || "default_faq",

    // --- Standart Listeler (Boş Dizi Başlat) ---
    heroes: [],
    cards: [],
    processes: [],
    before_afters: [],
    contact_forms: [],
    promotional_landings: [],

    blogs: { enabled: false, order: 0, grid_columns: 12 },
    services: { enabled: false, order: 0, grid_columns: 12 },
    social_media: { enabled: false, order: 0, grid_columns: 12 },
    reviews: { enabled: false, order: 0, grid_columns: 12 },
  };

  // 2. Listeyi Dönüştür
  items.forEach((item, index) => {
    const dbId = item.dbId;
    
    // Standart öğe yapısı (Hero, Card vb. için)
    const componentItem: BackendComponentItem = {
      id: dbId || 0,
      order: index, // Listedeki sırası
      grid_columns: item.grid_columns
    };

    // Config öğe yapısı (Blog, Service vb. için)
    const configItem = {
      enabled: true,
      order: index,
      grid_columns: item.grid_columns
    };

    switch (item.type) {
      // --- GRUP A: Standart Listeler (Obje Dizisine Pushla) ---
      case 'hero':
        if (dbId) payload.heroes.push(componentItem);
        break;
      case 'card':
        if (dbId) payload.cards.push(componentItem);
        break;
      case 'process':
        if (dbId) payload.processes.push(componentItem);
        break;
      case 'before_after':
        if (dbId) payload.before_afters.push(componentItem);
        break;
      case 'contact_form':
        if (dbId) payload.contact_forms.push(componentItem);
        break;
      case 'promotional_landing':
        if (dbId) payload.promotional_landings.push(componentItem);
        break;
      case 'blog':
        payload.blogs = configItem;
        break;
      case 'service':
        payload.services = configItem;
        break;
      case 'social_media':
        payload.social_media = configItem;
        break;
      case 'review':
        payload.reviews = configItem;
        break;
    }
  });

  return payload;
};