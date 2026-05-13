// Contextual action chips, free alternatives, and spend guardrails.

import type { Phase } from "./cycle";
import { phaseForDay } from "./cycle";
import type { Profile, PromptLog, SpendEntry, SpendTier } from "./storage";

export type ActionKind =
  | "AMAZON_SEARCH"
  | "GOOGLE_CALENDAR"
  | "DOORDASH"
  | "INSTACART"
  | "SMS_DRAFT"
  | "WHATSAPP"
  | "SPOTIFY_PLAYLIST"
  | "OPEN_TABLE"
  | "RESY"
  | "URBAN_STEMS"
  | "FLOWERS_1800"
  | "CLASSPASS"
  | "SNAPPR"
  | "AIRBNB_EXPERIENCES"
  | "VOICE_MEMO"
  | "APPLE_CALENDAR"
  | "HELLOFRESH"
  | "TASKRABBIT"
  | "MEJURI"
  | "MINDBODY"
  | "CALM_GIFT"
  | "AUDIBLE_GIFT";

export interface ActionDef {
  kind: ActionKind;
  icon: string;
  label: string;
  param?: string;          // search term / event title / phrase (placeholders allowed)
  message?: string;        // pre-written SMS / WhatsApp body
  requires?: keyof Profile;
  cost?: number;           // override default cost; 0 = free
}

export interface DayActionGroup {
  actions: ActionDef[];
  freeAlt: string;         // shown beneath the chip row
}

const DEFAULT_COST: Partial<Record<ActionKind, number>> = {
  AMAZON_SEARCH: 35,
  DOORDASH: 45,
  INSTACART: 45,
  URBAN_STEMS: 65,
  FLOWERS_1800: 65,
  CLASSPASS: 20,
  SNAPPR: 250,
  TASKRABBIT: 75,
  MEJURI: 150,
  MINDBODY: 100,
  HELLOFRESH: 60,
  CALM_GIFT: 15,
  AUDIBLE_GIFT: 15,
  // Reservation/browse: $0 — they don't count against caps but still log $0
  OPEN_TABLE: 0,
  RESY: 0,
  AIRBNB_EXPERIENCES: 0,
  // Always free
  SMS_DRAFT: 0,
  WHATSAPP: 0,
  VOICE_MEMO: 0,
  SPOTIFY_PLAYLIST: 0,
  GOOGLE_CALENDAR: 0,
  APPLE_CALENDAR: 0,
};

export function actionCost(a: ActionDef): number {
  if (typeof a.cost === "number") return a.cost;
  return DEFAULT_COST[a.kind] ?? 0;
}
export const isPaidAction = (a: ActionDef) => actionCost(a) > 0;

