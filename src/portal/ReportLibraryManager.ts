// Report Library Manager
// Manages user's saved reports, templates, and generation history

export interface SavedReport {
  id: string;
  userId: string;
  chartId: string;
  title: string;
  description?: string;
  reportType: 'birth-chart' | 'dasha' | 'transit' | 'muhurta' | 'compatibility' | 'custom';
  format: 'pdf' | 'html' | 'docx';
  tags: string[];
  isFavorite: boolean;
  isTemplate: boolean;
  createdAt: number;
  updatedAt: number;
  size: number; // bytes
  content?: string; // Report content
}

export interface ReportTemplate {
  id: string;
  userId: string;
  name: string;
  description?: string;
  reportType: string;
  sections: string[];
  customizations: Record<string, any>;
  isPublic: boolean;
  usageCount: number;
  createdAt: number;
  updatedAt: number;
}

/**
 * Report Library Manager
 * Manages user's report collection, templates, and generation
 */
export class ReportLibraryManager {
  private reports: Map<string, SavedReport> = new Map();
  private templates: Map<string, ReportTemplate> = new Map();
  private storageKey = 'kotravel_reports';
  private templatesKey = 'kotravel_report_templates';
  private maxReports = 500;
  private maxStorageMB = 1000;

  constructor() {
    this.loadReports();
    this.loadTemplates();
    this.createDefaultTemplates();
  }

