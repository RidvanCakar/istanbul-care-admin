// src/components/builder/FixedZone.tsx
import React from 'react';
import { 
  ChevronDown, 
  LayoutTemplate, 
  Menu, 
  Search, 
  UserCircle, 
  Facebook, 
  Linkedin, 
  Instagram, 
  Copyright 
} from 'lucide-react';

interface FixedZoneProps {
  type: 'Header' | 'Footer';
  selectedId?: number; 
  onChange?: (id: number) => void;
}

export default function FixedZone({ type, selectedId = 0, onChange }: FixedZoneProps) {
  
  const isDark = selectedId === 2;
  const isCentered = selectedId === 1;

  // --- STİL TANIMLARI ---
  const containerClasses = "w-full rounded-xl overflow-hidden border border-gray-200 shadow-sm bg-white transition-all duration-300 hover:shadow-md hover:border-blue-300 group";
  
  const toolbarClasses = "h-9 bg-gray-50 border-b border-gray-200 flex items-center justify-between px-3 text-xs";

  const previewContainerClasses = `relative p-6 transition-all duration-300 ${
    isDark ? 'bg-[#0f172a] text-white' : 'bg-white text-gray-800'
  }`;

  const skeletonBg = isDark ? 'bg-white/10' : 'bg-gray-100';
  const skeletonText = isDark ? 'bg-white/20' : 'bg-gray-200';
  const borderColor = isDark ? 'border-white/10' : 'border-gray-100';

  return (
    <div className={containerClasses}>
      
      {/* 1. ÜST TOOLBAR */}
      <div className={toolbarClasses}>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${type === 'Header' ? 'bg-orange-400' : 'bg-purple-400'}`}></div>
          <span className="font-semibold text-gray-600 uppercase tracking-wider text-[10px]">
            {type === 'Header' ? ' Header' : ' Footer'}
          </span>
        </div>

        <div className="relative flex items-center group/select">
          <LayoutTemplate className="w-3 h-3 text-gray-400 mr-2" />
          <select 
            value={selectedId}
            onChange={(e) => onChange && onChange(Number(e.target.value))}
            className="appearance-none bg-transparent hover:bg-gray-200 rounded px-2 py-1 pr-6 cursor-pointer outline-none text-gray-700 font-medium transition-colors"
          >
            <option value={0}>Standart Düzen</option>
            <option value={1}>Ortalı / Minimal</option>
            <option value={2}>Karanlık Mod</option>
          </select>
          <ChevronDown className="w-3 h-3 text-gray-400 absolute right-2 pointer-events-none" />
        </div>
      </div>

      {/* 2. GÖRSEL ÖNİZLEME */}
      <div className={previewContainerClasses}>
        
        {/* --- HEADER --- */}
        {type === 'Header' && (
          <div className={`flex items-center ${isCentered ? 'justify-center relative' : 'justify-between'}`}>
            <div className={`flex items-center gap-2 ${isCentered ? 'absolute left-0' : ''}`}>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isDark ? 'bg-blue-600 text-white' : 'bg-blue-600 text-white'}`}>
                <span className="font-bold text-xs">IC</span>
              </div>
              {!isCentered && <div className={`h-3 w-20 rounded ${skeletonText}`}></div>}
            </div>

            <div className={`flex items-center gap-6 ${isCentered ? 'hidden md:flex' : 'hidden md:flex'}`}>
               <div className={`h-2 w-12 rounded-full ${skeletonText}`}></div>
               <div className={`h-2 w-12 rounded-full ${skeletonText}`}></div>
               <div className={`h-2 w-12 rounded-full ${skeletonText}`}></div>
               <div className={`h-2 w-12 rounded-full ${skeletonText}`}></div>
            </div>

            <div className={`flex items-center gap-3 ${isCentered ? 'absolute right-0' : ''}`}>
               <Search className={`w-4 h-4 opacity-50`} />
               <div className={`h-8 px-4 rounded-md flex items-center text-xs font-medium border ${borderColor} ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
                  Giriş
               </div>
               <UserCircle className={`w-5 h-5 opacity-50 hidden sm:block`} />
            </div>
            <Menu className="w-5 h-5 md:hidden opacity-70" />
          </div>
        )}


        {/* --- FOOTER --- */}
        {type === 'Footer' && (
          <div className="space-y-6">
             <div className={`flex flex-col md:flex-row gap-8 ${isCentered ? 'text-center items-center' : 'justify-between'}`}>
                
                <div className={`space-y-3 ${isCentered ? 'flex flex-col items-center' : 'max-w-xs'}`}>
                   <div className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded bg-gray-400/20`}></div>
                      <div className={`h-3 w-24 rounded ${skeletonText}`}></div>
                   </div>
                   <div className={`h-2 w-full rounded ${skeletonBg}`}></div>
                   <div className={`h-2 w-2/3 rounded ${skeletonBg}`}></div>
                </div>

                <div className="flex gap-8 text-xs opacity-60">
                   <div className="space-y-2">
                      <div className={`h-2 w-12 rounded bg-current opacity-50 mb-3`}></div>
                      <div className="h-1.5 w-16 rounded bg-current opacity-30"></div>
                      <div className="h-1.5 w-14 rounded bg-current opacity-30"></div>
                      <div className="h-1.5 w-10 rounded bg-current opacity-30"></div>
                   </div>
                   {!isCentered && (
                    <div className="space-y-2 hidden sm:block">
                        <div className={`h-2 w-12 rounded bg-current opacity-50 mb-3`}></div>
                        <div className="h-1.5 w-16 rounded bg-current opacity-30"></div>
                        <div className="h-1.5 w-14 rounded bg-current opacity-30"></div>
                    </div>
                   )}
                </div>
             </div>

             <div className={`pt-4 border-t ${borderColor} flex flex-col sm:flex-row items-center justify-between gap-4`}>
                <div className="flex items-center gap-1 text-[10px] opacity-40">
                   <Copyright className="w-3 h-3" />
                   <span>2025 Istanbul Care. Tüm hakları saklıdır.</span>
                </div>

                {/* --- SOSYAL MEDYA LİNKLERİ --- */}
                <div className="flex gap-4 items-center">
                   
                   {/* Facebook */}
                   <a 
                     href="https://www.facebook.com/istanbulcare/" 
                     target="_blank" 
                     rel="noopener noreferrer" 
                     className="opacity-50 hover:opacity-100 hover:text-blue-600 transition-all"
                   >
                     <Facebook className="w-4 h-4" />
                   </a>

                   {/* LinkedIn  */}
                   <a 
                     href="https://www.linkedin.com/company/istanbul-care-clinic/" 
                     target="_blank" 
                     rel="noopener noreferrer" 
                     className="opacity-50 hover:opacity-100 hover:text-blue-700 transition-all"
                   >
                     <Linkedin className="w-4 h-4" />
                   </a>

                   {/* Instagram */}
                   <a 
                     href="https://www.instagram.com/istanbul_care_clinic" 
                     target="_blank" 
                     rel="noopener noreferrer" 
                     className="opacity-50 hover:opacity-100 hover:text-pink-600 transition-all"
                   >
                     <Instagram className="w-4 h-4" />
                   </a>

                </div>
             </div>
          </div>
        )}

        <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-500/10 pointer-events-none rounded-xl transition-colors"></div>
      </div>
    </div>
  );
}