// --- Day → action group mapping ---
export const DAY_ACTIONS: Record<number, DayActionGroup> = {
  1: { actions: [
    { kind: "AMAZON_SEARCH", icon: "🛒", label: "Order Heat Pad", param: "electric heat pad" },
    { kind: "GOOGLE_CALENDAR", icon: "📅", label: "Add Reminder", param: "Comfort day for {herName}" },
  ], freeAlt: "Pick one up at CVS or Walgreens on your way home" },
  2: { actions: [
    { kind: "DOORDASH", icon: "🛒", label: "Order Delivery", param: "{cuisine}" },
    { kind: "INSTACART", icon: "🛒", label: "Order Groceries" },
  ], freeAlt: "Cook something simple she loves — no need to order" },
  3: { actions: [
    { kind: "SMS_DRAFT", icon: "💬", label: "Text Her", message: "Hey {herName}, just thinking of you today. Hope you're feeling okay 💕", requires: "herPhone" },
    { kind: "WHATSAPP", icon: "💬", label: "WhatsApp", message: "Hey {herName}, just thinking of you today. Hope you're feeling okay 💕", requires: "herPhone" },
  ], freeAlt: "Send her a voice message instead" },
  4: { actions: [
    { kind: "SPOTIFY_PLAYLIST", icon: "🎵", label: "Set the Mood", param: "cozy evening playlist" },
  ], freeAlt: "Put on something soft at home tonight" },
  5: { actions: [
    { kind: "DOORDASH", icon: "☕", label: "Order Her Coffee", param: "{coffeeOrder}" },
    { kind: "GOOGLE_CALENDAR", icon: "📅", label: "Morning Walk", param: "Morning walk with {herName}" },
  ], freeAlt: "Make her coffee at home exactly how she likes it" },
  6: { actions: [
    { kind: "GOOGLE_CALENDAR", icon: "📅", label: "Block the Weekend", param: "Weekend with {herName}" },
    { kind: "AIRBNB_EXPERIENCES", icon: "🏡", label: "Browse Experiences" },
  ], freeAlt: "Write down 3 ideas for the weekend and show her tonight" },
  8: { actions: [
    { kind: "SMS_DRAFT", icon: "💬", label: "Send a Text", message: "Saw this and thought of you 😂 [paste link]", requires: "herPhone" },
  ], freeAlt: "Screenshot a reel and send it directly" },
  10: { actions: [
    { kind: "CLASSPASS", icon: "🧘", label: "Find a Class" },
  ], freeAlt: "Look up a free yoga video on YouTube and do it together at home" },
  11: { actions: [
    { kind: "RESY", icon: "🍽️", label: "Reserve a Table", param: "{restaurant}", requires: "restaurant" },
    { kind: "GOOGLE_CALENDAR", icon: "📅", label: "Add Date Night", param: "Date Night 🌙" },
    { kind: "TASKRABBIT", icon: "👶", label: "Book Babysitter" },
  ], freeAlt: "Call the restaurant directly — and ask a family member about the kids" },
  12: { actions: [
    { kind: "VOICE_MEMO", icon: "🎙️", label: "Record Voice Note" },
  ], freeAlt: "Send her a quick audio message through WhatsApp" },
  13: { actions: [
    { kind: "SPOTIFY_PLAYLIST", icon: "🎵", label: "Set the Mood", param: "romantic playlist" },
  ], freeAlt: "Put on a playlist you both love at home tonight" },
  14: { actions: [
    { kind: "URBAN_STEMS", icon: "🌸", label: "Order Flowers" },
    { kind: "RESY", icon: "🍽️", label: "Reserve Lunch", param: "{restaurant}", requires: "restaurant" },
    { kind: "SMS_DRAFT", icon: "💬", label: "Text Her", message: "Thinking of surprising you today 👀", requires: "herPhone" },
  ], freeAlt: "Pick up flowers on the way home — she loves {flowers}" },
  15: { actions: [
    { kind: "RESY", icon: "🍽️", label: "Book Dinner", param: "{restaurant}", requires: "restaurant" },
    { kind: "GOOGLE_CALENDAR", icon: "📅", label: "Add to Calendar", param: "Evening with {herName} 🌹" },
    { kind: "AMAZON_SEARCH", icon: "🍷", label: "Order Wine", param: "wine delivery" },
  ], freeAlt: "Cook at home and set the table properly — candles, the works" },
  16: { actions: [
    { kind: "SMS_DRAFT", icon: "💬", label: "Send Text", message: "I just want you to know I think you're incredible. I was bragging about you today 😊", requires: "herPhone" },
    { kind: "MEJURI", icon: "💍", label: "Treat Her" },
  ], freeAlt: "Tell her in person tonight — look her in the eyes when you do" },
  17: { actions: [
    { kind: "SNAPPR", icon: "📸", label: "Book Photographer" },
    { kind: "GOOGLE_CALENDAR", icon: "📅", label: "Schedule It", param: "Photo date with {herName}" },
  ], freeAlt: "Take her somewhere beautiful and take the photos yourself" },
  18: { actions: [
    { kind: "SPOTIFY_PLAYLIST", icon: "🎵", label: "Set the Mood", param: "romantic evening playlist" },
  ], freeAlt: "Light candles, put the phones away, let the evening unfold" },
  19: { actions: [
    { kind: "INSTACART", icon: "🛒", label: "Order Ingredients" },
    { kind: "HELLOFRESH", icon: "🍱", label: "Meal Kit" },
  ], freeAlt: "Cook from scratch — look up her favorite recipe and make it tonight" },
  20: { actions: [
    { kind: "AMAZON_SEARCH", icon: "🛒", label: "Cleaning Supplies", param: "home organization essentials" },
    { kind: "TASKRABBIT", icon: "🔧", label: "Hire Help" },
  ], freeAlt: "Spend 20 minutes tidying before she gets home — no announcement needed" },
  21: { actions: [
    { kind: "TASKRABBIT", icon: "🔧", label: "Hire It Out" },
  ], freeAlt: "Pick one thing she's been asking about and just do it today" },
  22: { actions: [
    { kind: "GOOGLE_CALENDAR", icon: "📅", label: "Block Time", param: "Us Time — Life Admin 📋" },
  ], freeAlt: "Ask her tonight: when's a good time for us to sit down together?" },
  23: { actions: [
    { kind: "SPOTIFY_PLAYLIST", icon: "🎵", label: "Her Playlist", param: "relaxing solo time" },
    { kind: "AUDIBLE_GIFT", icon: "🎧", label: "Gift Audiobook" },
  ], freeAlt: "Tell her you've got the next 30 minutes handled — and mean it" },
  24: { actions: [
    { kind: "AMAZON_SEARCH", icon: "🛒", label: "Sticky Notes", param: "colorful sticky notes" },
  ], freeAlt: "Use whatever paper is around — the words matter more than the paper" },
  25: { actions: [
    { kind: "SPOTIFY_PLAYLIST", icon: "🎵", label: "Cozy Playlist", param: "cozy night in playlist" },
  ], freeAlt: "Pick a movie she's mentioned and have it queued up before she sits down" },
  26: { actions: [
    { kind: "SMS_DRAFT", icon: "💬", label: "Send Text", message: "Hey — on a scale of 1–10, how stressed are you feeling?", requires: "herPhone" },
    { kind: "CALM_GIFT", icon: "🧘", label: "Gift Calm" },
  ], freeAlt: "Ask her in person tonight — and just listen, don't fix" },
  27: { actions: [
    { kind: "AMAZON_SEARCH", icon: "🛒", label: "Massage Oil", param: "massage oil couples" },
    { kind: "MINDBODY", icon: "💆", label: "Book Spa" },
  ], freeAlt: "Offer a 10-minute back massage tonight — no agenda" },
  28: { actions: [
    { kind: "DOORDASH", icon: "☕", label: "Order Her Coffee", param: "{coffeeOrder}" },
    { kind: "AMAZON_SEARCH", icon: "☕", label: "Upgrade Her Morning", param: "Nespresso machine" },
  ], freeAlt: "Make her coffee exactly how she likes it and bring it to her in bed" },
  29: { actions: [
    { kind: "AMAZON_SEARCH", icon: "🛒", label: "Organization", param: "home organization" },
  ], freeAlt: "Clear one surface, lower the volume, handle whatever needs handling" },
  30: { actions: [
    { kind: "AUDIBLE_GIFT", icon: "🎧", label: "Gift Audiobook" },
  ], freeAlt: "Ask how she's feeling and then just listen — no advice unless she asks" },
  31: { actions: [
    { kind: "SPOTIFY_PLAYLIST", icon: "🎵", label: "Sleep Playlist", param: "relaxing sleep music" },
  ], freeAlt: "Handle bedtime tonight without being asked" },
  33: { actions: [
    { kind: "DOORDASH", icon: "🛒", label: "Order Food", param: "{cuisine}" },
    { kind: "AMAZON_SEARCH", icon: "🕯️", label: "Get Candles", param: "scented candles relaxing" },
  ], freeAlt: "Make comfort food at home and light whatever candles you have" },
  34: { actions: [
    { kind: "SMS_DRAFT", icon: "💬", label: "Send Text", message: "You looked beautiful today. I noticed.", requires: "herPhone" },
    { kind: "MEJURI", icon: "💍", label: "Treat Her" },
  ], freeAlt: "Tell her she looks beautiful tonight — be specific about what you notice" },
  35: { actions: [
    { kind: "TASKRABBIT", icon: "🔧", label: "Hire Help" },
  ], freeAlt: "Finish the thing she's been waiting on — quietly, no fanfare" },
  36: { actions: [
    { kind: "SMS_DRAFT", icon: "💬", label: "Send Text", message: "Thinking of you right now 💙 Hope your day is okay.", requires: "herPhone" },
    { kind: "WHATSAPP", icon: "💬", label: "WhatsApp", message: "Thinking of you right now 💙 Hope your day is okay.", requires: "herPhone" },
  ], freeAlt: "Send a voice note instead — hearing your voice means more" },
  37: { actions: [
    { kind: "CALM_GIFT", icon: "🧘", label: "Try Calm Together" },
  ], freeAlt: "Suggest 5 minutes of deep breathing together before bed" },
  38: { actions: [
    { kind: "AMAZON_SEARCH", icon: "🛒", label: "Bath Essentials", param: "bath salts relaxing gift set" },
    { kind: "MINDBODY", icon: "💆", label: "Book Spa" },
  ], freeAlt: "Run the bath, get the temperature right, leave her to it" },
  39: { actions: [
    { kind: "SMS_DRAFT", icon: "💬", label: "Send Text", message: "Hey {herName} — just wanted you to know I see you and I've got you. Always. 💕", requires: "herPhone" },
    { kind: "URBAN_STEMS", icon: "🌸", label: "Order Flowers" },
  ], freeAlt: "Say it out loud tonight — no phone, just you" },
  40: { actions: [
    { kind: "GOOGLE_CALENDAR", icon: "📅", label: "Plan Next Cycle", param: "New cycle — Day 1 prep" },
    { kind: "AMAZON_SEARCH", icon: "🛒", label: "Stock Up", param: "electric heat pad" },
  ], freeAlt: "Make a mental note: heat pad ready, meals covered, keep it calm tomorrow" },
};

