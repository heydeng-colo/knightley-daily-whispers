import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GOALS, LOVES_PART_1, LOVES_PART_2 } from "@/lib/loves";
import { LOVE_IMAGES } from "@/lib/loveImages";
import { BRAND_PREF_AFFINITIES, type BrandPreference } from "@/lib/affiliatePartners";
import { setProfile, type Profile, type SpendTier } from "@/lib/storage";
import { ArrowLeft, ArrowRight, Heart, Star, X as XIcon, Check } from "lucide-react";

const STEPS = ["About", "Her World", "Cycle", "Loves", "Account"];


export function Onboarding({ onDone, initialProfile }: { onDone: () => void; initialProfile?: Profile }) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<Partial<Profile>>({
    children: [],
    cycleLength: 28,
    stage: "Married",
    relLengthMonths: 12,
    relLengthYears: 1,
    goals: [],
    loves: [],
    notifications: true,
    smsPolling: true,
    spendTier: "50",
    brandPreference: "curated",
    brandAffinities: BRAND_PREF_AFFINITIES["curated"],
    ...initialProfile,
  });

  const update = (patch: Partial<Profile>) => setData((d) => ({ ...d, ...patch }));

  const next = () => setStep((s) => Math.min(STEPS.length - 1, s + 1));
  const back = () => setStep((s) => Math.max(0, s - 1));

  const emailValid = !!(data.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim()));

  const finish = () => {
    if (!emailValid) return;
    const profile: Profile = {
      email: (data.email || "").trim(),
      herName: data.herName || "",
      herBirthday: data.herBirthday || "",
      anniversary: data.anniversary,
      children: data.children || [],
      stage: data.stage || "Married",
      relLengthMonths: data.relLengthMonths || 0,
      relLengthYears: data.relLengthYears || 1,
      herZipCode: data.herZipCode || "",
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
      brandPreference: data.brandPreference || "curated",
      brandAffinities: data.brandAffinities || BRAND_PREF_AFFINITIES[data.brandPreference || "curated"],
    };
    setProfile(profile);
    onDone();
  };

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <div className="mx-auto max-w-md px-5 pt-10 pb-28">
        <div className="flex items-center gap-2 mb-2">
          <Heart className="h-5 w-5 text-gold" />
          <span className="text-sm tracking-widest uppercase text-muted-foreground">Attuned</span>
        </div>
        <h1 className="text-2xl font-semibold mb-6">Let's get you set up</h1>

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
          {step === 1 && <StepBrandPref data={data} update={update} />}
          {step === 2 && <Step2 data={data} update={update} />}
          {step === 3 && <StepLovesSwipe data={data} update={update} onFinish={next} />}
          {step === 4 && <StepAccount data={data} update={update} />}
        </div>
      </div>

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
            <Button
              className="flex-1 gold-gradient text-gold-foreground hover:opacity-90"
              onClick={finish}
              disabled={!emailValid}
            >
              Create Account
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function StepAccount({ data, update }: { data: Partial<Profile>; update: (p: Partial<Profile>) => void }) {
  return (
    <div className="space-y-5">
      <h2 className="text-xl font-medium">One last thing — your email</h2>
      <p className="text-sm text-muted-foreground leading-relaxed">
        We'll use this to save your setup and send your daily prompt. No spam, no sharing — ever.
      </p>
      <Field label="Your email address">
        <Input
          type="email"
          inputMode="email"
          autoComplete="email"
          value={data.email || ""}
          onChange={(e) => update({ email: e.target.value })}
          placeholder="you@example.com"
        />
      </Field>
      <p className="text-[11px] italic text-muted-foreground/70 leading-relaxed">
        Tap Create Account below to finish.
      </p>
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
  const goals = data.goals || [];
  const toggleGoal = (g: string) =>
    update({ goals: goals.includes(g) ? goals.filter((x) => x !== g) : [...goals, g] });

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-medium">About your relationship</h2>
      <p className="text-xs text-muted-foreground leading-relaxed">
        At Attuned, we value your privacy. We only ask for needed info, and even then, it's optional. We never share your data, with anyone.
      </p>
      <Field label="Her first initial (the first letter of her first name)">
        <Input
          value={data.herName || ""}
          onChange={(e) => update({ herName: e.target.value.slice(0, 1).toUpperCase() })}
          placeholder='e.g. "S"'
          maxLength={1}
        />
      </Field>
      <Field label="Her birthday (month and day)">
        <Input
          type="text"
          inputMode="numeric"
          value={data.herBirthday || ""}
          onChange={(e) => update({ herBirthday: e.target.value })}
          placeholder="MM-DD"
          maxLength={5}
          pattern="\d{2}-\d{2}"
        />
      </Field>
      <Field label="Your anniversary (month and day, optional)">
        <Input
          type="text"
          inputMode="numeric"
          value={data.anniversary || ""}
          onChange={(e) => update({ anniversary: e.target.value })}
          placeholder="MM-DD"
          maxLength={5}
          pattern="\d{2}-\d{2}"
        />
      </Field>

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

      <Field label="Her zip code">
        <Input
          value={data.herZipCode || ""}
          onChange={(e) => update({ herZipCode: e.target.value })}
          placeholder="e.g. 90210"
          maxLength={10}
        />
      </Field>

      <Field label={`Years together: ${data.relLengthYears === 30 ? "30+" : data.relLengthYears} year${data.relLengthYears === 1 ? "" : "s"}`}>
        <div className="rounded-2xl bg-surface border border-border p-5 space-y-4">
          <input
            type="range"
            min={1}
            max={30}
            step={1}
            value={data.relLengthYears || 1}
            onChange={(e) => update({ relLengthYears: parseInt(e.target.value) })}
            className="w-full accent-[var(--gold)]"
          />
          <div className="flex justify-between text-[10px] text-muted-foreground">
            <span>1 yr</span>
            <span>15 yrs</span>
            <span>30+ yrs</span>
          </div>
        </div>
      </Field>

      <div className="space-y-2 pt-2">
        <Label className="text-sm text-muted-foreground">What are your goals in this relationship?</Label>
        <div className="grid grid-cols-2 gap-3">
          {GOALS.map((g) => {
            const on = goals.includes(g);
            return (
              <button
                key={g}
                onClick={() => toggleGoal(g)}
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
      <Field label="When did her last period start? If you don't know, guess.">
        <Input
          type="date"
          value={data.lastPeriodStart || ""}
          onChange={(e) => update({ lastPeriodStart: e.target.value })}
          max={new Date().toISOString().slice(0, 10)}
        />
      </Field>
      <Field label={`How long is her typical cycle? If you don't know, guess or leave the default. (${length} days)`}>
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
      <Field label="Her cellphone (optional)">
        <Input
          type="tel"
          value={data.herPhone || ""}
          onChange={(e) => update({ herPhone: e.target.value })}
          placeholder="(555) 123-4567"
        />
        <p className="text-xs text-muted-foreground mt-1">
          Optional. Used to poll her anonymously for relationship feedback.
        </p>
      </Field>

      <div className="space-y-3 pt-2">
        <Label className="text-sm text-muted-foreground">Monthly spend comfort</Label>
        <div className="rounded-2xl bg-surface border border-border p-5 space-y-4">
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-semibold">
              ${data.monthlyBudgetCap ?? 50}
            </span>
            <span className="text-xs text-muted-foreground">per month</span>
          </div>
          <input
            type="range"
            min={0}
            max={300}
            step={25}
            value={data.monthlyBudgetCap ?? 50}
            onChange={(e) => {
              const val = parseInt(e.target.value);
              let tier: SpendTier = "free";
              if (val >= 150) tier = "150plus";
              else if (val >= 125) tier = "150";
              else if (val >= 75) tier = "100";
              else if (val >= 37) tier = "50";
              else if (val >= 12) tier = "25";
              update({ monthlyBudgetCap: val, spendTier: tier });
            }}
            className="w-full accent-[var(--gold)]"
          />
          <div className="flex justify-between text-[10px] text-muted-foreground">
            <span>$0</span>
            <span>$150</span>
            <span>$300+</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---- Swipe deck for "Loves" ----

const ALL_LOVES = [...LOVES_PART_1, ...LOVES_PART_2];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

type SwipeDir = "left" | "right" | "up" | null;

function StepLovesSwipe({
  data,
  update,
  onFinish,
}: {
  data: Partial<Profile>;
  update: (p: Partial<Profile>) => void;
  onFinish: () => void;
}) {
  // Stable shuffled order of indices into ALL_LOVES
  const deck = useMemo(() => shuffle(ALL_LOVES.map((_, i) => i)), []);
  const [pos, setPos] = useState(0);
  const [exiting, setExiting] = useState<SwipeDir>(null);
  const loves = data.loves || [];
  const total = deck.length;
  const TARGET_LIKES = 15;
  const targetMet = loves.length >= TARGET_LIKES;
  const done = pos >= total || targetMet;

  const decide = (dir: Exclude<SwipeDir, null>) => {
    if (exiting || targetMet) return;
    const idx = deck[pos];
    if (dir === "right" || dir === "up") {
      if (!loves.includes(idx)) update({ loves: [...loves, idx] });
    }
    setExiting(dir);
    setTimeout(() => {
      setExiting(null);
      setPos((p) => p + 1);
    }, 220);
  };

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-medium">What lands for her?</h2>
      <p className="text-sm text-muted-foreground">
        Swipe through. Tap <span className="text-foreground">Skip</span>, <span className="text-foreground">Like</span>, or <span className="text-foreground">Love</span>. The more you tag, the sharper your prompts get — you can always refine later from feedback.
      </p>

      <div className="flex items-center justify-between text-[11px] text-muted-foreground">
        <span>{Math.min(pos + 1, total)} / {total}</span>
        <span>{loves.length} liked</span>
      </div>

      <div className="relative h-72">
        {done ? (
          <div className="absolute inset-0 rounded-3xl border border-border bg-surface flex flex-col items-center justify-center text-center p-6">
            <Heart className="h-8 w-8 text-gold mb-3" />
            <p className="text-base font-medium">
              {targetMet ? `Great — ${loves.length} things that land for her.` : `All done — ${loves.length} saved.`}
            </p>
            <p className="text-xs text-muted-foreground mt-1">We'll keep learning from your daily feedback.</p>
            <Button className="mt-4 gold-gradient text-gold-foreground" onClick={onFinish}>
              Continue
            </Button>
          </div>
        ) : (
          <>
            {/* Next card peeking */}
            {pos + 1 < total && (
              <div
                className="absolute inset-0 rounded-3xl border border-border bg-surface-elevated/60 scale-[0.96] translate-y-2 overflow-hidden"
                aria-hidden
              >
                {LOVE_IMAGES[deck[pos + 1]] && (
                  <img
                    src={LOVE_IMAGES[deck[pos + 1]]}
                    alt=""
                    className="w-full h-full object-cover opacity-40"
                  />
                )}
              </div>
            )}
            {/* Active card */}
            <div
              key={pos}
              className={`absolute inset-0 rounded-3xl border border-border bg-surface overflow-hidden flex items-end transition-all duration-200 ${
                exiting === "left"
                  ? "-translate-x-[120%] -rotate-12 opacity-0"
                  : exiting === "right"
                  ? "translate-x-[120%] rotate-12 opacity-0"
                  : exiting === "up"
                  ? "-translate-y-[120%] opacity-0"
                  : ""
              }`}
            >
              {LOVE_IMAGES[deck[pos]] && (
                <img
                  src={LOVE_IMAGES[deck[pos]]}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover"
                />
              )}
              {/* Legibility scrim: dark gradient bottom, slight overall darken */}
              <div className="absolute inset-0 bg-black/30" aria-hidden />
              <div
                className="absolute inset-0"
                aria-hidden
                style={{
                  background:
                    "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.55) 45%, rgba(0,0,0,0.15) 100%)",
                }}
              />
              <p className="relative text-lg leading-snug font-medium text-white p-6 drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]">
                {ALL_LOVES[deck[pos]]}
              </p>
            </div>
          </>
        )}
      </div>

      {!done && (
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => decide("left")}
            className="rounded-2xl py-4 border border-border bg-surface text-foreground flex flex-col items-center gap-1 hover:border-gold/40 transition"
          >
            <XIcon className="h-5 w-5" />
            <span className="text-[11px] tracking-wide">Skip</span>
          </button>
          <button
            onClick={() => decide("right")}
            className="rounded-2xl py-4 border border-border bg-surface text-foreground flex flex-col items-center gap-1 hover:border-gold/40 transition"
          >
            <Check className="h-5 w-5" />
            <span className="text-[11px] tracking-wide">Like</span>
          </button>
          <button
            onClick={() => decide("up")}
            className="rounded-2xl py-4 border border-gold/50 bg-gold/10 text-gold flex flex-col items-center gap-1 hover:bg-gold/20 transition"
          >
            <Star className="h-5 w-5 fill-current" />
            <span className="text-[11px] tracking-wide">Love</span>
          </button>
        </div>
      )}

      {!done && (
        <div className="text-center">
          <button
            onClick={onFinish}
            className="text-xs text-muted-foreground hover:text-gold transition"
          >
            I'm done — finish setup
          </button>
        </div>
      )}
    </div>
  );
}

const BRAND_TILES: Array<{ value: BrandPreference; label: string; desc: string }> = [
  { value: "local", label: "Classic", desc: "She loves what she loves — the neighborhood spot, the go-to place, the thing that's always right" },
  { value: "curated", label: "Curated", desc: "She has taste and favorites — quality matters to her, and she notices when something is chosen with care" },
  { value: "elevated", label: "Distinctive", desc: "She moves in a world where the details matter — the brand, the presentation, the experience itself" },
];

function StepBrandPref({ data, update }: { data: Partial<Profile>; update: (p: Partial<Profile>) => void }) {
  const current = data.brandPreference || "curated";
  const select = (value: BrandPreference) => {
    update({ brandPreference: value, brandAffinities: BRAND_PREF_AFFINITIES[value] });
  };
  return (
    <div className="space-y-5">
      <h2 className="text-xl font-medium">Help us match recommendations to her world</h2>
      <p className="text-sm text-muted-foreground">
        Think about the places she shops, the restaurants she loves, the brands she notices. Which feels most like her?
      </p>
      <div className="space-y-3">
        {BRAND_TILES.map((tile) => {
          const on = current === tile.value;
          return (
            <button
              key={tile.value}
              onClick={() => select(tile.value)}
              className={`w-full text-left rounded-2xl p-4 border transition ${
                on ? "bg-gold/10 border-gold text-foreground" : "bg-surface border-border text-foreground hover:border-gold/40"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-base font-medium">{tile.label}</span>
                {on && <Check className="h-4 w-4 text-gold" />}
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{tile.desc}</p>
            </button>
          );
        })}
      </div>
      <p className="text-[11px] italic text-muted-foreground/70 leading-relaxed">
        This helps us suggest experiences that feel natural to her — not a spending guide. More isn't more if it doesn't fit her world.
      </p>
    </div>
  );
}
