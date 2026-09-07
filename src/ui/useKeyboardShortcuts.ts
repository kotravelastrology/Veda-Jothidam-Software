'use client';

import { useEffect } from 'react';

export interface KeyboardShortcuts {
  onNew?: () => void;
  onOpen?: () => void;
  onSave?: () => void;
  onPrint?: () => void;
  onExit?: () => void;
  onSettings?: () => void;
  onTools?: () => void;
  onHelp?: () => void;
  onRasi?: () => void;
  onNavamsha?: () => void;
  onDivisional?: () => void;
  onDasha?: () => void;
  onTransit?: () => void;
  onClose?: () => void;
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcuts) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isMeta = event.ctrlKey || event.metaKey;
      const isAlt = event.altKey;
      const isShift = event.shiftKey;

      // Ctrl shortcuts
      if (isMeta && !isAlt && !isShift) {
        switch (event.key.toLowerCase()) {
          case 'n':
            event.preventDefault();
            shortcuts.onNew?.();
            break;
          case 'o':
            event.preventDefault();
            shortcuts.onOpen?.();
            break;
          case 's':
            event.preventDefault();
            shortcuts.onSave?.();
            break;
          case 'p':
            event.preventDefault();
            shortcuts.onPrint?.();
            break;
          case 'q':
            event.preventDefault();
            shortcuts.onExit?.();
            break;
          case ',':
            event.preventDefault();
            shortcuts.onSettings?.();
            break;
          case 't':
            event.preventDefault();
            shortcuts.onTools?.();
            break;
          case 'h':
            event.preventDefault();
            shortcuts.onHelp?.();
            break;
          default:
            break;
        }
      }

      // Alt shortcuts
      if (isAlt && !isMeta && !isShift) {
        switch (event.key) {
          case '1':
            event.preventDefault();
            shortcuts.onRasi?.();
            break;
          case '2':
            event.preventDefault();
            shortcuts.onNavamsha?.();
            break;
          case '3':
            event.preventDefault();
            shortcuts.onDivisional?.();
            break;
          case 'd':
          case 'D':
            event.preventDefault();
            shortcuts.onDasha?.();
            break;
          case 't':
          case 'T':
            event.preventDefault();
            shortcuts.onTransit?.();
            break;
          default:
            break;
        }
      }

      // Escape
      if (event.key === 'Escape') {
        shortcuts.onClose?.();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
}

export const SHORTCUTS_INFO = [
  { keys: 'Ctrl+N', action: 'New Chart', id: 'new' },
  { keys: 'Ctrl+O', action: 'Open Chart', id: 'open' },
  { keys: 'Ctrl+S', action: 'Save Chart', id: 'save' },
  { keys: 'Ctrl+P', action: 'Print', id: 'print' },
  { keys: 'Ctrl+Q', action: 'Exit', id: 'exit' },
  { keys: 'Ctrl+H', action: 'Help', id: 'help' },
  { keys: 'Ctrl+,', action: 'Settings', id: 'settings' },
  { keys: 'Ctrl+T', action: 'Tools', id: 'tools' },
  { keys: 'Alt+1', action: 'Birth Chart (Rasi)', id: 'rasi' },
  { keys: 'Alt+2', action: 'Navamsha (D9)', id: 'navamsha' },
  { keys: 'Alt+3', action: 'Divisional Charts', id: 'divisional' },
  { keys: 'Alt+D', action: 'Dasha Timeline', id: 'dasha' },
  { keys: 'Alt+T', action: 'Transits', id: 'transit' },
  { keys: 'Escape', action: 'Close Dialog', id: 'close' },
];
