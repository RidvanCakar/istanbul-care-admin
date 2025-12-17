// src/app/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Router eklendi
import { 
  DndContext, 
  DragEndEvent, 
  useDroppable, 
  DragOverlay, 
  DragStartEvent,
  useSensor,
  useSensors,
  PointerSensor,
  closestCenter
} from "@dnd-kit/core";
import { 
  SortableContext, 
  verticalListSortingStrategy, 
  arrayMove 
} from "@dnd-kit/sortable";
import { v4 as uuidv4 } from 'uuid';
import { Settings, Globe, Save, Loader2, LogOut } from 'lucide-react'; // LogOut eklendi

// Bileşenlerimiz
import BuilderSidebar from "@/components/builder/BuilderSidebar";
import SortableCanvasItem from "@/components/builder/SortableCanvasItem";
import FixedZone from "@/components/builder/FixedZone";
import PageSettingsModal from "@/components/builder/PageSettingsModal";

// Tipler ve Veriler
import { BuilderStateItem, ComponentType, PageData, Language } from "@/types";
import { TOOLS } from "@/data/tools";
import { fetcher, getEndpointByType, createEntry } from "@/services/api"; 
import { transformToBackendFormat } from "@/utils/dataTransformer";

// ----------------------------------------------------------------
// 1. KANVAS BİLEŞENİ (Değişiklik Yok)
// ----------------------------------------------------------------
interface BuilderCanvasProps {
  items: BuilderStateItem[];
  onRemove: (id: string) => void;
  onUpdate: (id: string, updates: Partial<BuilderStateItem>) => void;
  headerId: number;
  setHeaderId: (id: number) => void;
  footerId: number;
  setFooterId: (id: number) => void;
}

function BuilderCanvas({ 
  items, onRemove, onUpdate, headerId, setHeaderId, footerId, setFooterId 
}: BuilderCanvasProps) {
  
  const { setNodeRef, isOver } = useDroppable({ id: "canvas-droppable" });

  return (
    <div
      ref={setNodeRef}
      className={`flex-1 overflow-y-auto p-8 transition-colors relative ${isOver ? "bg-blue-50/30" : "bg-[#F9FAFB]"}`}
    >
      <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.4]"
           style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '24px 24px' }}
      />

      <div className="max-w-4xl mx-auto min-h-[600px] flex flex-col gap-6 pb-20 relative z-10">
        <FixedZone type="Header" selectedId={headerId} onChange={setHeaderId} />
        <div className="flex-1 space-y-4 min-h-[200px]">
          {items.length === 0 ? (
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-16 flex flex-col items-center justify-center text-gray-400 bg-white/50 backdrop-blur-sm hover:border-blue-400 hover:text-blue-500 transition-all cursor-default">
               <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" /></svg>
               </div>
               <p className="text-lg font-medium">Sahne Boş</p>
               <p className="text-sm opacity-60 mt-1">Soldan bir bileşen sürükleyip buraya bırakın</p>
            </div>
          ) : (
            <SortableContext items={items.map(item => item.id)} strategy={verticalListSortingStrategy}>
                {items.map((item) => (<SortableCanvasItem key={item.id} item={item} onRemove={onRemove} onUpdate={onUpdate}/>))}
            </SortableContext>
          )}
        </div>
        <FixedZone type="Footer" selectedId={footerId} onChange={setFooterId} />
      </div>
    </div>
  );
}

