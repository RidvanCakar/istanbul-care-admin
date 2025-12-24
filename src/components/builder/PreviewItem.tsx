// src/components/builder/PreviewItem.tsx
import React, { useMemo } from 'react';
import { BuilderStateItem } from '@/types';
import useSWR from 'swr'; 
import { fetcher, getEndpointByType } from '@/services/api';
import { COMPONENT_REGISTRY } from '@/config/componentRegistry';

interface PreviewItemProps {
  item: BuilderStateItem;
}

export default function PreviewItem({ item }: PreviewItemProps) {
  const endpoint = getEndpointByType(item.type);
  const { data } = useSWR(endpoint, fetcher);

  // --- 1. VERİ AYIKLAMA ---
  const options = useMemo(() => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (data.data && Array.isArray(data.data)) return data.data;
    if (data.data && typeof data.data === 'object') {
       const foundArray = Object.values(data.data).find((val) => Array.isArray(val));
       if (foundArray) return foundArray as any[];
    }
    return [];
  }, [data]);

  // --- 2. SEÇİLİ VERİYİ BULMA ---
  const selectedOption = useMemo(() => {
    const rawData = options.find((o: any) => o.id === item.dbId);
    return rawData || null; 
  }, [options, item.dbId]);

  const RealComponent = COMPONENT_REGISTRY[item.type];

  // --- 3. DATA ADAPTÖRÜ ---
  const componentProps = useMemo(() => {
    if (!selectedOption) return null;

    const locale = "tr";
    const rawBaseUrl = process.env.NEXT_PUBLIC_MEDIA_BASE_URL || "https://api.istanbul-care.com";
    const mediaBaseUrl = rawBaseUrl.replace(/\/$/, ""); 

    // URL Düzeltici
    const fixUrl = (url: any) => {
        if (!url || typeof url !== 'string') return url;
        if (url.startsWith('http') || url.startsWith('blob')) return url; 
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
            if (newObj.img_url) newObj.img_url = fixUrl(newObj.img_url);
            if (newObj.src) newObj.src = fixUrl(newObj.src);
            
            ['slides', 'items', 'cards', 'features', 'steps', 'packages'].forEach(key => {
                if (newObj[key] && Array.isArray(newObj[key])) {
                    newObj[key] = newObj[key].map((subItem: any) => deepFixData(subItem));
                }
            });
            return newObj;
        }
        return obj;
    };

    let normalizedData = deepFixData(selectedOption);

    // Title Fix
    if (!normalizedData.title) {
        if (normalizedData.translations) {
            const tr = normalizedData.translations.find((t: any) => t.language?.code === 'tr');
            if (tr) {
                normalizedData.title = tr.title || tr.name;
                normalizedData.description = tr.description || tr.content;
            }
        }
        if (!normalizedData.title) normalizedData.title = normalizedData.name || "Başlık Yok";
    }

    if (item.type === 'process') {
        const safeItems = (normalizedData.steps || normalizedData.items || []).map((slide: any) => ({
             ...slide,
             features: slide.features || []
        }));
        return {
            slides: safeItems,
            items: safeItems,
            data: { ...normalizedData, items: safeItems },
            locale,
            mediaBaseUrl
        };
    }

    return {
        data: normalizedData, 
        locale: locale,
        mediaBaseUrl: mediaBaseUrl,
        ...normalizedData 
    };

  }, [selectedOption, item.type]);

  // --- RENDER ---
  
  // DEĞİŞİKLİK 1: Yüzdelik Genişlik
  const gridWidth = (item.grid_columns / 12) * 100;
  
  if (!item.dbId || !selectedOption || !RealComponent || !componentProps) {
      return null;
  }

  return (
    <div style={{ width: `${gridWidth}%`, padding: '0 8px 16px 8px' }}>
        <RealComponent {...componentProps} />
    </div>
  );
}