import { createChartContext } from "../src/contracts/chartContext";
import { calculateTirukanitaPanchangam } from "../src/panchangam/tirukanitaPanchangam";
import { calculateDailyMuhurtham } from "../src/panchangam/muhurtham";
import { calculateVakyaPanchangam } from "../src/panchangam/vakyaPanchangam";

const DEFAULT_LOCATION = {
  placeName: "சென்னை",
  latitude: 13.0827,
  longitude: 80.2707,
  ianaTimeZone: "Asia/Kolkata",
  utcOffsetMinutes: 330,
};

function todayInTimeZone(timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value);
  return { year: get("year"), month: get("month"), day: get("day") };
}

function timeOnly(localDateTime: string) {
  return localDateTime.split(" ")[1] ?? localDateTime;
}

function LimbCard({ label, name, start, end }: { label: string; name: string; start: string; end: string }) {
  return (
    <div className="rounded-2xl bg-surface border border-line p-5 flex flex-col gap-2">
      <span className="font-mono text-xs uppercase tracking-wide text-ink-soft">{label}</span>
      <span className="font-[family-name:var(--font-tamil-serif)] text-2xl font-semibold text-saffron">{name}</span>
      <span className="font-mono text-sm tabular-nums text-ink-soft">
        {timeOnly(start)} – {timeOnly(end)}
      </span>
    </div>
  );
}

function KalamChip({
  label,
  start,
  end,
  tone,
}: {
  label: string;
  start: string;
  end: string;
  tone: "avoid" | "good";
}) {
  const toneClasses =
    tone === "avoid"
      ? "bg-rose-soft text-rose border-rose/30"
      : "bg-teal-soft text-teal border-teal/30";
  return (
    <div className={`rounded-xl border px-4 py-3 flex items-center justify-between gap-3 ${toneClasses}`}>
      <span className="font-semibold text-sm">{label}</span>
      <span className="font-mono text-sm tabular-nums">
        {timeOnly(start)} – {timeOnly(end)}
      </span>
    </div>
  );
}

function PendingCard({ title, message }: { title: string; message: string }) {
  return (
    <div className="rounded-xl border border-dashed border-ink-soft/40 px-4 py-3 flex items-center justify-between gap-3 text-ink-soft">
      <span className="font-semibold text-sm">{title}</span>
      <span className="font-mono text-xs">{message}</span>
    </div>
  );
}

export default function DailyPanchangamPage() {
  const today = todayInTimeZone(DEFAULT_LOCATION.ianaTimeZone);
  const chartContext = createChartContext({
    ...today,
    hour: 12,
    ...DEFAULT_LOCATION,
    calendarMode: "tirukanita",
  });

  const panchangam = calculateTirukanitaPanchangam(chartContext);
  const muhurtham = calculateDailyMuhurtham(chartContext);
  const vakyaContext = createChartContext({ ...today, hour: 12, ...DEFAULT_LOCATION, calendarMode: "vakya" });
  const vakya = calculateVakyaPanchangam(vakyaContext);

  return (
    <main className="min-h-screen">
      <header className="bg-gradient-to-br from-saffron-soft via-bg to-indigo-soft px-6 py-10 border-b border-line">
        <div className="max-w-3xl mx-auto">
          <p className="font-mono text-xs uppercase tracking-widest text-ink-soft mb-2">
            திருகணித பஞ்சாங்கம் · {DEFAULT_LOCATION.placeName}
          </p>
          <h1 className="font-[family-name:var(--font-tamil-serif)] text-4xl font-bold text-ink mb-2">
            {panchangam.vara}
          </h1>
          <p className="text-ink-soft">
            {panchangam.date} · சூரிய உதயம் {timeOnly(panchangam.sunriseLocal)}
          </p>
        </div>
      </header>

      <section className="max-w-3xl mx-auto px-6 py-10">
        <h2 className="font-[family-name:var(--font-tamil-serif)] text-xl font-semibold mb-4 text-ink">
          பஞ்ச அங்கம்
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
          <LimbCard label="திதி" name={panchangam.tithi.name} start={panchangam.tithi.startLocal} end={panchangam.tithi.endLocal} />
          <LimbCard label="நட்சத்திரம்" name={panchangam.nakshatra.name} start={panchangam.nakshatra.startLocal} end={panchangam.nakshatra.endLocal} />
          <LimbCard label="யோகம்" name={panchangam.yoga.name} start={panchangam.yoga.startLocal} end={panchangam.yoga.endLocal} />
          <LimbCard label="கரணம்" name={panchangam.karana.name} start={panchangam.karana.startLocal} end={panchangam.karana.endLocal} />
        </div>

        <h2 className="font-[family-name:var(--font-tamil-serif)] text-xl font-semibold mb-2 text-ink">
          இன்றைய நேரங்கள்
        </h2>
        <p className="text-sm text-ink-soft mb-4">சிவப்பு = தவிர்க்க வேண்டிய நேரம் · பச்சை = நல்ல நேரம்</p>
        <div className="grid sm:grid-cols-2 gap-3 mb-4">
          <KalamChip label="ராகு காலம்" start={muhurtham.rahuKalam.startLocal} end={muhurtham.rahuKalam.endLocal} tone="avoid" />
          <KalamChip label="எமகண்டம்" start={muhurtham.yamagandam.startLocal} end={muhurtham.yamagandam.endLocal} tone="avoid" />
          <KalamChip label="குளிகை காலம்" start={muhurtham.gulikaKalam.startLocal} end={muhurtham.gulikaKalam.endLocal} tone="avoid" />
          {muhurtham.durmuhurtham.map((window: { startLocal: string; endLocal: string }, i: number) => (
            <KalamChip key={i} label={`துர்முகூர்த்தம் ${muhurtham.durmuhurtham.length > 1 ? i + 1 : ""}`} start={window.startLocal} end={window.endLocal} tone="avoid" />
          ))}
          {muhurtham.amritKaal && (
            <KalamChip label="அமிர்த காலம்" start={muhurtham.amritKaal.startLocal} end={muhurtham.amritKaal.endLocal} tone="good" />
          )}
          {muhurtham.varjyam?.map((window: { startLocal: string; endLocal: string }, i: number) => (
            <KalamChip key={i} label={`வர்ஜ்யம்${muhurtham.varjyam.length > 1 ? ` ${i + 1}` : ""}`} start={window.startLocal} end={window.endLocal} tone="avoid" />
          ))}
        </div>

        <div className="flex flex-col gap-3 mb-12">
          <PendingCard title="அபிஜித் முகூர்த்தம்" message={muhurtham.abhijitMuhurta.message} />
          <PendingCard title="வாக்ய பஞ்சாங்கம்" message={vakya.message} />
        </div>

        <footer className="text-xs text-ink-soft border-t border-line pt-4">
          மூலம்: {panchangam.source.title} — {panchangam.source.author} ({panchangam.source.pageLocus})
        </footer>
      </section>
    </main>
  );
}
