// src/utils/urlHelper.ts

const API_BASE = "https://api.istanbul-care.com";

/**
 * Gelen verinin içindeki resim yollarını tam URL'ye çevirir.
 * Kapsanan Klasörler: /media/, /static/, /img/ (veya başlarında / olmayan halleri)
 */
export const fixImagePaths = (data: any): any => {
  if (!data) return data;

  // Dizi ise (Array)
  if (Array.isArray(data)) {
    return data.map(item => fixImagePaths(item));
  }

  // Obje ise (Object)
  if (typeof data === 'object') {
    const newData: any = {};
    for (const key in data) {
      const value = data[key];

      if (typeof value === 'string') {
        // --- GÜNCELLEME: Hem '/' ile başlayanları hem başlamayanları kontrol et ---
        
        // 1. MEDIA
        if (value.startsWith('/media/') || value.startsWith('media/')) {
           newData[key] = value.startsWith('/') ? `${API_BASE}${value}` : `${API_BASE}/${value}`;
        }
        // 2. IMG (Senin hatanın çözümü)
        else if (value.startsWith('/img/') || value.startsWith('img/')) {
           newData[key] = value.startsWith('/') ? `${API_BASE}${value}` : `${API_BASE}/${value}`;
        }
        // 3. STATIC
        else if (value.startsWith('/static/') || value.startsWith('static/')) {
           newData[key] = value.startsWith('/') ? `${API_BASE}${value}` : `${API_BASE}/${value}`;
        }
        else {
           newData[key] = value;
        }
      } 
      else {
        // String değilse içine gir (Recursive)
        newData[key] = fixImagePaths(value);
      }
    }
    return newData;
  }

  return data;
};