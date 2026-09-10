'use client';

import { useState, useCallback } from 'react';

export interface UIState {
  settingsOpen: boolean;
  toolsOpen: boolean;
  helpOpen: boolean;
  helpTab: 'help' | 'about' | 'shortcuts';
  chartDialogOpen: boolean;
  chartDialogMode: 'all' | 'recent';
  annotationDialog: 'none' | 'notes' | 'events';
  sideByView: boolean;
  windowLayout: 'single' | 'sidebyside' | 'cascade' | 'tile';
  chartHistory: string[];
  currentChart: string | null;
  comparisonChart: string | null;
}

export interface UIActions {
  openSettings: () => void;
  closeSettings: () => void;
  toggleSettings: () => void;
  openTools: () => void;
  closeTools: () => void;
  toggleTools: () => void;
  openHelp: (tab?: 'help' | 'about' | 'shortcuts') => void;
  closeHelp: () => void;
  toggleHelp: () => void;
  openChartDialog: (mode?: 'all' | 'recent') => void;
  closeChartDialog: () => void;
  openAnnotations: (kind: 'notes' | 'events') => void;
  closeAnnotations: () => void;
  setSideByView: (enabled: boolean) => void;
  setWindowLayout: (layout: 'single' | 'sidebyside' | 'cascade' | 'tile') => void;
  addToChartHistory: (chartId: string) => void;
  clearChartHistory: () => void;
  setCurrentChart: (chartId: string | null) => void;
  setComparisonChart: (chartId: string | null) => void;
  closeAllPanels: () => void;
}

const DEFAULT_UI_STATE: UIState = {
  settingsOpen: false,
  toolsOpen: false,
  helpOpen: false,
  helpTab: 'help',
  chartDialogOpen: false,
  chartDialogMode: 'all',
  annotationDialog: 'none',
  sideByView: false,
  windowLayout: 'single',
  chartHistory: [],
  currentChart: null,
  comparisonChart: null,
};

export function useUIManager(): [UIState, UIActions] {
  const [uiState, setUIState] = useState<UIState>(DEFAULT_UI_STATE);

  const actions: UIActions = {
    openSettings: useCallback(() => {
      setUIState((prev) => ({ ...prev, settingsOpen: true }));
    }, []),

    closeSettings: useCallback(() => {
      setUIState((prev) => ({ ...prev, settingsOpen: false }));
    }, []),

    toggleSettings: useCallback(() => {
      setUIState((prev) => ({ ...prev, settingsOpen: !prev.settingsOpen }));
    }, []),

    openTools: useCallback(() => {
      setUIState((prev) => ({ ...prev, toolsOpen: true }));
    }, []),

    closeTools: useCallback(() => {
      setUIState((prev) => ({ ...prev, toolsOpen: false }));
    }, []),

    toggleTools: useCallback(() => {
      setUIState((prev) => ({ ...prev, toolsOpen: !prev.toolsOpen }));
    }, []),

    openHelp: useCallback((tab = 'help') => {
      setUIState((prev) => ({ ...prev, helpOpen: true, helpTab: tab }));
    }, []),

    closeHelp: useCallback(() => {
      setUIState((prev) => ({ ...prev, helpOpen: false }));
    }, []),

    toggleHelp: useCallback(() => {
      setUIState((prev) => ({ ...prev, helpOpen: !prev.helpOpen }));
    }, []),

    openChartDialog: useCallback((mode: 'all' | 'recent' = 'all') => {
      setUIState((prev) => ({ ...prev, chartDialogOpen: true, chartDialogMode: mode }));
    }, []),

    closeChartDialog: useCallback(() => {
      setUIState((prev) => ({ ...prev, chartDialogOpen: false }));
    }, []),

    openAnnotations: useCallback((kind: 'notes' | 'events') => {
      setUIState((prev) => ({ ...prev, annotationDialog: kind }));
    }, []),

    closeAnnotations: useCallback(() => {
      setUIState((prev) => ({ ...prev, annotationDialog: 'none' }));
    }, []),

    setSideByView: useCallback((enabled: boolean) => {
      setUIState((prev) => ({
        ...prev,
        sideByView: enabled,
        windowLayout: enabled ? 'sidebyside' : 'single',
      }));
    }, []),

    setWindowLayout: useCallback((layout) => {
      setUIState((prev) => ({
        ...prev,
        windowLayout: layout,
        sideByView: layout === 'sidebyside',
      }));
    }, []),

    addToChartHistory: useCallback((chartId: string) => {
      setUIState((prev) => {
        const history = [chartId, ...prev.chartHistory.filter((id) => id !== chartId)].slice(0, 10);
        return { ...prev, chartHistory: history };
      });
    }, []),

    clearChartHistory: useCallback(() => {
      setUIState((prev) => ({ ...prev, chartHistory: [] }));
    }, []),

    setCurrentChart: useCallback((chartId: string | null) => {
      setUIState((prev) => ({ ...prev, currentChart: chartId }));
    }, []),

    setComparisonChart: useCallback((chartId: string | null) => {
      setUIState((prev) => ({ ...prev, comparisonChart: chartId }));
    }, []),

    closeAllPanels: useCallback(() => {
      setUIState((prev) => ({
        ...prev,
        settingsOpen: false,
        toolsOpen: false,
        helpOpen: false,
        chartDialogOpen: false,
        annotationDialog: 'none',
      }));
    }, []),
  };

  return [uiState, actions];
}
