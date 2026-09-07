/**
 * TRACK B.3: Chancha Chakra Visualization Component
 *
 * Displays house-based ashtakavarga grouping:
 * - Kendra (angles): Houses 1, 4, 7, 10
 * - Panapara (succedent): Houses 2, 5, 8, 11
 * - Apoklima (cadent): Houses 3, 6, 9, 12
 *
 * Shows totals, percentages, and strength assessment.
 *
 * Source: Vinay Aditya, Ch.16 (ashtakavargaVariations.js)
 * Date: 2026-09-07
 */

const CHANCHA_GROUPS = {
  kendra: {
    name: 'Kendra (Angles)',
    houses: [1, 4, 7, 10],
    indices: [0, 3, 6, 9],
    meaning: 'Angular houses - most powerful for manifestation',
    preference: 1,
  },
  panapara: {
    name: 'Panapara (Succedent)',
    houses: [2, 5, 8, 11],
    indices: [1, 4, 7, 10],
    meaning: 'Succedent houses - supporting energy',
    preference: 2,
  },
  apoklima: {
    name: 'Apoklima (Cadent)',
    houses: [3, 6, 9, 12],
    indices: [2, 5, 8, 11],
    meaning: 'Cadent houses - declining energy',
    preference: 3,
  },
};

/**
 * ChancharChakra Component
 *
 * Usage:
 * const chakra = new ChancharChakra(containerId, sarvaAshtakavarga);
 * chakra.render();
 */
class ChancharChakra {
  constructor(containerId, sarvaAshtakavarga = []) {
    this.containerId = containerId;
    this.sarvaAshtakavarga = sarvaAshtakavarga;
    this.container = document.getElementById(containerId);

    if (!this.container) {
      throw new Error(`Container with id "${containerId}" not found`);
    }

    this.data = this._calculateChakraData();
  }

  /**
   * Calculate chakra totals and statistics
   */
  _calculateChakraData() {
    const data = {};

    for (const [groupKey, group] of Object.entries(CHANCHA_GROUPS)) {
      const indices = group.indices;
      const total = indices.reduce((sum, idx) => sum + (this.sarvaAshtakavarga[idx] || 0), 0);

      data[groupKey] = {
        ...group,
        total,
        percentage: 0,
        strength: this._classifyStrength(groupKey, total),
      };
    }

    // Calculate grand total and percentages
    const grandTotal = Object.values(data).reduce((sum, g) => sum + g.total, 0);
    for (const key in data) {
      data[key].percentage = grandTotal > 0 ? Math.round((data[key].total / grandTotal) * 100) : 0;
    }

    return {
      groups: data,
      grandTotal,
      overallStrength: this._classifyOverallStrength(data),
    };
  }

  /**
   * Classify strength for a specific group
   */
  _classifyStrength(groupKey, total) {
    const thresholds = {
      kendra: { excellent: 80, good: 70 },
      panapara: { excellent: 75, good: 65 },
      apoklima: { excellent: 65, good: 55 },
    };

    const threshold = thresholds[groupKey];
    if (total >= threshold.excellent) return 'Excellent';
    if (total >= threshold.good) return 'Good';
    return 'Average';
  }

  /**
   * Classify overall chart strength
   */
  _classifyOverallStrength(data) {
    const k = data.kendra.total;
    const p = data.panapara.total;
    const a = data.apoklima.total;

    if (k >= 80 && p >= 75 && a >= 65) return 'Excellent';
    if (k >= 70 && p >= 65 && a >= 55) return 'Good';
    if (k >= 60 && p >= 55 && a >= 45) return 'Average';
    return 'Below Average';
  }

  /**
   * Render the complete UI
   */
  render() {
    this.container.innerHTML = this._buildHTML();
  }

