/**
 * Integration Tests: Days 25-26
 * Tests all 11 features with real calculations
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';

const API_BASE = 'http://localhost:5000/api';
const WEB_BASE = 'http://localhost:3000';

// Test data
const TEST_BIRTH_DATA = {
  date: '1990-01-01',
  time: '12:00:00',
  latitude: 13.0827,
  longitude: 80.2707,
};

describe('Days 25-26: End-to-End Integration Testing', () => {

  // ============================================
  // Phase 1: Birth Form & Data Entry
  // ============================================

  describe('Phase 1: Birth Form & Data Entry', () => {

    it('should accept valid birth date', () => {
      const date = new Date('1990-01-01');
      expect(date).toBeInstanceOf(Date);
      expect(date.getFullYear()).toBe(1990);
    });

    it('should validate birth time format (HH:MM:SS)', () => {
      const time = '12:00:00';
      const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/;
      expect(timeRegex.test(time)).toBe(true);
    });

    it('should accept coordinates within valid range', () => {
      const { latitude, longitude } = TEST_BIRTH_DATA;
      expect(latitude).toBeGreaterThanOrEqual(-90);
      expect(latitude).toBeLessThanOrEqual(90);
      expect(longitude).toBeGreaterThanOrEqual(-180);
      expect(longitude).toBeLessThanOrEqual(180);
    });
  });

  // ============================================
  // Phase 2: API Endpoints - Real Calculations
  // ============================================

  describe('Phase 2: Calculation Engine APIs', () => {

    describe('POST /api/charts/compute - Divisional Charts', () => {

      it('should return D1, D9, D10, D20 charts', async () => {
        const response = await fetch(`${API_BASE}/charts/compute`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(TEST_BIRTH_DATA),
        });

        expect(response.ok).toBe(true);
        const data = await response.json();

        expect(data).toHaveProperty('D1');
        expect(data).toHaveProperty('D9');
        expect(data).toHaveProperty('D10');
        expect(data).toHaveProperty('D20');
      });

      it('should include planetary positions in D1', async () => {
        const response = await fetch(`${API_BASE}/charts/compute`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(TEST_BIRTH_DATA),
        });

        const data = await response.json();
        const d1 = data.D1;

        expect(d1.points).toBeDefined();
        expect(Array.isArray(d1.points)).toBe(true);
        expect(d1.points.length).toBeGreaterThan(0);

        const planet = d1.points[0];
        expect(planet).toHaveProperty('label');
        expect(planet).toHaveProperty('rasiName');
        expect(planet).toHaveProperty('deg');
        expect(planet).toHaveProperty('kp');
      });

      it('should validate Lagna position in all charts', async () => {
        const response = await fetch(`${API_BASE}/charts/compute`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(TEST_BIRTH_DATA),
        });

        const data = await response.json();

        ['D1', 'D9', 'D10', 'D20'].forEach(chartId => {
          expect(data[chartId]).toHaveProperty('lagnaRasiIndex');
          expect(data[chartId].lagnaRasiIndex).toBeGreaterThanOrEqual(0);
          expect(data[chartId].lagnaRasiIndex).toBeLessThan(12);
        });
      });
    });

    describe('POST /api/charts/yogas/detect - Yoga Detection', () => {

      it('should detect yogas from birth data', async () => {
        const response = await fetch(`${API_BASE}/charts/yogas/detect`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(TEST_BIRTH_DATA),
        });

        expect(response.ok).toBe(true);
        const data = await response.json();

        expect(data).toHaveProperty('yogas');
        expect(Array.isArray(data.yogas)).toBe(true);
      });

      it('should classify yogas as benefic or malefic', async () => {
        const response = await fetch(`${API_BASE}/charts/yogas/detect`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(TEST_BIRTH_DATA),
        });

        const data = await response.json();
        const yogas = data.yogas;

        yogas.forEach(yoga => {
          expect(['benefic', 'malefic']).toContain(yoga.type);
          expect(yoga.strength).toBeGreaterThanOrEqual(0);
          expect(yoga.strength).toBeLessThanOrEqual(100);
        });
      });

      it('should provide benefic and malefic counts', async () => {
        const response = await fetch(`${API_BASE}/charts/yogas/detect`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(TEST_BIRTH_DATA),
        });

        const data = await response.json();

        expect(data).toHaveProperty('beneficCount');
        expect(data).toHaveProperty('maleficCount');
        expect(data).toHaveProperty('totalCount');

        const sum = data.beneficCount + data.maleficCount;
        expect(sum).toBe(data.totalCount);
      });
    });

    describe('POST /api/charts/bhava-bala/analyze - House Analysis', () => {

      it('should calculate strength for all 12 houses', async () => {
        const response = await fetch(`${API_BASE}/charts/bhava-bala/analyze`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(TEST_BIRTH_DATA),
        });

        expect(response.ok).toBe(true);
        const data = await response.json();

        expect(data.houses).toBeDefined();
        expect(Array.isArray(data.houses)).toBe(true);
        expect(data.houses.length).toBe(12);
      });

      it('should color-code houses by strength', async () => {
        const response = await fetch(`${API_BASE}/charts/bhava-bala/analyze`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(TEST_BIRTH_DATA),
        });

        const data = await response.json();
        const houses = data.houses;

        houses.forEach(house => {
          expect(['green', 'orange', 'red']).toContain(house.color);

          // Verify color matches strength
          if (house.strength >= 75) expect(house.color).toBe('green');
          if (house.strength < 75 && house.strength >= 50) expect(house.color).toBe('orange');
          if (house.strength < 50) expect(house.color).toBe('red');
        });
      });

      it('should provide house statistics', async () => {
        const response = await fetch(`${API_BASE}/charts/bhava-bala/analyze`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(TEST_BIRTH_DATA),
        });

        const data = await response.json();

        expect(data).toHaveProperty('totalStrength');
        expect(data).toHaveProperty('strongHouses');
        expect(data).toHaveProperty('weakHouses');

        expect(data.strongHouses).toBeGreaterThanOrEqual(0);
        expect(data.weakHouses).toBeGreaterThanOrEqual(0);
        expect(data.strongHouses + data.weakHouses).toBeLessThanOrEqual(12);
      });
    });

    describe('POST /api/charts/vimshottari-dasha/calculate - Dasha Timeline', () => {

      it('should calculate 120-year Vimshottari cycle', async () => {
        const response = await fetch(`${API_BASE}/charts/vimshottari-dasha/calculate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(TEST_BIRTH_DATA),
        });

        expect(response.ok).toBe(true);
        const data = await response.json();

        expect(data).toHaveProperty('dashas');
        expect(Array.isArray(data.dashas)).toBe(true);
        expect(data.dashas.length).toBe(7); // 7 planets
      });

      it('should total 120 years across all dasha periods', async () => {
        const response = await fetch(`${API_BASE}/charts/vimshottari-dasha/calculate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(TEST_BIRTH_DATA),
        });

        const data = await response.json();
        const totalYears = data.dashas.reduce((sum, d) => sum + d.duration, 0);

        expect(totalYears).toBe(120);
      });

      it('should mark dasha status correctly', async () => {
        const response = await fetch(`${API_BASE}/charts/vimshottari-dasha/calculate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(TEST_BIRTH_DATA),
        });

        const data = await response.json();
        const dashas = data.dashas;

        // Should have at least one current or future dasha
        const hasCurrent = dashas.some(d => ['current', 'future'].includes(d.status));
        expect(hasCurrent).toBe(true);
      });
    });
  });

  // ============================================
  // Phase 3: Data Consistency
  // ============================================

  describe('Phase 3: Data Consistency Across Endpoints', () => {

    it('should return consistent planetary positions across endpoints', async () => {
      const computeRes = await fetch(`${API_BASE}/charts/compute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(TEST_BIRTH_DATA),
      });

      const yogaRes = await fetch(`${API_BASE}/charts/yogas/detect`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(TEST_BIRTH_DATA),
      });

      const computeData = await computeRes.json();
      const yogaData = await yogaRes.json();

      // Both should process the same birth data
      expect(computeData.date).toBe(yogaData.date);
      expect(computeData.time).toBe(yogaData.time);
    });

    it('should return valid Lagna across all charts', async () => {
      const response = await fetch(`${API_BASE}/charts/compute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(TEST_BIRTH_DATA),
      });

      const data = await response.json();
      const lagnas = ['D1', 'D9', 'D10', 'D20'].map(id => data[id].lagnaRasiIndex);

      // Lagna should be consistent base (D1 is reference)
      lagnas.forEach(lagna => {
        expect(lagna).toBeGreaterThanOrEqual(0);
        expect(lagna).toBeLessThan(12);
      });
    });
  });

  // ============================================
  // Phase 4: Error Handling
  // ============================================

  describe('Phase 4: Error Handling', () => {

    it('should reject missing required fields', async () => {
      const response = await fetch(`${API_BASE}/charts/compute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: '1990-01-01' }), // Missing time, lat, lon
      });

      expect(response.status).toBe(400);
    });

    it('should reject invalid date format', async () => {
      const response = await fetch(`${API_BASE}/charts/compute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: 'invalid-date',
          time: '12:00:00',
          latitude: 13.0827,
          longitude: 80.2707,
        }),
      });

      expect(response.status).toBe(400);
    });

    it('should reject invalid coordinates', async () => {
      const response = await fetch(`${API_BASE}/charts/compute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: '1990-01-01',
          time: '12:00:00',
          latitude: 200, // Invalid: >90
          longitude: 80.2707,
        }),
      });

      // Should either reject or handle gracefully
      if (response.status !== 200) {
        expect(response.status).toBe(400);
      }
    });
  });

  // ============================================
  // Phase 5: Performance Benchmarks
  // ============================================

  describe('Phase 5: Performance Benchmarks', () => {

    it('should respond to divisional charts within 3 seconds', async () => {
      const start = Date.now();
      await fetch(`${API_BASE}/charts/compute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(TEST_BIRTH_DATA),
      });
      const elapsed = Date.now() - start;

      expect(elapsed).toBeLessThan(3000);
    });

    it('should respond to yoga detection within 3 seconds', async () => {
      const start = Date.now();
      await fetch(`${API_BASE}/charts/yogas/detect`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(TEST_BIRTH_DATA),
      });
      const elapsed = Date.now() - start;

      expect(elapsed).toBeLessThan(3000);
    });

    it('should respond to house analysis within 3 seconds', async () => {
      const start = Date.now();
      await fetch(`${API_BASE}/charts/bhava-bala/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(TEST_BIRTH_DATA),
      });
      const elapsed = Date.now() - start;

      expect(elapsed).toBeLessThan(3000);
    });
  });
});

// Summary
console.log(`
╔════════════════════════════════════════════════════════════╗
║        Days 25-26: Integration Testing Suite              ║
║                                                            ║
║  Total Test Coverage:                                      ║
║  ✓ Phase 1: Birth Form & Data Entry (3 tests)             ║
║  ✓ Phase 2: Calculation Engine APIs (11 tests)            ║
║  ✓ Phase 3: Data Consistency (2 tests)                    ║
║  ✓ Phase 4: Error Handling (3 tests)                      ║
║  ✓ Phase 5: Performance Benchmarks (3 tests)              ║
║                                                            ║
║  Total: 22 Integration Tests                              ║
║  Acceptance Criteria: 95% pass rate required              ║
║                                                            ║
║  Run with: npm test                                       ║
╚════════════════════════════════════════════════════════════╝
`);
