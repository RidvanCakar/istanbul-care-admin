// src/services/api.ts

// 1. BASE URL (Proxy üzerinden çıkıyoruz)
export const API_BASE_URL = "/api/proxy"; 

// 2. Endpointler (Proxy /v1/admin kısmını zaten hallediyor, sadece ismini yazıyoruz)
const ENDPOINT_MAP: Record<string, string> = {
  hero: "/heroes",         
  card: "/cards",
  process: "/processes",
  contact_form: "/contact-forms",
  blog: "/blogs",
  service: "/services",
  social_media: "/social-medias", 
  review: "/reviews",
  before_after: "/before-afters"
};

export const fetcher = async (url: string) => {
  // 3. KOPYALADIĞIN TOKEN'I BURAYA YAPIŞTIR 👇 (Bearer olmadan, sadece eyJ... kısmı)
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJyaWR2YW5jYWthcjdAZ21haWwuY29tIiwiZXhwIjoxNzY1NTI5NTEwfQ.ZhliWgf2D2rTOm06wNl-1qePMNwgD99jLSNwUzSeXHU"; 

  const res = await fetch(`${API_BASE_URL}${url}`, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}` 
    },
  });

  if (!res.ok) {
    console.error("API Hatası:", res.status, await res.text());
    throw new Error("API Hatası");
  }

  return res.json();
};

export const getEndpointByType = (type: string) => {
  return ENDPOINT_MAP[type] || null;
};