import { useMemo, useState } from "react";
import { PHASE_META, cycleDay, phaseForDay, todayISO } from "@/lib/cycle";
import type { Profile, PromptLog } from "@/lib/storage";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function CalendarScreen({ profile, logs }: { profile: Profile; logs: PromptLog[] }) {
  const [cursor, setCursor] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });
  const [selected, setSelected] = useState<string | null>(null);

  const month = cursor.getMonth();
  const year = cursor.getFullYear();
  const first = new Date(year, month, 1);
  const startWeekday = first.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (Date | null)[] = useMemo(() => {
    const arr: (Date | null)[] = [];
    for (let i = 0; i < startWeekday; i++) arr.push(null);
    for (let d = 1; d <= daysInMonth; d++) arr.push(new Date(year, month, d));
    while (arr.length % 7 !== 0) arr.push(null);
    return arr;
  }, [year, month, daysInMonth, startWeekday]);

  const logByDate: Record<string, PromptLog> = useMemo(() => {
    const m: Record<string, PromptLog> = {};
    for (const l of logs) m[l.date] = l;
    return m;
  }, [logs]);

  const selectedLog = selected ? logByDate[selected] : null;

  const fbIcon = (f?: string) =>
    f === "fire" ? "🔥" : f === "thumb" ? "👍" : f === "shrug" ? "🤷" : f === "x" ? "❌" : null;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between pt-2">
        <h1 className="text-2xl font-semibold">Calendar</h1>
      </div>

      <div className="rounded-3xl bg-surface border border-border p-4">
        <div className="flex items-center justify-between mb-3 px-1">
          <button onClick={() => setCursor(new Date(year, month - 1, 1))} className="p-2 text-muted-foreground hover:text-gold">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <p className="text-sm font-medium">
            {cursor.toLocaleDateString(undefined, { month: "long", year: "numeric" })}
          </p>
          <button onClick={() => setCursor(new Date(year, month + 1, 1))} className="p-2 text-muted-foreground hover:text-gold">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
        <div className="grid grid-cols-7 text-center text-[10px] text-muted-foreground mb-2">
          {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => <div key={i}>{d}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-1.5">
          {cells.map((d, i) => {
            if (!d) return <div key={i} />;
            const iso = todayISO(d);
            const day = cycleDay(profile.lastPeriodStart, profile.cycleLength, d);
            const phase = phaseForDay(day, profile.cycleLength);
            const color = PHASE_META[phase].color;
            const log = logByDate[iso];
            const isToday = iso === todayISO();
            const isSelected = iso === selected;
            return (
              <button
                key={i}
                onClick={() => setSelected(iso)}
                className={`relative aspect-square rounded-xl flex flex-col items-center justify-center text-xs transition ${
                  isSelected ? "ring-2 ring-gold" : ""
                }`}
                style={{ background: `color-mix(in oklab, ${color} 22%, var(--surface-elevated))` }}
              >
                <span className={isToday ? "font-bold text-gold" : ""}>{d.getDate()}</span>
                {log?.feedback && <span className="text-[10px] absolute bottom-0.5">{fbIcon(log.feedback)}</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Phase legend */}
      <div className="rounded-3xl bg-surface border border-border p-4">
        <p className="text-xs uppercase tracking-widest text-gold mb-3">Phases</p>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(PHASE_META).map(([k, v]) => (
            <div key={k} className="flex items-center gap-2 text-xs">
              <span className="h-3 w-3 rounded-full" style={{ background: v.color }} />
              <span>{v.name}</span>
            </div>
          ))}
        </div>
      </div>

      {selectedLog && (
        <div className="rounded-3xl bg-surface border border-border p-5 slide-up">
          <p className="text-xs text-muted-foreground">{selected}</p>
          <p className="text-sm font-medium mt-1">Day {selectedLog.cycleDay} · {PHASE_META[selectedLog.phase as keyof typeof PHASE_META]?.name}</p>
          <p className="text-sm mt-3 leading-relaxed">{selectedLog.prompt}</p>
          {selectedLog.feedback && <p className="mt-3 text-xs text-muted-foreground">Feedback: <span className="text-base">{fbIcon(selectedLog.feedback)}</span></p>}
        </div>
      )}
    </div>
  );
}
