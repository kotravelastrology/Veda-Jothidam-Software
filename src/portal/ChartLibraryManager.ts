// Chart Library Manager
// Manages user's saved charts, favorites, and collections

export interface SavedChart {
  id: string;
  userId: string;
  name: string;
  description?: string;
  birthData: {
    name: string;
    dateOfBirth: string;
    timeOfBirth: string;
    place: string;
    latitude: number;
    longitude: number;
    utcOffset: number;
  };
  chartTypes: string[]; // 'rasi', 'navamsha', 'divisional', etc.
  tags: string[];
  isFavorite: boolean;
  isShared: boolean;
  createdAt: number;
  updatedAt: number;
  size: number; // bytes
  notes?: string;
}

export interface ChartCollection {
  id: string;
  userId: string;
  name: string;
  description?: string;
  chartIds: string[];
  isPublic: boolean;
  createdAt: number;
  updatedAt: number;
}

/**
 * Chart Library Manager
 * Manages user's chart collection, organization, and sharing
 */
export class ChartLibraryManager {
  private charts: Map<string, SavedChart> = new Map();
  private collections: Map<string, ChartCollection> = new Map();
  private storageKey = 'kotravel_charts';
  private collectionsKey = 'kotravel_chart_collections';
  private maxCharts = 1000;
  private maxStorageMB = 500;

  constructor() {
    this.loadCharts();
    this.loadCollections();
  }

