import React from 'react';
import { TOOLS } from '@/data/tools';
import DraggableTool from './DraggableTool';
import { ComponentType } from '@/types';

interface BuilderSidebarProps {
  onAddItem: (type: ComponentType) => void;
}

export default function BuilderSidebar({ onAddItem }: BuilderSidebarProps) {
  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-full z-10 relative">
      <div className="p-4 border-b border-gray-200">
        <h2 className="font-semibold text-gray-700">Elementler</h2>
        <p className="text-xs text-gray-500 mt-1">Sürükleyin veya (+) ile ekleyin</p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {TOOLS.map((tool) => (
          <DraggableTool 
            key={tool.id} 
            id={tool.id} 
            label={tool.label} 
            icon={tool.icon} 
            onAdd={() => onAddItem(tool.id)}
          />
        ))}
      </div>
    </div>
  );
}