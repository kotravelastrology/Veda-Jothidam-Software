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
- **Vimshottari fifth level — resolved.** PL9's overview row is date-only (it counts from the start of the day), so its fifth level can differ; PL9's own
  "New Event Gochara data" panel at the event time gives Sun-Rahu-Rahu-Ketu-Moon, which is what the engine gives (checked in `test-event-chart.js`).
  PL9's time for its overview "Ra" was not identified.
- **Sthira (lagna) — two readings shown.** Santhanam's BPHS translation (Brahma by direction) gives Scorpio; Rath's Jaimini Upadesa Sutras 2.1.46-54, 2.3.3-4
  (Saturn, Rahu, Ketu replaced by Mars, Mercury, Jupiter) gives Capricorn, which is PL9's main period (`src/dasha/jaiminiSthira.js`, `test-jaimini-sthira.js`).
  The direction after Brahma's sign is not stated in Rath's sutras; the BPHS rule is used. PL9's sub-levels (e.g. Cp-Aq-Aq-Sc-Cp) are not reproduced; only the main level is claimed.
- **Glosses.** PL9's "Janma: Danger to body", "Preeti: Loved by all", "Vanija (cow)" and similar one-liners are not used: no source is held for them.
  Names and counts are given; the rules for Tara and Chandra bala with sources are on `/muhurta-stars`.
- Not built: PL9's other dasha rows at event (Shatabdika, Kalachakra), and event saving. PL9's five-level Yogini, Ashtottari and Narayana strings in the gochara panel are not shown (we give the main period).

## Varshaphala event view (121-123)
For each event the solar-return chart of the year the event falls in is shown twice, as PL9's "Progression (35)" and "Progression (Bengaluru 35)": for the birth place and for the event place (same instant, so the planets agree and only the lagna can change). Age is the number of completed returns at the event; Muntha is the birth lagna plus that age. On the audit chart both charts match PL9 (lagna Leo, Muntha Cancer, all nine grahas); the return time is 03:46:21 here and 03:46:09 in PL9.
