import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { getProfile, setProfile, useClientReady, CYCLE_PAUSE_REASON_LABEL, type CyclePauseReason } from "@/lib/storage";
import { Calendar, Clock, Star, AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/pause-cycle")({
  head: () => ({ meta: [{ title: "Pause cycle attunement — Attuned" }] }),
  component: PauseCycleRoute,
});

const REASONS: Array<{ value: CyclePauseReason; label: string; sub: string }> = [
  { value: "pregnancy", label: "Pregnancy", sub: "We'll adjust prompts for this season" },
  { value: "menopause", label: "Menopause", sub: "Prompts will shift to a consistent rhythm" },
  { value: "irregular", label: "Irregular cycle", sub: "We'll use your feedback to guide timing instead" },
  { value: "no_cycle", label: "No cycle tracking", sub: "Prompts will run on a relationship rhythm" },
  { value: "other", label: "Other", sub: "We'll use recurring relationship best practices" },
];

function PauseCycleRoute() {
  const ready = useClientReady();
  const navigate = useNavigate();
  const [step, setStep] = useState<"reason" | "explain">("reason");
  const [reason, setReason] = useState<CyclePauseReason | null>(null);

  if (!ready) return <div className="min-h-dvh bg-background" />;
  const profile = getProfile();
  if (!profile) {
    navigate({ to: "/" });
    return null;
  }

  const goHome = () => navigate({ to: "/" });

  const confirmPause = () => {
    if (!reason) return;
    setProfile({ ...profile, cycleMode: "paused", cyclePauseReason: reason });
    goHome();
  };

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <div className="mx-auto max-w-md px-5 pt-10 pb-16">
        {step === "reason" ? (
          <div className="space-y-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold text-white" style={{ fontFamily: "Georgia, serif" }}>Before we pause</h1>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Help us understand so we can keep your prompts as relevant as possible.
              </p>
            </div>

            <div className="space-y-3">
              {REASONS.map((r) => {
                const on = reason === r.value;
                return (
                  <button
                    key={r.value}
                    onClick={() => setReason(r.value)}
                    className={`w-full text-left rounded-2xl p-4 bg-surface transition border ${
                      on ? "border-transparent" : "border-border hover:border-gold/40"
                    }`}
                    style={on ? { borderLeft: "4px solid var(--gold)", borderTop: "1px solid var(--border)", borderRight: "1px solid var(--border)", borderBottom: "1px solid var(--border)" } : {}}
                  >
                    <div className="text-sm font-medium text-white">{r.label}</div>
                    <div className="text-[13px] text-muted-foreground mt-0.5">{r.sub}</div>
                  </button>
                );
              })}
            </div>

            <div className="space-y-3 pt-2">
              <Button
                className="w-full gold-gradient text-gold-foreground hover:opacity-90"
                disabled={!reason}
                onClick={() => setStep("explain")}
              >
                Continue →
              </Button>
              <button
                onClick={goHome}
                className="w-full text-sm text-muted-foreground hover:text-foreground transition py-2"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <h1 className="text-3xl font-semibold text-white" style={{ fontFamily: "Georgia, serif" }}>Here's what changes</h1>

            <div className="space-y-3">
              <ExplainerCard
                icon={<Calendar className="h-4 w-4 text-gold" />}
                title="Daily prompts continue"
                body="You'll still receive one action every day. Prompts will now follow a recurring relationship rhythm — rotating through connection, care, quality time, and small gestures on a consistent cycle."
              />
              <ExplainerCard
                icon={<Clock className="h-4 w-4 text-gold" />}
                title="Interval awareness"
                body="Attuned will watch for patterns — if it's been a while since a date night, a meaningful conversation, or a gesture she loves, it'll surface that naturally."
              />
              <ExplainerCard
                icon={<Star className="h-4 w-4 text-gold" />}
                title="Milestones still matter"
                body="Birthdays, anniversaries, and relationship milestones stay in the app. You'll still get prompts ahead of moments that matter."
              />
            </div>

            <div
              className="flex gap-3 items-start"
              style={{
                background: "rgba(201,168,76,0.1)",
                border: "1px solid rgba(201,168,76,0.3)",
                borderRadius: 4,
                padding: "14px 16px",
              }}
            >
              <AlertTriangle className="h-4 w-4 text-gold shrink-0 mt-0.5" />
              <p className="text-[13px] italic text-gold leading-relaxed">
                Cycle attunement will be paused. Prompts won't be timed to her biology until you resume. You can resume at any time from your profile.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <Button
                className="w-full gold-gradient text-gold-foreground hover:opacity-90 font-semibold"
                onClick={confirmPause}
              >
                Pause cycle attunement
              </Button>
              <button
                onClick={() => setStep("reason")}
                className="w-full text-sm text-muted-foreground hover:text-foreground transition py-2"
              >
                Go back
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ExplainerCard({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div
      className="rounded-2xl bg-surface p-4"
      style={{ borderLeft: "3px solid var(--gold)", borderTop: "1px solid var(--border)", borderRight: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}
    >
      <div className="flex items-center gap-2 mb-1">
        {icon}
        <span className="text-sm font-medium text-white">{title}</span>
      </div>
      <p className="text-[13px] text-muted-foreground leading-relaxed">{body}</p>
    </div>
  );
}
