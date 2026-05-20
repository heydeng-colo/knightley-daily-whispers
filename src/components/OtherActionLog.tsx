import { useRef, useState } from "react";
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

interface Suggestion {
  brandKey: string;
  label: string;
  brandTier: number | null;
  category: string;
  affiliateUrl: string;
}

interface TapLog {
  date: string;
  brandKey: string;
  brandTier: number | null;
  category: string;
  chosenVia: "other_box";
}

const STORAGE_KEY = "otherActions";
const TAP_LOG_KEY = "attuned.otherTapLogs";
const LOGGED_TODAY_KEY = "attuned.otherLoggedDate";

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function logTap(entry: TapLog) {
  try {
    const raw = localStorage.getItem(TAP_LOG_KEY);
    const arr: TapLog[] = raw ? JSON.parse(raw) : [];
    arr.unshift(entry);
    localStorage.setItem(TAP_LOG_KEY, JSON.stringify(arr));
  } catch { /* ignore */ }
}

export function OtherActionLog({ promptDay, phase, cycleId }: Props) {
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [banner, setBanner] = useState<Suggestion | null>(null);
  const [alternatives, setAlternatives] = useState<Suggestion[]>([]);
  const [showAlts, setShowAlts] = useState(false);
  const [fallback, setFallback] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const submit = async () => {
    const t = text.trim();
    if (!t || submitting) return;
    setSubmitting(true);
    setFallback(null);
    const date = todayISO();
    const entry: OtherEntry = { date, text: t, promptDay, phase };

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const arr: OtherEntry[] = raw ? JSON.parse(raw) : [];
      arr.unshift(entry);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
    } catch { /* ignore */ }

    let suggestions: Suggestion[] = [];
    let fallbackMessage: string | null = null;
    try {
      const resp = await fetch("/api/v1/feedback/other", {
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
      if (resp.ok) {
        const data = (await resp.json()) as {
          suggestions?: Suggestion[];
          fallbackMessage?: string;
        };
        suggestions = Array.isArray(data.suggestions) ? data.suggestions : [];
        fallbackMessage = data.fallbackMessage || null;
      }
    } catch { /* offline-friendly */ }

    setSubmitting(false);
    setText("");

    if (suggestions.length > 0) {
      const top = suggestions[0];
      const rest = suggestions.slice(1);
      logTap({
        date,
        brandKey: top.brandKey,
        brandTier: top.brandTier,
        category: top.category,
        chosenVia: "other_box",
      });
      setBanner(top);
      setAlternatives(rest);
      setShowAlts(false);
      if (typeof window !== "undefined") {
        window.open(top.affiliateUrl, "_blank", "noopener");
      }
    } else {
      setFallback(fallbackMessage || "Noted — we'll factor this in. ✓");
      setTimeout(() => setFallback(null), 2400);
    }
  };

  const pickAlternative = (s: Suggestion) => {
    logTap({
      date: todayISO(),
      brandKey: s.brandKey,
      brandTier: s.brandTier,
      category: s.category,
      chosenVia: "other_box",
    });
    setBanner(s);
    setShowAlts(false);
    if (typeof window !== "undefined") {
      window.open(s.affiliateUrl, "_blank", "noopener");
    }
  };

  return (
    <div className="mt-3 space-y-2">
      {banner && (
        <div className="rounded-2xl border border-gold/40 bg-gold/10 px-3 py-2 flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-xs text-gold font-medium truncate">
              Opening {banner.label} for you →
            </p>
            <button
              type="button"
              onClick={() => setShowAlts((s) => !s)}
              className="mt-0.5 text-[10px] text-muted-foreground/80 hover:text-foreground underline-offset-2 hover:underline"
            >
              {showAlts ? "Hide other options" : "Wrong partner? See other options"}
            </button>
          </div>
          <button
            type="button"
            onClick={() => setBanner(null)}
            aria-label="Dismiss"
            className="shrink-0 text-gold/70 hover:text-gold text-sm leading-none px-1"
          >
            ×
          </button>
        </div>
      )}

      {banner && showAlts && alternatives.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {alternatives.map((s) => (
            <button
              key={s.brandKey}
              type="button"
              onClick={() => pickAlternative(s)}
              className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium border bg-surface-elevated border-border text-foreground hover:border-gold/40 transition"
            >
              {s.label}
            </button>
          ))}
        </div>
      )}

      {loggedToday && !banner && !fallback ? (
        <p className="text-[11px] italic text-muted-foreground/70">✓ Done</p>
      ) : fallback ? (
        <p className="text-xs text-emerald-500 py-2">{fallback}</p>
      ) : !banner ? (
        <div>
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") submit(); }}
              disabled={submitting}
              placeholder="Something else in mind? Tell us →"
              className="flex-1 min-w-0 bg-surface-elevated border border-border rounded-full px-3 py-1.5 text-xs focus:outline-none focus:border-gold/50 transition disabled:opacity-60"
            />
            <button
              type="button"
              onClick={submit}
              disabled={!text.trim() || submitting}
              className="shrink-0 text-[11px] font-medium px-3 py-1.5 rounded-full gold-gradient text-gold-foreground disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {submitting ? "…" : "Log it →"}
            </button>
          </div>
          {submitting ? (
            <p className="mt-1 text-[10px] italic text-muted-foreground/80 flex items-center gap-1.5">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-gold animate-pulse" />
              Finding the best option...
            </p>
          ) : (
            <p className="mt-1 text-[9px] italic text-muted-foreground/60">
              We'll remember this for future prompts.
            </p>
          )}
        </div>
      ) : null}
    </div>
  );
}
