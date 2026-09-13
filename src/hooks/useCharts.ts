/**
 * useCharts Hook - React hook for chart management
 * Handles chart CRUD operations and phase data management
 */

import { useState, useCallback, useEffect } from 'react';
import apiService from '@/services/api';

export interface Chart {
  id: string;
  user_id: string;
  name: string;
  birth_date: string;
  birth_time: string;
  birth_place: string;
  latitude: number;
  longitude: number;
  timezone: string;
  created_at: string;
  updated_at: string;
  phase_count?: number;
}

export interface PhaseData {
  id: string;
  chart_id: string;
  phase_number: number;
  phase_name: string;
  data: any;
  created_at: string;
  updated_at: string;
}

interface UseChartsState {
  charts: Chart[];
  currentChart: Chart | null;
  phases: Record<number, PhaseData>;
  loading: boolean;
  error: string | null;
}

export function useCharts() {
  const [state, setState] = useState<UseChartsState>({
    charts: [],
    currentChart: null,
    phases: {},
    loading: false,
    error: null,
  });

  /**
   * Load all charts for current user
   */
  const loadCharts = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await apiService.listCharts();
      setState(prev => ({
        ...prev,
        charts: response.charts || [],
        loading: false,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to load charts',
        loading: false,
      }));
    }
  }, []);

  /**
   * Create new chart
   */
  const createChart = useCallback(async (chartData: any) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await apiService.createChart(chartData);
      const newChart = response.chart;
      setState(prev => ({
        ...prev,
        charts: [newChart, ...prev.charts],
        currentChart: newChart,
        phases: {},
        loading: false,
      }));
      return newChart;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to create chart',
        loading: false,
      }));
      throw error;
    }
  }, []);

  /**
   * Load specific chart with all phases
   */
  const loadChart = useCallback(async (chartId: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await apiService.getChart(chartId);
      const phases: Record<number, PhaseData> = {};

      if (response.phases) {
        response.phases.forEach((phase: PhaseData) => {
          phases[phase.phase_number] = phase;
        });
      }

      setState(prev => ({
        ...prev,
        currentChart: response.chart,
        phases,
        loading: false,
      }));
      return { chart: response.chart, phases };
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to load chart',
        loading: false,
      }));
      throw error;
    }
  }, []);

  /**
   * Save phase data
   */
  const savePhase = useCallback(
    async (phaseNumber: number, phaseName: string, data: any) => {
      if (!state.currentChart) {
        throw new Error('No chart selected');
      }

      setState(prev => ({ ...prev, loading: true, error: null }));
      try {
        const response = await apiService.savePhaseData(
          state.currentChart.id,
          phaseNumber,
          phaseName,
          data
        );

        setState(prev => ({
          ...prev,
          phases: {
            ...prev.phases,
            [phaseNumber]: response.phase_data,
          },
          loading: false,
        }));
        return response.phase_data;
      } catch (error) {
        setState(prev => ({
          ...prev,
          error: error instanceof Error ? error.message : 'Failed to save phase',
          loading: false,
        }));
        throw error;
      }
    },
    [state.currentChart]
  );

  /**
   * Get specific phase data
   */
  const getPhase = useCallback(
    (phaseNumber: number): PhaseData | undefined => {
      return state.phases[phaseNumber];
    },
    [state.phases]
  );

  /**
   * Check if phase exists
   */
  const hasPhase = useCallback(
    (phaseNumber: number): boolean => {
      return phaseNumber in state.phases;
    },
    [state.phases]
  );

  /**
   * Get all phases
   */
  const getAllPhases = useCallback((): PhaseData[] => {
    return Object.values(state.phases).sort(
      (a, b) => a.phase_number - b.phase_number
    );
  }, [state.phases]);

  /**
   * Update chart information
   */
  const updateChart = useCallback(
    async (updates: any) => {
      if (!state.currentChart) {
        throw new Error('No chart selected');
      }

      setState(prev => ({ ...prev, loading: true, error: null }));
      try {
        const response = await apiService.updateChart(
          state.currentChart.id,
          updates
        );

        const updatedChart = response.chart;
        setState(prev => ({
          ...prev,
          currentChart: updatedChart,
          charts: prev.charts.map(c => c.id === updatedChart.id ? updatedChart : c),
          loading: false,
        }));
        return updatedChart;
      } catch (error) {
        setState(prev => ({
          ...prev,
          error: error instanceof Error ? error.message : 'Failed to update chart',
          loading: false,
        }));
        throw error;
      }
    },
    [state.currentChart]
  );

  /**
   * Delete chart
   */
  const deleteChart = useCallback(
    async (chartId?: string) => {
      const idToDelete = chartId || state.currentChart?.id;
      if (!idToDelete) {
        throw new Error('No chart selected');
      }

      setState(prev => ({ ...prev, loading: true, error: null }));
      try {
        await apiService.deleteChart(idToDelete);

        setState(prev => ({
          ...prev,
          charts: prev.charts.filter(c => c.id !== idToDelete),
          currentChart: prev.currentChart?.id === idToDelete ? null : prev.currentChart,
          phases: prev.currentChart?.id === idToDelete ? {} : prev.phases,
          loading: false,
        }));
      } catch (error) {
        setState(prev => ({
          ...prev,
          error: error instanceof Error ? error.message : 'Failed to delete chart',
          loading: false,
        }));
        throw error;
      }
    },
    [state.currentChart]
  );

  /**
   * Search charts
   */
  const searchCharts = useCallback(async (query: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await apiService.searchCharts(query);
      setState(prev => ({
        ...prev,
        charts: response.results || [],
        loading: false,
      }));
      return response.results || [];
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Search failed',
        loading: false,
      }));
      throw error;
    }
  }, []);

  /**
   * Clear current chart
   */
  const clearCurrentChart = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentChart: null,
      phases: {},
    }));
  }, []);

  /**
   * Clear error
   */
  const clearError = useCallback(() => {
    setState(prev => ({
      ...prev,
      error: null,
    }));
  }, []);

  return {
    // State
    charts: state.charts,
    currentChart: state.currentChart,
    phases: state.phases,
    loading: state.loading,
    error: state.error,

    // Methods
    loadCharts,
    createChart,
    loadChart,
    savePhase,
    getPhase,
    hasPhase,
    getAllPhases,
    updateChart,
    deleteChart,
    searchCharts,
    clearCurrentChart,
    clearError,
  };
}