export function getActionGroupForDay(day: number): DayActionGroup | null {
  return DAY_ACTIONS[day] || null;
}

/** Replace {herName} {restaurant} {coffeeOrder} {flowers} {cuisine} with profile values. */
export function fillTemplate(template: string, profile: Profile): string {
  return template
    .replace(/\{herName\}/g, profile.herName || "love")
    .replace(/\{restaurant\}/g, profile.restaurant || "")
    .replace(/\{restaurantName\}/g, profile.restaurant || "")
    .replace(/\{coffeeOrder\}/g, profile.coffeeOrder || "coffee")
    .replace(/\{flowers\}/g, profile.flowers || "her favorite")
    .replace(/\{flowerType\}/g, profile.flowers || "her favorite")
    .replace(/\{cuisine\}/g, profile.cuisine || "");
}

function ymd(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}${m}${day}`;
}

/** Build the URL/scheme to open. For SMS_DRAFT, draftMessage overrides. */
export function buildActionUrl(action: ActionDef, profile: Profile, draftMessage?: string): string {
  const param = action.param ? encodeURIComponent(fillTemplate(action.param, profile)) : "";
  const phone = (profile.herPhone || "").replace(/[^\d+]/g, "");
  const msg = encodeURIComponent(fillTemplate(draftMessage ?? action.message ?? "", profile));

  switch (action.kind) {
    case "AMAZON_SEARCH":
      return `https://www.amazon.com/s?k=${param}`;
    case "GOOGLE_CALENDAR": {
      const today = ymd(new Date());
      return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${param}&dates=${today}/${today}`;
    }
    case "DOORDASH":
      return action.param ? `https://www.doordash.com/search/store/${param}` : `https://www.doordash.com`;
    case "INSTACART": return "https://www.instacart.com";
    case "SMS_DRAFT": {
      const sep = /iPhone|iPad|iPod|Mac/.test(typeof navigator !== "undefined" ? navigator.userAgent : "") ? "&" : "?";
      return `sms:${phone}${sep}body=${msg}`;
    }
    case "WHATSAPP": return `https://wa.me/${phone.replace(/^\+/, "")}?text=${msg}`;
    case "SPOTIFY_PLAYLIST": return `https://open.spotify.com/search/${param}`;
    case "OPEN_TABLE": return `https://www.opentable.com/s/?term=${param}`;
    case "RESY": return `https://resy.com/cities/ny?query=${param}`;
    case "URBAN_STEMS": return "https://urbanstems.com";
    case "FLOWERS_1800": return "https://www.1800flowers.com";
    case "CLASSPASS": return "https://classpass.com/search";
    case "SNAPPR": return "https://www.snappr.com";
    case "AIRBNB_EXPERIENCES": return "https://www.airbnb.com/s/experiences";
    case "VOICE_MEMO": return "com.apple.VoiceMemos://";
    case "APPLE_CALENDAR": return "calshow://";
    case "HELLOFRESH": return "https://www.hellofresh.com";
    case "TASKRABBIT": return "https://www.taskrabbit.com";
    case "MEJURI": return "https://www.mejuri.com";
    case "MINDBODY": return "https://www.mindbody.io";
    case "CALM_GIFT": return "https://www.calm.com/gift";
    case "AUDIBLE_GIFT": return "https://www.audible.com/gift";
    default: return "#";
  }
}

