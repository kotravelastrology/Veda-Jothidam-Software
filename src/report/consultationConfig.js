/**
 * S13 — Consultation layer contact config (WORKFLOW-REGISTER-001 S13). Read
 * from env (`NEXT_PUBLIC_*` so the client-side booking flow can build
 * wa.me/upi:// links directly) rather than hardcoded, so the Owner can
 * change contact details or the fee without a code change. None of this is
 * a secret — a WhatsApp number, UPI VPA and price are meant to be publicly
 * visible to a prospective client, the same as a business card.
 */
function getConsultationConfig() {
  return {
    whatsappNumber: process.env.NEXT_PUBLIC_CONSULTATION_WHATSAPP || '',
    upiId: process.env.NEXT_PUBLIC_CONSULTATION_UPI_ID || '',
    upiPayeeName: process.env.NEXT_PUBLIC_CONSULTATION_UPI_NAME || 'Kotravel Vedic Astrology',
    feeInr: Number(process.env.NEXT_PUBLIC_CONSULTATION_FEE_INR) || 0,
  };
}

module.exports = { getConsultationConfig };
