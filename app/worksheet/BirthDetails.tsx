'use client';

import type { ReactNode } from 'react';

/**
 * What a chart says of its birth, at the top of the worksheet the moment it is made (src/report/birthParticulars.js): the name,
 * the weekday, the sunrise, the nakshatra, tithi, yoga and karana at the moment of birth with the time each ends, the Lagna and
 * the Moon's sign, and the dasha the native was born in with the balance. The rest (Sun's sign, the Hindu day's sunrise
 * limbs, the Tamil calendar, the Avakhada points, the zone) is one tap lower.
 */

interface Limb { name: string; endLocal: string }

export interface BirthParticulars {
  name: string | null;
  gender: string | null;
  birth: { date: string; time: string; civilWeekdayTa: string; place: string | null; latitude: string; longitude: string; utcOffset: string };
  weekdayTa: string;
  sunrise: string;
  sunset: string;
  sunriseDate: string;
  ishta: string;
  tithi: Limb & { paksha: string };
  nakshatra: Limb & { pada: number; lordTa: string };
  yoga: Limb;
  karana: Limb;
  atSunrise: { tithi: string; nakshatra: string; yoga: string; karana: string };
  lagna: { rasiTa: string; degree: string };
  moon: { rasiTa: string; degree: string; lordTa: string };
  sun: { rasiTa: string; degree: string };
  ayanamsha: { name: string; degrees: string };
  dasha: { lordTa: string; fullYears: number; balance: { years: number; months: number; days: number }; endsLocal: string; yearDays: number; method: 'degree' | 'time' };
  tamilCalendar: { year: string; month: string; date: number };
  avakhada: { varna: string; vashya: string; yoni: string; gana: string; nadi: string };
}

/** 'YYYY-MM-DD HH:MM' as 'dd-mm-yyyy HH:MM'. */
const dmyHm = (text: string) => {
  const [date, time] = text.split(' ');
  const [y, m, d] = date.split('-');
  return `${d}-${m}-${y} ${time ?? ''}`.trim();
};
/** The end of a limb: the clock time, with the date when it is not the birth's own. */
const until = (endLocal: string, birthDate: string) => {
  const [date, time] = endLocal.split(' ');
  return date === birthDate ? `${time} வரை` : `${dmyHm(endLocal)} வரை`;
};
const sign = (text: string) => { const [d, m] = text.split(':'); return `${Number(d)}°${m}′`; };
const balanceText = (b: { years: number; months: number; days: number }) => `${b.years} ஆண்டு ${b.months} மாதம் ${b.days} நாள்`;
const hasTamil = (text: string) => /[஀-௿]/.test(text);

function Fact({ label, value, note, tone = 'saffron', wide = false }: { label: string; value: ReactNode; note?: ReactNode; tone?: 'saffron' | 'teal' | 'rose' | 'indigo'; wide?: boolean }) {
  const bar = { saffron: 'bg-saffron', teal: 'bg-teal', rose: 'bg-rose', indigo: 'bg-indigo' }[tone];
  return (
    <div className={`relative min-w-0 overflow-hidden rounded-xl border border-line bg-surface px-3 py-2 pl-4 shadow-sm ${wide ? 'col-span-2' : ''}`}>
      <span className={`absolute inset-y-0 left-0 w-1 ${bar}`} aria-hidden />
      <p className="text-[11px] font-semibold text-ink-soft">{label}</p>
      <p className="text-[15px] font-bold leading-tight text-ink">{value}</p>
      {note && <p className="mt-0.5 text-[11px] text-ink-soft tabular-nums">{note}</p>}
    </div>
  );
}

function Row({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-line/40 py-1 text-xs last:border-0">
      <dt className="text-ink-soft">{label}</dt>
      <dd className="text-right font-semibold text-ink tabular-nums">{value}</dd>
    </div>
  );
}