// ---------------- Spend Guardrails ----------------

const PHASE_CAPS: Record<SpendTier, Record<Phase, number>> = {
  free:     { M: 0, EF: 0, O: 0, EL: 0, LL: 0 },
  "25":     { M: 0, EF: 1, O: 1, EL: 1, LL: 0 },
  "50":     { M: 1, EF: 2, O: 2, EL: 2, LL: 1 },
  "100":    { M: 1, EF: 2, O: 3, EL: 2, LL: 1 },
  "150":    { M: 1, EF: 3, O: 4, EL: 3, LL: 2 },
  "150plus":{ M: 2, EF: 3, O: 5, EL: 3, LL: 2 },
};

interface GuardrailContext {
  day: number;
  profile: Profile;
  logs: PromptLog[];
  spend: SpendEntry[];
  monthSpendTotal: number;
  today?: Date;
}

/** Returns true if paid chips should be hidden for the given day. */
export function shouldSuppressPaid(ctx: GuardrailContext): { suppress: boolean; reason?: string } {
  const { profile, logs, spend, monthSpendTotal } = ctx;
  const tier: SpendTier = profile.spendTier || "50";

  // Free tier always suppresses
  if (tier === "free") return { suppress: true, reason: "Your tier is free-only — see the alternative below." };

  // Monthly budget cap reached
  if (profile.monthlyBudgetCap && profile.monthlyBudgetCap > 0 && monthSpendTotal >= profile.monthlyBudgetCap) {
    return { suppress: true, reason: `You've hit your $${profile.monthlyBudgetCap} monthly cap — paid chips return next month.` };
  }

  const today = ctx.today || new Date();
  const todayISO = today.toISOString().slice(0, 10);
  const yesterday = new Date(today); yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayISO = yesterday.toISOString().slice(0, 10);

  // Hard rule: no paid two days in a row
  if (spend.some((s) => s.date === yesterdayISO && s.cost > 0)) {
    return { suppress: true, reason: "You used a paid action yesterday — keep it light today." };
  }

  // Hard rule: max 2 paid taps in rolling 7 days
  const sevenAgo = new Date(today); sevenAgo.setDate(sevenAgo.getDate() - 6);
  const sevenISO = sevenAgo.toISOString().slice(0, 10);
  const recentPaid = spend.filter((s) => s.date >= sevenISO && s.date <= todayISO && s.cost > 0).length;
  if (recentPaid >= 2) {
    return { suppress: true, reason: "Two paid actions already this week — leaning on free wins." };
  }

  // Suppress if last paid prompt rated ❌ or 🤷
  const paidDates = new Set(spend.filter((s) => s.cost > 0).map((s) => s.date));
  const recentRatedPaid = logs
    .filter((l) => paidDates.has(l.date) && (l.feedback === "x" || l.feedback === "shrug"))
    .sort((a, b) => (a.date < b.date ? 1 : -1))[0];
  if (recentRatedPaid) {
    // only suppress until a positive paid is logged after it
    const positiveAfter = logs.find(
      (l) => l.date > recentRatedPaid.date && paidDates.has(l.date) && (l.feedback === "fire" || l.feedback === "thumb"),
    );
    if (!positiveAfter) {
      return { suppress: true, reason: "Last paid action didn't land — trying a free alternative." };
    }
  }

  // Per-phase cap inside current cycle
  const phase = phaseForDay(ctx.day, profile.cycleLength);
  const cap = PHASE_CAPS[tier][phase];
  if (cap === 0) {
    return { suppress: true, reason: "Your tier keeps this phase paid-free." };
  }
  // Count paid taps within current cycle window for this phase
  const cycleStart = new Date(profile.lastPeriodStart);
  const inCycleStartISO = cycleStart.toISOString().slice(0, 10);
  const phaseTapsThisCycle = spend.filter(
    (s) => s.date >= inCycleStartISO && s.cost > 0 && s.phase === phase,
  ).length;
  if (phaseTapsThisCycle >= cap) {
    return { suppress: true, reason: `Phase cap reached (${cap}) — keeping the rest free.` };
  }

  return { suppress: false };
}
