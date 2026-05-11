import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { LOVES_PART_1, LOVES_PART_2 } from "@/lib/loves";
import { clearAll, nextPollDate, type Profile } from "@/lib/storage";
import { useState } from "react";

export function ProfileScreen({ profile, setProfile }: { profile: Profile; setProfile: (p: Profile) => void }) {
  const [p, setP] = useState<Profile>(profile);
  const [showLoves, setShowLoves] = useState(false);

  const update = (patch: Partial<Profile>) => {
    const next = { ...p, ...patch };
    setP(next);
    setProfile(next);
  };

  const allLoves = [...LOVES_PART_1, ...LOVES_PART_2];

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-semibold pt-2">Profile</h1>

      <Section title="About her">
        <Field label="Her name"><Input value={p.herName} onChange={(e) => update({ herName: e.target.value })} /></Field>
        <Field label="Her birthday"><Input type="date" value={p.herBirthday} onChange={(e) => update({ herBirthday: e.target.value })} /></Field>
        <Field label="Anniversary"><Input type="date" value={p.anniversary || ""} onChange={(e) => update({ anniversary: e.target.value })} /></Field>
        <Field label="Favorite flowers"><Input value={p.flowers} onChange={(e) => update({ flowers: e.target.value })} /></Field>
        <Field label="Favorite cuisine"><Input value={p.cuisine} onChange={(e) => update({ cuisine: e.target.value })} /></Field>
        <Field label="Favorite restaurant"><Input value={p.restaurant} onChange={(e) => update({ restaurant: e.target.value })} /></Field>
        <Field label="Favorite date night"><Input value={p.dateNight} onChange={(e) => update({ dateNight: e.target.value })} /></Field>
        <Field label="Coffee order"><Input value={p.coffeeOrder} onChange={(e) => update({ coffeeOrder: e.target.value })} /></Field>
        <Field label="Favorite snack or treat"><Input value={p.favoriteSnack || ""} onChange={(e) => update({ favoriteSnack: e.target.value })} /></Field>
        <Field label="Her cellphone"><Input type="tel" value={p.herPhone} onChange={(e) => update({ herPhone: e.target.value })} /></Field>
      </Section>

      <Section title="Her cycle">
        <p className="text-xs text-muted-foreground">Updating these recalculates all future prompts.</p>
        <Field label="Last period start"><Input type="date" value={p.lastPeriodStart} onChange={(e) => update({ lastPeriodStart: e.target.value })} /></Field>
        <Field label={`Cycle length: ${p.cycleLength} days`}>
          <input type="range" min={21} max={40} value={p.cycleLength} onChange={(e) => update({ cycleLength: parseInt(e.target.value) })} className="w-full accent-[var(--gold)]" />
        </Field>
      </Section>

      <Section title="What she loves">
        <Button variant="secondary" onClick={() => setShowLoves((s) => !s)}>
          {showLoves ? "Hide list" : `Edit (${p.loves.length} selected)`}
        </Button>
        {showLoves && (
          <div className="flex flex-wrap gap-2 mt-3">
            {allLoves.map((item, idx) => {
              const on = p.loves.includes(idx);
              return (
                <button
                  key={idx}
                  onClick={() => update({ loves: on ? p.loves.filter((x) => x !== idx) : [...p.loves, idx] })}
                  className={`rounded-full px-3 py-1.5 text-[11px] border transition leading-snug ${
                    on ? "bg-gold text-gold-foreground border-gold" : "bg-surface-elevated border-border"
                  }`}
                >
                  {item}
                </button>
              );
            })}
          </div>
        )}
      </Section>

      <Section title="Notifications">
        <Toggle label="Daily morning prompt (8am)" checked={p.notifications} onChange={(v) => update({ notifications: v })} />
      </Section>

      <Section title="SMS Polling">
        <Toggle label="Monthly check-in poll" checked={p.smsPolling} onChange={(v) => update({ smsPolling: v })} />
        <p className="text-xs text-muted-foreground">Next send: {new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toLocaleDateString()}</p>
        <div className="rounded-2xl bg-surface-elevated p-3 border border-border text-sm leading-relaxed">
          Hi {p.herName} 👋 Quick anonymous check-in from Attuned — how is he doing lately? Reply 1–5. Also — is he getting your coffee right? You take: {p.coffeeOrder || "—"}. Reply Y or N.
        </div>
      </Section>

      <Section title="Danger zone">
        <Button
          variant="destructive"
          onClick={() => {
            if (confirm("Delete all data and restart onboarding?")) {
              clearAll();
              location.reload();
            }
          }}
        >
          Reset everything
        </Button>
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-3xl bg-surface border border-border p-5 space-y-3">
      <p className="text-xs uppercase tracking-widest text-gold font-medium">{title}</p>
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm">{label}</span>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}
