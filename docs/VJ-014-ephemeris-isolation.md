# VJ-014 — ephemeris request isolation

**Delivered:** 2026-09-27 · Acceptance: *simultaneous Lahiri/other method
matches serialized fixtures*

## Dependency not met

VJ-009 (the Android bridge) is listed as a dependency and has not been done,
so only the desktop side is verified here. The hazard below is a property of
Swiss Ephemeris itself, so it will apply to any mobile bridge too — the
mitigation will need repeating there, not inheriting.

## The hazard, measured

Swiss Ephemeris keeps the ayanamsha in **global** state: `swe_set_sid_mode`
applies to the library, not to a call. Our code sets it and then computes,
which is safe only while that pair stays synchronous, because Node does not
interleave synchronous code.

The moment anything awaits between the two, a concurrent request overwrites
the mode. Measured on the Sun for 1990-05-15:

| | Sun longitude |
|---|---|
| Serial Lahiri | `30.389071` |
| Serial Raman | `31.835372` |
| Concurrent, unprotected: the request that **asked for Lahiri** | `31.835372` |

**1.45° wrong**, silently. That is more than a navamsa (3°20' wide, so it can
easily move one) and enough to change a rasi near a cusp. Nothing on screen
would suggest a problem.

Today's code paths happen to be synchronous end to end, so this does not bite
in production right now. That is luck, not design: one `await` added anywhere
between setting the mode and reading a position reintroduces it. VJ-014 exists
to make the safety explicit.

## The mitigation

`src/ephemeris/isolation.js` provides `withEphemeris(settings, fn)`, which
serialises sessions so only one set of globals is live at a time. `fn` may be
async. Native calls are microseconds, so the queue costs nothing meaningful
and correctness is not negotiable here.

- Nested sessions reuse the outer one rather than deadlocking, but a nested
  session asking for a *different* ayanamsha throws — that is a bug, not a wish.
- A rejected session does not poison the queue for later ones.
- `assertEphemerisSettings()` fails loudly if the globals are not what the
  caller expects, so a contamination regression surfaces in tests.

The five chart-computing Server Actions — divisional charts, yoga detection,
house analysis, dasha timeline and the evidence snapshot — now run inside a
session.

## Tested

`npm run test:isolation` asserts the acceptance directly: 32 interleaved
requests across Lahiri, Raman, Krishnamurti and TrueCitra, each compared
against fixtures computed serially with nothing else running. Sun, Moon and
ascendant must all match exactly.

The test also **demonstrates the unprotected hazard first** and asserts it
still contaminates, so the mitigation is not cargo cult. If that ever stops
being true, the test says so rather than passing quietly.

## A regression this caught

Wiring the sessions surfaced a bug I had introduced earlier, when pages
learned to take an optional stored input:

```
Cannot access ayanamsha on the server. You cannot dot into a temporary
client reference from a server component.
```

The compute buttons were wired `onClick={calculate}`, so React passed its
`MouseEvent` as the new `override` argument and the action received an
unserializable object. Auto-compute from a workspace profile still worked,
which is why the earlier browser checks missed it — **only the manual button
was broken**. Now `onClick={() => calculate()}`.

All four pages re-verified afterwards: Uttara Ashadha with a 4.571-year
balance, Sarvashtakavarga 337, Lagna Karkataka, 19 yoga formations.

## Not done yet

`/report`, `/porutham` and the other entry points still call the calculators
directly. They are synchronous today and therefore safe, but they should be
moved inside sessions as they are touched.
