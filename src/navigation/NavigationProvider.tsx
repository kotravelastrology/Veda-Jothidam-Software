'use client';

import { ReactNode, useState } from 'react';
import { NavigationContext, MenuSection, ChartType, ReportType } from './navigationContext';
import { useUIManager } from '../ui/useUIManager';
import { useWorkspace } from '../workspace/workspaceContext';

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [currentMenu, setCurrentMenu] = useState<MenuSection>('home');
  const [currentChart, setCurrentChart] = useState<ChartType | null>(null);
  const [currentReport, setCurrentReport] = useState<ReportType | null>(null);
  const [breadcrumb, setBreadcrumb] = useState<string[]>(['Home']);
  // Sidebar visibility is a saved layout choice (VJ-015), so it is owned by
  // the workspace and persisted rather than reset on every reload.
  const { layout, updateLayout } = useWorkspace();
  const sidebarOpen = layout.sidebarOpen;
  const setSidebarOpen = (open: boolean) => updateLayout({ sidebarOpen: open });
  const [uiState, uiActions] = useUIManager();

  return (
    <NavigationContext.Provider
      value={{
        currentMenu,
        setCurrentMenu,
        currentChart,
        setCurrentChart,
        currentReport,
        setCurrentReport,
        breadcrumb,
        setBreadcrumb,
        sidebarOpen,
        setSidebarOpen,
        uiState,
        uiActions,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
}
