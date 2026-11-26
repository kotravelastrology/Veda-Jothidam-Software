# S4 — Vakya Panchangam Source Verification and Scope Finding

Status: SOURCE VERIFIED; NUMERIC IMPLEMENTATION NOT YET SAFE TO ATTEMPT — this record documents a genuine, deeper-than-expected finding and recommends how S4 should actually proceed. No calculation code was written for this stage; writing an unverified one would violate PLAN-001's non-negotiable rule against reconstructing rules that are not fully source-confirmed.

## Selected exact copy

- Title: *Vākyakaraṇa*, with the commentary *Laghuprakāśikā* by Sundararāja
- Critical edition by: T. S. Kuppanna Sastri and K. V. Sarma
- Publisher: Kuppuswami Sastri Research Institute, Mylapore, Madras-4, 1962
- Exact copy: `D:\AstrologicLab-Corpus\astrologiclab-sources\C14-vakya-karana-kuppanna-sastri-sarma.pdf`
- File size: 11,159,128 bytes; PDF pages: 339
- Language/script: Sanskrit (Devanagari, verse + prose commentary) with an English critical Introduction, English Translation and Notes; **this file is a scanned reproduction with no text layer** — every page cited below was visually rendered and read as an image, not text-searched.
- Tradition/convention: Vākya — the traditional table/mnemonic-based astronomical method distinct from Tirukanita (astronomical/Drik-style) computation, per the convention rule already registered in S1-SOURCE-DISCOVERY-001.

## Structure confirmed (file page 9, Contents)

Preface; Introduction (pp. i–xxxii); Vakyakarana text (pp. 1–120, in 5 chapters, with a 6th chapter the commentator himself rejects as a later interpolation); Appendix I "Ch. VI added to the Text"; **Appendix II "Candra-Vākyāni"** (Moon vakyas, pp. 125–249); Appendix III "Kujādi-Pañcagraha-Mahāvākyāni" (Mars-etc. vakyas); English Translation and Notes; Index of Vakyas; Index of Authorities Cited; Errata.

## Printed-page loci visually confirmed

- **File page 3** (title page): identity confirmed as above.
- **File page 17** ("THE WORK", printed p. x): the work follows the *Mahābhāskarīya* of Bhāskara I and the method of Haridatta; explicitly states its own accuracy limits — vakyas are given only to the nearest minute, and interpolation between them is imprecise by design, because "ease of computation is the aim."
- **File page 20** (printed p. xiii) — **the epoch**: "The epoch is the mean sun-rise at Ujjain-meridian on the first day of the first mean-solar year after Kali, and the day is a Friday. The length of the mean solar year is 365-15-31-15 days etc." The equation-of-centre model has a fixed higher-apsis (apogee) longitude of 78° for the Sun.
- **File page 22** (printed p. xv) — **the location-correction rule**: grahas (Sun, Moon, planets) are tabulated for mean sunrise at Ujjain for a whole Kalidina (Kali-day) count. Converting to any other locality's true sunrise requires three corrections — *carārdha* (half the day-length difference from 30 nāḍis, itself from `sin h = tan(φ)·tan(δ)`), *deśāntara* (longitude difference), and *bhujāntara* (equation-of-time-like correction); *udayāntara* (a fourth correction) is explicitly neglected by this school.
- **File page 164** (printed p. 127) — a sample of the actual **Chandravakya table** (Appendix II, "Days 52–79"): one row per day, each giving the Sanskrit mnemonic vakya *and* its already-decoded numeric value as rāśi / degree / minute (e.g. day 52 → rāśi 10, 28°, 26′). The critical edition's editors did the katapayadi decoding themselves — a future implementation would transcribe these decoded numeric columns, not re-derive katapayadi from the Sanskrit.
- **File page 251** — a further vakya table (Appendix III, Mahāvākyas for a slower body, "Days 246–374") in the same day / vakya / rāśi° / minute format, plus a "Samskāra-varṇa" (correction-syllable) column not present in the Chandravakya table.

## Why this stage stops at verification, not implementation

This is a materially larger undertaking than S1-B/S1-E's Panchangam/Muhurtham rules or S1-F/S1-G's BPHS chapters, which each supplied a self-contained rule this project could directly encode. A correct Vakya calculator additionally needs, all from this same source and not yet each individually re-derived and cross-checked:

1. Kali-Ahargana (elapsed-day count) computation from a Gregorian date, using the exact epoch and mean-year length above.
2. Digitizing the Chandravakya table itself — Appendix II runs pp. 125–249, roughly 125 pages of day-indexed rāśi/degree/minute rows — as real reference data, not a formula.
3. The Sun's own mean-plus-equation-of-centre method for this specific school (apogee 78°, its own maximum equation value), separate from the Moon vakyas and separate from the Swiss-Ephemeris Sun already used for Tirukanita — these must never be blended per the registered convention rule.
4. The three named locality corrections (carārdha/deśāntara/bhujāntara), each its own classical formula.
5. Independent cross-verification (as was done for S3 against drikpanchang.com) — but Vakya-mode public panchangam sites are far rarer than Drik-mode ones, so this may require a different validation strategy (e.g. checking against the book's own worked examples, if any exist further in the Translation and Notes section, which has not yet been read).

Attempting steps 1–4 from a same-session reading of a scanned 1962 critical edition, without a worked-example cross-check, would risk exactly the "silently reconstructed rule" PLAN-001 prohibits — and an incorrect Vakya panchangam is not a cosmetic bug, it would misinform real religious/muhurtham timing.

## Recommendation for how the registered sequence should proceed

PLAN-001's "first implementation boundary" states the first batch "must expose both Tirukanita and Vakya modes." Given the finding above, this record recommends: ship S5 (daily Panchangam/Muhurtham UI) with Tirukanita fully live (S3) and Vakya mode visibly present but returning the registered `SOURCE_REQUIRED` state (`ஆதாரம் தேவை / Vakya calculation not yet admitted`) rather than either blocking S5 entirely or shipping an unverified Vakya calculation. Full Vakya numeric implementation should become its own dedicated multi-step sub-plan (Ahargana → Chandravakya data entry → Sun method → locality corrections → cross-check), attempted with more time than a single continue-turn allows.

## Next workflow position

Two options are both consistent with PLAN-001 and are offered here rather than decided unilaterally: (a) proceed to S5 now with Vakya marked `SOURCE_REQUIRED`, continuing the registered sequence; or (b) dedicate focused follow-up specifically to digitizing Appendix II and building the Ahargana/Sun/locality-correction chain before touching S5. Absent a preference, this workstream will proceed with (a), since it keeps the registered sequence moving without fabricating the Vakya rule.
