// src/app/login/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Lock, 
  Mail, 
  Key, 
  ArrowRight, 
  Loader2, 
  ShieldCheck, 
  CheckCircle2, 
  Stethoscope,
  Activity,
  AlertCircle 
} from "lucide-react";
import { loginService } from "@/services/auth";

export default function LoginPage() {
  const router = useRouter();

  // --- AUTH GUARD ---
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("auth_token");
      if (token) router.push("/");
    }
  }, [router]);

  // STATE'LER
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [step, setStep] = useState<1 | 2>(1); 
  const [challengeId, setChallengeId] = useState("");
  const [otpDestination, setOtpDestination] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // LOGIN FONKSİYONU
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const payload = {
        email,
        password,
        ...(step === 2 && { otp_code: otpCode, otp_challenge_id: challengeId })
      };

      const response = await loginService(payload);

      if (response.status === "otp_required" && response.challenge_id) {
        setStep(2);
        setChallengeId(response.challenge_id);
        setOtpDestination(response.destination || "e-posta adresinize");
        setIsLoading(false);
      } 
      else if (response.status === "authenticated" && response.access_token) {
        localStorage.setItem("auth_token", response.access_token);
        if (response.user) localStorage.setItem("user_info", JSON.stringify(response.user));
        router.push("/");
      } 
      else {
        setError(response.detail || "Giriş başarısız. Bilgileri kontrol edin.");
        setIsLoading(false);
      }
    } catch (err) {
      setError("Sunucu ile bağlantı kurulamadı.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-slate-50 overflow-hidden font-sans">
      
      {/* -----------------------------------------------------------------
          SOL TARAF: FORM ALANI
         ----------------------------------------------------------------- */}
      <div className="w-full lg:w-[45%] flex flex-col justify-center px-8 sm:px-12 lg:px-20 xl:px-28 z-20 relative">
        
        {/* Arkaplan Deseni */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#2563eb 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }}></div>

        <div className="mb-12 relative">
            {/* Logo */}
            <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/30 ring-4 ring-blue-50">
                    <Activity className="w-6 h-6" />
                </div>
                <div>
                   <span className="text-2xl font-black text-gray-900 tracking-tight block leading-none">Istanbul Care</span>
                   <span className="text-sm text-blue-600 font-bold tracking-widest uppercase">Admin Portal</span>
                </div>
            </div>
        </div>

        <div className="mb-8 relative">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">
                {step === 1 ? "Hoş Geldiniz." : "Güvenlik Kontrolü."}
            </h1>
            <p className="text-lg text-gray-500 leading-relaxed">
                {step === 1 
                  ? "Yönetim paneline erişmek için giriş yapın." 
                  : `${otpDestination} adresine gönderilen kodu girin.`}
            </p>
        </div>

        {/* Hata Mesajı */}
        {error && (
            <div className="mb-6 p-4 bg-red-50/80 backdrop-blur-sm border-l-4 border-red-500 text-red-700 text-sm rounded-r-xl flex items-center shadow-sm animate-in slide-in-from-left-2">
              <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
              <span className="font-medium">{error}</span>
            </div>
        )}

        <form onSubmit={handleLoginSubmit} className="space-y-7 relative">
            
            {/* ADIM 1 */}
            {step === 1 && (
                <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 ml-1 tracking-wide">E-Posta</label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-4 text-gray-400 w-5 h-5 group-focus-within:text-blue-600 transition-all duration-300 group-focus-within:scale-110" />
                            <input 
                                type="email" 
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-gray-100 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none transition-all duration-300 font-medium text-gray-800 placeholder:text-gray-400 shadow-sm focus:shadow-md"
                                placeholder="admin@istanbul-care.com"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between items-center ml-1">
                            <label className="text-sm font-bold text-gray-700 tracking-wide">Şifre</label>
                        </div>
                        <div className="relative group">
                            <Key className="absolute left-4 top-4 text-gray-400 w-5 h-5 group-focus-within:text-blue-600 transition-all duration-300 group-focus-within:scale-110" />
                            <input 
                                type="password" 
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-gray-100 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none transition-all duration-300 font-medium text-gray-800 placeholder:text-gray-400 shadow-sm focus:shadow-md"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* ADIM 2 */}
            {step === 2 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500 py-4">
                    <div className="flex justify-center relative">
                        <div className="absolute inset-0 bg-blue-500 opacity-20 blur-xl rounded-full animate-pulse"></div>
                        <ShieldCheck className="w-20 h-20 text-blue-600 relative z-10" />
                    </div>
                    
                    <div className="space-y-3 text-center">
                        <input 
                            type="text" 
                            required
                            autoFocus
                            value={otpCode}
                            onChange={(e) => setOtpCode(e.target.value)}
                            className="w-full text-center py-5 bg-white border-2 border-blue-100 rounded-3xl focus:border-blue-500 focus:ring-8 focus:ring-blue-500/10 outline-none transition-all duration-300 text-4xl font-black tracking-[0.4em] text-gray-800 shadow-xl shadow-blue-500/10"
                            placeholder="000000"
                            maxLength={6}
                        />
                         <p className="text-xs text-gray-400 font-medium">Kodu girerken otomatik onaylanır</p>
                    </div>
                    
                    <button 
                        type="button"
                        onClick={() => { setStep(1); setOtpCode(""); setError(""); }}
                        className="text-sm text-center w-full text-gray-500 hover:text-blue-600 font-bold transition-colors flex items-center justify-center gap-2"
                    >
                        &larr; E-postayı değiştir
                    </button>
                </div>
            )}

            <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 hover:from-blue-700 hover:to-indigo-900 text-white font-bold py-4 rounded-2xl transition-all duration-300 transform active:scale-[0.98] shadow-lg shadow-blue-500/30 hover:shadow-blue-600/50 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed group relative overflow-hidden"
            >
                <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                {isLoading ? (
                    <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span className="tracking-wide">Giriş Yapılıyor...</span>
                    </>
                ) : (
                    <>
                        <span className="tracking-wide">{step === 1 ? "Giriş Yap" : "Onayla"}</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                )}
            </button>
        </form>

        <div className="mt-12 pt-6 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-400 font-medium leading-relaxed">
                © 2025 Istanbul Care Clinic. <br/>Tüm Hakları Saklıdır.
            </p>
        </div>
      </div>

      {/* -----------------------------------------------------------------
          SAĞ TARAF: VİTRİN (SADE VE ŞIK)
         ----------------------------------------------------------------- */}
      <div className="hidden lg:flex w-[55%] relative overflow-hidden items-center justify-center bg-slate-900">
        
        {/* Arkaplan Görseli */}
        <div 
            className="absolute inset-0 z-0 bg-cover bg-center"
            style={{ 
                backgroundImage: 'url("https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2053&auto=format&fit=crop")',
            }}
        />
        
        <div className="absolute inset-0 z-10 bg-gradient-to-br from-blue-900/90 via-indigo-900/80 to-slate-900/95 mix-blend-multiply"></div>

        {/* Canlı Efektler */}
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-500/30 rounded-full filter blur-[120px] animate-pulse-slow mix-blend-screen"></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-indigo-500/20 rounded-full filter blur-[120px] animate-pulse-slow animation-delay-2000 mix-blend-screen"></div>

        {/* İçerik Kutusu */}
        <div className="relative z-20 p-12 text-white max-w-xl backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl shadow-2xl shadow-black/20 overflow-hidden">
            
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

            <div className="w-16 h-16 bg-gradient-to-tr from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-blue-500/20 ring-1 ring-white/20">
                <Stethoscope className="w-8 h-8 text-white" />
            </div>

            {/* SADE VE ŞIK BAŞLIK */}
            <h2 className="text-5xl font-black mb-6 leading-tight tracking-tight text-white">
                Istanbul Care <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-indigo-300">Clinic.</span>
            </h2>
            
            <p className="text-lg text-blue-100/80 mb-10 leading-relaxed font-light">
                Global standartlarda sağlık hizmeti ve misafirperverlik.
                <br/>
                Hastalarımız için en iyi deneyimi sunarken, operasyonel süreçleri güvenle yönetin.
            </p>

            <div className="space-y-5">
                <FeatureItem icon={CheckCircle2} title="Güvenli Erişim" desc="Veri güvenliği ve şifreli bağlantı." />
                <FeatureItem icon={Activity} title="Hasta Yönetimi" desc="Operasyonel süreç takibi." />
            </div>
        </div>

        <div className="absolute bottom-8 left-12 flex items-center gap-2 text-blue-200/60 text-xs font-medium tracking-widest uppercase">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>Sistemler Aktif</span>
        </div>
      </div>

    </div>
  );
}

// Yardımcı Bileşen
function FeatureItem({ icon: Icon, title, desc }: { icon: any, title: string, desc: string }) {
    return (
        <div className="flex items-start gap-4 group">
            <div className="p-2 bg-white/5 rounded-xl border border-white/10 group-hover:bg-white/10 transition-colors backdrop-blur-md shrink-0">
                <Icon className="w-6 h-6 text-blue-300" />
            </div>
            <div>
                <p className="font-bold text-white text-lg">{title}</p>
                <p className="text-sm text-blue-200/70">{desc}</p>
            </div>
        </div>
    )
}