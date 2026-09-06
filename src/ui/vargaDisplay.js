/**
 * TRACK B.1: Varga Chart Display Component
 *
 * Displays all 16 divisional charts (D1-D60) in tabular format
 * with intuitive navigation and color-coded interpretations.
 *
 * Source: BPHS Ch.6 (vargaChart.js), integrated with UI layer
 * Date: 2026-09-07
 */

const VARGA_DEFINITIONS = {
  D1: { name: 'Rashi', symbol: 'D1', meaning: 'Overall life matters', significations: 12 },
  D2: { name: 'Hora', symbol: 'D2', meaning: 'Finance & wealth', significations: 2 },
  D3: { name: 'Drekkana', symbol: 'D3', meaning: 'Siblings & courage', significations: 3 },
  D4: { name: 'Chaturthamsha', symbol: 'D4', meaning: 'Property & vehicles', significations: 4 },
  D7: { name: 'Saptamsha', symbol: 'D7', meaning: 'Spouse & partnership', significations: 7 },
  D9: { name: 'Navamsha', symbol: 'D9', meaning: 'Destiny & spirituality', significations: 9 },
  D10: { name: 'Dashamsha', symbol: 'D10', meaning: 'Career & status', significations: 10 },
  D12: { name: 'Dvadashamsha', symbol: 'D12', meaning: 'Parents & elders', significations: 12 },
  D16: { name: 'Shodashamsha', symbol: 'D16', meaning: 'Vehicles & luxuries', significations: 16 },
  D20: { name: 'Vimshamsha', symbol: 'D20', meaning: 'Spirituality & dharma', significations: 20 },
  D24: { name: 'Chaturvimshamsha', symbol: 'D24', meaning: 'Education & speech', significations: 24 },
  D27: { name: 'Saptavimsamsha', symbol: 'D27', meaning: 'Strength & health', significations: 27 },
  D30: { name: 'Trimsamsha', symbol: 'D30', meaning: 'Misfortune & challenges', significations: 30 },
  D40: { name: 'Khavedamsha', symbol: 'D40', meaning: 'Subtle strength', significations: 40 },
  D45: { name: 'Akshavedamsha', symbol: 'D45', meaning: 'Extreme detail', significations: 45 },
  D60: { name: 'Shashtiamsa', symbol: 'D60', meaning: 'Ultimate refinement', significations: 60 },
};

const RASI_NAMES = ['Mesha', 'Vrishabha', 'Mithuna', 'Karkataka', 'Simha', 'Kanya',
  'Tula', 'Vrischika', 'Dhanu', 'Makara', 'Kumbha', 'Meena'];

const RASI_SYMBOLS = ['♈', '♉', '♊', '♋', '♌', '♍',
  '♎', '♏', '♐', '♑', '♒', '♓'];

/**
 * VargaDisplay Component
 *
 * Usage:
 * const display = new VargaDisplay(containerId, vargas);
 * display.render();
 */
class VargaDisplay {
  constructor(containerId, vargas) {
    this.containerId = containerId;
    this.vargas = vargas;
    this.currentChart = 'D1';
    this.container = document.getElementById(containerId);

    if (!this.container) {
      throw new Error(`Container with id "${containerId}" not found`);
    }
  }

  /**
   * Render the complete UI
   */
  render() {
    this.container.innerHTML = this._buildHTML();
    this._attachEventListeners();
    this._renderChart('D1');
  }