  /**
   * Save new chart
   */
  saveChart(data: Omit<SavedChart, 'id' | 'createdAt' | 'updatedAt' | 'size'>): SavedChart {
    const chart: SavedChart = {
      ...data,
      id: `chart_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      size: this.estimateSize(data),
    };

    if (this.charts.size >= this.maxCharts) {
      throw new Error(`Chart limit reached (${this.maxCharts})`);
    }

    if (this.getTotalStorageUsed() + chart.size > this.maxStorageMB * 1024 * 1024) {
      throw new Error('Storage limit exceeded');
    }

    this.charts.set(chart.id, chart);
    this.persistCharts();
    return chart;
  }

  /**
   * Get chart by ID
   */
  getChart(id: string): SavedChart | null {
    return this.charts.get(id) || null;
  }

  /**
   * Get all charts
   */
  getAllCharts(): SavedChart[] {
    return Array.from(this.charts.values()).sort((a, b) => b.updatedAt - a.updatedAt);
  }

  /**
   * Search charts
   */
  searchCharts(query: string): SavedChart[] {
    const lowerQuery = query.toLowerCase();
    return this.getAllCharts().filter(chart =>
      chart.name.toLowerCase().includes(lowerQuery) ||
      chart.description?.toLowerCase().includes(lowerQuery) ||
      chart.birthData.name.toLowerCase().includes(lowerQuery) ||
      chart.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }

  /**
   * Get favorite charts
   */
  getFavoriteCharts(): SavedChart[] {
    return this.getAllCharts().filter(c => c.isFavorite);
  }

  /**
   * Toggle favorite
   */
  toggleFavorite(id: string): boolean {
    const chart = this.charts.get(id);
    if (chart) {
      chart.isFavorite = !chart.isFavorite;
      chart.updatedAt = Date.now();
      this.persistCharts();
      return chart.isFavorite;
    }
    return false;
  }

  /**
   * Update chart
   */
  updateChart(id: string, updates: Partial<SavedChart>): SavedChart | null {
    const chart = this.charts.get(id);
    if (!chart) return null;

    Object.assign(chart, updates);
    chart.updatedAt = Date.now();
    chart.size = this.estimateSize(chart);
    this.persistCharts();
    return chart;
  }

  /**
   * Delete chart
   */
  deleteChart(id: string): boolean {
    const deleted = this.charts.delete(id);
    if (deleted) {
      this.persistCharts();
      // Remove from collections
      this.collections.forEach(collection => {
        const index = collection.chartIds.indexOf(id);
        if (index > -1) {
          collection.chartIds.splice(index, 1);
        }
      });
      this.persistCollections();
    }
    return deleted;
  }

  /**
   * Delete multiple charts
   */
  deleteMultiple(ids: string[]): number {
    let deleted = 0;
    ids.forEach(id => {
      if (this.deleteChart(id)) {
        deleted++;
      }
    });
    return deleted;
  }

  /**
   * Add tags to chart
   */
  addTags(id: string, tags: string[]): string[] {
    const chart = this.charts.get(id);
    if (chart) {
      chart.tags = [...new Set([...chart.tags, ...tags])];
      chart.updatedAt = Date.now();
      this.persistCharts();
      return chart.tags;
    }
    return [];
  }

  /**
   * Remove tags from chart
   */
  removeTags(id: string, tags: string[]): string[] {
    const chart = this.charts.get(id);
    if (chart) {
      chart.tags = chart.tags.filter(t => !tags.includes(t));
      chart.updatedAt = Date.now();
      this.persistCharts();
      return chart.tags;
    }
    return [];
  }

  /**
   * Get charts by tag
   */
  getChartsByTag(tag: string): SavedChart[] {
    return this.getAllCharts().filter(c => c.tags.includes(tag));
  }

  /**
   * Get all tags
   */
  getAllTags(): Array<{ tag: string; count: number }> {
    const tagMap: Record<string, number> = {};
    this.charts.forEach(chart => {
      chart.tags.forEach(tag => {
        tagMap[tag] = (tagMap[tag] || 0) + 1;
      });
    });

    return Object.entries(tagMap)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count);
  }

  /**
   * Create collection
   */
  createCollection(data: Omit<ChartCollection, 'id' | 'createdAt' | 'updatedAt'>): ChartCollection {
    const collection: ChartCollection = {
      ...data,
      id: `collection_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    this.collections.set(collection.id, collection);
    this.persistCollections();
    return collection;
  }

  /**
   * Get collection
   */
  getCollection(id: string): ChartCollection | null {
    return this.collections.get(id) || null;
  }

  /**
   * Get all collections
   */
  getAllCollections(): ChartCollection[] {
    return Array.from(this.collections.values()).sort((a, b) => b.updatedAt - a.updatedAt);
  }

  /**
   * Add chart to collection
   */
  addToCollection(collectionId: string, chartId: string): boolean {
    const collection = this.collections.get(collectionId);
    if (collection && this.charts.has(chartId)) {
      if (!collection.chartIds.includes(chartId)) {
        collection.chartIds.push(chartId);
        collection.updatedAt = Date.now();
        this.persistCollections();
      }
      return true;
    }
    return false;
  }

  /**
   * Remove chart from collection
   */
  removeFromCollection(collectionId: string, chartId: string): boolean {
    const collection = this.collections.get(collectionId);
    if (collection) {
      const index = collection.chartIds.indexOf(chartId);
      if (index > -1) {
        collection.chartIds.splice(index, 1);
        collection.updatedAt = Date.now();
        this.persistCollections();
        return true;
      }
    }
    return false;
  }

  /**
   * Delete collection
   */
  deleteCollection(id: string): boolean {
    return this.collections.delete(id);
  }

  /**
   * Get storage statistics
   */
  getStorageStats(): {
    totalCharts: number;
    totalSize: number;
    averageChartSize: number;
    storageUsedPercent: number;
  } {
    const totalCharts = this.charts.size;
    const totalSize = this.getTotalStorageUsed();
    const averageChartSize = totalCharts > 0 ? totalSize / totalCharts : 0;
    const maxStorage = this.maxStorageMB * 1024 * 1024;
    const storageUsedPercent = (totalSize / maxStorage) * 100;

    return {
      totalCharts,
      totalSize,
      averageChartSize,
      storageUsedPercent,
    };
  }

  /**
   * Get charts by birth name
   */
  getChartsByBirthName(name: string): SavedChart[] {
    const lowerName = name.toLowerCase();
    return this.getAllCharts().filter(c =>
      c.birthData.name.toLowerCase().includes(lowerName)
    );
  }

  /**
   * Export chart as JSON
   */
  exportChart(id: string): string | null {
    const chart = this.charts.get(id);
    if (!chart) return null;

    return JSON.stringify(chart, null, 2);
  }

  /**
   * Export multiple charts
   */
  exportMultiple(ids: string[]): string {
    const charts = ids.map(id => this.charts.get(id)).filter(Boolean);
    return JSON.stringify({
      charts,
      exportedAt: new Date().toISOString(),
      count: charts.length,
    }, null, 2);
  }

  /**
   * Import charts from JSON
   */
  importCharts(jsonData: string): number {
    try {
      const data = JSON.parse(jsonData);
      let imported = 0;

      if (Array.isArray(data.charts)) {
        data.charts.forEach((chartData: any) => {
          try {
            const chart: SavedChart = {
              ...chartData,
              id: `chart_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              createdAt: Date.now(),
              updatedAt: Date.now(),
            };
            if (this.charts.size < this.maxCharts) {
              this.charts.set(chart.id, chart);
              imported++;
            }
          } catch (e) {
            console.warn('Failed to import chart:', e);
          }
        });
        this.persistCharts();
      }
      return imported;
    } catch (error) {
      console.error('Import error:', error);
      return 0;
    }
  }

  // ==================== PRIVATE METHODS ====================

  private estimateSize(chart: any): number {
    return JSON.stringify(chart).length;
  }

  private getTotalStorageUsed(): number {
    return Array.from(this.charts.values()).reduce((sum, chart) => sum + chart.size, 0);
  }

  private persistCharts(): void {
    try {
      const chartsArray = Array.from(this.charts.values());
      localStorage.setItem(this.storageKey, JSON.stringify(chartsArray));
    } catch (error) {
      console.error('Failed to save charts:', error);
    }
  }

  private loadCharts(): void {
    try {
      const data = localStorage.getItem(this.storageKey);
      if (data) {
        const charts = JSON.parse(data) as SavedChart[];
        charts.forEach(chart => {
          this.charts.set(chart.id, chart);
        });
      }
    } catch (error) {
      console.error('Failed to load charts:', error);
    }
  }

  private persistCollections(): void {
    try {
      const collectionsArray = Array.from(this.collections.values());
      localStorage.setItem(this.collectionsKey, JSON.stringify(collectionsArray));
    } catch (error) {
      console.error('Failed to save collections:', error);
    }
  }

  private loadCollections(): void {
    try {
      const data = localStorage.getItem(this.collectionsKey);
      if (data) {
        const collections = JSON.parse(data) as ChartCollection[];
        collections.forEach(collection => {
          this.collections.set(collection.id, collection);
        });
      }
    } catch (error) {
      console.error('Failed to load collections:', error);
    }
  }
}

// Global chart library instance
let chartLibrary: ChartLibraryManager | null = null;

export function initializeChartLibrary(): ChartLibraryManager {
  if (!chartLibrary) {
    chartLibrary = new ChartLibraryManager();
  }
  return chartLibrary;
}

export function getChartLibrary(): ChartLibraryManager {
  if (!chartLibrary) {
    chartLibrary = new ChartLibraryManager();
  }
  return chartLibrary;
}
