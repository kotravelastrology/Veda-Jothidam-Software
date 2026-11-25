/**
 * The interface language of this device: Tamil (the program's own) or English (src/i18n/translate.js). Kept in the browser; a change
 * reloads the page so that everything is drawn once in the chosen language.
 */
export type Lang = 'ta' | 'en';
export const LANG_KEY = 'kotravel-lang';

export function readLang(): Lang {
  try {
    return localStorage.getItem(LANG_KEY) === 'en' ? 'en' : 'ta';
  } catch {
    return 'ta';
  }
}

export function switchLang(lang: Lang) {
  try {
    localStorage.setItem(LANG_KEY, lang);
  } catch {
    return;
  }
  window.location.reload();
}

/** Set on <html> before the page is painted (app/layout.tsx), so English mode hides the Tamil until it is replaced. */
export const LANG_BOOT_SCRIPT = `try{if(localStorage.getItem('${LANG_KEY}')==='en'){var h=document.documentElement;h.lang='en';h.setAttribute('data-lang','en');setTimeout(function(){h.setAttribute('data-translated','1')},3000)}}catch(e){}`;
