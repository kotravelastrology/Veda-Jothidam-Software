# S13 — Consultation Layer

Status: IMPLEMENTED AND VERIFIED IN-BROWSER (WhatsApp request → UPI payment link → calendar reminder, all user-initiated). Working tree only — no commit/push/backup (no git repository yet, unchanged since S2/S6-S12).

## Scope clarification (asked before building, not assumed)

WORKFLOW-REGISTER-001 registers S13 narrowly: "explicit request → reading request → direct Owner phone first; no automatic remedy or unsolicited contact." The Owner's first description of what they wanted was considerably larger — a WhatsApp booking bot, in-chat payment collection, and a fully automatic phone call placed by the system at the appointment time. Rather than either building the narrow registered version and ignoring the real ask, or building unverified payment/telephony infrastructure on assumptions, this was raised back to the Owner directly, since it involves real money and real infrastructure choices:

- **Payment method** — chose **UPI link** (no gateway account, no fees, but no automatic payment verification — confirmation is manual, via a screenshot sent over WhatsApp) over a payment gateway (Razorpay/Instamojo: automatic verification, but needs KYC/account setup and ~2% fees).
- **"Automatic call"** — chose **a WhatsApp reminder to both parties** (achievable without new infrastructure) over a real system-triggered phone call (would need a Twilio-style telephony account and per-minute cost).
- **Contact details** — the Owner's own WhatsApp/phone number, UPI ID and consultation fee were requested directly rather than invented, since a wrong UPI ID would misdirect real money and a placeholder phone number would make the feature non-functional.

## What "automatic call" actually reduces to, and the one honest remaining gap

Even the simplified "WhatsApp reminder to both parties" requires the **system itself** to send a message at a future, unattended moment — that needs the WhatsApp Business API (Meta Business verification, an approved message template, a paid Business Solution Provider), which is not set up and wasn't part of what was authorized this session. Building it anyway on a guess would mean shipping something that either doesn't work or silently fails to notify a paying client at their appointment time — worse than not having it. Instead, this stage implements the same practical outcome using infrastructure that already reliably exists on every phone: an **.ics calendar file** download, which both the client and (once they add the appointment manually) the Owner can add to their own calendar, giving each side their own OS-level reminder with no server-side scheduler needed. This substitution, and the fact that true automatic WhatsApp messaging still needs WhatsApp Business API, is stated directly in the booking page's own UI text — not hidden.

## Implementation

- `.gitignore` (new) — standard Next.js ignores, including `.env*.local`, since this project is about to hold real contact/payment identifiers and has no git repository yet to have protected them until now.
- `.env.local` (new, not committed) — `NEXT_PUBLIC_CONSULTATION_WHATSAPP`, `NEXT_PUBLIC_CONSULTATION_UPI_ID`, `NEXT_PUBLIC_CONSULTATION_UPI_NAME`, `NEXT_PUBLIC_CONSULTATION_FEE_INR` — the `NEXT_PUBLIC_` prefix is required for Next.js to expose them to the client-side code that builds the `wa.me`/`upi://` links; none of these values are secret in the way a password is — a WhatsApp number, UPI VPA and price are meant to be publicly visible to a prospective client, same as a business card.
- `src/report/consultationConfig.js` — `getConsultationConfig()` reads those env vars with safe fallback defaults (never `undefined`/`NaN`).
- `app/consultation/page.tsx` + `app/consultation/ConsultationFlow.tsx` — the booking page: an intake form (name, phone, preferred date/time, optional topic) feeding three explicitly separate, user-clicked steps — (1) a `wa.me` link opening WhatsApp with a pre-composed Tamil message including the entered details, (2) a `upi://pay` link pre-filled with the Owner's UPI ID and the ₹1000 fee (with the raw UPI ID also shown as text, since `upi://` links only resolve on a phone with a UPI app — a desktop visitor needs the ID to pay manually), (3) an `.ics` calendar download built client-side from the chosen date/time. Nothing here is sent or triggered by the server — every step requires the user's own click, matching the register's "no automatic... unsolicited contact" rule directly, not just in spirit.
- `app/report/ReportBuilder.tsx` — added a "தனிப்பட்ட ஆலோசனை வேண்டுமா?" (Want a personal consultation?) link to `/consultation`, appearing alongside the print button once a report is computed, marked `print:hidden` so it doesn't appear in a printed/exported report.

## Tests

- `test-consultation-config.js` (new): missing env → safe string/number fallbacks, never `undefined`/`NaN`; configured env is read through correctly with the fee coerced to a number.
- Full suite: `npm test` → all 14 scripts pass (13 pre-existing + this stage's new test).
- **In-browser verification**: filled the intake form with real values and confirmed the generated `wa.me` URL (`https://wa.me/919363947790?text=...`) contains the correct number and a correctly URL-encoded Tamil message with the entered name and time; confirmed the generated `upi://pay` URL contains the exact configured UPI ID, payee name and ₹1000 amount; confirmed the calendar-download button enables only once a date and time are chosen; confirmed the new consultation CTA link on `/report` renders with the correct `href="/consultation"` after computing a report. Zero console errors across all checks.

## TypeScript/lint/build

- `npm run build` → compiles, prerenders all three routes (`/`, `/report`, `/consultation`), TypeScript check passes.
- `npm run lint` → still fails on the pre-existing `eslint-config-next`/`eslint-plugin-react` FlatCompat incompatibility recorded in S6; unrelated to and unchanged by S13.

## Desktop/mobile validation

Desktop verified live in-browser as described above (screenshots, link-href inspection, zero console errors). Mobile viewport not separately re-checked this stage (the booking page reuses the same responsive card/form patterns already validated at 375×812 in S5/S12).

## Backup

Not performed — still no git repository (unchanged since S2/S6-S12). `.env.local` is now excluded from any future commit via the new `.gitignore`.

## Next workflow position

S13 gives a working, fully user-initiated consultation request flow. Two things are explicitly the Owner's own follow-up, not blocked on more of my work: (1) manually confirming each booking after receiving the WhatsApp message + payment screenshot (by design — this stage deliberately keeps a human in the loop rather than auto-confirming payment it cannot verify), and (2) deciding whether to invest in WhatsApp Business API access later if true automatic reminders become worth the setup cost. S14 — Capacity expansion (queue and verified additional astrologers, only after a separate future authorization) is the next registered stage, and explicitly requires that separate authorization before any implementation — per WORKFLOW-REGISTER-001, this should not be started without the Owner raising it directly.
