/**
 * TRACK B.2: Ashtakavarga Heatmap Component
 *
 * 7×12 grid displaying bindu strength for each planet across 12 houses.
 * Color-coded intensity: Red (weak) → Yellow (medium) → Green (strong)
 *
 * Source: BPHS Ch.6 (ashtakavargaVariations.js), UI layer integration
 * Date: 2026-09-07
 */

const PLANETS = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];

const HOUSES = [
  'House 1 (Mesha)', 'House 2 (Vrishabha)', 'House 3 (Mithuna)', 'House 4 (Karkataka)',
  'House 5 (Simha)', 'House 6 (Kanya)', 'House 7 (Tula)', 'House 8 (Vrischika)',
  'House 9 (Dhanu)', 'House 10 (Makara)', 'House 11 (Kumbha)', 'House 12 (Meena)',
];

const RASI_SHORT = ['Me', 'Vr', 'Mi', 'Ka', 'Si', 'Kn', 'Tu', 'Vrch', 'Dh', 'Mk', 'Ku', 'Mn'];

/**
 * AshtakavargaHeatmap Component
 *
 * Usage:
 * const heatmap = new AshtakavargaHeatmap(containerId, bhinnaAshtakavarga);
 * heatmap.render();
 */
class AshtakavargaHeatmap {
  constructor(containerId, bhinnaAshtakavarga) {
    this.containerId = containerId;
    this.bhinnaAshtakavarga = bhinnaAshtakavarga || {};
    this.container = document.getElementById(containerId);

    if (!this.container) {
      throw new Error(`Container with id "${containerId}" not found`);
    }
  }

  /**
   * Render the complete heatmap UI
   */
  render() {
    this.container.innerHTML = this._buildHTML();
    this._attachEventListeners();
  }

  /**
   * Build HTML structure for heatmap
   */
  _buildHTML() {
    return `
      <div class="heatmap-container">
        <div class="heatmap-header">
          <h3>Ashtakavarga Heatmap (Bindu Strength)</h3>
          <p>Color intensity represents bindu count: Green (strong) ← → Red (weak)</p>
        </div>

        <div class="heatmap-wrapper">
          <div class="heatmap-grid">
            ${this._buildHeaderRow()}
            ${PLANETS.map((planet, pIdx) => this._buildRow(planet, pIdx)).join('')}
          </div>
        </div>

        <div class="heatmap-legend">
          <div class="legend-row">
            <div class="legend-item">
              <div class="legend-box" style="background-color: #dc143c;"></div>
              <span>0-2 Bindus (Weak)</span>
            </div>
            <div class="legend-item">
              <div class="legend-box" style="background-color: #ffa500;"></div>
              <span>3-5 Bindus (Medium)</span>
            </div>
            <div class="legend-item">
              <div class="legend-box" style="background-color: #00a86b;"></div>
              <span>6-8 Bindus (Strong)</span>
            </div>
          </div>
        </div>

        <div class="heatmap-stats">
          <div id="selected-cell-info">Click a cell to see details</div>
        </div>
      </div>
    `;
  }

  /**
   * Build header row (house labels)
   */
  _buildHeaderRow() {
    return `
      <div class="heatmap-row header-row">
        <div class="heatmap-cell header-cell corner-cell">Planet</div>
        ${RASI_SHORT.map((rasi, idx) => `
          <div class="heatmap-cell header-cell" title="${HOUSES[idx]}">
            ${rasi}
          </div>
        `).join('')}
      </div>
    `;
  }

  /**
   * Build data row for each planet
   */
  _buildRow(planet, planetIdx) {
    const bhinnas = this.bhinnaAshtakavarga[planet] || Array(12).fill(0);

    return `
      <div class="heatmap-row" data-planet="${planet}">
        <div class="heatmap-cell header-cell planet-label">
          ${planet}
        </div>
        ${bhinnas.map((bindus, houseIdx) => `
          <div
            class="heatmap-cell data-cell"
            data-planet="${planet}"
            data-house="${houseIdx}"
            data-bindus="${bindus}"
            data-color="${this._getColorClass(bindus)}"
            style="background-color: ${this._getBinduColor(bindus)}; opacity: ${this._getOpacity(bindus)};"
            title="${planet} @ ${HOUSES[houseIdx]}: ${bindus} bindus"
          >
            <span class="bindu-value">${bindus}</span>
          </div>
        `).join('')}
      </div>
    `;
  }

  /**
   * Get color class based on bindu count
   */
  _getColorClass(bindus) {
    if (bindus <= 2) return 'weak';
    if (bindus <= 5) return 'medium';
    return 'strong';
  }

