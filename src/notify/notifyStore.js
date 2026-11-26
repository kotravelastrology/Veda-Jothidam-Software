'use strict';

// `process.getBuiltinModule` rather than `require('node:sqlite')`, as in chartRepository.js: Next's bundler cannot resolve the bare
// require of a node: builtin it does not know.
const { DatabaseSync } = process.getBuiltinModule
  ? process.getBuiltinModule('node:sqlite')
  // eslint-disable-next-line global-require
  : require('node:sqlite');
const path = require('node:path');
const fs = require('node:fs');
const { resolveLibraryPath } = require('../library/libraryPath');

/**
 * The server's record of who gets notifications (src/notify/scheduler.js): one row per browser that switched them on (its push
 * endpoint and keys, and its choices), the dated messages waiting to be sent, and the server's VAPID key pair. A file next to the chart
 * library (VEDA_NOTIFY_PATH overrides it), separate from it, so the library never holds a third party's push address.
 *
 * No birth details are kept: a dasha notice is stored as its finished text and time.
 */

function defaultNotifyPath() {
  if (process.env.VEDA_NOTIFY_PATH) return process.env.VEDA_NOTIFY_PATH;
  return path.join(path.dirname(resolveLibraryPath()), 'notifications.db');
}

const SCHEMA = `
CREATE TABLE IF NOT EXISTS notify_meta (key TEXT PRIMARY KEY, value TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS subscriptions (
  endpoint TEXT PRIMARY KEY,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  prefs TEXT NOT NULL,
  last_daily TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS notices (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  endpoint TEXT NOT NULL REFERENCES subscriptions(endpoint) ON DELETE CASCADE,
  kind TEXT NOT NULL,
  at_ms INTEGER NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  url TEXT NOT NULL,
  tag TEXT NOT NULL,
  sent_at TEXT
);
CREATE INDEX IF NOT EXISTS notices_due ON notices (sent_at, at_ms);
`;

/** At most this many browsers: the server's actions are open to whoever reaches it, so the file cannot be grown without end. */
const MAX_SUBSCRIPTIONS = 500;

function rowToSubscription(r) {
  return r ? { endpoint: r.endpoint, p256dh: r.p256dh, auth: r.auth, prefs: JSON.parse(r.prefs), lastDaily: r.last_daily ?? null } : null;
}

/**
 * @param {string} [filePath] ':memory:' for tests
 */
