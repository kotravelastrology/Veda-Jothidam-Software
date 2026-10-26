# Event charts (PL9 116-123)

Page `/events`, engine `src/report/eventChart.js`, test `test-event-chart.js`. Any date, time and place (an "event") is set against the birth
chart; up to twenty events per page. For each event:

- **The event chart**: planets by sign, the lagna, a South Indian chart, and the twelve houses counted from the event lagna and from the event
  Moon.
- **Kakshas over the birth Ashtakavarga** (by sign, `kakshyaTransit.js`): each planet's Kakshya, the Kakshya lord, whether that lord gave a bindu
  in the planet's own Ashtakavarga, that sign's bindus in the planet's Ashtakavarga and its Sarvashtakavarga.
- **Gochara facts**: Tara from the birth star to the event star, the event Moon's sign counted from the birth Moon and from the birth lagna,
  tithi, nakshatra, yoga and karana at the instant.
- **Dashas running at the event, from the birth chart**: Vimshottari to five levels, and Yogini, Ashtottari, Chara and Sthira (from the lagna) from
  the engines already built.
- **Vimshopaka of the event chart** (Shadvarga). Shadbala is not totalled because its Ayana Bala has no reconciled source; its parts are in
  the report's "Graha Bala" section.

Checked against PL9's screens for the audit chart (5 Oct 1990 04:30 Chennai) and the event 18 Sep 2026 07:59:35 Bengaluru (E391, E392, E396):
all seven Kakshya lines agree (kaksha lord, bindu, Ashtakavarga bindus, Sarvashtakavarga), Tara Janma, Chandra 9 from the birth Moon, tithi Shukla
Saptami, yoga Preeti, karana Vanija, Yogini lord Saturn, Ashtottari Moon, Chara (lagna) Scorpio, and Vimshopaka Sun 7.8 and Moon 11.8.

## Where it differs from PL9
- **Vimshottari fifth level.** PL9 prints Su-Ra-Ra-Ke-Ra; here the first four agree and the fifth (Prana) is Moon. The Prana lord depends on how the
  year is counted (PL9's year length is not known), so this is a disagreement of arithmetic that I have not resolved.
- **Sthira (lagna).** PL9 prints Capricorn; the engine (built from BPHS ch.? rules in `bphsRashiDashas.js`) gives Scorpio. Not resolved.
- **Glosses.** PL9's "Janma: Danger to body", "Preeti: Loved by all", "Vanija (cow)" and similar one-liners are not used: no source is held for them.
  Names and counts are given; the rules for Tara and Chandra bala with sources are on `/muhurta-stars`.
- Not built: PL9's other dasha rows at event (Shatabdika, Kalachakra), the Progression and Varshaphala event charts (121-123), and event saving.
