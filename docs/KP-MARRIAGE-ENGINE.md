# KP marriage, divorce and children engine (C32)

Engine: `src/report/kpMarriage.js` (`evaluateKpMarriage(kp)`), test `test-kp-marriage.js`, report section "KP திருமணம் · பிரிவு · குழந்தை விதிகள்"
(`report.kpMarriage`). Source: K.S. Krishnamurti, Reader IV "Marriage and Married Life" (C32), read from the page images; every rule carries its
printed page. Reading notes: `docs/KP-MARRIAGE-C32-NOTES.md`.

The engine reports HELD, NOT_HELD or INFO per rule, with the planets and houses behind it. It gives no verdict and no date. Where the
book says "will", the engine says the condition holds.

"Signifies" uses the book's own four levels (printed pp.110, 118, 187): a planet in the star of an occupant of the house, an occupant, a
planet in the star of the owner, the owner. This is `kpHouseSignificators.js`.

## Rules built
Marriage: promise (7th sub-lord signifies 2, 7 or 11, pp.106, 121); denial (7th sub-lord linked with 4, 6, 10, p.106); second marriage
(7th sub-lord or its star lord is Mercury or in a dual sign, p.181; and the 6th-cusp wording as printed on p.182, flagged as a printed
contradiction); Punarphoo (Saturn and Moon in each other's star with the own-sub condition, Saturn in 1, 3, 6, 7, 10, p.78); Saturn
connected with 2, 7, 11 (delay, p.107); happy married life (7th sub-lord Jupiter or Venus signifying 2 or 11, p.80); career-woman wife
(4th sub-lord signifies 4, 8, 12, p.98); age difference by the 7th cusp lords (p.84).

Separation: significators of 2, 7, 11 that also signify 1, 6, 10, 12 (pp.191-192); significators of 7 that also signify 6 and 9 (p.192);
significators of 1, 5, 7, 11 for reunion (p.192).

Children: Jupiter signifies 2, 5, 11 (p.210); for the 11th cusp (male, judged first) and the 5th: the sub-lord signifies 2, 5, 11; the sub-lord
signifies the "12 to" or "8 to" house, or Kethu is the sub-lord or its star lord; the sub-lord stands in a barren sign (Aries, Leo, Gemini,
Virgo; pp.212, 224); first issue (Saturn, Rahu or Kethu in the ascendant whose sub-lord occupies or owns 1, 4 or 10, p.242).

Other: ascendant sub-lord and the life it describes (pp.247-249); gem by the 1st and 11th sub-lords unless linked with 6, 8, 12 (p.279-280).

Periods: for each running dasa, bhukti, antara and sookshma lord, which houses of marriage (2, 7, 11), children (2, 5, 11) or separation
(1, 6, 10, 12) it signifies. The book says an event comes in the conjoined periods of the significators (pp.107, 195); the engine shows
the connection and does not name a date.

## Choices I made, to check
- The book's "12 to 5", "8 to 5", "12 to 11", "8 to 11" are read as house numbers: 4, 12, 10, 6. The rule is flagged `derivedShorthand`.
- "Abortive planet" is taken as Kethu only (the book names Kethu; Saturn and Rahu appear as retrograde obstructers in places but are not
  listed as abortive).
- The two-marriage rule is evaluated for the 7th cusp (p.181) and, as printed, for the 6th (p.182).
- Rahu and Kethu keep their own positions; the book's agent rule (p.121) is not applied.

## Not built, and why
Conjunction and aspect conditions (the book says "Western aspects", gives no orb), the agent rule for the nodes, the child's sex
(p.211: "no rule applicable in all cases"), the Mars dosha (see `mangalaDosha.js`), the "Love and Life" sign texts, the Kerala Santana tithi bands (p.220, which overlap as printed), the
quick horary rules by number (pp.44-46), and the doctrines the author rejects (dasa sandhi, eka-dasa, karako bhava nasaya).

## Partner description (printed 86-97), built
`src/report/kpPartnerDescription.js` with the 84 paragraphs in `src/report/kpPartnerTables.js` (seven planets x twelve signs, as printed, with a Tamil rendering; test `test-kp-partner.js`). The book's "best and most correct method": the sub-lord of the 7th cusp (the 2nd for a second marriage), the sign it occupies, and that planet's paragraph for that sign. Two readings are shown because the book words it two ways: the sub-lord itself in its own sign, and the lord of the constellation the sub-lord stands in (the Mars heading: "if the sublord is in the constellations of Mars which is in") in the sign that planet occupies, plus that star lord's paragraph for the sub-lord's sign where the signs differ. Rahu and Kethu (printed 97): the paragraph of the conjoined planet; with none conjoined the aspecting planet, which is not computed (no orb), and the star lord of the node last. No verdict. Appears in the KP marriage section of the report.