  /**
   * Build complete HTML structure
   */
  _buildHTML() {
    return `
      <div class="chancha-container">
        <div class="chancha-header">
          <h3>Chancha Chakra Analysis</h3>
          <p>House group strength in ashtakavarga</p>
        </div>

        <div class="chancha-content">
          <div class="chakra-grid">
            ${this._buildGroupCards()}
          </div>

          <div class="chakra-summary">
            <div class="summary-row">
              <span class="summary-label">Grand Total Bindus:</span>
              <span class="summary-value">${this.data.grandTotal}</span>
            </div>
            <div class="summary-row">
              <span class="summary-label">Overall Strength:</span>
              <span class="summary-value strength-${this._strengthClass(this.data.overallStrength)}">
                ${this.data.overallStrength}
              </span>
            </div>
          </div>

          <div class="chakra-bars">
            ${this._buildProgressBars()}
          </div>

          <div class="chakra-interpretation">
            <h4>Interpretation</h4>
            <p>${this._getInterpretation()}</p>
          </div>
        </div>

        <div class="chancha-legend">
          <div class="legend-item">
            <div class="legend-dot excellent"></div>
            <span>Excellent Strength</span>
          </div>
          <div class="legend-item">
            <div class="legend-dot good"></div>
            <span>Good Strength</span>
          </div>
          <div class="legend-item">
            <div class="legend-dot average"></div>
            <span>Average Strength</span>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Build chakra group cards
   */
  _buildGroupCards() {
    return Object.entries(this.data.groups)
      .map(([key, group]) => `
        <div class="chakra-card ${key}">
          <div class="card-header">
            <h4>${group.name}</h4>
            <span class="strength-badge strength-${this._strengthClass(group.strength)}">
              ${group.strength}
            </span>
          </div>

          <div class="card-content">
            <div class="house-list">
              <span class="label">Houses:</span>
              <span class="houses">${group.houses.join(', ')}</span>
            </div>

            <div class="bindu-display">
              <div class="bindu-value">${group.total}</div>
              <div class="bindu-label">Bindus</div>
            </div>

            <div class="percentage-display">
              <span class="percentage">${group.percentage}%</span>
            </div>

            <p class="card-meaning">${group.meaning}</p>
          </div>
        </div>
      `)
      .join('');
  }

  /**
   * Build progress bars for visual comparison
   */
  _buildProgressBars() {
    const maxTotal = Math.max(
      ...Object.values(this.data.groups).map(g => g.total)
    ) || 100;

    return Object.entries(this.data.groups)
      .map(([key, group]) => {
        const percentage = maxTotal > 0 ? (group.total / maxTotal) * 100 : 0;
        return `
          <div class="bar-row">
            <div class="bar-label">${group.name}</div>
            <div class="bar-container">
              <div class="bar-fill ${key}" style="width: ${percentage}%;">
                <span class="bar-value">${group.total}</span>
              </div>
            </div>
          </div>
        `;
      })
      .join('');
  }

  /**
   * Get interpretation text based on data
   */
  _getInterpretation() {
    const { kendra, panapara, apoklima } = this.data.groups;

    let text = '';

    if (kendra.strength === 'Excellent') {
      text += 'Strong angular houses support manifestation of events. ';
    } else if (kendra.strength === 'Good') {
      text += 'Good angular support for materialization of outcomes. ';
    } else {
      text += 'Weak angular support may require effort for manifestation. ';
    }

    if (panapara.strength === 'Excellent') {
      text += 'Excellent succedent support sustains progress. ';
    } else if (panapara.strength === 'Good') {
      text += 'Good succedent energy maintains momentum. ';
    } else {
      text += 'Weak succedent houses may affect sustainability. ';
    }

    if (kendra.total > apoklima.total) {
      text += 'Angular houses outweigh cadent houses - favorable for growth.';
    } else if (apoklima.total > kendra.total) {
      text += 'Cadent houses outweigh angular houses - may require caution.';
    } else {
      text += 'Balanced angular and cadent house strength.';
    }

    return text;
  }

  /**
   * Helper to map strength to CSS class
   */
  _strengthClass(strength) {
    switch (strength) {
      case 'Excellent': return 'excellent';
      case 'Good': return 'good';
      case 'Average': return 'average';
      default: return 'below-average';
    }
  }

  /**
   * Get chakra data
   */
  getChakraData() {
    return this.data;
  }

  /**
   * Export chakra analysis as JSON
   */
  exportJSON() {
    const data = {
      title: 'Chancha Chakra Analysis',
      date: new Date().toISOString(),
      chakraData: this.data,
      sarvaAshtakavarga: this.sarvaAshtakavarga,
    };
    return JSON.stringify(data, null, 2);
  }

  /**
   * Export chakra analysis as CSV
   */
  exportCSV() {
    let csv = 'Chancha Chakra Analysis\n\n';
    csv += 'Group,Houses,Total Bindus,Percentage,Strength\n';

    for (const [key, group] of Object.entries(this.data.groups)) {
      csv += `"${group.name}","${group.houses.join(', ')}",${group.total},${group.percentage}%,"${group.strength}"\n`;
    }

    csv += `\nGrand Total,${this.data.grandTotal}\n`;
    csv += `Overall Strength,${this.data.overallStrength}\n`;

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'chancha-chakra-analysis.csv';
    a.click();
  }
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ChancharChakra, CHANCHA_GROUPS };
}
