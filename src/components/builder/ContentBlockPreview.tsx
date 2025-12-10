// src/components/builder/ContentBlockPreview.tsx
import React from 'react';
import { ComponentType } from '@/types';
import { Image, AlignLeft, Star, Share2, MessageSquare, Briefcase } from 'lucide-react';

interface ContentBlockPreviewProps {
  type: ComponentType;
}

export default function ContentBlockPreview({ type }: ContentBlockPreviewProps) {
  
  // Ortak stil sınıfları (İskelet görünümü için)
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
          <div className="flex gap-2 mt-1">
            <div className="w-20 h-6 bg-blue-100 rounded"></div>
            <div className="w-20 h-6 bg-gray-100 rounded"></div>
          </div>
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
          <div className={`w-full h-2 ${skeletonText} opacity-50 mt-1`}></div>
        </div>
      );

    case 'process': // <-- YENİ EKLENDİ
      return (
        <div className="flex items-center gap-4 p-4 justify-center">
           {[1, 2, 3].map(step => (
             <div key={step} className="flex flex-col items-center gap-2 text-center flex-1">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs border border-blue-200">
                  {step}
                </div>
                <div className={`w-full h-2 bg-gray-100 rounded`}></div>
             </div>
           ))}
        </div>
      );

    case 'contact_form': // <-- GÜNCELLENDİ
      return (
        <div className="space-y-3 p-3 max-w-sm mx-auto bg-gray-50/30 rounded border border-gray-100">
           <div className="flex gap-2">
              <div className="w-full h-8 bg-white border border-gray-200 rounded"></div>
              <div className="w-full h-8 bg-white border border-gray-200 rounded"></div>
           </div>
           <div className="w-full h-8 bg-white border border-gray-200 rounded"></div>
           <div className="w-full h-16 bg-white border border-gray-200 rounded"></div>
           <div className="w-24 h-8 bg-blue-600 rounded opacity-80"></div>
        </div>
      );
      
    case 'before_after':
        return (
            <div className="flex gap-1 h-20">
                <div className={`w-1/2 h-full ${skeletonBox} flex items-center justify-center text-xs text-gray-400`}>Önce</div>
                <div className={`w-1/2 h-full ${skeletonBox} bg-green-50/50 flex items-center justify-center text-xs text-green-600 font-medium`}>Sonra</div>
            </div>
        );

    case 'blog':
      return (
        <div className="space-y-3 p-1">
           {[1, 2].map((i) => (
             <div key={i} className="flex gap-3">
               <div className={`w-12 h-12 ${skeletonBox} shrink-0`}></div>
               <div className="space-y-2 w-full">
                 <div className={`w-3/4 h-3 ${skeletonText}`}></div>
                 <div className={`w-1/2 h-2 ${skeletonText} opacity-60`}></div>
               </div>
             </div>
           ))}
        </div>
      );

    case 'service': 
       return (
         <div className="grid grid-cols-2 gap-2 p-1">
            {[1, 2, 3, 4].map(i => (
                <div key={i} className="p-2 border border-gray-100 rounded bg-gray-50/50 flex flex-col items-center gap-1">
                    <Briefcase className="w-4 h-4 text-gray-400" />
                    <div className={`w-10 h-2 ${skeletonText}`}></div>
                </div>
            ))}
         </div>
       );

    case 'social_media': 
        return (
            <div className="flex justify-center gap-4 p-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center"><Share2 className="w-5 h-5 text-blue-500"/></div>
                <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center"><Image className="w-5 h-5 text-pink-500"/></div>
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center"><Briefcase className="w-5 h-5 text-blue-700"/></div>
            </div>
        );

    case 'review': 
        return (
            <div className="flex gap-3 overflow-hidden p-2">
                {[1, 2].map(i => (
                    <div key={i} className="flex-1 min-w-[100px] p-3 border border-gray-100 rounded-lg bg-yellow-50/30">
                        <div className="flex gap-1 mb-2">
                            {[1,2,3,4,5].map(s => <div key={s} className="w-2 h-2 rounded-full bg-yellow-400"></div>)}
                        </div>
                        <div className={`w-full h-2 ${skeletonText} mb-1`}></div>
                        <div className={`w-2/3 h-2 ${skeletonText}`}></div>
                    </div>
                ))}
            </div>
        );

    // Diğer tüm tipler için varsayılan bir görünüm
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