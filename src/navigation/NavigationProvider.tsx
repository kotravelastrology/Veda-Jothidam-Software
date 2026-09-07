'use client';

import { ReactNode, useState } from 'react';
import { NavigationContext, MenuSection, ChartType, ReportType } from './navigationContext';

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [currentMenu, setCurrentMenu] = useState<MenuSection>('home');
  const [currentChart, setCurrentChart] = useState<ChartType | null>(null);
  const [currentReport, setCurrentReport] = useState<ReportType | null>(null);
  const [breadcrumb, setBreadcrumb] = useState<string[]>(['Home']);
  const [sidebarOpen, setSidebarOpen] = useState(true);

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
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
}
