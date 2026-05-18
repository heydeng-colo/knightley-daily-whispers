import { useEffect, useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { setProfile, type Profile } from "@/lib/storage";
import { Sparkles } from "lucide-react";

interface QA {
  key: string;
  prompt: string;
  options: string[];
}

const QUESTIONS: QA[] = [
  {
    key: "loveLanguage",
    prompt: "When she feels most loved, it's usually because…",
    options: ["You said something thoughtful", "You did something for her", "You spent real time together"],
  },
  {
    key: "stressResponse",
    prompt: "When she's stressed, what helps most?",
    options: ["Space and quiet", "You take something off her plate", "Physical closeness — a hug, hand-hold"],
  },
  {
    key: "surpriseStyle",
    prompt: "Her ideal kind of surprise is…",
    options: ["Small + frequent", "Big + rare", "She prefers a heads-up — not surprises"],
  },
  {
    key: "communicationStyle",
    prompt: "When something's bothering her, she usually…",
    options: ["Says it directly", "Hints at it", "Goes quiet — you have to ask"],
  },
  {
    key: "dateEnergy",
    prompt: "Best date night for her right now?",
    options: ["Cozy + at home", "Out somewhere new", "Active — a walk, class, adventure"],
  },
];

// Show after 3 days of activation, only if not answered and not dismissed.
export function shouldShowMiniQuiz(profile: Profile, today: Date = new Date()): boolean {
  if (profile.miniQuiz || profile.miniQuizDismissed) return false;
  if (!profile.activatedAt) return false;
  const activated = new Date(profile.activatedAt);
  const days = Math.floor((today.getTime() - activated.getTime()) / (24 * 60 * 60 * 1000));
  return days >= 3;
}

export function MiniQuiz({ profile }: { profile: Profile }) {
  const open = useMemo(() => shouldShowMiniQuiz(profile), [profile]);
  const [visible, setVisible] = useState(open);
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  useEffect(() => {
    setVisible(open);
  }, [open]);

  if (!visible) return null;
  const q = QUESTIONS[idx];
  const last = idx === QUESTIONS.length - 1;

  const pick = (opt: string) => {
    const nextAnswers = { ...answers, [q.key]: opt };
    setAnswers(nextAnswers);
    if (last) {
      setProfile({ ...profile, miniQuiz: nextAnswers });
      setVisible(false);
    } else {
      setIdx((i) => i + 1);
    }
  };

  const skip = () => {
    setProfile({ ...profile, miniQuizDismissed: true });
    setVisible(false);
  };

  return (
    <Dialog open={visible} onOpenChange={(o) => { if (!o) skip(); }}>
      <DialogContent className="bg-surface border-border max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="h-4 w-4 text-gold" />
            <span className="text-[11px] tracking-widest uppercase text-gold font-medium">
              Quick tune-up · {idx + 1} / {QUESTIONS.length}
            </span>
          </div>
          <DialogTitle className="text-left leading-snug">{q.prompt}</DialogTitle>
        </DialogHeader>

        <div className="flex gap-1.5 mb-1">
          {QUESTIONS.map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full ${i <= idx ? "bg-gold" : "bg-surface-elevated"}`}
            />
          ))}
        </div>

        <div className="space-y-2 mt-2">
          {q.options.map((opt) => (
            <button
              key={opt}
              onClick={() => pick(opt)}
              className="w-full text-left rounded-2xl border border-border bg-surface-elevated px-4 py-3 text-sm hover:border-gold/50 hover:bg-gold/5 transition"
            >
              {opt}
            </button>
          ))}
        </div>

        <div className="flex justify-between items-center pt-2">
          <button onClick={skip} className="text-xs text-muted-foreground hover:text-foreground transition">
            Not now
          </button>
          <p className="text-[10px] text-muted-foreground">
            5 quick taps · sharpens your daily prompts
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
