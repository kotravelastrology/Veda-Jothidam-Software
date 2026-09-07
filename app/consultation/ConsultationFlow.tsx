'use client';

import { useState } from 'react';

interface Config {
  whatsappNumber: string;
  upiId: string;
  upiPayeeName: string;
  feeInr: number;
}

function digitsOnly(phone: string) {
  return phone.replace(/[^0-9]/g, '');
}

function buildWhatsAppUrl(config: Config, message: string) {
  const number = digitsOnly(config.whatsappNumber);
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

function buildUpiUrl(config: Config, note: string) {
  const params = new URLSearchParams({
    pa: config.upiId,
    pn: config.upiPayeeName,
    am: String(config.feeInr),
    cu: 'INR',
    tn: note,
  });
  return `upi://pay?${params.toString()}`;
}

function pad(n: number) {
  return String(n).padStart(2, '0');
}

function downloadIcs(name: string, dateStr: string, timeStr: string) {
  if (!dateStr || !timeStr) return;
  const [y, m, d] = dateStr.split('-').map(Number);
  const [h, min] = timeStr.split(':').map(Number);
  const start = new Date(y, m - 1, d, h, min);
  const end = new Date(start.getTime() + 60 * 60 * 1000);
  const toIcsDate = (dt: Date) => `${dt.getFullYear()}${pad(dt.getMonth() + 1)}${pad(dt.getDate())}T${pad(dt.getHours())}${pad(dt.getMinutes())}00`;
  const ics = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'BEGIN:VEVENT',
    `DTSTART:${toIcsDate(start)}`, `DTEND:${toIcsDate(end)}`,
    `SUMMARY:Kotravel Vedic Astrology — Consultation (${name})`,
    'DESCRIPTION:ஜோதிட ஆலோசனை அப்பாயின்ட்மென்ட்',
    'END:VEVENT', 'END:VCALENDAR',
  ].join('\r\n');
  const blob = new Blob([ics], { type: 'text/calendar' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'kotravel-consultation.ics';
  a.click();
  URL.revokeObjectURL(url);
}

export default function ConsultationFlow({ config }: { config: Config }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [topic, setTopic] = useState('');

  const message = [
    `வணக்கம், எனக்கு ஒரு ஜோதிட ஆலோசனை (reading) வேண்டும்.`,
    name && `பெயர்: ${name}`,
    phone && `என் தொடர்பு எண்: ${phone}`,
    date && time && `விருப்ப நேரம்: ${date} ${time}`,
    topic && `விஷயம்: ${topic}`,
  ].filter(Boolean).join('\n');

  const canWhatsApp = name.trim().length > 0;

  return (
    <div className="max-w-xl mx-auto px-6 py-8">
      <div className="bg-surface border border-line rounded-2xl p-5 mb-6">
        <p className="text-sm text-ink-soft">
          இந்த தளத்தில் காட்டப்படும் பஞ்சாங்கம்/ஜாதக தகவல் பொதுவானது. <strong>தனிப்பட்ட ஆலோசனைக்கு (reading)</strong> நேரடியாக ஜோதிடரிடம் பேச வேண்டும் — எந்த தானியங்கி பரிகாரமும் இங்கு வழங்கப்படாது.
        </p>
      </div>

      <div className="bg-surface border border-line rounded-2xl p-5 mb-6 space-y-3">
        <h2 className="font-[family-name:var(--font-tamil-serif)] text-lg font-semibold text-ink">உங்கள் விவரங்கள்</h2>
        <label className="block text-sm">பெயர் *
          <input required value={name} onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full rounded border border-line px-2 py-1 bg-bg" />
        </label>
        <label className="block text-sm">உங்கள் தொடர்பு எண்
          <input value={phone} onChange={(e) => setPhone(e.target.value)}
            className="mt-1 w-full rounded border border-line px-2 py-1 bg-bg" />
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className="text-sm">விருப்ப தேதி
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
              className="mt-1 w-full rounded border border-line px-2 py-1 bg-bg" />
          </label>
          <label className="text-sm">விருப்ப நேரம்
            <input type="time" value={time} onChange={(e) => setTime(e.target.value)}
              className="mt-1 w-full rounded border border-line px-2 py-1 bg-bg" />
          </label>
        </div>
        <label className="block text-sm">விஷயம் (விருப்பம்)
          <textarea value={topic} onChange={(e) => setTopic(e.target.value)} rows={2}
            className="mt-1 w-full rounded border border-line px-2 py-1 bg-bg" />
        </label>
      </div>

      <ol className="space-y-4">
        <li className="bg-surface border border-line rounded-2xl p-5">
          <p className="font-semibold text-saffron mb-2">1. WhatsApp-ல் கோரிக்கை அனுப்புங்கள்</p>
          <a
            href={canWhatsApp ? buildWhatsAppUrl(config, message) : undefined}
            target="_blank" rel="noreferrer"
            aria-disabled={!canWhatsApp}
            className={`inline-block rounded-lg px-4 py-2 font-semibold text-white ${canWhatsApp ? 'bg-teal' : 'bg-ink-soft/40 pointer-events-none'}`}
          >
            WhatsApp திற
          </a>
          {!canWhatsApp && <p className="text-xs text-ink-soft mt-1">முதலில் பெயரை உள்ளிடவும்.</p>}
        </li>

        <li className="bg-surface border border-line rounded-2xl p-5">
          <p className="font-semibold text-saffron mb-2">2. கட்டணம் செலுத்துங்கள் (₹{config.feeInr})</p>
          <a href={buildUpiUrl(config, `Consultation - ${name || 'Client'}`)}
            className="inline-block rounded-lg bg-indigo text-white font-semibold px-4 py-2">
            UPI ஆப் திற
          </a>
          <p className="text-xs text-ink-soft mt-2">
            (UPI ஆப் திறக்கவில்லை எனில்) நேரடியாக UPI ID-க்கு அனுப்பவும்: <span className="font-mono">{config.upiId}</span>
          </p>
          <p className="text-xs text-ink-soft">
            பணம் செலுத்திய பிறகு, ஸ்கிரீன்ஷாட்டை WhatsApp-ல் அனுப்பி அப்பாயின்ட்மென்ட் உறுதிசெய்யவும்.
          </p>
        </li>

        <li className="bg-surface border border-line rounded-2xl p-5">
          <p className="font-semibold text-saffron mb-2">3. நாள்காட்டியில் சேர்த்துக் கொள்ளுங்கள்</p>
          <button type="button" onClick={() => downloadIcs(name || 'Client', date, time)}
            disabled={!date || !time}
            className="rounded-lg bg-saffron text-white font-semibold px-4 py-2 disabled:opacity-40">
            நாள்காட்டியில் சேர் (.ics)
          </button>
          <p className="text-xs text-ink-soft mt-2">
            குறிப்பு: குறிப்பிட்ட நேரத்தில் தானாக WhatsApp நினைவூட்டல் அனுப்ப WhatsApp Business API தேவை (இன்னும் அமைக்கப்படவில்லை) — தற்போது இரு தரப்பினரும் இந்த நாள்காட்டி நினைவூட்டலைப் பயன்படுத்தலாம்.
          </p>
        </li>
      </ol>
    </div>
  );
}
