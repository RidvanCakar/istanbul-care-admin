import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { ComponentType } from '@/types';
import { LucideIcon, Plus } from 'lucide-react';

interface DraggableToolProps {
  id: ComponentType;
  label: string;
  icon: LucideIcon;
  onAdd: () => void;
}

export default function DraggableTool({ id, label, icon: Icon, onAdd }: DraggableToolProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `tool-${id}`,
    data: { type: id, fromSidebar: true },
  });

  // Eğer sürükleniyorsa, sidebar'da kalan kopyasını biraz soluk yapalım
  const style = {
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center justify-between p-3 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg shadow-sm group transition-all"
    >
      {/* Sürükleme Kısmı (Sol taraf) */}
      <div 
        {...listeners} 
        {...attributes}
        className="flex items-center gap-3 cursor-grab active:cursor-grabbing flex-1"
      >
        <Icon className="w-5 h-5 text-gray-600" />
        <span className="text-sm font-medium text-gray-700">{label}</span>
      </div>

      {/* Ekle Butonu (Sağ taraf) */}
      <button
        onClick={(e) => {
          e.stopPropagation(); // Tıklayınca sürüklemeyi tetiklemesin
          onAdd();
        }}
        className="p-1 text-blue-600 hover:bg-blue-50 rounded opacity-0 group-hover:opacity-100 transition-opacity"
        title="Listeye Ekle"
      >
        <Plus className="w-5 h-5" />
      </button>
    </div>
  );
}