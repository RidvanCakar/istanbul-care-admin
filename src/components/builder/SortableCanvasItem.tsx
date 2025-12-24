// src/components/builder/SortableCanvasItem.tsx
import React, { useMemo } from 'react'; 
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { BuilderStateItem, GridSize } from '@/types';
import { GripVertical, X, Columns, Link2, ChevronDown, RefreshCw, Eye, Move } from 'lucide-react'; 
import useSWR from 'swr'; 
import { fetcher, getEndpointByType } from '@/services/api';
import { COMPONENT_REGISTRY } from '@/config/componentRegistry';

interface SortableCanvasItemProps {
  item: BuilderStateItem;
  onRemove: (id: string) => void;
  onUpdate: (id: string, updates: Partial<BuilderStateItem>) => void;
}

export default function SortableCanvasItem({ item, onRemove, onUpdate }: SortableCanvasItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: item.id });

  // 1. CSS AYARLARI (Tam Ekran Görünüm)
  const gridWidth = (item.grid_columns / 12) * 100;

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1, 
    zIndex: isDragging ? 999 : 1,
    width: `${gridWidth}%`,
    position: 'relative' as const,
    padding: '0', 
    marginBottom: '16px',
  };

  const endpoint = getEndpointByType(item.type);
  const { data, isLoading } = useSWR(endpoint, fetcher);

  // --- 1. VERİ AYIKLAMA ---
  const options = useMemo(() => {
    if (!data) return [];
    
    if (Array.isArray(data)) return data;
    if (data.data && Array.isArray(data.data)) return data.data;

    if (data.data && typeof data.data === 'object') {
       const typeStr = item.type as string;
       // Tip bazlı liste bulucu
       if ((typeStr === 'services' || typeStr === 'service') && Array.isArray(data.data.services)) return data.data.services;
       if ((typeStr === 'blogs' || typeStr === 'blog') && Array.isArray(data.data.posts)) return data.data.posts;
       
       // Genel arama
       const keys = Object.keys(data.data);
       for (const key of keys) {
           if (Array.isArray(data.data[key])) return data.data[key];
       }
    }
    return [];
  }, [data, item.type]);

  // --- 2. SEÇİLİ VERİ ---
  const selectedData = useMemo(() => {
    return options.find((o: any) => o.id === item.dbId) || null;
  }, [options, item.dbId]);

  const RealComponent = COMPONENT_REGISTRY[item.type];

  // --- 3. PROPS ADAPTÖRÜ (ZIRHLI KORUMA 🛡️) ---
  const componentProps = useMemo(() => {
    if (!selectedData) return null;

    const locale = "tr";
    const rawBaseUrl = process.env.NEXT_PUBLIC_MEDIA_BASE_URL || "https://api.istanbul-care.com";
    const mediaBaseUrl = rawBaseUrl.replace(/\/$/, ""); 

    // URL Düzeltici
    const fixUrl = (url: any) => {
        if (!url || typeof url !== 'string') return url;
        if (url.startsWith('http')) return url;
        const cleanPath = url.startsWith('/') ? url.substring(1) : url;
        return `${mediaBaseUrl}/${cleanPath}`;
    };

    // Deep Fix
    const deepFixData = (obj: any): any => {
        if (!obj) return obj;
        if (Array.isArray(obj)) return obj.map(deepFixData);
        if (typeof obj === 'object') {
            const newObj: any = { ...obj };
            if (newObj.image) newObj.image = fixUrl(newObj.image);
            if (newObj.src) newObj.src = fixUrl(newObj.src);
            
            ['slides', 'items', 'cards', 'features', 'steps', 'services', 'posts', 'serviceItems'].forEach(key => {
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

    // 🔥 PROCESS FIX (HATA BURADAYDI) 🔥
    if (item.type === 'process') {
        // 1. Veriyi bul
        const rawArray = normalizedData.slides || normalizedData.steps || normalizedData.items || normalizedData.stages || [];
        const safeArray = Array.isArray(rawArray) ? rawArray : [];

        // 2. Her adımın içine 'features' ekle (Yoksa boş array ver)
        const robustSlides = safeArray.map((slide: any) => {
             const fixedSlide = deepFixData(slide);
             return {
                 ...fixedSlide,
                 // Features yoksa boş array ata ki .map patlamasın
                 features: Array.isArray(fixedSlide.features) ? fixedSlide.features : [] 
             };
        });

        // 3. Eğer hiç slide yoksa, fake bir tane ekle ki sayfa çökmesin
        if (robustSlides.length === 0) {
            robustSlides.push({ title: "Örnek Adım", features: [] });
        }

        return {
            slides: robustSlides, // Component bunu bekliyor
            items: robustSlides,
            data: { ...normalizedData, items: robustSlides }, 
            locale,
            mediaBaseUrl
        };
    }

    // Diğerleri için Standart Liste
    let dataAsList = Array.isArray(normalizedData) ? normalizedData : [normalizedData];

    return {
        data: normalizedData,        
        items: dataAsList,           
        services: dataAsList,        
        posts: dataAsList,
        serviceItems: dataAsList,
        locale,
        mediaBaseUrl,
        ...normalizedData 
    };
  }, [selectedData, item.type]);


  // --- 4. RENDER ---
  const hasContent = item.dbId && selectedData;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group/item relative outline-none"
    >
       <div className={`
        relative w-full h-full transition-all duration-200 min-h-[100px] overflow-hidden
        ${!hasContent ? 'bg-white border-2 border-dashed border-gray-300 rounded-xl' : ''}
        ${isDragging ? 'opacity-50' : 'hover:outline hover:outline-2 hover:outline-blue-500 hover:z-50'}
      `}>
      
      {/* Kontrol Butonları */}
      <div className="absolute top-0 right-0 z-[100] flex items-center gap-1 p-1.5 opacity-0 group-hover/item:opacity-100 transition-opacity bg-blue-600 text-white rounded-bl-lg shadow-lg cursor-default">
            <div {...attributes} {...listeners} className="p-1 hover:bg-blue-700 rounded cursor-grab active:cursor-grabbing" title="Taşı">
                <Move className="w-3.5 h-3.5" />
            </div>
            <div className="flex items-center bg-blue-700 rounded px-1.5 py-0.5 h-6">
                 <select 
                    value={item.grid_columns} 
                    onPointerDown={(e) => e.stopPropagation()}
                    onChange={(e) => onUpdate(item.id, { grid_columns: Number(e.target.value) as GridSize })} 
                    className="bg-transparent text-[10px] font-bold outline-none cursor-pointer appearance-none text-center min-w-[30px]"
                 >
                    <option value={12}>Tam</option>
                    <option value={8}>2/3</option>
                    <option value={6}>1/2</option>
                    <option value={4}>1/3</option>
                    <option value={3}>1/4</option>
                 </select>
            </div>
             <button onPointerDown={(e) => e.stopPropagation()} onClick={() => onUpdate(item.id, { dbId: undefined })} className="p-1 hover:bg-blue-500 rounded transition-colors" title="Değiştir">
                <RefreshCw className="w-3.5 h-3.5" />
            </button>
            <button onPointerDown={(e) => e.stopPropagation()} onClick={() => onRemove(item.id)} className="p-1 hover:bg-red-500 rounded transition-colors" title="Sil">
                <X className="w-3.5 h-3.5" />
            </button>
      </div>

      {/* İçerik */}
      {hasContent && RealComponent && componentProps ? (
        <div className="w-full h-full">
           <div className="pointer-events-none select-none"> 
              <RealComponent {...componentProps} />
           </div>
        </div>
      ) : (
      /* Seçim Modu */
        <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
             <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mb-3 text-gray-400">
               <Eye className="w-5 h-5" />
             </div>
             <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">{item.type.replace('_', ' ')}</h3>
             
             <div className="relative group/select w-full max-w-[200px]">
               <div className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400"><Link2 className="w-3 h-3" /></div>
               <select
                 value={item.dbId || 0}
                 onPointerDown={(e) => e.stopPropagation()}
                 onChange={(e) => onUpdate(item.id, { dbId: Number(e.target.value) })}
                 disabled={isLoading}
                 className="w-full text-xs border border-gray-300 rounded-md pl-7 pr-2 py-2 outline-none focus:border-blue-500 bg-white shadow-sm cursor-pointer"
               >
                  <option value={0}>{isLoading ? "Yükleniyor..." : "İçerik Seç..."}</option>
                  {options?.map((opt: any) => (
                      <option key={opt.id} value={opt.id}>
                          {opt.title || opt.name || opt.full_name || `Kayıt #${opt.id}`}
                      </option>
                  ))}
               </select>
               <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none opacity-50"><ChevronDown className="w-3 h-3" /></div>
             </div>
        </div>
      )}
      </div>
      
      {/* Etiket */}
      <div className="absolute top-0 left-2 -translate-y-1/2 bg-gray-900 text-white text-[9px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover/item:opacity-100 transition-opacity pointer-events-none uppercase z-50">
        {item.type}
      </div>

    </div>
  );
}