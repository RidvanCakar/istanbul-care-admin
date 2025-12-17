// src/services/auth.ts
import { API_BASE_URL } from "./api";

// API'ye Gidecek Veri Modeli
// 2. adımda email ve şifreyi tekrar istediği için hepsini buraya koyduk.
interface LoginPayload {
  email: string;
  password: string;
  otp_code?: string;         // 2. adımda dolu olacak
  otp_challenge_id?: string; // 2. adımda dolu olacak
}

// API'den Dönen Cevap Modeli
// Hem "otp_required" hem "authenticated" durumlarını kapsar.
interface LoginResponse {
  status: "otp_required" | "authenticated" | "error";
  
  // Durum: 'otp_required' ise gelenler
  challenge_id?: string;
  destination?: string; // Örn: r***7@gmail.com
  message?: string;

  // Durum: 'authenticated' ise gelenler
  access_token?: string;
  user?: {
    id: number;
    email: string;
    full_name: string;
    role: string;
  };
  
  // Hata durumunda
  detail?: string;
}

export const loginService = async (payload: LoginPayload): Promise<LoginResponse> => {
  try {
    const res = await fetch(`${API_BASE_URL}/v1/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    // API bazen 422 veya 400 dönse bile body içinde detay verir, onu okumalıyız.
    const data = await res.json();
    return data;
    
  } catch (error) {
    console.error("Login servisi hatası:", error);
    throw new Error("Sunucuyla bağlantı kurulamadı.");
  }
};