// ----------------------------------------------------------------
// 2. ANA SAYFA (GÜNCELLENDİ)
// ----------------------------------------------------------------
export default function PageBuilder() {
  const router = useRouter();
  const [isAuthChecking, setIsAuthChecking] = useState(true); // Yükleme durumu

  // --- KORUMA KALKANI (AUTH CHECK) ---
  useEffect(() => {
    // Tarayıcı tarafında çalışıyorsak
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        // Token yok, Login'e at
        router.push("/login");
      } else {
        // Token var, yüklemeyi bitir
        setIsAuthChecking(false);
      }
    }
  }, [router]);

  // --- STATE ---
  const [items, setItems] = useState<BuilderStateItem[]>([]);
  const [headerId, setHeaderId] = useState<number>(0);
  const [footerId, setFooterId] = useState<number>(0);
  
  const [languages, setLanguages] = useState<Language[]>([]);
  const [selectedLanguageId, setSelectedLanguageId] = useState<number>(1);
  const [isSaving, setIsSaving] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  const [pageSettings, setPageSettings] = useState<Partial<PageData>>({
    title: "", slug: "", meta_title: "", meta_description: "", robots_index: true, robots_follow: true, focus_keyword: ""
  });

  const [activeDragId, setActiveDragId] = useState<string | null>(null);
  const [activeDragItem, setActiveDragItem] = useState<BuilderStateItem | null>(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  // --- ÇIKIŞ YAPMA (LOGOUT) ---
  const handleLogout = () => {
    if (confirm("Çıkış yapmak istediğinize emin misiniz?")) {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user_info");
      router.push("/login");
    }
  };

  // --- VERİ ÇEKME (Sadece Auth Başarılıysa) ---
  useEffect(() => {
    if (isAuthChecking) return; // Auth kontrolü bitmeden istek atma

    const loadLanguages = async () => {
      try {
        const endpoint = getEndpointByType('languages');
        if (endpoint) {
          const response = await fetcher(endpoint);
          let langList: Language[] = [];

          if (response.data && Array.isArray(response.data.languages)) {
            langList = response.data.languages;
          }
          else if (Array.isArray(response)) {
            langList = response;
          } 
          else if (response.data && Array.isArray(response.data)) {
            langList = response.data;
          }

          setLanguages(langList);
          if (langList.length > 0) {
             const defaultLang = langList.find(l => l.code === 'tr') || langList[0];
             setSelectedLanguageId(defaultLang.id);
          }
        }
      } catch (error) {
        console.error("Diller yüklenirken hata:", error);
      }
    };
    loadLanguages();
  }, [isAuthChecking]);

  // --- AKSİYONLAR ---
  const addNewItem = (type: ComponentType) => {
    setItems((prev) => [...prev, { id: uuidv4(), type: type, grid_columns: 12, order: items.length + 1 }]);
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter(item => item.id !== id));
  };

  const updateItem = (id: string, updates: Partial<BuilderStateItem>) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...updates } : item)));
  };

  const updatePageSettings = (updates: Partial<PageData>) => {
    setPageSettings((prev) => ({ ...prev, ...updates }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const formattedData = transformToBackendFormat(
        items, pageSettings as PageData, headerId, footerId, selectedLanguageId
      );
      await createEntry('pages', formattedData);
      
      alert(`Sayfa Başarıyla Kaydedildi! (ID: ${selectedLanguageId})`);

      const jsonString = JSON.stringify(formattedData, null, 2);
      const blob = new Blob([jsonString], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      const fileName = pageSettings.slug ? `${pageSettings.slug}.json` : `sayfa-${selectedLanguageId}.json`;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error: any) {
      alert("Hata oluştu: " + error.message);
    } finally {
      setIsSaving(false); 
    }
  };

  // Drag handlers
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveDragId(active.id as string);
    if (!active.data.current?.fromSidebar) {
      const foundItem = items.find(i => i.id === active.id);
      if (foundItem) setActiveDragItem(foundItem);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveDragId(null);
    setActiveDragItem(null);
    if (!over) return;
    if (active.data.current?.fromSidebar && over.id === "canvas-droppable") {
      addNewItem(active.data.current.type as ComponentType);
      return;
    }
    if (active.id !== over.id && !active.data.current?.fromSidebar) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const sidebarToolInfo = activeDragId && activeDragId.startsWith('tool-') ? TOOLS.find(t => `tool-${t.id}` === activeDragId) : null;

  // --- YÜKLENİYOR EKRANI (AUTH CHECK SIRASINDA) ---
  if (isAuthChecking) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
          <p className="text-gray-500 font-medium">Yetkiler kontrol ediliyor...</p>
        </div>
      </div>
    );
  }

  return (
    <DndContext id="builder-dnd-context" sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <main className="flex h-screen w-full bg-gray-50 overflow-hidden">
        <BuilderSidebar onAddItem={addNewItem} />

        <div className="flex-1 flex flex-col h-full overflow-hidden">
          
          <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 z-20 shadow-sm shrink-0">
            <div className="flex items-center gap-4">
               <h1 className="text-lg font-bold text-gray-800">Sayfa Düzenleyici</h1>
               <button onClick={() => setIsSettingsOpen(true)} className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors">
                 <Settings className="w-4 h-4" /> Sayfa Ayarları
               </button>
            </div>
            
            <div className="flex gap-3 items-center">
                <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-md px-3 py-1.5">
                  <Globe className="w-4 h-4 text-gray-500" />
                  <select value={selectedLanguageId} onChange={(e) => setSelectedLanguageId(Number(e.target.value))} className="bg-transparent text-sm text-gray-700 outline-none cursor-pointer min-w-[100px]">
                    {languages.length === 0 && <option value={1}>TR (Varsayılan)</option>}
                    {languages.map((lang) => (<option key={lang.id} value={lang.id}>{lang.name} ({lang.code?.toUpperCase()})</option>))}
                  </select>
                </div>
                
                <span className="text-sm text-gray-500 mr-2 ml-2 bg-gray-100 px-2 py-1 rounded">{items.length} bileşen</span>
                
                <button onClick={handleSave} disabled={isSaving} className={`flex items-center gap-2 px-4 py-2 text-white text-sm font-medium rounded-md transition-colors shadow-sm ${isSaving ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}>
                  {isSaving ? <><Loader2 className="w-4 h-4 animate-spin" /> Kaydediliyor...</> : <><Save className="w-4 h-4" /> Kaydet</>}
                </button>

                {/* --- YENİ ÇIKIŞ BUTONU --- */}
                <button 
                  onClick={handleLogout}
                  className="ml-2 p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                  title="Çıkış Yap"
                >
                  <LogOut className="w-5 h-5" />
                </button>
            </div>
          </header>

          <BuilderCanvas items={items} onRemove={removeItem} onUpdate={updateItem} headerId={headerId} setHeaderId={setHeaderId} footerId={footerId} setFooterId={setFooterId} />
        </div>
      </main>

      <DragOverlay>
        {sidebarToolInfo ? (<div className="flex items-center gap-3 p-3 bg-white border-2 border-blue-500 shadow-xl rounded-lg w-64 opacity-90 cursor-grabbing z-50"><sidebarToolInfo.icon className="w-5 h-5 text-blue-500" /><span className="font-bold text-gray-800">{sidebarToolInfo.label}</span></div>) : null}
        {activeDragItem ? (<div className="bg-white border-2 border-blue-500 shadow-2xl rounded-lg p-4 w-[800px] opacity-90 cursor-grabbing flex items-center gap-4 z-50"><div className="p-1 text-blue-500"><div className="w-5 h-5 bg-blue-100 rounded"></div></div><span className="font-bold text-gray-800 uppercase text-lg">{activeDragItem.type}</span></div>) : null}
      </DragOverlay>

      <PageSettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} settings={pageSettings} onUpdate={updatePageSettings} />
    </DndContext>
  );
}