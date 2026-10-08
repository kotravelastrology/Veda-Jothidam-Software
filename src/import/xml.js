/**
 * A small, strict XML reader for VJ-023.
 *
 * Deliberately not a general parser and deliberately not a dependency: the
 * import path reads other people's files, so it should understand exactly one
 * simple shape — elements, attributes, text — and **throw** on anything else
 * rather than silently mis-reading a client's records.
 *
 * Validated against a real Parashara's Light `options.xml`.
 */

class XmlError extends Error {
  constructor(message, position) {
    super(position === undefined ? message : `${message} (at character ${position})`);
    this.name = 'XmlError';
    this.position = position;
  }
}

const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'" };

function decode(text) {
  return text.replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z]+);/g, (whole, body) => {
    if (body[0] === '#') {
      const code = body[1] === 'x' || body[1] === 'X'
        ? parseInt(body.slice(2), 16)
        : parseInt(body.slice(1), 10);
      return Number.isFinite(code) ? String.fromCodePoint(code) : whole;
    }
    return Object.prototype.hasOwnProperty.call(ENTITIES, body) ? ENTITIES[body] : whole;
  });
}

function parseAttributes(raw, position) {
  const attrs = {};
  const re = /([\w:.-]+)\s*=\s*("([^"]*)"|'([^']*)')/g;
  let consumed = 0;
  let m;
  while ((m = re.exec(raw)) !== null) {
    attrs[m[1]] = decode(m[3] !== undefined ? m[3] : m[4]);
    consumed = m.index + m[0].length;
  }
  // Anything left that is not whitespace means an attribute form this reader
  // does not understand, e.g. an unquoted value. Refuse rather than drop it.
  if (raw.slice(consumed).trim().length > 0) {
    throw new XmlError(`unsupported attribute syntax: ${raw.trim().slice(0, 40)}`, position);
  }
  return attrs;
}

/**
 * Returns `{ name, attributes, children, text }`. Mixed content is not
 * supported: an element has either child elements or text, never both.
 */
function parseXml(source) {
  if (typeof source !== 'string' || !source.trim()) {
    throw new XmlError('empty document');
  }
  let text = source.replace(/^﻿/, '');
  text = text.replace(/<\?[\s\S]*?\?>/g, '');           // declarations
  text = text.replace(/<!--[\s\S]*?-->/g, '');           // comments
  text = text.replace(/<!DOCTYPE[^>[]*(\[[\s\S]*?\])?[^>]*>/gi, '');
  text = text.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, (_, inner) =>
    inner.replace(/&/g, '&amp;').replace(/</g, '&lt;'));

  const stack = [];
  let root = null;
  const tagRe = /<\s*(\/?)\s*([\w:.-]+)((?:[^>"']|"[^"]*"|'[^']*')*?)(\/?)\s*>/g;
  let cursor = 0;
  let m;

  while ((m = tagRe.exec(text)) !== null) {
    const [whole, closing, name, rawAttrs, selfClosing] = m;

    const between = text.slice(cursor, m.index);
    if (between.trim() && stack.length) {
      stack[stack.length - 1].text += decode(between);
    }
    cursor = m.index + whole.length;

    if (closing) {
      const open = stack.pop();
      if (!open) throw new XmlError(`closing tag </${name}> with nothing open`, m.index);
      if (open.name !== name) {
        throw new XmlError(`closing tag </${name}> does not match <${open.name}>`, m.index);
      }
      if (!stack.length) root = open;
      continue;
    }

    const node = { name, attributes: parseAttributes(rawAttrs, m.index), children: [], text: '' };
    if (stack.length) stack[stack.length - 1].children.push(node);
    else if (root) throw new XmlError(`a second root element <${name}>`, m.index);

    if (selfClosing) {
      if (!stack.length) root = node;
    } else {
      stack.push(node);
    }
  }

  if (stack.length) {
    throw new XmlError(`unclosed element <${stack[stack.length - 1].name}>`);
  }
  if (!root) throw new XmlError('no elements found — is this XML?');
  return root;
}

/** Every element whose name matches, at any depth. */
function findAll(node, name) {
  const out = [];
  const walk = (n) => {
    if (n.name === name) out.push(n);
    n.children.forEach(walk);
  };
  walk(node);
  return out;
}

/** Depth-first list of every distinct element path, for a loss report. */
function describeShape(node, prefix = '') {
  const path = prefix ? `${prefix}/${node.name}` : node.name;
  const paths = [path];
  for (const child of node.children) paths.push(...describeShape(child, path));
  return paths;
}

module.exports = { parseXml, findAll, describeShape, XmlError };
