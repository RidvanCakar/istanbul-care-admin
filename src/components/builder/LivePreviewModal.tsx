// src/components/builder/LivePreviewModal.tsx
import React, { useMemo } from 'react';
import { X, Smartphone, Tablet, Monitor, Loader2, AlertCircle } from 'lucide-react';
import { BuilderStateItem } from '@/types';
import { COMPONENT_REGISTRY } from '@/config/componentRegistry';
import useSWR from 'swr';
import { fetcher, getEndpointByType } from '@/services/api';

interface LivePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: BuilderStateItem[];
}

// --- TEKİL ÖNİZLEME BİLEŞENİ ---
const PreviewItem = ({ item }: { item: BuilderStateItem }) => {
  const endpoint = getEndpointByType(item.type);
  const { data, isLoading } = useSWR(endpoint, fetcher);

  // 1. VERİ AYIKLAMA (Gelişmiş Arama)
  const options = useMemo(() => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (data.data && Array.isArray(data.data)) return data.data;

    if (data.data && typeof data.data === 'object') {
       const typeStr = item.type as string;
       // Tip bazlı özel aramalar
       if ((typeStr === 'services' || typeStr === 'service') && Array.isArray(data.data.services)) return data.data.services;
       if ((typeStr === 'blogs' || typeStr === 'blog') && Array.isArray(data.data.posts)) return data.data.posts;
       if ((typeStr === 'package' || typeStr === 'packages') && Array.isArray(data.data.packages)) return data.data.packages;
       if ((typeStr === 'comments' || typeStr === 'review') && (Array.isArray(data.data.comments) || Array.isArray(data.data.reviews))) return data.data.comments || data.data.reviews;
       
       // Genel arama (Objenin içindeki herhangi bir array'i bul)
       const keys = Object.keys(data.data);
       for (const key of keys) {
           if (Array.isArray(data.data[key])) return data.data[key];
       }
    }
    return [];
  }, [data, item.type]);

  // 2. SEÇİLİ VERİYİ BULMA (ESNEK ID KONTROLÜ EKLENDİ 🛠️)
  const selectedData = useMemo(() => {
    if (!item.dbId) return null;
    // Hem string hem number ID'leri yakalamak için String() çevrimi yapıyoruz veya '==' kullanıyoruz
    return options.find((o: any) => String(o.id) === String(item.dbId)) || null;
  }, [options, item.dbId]);

  const RealComponent = COMPONENT_REGISTRY[item.type];

  // 3. PROPS ADAPTÖRÜ
  const componentProps = useMemo(() => {
    if (!selectedData) return null;

    const locale = "tr";
    const rawBaseUrl = process.env.NEXT_PUBLIC_MEDIA_BASE_URL || "https://api.istanbul-care.com";
    const mediaBaseUrl = rawBaseUrl.replace(/\/$/, ""); 

    const fixUrl = (url: any) => {
        if (!url || typeof url !== 'string') return url;
        if (url.startsWith('http')) return url;
        const cleanPath = url.startsWith('/') ? url.substring(1) : url;
        return `${mediaBaseUrl}/${cleanPath}`;
    };

    const deepFixData = (obj: any): any => {
        if (!obj) return obj;
        if (Array.isArray(obj)) return obj.map(deepFixData);
        if (typeof obj === 'object') {
            const newObj: any = { ...obj };
            if (newObj.image) newObj.image = fixUrl(newObj.image);
            if (newObj.src) newObj.src = fixUrl(newObj.src);
            
            ['slides', 'items', 'cards', 'features', 'steps', 'services', 'posts', 'serviceItems', 'packages', 'comments', 'reviews'].forEach(key => {
                if (newObj[key] && Array.isArray(newObj[key])) {
                    newObj[key] = newObj[key].map((subItem: any) => deepFixData(subItem));
                }
            });
            return newObj;
        }
        return obj;
    };

    let normalizedData = deepFixData(selectedData);

    // Title Fix
    if (!Array.isArray(normalizedData) && !normalizedData.title) {
        if (normalizedData.translations) {
            const tr = normalizedData.translations.find((t: any) => t.language?.code === 'tr');
            if (tr) normalizedData.title = tr.title || tr.name;
        }
        if (!normalizedData.title) normalizedData.title = normalizedData.name || "Başlık Yok";
    }

    // PROCESS FIX
    if (item.type === 'process') {
        const rawArray = normalizedData.slides || normalizedData.steps || normalizedData.items || normalizedData.stages || [];
        const safeArray = Array.isArray(rawArray) ? rawArray : [];
        const robustSlides = safeArray.map((slide: any) => {
             const fixedSlide = deepFixData(slide);
             return {
                 ...fixedSlide,
                 features: Array.isArray(fixedSlide.features) ? fixedSlide.features : [] 
             };
        });
        if (robustSlides.length === 0) robustSlides.push({ title: "Örnek Adım", features: [] });
        return { slides: robustSlides, items: robustSlides, data: { ...normalizedData, items: robustSlides }, locale, mediaBaseUrl };
    }

    let dataAsList = Array.isArray(normalizedData) ? normalizedData : [normalizedData];

    return {
        data: normalizedData,        
        items: dataAsList,           
        services: dataAsList,        
        posts: dataAsList,
        serviceItems: dataAsList, 
        packages: dataAsList,
        comments: dataAsList,
        reviews: dataAsList,
        
        locale,
        mediaBaseUrl,
        ...normalizedData 
    };
  }, [selectedData, item.type]);

  // Grid Genişliği
  const gridWidth = (item.grid_columns / 12) * 100;

  // --- RENDERING ---
  
  // 1. Veri Yükleniyorsa
  if (isLoading) {
    return (
        <div style={{ width: `${gridWidth}%`, padding: '20px' }} className="flex justify-center items-center h-32 bg-gray-50 border border-dashed animate-pulse">
            <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
            <span className="ml-2 text-xs text-gray-400">Yükleniyor...</span>
        </div>
    );
  }

  // 2. İçerik Seçilmemişse veya Veri Bulunamadıysa
  if (!selectedData) {
      return (
         <div style={{ width: `${gridWidth}%`, padding: '20px' }} className="hidden">
             {/* İçerik seçilmeyenleri önizlemede gizliyoruz, ama yer kaplamasın diye 'hidden' yapıyoruz */}
             <span className="text-red-500 text-xs">Veri Yok ({item.type})</span>
         </div>
      );
  }

  // 3. Bileşen Render
  if (!RealComponent) return <div className="text-red-500 p-4">Bileşen Bulunamadı: {item.type}</div>;

  return (
    <div style={{ width: `${gridWidth}%`, padding: '0', position: 'relative' }}>
      <RealComponent {...componentProps} />
    </div>
  );
};

