'use strict';

/**
 * The part of Node's `path` the calculation path touches, for the browser build (next.config.mjs aliases `path` here). The engines use
 * it only to look for @swisseph/node's package.json (swissEphemeris.js, chartSnapshot.js), which fails on the device and falls back to
 * 'unknown', as those modules expect when the file cannot be read. POSIX forms, enough for that.
 */
function normalize(p) {
  const s = String(p);
  const absolute = s.startsWith('/');
  const out = [];
  for (const part of s.split('/')) {
    if (!part || part === '.') continue;
    if (part === '..') { if (out.length && out[out.length - 1] !== '..') out.pop(); else if (!absolute) out.push('..'); } else out.push(part);
  }
  const joined = out.join('/');
  return absolute ? `/${joined}` : joined || '.';
}

const join = (...parts) => normalize(parts.map(String).filter(Boolean).join('/'));

function resolve(...parts) {
  let r = '';
  for (const p of parts.map(String)) r = p.startsWith('/') ? p : `${r}/${p}`;
  return normalize(r || '/');
}

function dirname(p) {
  const s = String(p).replace(/\/+$/, '');
  const i = s.lastIndexOf('/');
  if (i < 0) return '.';
  return i === 0 ? '/' : s.slice(0, i);
}

function basename(p, ext) {
  const b = String(p).replace(/\/+$/, '').split('/').pop() || '';
  return ext && b.endsWith(ext) ? b.slice(0, -ext.length) : b;
}

function extname(p) {
  const b = basename(p);
  const i = b.lastIndexOf('.');
  return i > 0 ? b.slice(i) : '';
}

const api = { sep: '/', delimiter: ':', normalize, join, resolve, dirname, basename, extname, isAbsolute: (p) => String(p).startsWith('/') };
api.posix = api;
api.win32 = api;
module.exports = api;
