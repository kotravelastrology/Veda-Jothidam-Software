const assert = require('node:assert/strict');
const { getConsultationConfig } = require('./src/report/consultationConfig');

// Missing env -> safe fallback defaults, never undefined/NaN.
delete process.env.NEXT_PUBLIC_CONSULTATION_WHATSAPP;
delete process.env.NEXT_PUBLIC_CONSULTATION_UPI_ID;
delete process.env.NEXT_PUBLIC_CONSULTATION_UPI_NAME;
delete process.env.NEXT_PUBLIC_CONSULTATION_FEE_INR;
const empty = getConsultationConfig();
assert.equal(empty.whatsappNumber, '');
assert.equal(empty.upiId, '');
assert.equal(empty.upiPayeeName, 'Kotravel Vedic Astrology');
assert.equal(empty.feeInr, 0);

// Configured env is read through as-is (fee coerced to a number).
process.env.NEXT_PUBLIC_CONSULTATION_WHATSAPP = '+919363947790';
process.env.NEXT_PUBLIC_CONSULTATION_UPI_ID = '9363947790@axisbank';
process.env.NEXT_PUBLIC_CONSULTATION_UPI_NAME = 'Kotravel Vedic Astrology';
process.env.NEXT_PUBLIC_CONSULTATION_FEE_INR = '1000';
const configured = getConsultationConfig();
assert.equal(configured.whatsappNumber, '+919363947790');
assert.equal(configured.upiId, '9363947790@axisbank');
assert.equal(configured.feeInr, 1000);
assert.equal(typeof configured.feeInr, 'number');

console.log(JSON.stringify({ pass: true, configured }, null, 2));
