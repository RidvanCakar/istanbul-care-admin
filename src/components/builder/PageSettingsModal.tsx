import React from 'react';
import { X, Globe, Search, FileText } from 'lucide-react';
import { PageData } from '@/types';

interface PageSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: Partial<PageData>;
  onUpdate: (updates: Partial<PageData>) => void;
}

export default function PageSettingsModal({ isOpen, onClose, settings, onUpdate }: PageSettingsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 transition-all">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* --- BAŞLIK --- */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
          <div className="flex items-center gap-2">
             <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
               <Globe className="w-5 h-5" />
             </div>
             <div>
               <h2 className="font-bold text-gray-800">Sayfa Ayarları</h2>
               <p className="text-xs text-gray-500">SEO ve genel sayfa bilgileri</p>
             </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* --- FORM İÇERİĞİ --- */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Bölüm 1: Genel Bilgiler */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-gray-400" />
              Genel Bilgiler
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-600">Sayfa Başlığı (H1)</label>
                <input 
                  type="text" 
                  value={settings.title || ''}
                  onChange={(e) => onUpdate({ title: e.target.value })}
                  placeholder="Örn: Hakkımızda"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm transition-shadow"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-600">URL Yolu (Slug)</label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-xs">/</span>
                  <input 
                    type="text" 
                    value={settings.slug || ''}
                    onChange={(e) => onUpdate({ slug: e.target.value })}
                    placeholder="hakkimizda"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-600">Kısa Açıklama (Excerpt)</label>
                <textarea 
                  value={settings.excerpt || ''}
                  onChange={(e) => onUpdate({ excerpt: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                ></textarea>
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* Bölüm 2: SEO Ayarları */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <Search className="w-4 h-4 text-gray-400" />
              SEO Yapılandırması
            </h3>
            
            <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-600">Meta Başlık (Title)</label>
                <input 
                  type="text" 
                  value={settings.meta_title || ''}
                  onChange={(e) => onUpdate({ meta_title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                />
                <p className="text-[10px] text-gray-400 text-right">{settings.meta_title?.length || 0}/60</p>
            </div>

            <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-600">Meta Açıklama (Description)</label>
                <textarea 
                  value={settings.meta_description || ''}
                  onChange={(e) => onUpdate({ meta_description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                ></textarea>
                <p className="text-[10px] text-gray-400 text-right">{settings.meta_description?.length || 0}/160</p>
            </div>

            <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-600">Odak Anahtar Kelime</label>
                <input 
                  type="text" 
                  value={settings.focus_keyword || ''}
                  onChange={(e) => onUpdate({ focus_keyword: e.target.value })}
                  placeholder="örn: istanbul saç ekimi"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                />
            </div>

            <div className="flex items-center gap-6 pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={settings.robots_index ?? true}
                  onChange={(e) => onUpdate({ robots_index: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300" 
                />
                <span className="text-sm text-gray-700">İndekslensin (Index)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={settings.robots_follow ?? true}
                  onChange={(e) => onUpdate({ robots_follow: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300" 
                />
                <span className="text-sm text-gray-700">Takip Edilsin (Follow)</span>
              </label>
            </div>
          </div>

        </div>

        {/* --- FOOTER --- */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 shadow-sm transition-all active:scale-95"
          >
            Tamamla
          </button>
        </div>

      </div>
    </div>
  );
}