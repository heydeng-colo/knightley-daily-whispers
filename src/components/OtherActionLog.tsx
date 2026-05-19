import { useEffect, useRef, useState } from "react";
import type { Phase } from "@/lib/cycle";

interface Props {
  promptDay: number;
  phase: Phase;
  cycleId?: string;
}

interface OtherEntry {
  date: string;
  text: string;
  promptDay: number;
  phase: string;
}

const STORAGE_KEY = "otherActions";
const LOGGED_TODAY_KEY = "attuned.otherLoggedDate";

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export function OtherActionLog({ promptDay, phase, cycleId }: Props) {
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [loggedToday, setLoggedToday] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const d = localStorage.getItem(LOGGED_TODAY_KEY);
    if (d === todayISO()) setLoggedToday(true);
  }, []);

  const submit = async () => {
    const t = text.trim();
    if (!t || submitting) return;
    setSubmitting(true);
    const date = todayISO();
    const entry: OtherEntry = { date, text: t, promptDay, phase };

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const arr: OtherEntry[] = raw ? JSON.parse(raw) : [];
      arr.unshift(entry);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
    } catch { /* ignore */ }

    try {
      await fetch("/api/v1/feedback/other", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date,
          promptDay,
          phase,
          freeTextInput: t,
          cycleId: cycleId || "",
        }),
      });
    } catch { /* offline-friendly */ }

    localStorage.setItem(LOGGED_TODAY_KEY, date);
    setLoggedToday(true);
    setConfirm(true);
    setText("");
    setSubmitting(false);

    setTimeout(() => {
      setConfirm(false);
    }, 2000);
  };

  if (loggedToday) {
    return (
      <div className="mt-3">
        <p className="text-[11px] italic text-muted-foreground/70">✓ Logged</p>
      </div>
    );
  }

  return (
    <div className="mt-3">
      {confirm ? (
        <p className="text-xs text-emerald-500 py-2">Noted — we'll factor this in. ✓</p>
      ) : (
        <div>
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") submit(); }}
              placeholder="Something else in mind? Tell us →"
              className="flex-1 min-w-0 bg-surface-elevated border border-border rounded-full px-3 py-1.5 text-xs focus:outline-none focus:border-gold/50 transition"
            />
            <button
              type="button"
              onClick={submit}
              disabled={!text.trim() || submitting}
              className="shrink-0 text-[11px] font-medium px-3 py-1.5 rounded-full gold-gradient text-gold-foreground disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Log it →
            </button>
          </div>
          <p className="mt-1 text-[9px] italic text-muted-foreground/60">
            We'll remember this for future prompts.
          </p>
        </div>
      )}
    </div>
  );
}
