/**
 * AYANA BALA FORMULA VERIFICATION
 *
 * This script verifies the correct Ayana Bala formula by testing against
 * the printed BPHS table (Chapter 27, verses 15-17, Speculum of Ayana Bala).
 *
 * BPHS Text Analysis (C23_BPHS_Santhanam_djvu.txt lines 18920-18924):
 * - Translator's formula (Notes): "Ayana Bala = ((23°27' + Kranti) X 60) ÷ 46° 54'"
 * - Simplified form: "Ayana Bala = (23°27' ± Kranti) × 1.2793"
 *
 * PROBLEM: This formula DOES NOT match the printed Speculum table
 *
 * SOLUTION (S10-G PDF visual inspection):
 * - The "+23°27'" appears as a TWO-LINE column header annotation
 * - Line 1: "Kranti | Ayana Bala"
 * - Line 2: "23°27' |" (showing the column's maximum possible value = Earth's obliquity)
 * - This is NOT an operand in the formula, just a header showing the range (0 to +23°27')
 *
 * VERIFIED FORMULA: Ayana Bala = Kranti × 60/46°54' = Kranti × 1.2793
 * (NO +23°27' term)
 *
 * Table verification points (from S10-G and BPHS Speculum):
 */

const BPHS_SPECULUM = [
  { kranti: 0.7833, expected: 1.00, note: "0°47'" },
  { kranti: 1.5667, expected: 2.00, note: "1°34'" },
  { kranti: 2.35, expected: 3.00, note: "2°21'" },
  { kranti: 5.1667, expected: 6.60, note: "5°10'" },
  { kranti: 7.5, expected: 9.60, note: "7°30'" },
];

const FACTOR = 60 / 46.9; // 46°54' = 46.9 degrees

console.log("=== AYANA BALA FORMULA VERIFICATION ===\n");
console.log("Testing formula: Ayana Bala = Kranti × (60/46°54')\n");

let allPass = true;
BPHS_SPECULUM.forEach(point => {
  const calculated = point.kranti * FACTOR;
  const tolerance = 0.01;
  const pass = Math.abs(calculated - point.expected) < tolerance;

  console.log(`Kranti ${point.note}:`);
  console.log(`  Expected:  ${point.expected}`);
  console.log(`  Calculated: ${calculated.toFixed(2)}`);
  console.log(`  Match: ${pass ? "✓ YES" : "✗ NO"}`);
  console.log();

  if (!pass) allPass = false;
});

console.log(`\nFormula Verification: ${allPass ? "✓ PASSED ALL POINTS" : "✗ FAILED"}`);

// Test the wrong formula with +23°27'
console.log("\n=== WRONG FORMULA (with +23°27' term) ===\n");
console.log("Testing formula: Ayana Bala = (23.45 + Kranti) × 1.2793\n");

let wrongPass = true;
BPHS_SPECULUM.forEach(point => {
  const calculated = (23.45 + point.kranti) * FACTOR;
  const tolerance = 0.01;
  const pass = Math.abs(calculated - point.expected) < tolerance;

  console.log(`Kranti ${point.note}:`);
  console.log(`  Expected:  ${point.expected}`);
  console.log(`  Calculated: ${calculated.toFixed(2)}`);
  console.log(`  Match: ${pass ? "✓ YES" : "✗ NO"}`);
  console.log();

  if (!pass) wrongPass = false;
});

console.log(`\nWrong Formula Verification: ${wrongPass ? "✗ ALSO PASSES (ERROR!)" : "✓ FAILS (CORRECT)"}`);

console.log("\n=== CONCLUSION ===");
console.log("The correct formula is: Ayana Bala = Kranti × 60/46°54'");
console.log("The '+23°27' is a column header, NOT a formula operand.");
console.log("\nThis is the formula used in S10-G and verified by visual PDF inspection");
console.log("against the printed BPHS table (file p.218-219, printed p.218-219).");
