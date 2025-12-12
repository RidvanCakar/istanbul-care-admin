// src/components/builder/SortableCanvasItem.tsx
import React, { useState } from 'react'; 
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { BuilderStateItem, GridSize } from '@/types';
import { GripVertical, X, Columns, Link2, ChevronDown, Plus } from 'lucide-react'; 
import ContentBlockPreview from './ContentBlockPreview';
import useSWR from 'swr'; 
import { fetcher, getEndpointByType } from '@/services/api';
import QuickCreateModal from './QuickCreateModal'; 

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

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 999 : 1,
  };

  const endpoint = getEndpointByType(item.type);
  const { data, isLoading } = useSWR(endpoint, fetcher);

  // Modal Başarılı Olduğunda
  const handleCreateSuccess = (newId: number) => {
    onUpdate(item.id, { dbId: newId });
    setIsModalOpen(false);
  };

  // --- 1. VERİYİ AYIKLAMA ---
  let options: any[] = [];
  if (data) {
    if (Array.isArray(data)) {
      options = data;
    } else if (data.data && Array.isArray(data.data)) {
      options = data.data;
    } else if (data.data && typeof data.data === 'object') {
       const keys = Object.keys(data.data);
       const arrayKey = keys.find(key => Array.isArray(data.data[key]));
       if (arrayKey) options = data.data[arrayKey];
    }
  }

  // --- 2. GELİŞMİŞ ETİKET OLUŞTURUCU ---
  const getLabel = (opt: any) => {
    // A. Users
    if (opt.full_name) return `${opt.full_name} (${opt.email || opt.role})`;

    // B. Translations
    if (opt.translations && Array.isArray(opt.translations) && opt.translations.length > 0) {
        const tr = opt.translations[0];
        const label = tr.title || tr.name || tr.question;
        if (label) {
            if (opt.type && typeof opt.type === 'string') return `${label} (${opt.type})`;
            return `${label} (ID: ${opt.id})`;
        }
    }

    // C. Standard
    if (opt.title) return opt.title;
    if (opt.name) return opt.name;
    if (opt.question) return opt.question; 
    
    return `Kayıt #${opt.id}`;
  };

  // --- 3. GENİŞLİK HESABI ---
  const widthClass = {
    12: 'w-full', 6: 'w-[49%]', 4: 'w-[32%]', 3: 'w-[24%]',
    1: 'w-[8%]', 2: 'w-[16%]', 5: 'w-[41%]', 
    7: 'w-[58%]', 8: 'w-[66%]', 9: 'w-[75%]', 10: 'w-[83%]', 11: 'w-[91%]'
  }[item.grid_columns] || 'w-full';

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className={`group relative bg-white rounded-xl transition-all duration-200 overflow-hidden ${widthClass} ${
          isDragging 
            ? 'shadow-2xl ring-2 ring-blue-500 rotate-2 scale-105 cursor-grabbing' 
            : 'shadow-sm hover:shadow-lg ring-1 ring-gray-200 hover:ring-blue-300'
        }`}
      >
        {/* --- KART BAŞLIĞI --- */}
        <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100 group-hover:bg-gray-50/50 transition-colors">
          
          <div className="flex items-center gap-3">
            <div 
              {...attributes} 
              {...listeners} 
              className="cursor-grab active:cursor-grabbing text-gray-300 hover:text-blue-500 hover:bg-blue-50 p-1.5 rounded transition-colors"
            >
              <GripVertical className="w-5 h-5" />
            </div>
            
            <div className="flex flex-col">
              <span className="font-bold text-xs text-gray-800 uppercase tracking-widest">
                  {item.type.replace('_', ' ')}
              </span>
              {item.dbId && (
                  <span className="text-[10px] text-green-600 font-medium flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                      API Bağlı
                  </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div className="flex items-center bg-gray-100 rounded-md px-2 py-1 h-8">
               <Columns className="w-3.5 h-3.5 text-gray-500 mr-2" />
               <select
                  value={item.grid_columns}
                  onChange={(e) => onUpdate(item.id, { grid_columns: Number(e.target.value) as GridSize })}
                  className="bg-transparent text-xs font-semibold text-gray-700 outline-none cursor-pointer appearance-none"
               >
                  <option value={12}>12 (Tam)</option>
                  <option value={6}>6 (Yarım)</option>
                  <option value={4}>4 (1/3)</option>
                  <option value={3}>3 (1/4)</option>
               </select>
            </div>

            <button 
              onClick={() => onRemove(item.id)}
              className="h-8 w-8 flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* --- İÇERİK ALANI --- */}
        <div className="p-5 bg-white space-y-4">
            
            {/* İÇERİK SEÇİCİ + HIZLI EKLEME BUTONU */}
            <div className="flex gap-2">
                
                {/* Dropdown */}
                <div className="relative group/select flex-1">
                   <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within/select:text-blue-500 transition-colors">
                      <Link2 className="w-4 h-4" />
                   </div>
                   
                   <select
                     value={item.dbId || 0}
                     onChange={(e) => onUpdate(item.id, { dbId: Number(e.target.value) })}
                     disabled={isLoading || !endpoint}
                     className={`w-full pl-10 pr-8 py-2.5 text-sm border rounded-lg appearance-none outline-none transition-all cursor-pointer shadow-sm ${
                       !item.dbId 
                         ? 'border-gray-200 bg-gray-50 text-gray-500 hover:border-blue-300 hover:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10'
                         : 'border-green-200 bg-green-50/30 text-green-700 font-medium'
                     }`}
                   >
                      <option value={0}>
                        {isLoading ? "Veriler Yükleniyor..." : "Bir İçerik Seçin..."}
                      </option>
                      
                      {options?.map((opt: any) => (
                        <option key={opt.id} value={opt.id}>
                          {getLabel(opt)}
                        </option>
                      ))}
                   </select>

                   <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
                      <ChevronDown className="w-4 h-4" />
                   </div>
                </div>

                {/* HIZLI EKLE BUTONU (TÜM ELEMENTLER İÇİN AKTİF) */}
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center justify-center w-10 h-10 border border-blue-200 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 hover:border-blue-300 transition-colors shadow-sm"
                  title="Yeni Ekle"
                >
                  <Plus className="w-5 h-5" />
                </button>
            </div>

            {/* Önizleme */}
            <div className={`rounded-lg border border-gray-100 p-2 transition-all duration-300 ${!item.dbId ? 'bg-gray-50 opacity-60 grayscale' : 'bg-white'}`}>
                <ContentBlockPreview type={item.type} />
            </div>
            
        </div>
      </div>

      {/* --- QUICK CREATE MODAL --- */}
      <QuickCreateModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        type={item.type}
        onSuccess={handleCreateSuccess}
      />
    </>
  );
}