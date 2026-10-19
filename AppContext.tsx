import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

import type { NavSection, MaterialCategory, MaterialRecord, TubularGroup } from '@/types';
import type { ScrewSize } from '@/data/screws';
import type { GDTItem } from '@/data/gdt';

export type StandardFilter = string;

interface AppState {
  activeSection: NavSection;
  setActiveSection: (section: NavSection) => void;

  activeCategory: MaterialCategory;
  setActiveCategory: (category: MaterialCategory) => void;

  activeStandard: StandardFilter;
  setActiveStandard: (standard: StandardFilter) => void;

  selectedForCompare: string[];
  toggleCompareSelection: (id: string) => void;
  clearCompareSelection: () => void;
  isCompareModalOpen: boolean;
  openCompareModal: () => void;
  closeCompareModal: () => void;

  detailMaterial: MaterialRecord | null;
  openDetail: (material: MaterialRecord) => void;
  closeDetail: () => void;

  similaresMaterial: MaterialRecord | null;
  openSimilares: (material: MaterialRecord) => void;
  closeSimilares: () => void;

  tubularGroupDetail: TubularGroup | null;
  openTubularGroup: (group: TubularGroup) => void;
  closeTubularGroup: () => void;

  sheetMetalDetail: MaterialRecord | null;
  openSheetMetalDetail: (material: MaterialRecord) => void;
  closeSheetMetalDetail: () => void;

  pipingDetail: MaterialRecord | null;
  openPipingDetail: (material: MaterialRecord) => void;
  closePipingDetail: () => void;

  structuralTubeDetail: MaterialRecord | null;
  openStructuralTubeDetail: (material: MaterialRecord) => void;
  closeStructuralTubeDetail: () => void;

  mechanicalTubeDetail: MaterialRecord | null;
  openMechanicalTubeDetail: (material: MaterialRecord) => void;
  closeMechanicalTubeDetail: () => void;

  beamChannelDetail: MaterialRecord | null;
  openBeamChannelDetail: (material: MaterialRecord) => void;
  closeBeamChannelDetail: () => void;

  wideFlangeDetail: MaterialRecord | null;
  openWideFlangeDetail: (material: MaterialRecord) => void;
  closeWideFlangeDetail: () => void;

  rebarDetail: MaterialRecord | null;
  openRebarDetail: (material: MaterialRecord) => void;
  closeRebarDetail: () => void;

  screwDetail: ScrewSize | null;
  openScrewDetail: (screw: ScrewSize) => void;
  closeScrewDetail: () => void;

  gdtDetail: GDTItem | null;
  openGdtDetail: (item: GDTItem) => void;
  closeGdtDetail: () => void;

