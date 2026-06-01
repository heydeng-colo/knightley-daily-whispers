import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  PHASE_META,
  cycleDay,
  getPromptForDay,
  phaseForDay,
  todayISO,
} from "@/lib/cycle";
import {
  getOrAssignVariation,
  nextPollDate,
  upsertLog,
  type Feedback,
  type Profile,
  type PromptLog,
} from "@/lib/storage";
import { Droplet, Flame, ThumbsUp, X as XIcon, Gift, Pause, Play } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { CYCLE_PAUSE_REASON_LABEL } from "@/lib/storage";
import { ActionChips } from "@/components/ActionChips";
import { OtherActionLog } from "@/components/OtherActionLog";
import { MiniQuiz } from "@/components/MiniQuiz";
import { getActionGroupForDay, shouldSuppressPaid } from "@/lib/actions";
import { getSpend, currentMonthSpend } from "@/lib/storage";

interface Props {
  profile: Profile;
  setProfile: (p: Profile) => void;
  logs: PromptLog[];
}

export function HomeScreen({ profile, setProfile, logs }: Props) {
  const navigate = useNavigate();
  const [resetOpen, setResetOpen] = useState(false);
  const [resetDate, setResetDate] = useState(todayISO());
  const [resumeOpen, setResumeOpen] = useState(false);
  const [resumeDate, setResumeDate] = useState(todayISO());
  const [showAll, setShowAll] = useState(false);
  const [noteDraft, setNoteDraft] = useState<string | null>(null);
  const [noteSaved, setNoteSaved] = useState(false);
  const isPaused = profile.cycleMode === "paused";

  const today = todayISO();
  // Default the homescreen to Day 14 (peak ovulation) so the example
  // experience showcases the highest-signal prompt and action set.
  const day = 14;
  const phase = phaseForDay(day, profile.cycleLength);
  const meta = PHASE_META[phase];
  const variation = useMemo(() => getOrAssignVariation(today), [today]);
  const promptText = getPromptForDay(day, variation, profile.cycleLength);

  const todayLog = logs.find((l) => l.date === today);
  const currentFeedback: Feedback | undefined = todayLog?.feedback;

  // Ensure today's prompt is logged once visible
  if (!todayLog) {
    upsertLog({
      date: today,
      cycleDay: day,
      phase,
      variation,
      prompt: promptText,
    });
  }

  const setFeedback = (f: Feedback) => {
    upsertLog({
      date: today,
      cycleDay: day,
      phase,
      variation,
      prompt: promptText,
      feedback: f,
      notes: todayLog?.notes,
    });
  };

  const currentNotes = noteDraft ?? todayLog?.notes ?? "";
  const saveNotes = () => {
    upsertLog({
      date: today,
      cycleDay: day,
      phase,
      variation,
      prompt: promptText,
      feedback: currentFeedback,
      notes: currentNotes.trim() || undefined,
    });
    setNoteDraft(null);
    setNoteSaved(true);
    setTimeout(() => setNoteSaved(false), 1800);
  };

  const onReset = () => {
    setProfile({ ...profile, lastPeriodStart: resetDate });
    setResetOpen(false);
  };

  // Stats
  const rated = logs.filter((l) => l.feedback);
  const positive = rated.filter((l) => l.feedback === "fire" || l.feedback === "thumb").length;
  const cumulativeRate = rated.length ? Math.round((positive / rated.length) * 100) : 0;
  const weekAgo = new Date(); weekAgo.setDate(weekAgo.getDate() - 7);
  const weekISO = todayISO(weekAgo);
  const weekRated = rated.filter((l) => l.date >= weekISO);
  const weekPositive = weekRated.filter((l) => l.feedback === "fire" || l.feedback === "thumb").length;
  const weekRate = weekRated.length ? Math.round((weekPositive / weekRated.length) * 100) : 0;
  const totalPrompts = logs.length;
  // streak: count consecutive days going back from today with feedback
  let streak = 0;
  const sorted = [...logs].sort((a, b) => (a.date < b.date ? 1 : -1));
  const cur = new Date();
  for (;;) {
    const iso = todayISO(cur);
    const found = sorted.find((l) => l.date === iso && !!l.feedback);
    if (!found) break;
    streak++;
    cur.setDate(cur.getDate() - 1);
  }

  // Next SMS poll: every 30 days from activation
  const nextSms = nextPollDate(profile.activatedAt);

  // Success rate by phase (positive = fire/thumb)
  const phaseKeys: Array<keyof typeof PHASE_META> = ["M", "EF", "O", "EL", "LL"];
  const phaseStats = phaseKeys.map((k) => {
    const inPhase = rated.filter((l) => l.phase === k);
    const pos = inPhase.filter((l) => l.feedback === "fire" || l.feedback === "thumb").length;
    const rate = inPhase.length ? Math.round((pos / inPhase.length) * 100) : 0;
    return { phase: k, meta: PHASE_META[k], rate, count: inPhase.length };
  });

  const recent = (showAll ? logs : logs.slice(0, 5)).filter((l) => l.date <= today);

  return (
    <div className="space-y-5">
      <MiniQuiz profile={profile} />
      {/* Top bar */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-semibold tracking-tight">Attuned</span>
          <span className="text-xs text-muted-foreground">·  daily</span>
        </div>
        <button
          onClick={() => {
            const url = typeof window !== "undefined" ? window.location.origin : "https://attuned.app";
            const text = `I've been using Attuned to show up better in my relationship — you should try it. ${url}`;
            if (typeof navigator !== "undefined" && (navigator as any).share) {
              (navigator as any).share({ title: "Attuned", text, url }).catch(() => {});
            } else if (typeof navigator !== "undefined" && navigator.clipboard) {
              navigator.clipboard.writeText(text);
              alert("Invite link copied — share it with a friend to earn 2 months free!");
            }
          }}
          className="inline-flex items-center gap-1.5 rounded-full bg-gold/10 border border-gold/40 text-gold px-3 py-1.5 text-[11px] font-medium hover:bg-gold/20 transition"
        >
          <Gift className="h-3.5 w-3.5" />
          Refer a friend · 2 months free
        </button>
      </div>

      {/* Reset cycle pill */}
      <div className="flex justify-end -mt-2">
        <button
          onClick={() => setResetOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-full bg-surface border border-border px-3 py-1.5 text-[11px] text-muted-foreground hover:text-gold hover:border-gold/40 transition"
          aria-label="Reset her cycle"
        >
          <Droplet className="h-3 w-3" />
          Reset Her Cycle
        </button>
      </div>

      {/* Phase card */}
      <div
        className="rounded-3xl p-6 border border-border slide-up relative overflow-hidden"
        style={{ background: `linear-gradient(160deg, color-mix(in oklab, ${meta.color} 28%, var(--surface)), var(--surface))` }}
      >
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full opacity-30 blur-3xl" style={{ background: meta.color }} />
        <p className="text-sm text-muted-foreground">{profile.herName ? `${profile.herName}'s Cycle` : "Her Cycle"}</p>
        <p className="text-5xl font-semibold mt-1">Day {day}</p>
        <div className="flex items-center gap-2 mt-3">
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: meta.color }} />
          <span className="text-sm font-medium">{meta.name}</span>
        </div>
        <p className="text-sm text-muted-foreground mt-2 leading-snug">{meta.description}</p>
      </div>

      {/* Daily prompt */}
      <div className="rounded-3xl bg-surface border border-border p-5 slide-up">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs uppercase tracking-widest text-gold font-medium">Today's Prompt</p>
          <span className="text-[10px] text-muted-foreground">v{variation}</span>
        </div>
        <p className="text-base leading-relaxed">{promptText}</p>

        {(() => {
          const group = getActionGroupForDay(day, variation, profile.cycleLength);
          if (!group) return null;
          const spend = getSpend();
          const monthTotal = currentMonthSpend();
          const guard = shouldSuppressPaid({ day, profile, logs, spend, monthSpendTotal: monthTotal });
          return (
            <div className="mt-4">
              <ActionChips
                group={group}
                profile={profile}
                cycleDay={day}
                phase={phase}
                hidePaid={guard.suppress}
                hidePaidReason={guard.reason}
              />
              <OtherActionLog promptDay={day} phase={phase} />
            </div>
          );
        })()}

        <div className="mt-5 grid grid-cols-4 gap-2">
          <FeedbackBtn label="Excellent" active={currentFeedback === "fire"} onClick={() => setFeedback("fire")}>
            <Flame className="h-5 w-5" />
          </FeedbackBtn>
          <FeedbackBtn label="Good" active={currentFeedback === "thumb"} onClick={() => setFeedback("thumb")}>
            <ThumbsUp className="h-5 w-5" />
          </FeedbackBtn>
          <FeedbackBtn label="Neutral" active={currentFeedback === "shrug"} onClick={() => setFeedback("shrug")}>
            <span className="text-lg leading-none">🤷</span>
          </FeedbackBtn>
          <FeedbackBtn label="Bad" active={currentFeedback === "x"} onClick={() => setFeedback("x")}>
            <XIcon className="h-5 w-5" />
          </FeedbackBtn>
        </div>
      </div>

      {/* Notes / qualitative feedback */}
      <div className="rounded-3xl bg-surface border border-border p-5 slide-up">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs uppercase tracking-widest text-gold font-medium">Your Notes</p>
          {noteSaved && <span className="text-[10px] text-gold">Saved ✓</span>}
        </div>
        <p className="text-xs text-muted-foreground mb-3">
          How did the prompt land? Did the action work? Anything to remember for next time.
        </p>
        <textarea
          value={currentNotes}
          onChange={(e) => setNoteDraft(e.target.value)}
          placeholder="e.g. She lit up — said it was exactly what she needed."
          rows={3}
          className="w-full resize-none rounded-2xl bg-surface-elevated border border-border p-3 text-sm leading-relaxed placeholder:text-muted-foreground/60 focus:outline-none focus:border-gold/50 transition"
        />
        <div className="mt-3 flex justify-end">
          <Button
            size="sm"
            className="gold-gradient text-gold-foreground"
            onClick={saveNotes}
            disabled={noteDraft === null || noteDraft === (todayLog?.notes ?? "")}
          >
            Save note
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <Stat label="Cumulative Success" value={`${cumulativeRate}%`} />
        <Stat label="This Week" value={`${weekRate}%`} />
        <Stat label="Current Streak" value={`${streak}d`} />
        <Stat label="Total Prompts" value={`${totalPrompts}`} />
      </div>

      {/* Success by phase */}
      <div className="rounded-3xl bg-surface border border-border p-5">
        <p className="text-xs uppercase tracking-widest text-gold font-medium mb-4">Success by Phase</p>
        <div className="flex items-end justify-between gap-2 h-44 px-1">
          {phaseStats.map((s) => {
            const h = s.count ? Math.max(s.rate, 4) : 2;
            return (
              <div key={s.phase} className="flex-1 flex flex-col items-center gap-2 h-full">
                <span className="text-[10px] font-medium tabular-nums text-foreground/80">
                  {s.count ? `${s.rate}%` : "—"}
                </span>
                <div className="flex-1 w-full flex items-end">
                  <div
                    className="w-full rounded-t-lg transition-all"
                    style={{
                      height: `${h}%`,
                      background: s.count
                        ? `linear-gradient(180deg, ${s.meta.color}, color-mix(in oklab, ${s.meta.color} 50%, transparent))`
                        : "var(--surface-elevated)",
                      boxShadow: s.count ? `0 0 12px -2px color-mix(in oklab, ${s.meta.color} 60%, transparent)` : undefined,
                    }}
                  />
                </div>
                <div className="flex flex-col items-center gap-0.5">
                  <span className="text-[10px] font-medium" style={{ color: s.meta.color }}>{s.phase}</span>
                  <span className="text-[9px] text-muted-foreground tabular-nums">n={s.count}</span>
                </div>
              </div>
            );
          })}
        </div>
        {rated.length === 0 && (
          <p className="text-xs text-muted-foreground mt-3">Rate a few prompts to see your patterns emerge.</p>
        )}
      </div>

      {/* SMS Card */}
      <div className="rounded-3xl bg-surface border border-border p-5">
        <p className="text-xs uppercase tracking-widest text-gold font-medium mb-2">Monthly Check-In</p>
        <p className="text-sm text-muted-foreground">Next poll sends on <span className="text-foreground font-medium">{nextSms.toLocaleDateString(undefined, { month: "long", day: "numeric" })}</span></p>
        <div className="mt-4 rounded-2xl bg-surface-elevated p-4 border border-border">
          <p className="text-xs text-muted-foreground mb-1">SMS preview</p>
          <p className="text-sm leading-relaxed">
            Hi {profile.herName || "Sarah"} 👋 Quick anonymous check-in from Attuned — how is {profile.yourName || "he"} doing lately? Reply 1–5. (5 = amazing) Also — is he getting your coffee right? You take: {profile.coffeeOrder || "—"}. Reply Y or N.
          </p>
        </div>
      </div>

      {/* Recent prompts */}
      <div className="rounded-3xl bg-surface border border-border p-5">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs uppercase tracking-widest text-gold font-medium">Recent Prompts</p>
        </div>
        <div className="space-y-3">
          {recent.length === 0 && <p className="text-sm text-muted-foreground">No history yet.</p>}
          {recent.map((l) => (
            <RecentRow key={l.date} log={l} />
          ))}
        </div>
        {logs.length > 5 && (
          <button
            onClick={() => setShowAll((s) => !s)}
            className="mt-4 text-xs text-gold tracking-wide"
          >
            {showAll ? "Show less ↑" : "See all prompts ↓"}
          </button>
        )}
      </div>

      {/* Days 1–5 preview */}
      <div className="rounded-3xl bg-surface border border-border p-5 space-y-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-gold font-medium">Days 1–5 Preview</p>
          <p className="text-xs text-muted-foreground mt-1">A peek at how the next five days unfold.</p>
        </div>
        {[1, 2, 3, 4, 5].map((d) => {
          const ph = phaseForDay(d, profile.cycleLength);
          const m = PHASE_META[ph];
          const text = getPromptForDay(d, variation, profile.cycleLength);
          const group = getActionGroupForDay(d, variation, profile.cycleLength);
          return (
            <div
              key={d}
              className="rounded-2xl border border-border p-4"
              style={{ background: `linear-gradient(160deg, color-mix(in oklab, ${m.color} 14%, var(--surface)), var(--surface))` }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full" style={{ background: m.color }} />
                  <span className="text-xs font-medium" style={{ color: m.color }}>Day {d} · {m.name}</span>
                </div>
              </div>
              <p className="text-sm leading-relaxed text-foreground/90">{text}</p>
              {group && (
                <div className="mt-3">
                  <ActionChips group={group} profile={profile} cycleDay={d} phase={ph} hidePaid={false} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Reset Modal */}
      <Dialog open={resetOpen} onOpenChange={setResetOpen}>
        <DialogContent className="bg-surface border-border">
          <DialogHeader>
            <DialogTitle>She started her period today?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">Confirm the start date — cycle restarts from Day 1.</p>
          <Input
            type="date"
            value={resetDate}
            min={todayISO(new Date(Date.now() - 7 * 86400000))}
            max={todayISO()}
            onChange={(e) => setResetDate(e.target.value)}
          />
          <DialogFooter>
            <Button variant="secondary" onClick={() => setResetOpen(false)}>Cancel</Button>
            <Button className="gold-gradient text-gold-foreground" onClick={onReset}>Confirm reset</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function FeedbackBtn({
  active,
  onClick,
  label,
  children,
}: {
  active?: boolean;
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1 rounded-2xl py-3 border transition ${
        active
          ? "bg-gold text-gold-foreground border-gold"
          : "bg-surface-elevated border-border text-foreground hover:border-gold/40"
      }`}
    >
      {children}
      <span className="text-[10px] tracking-wide">{label}</span>
    </button>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-surface border border-border p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-2xl font-semibold mt-1">{value}</p>
    </div>
  );
}

function RecentRow({ log }: { log: PromptLog }) {
  const meta = PHASE_META[log.phase as keyof typeof PHASE_META];
  const fb = log.feedback;
  const icon = fb === "fire" ? "🔥" : fb === "thumb" ? "👍" : fb === "shrug" ? "🤷" : fb === "x" ? "❌" : "·";
  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center pt-1 w-12 shrink-0">
        <span className="text-xs text-muted-foreground">Day</span>
        <span className="text-base font-semibold leading-none">{log.cycleDay}</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span
            className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full"
            style={{
              background: `color-mix(in oklab, ${meta?.color || "var(--gold)"} 25%, transparent)`,
              color: meta?.color || "var(--gold)",
            }}
          >
            {meta?.name || log.phase}
          </span>
          <span className="text-xs text-muted-foreground">{log.date}</span>
        </div>
        <p className="text-sm text-foreground/90 leading-snug line-clamp-2">{log.prompt}</p>
      </div>
      <div className="text-lg">{icon}</div>
    </div>
  );
}
