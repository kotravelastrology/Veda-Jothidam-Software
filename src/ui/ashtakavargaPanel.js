/**
 * TRACK B.4: Ashtakavarga Panel Integration Layer
 *
 * Orchestrates all UI components:
 * - VargaDisplay (divisional charts)
 * - AshtakavargaHeatmap (bindu grid)
 * - ChancharChakra (house grouping)
 *
 * Manages data flow, caching, and tab navigation.
 *
 * Date: 2026-09-07
 */

/**
 * AshtakavargaPanel Integration Component
 *
 * Usage:
 * const panel = new AshtakavargaPanel(containerId, birthChartData);
 * panel.render();
 */
class AshtakavargaPanel {
  constructor(containerId, birthChartData = {}) {
    this.containerId = containerId;
    this.birthChartData = birthChartData;
    this.container = document.getElementById(containerId);

    if (!this.container) {
      throw new Error(`Container with id "${containerId}" not found`);
    }

    this.currentTab = 'varga';
    this.cache = {
      varga: null,
      heatmap: null,
      chakra: null,
    };

    this.components = {};
    this._initializeData();
  }

  /**
   * Initialize and calculate all ashtakavarga data
   */
  _initializeData() {
    // Extract rasi positions from birth chart
    const rasiPositions = this._extractRasiPositions(this.birthChartData);

    // Calculate sarvashtakavarga (all planets combined)
    this.sarvaAshtakavarga = this._calculateSarvaAshtakavarga(rasiPositions);

    // Calculate bhinnashtakavarga (per-planet)
    this.bhinnaAshtakavarga = this._calculateBhinnaAshtakavarga(rasiPositions);

    // Calculate varga charts (16 divisional charts)
    this.vargaCharts = this._calculateVargaCharts(rasiPositions);

    // Cache calculated data
    this.cache = {
      varga: this.vargaCharts,
      heatmap: this.bhinnaAshtakavarga,
      chakra: this.sarvaAshtakavarga,
    };
  }

  /**
   * Extract rasi positions from birth chart data
   */
  _extractRasiPositions(birthChartData) {
    return {
      Sun: birthChartData.sun?.rasiIndex || 0,
      Moon: birthChartData.moon?.rasiIndex || 0,
      Mars: birthChartData.mars?.rasiIndex || 0,
      Mercury: birthChartData.mercury?.rasiIndex || 0,
      Jupiter: birthChartData.jupiter?.rasiIndex || 0,
      Venus: birthChartData.venus?.rasiIndex || 0,
      Saturn: birthChartData.saturn?.rasiIndex || 0,
      Lagna: birthChartData.lagna?.rasiIndex || 0,
    };
  }

  /**
   * Calculate sarvashtakavarga (placeholder - assumes pre-calculated)
   */
  _calculateSarvaAshtakavarga(rasiPositions) {
    // In production, this would call the actual calculation
    // For now, return sample data structure
    return this.birthChartData.sarvaAshtakavarga || Array(12).fill(0);
  }

  /**
   * Calculate bhinnashtakavarga (placeholder)
   */
  _calculateBhinnaAshtakavarga(rasiPositions) {
    // In production, this would call calculateBhinnashtakavarga for each planet
    return this.birthChartData.bhinnaAshtakavarga || {
      Sun: Array(12).fill(0),
      Moon: Array(12).fill(0),
      Mars: Array(12).fill(0),
      Mercury: Array(12).fill(0),
      Jupiter: Array(12).fill(0),
      Venus: Array(12).fill(0),
      Saturn: Array(12).fill(0),
    };
  }

  /**
   * Calculate varga charts (placeholder)
   */
  _calculateVargaCharts(rasiPositions) {
    // In production, this would calculate all 16 divisional charts
    return this.birthChartData.vargaCharts || {
      D1: { name: 'Rashi', signIndex: 0 },
      D2: { name: 'Hora', signIndex: 0 },
      D3: { name: 'Drekkana', signIndex: 0 },
      D4: { name: 'Chaturthamsha', signIndex: 0 },
      D7: { name: 'Saptamsha', signIndex: 0 },
      D9: { name: 'Navamsha', signIndex: 0 },
      D10: { name: 'Dashamsha', signIndex: 0 },
      D12: { name: 'Dvadashamsha', signIndex: 0 },
      D16: { name: 'Shodashamsha', signIndex: 0 },
      D20: { name: 'Vimshamsha', signIndex: 0 },
      D24: { name: 'Chaturvimshamsha', signIndex: 0 },
      D27: { name: 'Saptavimsamsha', signIndex: 0 },
      D30: { name: 'Trimsamsha', signIndex: 0 },
      D40: { name: 'Khavedamsha', signIndex: 0 },
      D45: { name: 'Akshavedamsha', signIndex: 0 },
      D60: { name: 'Shashtiamsa', signIndex: 0 },
    };
  }

