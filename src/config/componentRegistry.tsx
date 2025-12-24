// src/config/componentRegistry.tsx
import dynamic from 'next/dynamic';
import { Loader2, AlertTriangle } from 'lucide-react';

// 1. Yükleme Animasyonu
const Loading = () => (
  <div className="w-full h-32 flex flex-col items-center justify-center bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl text-gray-400">
    <Loader2 className="w-6 h-6 animate-spin mb-2 text-blue-500" />
    <span className="text-xs font-medium">Yükleniyor...</span>
  </div>
);

// 2. Bulunamadı Kutusu
const NotFound = ({ name }: { name: string }) => (
  <div className="w-full h-32 flex flex-col items-center justify-center bg-red-50 border-2 border-dashed border-red-200 rounded-xl text-red-500 p-4">
    <AlertTriangle className="w-6 h-6 mb-2" />
    <p className="font-bold text-sm">"{name}" Bulunamadı</p>
    <p className="text-xs opacity-70 mt-1">Export listesini kontrol edin.</p>
  </div>
);

// 3. Güvenli Import Fonksiyonu
const safeImport = (componentName: string) => {
  return dynamic(async () => {
    try {
      const mod: any = await import('@istanbul-care/ui');
      // Debug için: console.log("📦 Mevcut Bileşenler:", Object.keys(mod));
      
      if (mod[componentName]) return mod[componentName];
      
      console.warn(`⚠️ "${componentName}" pakette bulunamadı.`);
      return () => <NotFound name={componentName} />;
    } catch (error) {
      return () => <div className="p-4 text-red-500">Bağlantı Hatası</div>;
    }
  }, { loading: () => <Loading />, ssr: false });
};

export const COMPONENT_REGISTRY: any = {
  // Hero -> "Heroes"
  hero: safeImport('Heroes'),        
  
  // Card -> "WhyChooseUs"
  card: safeImport('WhyChooseUs'),   
  
  // Slider -> "Sliders"
  slider: safeImport('TimelineSlider'),     
  
  // BeforeAfter -> "BeforeAfterStyleTwo" 
  before_after: safeImport('BeforeAfterStyleTwo',),  

  // Promotional -> "PromotionalLanding"
  promotional_landing: safeImport('PromotionalLanding'),
  
  // Process -> "TimelineSlider"
  process: safeImport('TimelineSlider'),
  
  // PriceCompare -> "PriceCompares"
  price_compare: safeImport('PriceCompares'),
  
  // 1. Büyük Olan (Full)
  contact_form: safeImport('ReachUsNowFull'), 
    // FAQ -> "FaqSection"
  faq: safeImport('FaqSection'),
  
  // Review -> "CommentSlider"
  review: safeImport('CommentSlider'),

  // Package -> "Pricing"
  package: safeImport('Pricing'), 
  
  // Service -> "OurServicesSlider"
  service: safeImport('OurServicesSlider'),
  
};