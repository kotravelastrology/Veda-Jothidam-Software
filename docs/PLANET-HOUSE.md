# Planets in houses, book by book

Page `/planet-house`; engine `src/report/planetHouse.js`; data `fixtures/planet-house/saravali.json`; test `test-planet-house.js`.

Built from Saravali (Kalyana Varma, R. Santhanam translation), chapter 30 "Effects of Planets in Bhavas", verses 2-85, printed pp.473-534 (PDF page = printed - 361): Sun to Saturn in each of the twelve houses from the lagna, 84 cells. Rahu and Ketu are not in this chapter, so the page shows their house and says the book gives no reading.

- Only the verse itself is summarised in Tamil (our own words); the translator's long notes are not used.
- Page images were read for pp.473, 507, 508, 514, 522, 523; the rest from the text layer, whose verse numbers run 2-85 without gaps (the test checks this).
- Two places where the printed book is faulty are flagged on the page: Venus in the 7th (the English wording repeats the 6th-house verse; the Sanskrit and the notes speak of the wife) and Mars in the 2nd (the translation mixes the commentator's gloss into the verse).
- More books go into `BOOKS` in `planetHouse.js` as one fixture each, never merged. Candidates held: Brihat Jataka (Chidambaram 1905, Sastri), Phaladeepika (Sastri), Hora Sara, Jataka Parijata, BPHS, Chamatkara Chintamani, Bhrigu Sutras.

Brihat Jataka (Varahamihira, P.S. Sastri 2007), chapter 20 "Planets in Houses", verses 1-9, printed pp.152-155 (PDF page = printed - 1; page images read for pp.152-155). The book is terse: Mars, Mercury, Venus and Saturn say "the rest as for the Sun / Jupiter", stored as `sameAs` and resolved on the page with a note. Saturn in houses 2-12 is taken as "like the Sun" from the Sanskrit (anyatra); the English line is garbled ("signs other than 7, 9, 11, 12") and the cell says so.

Bhavesh (house lords) - `fixtures/bhavesh/bphs-24.json`, `src/report/bhaveshHouse.js`, `test-bhavesh-house.js`, shown as a second section of `/planet-house`:
BPHS (Santhanam) chapter 24 "Effects of the Bhava Lords", verses 1-144, printed pp.189-235 (PDF page = printed page): each house lord in each of the twelve houses; verse = (lord - 1) x 12 + house. Verse text summarised in Tamil, notes not used; three of the 144 verses were missing from the text layer's numbering and were found by search (2nd lord in 7th, 11th in 3rd, and others); pages 204 and 229 were read from the scan images. Scorpio's lord is Mars and Aquarius's Saturn, as in the book.
