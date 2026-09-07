/**
 * PHASE 29: Ashtakavarga Report Section Integration
 *
 * Enhanced display of ashtakavarga analysis for birth charts
 * Integrates Track B UI components into report builder
 *
 * Date: 2026-09-07
 */

/**
 * Ashtakavarga Report Section
 *
 * Displays comprehensive ashtakavarga analysis including:
 * - Sarvashtakavarga (all planets combined)
 * - Bhinnashtakavarga (per-planet strength)
 * - Chancha Chakra (house grouping)
 * - Strength classifications
 *
 * Usage:
 * const section = new AshtakavargaReportSection(sarvaData, bhinnaData, vargas);
 * section.render(container);
 */
class AshtakavargaReportSection {
  constructor(sarvaAshtakavarga = [], bhinnaAshtakavarga = {}, vargaCharts = {}) {
    this.sarvaAshtakavarga = sarvaAshtakavarga;
    this.bhinnaAshtakavarga = bhinnaAshtakavarga;
    this.vargaCharts = vargaCharts;
    this.currentTab = 'sarva';

    this.data = {
      sarva: this._analyzeSarva(),
      bhinna: this._analyzeBhinna(),
      chakra: this._analyzeChakra(),
    };
  }

  /**
   * Analyze sarvashtakavarga data
   */
  _analyzeSarva() {
    const total = (this.sarvaAshtakavarga || []).reduce((a, b) => a + b, 0);
    const max = Math.max(...(this.sarvaAshtakavarga || [0]));
    const min = Math.min(...(this.sarvaAshtakavarga || [0]));
    const avg = total / 12;

    return {
      bindus: this.sarvaAshtakavarga || [],
      total,
      max,
      min,
      average: avg,
      strength: this._classifySarva(total),
    };
  }

  /**
   * Analyze bhinnashtakavarga data
   */
  _analyzeBhinna() {
    const PLANETS = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
    const analysis = {};

    for (const planet of PLANETS) {
      const bindus = this.bhinnaAshtakavarga[planet] || Array(12).fill(0);
      const total = bindus.reduce((a, b) => a + b, 0);

      analysis[planet] = {
        bindus,
        total,
        average: total / 12,
        strength: this._classifyBhinna(total),
        max: Math.max(...bindus),
        min: Math.min(...bindus),
      };
    }

    return analysis;
  }

  /**
   * Analyze Chancha Chakra (house grouping)
   */
  _analyzeChakra() {
    const GROUPS = {
      kendra: [0, 3, 6, 9],      // H1, H4, H7, H10
      panapara: [1, 4, 7, 10],   // H2, H5, H8, H11
      apoklima: [2, 5, 8, 11],   // H3, H6, H9, H12
    };

    const chakra = {};
    const sarva = this.sarvaAshtakavarga || [];

    for (const [group, indices] of Object.entries(GROUPS)) {
      const total = indices.reduce((sum, idx) => sum + (sarva[idx] || 0), 0);
      chakra[group] = {
        total,
        indices,
        strength: this._classifyChakra(group, total),
      };
    }

    const grandTotal = Object.values(chakra).reduce((sum, g) => sum + g.total, 0);
    chakra.grandTotal = grandTotal;

    return chakra;
  }

  /**
   * Classify sarvashtakavarga strength
   */
  _classifySarva(total) {
    const perHouse = total / 12;
    if (perHouse >= 30) return 'Excellent';
    if (perHouse >= 25) return 'Good';
    if (perHouse >= 20) return 'Average';
    return 'Below Average';
  }

  /**
   * Classify bhinnashtakavarga strength
   */
  _classifyBhinna(total) {
    const perHouse = total / 12;
    if (perHouse >= 5.5) return 'Excellent';
    if (perHouse >= 4.5) return 'Good';
    if (perHouse >= 3.5) return 'Average';
    return 'Below Average';
  }

  /**
   * Classify Chancha Chakra strength
   */
  _classifyChakra(group, total) {
    const thresholds = {
      kendra: { excellent: 80, good: 70 },
      panapara: { excellent: 75, good: 65 },
      apoklima: { excellent: 65, good: 55 },
    };

    const threshold = thresholds[group];
    if (total >= threshold.excellent) return 'Excellent';
    if (total >= threshold.good) return 'Good';
    return 'Average';
  }

  /**
   * Get HTML for report section
   */
  getHTML() {
    return `
      <div class="ashtakavarga-report-section">
        <h3>Ashtakavarga Analysis</h3>

        <div class="report-tabs">
          <button class="tab active" data-tab="sarva">Sarvashtakavarga</button>
          <button class="tab" data-tab="bhinna">Per-Planet Strength</button>
          <button class="tab" data-tab="chakra">House Grouping</button>
        </div>

        <div class="tab-content active" data-tab="sarva">
          ${this._getSarvaHTML()}
        </div>

        <div class="tab-content" data-tab="bhinna">
          ${this._getBhinnaHTML()}
        </div>

        <div class="tab-content" data-tab="chakra">
          ${this._getChakraHTML()}
        </div>
      </div>
    `;
  }

