// src/services/api.ts

// 1. BASE URL 
export const API_BASE_URL = "https://api.istanbul-care.com"; 

// GÜNCEL TOKEN 
const AUTH_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJyaWR2YW5jYWthcjdAZ21haWwuY29tIiwiZXhwIjoxNzY1ODg0Njg1fQ.mFzXBXb7nOdu3GVwK7D5rqvgHr4b6ZvoCpoI9Ga8ejM";
//const AUTH_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJyaWR2YW5jYWthcjdAZ21haWwuY29tIiwiZXhwIjoxNzY1ODYzNTQyfQ.HtSKK-YylJu6BwO-QkC6xSTKPgm0m3OxgT7MRlTPzj4";

//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJyaWR2YW5jYWthcjdAZ21haWwuY29tIiwiZXhwIjoxNzY1ODg0Njg1fQ.mFzXBXb7nOdu3GVwK7D5rqvgHr4b6ZvoCpoI9Ga8ejM
// 2. Endpoint Haritası 
const ENDPOINT_MAP: Record<string, string> = {
  hero: "/v1/admin/heroes",         
  card: "/v1/admin/cards",
  process: "/v1/admin/processes",
  contact_form: "/v1/admin/contact-form",
  before_after: "/v1/admin/before-afters",
  promotional_landing: "/v1/admin/promotional-landings",
  blog: "/v1/admin/blogs",
  service: "/v1/admin/services",
  social_media: "/v1/admin/social-medias", 
  review: "/v1/admin/reviews",
  };

export const getEndpointByType = (type: string) => {
  return ENDPOINT_MAP[type] || null;
};

// 3. VERİ ÇEKME (GET)
export const fetcher = async (url: string) => {
  const fullUrl = `${API_BASE_URL}${url}`;
  console.log("İstek Atılıyor:", fullUrl); 

  const res = await fetch(fullUrl, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${AUTH_TOKEN}` 
    },
  });

  if (!res.ok) {
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
      "Authorization": `Bearer ${AUTH_TOKEN}`
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