  /**
   * Save new report
   */
  saveReport(data: Omit<SavedReport, 'id' | 'createdAt' | 'updatedAt' | 'size'>): SavedReport {
    const report: SavedReport = {
      ...data,
      id: `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      size: this.estimateSize(data),
    };

    if (this.reports.size >= this.maxReports) {
      throw new Error(`Report limit reached (${this.maxReports})`);
    }

    if (this.getTotalStorageUsed() + report.size > this.maxStorageMB * 1024 * 1024) {
      throw new Error('Storage limit exceeded');
    }

    this.reports.set(report.id, report);
    this.persistReports();
    return report;
  }

  /**
   * Get report by ID
   */
  getReport(id: string): SavedReport | null {
    return this.reports.get(id) || null;
  }

  /**
   * Get all reports
   */
  getAllReports(): SavedReport[] {
    return Array.from(this.reports.values()).sort((a, b) => b.updatedAt - a.updatedAt);
  }

  /**
   * Get reports by chart
   */
  getReportsByChart(chartId: string): SavedReport[] {
    return this.getAllReports().filter(r => r.chartId === chartId);
  }

  /**
   * Search reports
   */
  searchReports(query: string): SavedReport[] {
    const lowerQuery = query.toLowerCase();
    return this.getAllReports().filter(report =>
      report.title.toLowerCase().includes(lowerQuery) ||
      report.description?.toLowerCase().includes(lowerQuery) ||
      report.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }

  /**
   * Get favorite reports
   */
  getFavoriteReports(): SavedReport[] {
    return this.getAllReports().filter(r => r.isFavorite);
  }

  /**
   * Toggle favorite
   */
  toggleFavorite(id: string): boolean {
    const report = this.reports.get(id);
    if (report) {
      report.isFavorite = !report.isFavorite;
      report.updatedAt = Date.now();
      this.persistReports();
      return report.isFavorite;
    }
    return false;
  }

  /**
   * Update report
   */
  updateReport(id: string, updates: Partial<SavedReport>): SavedReport | null {
    const report = this.reports.get(id);
    if (!report) return null;

    Object.assign(report, updates);
    report.updatedAt = Date.now();
    report.size = this.estimateSize(report);
    this.persistReports();
    return report;
  }

  /**
   * Delete report
   */
  deleteReport(id: string): boolean {
    const deleted = this.reports.delete(id);
    if (deleted) {
      this.persistReports();
    }
    return deleted;
  }

  /**
   * Delete multiple reports
   */
  deleteMultiple(ids: string[]): number {
    let deleted = 0;
    ids.forEach(id => {
      if (this.deleteReport(id)) {
        deleted++;
      }
    });
    return deleted;
  }

  /**
   * Create template from report
   */
  createTemplateFromReport(reportId: string, templateName: string): ReportTemplate | null {
    const report = this.reports.get(reportId);
    if (!report) return null;

    const template: ReportTemplate = {
      id: `template_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: report.userId,
      name: templateName,
      reportType: report.reportType,
      sections: [],
      customizations: {},
      isPublic: false,
      usageCount: 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    this.templates.set(template.id, template);
    this.persistTemplates();
    return template;
  }

  /**
   * Get all templates
   */
  getAllTemplates(): ReportTemplate[] {
    return Array.from(this.templates.values()).sort((a, b) => b.updatedAt - a.updatedAt);
  }

  /**
   * Get template
   */
  getTemplate(id: string): ReportTemplate | null {
    return this.templates.get(id) || null;
  }

  /**
   * Get templates by type
   */
  getTemplatesByType(reportType: string): ReportTemplate[] {
    return this.getAllTemplates().filter(t => t.reportType === reportType);
  }

  /**
   * Use template (increment usage count)
   */
  useTemplate(id: string): void {
    const template = this.templates.get(id);
    if (template) {
      template.usageCount++;
      template.updatedAt = Date.now();
      this.persistTemplates();
    }
  }

  /**
   * Delete template
   */
  deleteTemplate(id: string): boolean {
    return this.templates.delete(id);
  }

  /**
   * Get report statistics
   */
  getStatistics(): {
    totalReports: number;
    totalTemplates: number;
    byType: Record<string, number>;
    byFormat: Record<string, number>;
    totalSize: number;
    averageReportSize: number;
    storageUsedPercent: number;
  } {
    const totalReports = this.reports.size;
    const totalTemplates = this.templates.size;
    const totalSize = this.getTotalStorageUsed();
    const averageReportSize = totalReports > 0 ? totalSize / totalReports : 0;
    const maxStorage = this.maxStorageMB * 1024 * 1024;
    const storageUsedPercent = (totalSize / maxStorage) * 100;

    const byType: Record<string, number> = {};
    const byFormat: Record<string, number> = {};

    this.reports.forEach(report => {
      byType[report.reportType] = (byType[report.reportType] || 0) + 1;
      byFormat[report.format] = (byFormat[report.format] || 0) + 1;
    });

    return {
      totalReports,
      totalTemplates,
      byType,
      byFormat,
      totalSize,
      averageReportSize,
      storageUsedPercent,
    };
  }

  /**
   * Export report
   */
  exportReport(id: string): string | null {
    const report = this.reports.get(id);
    if (!report) return null;

    return JSON.stringify(report, null, 2);
  }

  /**
   * Export multiple reports
   */
  exportMultiple(ids: string[]): string {
    const reports = ids.map(id => this.reports.get(id)).filter(Boolean);
    return JSON.stringify({
      reports,
      exportedAt: new Date().toISOString(),
      count: reports.length,
    }, null, 2);
  }

  // ==================== PRIVATE METHODS ====================

  private createDefaultTemplates(): void {
    if (this.templates.size === 0) {
      const defaultTemplates = [
        {
          name: 'Standard Birth Chart Report',
          reportType: 'birth-chart',
          sections: ['introduction', 'planetary-positions', 'house-analysis', 'yogas', 'summary'],
        },
        {
          name: 'Dasha Period Analysis',
          reportType: 'dasha',
          sections: ['introduction', 'current-dasha', 'upcoming-dashas', 'predictions', 'remedies'],
        },
        {
          name: 'Transit Report',
          reportType: 'transit',
          sections: ['introduction', 'current-transits', 'transit-effects', 'timing', 'advice'],
        },
      ];

      defaultTemplates.forEach((template, index) => {
        const id = `template_default_${index}`;
        this.templates.set(id, {
          id,
          userId: 'system',
          name: template.name,
          reportType: template.reportType,
          sections: template.sections,
          customizations: {},
          isPublic: true,
          usageCount: 0,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        });
      });
    }
  }

  private estimateSize(report: any): number {
    return JSON.stringify(report).length;
  }

  private getTotalStorageUsed(): number {
    return Array.from(this.reports.values()).reduce((sum, report) => sum + report.size, 0);
  }

  private persistReports(): void {
    try {
      const reportsArray = Array.from(this.reports.values());
      localStorage.setItem(this.storageKey, JSON.stringify(reportsArray));
    } catch (error) {
      console.error('Failed to save reports:', error);
    }
  }

  private loadReports(): void {
    try {
      const data = localStorage.getItem(this.storageKey);
      if (data) {
        const reports = JSON.parse(data) as SavedReport[];
        reports.forEach(report => {
          this.reports.set(report.id, report);
        });
      }
    } catch (error) {
      console.error('Failed to load reports:', error);
    }
  }

  private persistTemplates(): void {
    try {
      const templatesArray = Array.from(this.templates.values());
      localStorage.setItem(this.templatesKey, JSON.stringify(templatesArray));
    } catch (error) {
      console.error('Failed to save templates:', error);
    }
  }

  private loadTemplates(): void {
    try {
      const data = localStorage.getItem(this.templatesKey);
      if (data) {
        const templates = JSON.parse(data) as ReportTemplate[];
        templates.forEach(template => {
          this.templates.set(template.id, template);
        });
      }
    } catch (error) {
      console.error('Failed to load templates:', error);
    }
  }
}

// Global report library instance
let reportLibrary: ReportLibraryManager | null = null;

export function initializeReportLibrary(): ReportLibraryManager {
  if (!reportLibrary) {
    reportLibrary = new ReportLibraryManager();
  }
  return reportLibrary;
}

export function getReportLibrary(): ReportLibraryManager {
  if (!reportLibrary) {
    reportLibrary = new ReportLibraryManager();
  }
  return reportLibrary;
}
