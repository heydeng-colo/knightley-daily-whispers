import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GOALS, LOVES_PART_1, LOVES_PART_2 } from "@/lib/loves";
import { setProfile, SPEND_TIER_LABEL, type Profile, type SpendTier } from "@/lib/storage";
import { ArrowLeft, ArrowRight, Plus, Trash2, Heart } from "lucide-react";

const STEPS = ["About", "Cycle", "Goals", "Loves 1", "Loves 2"];

export function Onboarding({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<Partial<Profile>>({
    children: [],
    cycleLength: 28,
    stage: "Married",
    relLengthMonths: 12,
    goals: [],
    loves: [],
    notifications: true,
    smsPolling: true,
    spendTier: "50",
  });

  const update = (patch: Partial<Profile>) => setData((d) => ({ ...d, ...patch }));

  const next = () => setStep((s) => Math.min(STEPS.length - 1, s + 1));
  const back = () => setStep((s) => Math.max(0, s - 1));

  const finish = () => {
    const profile: Profile = {
      herName: data.herName || "",
      herBirthday: data.herBirthday || "",
      anniversary: data.anniversary,
      children: data.children || [],
      stage: data.stage || "Married",
      relLengthMonths: data.relLengthMonths || 0,
      flowers: data.flowers || "",
      cuisine: data.cuisine || "",
      restaurant: data.restaurant || "",
      dateNight: data.dateNight || "",
      coffeeOrder: data.coffeeOrder || "",
      favoriteSnack: data.favoriteSnack || "",
      herPhone: data.herPhone || "",
      cycleLength: data.cycleLength || 28,
      lastPeriodStart: data.lastPeriodStart || new Date().toISOString().slice(0, 10),
      goals: data.goals || [],
      loves: data.loves || [],
      notifications: data.notifications ?? true,
      smsPolling: data.smsPolling ?? true,
      spendTier: data.spendTier || "50",
      monthlyBudgetCap: data.monthlyBudgetCap,
    };
    setProfile(profile);
    onDone();
  };

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <div className="mx-auto max-w-md px-5 pt-10 pb-28">
        {/* Header */}
        <div className="flex items-center gap-2 mb-2">
          <Heart className="h-5 w-5 text-gold" />
          <span className="text-sm tracking-widest uppercase text-muted-foreground">Attuned</span>
        </div>
        <h1 className="text-2xl font-semibold mb-6">Let's get you set up</h1>

        {/* Progress */}
        <div className="flex gap-1.5 mb-8">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-all ${
                i <= step ? "bg-gold" : "bg-surface-elevated"
              }`}
            />
          ))}
        </div>

        <div key={step} className="slide-up">
          {step === 0 && <Step1 data={data} update={update} />}
          {step === 1 && <Step2 data={data} update={update} />}
          {step === 2 && <Step3 data={data} update={update} />}
          {step === 3 && <Step4 data={data} update={update} part={1} />}
          {step === 4 && <Step4 data={data} update={update} part={2} />}
        </div>
      </div>

      {/* Sticky footer */}
      <div className="fixed bottom-0 inset-x-0 glass border-t border-border">
        <div className="mx-auto max-w-md px-5 py-4 flex gap-3">
          {step > 0 && (
            <Button variant="secondary" className="flex-1" onClick={back}>
              <ArrowLeft className="h-4 w-4 mr-1" /> Back
            </Button>
          )}
          {step < STEPS.length - 1 ? (
            <Button className="flex-1 gold-gradient text-gold-foreground hover:opacity-90" onClick={next}>
              Next <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          ) : (
            <Button className="flex-1 gold-gradient text-gold-foreground hover:opacity-90" onClick={finish}>
              Finish Setup
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}

function Step1({ data, update }: { data: Partial<Profile>; update: (p: Partial<Profile>) => void }) {
  const children = data.children || [];
  return (
    <div className="space-y-5">
      <h2 className="text-xl font-medium">About your relationship</h2>
      <Field label="Her name">
        <Input value={data.herName || ""} onChange={(e) => update({ herName: e.target.value })} placeholder="e.g. Sarah" />
      </Field>
      <Field label="Her birthday">
        <Input type="date" value={data.herBirthday || ""} onChange={(e) => update({ herBirthday: e.target.value })} />
      </Field>
      <Field label="Your anniversary (optional)">
        <Input type="date" value={data.anniversary || ""} onChange={(e) => update({ anniversary: e.target.value })} />
      </Field>

      <div className="space-y-2">
        <Label className="text-sm text-muted-foreground">Kids (optional)</Label>
        {children.map((c, i) => (
          <div key={i} className="flex gap-2 items-center">
            <Input
              className="w-28"
              placeholder="First name"
              value={c.name}
              onChange={(e) => {
                const arr = [...children];
                arr[i] = { ...arr[i], name: e.target.value };
                update({ children: arr });
              }}
            />
            <Input
              type="date"
              value={c.birthday}
              onChange={(e) => {
                const arr = [...children];
                arr[i] = { ...arr[i], birthday: e.target.value };
                update({ children: arr });
              }}
            />
            <Button
              size="icon"
              variant="ghost"
              onClick={() => update({ children: children.filter((_, j) => j !== i) })}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        {children.length < 6 && (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => update({ children: [...children, { name: "", birthday: "" }] })}
          >
            <Plus className="h-4 w-4 mr-1" /> Add child
          </Button>
        )}
      </div>

      <Field label="Relationship stage">
        <div className="grid grid-cols-3 gap-2">
          {(["Dating", "Engaged", "Married"] as const).map((s) => (
            <button
              key={s}
              onClick={() => update({ stage: s })}
              className={`rounded-xl py-2.5 text-sm border transition ${
                data.stage === s
                  ? "bg-gold text-gold-foreground border-gold"
                  : "bg-surface border-border text-foreground"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Years together">
          <Input
            type="number"
            min={0}
            step="0.5"
            value={data.relLengthMonths ? +(data.relLengthMonths / 12).toFixed(2) : 0}
            onChange={(e) => update({ relLengthMonths: Math.round((parseFloat(e.target.value) || 0) * 12) })}
          />
        </Field>
        <Field label="…or months">
          <Input
            type="number"
            min={0}
            value={data.relLengthMonths ?? 0}
            onChange={(e) => update({ relLengthMonths: parseInt(e.target.value) || 0 })}
          />
        </Field>
      </div>

      <Field label="Favorite flowers"><Input value={data.flowers || ""} onChange={(e) => update({ flowers: e.target.value })} /></Field>
      <Field label="Favorite cuisine"><Input value={data.cuisine || ""} onChange={(e) => update({ cuisine: e.target.value })} /></Field>
      <Field label="Favorite restaurant"><Input value={data.restaurant || ""} onChange={(e) => update({ restaurant: e.target.value })} /></Field>
      <Field label="Favorite date night"><Input value={data.dateNight || ""} onChange={(e) => update({ dateNight: e.target.value })} /></Field>
      <Field label="Favorite snack or treat">
        <Input value={data.favoriteSnack || ""} onChange={(e) => update({ favoriteSnack: e.target.value })} placeholder="e.g. dark chocolate, salt & vinegar chips" />
      </Field>
      <Field label="Favorite coffee order">
        <Input value={data.coffeeOrder || ""} onChange={(e) => update({ coffeeOrder: e.target.value })} placeholder="e.g. oat milk latte" />
      </Field>

      <Field label="Her cellphone (for monthly check-in)">
        <Input
          type="tel"
          value={data.herPhone || ""}
          onChange={(e) => update({ herPhone: e.target.value })}
          placeholder="(555) 123-4567"
        />
        <p className="text-xs text-muted-foreground mt-1">Used once a month to check in with her anonymously.</p>
      </Field>

      <Field label={`Average cycle length: ${data.cycleLength} days`}>
        <input
          type="range"
          min={21}
          max={40}
          value={data.cycleLength || 28}
          onChange={(e) => update({ cycleLength: parseInt(e.target.value) })}
          className="w-full accent-[var(--gold)]"
        />
      </Field>

      <div className="space-y-2 pt-2">
        <Label className="text-sm text-muted-foreground">Monthly spend comfort</Label>
        <div className="grid grid-cols-2 gap-2">
          {(Object.keys(SPEND_TIER_LABEL) as SpendTier[]).map((t) => (
            <button
              key={t}
              onClick={() => update({ spendTier: t })}
              className={`rounded-xl py-2.5 px-3 text-xs border transition text-left ${
                (data.spendTier || "50") === t
                  ? "bg-gold text-gold-foreground border-gold"
                  : "bg-surface border-border text-foreground"
              }`}
            >
              {SPEND_TIER_LABEL[t]}
            </button>
          ))}
        </div>
      </div>
      <Field label="Monthly budget cap (optional)">
        <Input
          type="number"
          min={0}
          placeholder="e.g. 100"
          value={data.monthlyBudgetCap ?? ""}
          onChange={(e) => update({ monthlyBudgetCap: e.target.value ? parseInt(e.target.value) : undefined })}
        />
        <p className="text-xs text-muted-foreground mt-1">When you hit this, paid suggestions pause until next month.</p>
      </Field>
    </div>
  );
}

function Step2({ data, update }: { data: Partial<Profile>; update: (p: Partial<Profile>) => void }) {
  const today = new Date();
  const start = data.lastPeriodStart ? new Date(data.lastPeriodStart) : today;
  const ms = 24 * 60 * 60 * 1000;
  const diff = Math.max(0, Math.floor((today.getTime() - start.getTime()) / ms));
  const day = (diff % (data.cycleLength || 28)) + 1;
  const length = data.cycleLength || 28;
  const pct = Math.min(100, (day / length) * 100);
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-medium">Her cycle</h2>
      <Field label="When did her last period start?">
        <Input
          type="date"
          value={data.lastPeriodStart || ""}
          onChange={(e) => update({ lastPeriodStart: e.target.value })}
          max={new Date().toISOString().slice(0, 10)}
        />
      </Field>
      <Field label={`Cycle length: ${length} days`}>
        <input
          type="range"
          min={21}
          max={40}
          value={length}
          onChange={(e) => update({ cycleLength: parseInt(e.target.value) })}
          className="w-full accent-[var(--gold)]"
        />
      </Field>
      {data.lastPeriodStart && (
        <div className="rounded-2xl bg-surface p-5 border border-border">
          <p className="text-sm text-muted-foreground mb-2">Estimated current day</p>
          <p className="text-3xl font-semibold">Day {day}</p>
          <div className="mt-4 h-2 rounded-full bg-surface-elevated overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{
                width: `${pct}%`,
                background: "linear-gradient(90deg, var(--phase-menstrual), var(--phase-follicular), var(--phase-ovulatory), var(--phase-early-luteal), var(--phase-late-luteal))",
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function Step3({ data, update }: { data: Partial<Profile>; update: (p: Partial<Profile>) => void }) {
  const goals = data.goals || [];
  const toggle = (g: string) =>
    update({ goals: goals.includes(g) ? goals.filter((x) => x !== g) : [...goals, g] });
  return (
    <div className="space-y-5">
      <h2 className="text-xl font-medium">Your goals</h2>
      <p className="text-sm text-muted-foreground">Select all that apply.</p>
      <div className="grid grid-cols-2 gap-3">
        {GOALS.map((g) => {
          const on = goals.includes(g);
          return (
            <button
              key={g}
              onClick={() => toggle(g)}
              className={`rounded-2xl p-4 text-left text-sm border transition ${
                on
                  ? "bg-gold text-gold-foreground border-gold"
                  : "bg-surface border-border text-foreground"
              }`}
            >
              {g}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Step4({
  data,
  update,
  part,
}: {
  data: Partial<Profile>;
  update: (p: Partial<Profile>) => void;
  part: 1 | 2;
}) {
  const list = part === 1 ? LOVES_PART_1 : LOVES_PART_2;
  const offset = part === 1 ? 0 : LOVES_PART_1.length;
  const loves = data.loves || [];
  const toggle = (idx: number) =>
    update({ loves: loves.includes(idx) ? loves.filter((x) => x !== idx) : [...loves, idx] });
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-medium">
        {part === 1 ? "Which of these does she appreciate?" : "Almost done — a few more."}
      </h2>
      <p className="text-sm text-muted-foreground">Select all that apply.</p>
      <div className="flex flex-wrap gap-2">
        {list.map((item, i) => {
          const idx = offset + i;
          const on = loves.includes(idx);
          return (
            <button
              key={idx}
              onClick={() => toggle(idx)}
              className={`rounded-full px-3.5 py-2 text-xs border transition text-left leading-snug ${
                on
                  ? "bg-gold text-gold-foreground border-gold"
                  : "bg-surface border-border text-foreground"
              }`}
            >
              {item}
            </button>
          );
        })}
      </div>
    </div>
  );
}
