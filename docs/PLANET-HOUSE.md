# Planets in houses, book by book

Page `/planet-house`; engine `src/report/planetHouse.js`; data `fixtures/planet-house/saravali.json`; test `test-planet-house.js`.

Built from Saravali (Kalyana Varma, R. Santhanam translation), chapter 30 "Effects of Planets in Bhavas", verses 2-85, printed pp.473-534 (PDF page = printed - 361): Sun to Saturn in each of the twelve houses from the lagna, 84 cells. Rahu and Ketu are not in this chapter, so the page shows their house and says the book gives no reading.

- Only the verse itself is summarised in Tamil (our own words); the translator's long notes are not used.
- Page images were read for pp.473, 507, 508, 514, 522, 523; the rest from the text layer, whose verse numbers run 2-85 without gaps (the test checks this).
- Two places where the printed book is faulty are flagged on the page: Venus in the 7th (the English wording repeats the 6th-house verse; the Sanskrit and the notes speak of the wife) and Mars in the 2nd (the translation mixes the commentator's gloss into the verse).
- More books go into `BOOKS` in `planetHouse.js` as one fixture each, never merged. Candidates held: Brihat Jataka (Chidambaram 1905, Sastri), Phaladeepika (Sastri), Hora Sara, Jataka Parijata, BPHS, Chamatkara Chintamani, Bhrigu Sutras.
