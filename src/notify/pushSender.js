'use strict';

/**
 * Sends one message to one browser through its push service (web-push: the VAPID signature and the aes128gcm encryption of RFC 8291,
 * so the push service carries the message without being able to read it). Returns { ok } or { gone } (404/410: the browser dropped the
 * subscription) or { ok: false, status }; never throws.
 */
const webpush = require('web-push');

/** A contact the push services can reach about this server: VAPID_SUBJECT (mailto: or https:), else a placeholder. */
function vapidSubject(env = process.env) {
  const s = String(env.VAPID_SUBJECT ?? '').trim();
  return /^(mailto:|https:\/\/)/.test(s) ? s : 'mailto:notifications@kotravel.invalid';
}

function makeSender({ publicKey, privateKey, subject = vapidSubject() }) {
  return async function send(sub, message) {
    try {
      const r = await webpush.sendNotification(
        { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
        JSON.stringify(message),
        { vapidDetails: { subject, publicKey, privateKey }, TTL: 6 * 3600, urgency: 'normal', timeout: 15000 },
      );
      return { ok: true, status: r.statusCode };
    } catch (e) {
      const status = Number(e?.statusCode) || 0;
      if (status === 404 || status === 410) return { ok: false, gone: true, status };
      return { ok: false, status, error: String(e?.body || e?.message || e).slice(0, 200) };
    }
  };
}

function generateVapidKeys() {
  return webpush.generateVAPIDKeys();
}

module.exports = { makeSender, generateVapidKeys, vapidSubject };
