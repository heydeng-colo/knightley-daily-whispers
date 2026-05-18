import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { buildActionUrl, fillTemplate, isPaidAction, actionCost, type ActionDef, type DayActionGroup } from "@/lib/actions";
import { addSpend, setProfile as saveProfile, type Profile } from "@/lib/storage";
import type { Phase } from "@/lib/cycle";

interface Props {
  group: DayActionGroup;
  profile: Profile;
  cycleDay: number;
  phase: Phase;
  hidePaid: boolean;
  hidePaidReason?: string;
}

type ChipCategory = "dining" | "flowers" | "coffee" | "snack" | "phone";

const ASKED_KEY = "attuned.askedCategories";

function getAsked(): Record<string, boolean> {
  if (typeof window === "undefined") return {};
  try { return JSON.parse(localStorage.getItem(ASKED_KEY) || "{}"); } catch { return {}; }
}
function markAsked(cat: ChipCategory) {
  if (typeof window === "undefined") return;
  const cur = getAsked();
  cur[cat] = true;
  localStorage.setItem(ASKED_KEY, JSON.stringify(cur));
}

function categoryFor(a: ActionDef): ChipCategory | null {
  const p = a.param || "";
  if (a.kind === "RESY" || a.kind === "OPEN_TABLE" || p.includes("{restaurant}") || p.includes("{cuisine}")) return "dining";
  if (a.kind === "URBAN_STEMS" || a.kind === "FLOWERS_1800" || p.includes("{flowers}")) return "flowers";
  if (p.includes("{coffeeOrder}")) return "coffee";
  if (p.includes("{snack}")) return "snack";
  return null;
}

export function ActionChips({ group, profile, cycleDay, phase, hidePaid, hidePaidReason }: Props) {
  const [smsAction, setSmsAction] = useState<ActionDef | null>(null);
  const [draft, setDraft] = useState("");

  const [askPrompt, setAskPrompt] = useState<{ category: ChipCategory; action: ActionDef } | null>(null);
  const [formCuisine, setFormCuisine] = useState("");
  const [formRestaurant, setFormRestaurant] = useState("");
  const [formFlowers, setFormFlowers] = useState("");
  const [formCoffee, setFormCoffee] = useState("");
  const [formSnack, setFormSnack] = useState("");
  const [formPhone, setFormPhone] = useState("");

  // Always show the full action set so chips remain visible after a tap —
  // guardrails surface as an informational note (hidePaidReason) rather than
  // removing pills the user may want to revisit.
  const visible = group.actions.slice(0, 3);

  const openSmsModal = (a: ActionDef, p: Profile) => {
    setSmsAction(a);
    setDraft(fillTemplate(a.message || "", p));
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

  const executeAction = (a: ActionDef, p: Profile) => {
    if (a.kind === "SMS_DRAFT" || a.kind === "WHATSAPP") {
      if (!p.herPhone) {
        setFormPhone("");
        setAskPrompt({ category: "phone", action: a });
        return;
      }
      openSmsModal(a, p); return;
    }
    logAndOpen(a, buildActionUrl(a, p));
  };

  const handleClick = (a: ActionDef, disabled: boolean) => {
    if (disabled) return;
    const cat = categoryFor(a);
    if (cat && !getAsked()[cat]) {
      setFormCuisine(profile.cuisine || "");
      setFormRestaurant(profile.restaurant || "");
      setFormFlowers(profile.flowers || "");
      setFormCoffee(profile.coffeeOrder || "");
      setFormSnack(profile.favoriteSnack || "");
      setAskPrompt({ category: cat, action: a });
      return;
    }
    executeAction(a, profile);
  };

  const submitAsk = () => {
    if (!askPrompt) return;
    const updated: Profile = {
      ...profile,
      cuisine: formCuisine.trim() || profile.cuisine,
      restaurant: formRestaurant.trim() || profile.restaurant,
      flowers: formFlowers.trim() || profile.flowers,
      coffeeOrder: formCoffee.trim() || profile.coffeeOrder,
      favoriteSnack: formSnack.trim() || profile.favoriteSnack,
    };
    saveProfile(updated);
    markAsked(askPrompt.category);
    const action = askPrompt.action;
    setAskPrompt(null);
    executeAction(action, updated);
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

      <Dialog open={!!askPrompt} onOpenChange={(o) => !o && setAskPrompt(null)}>
        <DialogContent className="bg-surface border-border">
          <DialogHeader>
            <DialogTitle>
              {askPrompt?.category === "dining" && "Her dining preferences"}
              {askPrompt?.category === "flowers" && "Her favorite flowers"}
              {askPrompt?.category === "coffee" && "Her coffee order"}
              {askPrompt?.category === "snack" && "Her favorite snack"}
            </DialogTitle>
            <DialogDescription>
              Quick one-time question so future suggestions land. We'll remember it.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            {askPrompt?.category === "dining" && (
              <>
                <div className="space-y-1.5">
                  <Label htmlFor="ask-cuisine">Favorite cuisine</Label>
                  <Input id="ask-cuisine" value={formCuisine} onChange={(e) => setFormCuisine(e.target.value)} placeholder="Italian, sushi, Thai…" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="ask-restaurant">Favorite restaurant</Label>
                  <Input id="ask-restaurant" value={formRestaurant} onChange={(e) => setFormRestaurant(e.target.value)} placeholder="The spot she always picks" />
                </div>
              </>
            )}
            {askPrompt?.category === "flowers" && (
              <div className="space-y-1.5">
                <Label htmlFor="ask-flowers">Favorite flower type</Label>
                <Input id="ask-flowers" value={formFlowers} onChange={(e) => setFormFlowers(e.target.value)} placeholder="Peonies, tulips, ranunculus…" />
              </div>
            )}
            {askPrompt?.category === "coffee" && (
              <div className="space-y-1.5">
                <Label htmlFor="ask-coffee">Her coffee order</Label>
                <Input id="ask-coffee" value={formCoffee} onChange={(e) => setFormCoffee(e.target.value)} placeholder="Oat latte, no sugar…" />
              </div>
            )}
            {askPrompt?.category === "snack" && (
              <div className="space-y-1.5">
                <Label htmlFor="ask-snack">Her favorite snack</Label>
                <Input id="ask-snack" value={formSnack} onChange={(e) => setFormSnack(e.target.value)} placeholder="Dark chocolate, popcorn…" />
              </div>
            )}
          </div>

          <DialogFooter className="gap-2 sm:gap-2">
            <Button variant="secondary" onClick={() => { if (askPrompt) { markAsked(askPrompt.category); const a = askPrompt.action; setAskPrompt(null); executeAction(a, profile); } }}>
              Skip
            </Button>
            <Button className="gold-gradient text-gold-foreground" onClick={submitAsk}>
              Save & continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