  /**
   * Get Sarvashtakavarga HTML
   */
  _getSarvaHTML() {
    const { bindus, total, max, min, average, strength } = this.data.sarva;
    const RASI = ['Mesha', 'Vrishabha', 'Mithuna', 'Karkataka', 'Simha', 'Kanya',
                  'Tula', 'Vrischika', 'Dhanu', 'Makara', 'Kumbha', 'Meena'];

    return `
      <div class="sarva-analysis">
        <table class="stats-table">
          <tr>
            <td>Grand Total</td>
            <td class="value">${total}</td>
          </tr>
          <tr>
            <td>Average per House</td>
            <td class="value">${average.toFixed(2)}</td>
          </tr>
          <tr>
            <td>Strongest House</td>
            <td class="value">${Math.max(...bindus)} (${RASI[bindus.indexOf(Math.max(...bindus))]})</td>
          </tr>
          <tr>
            <td>Weakest House</td>
            <td class="value">${Math.min(...bindus)} (${RASI[bindus.indexOf(Math.min(...bindus))]})</td>
          </tr>
          <tr>
            <td>Overall Strength</td>
            <td class="value strength-${strength.toLowerCase()}">${strength}</td>
          </tr>
        </table>

        <div class="chart-bar">
          ${bindus.map((v, i) => `
            <div class="bar-item">
              <div class="bar" style="height: ${(v / max) * 100}%; background: hsl(${i * 30}, 70%, 50%);">
                <span class="bar-value">${v}</span>
              </div>
              <span class="bar-label">${RASI[i].slice(0, 3)}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  /**
   * Get Bhinnashtakavarga HTML
   */
  _getBhinnaHTML() {
    const PLANETS = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
    const POINT_LABELS = {
      Sun: 'सूर्य', Moon: 'चंद्र', Mars: 'मंगल', Mercury: 'बुध',
      Jupiter: 'गुरु', Venus: 'शुक्र', Saturn: 'शनि'
    };

    return `
      <div class="bhinna-analysis">
        <table class="bhinna-table">
          <thead>
            <tr>
              <th>Planet</th>
              <th>Total Bindus</th>
              <th>Per House</th>
              <th>Strength</th>
            </tr>
          </thead>
          <tbody>
            ${PLANETS.map(planet => {
              const analysis = this.data.bhinna[planet];
              return `
                <tr>
                  <td>${POINT_LABELS[planet] || planet}</td>
                  <td class="value">${analysis.total}</td>
                  <td class="value">${analysis.average.toFixed(2)}</td>
                  <td class="strength-${analysis.strength.toLowerCase()}">${analysis.strength}</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  /**
   * Get Chancha Chakra HTML
   */
  _getChakraHTML() {
    const chakra = this.data.chakra;
    const groups = [
      { key: 'kendra', name: 'Kendra (Angles)', houses: [1, 4, 7, 10] },
      { key: 'panapara', name: 'Panapara (Succedent)', houses: [2, 5, 8, 11] },
      { key: 'apoklima', name: 'Apoklima (Cadent)', houses: [3, 6, 9, 12] },
    ];

    return `
      <div class="chakra-analysis">
        <table class="chakra-table">
          <thead>
            <tr>
              <th>Group</th>
              <th>Houses</th>
              <th>Total Bindus</th>
              <th>Percentage</th>
              <th>Strength</th>
            </tr>
          </thead>
          <tbody>
            ${groups.map(group => {
              const data = chakra[group.key];
              const percentage = ((data.total / chakra.grandTotal) * 100).toFixed(1);
              return `
                <tr>
                  <td><strong>${group.name}</strong></td>
                  <td>${group.houses.join(', ')}</td>
                  <td class="value">${data.total}</td>
                  <td class="value">${percentage}%</td>
                  <td class="strength-${data.strength.toLowerCase()}">${data.strength}</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>

        <div class="chakra-summary">
          <p><strong>Grand Total:</strong> ${chakra.grandTotal} bindus</p>
          <p><strong>Interpretation:</strong> ${this._getChakraInterpretation(chakra)}</p>
        </div>
      </div>
    `;
  }

  /**
   * Get interpretation text for Chancha Chakra
   */
  _getChakraInterpretation(chakra) {
    const k = chakra.kendra.total;
    const p = chakra.panapara.total;
    const a = chakra.apoklima.total;

    if (k > p && k > a) {
      return 'Strong angular houses support manifestation of events. Focus on utilizing this power for material gains.';
    } else if (p > a && p > k) {
      return 'Strong succedent support sustains progress. Good for consolidating gains and building stability.';
    } else if (a > k || a > p) {
      return 'Cadent houses are strong. This supports spiritual growth and wisdom, though material manifestation may require effort.';
    } else {
      return 'Balanced house group strength. Harmonious development across manifestation, sustenance, and spiritual growth.';
    }
  }

  /**
   * Render to container
   */
  render(container) {
    if (typeof container === 'string') {
      container = document.getElementById(container);
    }

    if (!container) {
      console.warn('Ashtakavarga Report Section: Container not found');
      return;
    }

    container.innerHTML = this.getHTML();
    this._attachEventListeners(container);
  }

  /**
   * Attach tab event listeners
   */
  _attachEventListeners(container) {
    const tabs = container.querySelectorAll('.report-tabs .tab');
    const contents = container.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const tabName = tab.dataset.tab;

        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        contents.forEach(content => {
          content.classList.remove('active');
          if (content.dataset.tab === tabName) {
            content.classList.add('active');
          }
        });
      });
    });
  }
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { AshtakavargaReportSection };
}
