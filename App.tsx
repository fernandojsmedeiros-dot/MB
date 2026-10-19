import { AppProvider, useApp } from '@/context/AppContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { CatalogPage } from '@/pages/CatalogPage';
import { CompareBar } from '@/components/materials/CompareBar';
import { DetailSlideOver } from '@/components/materials/DetailSlideOver';
import { CompareModal } from '@/components/materials/CompareModal';
import { SimilaresModal } from '@/components/materials/SimilaresModal';
import { TubularGroupDetail } from '@/components/materials/TubularGroupDetail';
import { SheetMetalDetail } from '@/components/materials/SheetMetalDetail';
import { IndustrialPipingDetail } from '@/components/materials/IndustrialPipingDetail';
import { StructuralTubeDetail } from '@/components/materials/StructuralTubeDetail';
import { MechanicalTubeDetail } from '@/components/materials/MechanicalTubeDetail';
import { BeamChannelDetail } from '@/components/materials/BeamChannelDetail';
import { WideFlangeDetail } from '@/components/materials/WideFlangeDetail';
import { RebarDetail } from '@/components/materials/RebarDetail';
import { ScrewDetail } from '@/components/materials/ScrewDetail';
import { GDTDetail } from '@/components/materials/GDTDetail';
import { SurfaceTreatmentDetail } from '@/components/materials/SurfaceTreatmentDetail';
import { GDTGuidePage } from '@/pages/GDTGuidePage';
import { HomeDashboard } from '@/pages/HomeDashboard';

function AppContent() {
  const { activeSection } = useApp();

  return (
    <DashboardLayout>
      {activeSection === 'home' && <HomeDashboard />}
      {activeSection === 'materials' && <CatalogPage module="materials" />}
      {activeSection === 'mechanical-standards' && <CatalogPage module="mechanical-standards" />}
      {activeSection === 'standardized' && <CatalogPage module="standardized" />}
      {activeSection === 'fasteners' && <CatalogPage module="fasteners" />}
      {activeSection === 'surface-treatment' && <CatalogPage module="surface-treatment" />}
      {activeSection === 'gdt-guide' && <GDTGuidePage />}

      <CompareBar />
      <DetailSlideOver />
      <CompareModal />
      <SimilaresModal />
      <TubularGroupDetail />
      <SheetMetalDetail />
      <IndustrialPipingDetail />
      <StructuralTubeDetail />
      <MechanicalTubeDetail />
      <BeamChannelDetail />
      <WideFlangeDetail />
      <RebarDetail />
      <ScrewDetail />
      <GDTDetail />
      <SurfaceTreatmentDetail />
    </DashboardLayout>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
