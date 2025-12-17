// src/services/api.ts

// 1. BASE URL 
export const API_BASE_URL = "https://api.istanbul-care.com"; 

// --- GÜNCELLEME: TOKEN ARTIK DİNAMİK ALINIYOR ---
const getAuthToken = () => {
  // Next.js sunucu tarafında çalışırken window olmadığı için hata vermesin diye kontrol ediyoruz
  if (typeof window !== "undefined") {
    return localStorage.getItem("auth_token") || "";
  }
  return "";
};

// 2. Endpoint Haritası
const ENDPOINT_MAP: Record<string, string> = {
  // Mevcutlar
  hero: "/v1/admin/heroes",         
  card: "/v1/admin/cards",
  process: "/v1/admin/processes",
  contact_form: "/v1/admin/contact-form",
  before_after: "/v1/admin/before-afters",
  promotional_landing: "/v1/admin/promotional-landings",
  slider: "/v1/admin/sliders",
  package: "/v1/admin/packages",
  price_compare: "/v1/admin/price-compares",
  
  // Config Olanlar
  blog: "/v1/admin/blogs",
  service: "/v1/admin/services",
  social_media: "/v1/admin/social-medias", 
  review: "/v1/admin/reviews",

  // --- GENEL SİSTEM ---
  languages: "/v1/admin/languages",
  pages: "/v1/admin/pages", 
};

export const getEndpointByType = (type: string) => {
  return ENDPOINT_MAP[type] || null;
};

// 3. VERİ ÇEKME (GET)
export const fetcher = async (url: string) => {
  const fullUrl = `${API_BASE_URL}${url}`;
  // console.log("İstek Atılıyor:", fullUrl); 

  const res = await fetch(fullUrl, {
    headers: {
      "Content-Type": "application/json",
      // --- DİNAMİK TOKEN KULLANIMI ---
      "Authorization": `Bearer ${getAuthToken()}` 
    },
  });

  if (!res.ok) {
    // 401 Hatası (Yetkisiz) gelirse belki login'e atmak isteyebiliriz ileride
    console.error(`API Hatası (${res.status}):`, await res.text());
    throw new Error("API Hatası");
  }

  return res.json();
};

// 4. VERİ OLUŞTURMA (POST)
export const createEntry = async (type: string, payload: any) => {
  const url = ENDPOINT_MAP[type];
  if (!url) throw new Error("Bu tip için endpoint bulunamadı");

  const fullUrl = `${API_BASE_URL}${url}`;

  const res = await fetch(fullUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // --- DİNAMİK TOKEN KULLANIMI ---
      "Authorization": `Bearer ${getAuthToken()}`
    },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const errorData = await res.json();
    let errorMessage = "Kayıt oluşturulamadı";
    
    if (errorData.detail) {
      errorMessage = Array.isArray(errorData.detail) 
        ? errorData.detail.map((err: any) => `${err.loc?.[1] || 'Alan'}: ${err.msg}`).join('\n')
        : errorData.detail;
    }
    
    console.error("API Hatası Detay:", errorData); 
    throw new Error(errorMessage);
  }

  return res.json();
};