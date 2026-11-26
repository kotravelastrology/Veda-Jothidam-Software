'use client';

import { useCallback } from 'react';
import { usePlanetColor } from '@/src/ui/useScreenPrefs';
import { PLANET_COLOR } from './worksheetStyle';

/** A planet's colour on the worksheet (by its two-letter name): the user's choice in the Colors dialog, else the theme's default. */
export function useWorksheetColor() {
  const pick = usePlanetColor();
  // the default is the theme's colour (globals.css --pl-*), so the dark theme gets its lighter one
  return useCallback((abbr: string) => pick(abbr, PLANET_COLOR[abbr] ? `var(--pl-${abbr})` : undefined), [pick]);
}
