// src/components/builder/SortableCanvasItem.tsx
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { BuilderStateItem, GridSize } from '@/types';
import { GripVertical, X, Columns, Monitor, Smartphone } from 'lucide-react';
import ContentBlockPreview from './ContentBlockPreview';

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

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 999 : 1,
  };

  // --- GENİŞLİK HESABI ---
  // Seçilen grid değerine göre Tailwind genişlik sınıfını belirliyoruz
  const widthClass = {
    12: 'w-full', // %100
    6: 'w-[49%]', // %50 Hafif boşluk diye
    4: 'w-[32%]', // %33  burda da aynı
    3: 'w-[24%]', 
    // Diğer ara değerler için varsayılan:
    1: 'w-[8%]', 2: 'w-[16%]',5: 'w-[41%]', 
    7: 'w-[58%]', 8: 'w-[66%]', 9: 'w-[75%]', 10: 'w-[83%]', 11: 'w-[91%]'
  }[item.grid_columns] || 'w-full';

  // Grid etiketini belirleme 
  const getGridLabel = (cols: number) => {
    if (cols === 12) return "Tam Genişlik";
    if (cols === 6) return "Yarım (1/2)";
    if (cols === 4) return "Üçte Bir (1/3)";
    if (cols == 3 ) return "dörtte bir (1/4)";
    return `Grid: ${cols}`;
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      // BURADA 'widthClass' KULLANARAK GENİŞLİĞİ DİNAMİK YAPIYORUZ
      // dnd-kit vertical listede alt alta durmaya devam edecektir, sadece enleri daralacak.
      className={`group relative bg-white border border-gray-200 shadow-sm rounded-lg hover:shadow-md transition-all overflow-hidden ${widthClass}`}
    >
      {/* --- KART BAŞLIĞI (HEADER) --- */}
      <div className="flex items-center justify-between px-3 py-2 bg-gray-50 border-b border-gray-100">
        
        <div className="flex items-center gap-3">
          <div 
            {...attributes} 
            {...listeners} 
            className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 p-1"
          >
            <GripVertical className="w-4 h-4" />
          </div>
          <span className="font-bold text-xs text-gray-700 uppercase tracking-wider truncate">
            {item.type}
          </span>
        </div>

        <div className="flex items-center gap-2">
          
          {/* Grid Seçici */}
          <div className="relative group/grid bg-white border border-gray-200 rounded px-2 py-1 flex items-center gap-2 h-7">
            <Columns className="w-3 h-3 text-gray-400" />
            <select
                value={item.grid_columns}
                onChange={(e) => onUpdate(item.id, { grid_columns: Number(e.target.value) as GridSize })}
                className="text-xs bg-transparent outline-none text-gray-600 font-medium cursor-pointer appearance-none pr-4 w-24"
            >
                <option value={12}>12 - Tam</option>
                <option value={6}>6 - Yarım</option>
                <option value={4}>4 - 1/3</option>
                <option value={3}>3 - 1/4</option>

            </select>
             <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                 <div className="border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-gray-400"></div>
             </div>
          </div>

          <button 
            onClick={() => onRemove(item.id)}
            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* --- İÇERİK --- */}
      <div className="p-4 bg-white">
          <ContentBlockPreview type={item.type} />
          
          <div className="mt-3 pt-3 border-t border-gray-50 flex items-center justify-between text-[10px] text-gray-400">
             <span className="flex items-center gap-1">
                <Monitor className="w-3 h-3" />
                {getGridLabel(item.grid_columns)}
             </span>
          </div>
      </div>
    </div>
  );
}