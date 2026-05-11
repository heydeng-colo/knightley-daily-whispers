import { useEffect, useState } from "react";

export type Feedback = "fire" | "thumb" | "shrug" | "x";

export interface Child { name: string; birthday: string }

export interface Profile {
  herName: string;
  herBirthday: string;
  anniversary?: string;
  children: Child[];
  stage: "Dating" | "Engaged" | "Married";
  relLengthMonths: number;
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
}

export interface PromptLog {
  date: string;          // yyyy-mm-dd
  cycleDay: number;
  phase: string;
  variation: number;
  prompt: string;
  feedback?: Feedback;
}

const KEYS = {
  profile: "attuned.profile",
  logs: "attuned.logs",
  variations: "attuned.variations", // map date -> variation
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
export function setProfile(p: Profile | null) { write(KEYS.profile, p); }

export function getLogs(): PromptLog[] { return read<PromptLog[]>(KEYS.logs, []); }
export function setLogs(l: PromptLog[]) { write(KEYS.logs, l); }

export function upsertLog(log: PromptLog) {
  const logs = getLogs();
  const idx = logs.findIndex((l) => l.date === log.date);
  if (idx >= 0) logs[idx] = { ...logs[idx], ...log };
  else logs.unshift(log);
  setLogs(logs);
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
