# Graphical ephemeris (PL9 102 / 103)

Page `/graphical-ephemeris`, engine `src/chart/graphicalEphemeris.js`, test `test-graphical-ephemeris.js`.

Pure astronomy (Swiss Ephemeris): the sidereal longitude of the Sun, Mars, Mercury, Jupiter, Venus, Saturn, Rahu and Ketu over 1, 2, 5 or
10 years, drawn against the twelve signs, with a list of sign ingresses and of retrograde and direct stations. No classical rule is
involved, so no book is cited; the ayanamsha (Lahiri, Raman, Krishnamurti) and the node model (mean or true) are the reader's choice and
are written under the chart.

Method: daily samples; an ingress or a station is placed inside its day by bisection on the ephemeris (to about a minute). A line is broken,
not joined, where a planet crosses 0 degrees Aries. The Moon is not offered: at 13 degrees a day a daily sample cannot follow it.
Over 3 years the drawn points are every second day (the events are still found from daily samples).

Checks: the Sun's Mesha Sankranti of 2026 falls on 13-15 April (Lahiri, IST); Mercury has five to eight stations a year, alternating, with
the speed near zero at each; the mean node only moves backward and has no stations; Ketu is 180 degrees from Rahu; every ingress lies on a
sign boundary to a thousandth of a degree.

Not built: PL9's animated transits (098, 099, 093), the yearly South Indian transit chart (104) and the event charts (116-123).