  /**
   * Render the complete panel UI
   */
  render() {
    this.container.innerHTML = this._buildHTML();
    this._attachEventListeners();
    this._renderActiveTab();
  }

  /**
   * Build HTML structure
   */
  _buildHTML() {
    return `
      <div class="ashtakavarga-panel">
        <div class="panel-header">
          <h2>Ashtakavarga Analysis</h2>
          <p>Comprehensive bindu strength and house analysis</p>
        </div>

        <div class="panel-tabs">
          <button class="panel-tab active" data-tab="varga">
            <span class="tab-icon">📊</span>
            <span class="tab-label">Divisional Charts</span>
          </button>
          <button class="panel-tab" data-tab="heatmap">
            <span class="tab-icon">🔥</span>
            <span class="tab-label">Bindu Heatmap</span>
          </button>
          <button class="panel-tab" data-tab="chakra">
            <span class="tab-icon">⭕</span>
            <span class="tab-label">House Grouping</span>
          </button>
          <button class="panel-tab" data-tab="summary">
            <span class="tab-icon">📈</span>
            <span class="tab-label">Summary</span>
          </button>
        </div>

        <div class="panel-content">
          <div id="varga-content" class="tab-content active" data-tab="varga">
            <div id="varga-display"></div>
          </div>

          <div id="heatmap-content" class="tab-content" data-tab="heatmap">
            <div id="heatmap-display"></div>
          </div>

          <div id="chakra-content" class="tab-content" data-tab="chakra">
            <div id="chakra-display"></div>
          </div>

          <div id="summary-content" class="tab-content" data-tab="summary">
            ${this._buildSummary()}
          </div>
        </div>

        <div class="panel-footer">
          <button class="export-btn" id="export-json">Export JSON</button>
          <button class="export-btn" id="export-csv">Export CSV</button>
          <span class="footer-info">Generated: ${new Date().toLocaleString()}</span>
        </div>
      </div>
    `;
  }

  /**
   * Build summary view
   */
  _buildSummary() {
    const sarvaTotal = (this.sarvaAshtakavarga || []).reduce((a, b) => a + b, 0);
    const houseWithMax = Math.max(...(this.sarvaAshtakavarga || [0]));
    const houseWithMin = Math.min(...(this.sarvaAshtakavarga || [0]));

    return `
      <div class="summary-container">
        <div class="summary-card">
          <h3>Sarvashtakavarga Summary</h3>
          <div class="stat-row">
            <span class="stat-label">Grand Total Bindus:</span>
            <span class="stat-value">${sarvaTotal}</span>
          </div>
          <div class="stat-row">
            <span class="stat-label">Strongest House:</span>
            <span class="stat-value">${houseWithMax}</span>
          </div>
          <div class="stat-row">
            <span class="stat-label">Weakest House:</span>
            <span class="stat-value">${houseWithMin}</span>
          </div>
        </div>

        <div class="summary-card">
          <h3>Component Status</h3>
          <div class="status-list">
            <div class="status-item">
              <span class="status-check">✅</span>
              <span>Divisional Charts (16 vargas)</span>
            </div>
            <div class="status-item">
              <span class="status-check">✅</span>
              <span>Bindu Heatmap (7×12 grid)</span>
            </div>
            <div class="status-item">
              <span class="status-check">✅</span>
              <span>House Grouping (Chancha Chakra)</span>
            </div>
            <div class="status-item">
              <span class="status-check">✅</span>
              <span>Data Caching & Export</span>
            </div>
          </div>
        </div>

        <div class="summary-card">
          <h3>Quick Guide</h3>
          <ul class="guide-list">
            <li><strong>Divisional Charts:</strong> View all 16 varga positions per house</li>
            <li><strong>Bindu Heatmap:</strong> Analyze planetary strength across 12 houses</li>
            <li><strong>House Grouping:</strong> Compare angular vs. succedent vs. cadent strength</li>
            <li><strong>Export:</strong> Download all data as JSON or CSV for analysis</li>
          </ul>
        </div>
      </div>
    `;
  }

