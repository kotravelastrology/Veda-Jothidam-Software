'use client';

import { useEffect } from 'react';
import { readLang } from './lang';
import { buildTranslator, fixLeadingOrdinal, TA } from './translate';

/** Elements whose text is never replaced: code, what the person types, and anything marked data-no-translate. */
const SKIP = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEXTAREA', 'INPUT', 'PRE', 'CODE']);
const ATTRS = ['title', 'aria-label', 'placeholder', 'alt'];

function skipped(el: Element | null): boolean {
  for (let e = el; e; e = e.parentElement) {
    if (SKIP.has(e.tagName) || e.hasAttribute('data-no-translate') || (e as HTMLElement).isContentEditable) return true;
  }
  return false;
}

type Catalogue = { exact: Record<string, string>; patterns: [string, string][] };

/**
 * English mode (src/i18n/lang.ts): replaces the Tamil text of the page with the catalogue's English (src/i18n/translate.js), first the
 * whole page, then whatever React draws or redraws (a MutationObserver), including the page title and the title, aria-label, placeholder
 * and alt attributes. An element whose children are all text (a sentence with values in it) is translated as one sentence, so that the
 * English can put its words in its own order; the Tamil each text node last held is remembered, so a value React changes later is
 * translated again within its sentence. It runs after the page is hydrated, so the server's HTML and React's first render stay the same
 * Tamil; the boot script hides the page until the first pass is done. In Tamil mode it does nothing and loads nothing.
 */
export function Translator() {
  useEffect(() => {
    if (readLang() !== 'en') return undefined;
    let observer: MutationObserver | null = null;
    let cancelled = false;
    (async () => {
      const mod: { default?: unknown } = await import('./en.json');
      const tr = buildTranslator((mod.default ?? mod) as Catalogue);
      const original = new WeakMap<Text, string>(); // the text a node last got from the page itself
      const ours = new WeakMap<Text, string>(); // the text this translator wrote into it

      const write = (n: Text, v: string) => {
        if (n.nodeValue === v) return;
        ours.set(n, v);
        n.nodeValue = v;
      };
      const originalOf = (n: Text) => {
        const v = n.nodeValue ?? '';
        if (ours.has(n) && ours.get(n) === v) return original.get(n) ?? v;
        original.set(n, v);
        ours.delete(n);
        return v;
      };
      const contextOf = (el: Element | null) => el?.closest('[data-i18n-ctx]')?.getAttribute('data-i18n-ctx') ?? undefined;

      /** A sentence drawn as several text nodes; true when the element was handled whole. */
      const sentence = (el: Element): boolean => {
        const kids = Array.from(el.childNodes).filter((c) => c.nodeType !== Node.COMMENT_NODE);
        if (kids.length < 2 || !kids.every((c) => c.nodeType === Node.TEXT_NODE)) return false;
        if (skipped(el)) return true;
        const texts = kids as Text[];
        const out = tr.translateParts(texts.map(originalOf), contextOf(el));
        if (!out) return false;
        texts.forEach((t, i) => write(t, out[i]));
        return true;
      };

      const text = (n: Text) => {
        const parent = n.parentElement;
        if (parent && sentence(parent)) return;
        const v = originalOf(n);
        if (!TA.test(v) || skipped(parent)) return;
        const t = tr.translate(v, contextOf(parent));
        if (t == null) return;
        write(n, fixLeadingOrdinal(n.previousSibling?.textContent ?? '', t));
      };

      const attrs = (el: Element) => {
        for (const a of ATTRS) {
          const v = el.getAttribute(a);
          if (!v || !TA.test(v)) continue;
          const t = tr.translate(v, contextOf(el));
          if (t != null && t !== v) el.setAttribute(a, t);
        }
      };

      const walk = (root: Node) => {
        if (root.nodeType === Node.TEXT_NODE) { text(root as Text); return; }
        if (root.nodeType !== Node.ELEMENT_NODE) return;
        attrs(root as Element);
        const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT);
        for (let n = w.nextNode(); n; n = w.nextNode()) {
          if (n.nodeType === Node.TEXT_NODE) text(n as Text);
          else attrs(n as Element);
        }
      };

      if (cancelled) return;
      walk(document.documentElement);
      document.documentElement.setAttribute('data-translated', '1');
      observer = new MutationObserver((records) => {
        for (const r of records) {
          if (r.type === 'characterData') text(r.target as Text);
          else if (r.type === 'attributes') attrs(r.target as Element);
          else r.addedNodes.forEach(walk);
        }
      });
      observer.observe(document.documentElement, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ATTRS });
    })().catch(() => { document.documentElement.setAttribute('data-translated', '1'); });
    return () => {
      cancelled = true;
      observer?.disconnect();
    };
  }, []);
  return null;
}