// --- ANA MODAL ---
export default function LivePreviewModal({ isOpen, onClose, items }: LivePreviewModalProps) {
  const [device, setDevice] = React.useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  if (!isOpen) return null;

  const widthClass = {
    desktop: 'w-full',
    tablet: 'w-[768px]',
    mobile: 'w-[375px]'
  }[device];

  return (
    <div className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-sm flex flex-col">
      {/* Üst Bar */}
      <div className="h-14 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-6 shrink-0">
        <h2 className="text-white font-bold flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          Canlı Önizleme <span className="text-xs font-normal text-gray-400 ml-2">({items.length} bileşen)</span>
        </h2>
        
        <div className="flex bg-gray-800 rounded-lg p-1 border border-gray-700">
          <button onClick={() => setDevice('desktop')} className={`p-2 rounded ${device === 'desktop' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'}`}><Monitor className="w-4 h-4" /></button>
          <button onClick={() => setDevice('tablet')} className={`p-2 rounded ${device === 'tablet' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'}`}><Tablet className="w-4 h-4" /></button>
          <button onClick={() => setDevice('mobile')} className={`p-2 rounded ${device === 'mobile' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'}`}><Smartphone className="w-4 h-4" /></button>
        </div>

        <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Önizleme Alanı */}
      <div className="flex-1 overflow-y-auto bg-gray-950/50 flex justify-center py-8">
        {/* Device Frame */}
        <div 
            className={`${widthClass} bg-white transition-all duration-300 shadow-2xl min-h-[800px] origin-top`}
            style={{ 
                transform: device === 'mobile' ? 'scale(1)' : 'scale(1)',
                // ÖNEMLİ: Overflow-hidden'ı kaldırdık ki içerikler kesilmesin
                overflow: 'visible' 
            }}
        >
          {/* İçeriklerin Render Edildiği Yer */}
          <div className="flex flex-wrap content-start w-full h-full">
             {items.map((item) => (
                <PreviewItem key={item.id} item={item} />
             ))}
             
             {/* Liste boşsa uyarı */}
             {items.length === 0 && (
                 <div className="w-full h-96 flex flex-col items-center justify-center text-gray-400">
                     <AlertCircle className="w-10 h-10 mb-2" />
                     <p>Henüz bileşen eklenmedi.</p>
                 </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}