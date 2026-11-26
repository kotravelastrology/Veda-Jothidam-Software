# S1-F BPHS Source Verification — Varga, Dasha, Shadbala

Status: VERIFIED SOURCE CANDIDATE (metadata and printed-page visual check complete; source admission and calculator implementation remain separately authorized steps).

## Selected exact copy

- Title: *Brihat Parashara Hora Shastra* (BPHS), R. Santhanam translation
- Exact copy: `D:\AstrologicLab-Corpus\astrologiclab-sources\C23_BPHS_Santhanam.pdf`
- File size: 7,167,915 bytes
- PDF pages: 855
- Language/script: Sanskrit (Devanagari, verse) with English translation and commentary notes, per verse
- Tradition/convention: the foundational classical Parashari text — matches PLAN-001's V1 scope ("Vedic/Parashari and Phaladeepika-oriented") directly, as the primary source rather than a secondary/modern compilation.
- Reproduction status: not yet assessed; product must expose citation/restriction only until permission is recorded.

## Printed-page loci visually confirmed

- **Varga — Chapter 6, "The Sixteen Divisions of a Sign"** (file page 53, printed page 43): Sanskrit verses 1–6 with translation naming all 16 vargas (Rashi, Hora, Drekkana, Chathurthamsa, Sapthamamsa, Navamsha, Dashamamsha, Shodashamsa, Vimsamsa, Chaturvimsamsa, Sapthavimsamsa, Trimsamsa, Khavedamsa, Akshavedamsa, Shashtiamsa) and the Hora-lordship rule (verses 5–6).
- **Shadbala — Chapter 27, "Evaluation of Strengths"** (file page 238, printed page 228): worked Shad-bala Pinda minimum-requirement table by planet group (A/B/C), with Sthaanabala, Digbala, Kaalabala, Cheshtabala, Ayanabala component values in Virupas, plus Sanskrit verses 34–36 with translation.
- **Dasha — Chapter 46, "Dasha (Periods) of Planets"** (file page 407, printed page 400): opening verses 1–5 naming Vimshottari as "most appropriate for the general populace" among ~20 named dasha systems (Ashtottari, Shodashottari, Panchottari, Sutabdika, Chaturashitisama, Dwisaptatisama, Shastihayani, Shatvimsasama, Kalachakra, Chara, Sthira, Kendra, and others) — table-of-contents cross-check at file page 400 lists the full chapter run (Dasha effects, Antardasha per planet) through printed page ~504+.
- **Cross-reference note (not an S1-D change):** BPHS also contains its own Ashtakavarga chapters — Ch. 66 "Ashtaka Varga" (file page 690), Ch. 67 "Trikona Shodhana" (file page 712), Ch. 68 "Ekadhipatya Shodhana" (file page 719), Ch. 69 "Pinda Sadhana" (file page 721). S1-D's selection of *Practical Ashtakavarga* (Vinay Aditya) as the worked-table convention stands as registered; this note is recorded so a future stage can compare the two conventions explicitly rather than silently blend them.

The page images were rendered directly from the exact PDF (local PDF library render, consistent with the method recorded in S1-E) and visually inspected at the three loci above. This record is discovery/verification evidence only; no calculation rule is admitted into software until the source-record gate records permission/restriction and a selected convention, per PLAN-001 and WORKFLOW-REGISTER-001.

## Safe implementation implications

1. Vimshottari Dasha/Bhukti/Antara/Sookshma/Prana calculations should cite BPHS Ch. 46 as the primary-source convention; the ~19 other named dasha systems in this same chapter remain separately identified, not silently offered as equivalent defaults.
2. Varga chart generation (D-1 through D-60) should cite BPHS Ch. 6 for the 16-varga definitions; any varga-specific significations shown to the user must trace to their own verified chapter/page, not a generic modern summary.
3. Shadbala output must show the per-component Virupa breakdown (Sthaanabala, Digbala, Kaalabala, Cheshtabala, Ayanabala, Naisargikabala) and the group-A/B/C minimum-requirement table from Ch. 27, not a single collapsed score.
4. Where a value or rule is not yet page-verified for a specific sub-case (e.g., a particular varga's deity/significations, or a specific dasha's sub-period boundary formula), the product must show `ஆதாரம் தேவை / SOURCE REQUIRED` rather than a generic astrological narrative.
5. This record does not authorize software changes, source-data admission, commit or push.

## Next workflow position

S1-F is complete for Varga, Dasha and Shadbala primary-source candidates. Source-verification coverage for the registered V1 sequence now stands at: Panchangam (S1-B), Ashtakavarga (S1-D), Muhurtham (S1-E), Varga/Dasha/Shadbala (S1-F). Remaining before S1 can be declared complete: Yoga/Dosha reference rules and Varshaphala/Tajika (PLAN-001 items 11–12) — both may also be checked against this same BPHS copy (it contains dedicated Yoga chapters) before opening new source files. After that, prepare the frozen S2 shared time/chart-identity contract for Programme Owner approval, per PLAN-001's stage-gate rule (source check → implementation → tests → full suite → lint/build → desktop/mobile → backup → stage record).