  surfaceTreatmentDetail: MaterialRecord | null;
  openSurfaceTreatmentDetail: (material: MaterialRecord) => void;
  closeSurfaceTreatmentDetail: () => void;

}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [activeSection, setActiveSection] = useState<NavSection>('home');
  const [activeCategory, setActiveCategory] = useState<MaterialCategory>('steels');
  const [activeStandard, setActiveStandard] = useState<StandardFilter>('All');
  const [selectedForCompare, setSelectedForCompare] = useState<string[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [detailMaterial, setDetailMaterial] = useState<MaterialRecord | null>(null);
  const [similaresMaterial, setSimilaresMaterial] = useState<MaterialRecord | null>(null);
  const [tubularGroupDetail, setTubularGroupDetail] = useState<TubularGroup | null>(null);
  const [sheetMetalDetail, setSheetMetalDetail] = useState<MaterialRecord | null>(null);
  const [pipingDetail, setPipingDetail] = useState<MaterialRecord | null>(null);
  const [structuralTubeDetail, setStructuralTubeDetail] = useState<MaterialRecord | null>(null);
  const [mechanicalTubeDetail, setMechanicalTubeDetail] = useState<MaterialRecord | null>(null);
  const [beamChannelDetail, setBeamChannelDetail] = useState<MaterialRecord | null>(null);
  const [wideFlangeDetail, setWideFlangeDetail] = useState<MaterialRecord | null>(null);
  const [rebarDetail, setRebarDetail] = useState<MaterialRecord | null>(null);
  const [screwDetail, setScrewDetail] = useState<ScrewSize | null>(null);
  const [gdtDetail, setGdtDetail] = useState<GDTItem | null>(null);
  const [surfaceTreatmentDetail, setSurfaceTreatmentDetail] = useState<MaterialRecord | null>(null);

  const toggleCompareSelection = useCallback((id: string) => {
    setSelectedForCompare((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 3) return prev;
      return [...prev, id];
    });
  }, []);

  const clearCompareSelection = useCallback(() => setSelectedForCompare([]), []);
  const openCompareModal = useCallback(() => setIsCompareModalOpen(true), []);
  const closeCompareModal = useCallback(() => setIsCompareModalOpen(false), []);
  const openDetail = useCallback((material: MaterialRecord) => setDetailMaterial(material), []);
  const closeDetail = useCallback(() => setDetailMaterial(null), []);
  const openSimilares = useCallback((material: MaterialRecord) => setSimilaresMaterial(material), []);
  const closeSimilares = useCallback(() => setSimilaresMaterial(null), []);
  const openTubularGroup = useCallback((group: TubularGroup) => setTubularGroupDetail(group), []);
  const closeTubularGroup = useCallback(() => setTubularGroupDetail(null), []);
  const openSheetMetalDetail = useCallback((material: MaterialRecord) => setSheetMetalDetail(material), []);
  const closeSheetMetalDetail = useCallback(() => setSheetMetalDetail(null), []);
  const openPipingDetail = useCallback((material: MaterialRecord) => setPipingDetail(material), []);
  const closePipingDetail = useCallback(() => setPipingDetail(null), []);
  const openStructuralTubeDetail = useCallback((material: MaterialRecord) => setStructuralTubeDetail(material), []);
  const closeStructuralTubeDetail = useCallback(() => setStructuralTubeDetail(null), []);
  const openMechanicalTubeDetail = useCallback((material: MaterialRecord) => setMechanicalTubeDetail(material), []);
  const closeMechanicalTubeDetail = useCallback(() => setMechanicalTubeDetail(null), []);
  const openBeamChannelDetail = useCallback((material: MaterialRecord) => setBeamChannelDetail(material), []);
  const closeBeamChannelDetail = useCallback(() => setBeamChannelDetail(null), []);
  const openWideFlangeDetail = useCallback((material: MaterialRecord) => setWideFlangeDetail(material), []);
  const closeWideFlangeDetail = useCallback(() => setWideFlangeDetail(null), []);
  const openRebarDetail = useCallback((material: MaterialRecord) => setRebarDetail(material), []);
  const closeRebarDetail = useCallback(() => setRebarDetail(null), []);
  const openScrewDetail = useCallback((screw: ScrewSize) => setScrewDetail(screw), []);
  const closeScrewDetail = useCallback(() => setScrewDetail(null), []);
  const openGdtDetail = useCallback((item: GDTItem) => setGdtDetail(item), []);
  const closeGdtDetail = useCallback(() => setGdtDetail(null), []);
  const openSurfaceTreatmentDetail = useCallback((material: MaterialRecord) => setSurfaceTreatmentDetail(material), []);
  const closeSurfaceTreatmentDetail = useCallback(() => setSurfaceTreatmentDetail(null), []);
  return (
    <AppContext.Provider
      value={{
        activeSection,
        setActiveSection,
        activeCategory,
        setActiveCategory,
        activeStandard,
        setActiveStandard,
        selectedForCompare,
        toggleCompareSelection,
        clearCompareSelection,
        isCompareModalOpen,
        openCompareModal,
        closeCompareModal,
        detailMaterial,
        openDetail,
        closeDetail,
        similaresMaterial,
        openSimilares,
        closeSimilares,
        tubularGroupDetail,
        openTubularGroup,
        closeTubularGroup,
        sheetMetalDetail,
        openSheetMetalDetail,
        closeSheetMetalDetail,
        pipingDetail,
        openPipingDetail,
        closePipingDetail,
        structuralTubeDetail,
        openStructuralTubeDetail,
        closeStructuralTubeDetail,
        mechanicalTubeDetail,
        openMechanicalTubeDetail,
        closeMechanicalTubeDetail,
        beamChannelDetail,
        openBeamChannelDetail,
        closeBeamChannelDetail,
        wideFlangeDetail,
        openWideFlangeDetail,
        closeWideFlangeDetail,
        rebarDetail,
        openRebarDetail,
        closeRebarDetail,
        screwDetail,
        openScrewDetail,
        closeScrewDetail,
        gdtDetail,
        openGdtDetail,
        closeGdtDetail,
        surfaceTreatmentDetail,
        openSurfaceTreatmentDetail,
        closeSurfaceTreatmentDetail,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useApp(): AppState {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
