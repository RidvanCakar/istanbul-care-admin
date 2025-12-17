// src/utils/dataTransformer.ts
import { BuilderStateItem, BackendPagePayload, PageData, BackendComponentItem } from "@/types";

// Slug Oluşturucu
const generateSafeSlug = (text: string | undefined): string => {
  if (text && text.trim().length > 0) {
    return text
      .toLowerCase()
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');
  }
  return `sayfa-${Date.now()}`;
};

export const transformToBackendFormat = (
  items: BuilderStateItem[],
  pageSettings: PageData,
  headerId: number,
  footerId: number,
  languageId: number
): BackendPagePayload => {
  
  const finalSlug = pageSettings.slug && pageSettings.slug.trim().length > 0
    ? pageSettings.slug
    : generateSafeSlug(pageSettings.title);

  const payload: BackendPagePayload = {
    // --- Metadata ---
    title: pageSettings.title || "Adsız Sayfa",
    slug: finalSlug,
    excerpt: pageSettings.excerpt || "",
    meta_title: pageSettings.meta_title || "",
    meta_description: pageSettings.meta_description || "",
    focus_keyword: pageSettings.focus_keyword || "",
    robots_index: pageSettings.robots_index ?? true,
    robots_follow: pageSettings.robots_follow ?? true,

    language_id: languageId,
    
    // --- DÜZELTME BURADA YAPILDI ---
    // Eğer 0 ise (seçilmediyse) null gönderiyoruz.
    header_id: headerId > 0 ? headerId : null,
    footer_id: footerId > 0 ? footerId : null,
    parent_id: null, 
    
    faq_style: pageSettings.faq_style || "default_faq",

    // --- Listeler ---
    heroes: [],
    cards: [],
    processes: [],
    before_afters: [],
    contact_forms: [],
    promotional_landings: [],
    sliders: [],
    packages: [],
    price_compares: [],

    // --- Configs ---
    blogs: { enabled: false, order: 0, grid_columns: 12 },
    services: { enabled: false, order: 0, grid_columns: 12 },
    social_media: { enabled: false, order: 0, grid_columns: 12 },
    reviews: { enabled: false, order: 0, grid_columns: 12 },
  };

  // Liste Dönüştürme
  items.forEach((item, index) => {
    const dbId = item.dbId;
    
    const componentItem: BackendComponentItem = {
      id: dbId || 0,
      order: index, 
      grid_columns: item.grid_columns
    };

    const configItem = {
      enabled: true,
      order: index,
      grid_columns: item.grid_columns
    };

    switch (item.type) {
      case 'hero': if (dbId) payload.heroes.push(componentItem); break;
      case 'card': if (dbId) payload.cards.push(componentItem); break;
      case 'process': if (dbId) payload.processes.push(componentItem); break;
      case 'before_after': if (dbId) payload.before_afters.push(componentItem); break;
      case 'contact_form': if (dbId) payload.contact_forms.push(componentItem); break;
      case 'promotional_landing': if (dbId) payload.promotional_landings.push(componentItem); break;
      case 'slider': if (dbId) payload.sliders.push(componentItem); break;
      case 'package': if (dbId) payload.packages.push(componentItem); break;
      case 'price_compare': if (dbId) payload.price_compares.push(componentItem); break;
      
      case 'blog': payload.blogs = configItem; break;
      case 'service': payload.services = configItem; break;
      case 'social_media': payload.social_media = configItem; break;
      case 'review': payload.reviews = configItem; break;
    }
  });

  return payload;
};