export function BirthDetails({ p }: { p: BirthParticulars }) {
  const date = p.birth.date;
  return (
    <section className="mb-3 rounded-2xl border border-line bg-surface p-3 shadow-sm sm:p-4" aria-label="ஜாதக விவரம்">
      <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1">
        <span className="icon-chip icon-chip-saffron size-9" aria-hidden><span>📜</span></span>
        <h2 className="font-[family-name:var(--font-tamil-serif)] text-base font-bold text-ink">ஜாதக விவரம்</h2>
        <p className="text-xs text-ink-soft tabular-nums">
          {p.name ? <strong className="text-ink">{p.name}</strong> : null}{p.name ? ' · ' : ''}{dmyHm(`${p.birth.date} ${p.birth.time}`)} · {p.birth.place ?? '—'}
        </p>
      </div>

      <div className="grid grid-flow-dense grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
        <Fact label="கிழமை" value={p.weekdayTa} note={p.birth.civilWeekdayTa !== p.weekdayTa ? `சூரிய உதயத்துக்கு முன் (நாள்: ${p.birth.civilWeekdayTa})` : undefined} />
        <Fact label="சூரிய உதயம்" value={p.sunrise.slice(0, 5)} note={`அஸ்தமனம் ${p.sunset.slice(0, 5)}`} tone="rose" />
        <Fact label="நட்சத்திரம்" value={`${p.nakshatra.name} · ${p.nakshatra.pada}-ஆம் பாதம்`} note={`${until(p.nakshatra.endLocal, date)} · அதிபதி ${p.nakshatra.lordTa}`} tone="teal" />
        <Fact label="திதி" value={`${p.tithi.paksha} ${p.tithi.name}`} note={until(p.tithi.endLocal, date)} tone="indigo" />
        <Fact label="யோகம்" value={p.yoga.name} note={until(p.yoga.endLocal, date)} tone="teal" />
        <Fact label="கரணம்" value={p.karana.name} note={until(p.karana.endLocal, date)} tone="indigo" />
        <Fact label="லக்னம்" value={p.lagna.rasiTa} note={sign(p.lagna.degree)} tone="rose" />
        <Fact label="சந்திர ராசி" value={p.moon.rasiTa} note={`${sign(p.moon.degree)} · அதிபதி ${p.moon.lordTa}`} tone="rose" />
        <Fact
          label="பிறந்த தசை · இருப்பு"
          value={`${p.dasha.lordTa} தசை`}
          note={`${balanceText(p.dasha.balance)} · ${dmyHm(p.dasha.endsLocal).slice(0, 10)} வரை`}
          tone="saffron"
          wide
        />
        <Fact label="சூரிய ராசி" value={p.sun.rasiTa} note={sign(p.sun.degree)} tone="saffron" />
        <Fact label="இஷ்ட காலம்" value={`${p.ishta.slice(0, 5)} நாழிகை`} note="சூரிய உதயம் முதல் பிறப்பு வரை" tone="teal" />
      </div>

      <details className="mt-3">
        <summary className="cursor-pointer select-none text-xs font-semibold text-saffron hover:underline">மேலும் விவரங்கள்</summary>
        <div className="mt-2 grid gap-x-6 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
          <dl>
            <p className="mb-1 text-[11px] font-bold uppercase tracking-wide text-ink-soft">பிறப்பு</p>
            <Row label="பிறந்த நாள்" value={`${dmyHm(`${p.birth.date} ${p.birth.time}`)} (${p.birth.civilWeekdayTa})`} />
            <Row label="ஊர்" value={p.birth.place ?? '—'} />
            <Row label="அட்சரேகை / தீர்க்கரேகை" value={`${p.birth.latitude} / ${p.birth.longitude}`} />
            <Row label="நேர மண்டலம்" value={`${p.birth.utcOffset} மணி`} />
            <Row label="இஷ்ட காலம்" value={`${p.ishta} நாழிகை`} />
            <Row label="அயனாம்சம்" value={`${p.ayanamsha.name} ${sign(p.ayanamsha.degrees)}`} />
          </dl>
          <dl>
            <p className="mb-1 text-[11px] font-bold uppercase tracking-wide text-ink-soft">ராசிகள்</p>
            <Row label="லக்னம்" value={`${p.lagna.rasiTa} ${sign(p.lagna.degree)}`} />
            <Row label="சந்திரன்" value={`${p.moon.rasiTa} ${sign(p.moon.degree)}`} />
            <Row label="சூரியன்" value={`${p.sun.rasiTa} ${sign(p.sun.degree)}`} />
            <p className="mb-1 mt-3 text-[11px] font-bold uppercase tracking-wide text-ink-soft">சூரிய உதயத்தில் (நாளின் பஞ்சாங்கம்)</p>
            <Row label="திதி" value={p.atSunrise.tithi} />
            <Row label="நட்சத்திரம்" value={p.atSunrise.nakshatra} />
            <Row label="யோகம் / கரணம்" value={`${p.atSunrise.yoga} / ${p.atSunrise.karana}`} />
          </dl>
          <dl>
            <p className="mb-1 text-[11px] font-bold uppercase tracking-wide text-ink-soft">தமிழ் நாள்காட்டி</p>
            {hasTamil(p.tamilCalendar.year) && <Row label="ஆண்டு" value={p.tamilCalendar.year} />}
            <Row label="மாதம் / தேதி" value={`${p.tamilCalendar.month} ${p.tamilCalendar.date}`} />
            <p className="mb-1 mt-3 text-[11px] font-bold uppercase tracking-wide text-ink-soft">அவகடா</p>
            <Row label="வர்ணம்" value={p.avakhada.varna} />
            <Row label="வசியம்" value={p.avakhada.vashya} />
            <Row label="யோனி" value={p.avakhada.yoni} />
            <Row label="கணம்" value={p.avakhada.gana} />
            <Row label="நாடி" value={p.avakhada.nadi} />
          </dl>
        </div>
        <p className="mt-2 text-[10px] text-ink-soft">
          திதி, நட்சத்திரம், யோகம், கரணம் பிறந்த நேரத்தில் உள்ளவை; முடியும் நேரம் பிறந்த ஊர் நேரத்தில். கிழமை சூரிய உதயம் முதல் மறு உதயம் வரை.
          தசை ஆண்டு {p.dasha.yearDays} நாள், இருப்பு {p.dasha.method === 'time' ? 'நேரப்படி' : 'பாகைப்படி'} (அமைப்புகளில் மாற்றலாம்). தசா காலங்கள் ஐந்து நிலைகளிலும்: ⏱ தசை வரிசை.
        </p>
      </details>
    </section>
  );
}