  /**
   * Get hex color for bindus
   */
  _getBinduColor(bindus) {
    // Scale from red (0) to green (8+)
    // 0-2: Red
    // 3-5: Orange/Yellow
    // 6-8: Green

    if (bindus <= 2) {
      // Red spectrum
      const ratio = bindus / 2;
      const r = 220;
      const g = Math.round(20 + (ratio * 80));
      const b = Math.round(60 - (ratio * 30));
      return `rgb(${r}, ${g}, ${b})`;
    }

    if (bindus <= 5) {
      // Orange/Yellow spectrum
      const ratio = (bindus - 2) / 3;
      const r = Math.round(220 - (ratio * 100));
      const g = Math.round(100 + (ratio * 105));
      const b = Math.round(30 + (ratio * 50));
      return `rgb(${r}, ${g}, ${b})`;
    }

    // Green spectrum (6-8)
    const ratio = (bindus - 5) / 3;
    const r = Math.round(120 - (ratio * 80));
    const g = Math.round(205 + (ratio * 50));
    const b = Math.round(80 - (ratio * 20));
    return `rgb(${r}, ${g}, ${b})`;
  }

  /**
   * Get opacity based on bindu strength
   */
  _getOpacity(bindus) {
    // Higher bindus = higher opacity
    const maxOpacity = 0.95;
    const minOpacity = 0.4;
    const opacity = minOpacity + ((bindus / 8) * (maxOpacity - minOpacity));
    return opacity;
  }

  /**
   * Attach event listeners for interactivity
   */
  _attachEventListeners() {
    const cells = this.container.querySelectorAll('.data-cell');

    cells.forEach(cell => {
      cell.addEventListener('click', (e) => {
        cells.forEach(c => c.classList.remove('selected'));
        cell.classList.add('selected');
        this._updateCellInfo(cell);
      });

      cell.addEventListener('mouseenter', () => {
        this._updateCellInfo(cell);
      });
    });
  }

  /**
   * Update the info display for selected cell
   */
  _updateCellInfo(cell) {
    const planet = cell.dataset.planet;
    const houseIdx = parseInt(cell.dataset.house, 10);
    const bindus = parseInt(cell.dataset.bindus, 10);
    const colorClass = this._getColorClass(bindus);

    const classification = this._classifyBindus(bindus);
    const infoDiv = this.container.querySelector('#selected-cell-info');

    if (infoDiv) {
      infoDiv.innerHTML = `
        <div class="cell-info-detail">
          <strong>${planet}</strong> in <strong>${HOUSES[houseIdx]}</strong>
          <br>
          <span class="bindu-count">${bindus} Bindus</span>
          <br>
          <span class="classification ${colorClass}">${classification}</span>
        </div>
      `;
    }
  }

  /**
   * Classify bindus using Vinay Aditya scale
   */
  _classifyBindus(bindus) {
    const labels = [
      'Calamitous',
      'Adverse',
      'Mediocre',
      'Tolerable',
      'Average',
      'Advantageous',
      'Fortunate',
      'Remarkable',
      'Magnificent',
    ];
    return labels[Math.min(bindus, 8)];
  }

  /**
   * Export heatmap data as JSON
   */
  exportJSON() {
    const data = {
      title: 'Ashtakavarga Heatmap',
      date: new Date().toISOString(),
      planets: PLANETS,
      houses: HOUSES,
      data: this.bhinnaAshtakavarga,
    };
    return JSON.stringify(data, null, 2);
  }

  /**
   * Export heatmap as CSV
   */
  exportCSV() {
    let csv = 'Ashtakavarga Heatmap (Bindus per Planet per House)\n\n';
    csv += 'Planet,' + HOUSES.map((_, i) => `House ${i + 1}`).join(',') + '\n';

    for (const planet of PLANETS) {
      const bhinnas = this.bhinnaAshtakavarga[planet] || Array(12).fill(0);
      csv += `"${planet}",${bhinnas.join(',')}\n`;
    }

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ashtakavarga-heatmap.csv';
    a.click();
  }

  /**
   * Get complete heatmap data
   */
  getHeatmapData() {
    return {
      planets: PLANETS,
      houses: HOUSES,
      bhinnaAshtakavarga: this.bhinnaAshtakavarga,
      totalBindus: this._calculateTotals(),
    };
  }

  /**
   * Calculate totals per house and per planet
   */
  _calculateTotals() {
    const totalsPerHouse = Array(12).fill(0);
    const totalsPerPlanet = {};

    for (const planet of PLANETS) {
      const bhinnas = this.bhinnaAshtakavarga[planet] || Array(12).fill(0);
      let planetTotal = 0;

      for (let i = 0; i < 12; i += 1) {
        totalsPerHouse[i] += bhinnas[i];
        planetTotal += bhinnas[i];
      }

      totalsPerPlanet[planet] = planetTotal;
    }

    return {
      perHouse: totalsPerHouse,
      perPlanet: totalsPerPlanet,
      grandTotal: Object.values(totalsPerPlanet).reduce((a, b) => a + b, 0),
    };
  }
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { AshtakavargaHeatmap, PLANETS, HOUSES, RASI_SHORT };
}