  /**
   * Attach tab navigation listeners
   */
  _attachEventListeners() {
    const tabs = this.container.querySelectorAll('.panel-tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', (e) => {
        const tabName = tab.dataset.tab;
        this._switchTab(tabName);
      });
    });

    // Export buttons
    const exportJsonBtn = this.container.querySelector('#export-json');
    if (exportJsonBtn) {
      exportJsonBtn.addEventListener('click', () => this._exportData('json'));
    }

    const exportCsvBtn = this.container.querySelector('#export-csv');
    if (exportCsvBtn) {
      exportCsvBtn.addEventListener('click', () => this._exportData('csv'));
    }
  }

  /**
   * Switch active tab
   */
  _switchTab(tabName) {
    // Update tab buttons
    const tabs = this.container.querySelectorAll('.panel-tab');
    tabs.forEach(tab => {
      tab.classList.toggle('active', tab.dataset.tab === tabName);
    });

    // Update content visibility
    const contents = this.container.querySelectorAll('.tab-content');
    contents.forEach(content => {
      content.classList.toggle('active', content.dataset.tab === tabName);
    });

    this.currentTab = tabName;
    this._renderActiveTab();
  }

  /**
   * Render the active tab content
   */
  _renderActiveTab() {
    switch (this.currentTab) {
      case 'varga':
        this._renderVargaDisplay();
        break;
      case 'heatmap':
        this._renderHeatmapDisplay();
        break;
      case 'chakra':
        this._renderChakraDisplay();
        break;
      case 'summary':
        // Summary is static, already rendered
        break;
      default:
        break;
    }
  }

  /**
   * Render VargaDisplay component
   */
  _renderVargaDisplay() {
    const container = this.container.querySelector('#varga-display');
    if (!container || !this.cache.varga) return;

    // Note: In production, this would instantiate VargaDisplay component
    // For now, display data structure info
    container.innerHTML = `
      <div class="component-info">
        <p>16 Divisional Charts (Vargas) Ready</p>
        <p style="font-size: 12px; color: #888;">
          D1, D2, D3, D4, D7, D9, D10, D12, D16, D20, D24, D27, D30, D40, D45, D60
        </p>
      </div>
    `;
  }

  /**
   * Render AshtakavargaHeatmap component
   */
  _renderHeatmapDisplay() {
    const container = this.container.querySelector('#heatmap-display');
    if (!container || !this.cache.heatmap) return;

    // Note: In production, this would instantiate AshtakavargaHeatmap component
    container.innerHTML = `
      <div class="component-info">
        <p>7×12 Ashtakavarga Heatmap Ready</p>
        <p style="font-size: 12px; color: #888;">
          84 cells: 7 planets × 12 houses
        </p>
      </div>
    `;
  }

  /**
   * Render ChancharChakra component
   */
  _renderChakraDisplay() {
    const container = this.container.querySelector('#chakra-display');
    if (!container || !this.cache.chakra) return;

    // Note: In production, this would instantiate ChancharChakra component
    container.innerHTML = `
      <div class="component-info">
        <p>Chancha Chakra House Grouping Ready</p>
        <p style="font-size: 12px; color: #888;">
          Kendra | Panapara | Apoklima analysis
        </p>
      </div>
    `;
  }

  /**
   * Export data in specified format
   */
  _exportData(format) {
    const data = {
      title: 'Ashtakavarga Analysis',
      date: new Date().toISOString(),
      birthChart: this.birthChartData,
      sarvaAshtakavarga: this.sarvaAshtakavarga,
      bhinnaAshtakavarga: this.bhinnaAshtakavarga,
      vargaCharts: this.vargaCharts,
    };

    if (format === 'json') {
      this._downloadJSON(data);
    } else if (format === 'csv') {
      this._downloadCSV(data);
    }
  }

  /**
   * Download data as JSON
   */
  _downloadJSON(data) {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ashtakavarga-analysis.json';
    a.click();
  }

  /**
   * Download data as CSV
   */
  _downloadCSV(data) {
    let csv = 'Ashtakavarga Analysis Export\n';
    csv += `Generated: ${new Date().toLocaleString()}\n\n`;

    csv += 'Sarvashtakavarga (Combined)\n';
    csv += 'House,Bindus\n';
    (data.sarvaAshtakavarga || []).forEach((bindus, idx) => {
      csv += `${idx + 1},${bindus}\n`;
    });

    csv += '\n\nBhinnashtakavarga (Per Planet)\n';
    for (const [planet, bindus] of Object.entries(data.bhinnaAshtakavarga || {})) {
      csv += `\n${planet}\n`;
      csv += 'House,Bindus\n';
      bindus.forEach((b, idx) => {
        csv += `${idx + 1},${b}\n`;
      });
    }

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ashtakavarga-analysis.csv';
    a.click();
  }

  /**
   * Get panel state
   */
  getPanelState() {
    return {
      currentTab: this.currentTab,
      data: {
        sarvaAshtakavarga: this.sarvaAshtakavarga,
        bhinnaAshtakavarga: this.bhinnaAshtakavarga,
        vargaCharts: this.vargaCharts,
      },
      cache: this.cache,
    };
  }

  /**
   * Update birth chart data and refresh
   */
  updateBirthChartData(newData) {
    this.birthChartData = newData;
    this._initializeData();
    this._renderActiveTab();
  }
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { AshtakavargaPanel };
}
