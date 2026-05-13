import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { buildActionUrl, fillTemplate, isPaidAction, actionCost, type ActionDef, type DayActionGroup } from "@/lib/actions";
import { addSpend, type Profile } from "@/lib/storage";
import type { Phase } from "@/lib/cycle";

interface Props {
  group: DayActionGroup;
  profile: Profile;
  cycleDay: number;
  phase: Phase;
  hidePaid: boolean;
  hidePaidReason?: string;
}

export function ActionChips({ group, profile, cycleDay, phase, hidePaid, hidePaidReason }: Props) {
  const [smsAction, setSmsAction] = useState<ActionDef | null>(null);
  const [draft, setDraft] = useState("");

  // Always surface at least one actionable transaction pill by default —
  // even when guardrails would otherwise hide all paid chips, keep the first
  // paid action visible so the example prompt always has a tappable next step.
  const filtered = group.actions.filter((a) => (hidePaid ? !isPaidAction(a) : true));
  const firstPaid = group.actions.find((a) => isPaidAction(a));
  if (hidePaid && firstPaid && !filtered.some((a) => a.kind === firstPaid.kind)) {
    filtered.unshift(firstPaid);
  }
  const visible = filtered.slice(0, 3);

  const openSmsModal = (a: ActionDef) => {
    setSmsAction(a);
    setDraft(fillTemplate(a.message || "", profile));
  };

  const logAndOpen = (a: ActionDef, url: string) => {
    const cost = actionCost(a);
    if (cost > 0 || a.kind === "OPEN_TABLE" || a.kind === "RESY") {
      addSpend({
        date: new Date().toISOString().slice(0, 10),
        cycleDay,
        phase,
        kind: a.kind,
        label: a.label,
        cost,
      });
    }
    window.open(url, "_blank", "noopener");
  };

  const handleClick = (a: ActionDef, disabled: boolean) => {
    if (disabled) return;
    if (a.kind === "SMS_DRAFT" || a.kind === "WHATSAPP") { openSmsModal(a); return; }
    logAndOpen(a, buildActionUrl(a, profile));
  };

  const sendSms = (kind: "SMS_DRAFT" | "WHATSAPP") => {
    if (!smsAction) return;
    const url = buildActionUrl({ ...smsAction, kind }, profile, draft);
    window.open(url, "_blank", "noopener");
    setSmsAction(null);
  };

  if (!visible.length && !group.freeAlt) return null;

  const single = visible.length === 1;

  return (
    <>
      {visible.length > 0 && (
        <div className={`flex flex-wrap gap-2 ${single ? "justify-center" : ""}`}>
          {visible.map((a, i) => {
            const disabled = !!a.requires && !profile[a.requires];
            return (
              <button
                key={i}
                onClick={() => handleClick(a, disabled)}
                disabled={disabled}
                title={disabled ? "Add this in Profile to unlock" : undefined}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-medium border transition ${
                  disabled
                    ? "bg-surface-elevated/50 border-border text-muted-foreground/40 cursor-not-allowed opacity-40"
                    : "bg-gold/10 border-gold/30 text-gold hover:bg-gold/20 active:scale-95"
                }`}
              >
                {disabled && <span className="text-[10px] mr-0.5">🔒</span>}
                <span className="text-sm leading-none">{a.icon}</span>
                <span>{a.label}</span>
              </button>
            );
          })}
        </div>
      )}

      <p className="mt-2.5 text-[11px] text-muted-foreground/80 leading-snug">
        <span className="text-muted-foreground/60">Or do it yourself →</span> {fillTemplate(group.freeAlt, profile)}
      </p>

      {hidePaid && hidePaidReason && (
        <p className="mt-1.5 text-[10px] text-muted-foreground/60 italic">{hidePaidReason}</p>
      )}

      <Dialog open={!!smsAction} onOpenChange={(o) => !o && setSmsAction(null)}>
        <DialogContent className="bg-surface border-border">
          <DialogHeader>
            <DialogTitle>Message {profile.herName || "her"}</DialogTitle>
          </DialogHeader>
          {profile.herPhone ? (
            <>
              <p className="text-xs text-muted-foreground">Edit before sending — feel free to make it yours.</p>
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                rows={5}
                className="w-full resize-none rounded-2xl bg-surface-elevated border border-border p-3 text-sm leading-relaxed focus:outline-none focus:border-gold/50 transition"
              />
              <p className="text-[10px] text-muted-foreground">To: {profile.herPhone}</p>
              <DialogFooter className="gap-2 sm:gap-2">
                <Button variant="secondary" onClick={() => sendSms("SMS_DRAFT")}>Send via SMS</Button>
                <Button className="gold-gradient text-gold-foreground" onClick={() => sendSms("WHATSAPP")}>
                  Send via WhatsApp
                </Button>
              </DialogFooter>
            </>
          ) : (
            <>
              <p className="text-sm text-muted-foreground">Add her number in Profile to enable this.</p>
              <DialogFooter>
                <Button variant="secondary" onClick={() => setSmsAction(null)}>Close</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
