// Fire-and-forget POST to /api/v1/feedback/other with offline queueing.
// Never blocks UI and never throws.

const QUEUE_KEY = "attuned.feedbackQueue";

export interface FreeAlternativePayload {
  date: string;
  promptDay: number;
  phase: string;
  freeAlternativeCompleted: boolean;
  freeAlternativeText: string;
  executionMethod: "free_alternative";
}

function isClient() { return typeof window !== "undefined"; }

function readQueue(): FreeAlternativePayload[] {
  if (!isClient()) return [];
  try { return JSON.parse(localStorage.getItem(QUEUE_KEY) || "[]"); } catch { return []; }
}
function writeQueue(q: FreeAlternativePayload[]) {
  if (!isClient()) return;
  localStorage.setItem(QUEUE_KEY, JSON.stringify(q));
}

async function send(payload: FreeAlternativePayload): Promise<boolean> {
  try {
    const res = await fetch("/api/v1/feedback/other", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    // Treat any non-network response as delivered (server may 400 on schema —
    // we still consider the attempt complete and don't retry forever).
    return res.status < 500;
  } catch {
    return false;
  }
}

export function postFreeAlternative(payload: FreeAlternativePayload) {
  if (!isClient()) return;
  if (!navigator.onLine) {
    const q = readQueue();
    q.push(payload);
    writeQueue(q);
    return;
  }
  void send(payload).then((ok) => {
    if (!ok) {
      const q = readQueue();
      q.push(payload);
      writeQueue(q);
    }
  });
}

export async function flushFeedbackQueue() {
  if (!isClient() || !navigator.onLine) return;
  const q = readQueue();
  if (!q.length) return;
  const remaining: FreeAlternativePayload[] = [];
  for (const item of q) {
    const ok = await send(item);
    if (!ok) remaining.push(item);
  }
  writeQueue(remaining);
}

if (isClient()) {
  window.addEventListener("online", () => { void flushFeedbackQueue(); });
  // Try once on load too.
  setTimeout(() => { void flushFeedbackQueue(); }, 1500);
}
