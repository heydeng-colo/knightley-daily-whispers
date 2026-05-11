export type Phase = "M" | "EF" | "O" | "EL" | "LL";

export const PHASE_META: Record<Phase, { name: string; tag: string; color: string; description: string }> = {
  M: { name: "Menstrual", tag: "M", color: "var(--phase-menstrual)", description: "Energy is low — be a steady, gentle presence." },
  EF: { name: "Early Follicular", tag: "EF", color: "var(--phase-follicular)", description: "She's coming back online — invite, plan, surprise." },
  O: { name: "Ovulatory", tag: "O", color: "var(--phase-ovulatory)", description: "Energy is high, connection is easy." },
  EL: { name: "Early Luteal", tag: "EL", color: "var(--phase-early-luteal)", description: "Cozy, nesting energy — warmth and reassurance win." },
  LL: { name: "Late Luteal", tag: "LL", color: "var(--phase-late-luteal)", description: "Sensitivity is up — go gentle, listen, validate." },
};

export function phaseForDay(day: number, cycleLength: number): Phase {
  if (day <= 4) return "M";
  if (day <= 12) return "EF";
  if (day <= 18) return "O";
  if (day <= 28) return "EL";
  if (cycleLength > 28 && day <= 40) return "LL";
  return "EL";
}

export function daysBetween(a: Date, b: Date): number {
  const ms = 24 * 60 * 60 * 1000;
  const da = new Date(a.getFullYear(), a.getMonth(), a.getDate()).getTime();
  const db = new Date(b.getFullYear(), b.getMonth(), b.getDate()).getTime();
  return Math.round((db - da) / ms);
}

export function cycleDay(periodStartISO: string, cycleLength: number, today: Date = new Date()): number {
  const start = new Date(periodStartISO);
  const diff = daysBetween(start, today);
  const max = Math.max(28, Math.min(40, cycleLength));
  if (diff < 0) return 1;
  return (diff % max) + 1;
}

export function todayISO(d: Date = new Date()): string {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).toISOString().slice(0, 10);
}

// 12 prompt variations per phase — used as v1..v12 for any day in that phase.
const PROMPTS: Record<Phase, string[]> = {
  M: [
    "Bring her a glass of water and her favorite snack — no questions, no fuss.",
    "Take one chore off her plate today without being asked or announcing it.",
    "Run her a hot bath tonight. Light a candle if you have one.",
    "Send a midday text: \"Just thinking about you. Don't lift a finger tonight — I've got us.\"",
    "Pick up a heating pad, chocolate, or her go-to comfort item on the way home.",
    "Cancel one thing on her calendar she's dreading — handle it yourself.",
    "Make dinner (or order in) so she doesn't have to think about food.",
    "Sit next to her on the couch, phone face-down, and just be present.",
    "Take the kids/pets/dishes for the night. Tell her: \"Rest. I've got it.\"",
    "Tell her she's beautiful — without expecting anything back.",
    "Give her a long, no-strings-attached back rub or foot rub.",
    "Skip the fix-it advice. Just say, \"That sounds really hard. I'm here.\"",
  ],
  EF: [
    "Plan a small adventure for the weekend — somewhere new, even if it's local.",
    "Send a flirty text out of nowhere. Match the spark she's bringing back.",
    "Suggest a walk together after dinner, no agenda.",
    "Pick a restaurant she's been wanting to try and book it for this week.",
    "Compliment something specific — her energy, her laugh, the way she handled today.",
    "Ask, \"What's one thing you'd love to do this month?\" and start planning it.",
    "Surprise her with her favorite coffee order in the morning.",
    "Text her at lunch: \"Get dressed up tonight. I'm taking you out.\"",
    "Try something new together — a recipe, a workout, a playlist.",
    "Bring up a memory from early in your relationship that still makes you smile.",
    "Make tomorrow morning easier for her — prep coffee, clear her path out the door.",
    "Look her in the eyes longer than feels normal. Tell her she's stunning.",
  ],
  O: [
    "Plan a real date night this week. Reservation, outfit, the whole thing.",
    "Initiate intimacy without it being about sex — kiss her like you mean it.",
    "Send flowers to her work or have them waiting when she gets home.",
    "Tell her one specific thing you find irresistible about her, today.",
    "Clear the evening. Phones away. Just the two of you.",
    "Write a short note and leave it where she'll find it tomorrow morning.",
    "Pull her in for a slow dance in the kitchen. No music required.",
    "Ask her about a dream she's had lately — career, travel, anything — and listen.",
    "Take a photo of her when she's not posing. Tell her later why you love it.",
    "Make her laugh hard. Try a memory, a voice, a silly text — whatever works on her.",
    "Plan a getaway weekend. Even one night somewhere counts.",
    "Tell her: \"I'd choose you all over again.\" Mean it.",
  ],
  EL: [
    "Cook her favorite meal at home tonight. Set the table properly.",
    "Suggest a cozy movie night — let her pick. Make popcorn the way she likes.",
    "Light candles before she gets home. Soft lighting, music low.",
    "Take something off her mental load — appointment, RSVP, kids' thing — and own it.",
    "Send a sweet \"just because\" text in the middle of the day.",
    "Ask, \"How are you really doing this week?\" Then just listen.",
    "Tidy up one space she cares about — kitchen counter, bedroom, entryway.",
    "Bring home her favorite treat. Bonus if it's a small ritual you've shared before.",
    "Hold her longer than usual when you hug today.",
    "Write down three things you appreciate about her this week. Read one out loud.",
    "Plan a quiet weekend morning — coffee in bed, nowhere to be.",
    "Ask about her friends by name. Remember what's going on with them.",
  ],
  LL: [
    "Lead with patience today. Whatever lands sideways, don't take it personally.",
    "Don't try to fix it. Say: \"That makes sense. Tell me more.\"",
    "Anticipate one thing she'll need and have it ready before she asks.",
    "Apologize first if there's any tension — even if you weren't fully wrong.",
    "Take the kids/dog/dishes off her plate tonight without making it a thing.",
    "Say: \"You've been carrying a lot. Let me handle dinner.\"",
    "Lower the temperature in the room. Soft voice, slow movements, full presence.",
    "Send a text mid-day: \"Thinking of you. You're doing more than you know.\"",
    "Ask, \"Is there anything you're worrying about that I could just take care of?\"",
    "Turn off the TV and ask about her day before launching into yours.",
    "Bring her tea, water, or her comfort drink — unprompted.",
    "Tell her: \"I love you. We're good. You don't have to perform anything tonight.\"",
  ],
};

export function getPromptForDay(day: number, variation: number, cycleLength: number): string {
  const phase = phaseForDay(day, cycleLength);
  const list = PROMPTS[phase];
  return list[(variation - 1) % list.length];
}

export const TOTAL_DAYS = 40;
