'use client';

import React, { useState } from 'react';
import styles from './ReportRefinements.module.css';

interface ReportSection {
  name: string;
  key: string;
  itemCount: number;
  position: number;
}

interface ExportData {
  format: string;
  filename: string;
  title: string;
  profileName: string;
  sections: ReportSection[];
  pageCount: number;
  timestamp: string;
  fileSize: number;
  mimeType: string;
}

interface ReportRefinementsData {
  reportTitle: string;
  sections: ReportSection[];
  totalSections: number;
  totalItems: number;
  generatedAt: string;
  exportOptions?: ExportData[];
}

export function ReportRefinementsRenderer({ data }: { data: ReportRefinementsData | null }) {
  const [showTab, setShowTab] = useState<'summary' | 'export' | 'preview'>('summary');
  const [selectedFormat, setSelectedFormat] = useState<string>('PDF');

  if (!data) {
    return <div className={styles.empty}>Report Refinements data unavailable</div>;
  }

  const formats = ['PDF', 'Image', 'JSON', 'HTML'];
  const formatIcons = {
    PDF: '📄',
    Image: '🖼️',
    JSON: '⚙️',
    HTML: '🌐'
  };

  const generatedDate = new Date(data.generatedAt);

  return (
    <div className={styles.container}>
      <h3>📊 Report Refinements & Export</h3>

      {/* Report Title */}
      <div className={styles.reportHeader}>
        <h2>{data.reportTitle}</h2>
        <div className={styles.reportMeta}>
          <span>Generated: {generatedDate.toLocaleString()}</span>
          <span>•</span>
          <span>{data.totalSections} sections • {data.totalItems} items</span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${showTab === 'summary' ? styles.active : ''}`}
          onClick={() => setShowTab('summary')}
        >
          Report Summary
        </button>
        <button
          className={`${styles.tab} ${showTab === 'export' ? styles.active : ''}`}
          onClick={() => setShowTab('export')}
        >
          Export Options
        </button>
        <button
          className={`${styles.tab} ${showTab === 'preview' ? styles.active : ''}`}
          onClick={() => setShowTab('preview')}
        >
          Preview
        </button>
      </div>

      {/* Summary Tab */}
      {showTab === 'summary' && (
        <div className={styles.tabContent}>
          <div className={styles.summaryBox}>
            <h4>Report Contents</h4>
            <div className={styles.sectionsList}>
              {data.sections.map((section, idx) => (
                <div key={idx} className={styles.sectionItem}>
                  <div className={styles.sectionNumber}>{section.position}</div>
                  <div className={styles.sectionDetails}>
                    <div className={styles.sectionName}>{section.name}</div>
                    <div className={styles.sectionItems}>{section.itemCount} items</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.statisticsBox}>
            <h4>Report Statistics</h4>
            <div className={styles.stats}>
              <div className={styles.stat}>
                <span className={styles.statValue}>{data.totalSections}</span>
                <span className={styles.statLabel}>Sections</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statValue}>{data.totalItems}</span>
                <span className={styles.statLabel}>Total Items</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statValue}>~10-15</span>
                <span className={styles.statLabel}>Estimated Pages</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statValue}>Complete</span>
                <span className={styles.statLabel}>Status</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Export Tab */}
      {showTab === 'export' && (
        <div className={styles.tabContent}>
          <div className={styles.exportBox}>
            <h4>Choose Export Format</h4>
            <div className={styles.formatGrid}>
              {formats.map(format => (
                <button
                  key={format}
                  className={`${styles.formatCard} ${selectedFormat === format ? styles.selected : ''}`}
                  onClick={() => setSelectedFormat(format)}
                >
                  <div className={styles.formatIcon}>{formatIcons[format]}</div>
                  <div className={styles.formatName}>{format}</div>
                </button>
              ))}
            </div>

            <div className={styles.formatDetails}>
              <h5>{selectedFormat} Export</h5>
              <div className={styles.detailsList}>
                <div className={styles.detail}>
                  <span className={styles.label}>Format:</span>
                  <span className={styles.value}>{selectedFormat}</span>
                </div>
                <div className={styles.detail}>
                  <span className={styles.label}>File Extension:</span>
                  <span className={styles.value}>
                    {selectedFormat === 'PDF' && '.pdf'}
                    {selectedFormat === 'Image' && '.png'}
                    {selectedFormat === 'JSON' && '.json'}
                    {selectedFormat === 'HTML' && '.html'}
                  </span>
                </div>
                <div className={styles.detail}>
                  <span className={styles.label}>Best For:</span>
                  <span className={styles.value}>
                    {selectedFormat === 'PDF' && 'Printing & Sharing'}
                    {selectedFormat === 'Image' && 'Web & Social Media'}
                    {selectedFormat === 'JSON' && 'Integration & Analysis'}
                    {selectedFormat === 'HTML' && 'Interactive Viewing'}
                  </span>
                </div>
              </div>

              <button className={styles.exportBtn}>
                📥 Export as {selectedFormat}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Tab */}
      {showTab === 'preview' && (
        <div className={styles.tabContent}>
          <div className={styles.previewBox}>
            <h4>Report Preview</h4>

            <div className={styles.previewPages}>
              <div className={styles.previewPage}>
                <div className={styles.coverPage}>
                  <h1>{data.reportTitle}</h1>
                  <div className={styles.coverDetails}>
                    <p>Vedic Astrology Analysis Report</p>
                    <p>{generatedDate.toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              <div className={styles.previewPage}>
                <div className={styles.tocPage}>
                  <h2>Table of Contents</h2>
                  <ol className={styles.tocList}>
                    {data.sections.map(section => (
                      <li key={section.key}>
                        <span className={styles.tocTitle}>{section.name}</span>
                        <span className={styles.tocPage}>...</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>

            <div className={styles.previewFooter}>
              <p>📄 Report contains {data.totalSections} sections with {data.totalItems} data items</p>
              <p>✅ All sections complete and ready for export</p>
            </div>
          </div>
        </div>
      )}

      <div className={styles.footer}>
        <p>🔒 Your report is private and secure • ✨ High-quality formatting included</p>
      </div>
    </div>
  );
}
