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
- Questions and their houses, where the text names them: marriage (2, 7, 11), trunk-call (3, 9, 11, with three retrograde conditions on p.124), servant returning after cashing a cheque (2, 6, 11), drugs reaching
  an institution (4, 11), reaching a destination (4, 11; 3 for a journey), interview (3, 9, 11), building a house (4, 11, 12; 6 and 9 too for a ready-made house), competitive examination (4, 9, 11), lottery (2, 6, 11),
  reunion with husband (2, 7, 11), husband's return (11, 7, 6; separation 12, 7, 6), scholarship as loan (2, 6) or gift (2, 11), donation (2, 6, 11), overseas and foreign assignment (3, 9, 12), return of a missing
  person (2, 8, 11).

## What the page shows
The sub of the number, the twelve cusps with sign, star and sub lords, the planets of the time of judgment (retrograde marked), the ruling planets, and for a chosen question: the sub-lord of each of its cusps and the
houses it signifies, every planet that signifies the question's houses (and which of 6, 8, 12 it also signifies), and which ruling planets are among them. No answer is given.

## Not built
The book names houses for about a hundred and ten questions (printed pp.124-322); only those above are entered. The section on the twelve houses (pp.116-122), the time-of-event working from the ruling planets and the
ascendant's movement, and the judgement lists of each section are not. The author's other readers added to the corpus on 2026-10-26 (C64 Reader I, C65 Reader II, C66-C68 second scans of III, V, VI, C69 KP-Ezine, C70
Astro Secrets IV) are registered but not yet read for rules; Reader V (transit) is next.
