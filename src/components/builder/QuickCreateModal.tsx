// src/components/builder/QuickCreateModal.tsx
import React, { useState } from 'react';
import { X, Save, Loader2, Layout, FileText, Briefcase } from 'lucide-react';
import { ComponentType } from '@/types';
import { createEntry } from '@/services/api';
import { useSWRConfig } from 'swr';

interface QuickCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: ComponentType;
  onSuccess: (newId: number) => void;
}

export default function QuickCreateModal({ isOpen, onClose, type, onSuccess }: QuickCreateModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const { mutate } = useSWRConfig();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // --- PAYLOAD HAZIRLAMA ---
      let payload = { ...formData };

      // Hero, Card, Blog için özel yapı (translations)
      if (['hero', 'card', 'blog', 'service', 'process', 'before_after'].includes(type)) {
         payload = {
           title: formData.title, 
           name: formData.title,
           translations: [
             { language_code: 'tr', title: formData.title, name: formData.title }
           ]
         };
      }

      const result = await createEntry(type, payload);
      
      // Listeyi yenile
      mutate((key) => true); 
      
      // ID Yakalama (Backend yapısına göre farklılık gösterebilir)
      const newId = result.data?.id || result.id || result.data?.users?.[0]?.id;
      onSuccess(newId);
      
      onClose();
    } catch (error) {
      alert("Hata: " + error);
    } finally {
      setLoading(false);
    }
  };

  // --- FORM ALANLARI ---
  const renderFields = () => {
    switch (type) {
      // 1. TAG
      case 'tag':
        return (
          <div className="space-y-3">
             <label className="block text-sm font-medium text-gray-700">Etiket Adı</label>
             <input 
               type="text" 
               className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
               placeholder="Örn: Yeni Etiket"
               onChange={(e) => setFormData({ ...formData, name: e.target.value })}
             />
          </div>
        );
      
      // 2. KULLANICI (GÜNCELLENDİ: Telefon ve Şifre Eklendi)
      case 'user':
        return (
           <div className="space-y-3">
             <div className="grid grid-cols-2 gap-3">
                 <div>
                    <label className="block text-sm font-medium text-gray-700">İsim Soyisim</label>
                    <input 
                      type="text" 
                      required
                      className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    />
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700">Telefon</label>
                    <input 
                      type="text" 
                      required
                      placeholder="0555..."
                      className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                    />
                 </div>
             </div>

             <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input 
                  type="email" 
                  required
                  className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
             </div>

             {/* YENİ EKLENEN: ŞİFRE ALANI */}
             <div>
                <label className="block text-sm font-medium text-gray-700">Şifre</label>
                <input 
                  type="password" 
                  required
                  className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
             </div>

             <div>
                <label className="block text-sm font-medium text-gray-700">Rol</label>
                <select 
                  className="w-full border border-gray-300 rounded-md p-2 text-sm"
                  defaultValue="admin"
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                >
                    <option value="admin">Admin</option>
                    <option value="editor">Editor</option>
                    <option value="seo">SEO</option>
                </select>
             </div>
           </div>
        );

      // 3. GENEL
      default:
        return (
          <div className="space-y-4">
             <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 flex gap-3 items-start">
                <div className="mt-1"><Layout className="w-4 h-4 text-blue-600"/></div>
                <div className="text-xs text-blue-800">
                  Şu an hızlıca bir <strong>{type.toUpperCase()}</strong> taslağı oluşturuyorsunuz. Detaylı ayarları (Resim, Açıklama vb.) panelden yapabilirsiniz.
                </div>
             </div>

             <div>
                <label className="block text-sm font-medium text-gray-700">Başlık / İsim</label>
                <input 
                  type="text" 
                  required
                  className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder={`Yeni ${type} başlığı...`}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
             </div>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-100">
           <h3 className="font-bold text-gray-800 flex items-center gap-2">
             <span className="uppercase text-blue-600 bg-blue-50 px-2 py-0.5 rounded text-xs tracking-wider border border-blue-100">
                {type}
             </span> 
             <span>Oluştur</span>
           </h3>
           <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded-full text-gray-500 transition-colors">
             <X className="w-5 h-5" />
           </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
           {renderFields()}

           <div className="pt-2 flex justify-end gap-3">
              <button 
                type="button" 
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                İptal
              </button>
              <button 
                type="submit" 
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-2 disabled:opacity-50 transition-colors shadow-sm"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin"/> : <Save className="w-4 h-4" />}
                Kaydet
              </button>
           </div>
        </form>

      </div>
    </div>
  );
}