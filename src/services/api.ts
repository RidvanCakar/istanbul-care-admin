// src/services/api.ts

// 1. BASE URL 
export const API_BASE_URL = "https://api.istanbul-care.com"; 

// 2. Endpoint Haritası
const ENDPOINT_MAP: Record<string, string> = {
  // Eski endpointler 
  hero: "/v1/admin/heroes",         
  card: "/v1/admin/cards",
  process: "/v1/admin/processes",
  contact_form: "/v1/admin/contact-form",
  blog: "/v1/admin/blogs",
  tag: "/v1/admin/tags",
  service: "/v1/admin/services",
  social_media: "/v1/admin/social-medias", 
  review: "/v1/admin/reviews",
  before_after: "/v1/admin/before-afters",
  user: "/v1/admin/users",
};

export const fetcher = async (url: string) => {
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJyaWR2YW5jYWthcjdAZ21haWwuY29tIiwiZXhwIjoxNzY1NjE1NDM3fQ._rqsDnHnCX2zjNCavJQgsdYGNekySGuBhfSNxO7ITII"; 

  // URL birleştirme
  const fullUrl = `${API_BASE_URL}${url}`;

  console.log("İstek Atılıyor:", fullUrl); 
  const res = await fetch(fullUrl, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}` 
    },
  });

  if (!res.ok) {
    console.error(`API Hatası (${res.status}):`, await res.text());
    throw new Error("API Hatası");
  }

  return res.json();
};

export const getEndpointByType = (type: string) => {
  return ENDPOINT_MAP[type] || null;
};

//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJyaWR2YW5jYWthcjdAZ21haWwuY29tIiwiZXhwIjoxNzY1NjE1NDM3fQ._rqsDnHnCX2zjNCavJQgsdYGNekySGuBhfSNxO7ITII



export const createEntry = async (type: string, payload: any) => {
  const url = ENDPOINT_MAP[type];
  if (!url) throw new Error("Bu tip için endpoint bulunamadı");

  const fullUrl = `${API_BASE_URL}${url}`;

  const res = await fetch(fullUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJyaWR2YW5jYWthcjdAZ21haWwuY29tIiwiZXhwIjoxNzY1NTQ5NzI3fQ.ep_3bzTOfk0PVkfs-d9dPK9i7UJ3c9oU2zetct5Vih8"
    },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const errorData = await res.json();
    
    let errorMessage = "Kayıt oluşturulamadı";
    
    if (errorData.detail) {
      if (Array.isArray(errorData.detail)) {
        // Eğer hata bir liste ise (Örn: Phone eksik, Password kısa)
        errorMessage = errorData.detail
          .map((err: any) => `${err.loc?.[1] || 'Alan'}: ${err.msg}`)
          .join('\n');
      } else {
        // Tekil mesajsa
        errorMessage = errorData.detail;
      }
    }
    
    console.error("API Hatası Detay:", errorData); // Konsola da bas
    throw new Error(errorMessage);
  }

  return res.json();
};