  /**
   * Build HTML structure
   */
  _buildHTML() {
    return `
      <div class="varga-display">
        <div class="varga-header">
          <h2>Divisional Charts (Vargas)</h2>
          <p>Click on a chart to view details</p>
        </div>

        <div class="varga-tabs">
          ${Object.keys(VARGA_DEFINITIONS).map(chartKey => `
            <button class="varga-tab ${chartKey === 'D1' ? 'active' : ''}" data-chart="${chartKey}">
              <span class="tab-symbol">${VARGA_DEFINITIONS[chartKey].symbol}</span>
              <span class="tab-name">${VARGA_DEFINITIONS[chartKey].name}</span>
            </button>
          `).join('')}
        </div>

        <div class="varga-content">
          <div class="chart-info">
            <h3 id="chart-title"></h3>
            <p id="chart-meaning"></p>
            <p id="chart-divisions"></p>
          </div>

          <div class="chart-table-container">
            <table id="chart-table" class="chart-table">
              <thead>
                <tr>
                  <th>House</th>
                  <th>Rasi</th>
                  <th>Sign</th>
                  <th>Meaning</th>
                </tr>
              </thead>
              <tbody id="chart-tbody">
              </tbody>
            </table>
          </div>
        </div>

        <div class="varga-legend">
          <div class="legend-item">
            <span class="legend-color benefic"></span>
            <span>Benefic</span>
          </div>
          <div class="legend-item">
            <span class="legend-color neutral"></span>
            <span>Neutral</span>
          </div>
          <div class="legend-item">
            <span class="legend-color malefic"></span>
            <span>Malefic</span>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Attach event listeners
   */
  _attachEventListeners() {
    const tabs = this.container.querySelectorAll('.varga-tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', (e) => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        this._renderChart(tab.dataset.chart);
      });
    });
  }

  /**
   * Render specific chart
   */
  _renderChart(chartKey) {
    this.currentChart = chartKey;
    const chartDef = VARGA_DEFINITIONS[chartKey];
    const chartData = this.vargas[chartKey];

    if (!chartData) {
      console.warn(`Chart data for ${chartKey} not found`);
      return;
    }

    // Update header
    document.getElementById('chart-title').textContent =
      `${chartDef.symbol}: ${chartDef.name}`;
    document.getElementById('chart-meaning').textContent =
      `Meaning: ${chartDef.meaning}`;
    document.getElementById('chart-divisions').textContent =
      `Divisional Type: ${chartDef.significations}-fold`;

    // Render table
    this._renderTable(chartKey, chartData);
  }

  /**
   * Render chart data in table format
   */
  _renderTable(chartKey, chartData) {
    const tbody = document.getElementById('chart-tbody');
    tbody.innerHTML = '';

    const chartDef = VARGA_DEFINITIONS[chartKey];
    const divisionCount = chartDef.significations;

    for (let i = 0; i < 12; i += 1) {
      const house = i + 1;
      const rasiIndex = chartData.signIndex !== undefined ? chartData.signIndex : i;
      const rasiName = RASI_NAMES[rasiIndex];
      const rasiSymbol = RASI_SYMBOLS[rasiIndex];

      const row = document.createElement('tr');
      row.classList.add(this._getRowClass(rasiIndex));
      row.innerHTML = `
        <td class="house-number">${house}</td>
        <td class="rasi-name">${rasiName}</td>
        <td class="rasi-symbol">${rasiSymbol}</td>
        <td class="rasi-meaning">${this._getRasiMeaning(rasiIndex, chartKey)}</td>
      `;
      tbody.appendChild(row);
    }
  }

  /**
   * Determine row CSS class based on benefic/malefic status
   */
  _getRowClass(rasiIndex) {
    // Benefic signs (owned by benefic planets)
    const beneficSigns = [1, 4, 5, 9]; // Taurus, Cancer, Virgo, Sagittarius
    // Malefic signs (owned by malefic planets)
    const maleficSigns = [0, 3, 7, 8]; // Aries, Cancer, Scorpio, Sagittarius - simplified

    if (beneficSigns.includes(rasiIndex)) return 'benefic';
    if (maleficSigns.includes(rasiIndex)) return 'malefic';
    return 'neutral';
  }

  /**
   * Get rasi meaning based on position and chart
   */
  _getRasiMeaning(rasiIndex, chartKey) {
    // Simplified meanings - can be extended
    const meanings = {
      0: 'Initiative, Leadership',
      1: 'Stability, Resources',
      2: 'Communication, Siblings',
      3: 'Home, Mother',
      4: 'Creativity, Children',
      5: 'Service, Health',
      6: 'Relationships, Balance',
      7: 'Secrets, Transformation',
      8: 'Inheritance, Change',
      9: 'Luck, Long journeys',
      10: 'Career, Status',
      11: 'Friendship, Groups',
    };
    return meanings[rasiIndex] || 'See interpretations';
  }

  /**
   * Export table as CSV
   */
  exportCSV() {
    const chartKey = this.currentChart;
    const chartDef = VARGA_DEFINITIONS[chartKey];

    let csv = `${chartDef.name} (${chartKey})\n`;
    csv += 'House,Rasi,Symbol,Meaning\n';

    const tbody = document.getElementById('chart-tbody');
    tbody.querySelectorAll('tr').forEach(row => {
      const cells = row.querySelectorAll('td');
      csv += Array.from(cells).map(cell => `"${cell.textContent}"`).join(',') + '\n';
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `varga-${chartKey}.csv`;
    a.click();
  }

  /**
   * Get current chart data
   */
  getCurrentChartData() {
    return {
      chart: this.currentChart,
      definition: VARGA_DEFINITIONS[this.currentChart],
      data: this.vargas[this.currentChart],
    };
  }
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { VargaDisplay, VARGA_DEFINITIONS, RASI_NAMES, RASI_SYMBOLS };
}
