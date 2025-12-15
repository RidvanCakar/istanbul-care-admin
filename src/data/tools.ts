// src/data/tools.ts
import { ComponentType } from "@/types";
import { 
  Layout, 
  CreditCard, 
  Settings2, 
  Images, 
  Mail, 
  FileText, 
  Briefcase, 
  Share2, 
  Star,
  // Yeni eklenen ikonlar
  Layers,          // Slider
  ArrowRightLeft,  // Price Compare
  Megaphone        // Promotional Landing
} from "lucide-react";

export const TOOLS: { id: ComponentType; label: string; icon: any }[] = [
  // --- Ana Yapı ---
  { id: 'hero', label: 'Heroes', icon: Layout },
  { id: 'card', label: 'Cards', icon: CreditCard },
  { id: 'promotional_landing', label: 'Promo Landing', icon: Megaphone }, 

  // --- İçerik ---
  { id: 'before_after', label: 'Before/After', icon: Images },
  { id: 'process', label: 'Süreç (Process)', icon: Settings2 },

  // --- İletişim & Config ---
  { id: 'contact_form', label: 'İletişim Formu', icon: Mail },
  { id: 'blog', label: 'Blogs', icon: FileText },
  { id: 'service', label: 'Services', icon: Briefcase },
  { id: 'social_media', label: 'Social Media', icon: Share2 },
  { id: 'review', label: 'Review', icon: Star },
];