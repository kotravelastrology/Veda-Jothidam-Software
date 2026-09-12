import { createContext, useContext } from 'react';
import { UIState, UIActions } from '../ui/useUIManager';

export type MenuSection = 'file' | 'edit' | 'charts' | 'reports' | 'references' | 'options' | 'tools' | 'windows' | 'help' | 'home';
export type ChartType = 'rasi' | 'navamsha' | 'd3' | 'd4' | 'd5' | 'd7' | 'd9' | 'd10' | 'd12' | 'd16' | 'd20' | 'd24' | 'd27' | 'd30' | 'd40' | 'd45' | 'd60' | 'sudarshan' | 'lordships' | 'aspects' | 'ephemeris' | 'transit' | 'dasha' | 'rectification' | 'composite' | 'synastry';
export type ReportType = 'shadbala' | 'ashtakavarga' | 'dasha' | 'transit' | 'varshaphala' | 'compatibility' | 'yogas' | 'karakas' | 'calculations' | 'horoscope' | 'interpretations';

export interface NavigationContextType {
  currentMenu: MenuSection;
  setCurrentMenu: (menu: MenuSection) => void;
  currentChart: ChartType | null;
  setCurrentChart: (chart: ChartType | null) => void;
  currentReport: ReportType | null;
  setCurrentReport: (report: ReportType | null) => void;
  breadcrumb: string[];
  setBreadcrumb: (path: string[]) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  /** Shared Settings/Tools/Help/etc. panel state — TopMenuBar renders the panels, but
   *  any component (e.g. Sidebar) can trigger them via these so there's one modal instance. */
  uiState: UIState;
  uiActions: UIActions;
}

export const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within NavigationProvider');
  }
  return context;
}
