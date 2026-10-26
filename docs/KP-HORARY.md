# KP horary (`/kp-horary`)

Source: K.S. Krishnamurti, *Horary Astrology: Krishnamurti Padhdhati, Advanced Stellar System* (Reader VI; corpus C34, second scan C68). Printed page = PDF - 19 up to about PDF 190,
then PDF - 21 (read from the page number printed on each page). Engine `src/report/kpHorary.js`, questions `src/report/kpHoraryTopics.js`, page `app/kp-horary`, test `test-kp-horary.js`.

## What the book says (read)
- The querist gives a number 1-249; "every number refers to a particular sign, star and sub as the Ascendant. One has to take only the commencing position of the sub as Ascendant" (printed p.88).
- "We must take only the time of judgment" (p.87), not the time of the urge, the posting or the receipt; standard time is used as it is (p.88): the number fixes the ascendant, so no local mean time or
  sidereal time is needed for it. "Having this as Ascendant, one is to calculate the other 11 cusps for the latitude of the place of judgment" (p.88). Implemented by finding the instant at which that
  ascendant rises at the place and taking the Placidus cusps of that instant (Krishnamurti ayanamsha); the planets are those of the time of judgment.
- The table of the 249 subs (printed pp.89-106): sign lord, star lord, sub lord, from and to. Computed here (243 subs of the 27 stars, three of them cut at a sign boundary = 249) and compared with the book:
  rows 10-41 on the page image, and the text layer for the rest (207 of 243 numbers equal; the others are OCR slips such as 25.63.20 for 25.53.20).
- Ruling planets (printed p.123): the day lord, the lord of the star and of the sign the Moon is in, the lord of the star and the sign of the ascendant; Rahu and Kethu stand for the lord of the sign they
  are in and are counted when that lord is ruling; "those deposited in the constellation of a retrograde planet should be rejected" (marked, not removed).
- Questions and their houses, where the text names them: 74 of the book's about 110 (`kpHoraryTopics.js` for the first 17, `kpHoraryMore.js` for the rest), each with the printed page the page itself shows and my Tamil rendering of the reason the book gives.
  Where the text states a condition, it is kept as a rule: the sub-lord of a cusp (or the lord of the star it stands in) signifies all of, or one of, a list of houses (the book's "and" read as both, "or" as either), with the direct-motion and badhaka/maraka
  conditions where the text has them: love affairs (5th cusp), invalid child, partner in business (8th), actor, treasure, dowry, buying him, lottery (11th), going abroad (12th), partnership (7th), suicide and murder (8th and 1st with the badhaka or maraka),
  reinstatement (10th), income-tax prosecution (10th), the good times to buy, sell, enter service, sign an agreement, engage a servant (2nd, 12th, 6th, 3rd and 7th, 1st) and promotion on probation (6th). The rules say that the condition holds; the page gives no answer.

## What the page shows
The sub of the number, the twelve cusps with sign, star and sub lords, the planets of the time of judgment (retrograde marked), the ruling planets, and for a chosen question: the sub-lord of each of its cusps and the
houses it signifies, every planet that signifies the question's houses (and which of 6, 8, 12 it also signifies), and which ruling planets are among them. No answer is given.

## Not built
The questions whose houses are worked through derived houses (those counted from a relative's lagna, such as a third son's house, the father's whereabouts, a will from an uncle, relatives' luck, adoption, change of job, politician, seniority, cure, which gem) are not entered; the ruling-planet examples of printed pp.123-142 (friend's arrival, parcels, the train, birth time) and the long-life and eclipsed-planet chapters are not either. The section on the twelve houses (pp.116-122), the time-of-event working from the ruling planets and the
ascendant's movement, and the judgement lists of each section are not. The author's other readers added to the corpus on 2026-10-26 (C64 Reader I, C65 Reader II, C66-C68 second scans of III, V, VI, C69 KP-Ezine, C70
Astro Secrets IV) are registered but not yet read for rules; Reader V (transit) is next.
