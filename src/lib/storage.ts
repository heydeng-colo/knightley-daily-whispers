import { useEffect, useState } from "react";

export type Feedback = "fire" | "thumb" | "shrug" | "x";

export interface Child { name: string; birthday: string }

export type SpendTier = "free" | "25" | "50" | "100" | "150" | "150plus";

export const SPEND_TIER_LABEL: Record<SpendTier, string> = {
  free: "Free or low-effort gestures",
  "25": "Up to $25/month",
  "50": "Up to $50/month",
  "100": "Up to $100/month",
  "150": "Up to $150/month",
  "150plus": "$150+/month",
};

export interface SpendEntry {
  date: string;     // yyyy-mm-dd
  cycleDay: number;
  phase: string;
  kind: string;
  label: string;
  cost: number;
}

export type CycleMode = "active" | "paused";
export type CyclePauseReason = "pregnancy" | "menopause" | "irregular" | "no_cycle" | "other";

export const CYCLE_PAUSE_REASON_LABEL: Record<CyclePauseReason, string> = {
  pregnancy: "Pregnancy",
  menopause: "Menopause",
  irregular: "Irregular cycle",
  no_cycle: "No cycle tracking",
  other: "Other",
};

export interface Profile {
  cycleMode?: CycleMode;
  cyclePauseReason?: CyclePauseReason | null;
  email?: string;
  herName: string;
  herBirthday: string;
  anniversary?: string;
  children: Child[];
  stage: "Dating" | "Engaged" | "Married";
  relLengthMonths: number;
  relLengthYears: number;
  herZipCode: string;
  flowers: string;
  cuisine: string;
  restaurant: string;
  dateNight: string;
  coffeeOrder: string;
  herPhone: string;
  cycleLength: number;
  lastPeriodStart: string; // ISO yyyy-mm-dd
  yourName?: string;
  favoriteSnack?: string;
  goals: string[];
  loves: number[]; // indexes 1..50
  notifications: boolean;
  smsPolling: boolean;
  activatedAt?: string; // ISO yyyy-mm-dd — set on first save
  spendTier?: SpendTier;
  monthlyBudgetCap?: number; // dollars; 0/undef = no cap
  miniQuiz?: Record<string, string>; // conversational quiz answers, served after day 3
  miniQuizDismissed?: boolean;
  brandPreference?: "local" | "curated" | "elevated";
  brandAffinities?: Record<string, 1 | 2 | 3>;
}

export interface PromptLog {
  date: string;          // yyyy-mm-dd
  cycleDay: number;
  phase: string;
  variation: number;
  prompt: string;
  feedback?: Feedback;
  notes?: string;
  freeAlternativeCompleted?: boolean;
  freeAlternativeText?: string;
  executionMethod?: "free_alternative" | null;
}

const KEYS = {
  profile: "attuned.profile",
  logs: "attuned.logs",
  variations: "attuned.variations", // map date -> variation
  spend: "attuned.spend",
};

const isClient = typeof window !== "undefined";

function read<T>(key: string, fallback: T): T {
  if (!isClient) return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
function write<T>(key: string, value: T) {
  if (!isClient) return;
  localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent("attuned:storage"));
}

export function getProfile(): Profile | null { return read<Profile | null>(KEYS.profile, null); }
export function setProfile(p: Profile | null) {
  if (p && !p.activatedAt) {
    const existing = read<Profile | null>(KEYS.profile, null);
    p = { ...p, activatedAt: existing?.activatedAt || new Date().toISOString().slice(0, 10) };
  }
  if (p && p.cycleMode === undefined) {
    p = { ...p, cycleMode: "active", cyclePauseReason: p.cyclePauseReason ?? null };
  }
  write(KEYS.profile, p);
}

export function nextPollDate(activatedAt?: string, today: Date = new Date()): Date {
  const start = activatedAt ? new Date(activatedAt) : new Date();
  const next = new Date(start);
  while (next.getTime() <= today.getTime()) {
    next.setDate(next.getDate() + 30);
  }
  return next;
}

export function getLogs(): PromptLog[] { return read<PromptLog[]>(KEYS.logs, []); }
export function setLogs(l: PromptLog[]) { write(KEYS.logs, l); }

export function upsertLog(log: PromptLog) {
  const logs = getLogs();
  const idx = logs.findIndex((l) => l.date === log.date);
  if (idx >= 0) logs[idx] = { ...logs[idx], ...log };
  else logs.unshift(log);
  setLogs(logs);
}

// --- Spend tracking ---
export function getSpend(): SpendEntry[] { return read<SpendEntry[]>(KEYS.spend, []); }
export function addSpend(e: SpendEntry) {
  const arr = getSpend();
  arr.unshift(e);
  write(KEYS.spend, arr);
}
export function currentMonthSpend(today: Date = new Date()): number {
  const y = today.getFullYear(), m = today.getMonth();
  return getSpend()
    .filter((e) => { const d = new Date(e.date); return d.getFullYear() === y && d.getMonth() === m; })
    .reduce((s, e) => s + (e.cost || 0), 0);
}

export function getVariations(): Record<string, number> {
  return read<Record<string, number>>(KEYS.variations, {});
}
export function getOrAssignVariation(dateISO: string): number {
  const map = getVariations();
  if (map[dateISO]) return map[dateISO];
  const v = 1 + Math.floor(Math.random() * 12);
  map[dateISO] = v;
  write(KEYS.variations, map);
  return v;
}

export function clearAll() {
  if (!isClient) return;
  Object.values(KEYS).forEach((k) => localStorage.removeItem(k));
  window.dispatchEvent(new CustomEvent("attuned:storage"));
}

export function useStorageVersion() {
  const [v, setV] = useState(0);
  useEffect(() => {
    const fn = () => setV((x) => x + 1);
    window.addEventListener("attuned:storage", fn);
    window.addEventListener("storage", fn);
    return () => {
      window.removeEventListener("attuned:storage", fn);
      window.removeEventListener("storage", fn);
    };
  }, []);
  return v;
}

export function useClientReady() {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  return ready;
}