function openNotifyStore(filePath = defaultNotifyPath()) {
  if (filePath !== ':memory:') fs.mkdirSync(path.dirname(path.resolve(filePath)), { recursive: true });
  const db = new DatabaseSync(filePath);
  db.exec('PRAGMA foreign_keys = ON');
  db.exec('PRAGMA busy_timeout = 3000');
  db.exec(SCHEMA);

  const meta = {
    get: (key) => db.prepare('SELECT value FROM notify_meta WHERE key = ?').get(key)?.value ?? null,
    set: (key, value) => db.prepare('INSERT INTO notify_meta (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value').run(key, value),
  };

  return {
    /**
     * The VAPID key pair: VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY from the environment when both are set, else the pair kept in this
     * file, made once by `generate` (web-push's generateVAPIDKeys).
     */
    vapidKeys(generate, env = process.env) {
      if (env.VAPID_PUBLIC_KEY && env.VAPID_PRIVATE_KEY) return { publicKey: env.VAPID_PUBLIC_KEY, privateKey: env.VAPID_PRIVATE_KEY };
      const publicKey = meta.get('vapidPublicKey');
      const privateKey = meta.get('vapidPrivateKey');
      if (publicKey && privateKey) return { publicKey, privateKey };
      const made = generate();
      meta.set('vapidPublicKey', made.publicKey);
      meta.set('vapidPrivateKey', made.privateKey);
      return { publicKey: made.publicKey, privateKey: made.privateKey };
    },

    /** Adds or replaces a browser's subscription; false when the store is full and this is a new browser. */
    saveSubscription({ endpoint, p256dh, auth }, prefs, nowIso = new Date().toISOString()) {
      const exists = db.prepare('SELECT 1 FROM subscriptions WHERE endpoint = ?').get(endpoint);
      if (!exists && db.prepare('SELECT COUNT(*) AS n FROM subscriptions').get().n >= MAX_SUBSCRIPTIONS) return false;
      db.prepare(`INSERT INTO subscriptions (endpoint, p256dh, auth, prefs, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)
        ON CONFLICT(endpoint) DO UPDATE SET p256dh = excluded.p256dh, auth = excluded.auth, prefs = excluded.prefs, updated_at = excluded.updated_at`)
        .run(endpoint, p256dh, auth, JSON.stringify(prefs), nowIso, nowIso);
      return true;
    },
    getSubscription(endpoint) {
      return rowToSubscription(db.prepare('SELECT * FROM subscriptions WHERE endpoint = ?').get(endpoint));
    },
    listSubscriptions() {
      return db.prepare('SELECT * FROM subscriptions ORDER BY created_at').all().map(rowToSubscription);
    },
    updatePrefs(endpoint, prefs, nowIso = new Date().toISOString()) {
      return db.prepare('UPDATE subscriptions SET prefs = ?, updated_at = ? WHERE endpoint = ?').run(JSON.stringify(prefs), nowIso, endpoint).changes === 1;
    },
    removeSubscription(endpoint) {
      return db.prepare('DELETE FROM subscriptions WHERE endpoint = ?').run(endpoint).changes === 1;
    },

    /**
     * Claims today's morning message for one browser: true for exactly one caller (another server process on the same file gets
     * false), so two running servers never send it twice. `previous` is what to put back if the send fails.
     */
    claimDaily(endpoint, localDate) {
      const prev = db.prepare('SELECT last_daily FROM subscriptions WHERE endpoint = ?').get(endpoint);
      if (!prev) return { claimed: false, previous: null };
      const r = db.prepare('UPDATE subscriptions SET last_daily = ? WHERE endpoint = ? AND (last_daily IS NULL OR last_daily <> ?)').run(localDate, endpoint, localDate);
      return { claimed: r.changes === 1, previous: prev.last_daily ?? null };
    },
    releaseDaily(endpoint, previous) {
      db.prepare('UPDATE subscriptions SET last_daily = ? WHERE endpoint = ?').run(previous, endpoint);
    },

    /** Replaces the waiting messages of one kind for one browser (the ones already sent stay as a record). */
    replaceNotices(endpoint, kind, notices) {
      db.exec('BEGIN');
      try {
        db.prepare('DELETE FROM notices WHERE endpoint = ? AND kind = ? AND sent_at IS NULL').run(endpoint, kind);
        const ins = db.prepare('INSERT INTO notices (endpoint, kind, at_ms, title, body, url, tag) VALUES (?, ?, ?, ?, ?, ?, ?)');
        for (const n of notices) ins.run(endpoint, kind, n.atMs, n.title, n.body, n.url, n.tag);
        db.exec('COMMIT');
      } catch (e) {
        db.exec('ROLLBACK');
        throw e;
      }
    },
    /** The waiting messages of one browser, in time order. */
    pendingNotices(endpoint, kind) {
      return db.prepare('SELECT id, at_ms AS atMs, title, body, url, tag FROM notices WHERE endpoint = ? AND kind = ? AND sent_at IS NULL ORDER BY at_ms')
        .all(endpoint, kind);
    },
    /** The messages whose time has come, with their browser. */
    dueNotices(nowMs) {
      return db.prepare(`SELECT n.id, n.kind, n.at_ms AS atMs, n.title, n.body, n.url, n.tag, s.endpoint, s.p256dh, s.auth
        FROM notices n JOIN subscriptions s ON s.endpoint = n.endpoint WHERE n.sent_at IS NULL AND n.at_ms <= ? ORDER BY n.at_ms`).all(nowMs);
    },
    /** True for exactly one caller, as claimDaily. */
    claimNotice(id, nowIso = new Date().toISOString()) {
      return db.prepare('UPDATE notices SET sent_at = ? WHERE id = ? AND sent_at IS NULL').run(nowIso, id).changes === 1;
    },
    releaseNotice(id) {
      db.prepare('UPDATE notices SET sent_at = NULL WHERE id = ?').run(id);
    },
    /** Drops sent messages older than `beforeMs` (kept a while as a record of what went out). */
    pruneSent(beforeMs) {
      return db.prepare('DELETE FROM notices WHERE sent_at IS NOT NULL AND at_ms < ?').run(beforeMs).changes;
    },
    close() {
      db.close();
    },
  };
}

module.exports = { openNotifyStore, defaultNotifyPath, MAX_SUBSCRIPTIONS };
