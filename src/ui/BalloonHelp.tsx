'use client';

import { useEffect, useState } from 'react';
import { useSettings } from './SettingsPanel';

interface Balloon {
  text: string;
  x: number;
  y: number;
}

/**
 * Balloon Help (PL9 Help menu). While the "Balloon help" setting is on, hovering an
 * element that carries a `data-hint` attribute shows that hint in a small bubble just
 * below the element. With the setting off nothing is listened to and nothing is shown.
 */
export function BalloonHelp() {
  const { settings } = useSettings();
  const enabled = settings.showHints;
  const [balloon, setBalloon] = useState<Balloon | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const hintedAncestor = (node: EventTarget | null): Element | null =>
      node instanceof Element ? node.closest('[data-hint]') : null;

    const onOver = (event: MouseEvent) => {
      const el = hintedAncestor(event.target);
      if (!el) {
        setBalloon(null);
        return;
      }
      const rect = el.getBoundingClientRect();
      setBalloon({ text: el.getAttribute('data-hint') ?? '', x: rect.left, y: rect.bottom + 4 });
    };

    const onOut = (event: MouseEvent) => {
      // Moving from one hinted element into another is handled by onOver; only a
      // move out of every hinted element clears the bubble.
      if (!hintedAncestor(event.relatedTarget)) setBalloon(null);
    };

    document.addEventListener('mouseover', onOver);
    document.addEventListener('mouseout', onOut);
    return () => {
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout', onOut);
    };
  }, [enabled]);

  if (!enabled || !balloon || !balloon.text) return null;

  return (
    <div
      role="tooltip"
      style={{ position: 'fixed', left: balloon.x, top: balloon.y }}
      className="z-[60] pointer-events-none max-w-xs bg-ink text-surface text-xs rounded px-2 py-1 shadow-lg"
    >
      {balloon.text}
    </div>
  );
}
