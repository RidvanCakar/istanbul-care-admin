// src/components/builder/ContentBlockPreview.tsx
import React from 'react';
import { ComponentType } from '@/types';
// YENİ İKONLAR EKLENDİ: User, Tag
import { Image, AlignLeft, Star, Share2, Briefcase, User, Tag } from 'lucide-react';

interface ContentBlockPreviewProps {
  type: ComponentType;
}

export default function ContentBlockPreview({ type }: ContentBlockPreviewProps) {
  
  // Ortak stil sınıfları
  const skeletonText = "bg-gray-200 rounded";
  const skeletonBox = "bg-gray-100 rounded border border-gray-200";

  switch (type) {
    case 'hero':
      return (
        <div className="flex flex-col gap-3 p-2">
          <div className={`w-full h-24 ${skeletonBox} flex items-center justify-center text-gray-300`}>
            <Image className="w-8 h-8" />
          </div>
          <div className={`w-2/3 h-4 ${skeletonText}`}></div>
          <div className={`w-1/2 h-3 ${skeletonText} opacity-60`}></div>
        </div>
      );

    case 'card':
      return (
        <div className="p-2 border border-gray-100 rounded-lg shadow-sm bg-white">
          <div className={`w-8 h-8 rounded mb-3 bg-blue-50 flex items-center justify-center text-blue-400`}>
             <Star className="w-4 h-4" />
          </div>
          <div className={`w-3/4 h-3 ${skeletonText} mb-2`}></div>
          <div className={`w-full h-2 ${skeletonText} opacity-50`}></div>
        </div>
      );

    case 'process':
      return (
        <div className="flex items-center gap-4 p-4 justify-center">
           {[1, 2, 3].map(step => (
             <div key={step} className="flex flex-col items-center gap-2 text-center flex-1">
                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-[10px] border border-blue-200">
                  {step}
                </div>
                <div className={`w-full h-1.5 bg-gray-100 rounded`}></div>
             </div>
           ))}
        </div>
      );

    // --- YENİ EKLENEN: USER (Kullanıcı Kartı Görünümü) ---
    case 'user':
      return (
        <div className="flex items-center gap-3 p-3 border border-gray-100 rounded-lg bg-white shadow-sm">
           {/* Avatar Yuvarlağı */}
           <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 shrink-0">
              <User className="w-5 h-5" />
           </div>
           {/* İsim ve Role Çizgileri */}
           <div className="space-y-2 flex-1">
              <div className={`w-1/2 h-2.5 ${skeletonText}`}></div>
              <div className={`w-3/4 h-2 ${skeletonText} opacity-60`}></div>
           </div>
        </div>
      );

    // --- YENİ EKLENEN: TAG (Etiket Bulutu Görünümü) ---
    case 'tag':
      return (
        <div className="flex flex-wrap gap-2 p-2">
           {[1, 2, 3, 4].map(i => (
              <div key={i} className="px-3 py-1 bg-blue-50 border border-blue-100 rounded-full flex items-center gap-1">
                 <Tag className="w-3 h-3 text-blue-300" />
                 <div className="w-8 h-1.5 bg-blue-200 rounded-full opacity-50"></div>
              </div>
           ))}
        </div>
      );

    case 'contact_form': 
      return (
        <div className="space-y-2 p-2 max-w-sm mx-auto bg-gray-50/30 rounded border border-gray-100">
           <div className="flex gap-2">
              <div className="w-full h-6 bg-white border border-gray-200 rounded"></div>
              <div className="w-full h-6 bg-white border border-gray-200 rounded"></div>
           </div>
           <div className="w-full h-12 bg-white border border-gray-200 rounded"></div>
           <div className="w-16 h-6 bg-blue-600 rounded opacity-80"></div>
        </div>
      );
      
    case 'before_after':
        return (
            <div className="flex gap-1 h-16">
                <div className={`w-1/2 h-full ${skeletonBox} flex items-center justify-center text-[10px] text-gray-400`}>Önce</div>
                <div className={`w-1/2 h-full ${skeletonBox} bg-green-50/50 flex items-center justify-center text-[10px] text-green-600 font-medium`}>Sonra</div>
            </div>
        );

    case 'blog':
      return (
        <div className="space-y-2 p-1">
           {[1, 2].map((i) => (
             <div key={i} className="flex gap-3">
               <div className={`w-10 h-10 ${skeletonBox} shrink-0`}></div>
               <div className="space-y-1.5 w-full pt-1">
                 <div className={`w-3/4 h-2.5 ${skeletonText}`}></div>
                 <div className={`w-1/2 h-2 ${skeletonText} opacity-60`}></div>
               </div>
             </div>
           ))}
        </div>
      );

    case 'service': 
       return (
         <div className="grid grid-cols-2 gap-2 p-1">
            {[1, 2].map(i => (
                <div key={i} className="p-2 border border-gray-100 rounded bg-gray-50/50 flex flex-col items-center gap-1">
                    <Briefcase className="w-4 h-4 text-gray-400" />
                    <div className={`w-8 h-1.5 ${skeletonText}`}></div>
                </div>
            ))}
         </div>
       );

    case 'social_media': 
        return (
            <div className="flex justify-center gap-3 p-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center"><Share2 className="w-4 h-4 text-blue-500"/></div>
                <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center"><Image className="w-4 h-4 text-pink-500"/></div>
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center"><Briefcase className="w-4 h-4 text-blue-700"/></div>
            </div>
        );

    case 'review': 
        return (
            <div className="flex gap-2 overflow-hidden p-1">
                {[1, 2].map(i => (
                    <div key={i} className="flex-1 min-w-[80px] p-2 border border-gray-100 rounded-lg bg-yellow-50/30">
                        <div className="flex gap-0.5 mb-1.5">
                            {[1,2,3,4,5].map(s => <div key={s} className="w-1.5 h-1.5 rounded-full bg-yellow-400"></div>)}
                        </div>
                        <div className={`w-full h-1.5 ${skeletonText} mb-1`}></div>
                        <div className={`w-2/3 h-1.5 ${skeletonText}`}></div>
                    </div>
                ))}
            </div>
        );

    default:
      return (
        <div className="flex items-center gap-3 p-2 opacity-50">
           <AlignLeft className="w-5 h-5" />
           <div className="space-y-1 w-full">
             <div className={`w-full h-2 ${skeletonText}`}></div>
             <div className={`w-2/3 h-2 ${skeletonText}`}></div>
           </div>
        </div>
      );
  }
}