# S1-C Ephemeris Engine Decision

Status: INTEGRATED FOUNDATION (engine wrapper and deterministic smoke test installed; astrology feature modules are not yet implemented).

## Decision

Swiss Ephemeris (Swiss Ephemeris / `sweph`) is the planned primary astronomical engine for the new Kotravel Vedic Astrology project. It will supply planetary and lunar positions, ayanamsa options and house/bhava calculations where the selected release and bindings support them.

## Boundaries

- The integrated package is `@swisseph/node` 1.3.1 with Swiss Ephemeris C library 2.10.03. The package is AGPL-3.0; commercial/non-open-source distribution requires the Astrodienst professional licence path.
- Tirukanita and Vakya Panchangam remain separate calculation conventions. Swiss Ephemeris output is the astronomical/Drik-style engine; Vakya tables/rules must not be silently replaced by it.
- Each result must record engine identity, release, ayanamsa, house system, timezone, location, input epoch and derivation identity.
- An option is shown only when the selected engine and governed source record support it. Unsupported or missing inputs produce an explicit refusal, not a substitute value.
- Source books continue to govern astrological rules; the ephemeris supplies astronomical positions and does not by itself prove a doctrinal interpretation.

## Current inspection

The old project contains an `astronomy-engine` dependency. The new project now contains the isolated Swiss Ephemeris dependency and wrapper; no old-project files were changed.

## Next action

During the Panchangam/Muhurtham implementation tranche: confirm the intended licence for deployment, expand deterministic position/ayanamsa/house fixtures, then connect the visually verified Panchangam source conventions without blending Drik and Vakya results.
