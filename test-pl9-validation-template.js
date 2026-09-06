/**
 * PL9 VALIDATION TEST TEMPLATE
 *
 * Instructions:
 * 1. Open PL9 and load chart (see PL9-VALIDATION-CHECKLIST.md)
 * 2. Extract Rasi positions and Ashtakavarga outputs
 * 3. Update this template with actual PL9 values
 * 4. Run: node test-pl9-validation-template.js
 * 5. Compare our output with PL9
 */

const assert = require('node:assert/strict');
const {
  calculateBhinnashtaka_Type1_Sun,
  calculateAshtakavargaReductions,
  calculateChanchChakra,
} = require('./src/chart/ashtakavargaVariations');

console.log('=== PL9 VALIDATION TESTS ===\n');

// ============================================================
// TEST CHART: Shillong, India - 2009-06-21, 12:00 PM
// From: Vinay Aditya - Practical Ashtakavarga, p.54-55
// ============================================================

console.log('[CHART DATA]');
console.log('Location: Shillong, India (25.57°N, 91.88°E)');
console.log('Date: 2009-06-21');
console.log('Time: 12:00:00 PM IST');
console.log('');

// STEP 1: Enter Rasi Positions from PL9
// ======================================
// Instructions: Open PL9 → Charts → Birth Chart I
// Copy all planet positions (convert to 0-11 indices)

const pl9RasiPositions = {
  // UPDATE THESE with actual PL9 values:
  // Sun in Gemini = 2, Moon in Libra = 6, etc.
  Sun: 2,        // REPLACE: Check PL9 "Birth Chart I"
  Moon: 6,       // REPLACE
  Mars: 0,       // REPLACE
  Mercury: 3,    // REPLACE
  Jupiter: 10,   // REPLACE
  Venus: 3,      // REPLACE
  Saturn: 5,     // REPLACE
  Lagna: 2,      // REPLACE
};

console.log('[STEP 1] Rasi Positions (from PL9):');
const rasiNames = ['Mesha', 'Vrishabha', 'Mithuna', 'Karkataka', 'Simha', 'Kanya',
  'Tula', 'Vrischika', 'Dhanu', 'Makara', 'Kumbha', 'Meena'];
for (const [planet, index] of Object.entries(pl9RasiPositions)) {
  console.log(`  ${planet}: ${rasiNames[index]} (${index})`);
}
console.log('');

// STEP 2: Compare Bhinnashtaka Type 1 (Sun's Chart)
// ==================================================
console.log('[STEP 2] VALIDATION: Bhinnashtaka Type 1 (Sun\'s Chart)');
console.log('-'.repeat(60));

// Get PL9 output from Reports → Calculations → Ashtakavarga - Bhinnashtaka #1
const pl9BhinnaType1 = [
  // REPLACE with actual PL9 values from screenshot:
  // Column: "Sun's Bhinnashtaka" → read each house total
  5, 4, 3, 6, 5, 4, 3, 5, 4, 6, 5, 4,  // Houses 1-12 (example values)
];

// Calculate our version
const ourBhinnaType1 = calculateBhinnashtaka_Type1_Sun(pl9RasiPositions);

console.log('PL9 Bhinnashtaka Total:', pl9BhinnaType1.reduce((a, b) => a + b, 0));
console.log('Our Bhinnashtaka Total:', ourBhinnaType1.reduce((a, b) => a + b, 0));
console.log('');

// Validate each house
let pl9TotalDiff = 0;
for (let i = 0; i < 12; i += 1) {
  const diff = Math.abs(ourBhinnaType1[i] - pl9BhinnaType1[i]);
  const status = diff <= 1 ? '✅' : '❌';
  if (diff > 0) {
    console.log(`  House ${i + 1}: PL9=${pl9BhinnaType1[i]}, Ours=${ourBhinnaType1[i]} ${status}`);
    pl9TotalDiff += diff;
  }
}

const pl9BhinnaValid = pl9TotalDiff <= 2;
console.log(`Result: ${pl9BhinnaValid ? '✅ PASS' : '❌ FAIL'} (Total difference: ${pl9TotalDiff})`);
console.log('');

// STEP 3: Compare Sarvashtakavarga & Chancha Chakra
// ==================================================
console.log('[STEP 3] VALIDATION: Chancha Chakra (House Grouping)');
console.log('-'.repeat(60));

// Get PL9 Sarvashtakavarga (total bindus per house)
const pl9SarvaAshtakavarga = [
  // REPLACE with actual PL9 values from:
  // Reports → Calculations → Ashtakavarga - Sarvashtaka & Chancha Chakra
  // Column: "Total" → read each house
  32, 28, 25, 30, 35, 29, 24, 31, 27, 26, 28, 29,  // Houses 1-12 (example)
];

// Calculate Chancha Chakra
const ourChakra = calculateChanchChakra(pl9SarvaAshtakavarga);

console.log('Sarvashtakavarga Totals (all 7 planets):');
console.log(`  Kendra (1,4,7,10):     PL9=${pl9SarvaAshtakavarga[0] + pl9SarvaAshtakavarga[3] + pl9SarvaAshtakavarga[6] + pl9SarvaAshtakavarga[9]}, Ours=${ourChakra.kendra}`);
console.log(`  Panapara (2,5,8,11):   PL9=${pl9SarvaAshtakavarga[1] + pl9SarvaAshtakavarga[4] + pl9SarvaAshtakavarga[7] + pl9SarvaAshtakavarga[10]}, Ours=${ourChakra.panapara}`);
console.log(`  Apoklima (3,6,9,12):   PL9=${pl9SarvaAshtakavarga[2] + pl9SarvaAshtakavarga[5] + pl9SarvaAshtakavarga[8] + pl9SarvaAshtakavarga[11]}, Ours=${ourChakra.apoklima}`);
console.log(`  Total:                 PL9=${pl9SarvaAshtakavarga.reduce((a, b) => a + b, 0)}, Ours=${ourChakra.total}`);
console.log('');

const pl9ChancharValid = ourChakra.total === pl9SarvaAshtakavarga.reduce((a, b) => a + b, 0);
console.log(`Result: ${pl9ChancharValid ? '✅ PASS' : '❌ FAIL'} (Mathematical - should match exactly)`);
console.log('');

// STEP 4: Reductions (Optional - requires dasha data from PL9)
// ============================================================
console.log('[STEP 4] VALIDATION: Ashtakavarga Reductions (OPTIONAL)');
console.log('-'.repeat(60));
console.log('Note: Requires current dasha lord info from PL9');
console.log('If you have this data:');
console.log('  1. Go to PL9 → Reports → Calculations → Ashtakavarga Reductions');
console.log('  2. Note the dasha lord (planet + position)');
console.log('  3. Note the reduction factor applied');
console.log('  4. We can validate the algorithm');
console.log('');

// FINAL REPORT
// ============================================================
console.log('=== VALIDATION SUMMARY ===');
const passCount = [pl9BhinnaValid, pl9ChancharValid].filter(Boolean).length;
const totalTests = 2;
console.log(`✅ Passed: ${passCount}/${totalTests}`);

if (passCount === totalTests) {
  console.log('\n🎉 ALL VALIDATIONS PASSED - READY FOR TRACK B (UI LAYER)');
} else {
  console.log('\n⚠️  SOME VALIDATIONS FAILED - REVIEW DIFFERENCES ABOVE');
}

console.log('\n=== NEXT STEP ===');
console.log('1. If all pass: Proceed to Track B (UI Display Layer)');
console.log('2. If any fail: Review algorithm against Vinay Aditya book pages noted in source');
console.log('3. Update algorithm if needed, re-run test');
console.log('');

