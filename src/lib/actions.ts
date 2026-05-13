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

// --- Phase + variation → action group mapping ---
// Each phase has 12 entries indexed 0..11, aligned 1:1 with the 12 prompts
// for that phase in src/lib/cycle.ts. Action chips MUST match the prompt text.
export const PHASE_ACTIONS: Record<Phase, DayActionGroup[]> = {
  M: [
    // 1. Bring her water and her favorite snack
    { actions: [
      { kind: "INSTACART", icon: "🛒", label: "Order Her Snack", param: "{snack}" },
      { kind: "DOORDASH", icon: "🛒", label: "Deliver Her Treat", param: "{snack}" },
    ], freeAlt: "Grab it from the kitchen — water + her favorite snack, no fuss" },
    // 2. Take one chore off her plate
    { actions: [
      { kind: "TASKRABBIT", icon: "🔧", label: "Outsource a Chore" },
    ], freeAlt: "Pick the chore she hates most and just do it tonight" },
    // 3. Run her a hot bath, light a candle
    { actions: [
      { kind: "AMAZON_SEARCH", icon: "🛒", label: "Bath Salts + Candle", param: "bath salts and candle gift set" },
    ], freeAlt: "Run the bath now, dim the lights, use whatever candle you have" },
    // 4. Send a midday text
    { actions: [
      { kind: "SMS_DRAFT", icon: "💬", label: "Text Her", message: "Just thinking about you. Don't lift a finger tonight — I've got us. 💕", requires: "herPhone" },
      { kind: "WHATSAPP", icon: "💬", label: "WhatsApp", message: "Just thinking about you. Don't lift a finger tonight — I've got us. 💕", requires: "herPhone" },
    ], freeAlt: "Send a voice note — hearing your voice will hit harder" },
    // 5. Pick up a heating pad / chocolate / comfort item
    { actions: [
      { kind: "AMAZON_SEARCH", icon: "🛒", label: "Order Heat Pad", param: "electric heating pad" },
      { kind: "INSTACART", icon: "🛒", label: "Comfort Items", param: "chocolate" },
    ], freeAlt: "Stop at CVS or Walgreens on the way home" },
    // 6. Cancel one thing on her calendar she's dreading
    { actions: [
      { kind: "GOOGLE_CALENDAR", icon: "📅", label: "Open Her Calendar" },
      { kind: "SMS_DRAFT", icon: "💬", label: "Send the Cancel", message: "Hey — I need to reschedule on {herName}'s behalf, she's not feeling well. Can we move this?", requires: "herPhone" },
    ], freeAlt: "Pick the dreaded thing and handle the call yourself" },
    // 7. Make dinner or order in
    { actions: [
      { kind: "DOORDASH", icon: "🛒", label: "Order Dinner", param: "{cuisine}" },
      { kind: "INSTACART", icon: "🛒", label: "Order Groceries" },
      { kind: "HELLOFRESH", icon: "🍱", label: "Easy Meal Kit" },
    ], freeAlt: "Make something simple she loves — eggs, pasta, soup" },
    // 8. Sit on the couch, phone face-down, just be present
    { actions: [
      { kind: "SPOTIFY_PLAYLIST", icon: "🎵", label: "Quiet Evening", param: "calm acoustic evening" },
    ], freeAlt: "Phone face-down. Sit close. That's the whole prompt." },
    // 9. Take the kids/pets/dishes for the night
    { actions: [
      { kind: "TASKRABBIT", icon: "👶", label: "Book Babysitter" },
    ], freeAlt: "Just take it all on tonight — no announcement needed" },
    // 10. Tell her she's beautiful — no expectations
    { actions: [
      { kind: "SMS_DRAFT", icon: "💬", label: "Tell Her", message: "You're beautiful. That's it. No reason. 💕", requires: "herPhone" },
    ], freeAlt: "Say it in person tonight — look her in the eyes" },
    // 11. Long, no-strings massage
    { actions: [
      { kind: "AMAZON_SEARCH", icon: "🛒", label: "Massage Oil", param: "massage oil unscented" },
      { kind: "MINDBODY", icon: "💆", label: "Book Her a Spa" },
    ], freeAlt: "10 minutes of back or foot rub — no agenda, no follow-up" },
    // 12. Skip the fix-it advice. Validate.
    { actions: [
      { kind: "SMS_DRAFT", icon: "💬", label: "Validate", message: "That sounds really hard. I'm here. 💙", requires: "herPhone" },
    ], freeAlt: "Say it in person — then just listen, don't fix" },
  ],
  EF: [
    // 1. Plan a small adventure for the weekend
    { actions: [
      { kind: "AIRBNB_EXPERIENCES", icon: "🏡", label: "Browse Experiences" },
      { kind: "GOOGLE_CALENDAR", icon: "📅", label: "Block the Weekend", param: "Weekend adventure with {herName}" },
    ], freeAlt: "Write down 3 local ideas and let her pick tonight" },
    // 2. Send a flirty text
    { actions: [
      { kind: "SMS_DRAFT", icon: "💬", label: "Flirty Text", message: "Can't stop thinking about you today 👀", requires: "herPhone" },
      { kind: "WHATSAPP", icon: "💬", label: "WhatsApp", message: "Can't stop thinking about you today 👀", requires: "herPhone" },
    ], freeAlt: "Send a voice note — your tone will land harder than text" },
    // 3. Suggest a walk together after dinner
    { actions: [
      { kind: "GOOGLE_CALENDAR", icon: "📅", label: "Add Evening Walk", param: "Evening walk with {herName}" },
    ], freeAlt: "Just ask at dinner — no agenda, no phones" },
    // 4. Pick a restaurant she's wanted to try and book it
    { actions: [
      { kind: "RESY", icon: "🍽️", label: "Book on Resy", param: "{restaurant}", requires: "restaurant" },
      { kind: "OPEN_TABLE", icon: "🍽️", label: "Book on OpenTable", param: "{restaurant}", requires: "restaurant" },
    ], freeAlt: "Call the restaurant directly — sometimes it's faster" },
    // 5. Compliment something specific
    { actions: [
      { kind: "SMS_DRAFT", icon: "💬", label: "Specific Compliment", message: "I keep thinking about how you handled today. You were incredible.", requires: "herPhone" },
    ], freeAlt: "Tell her tonight — be specific about what you noticed" },
    // 6. Ask: one thing you'd love to do this month?
    { actions: [
      { kind: "SMS_DRAFT", icon: "💬", label: "Ask Her", message: "What's one thing you'd love to do this month? Let's actually do it.", requires: "herPhone" },
      { kind: "GOOGLE_CALENDAR", icon: "📅", label: "Hold the Date", param: "{herName}'s pick" },
    ], freeAlt: "Ask her tonight and start planning together on the spot" },
    // 7. Surprise her with her favorite coffee
    { actions: [
      { kind: "DOORDASH", icon: "☕", label: "Order Her Coffee", param: "{coffeeOrder}" },
    ], freeAlt: "Make her coffee at home — exactly the way she likes it" },
    // 8. Text at lunch: get dressed up tonight, I'm taking you out
    { actions: [
      { kind: "SMS_DRAFT", icon: "💬", label: "Send the Text", message: "Get dressed up tonight. I'm taking you out. 🌙", requires: "herPhone" },
      { kind: "RESY", icon: "🍽️", label: "Book the Spot", param: "{restaurant}", requires: "restaurant" },
    ], freeAlt: "Send the text — then make a great home date if reservations are tight" },
    // 9. Try something new — recipe, workout, playlist
    { actions: [
      { kind: "HELLOFRESH", icon: "🍱", label: "New Recipe Kit" },
      { kind: "CLASSPASS", icon: "🧘", label: "New Class" },
      { kind: "SPOTIFY_PLAYLIST", icon: "🎵", label: "New Playlist", param: "discover weekly fresh" },
    ], freeAlt: "Find a YouTube workout you've never tried and do it together" },
    // 10. Bring up an early-relationship memory
    { actions: [
      { kind: "SMS_DRAFT", icon: "💬", label: "Send the Memory", message: "Was just remembering [your memory] — still makes me smile. 🥰", requires: "herPhone" },
    ], freeAlt: "Tell her tonight at dinner — your face will sell it" },
    // 11. Make tomorrow morning easier
    { actions: [
      { kind: "AMAZON_SEARCH", icon: "🛒", label: "Coffee Timer", param: "programmable coffee maker" },
    ], freeAlt: "Prep her coffee tonight, pack her bag, clear her path out the door" },
    // 12. Look her in the eyes, tell her she's stunning
    { actions: [], freeAlt: "This one's all you. Eye contact. Slow it down. Mean it." },
  ],
  O: [
    // 1. Plan a real date night this week
    { actions: [
      { kind: "RESY", icon: "🍽️", label: "Book the Restaurant", param: "{restaurant}", requires: "restaurant" },
      { kind: "GOOGLE_CALENDAR", icon: "📅", label: "Add Date Night", param: "Date Night with {herName} 🌙" },
      { kind: "TASKRABBIT", icon: "👶", label: "Book Babysitter" },
    ], freeAlt: "Cook at home, set the table properly, ask family for the kids" },
    // 2. Initiate intimacy — kiss her like you mean it
    { actions: [
      { kind: "SPOTIFY_PLAYLIST", icon: "🎵", label: "Set the Mood", param: "slow romantic" },
    ], freeAlt: "Pull her in, slow down, kiss her like the first time" },
    // 3. Send flowers to work or have them waiting
    { actions: [
      { kind: "URBAN_STEMS", icon: "🌸", label: "Order Flowers", param: "{flowers}" },
      { kind: "FLOWERS_1800", icon: "🌸", label: "1-800-Flowers", param: "{flowers}" },
    ], freeAlt: "Pick up {flowers} on the way home — she loves them" },
    // 4. Tell her one specific thing you find irresistible
    { actions: [
      { kind: "SMS_DRAFT", icon: "💬", label: "Tell Her Now", message: "One thing I find totally irresistible about you: [be specific]. 🔥", requires: "herPhone" },
    ], freeAlt: "Say it in person tonight — be specific, not generic" },
    // 5. Clear the evening, phones away
    { actions: [
      { kind: "GOOGLE_CALENDAR", icon: "📅", label: "Block Tonight", param: "Phones-down evening with {herName}" },
    ], freeAlt: "Phones in a drawer at 8pm. Just you two." },
    // 6. Write a short note, leave it for her morning
    { actions: [
      { kind: "AMAZON_SEARCH", icon: "🛒", label: "Sticky Notes", param: "colorful sticky notes" },
    ], freeAlt: "Any paper. Any pen. The words matter more than the stationery." },
    // 7. Slow dance in the kitchen
    { actions: [
      { kind: "SPOTIFY_PLAYLIST", icon: "🎵", label: "Slow Dance Songs", param: "slow dance kitchen" },
    ], freeAlt: "Hum a song you both love. No music required." },
    // 8. Ask about a dream — career, travel, anything
    { actions: [
      { kind: "SMS_DRAFT", icon: "💬", label: "Open the Door", message: "What's something you've been dreaming about lately? Tell me everything tonight. 💭", requires: "herPhone" },
    ], freeAlt: "Ask at dinner — then put your phone down and just listen" },
    // 9. Take a candid photo, tell her later why you love it
    { actions: [
      { kind: "SNAPPR", icon: "📸", label: "Hire a Photographer" },
    ], freeAlt: "Catch her laughing today. Send it later with what you noticed." },
    // 10. Make her laugh hard
    { actions: [
      { kind: "SMS_DRAFT", icon: "💬", label: "Send Something Funny", message: "Remember when [inside joke]? 😂", requires: "herPhone" },
    ], freeAlt: "Use the voice or memory that always cracks her up" },
    // 11. Plan a getaway weekend (even one night counts)
    { actions: [
      { kind: "AIRBNB_EXPERIENCES", icon: "🏡", label: "Browse Stays" },
      { kind: "GOOGLE_CALENDAR", icon: "📅", label: "Block the Night", param: "Getaway with {herName}" },
    ], freeAlt: "One night somewhere local counts. Book it tonight." },
    // 12. Tell her: I'd choose you all over again
    { actions: [
      { kind: "SMS_DRAFT", icon: "💬", label: "Send It", message: "I'd choose you all over again. Every time. 💍", requires: "herPhone" },
      { kind: "MEJURI", icon: "💍", label: "A Small Token" },
    ], freeAlt: "Say it tonight, in person, looking right at her" },
  ],
  EL: [
    // 1. Cook her favorite meal at home, set the table properly
    { actions: [
      { kind: "INSTACART", icon: "🛒", label: "Order Ingredients" },
      { kind: "HELLOFRESH", icon: "🍱", label: "Meal Kit" },
    ], freeAlt: "Cook from what's in the fridge — set the table like company's coming" },
    // 2. Cozy movie night — let her pick, popcorn how she likes it
    { actions: [
      { kind: "INSTACART", icon: "🛒", label: "Popcorn + Snacks", param: "popcorn movie night" },
      { kind: "SPOTIFY_PLAYLIST", icon: "🎵", label: "Pre-Movie Vibe", param: "cozy night in" },
    ], freeAlt: "Make her popcorn the way she likes — let her pick the movie" },
    // 3. Light candles before she gets home, soft lighting, music low
    { actions: [
      { kind: "AMAZON_SEARCH", icon: "🕯️", label: "Get Candles", param: "scented candles cozy" },
      { kind: "SPOTIFY_PLAYLIST", icon: "🎵", label: "Soft Music", param: "soft evening jazz" },
    ], freeAlt: "Use whatever candles you have. Lights low. Music quiet." },
    // 4. Take something off her mental load
    { actions: [
      { kind: "GOOGLE_CALENDAR", icon: "📅", label: "Own a Calendar Item" },
      { kind: "TASKRABBIT", icon: "🔧", label: "Outsource the Task" },
    ], freeAlt: "Pick one appointment, RSVP, or kid thing — own it end-to-end" },
    // 5. Send a sweet "just because" text
    { actions: [
      { kind: "SMS_DRAFT", icon: "💬", label: "Just Because", message: "Just thinking about you. No reason. Hope your day's good. 💕", requires: "herPhone" },
      { kind: "WHATSAPP", icon: "💬", label: "WhatsApp", message: "Just thinking about you. No reason. Hope your day's good. 💕", requires: "herPhone" },
    ], freeAlt: "Send a voice note — same words, more warmth" },
    // 6. Ask: how are you really doing this week?
    { actions: [
      { kind: "SMS_DRAFT", icon: "💬", label: "Open the Door", message: "How are you actually doing this week? I want the real answer. 💙", requires: "herPhone" },
    ], freeAlt: "Ask in person tonight — then listen without trying to fix" },
    // 7. Tidy one space she cares about
    { actions: [
      { kind: "AMAZON_SEARCH", icon: "🛒", label: "Organizers", param: "kitchen counter organizer" },
      { kind: "TASKRABBIT", icon: "🔧", label: "Hire Help" },
    ], freeAlt: "20 minutes on one surface — kitchen, bedroom, or entry" },
    // 8. Bring home her favorite treat
    { actions: [
      { kind: "INSTACART", icon: "🛒", label: "Deliver Her Treat", param: "{snack}" },
      { kind: "DOORDASH", icon: "🛒", label: "DoorDash It", param: "{snack}" },
    ], freeAlt: "Pick up {snack} on the way home — she loves it" },
    // 9. Hold her longer than usual when you hug
    { actions: [], freeAlt: "Just count to ten in the hug. Don't let go first." },
    // 10. Write down 3 things you appreciate, read one out loud
    { actions: [
      { kind: "AMAZON_SEARCH", icon: "🛒", label: "Nice Notebook", param: "small leather notebook" },
    ], freeAlt: "Any paper works. The reading-it-aloud part is what matters." },
    // 11. Plan a quiet weekend morning — coffee in bed, nowhere to be
    { actions: [
      { kind: "GOOGLE_CALENDAR", icon: "📅", label: "Block Sat Morning", param: "Slow morning with {herName}" },
      { kind: "INSTACART", icon: "🛒", label: "Pastries + Coffee", param: "fresh pastries" },
    ], freeAlt: "Just protect Saturday morning — no plans, coffee in bed" },
    // 12. Ask about her friends by name
    { actions: [
      { kind: "SMS_DRAFT", icon: "💬", label: "Ask About a Friend", message: "How's [her friend's name] doing lately? Anything new with her?", requires: "herPhone" },
    ], freeAlt: "Bring it up at dinner — use the name, remember the details" },
  ],
  LL: [
    // 1. Lead with patience — don't take sideways landings personally
    { actions: [], freeAlt: "Pause before you respond today. Patience is the whole prompt." },
    // 2. Don't try to fix it. Say "tell me more"
    { actions: [
      { kind: "SMS_DRAFT", icon: "💬", label: "Tell Me More", message: "That makes sense. Tell me more — I'm listening. 💙", requires: "herPhone" },
    ], freeAlt: "Say it in person — then actually let her talk without interrupting" },
    // 3. Anticipate one thing she'll need and have it ready
    { actions: [
      { kind: "INSTACART", icon: "🛒", label: "Stock Her Comfort", param: "{snack}" },
      { kind: "AMAZON_SEARCH", icon: "🛒", label: "What She'll Need", param: "{snack}" },
    ], freeAlt: "Pick the thing she always reaches for — have it on the counter" },
    // 4. Apologize first if there's any tension
    { actions: [
      { kind: "SMS_DRAFT", icon: "💬", label: "Apologize First", message: "Hey — I've been thinking. I'm sorry about earlier. You didn't deserve that energy from me. 💙", requires: "herPhone" },
    ], freeAlt: "Say it in person tonight — first, before she has to bring it up" },
    // 5. Take the kids/dog/dishes off her plate, no big deal made
    { actions: [
      { kind: "TASKRABBIT", icon: "👶", label: "Book Babysitter" },
    ], freeAlt: "Just do it — quietly. The lack of announcement is the gift." },
    // 6. Say: you've been carrying a lot. Let me handle dinner.
    { actions: [
      { kind: "DOORDASH", icon: "🛒", label: "Handle Dinner", param: "{cuisine}" },
      { kind: "INSTACART", icon: "🛒", label: "Order Groceries" },
    ], freeAlt: "Cook something simple. Tell her: 'I've got dinner. Sit down.'" },
    // 7. Lower the temperature — soft voice, slow movements
    { actions: [
      { kind: "SPOTIFY_PLAYLIST", icon: "🎵", label: "Calm the Room", param: "calm ambient soft" },
    ], freeAlt: "Soft voice. Slow walk. Phone away. That's it." },
    // 8. Send a text mid-day: thinking of you, you're doing more than you know
    { actions: [
      { kind: "SMS_DRAFT", icon: "💬", label: "Send the Text", message: "Thinking of you. You're doing more than you know. 💙", requires: "herPhone" },
      { kind: "WHATSAPP", icon: "💬", label: "WhatsApp", message: "Thinking of you. You're doing more than you know. 💙", requires: "herPhone" },
    ], freeAlt: "Send a voice note instead — your voice will carry it further" },
    // 9. Ask: anything you're worrying about that I could just take care of?
    { actions: [
      { kind: "SMS_DRAFT", icon: "💬", label: "Open the Offer", message: "Is there anything you're worrying about that I could just take off your plate?", requires: "herPhone" },
    ], freeAlt: "Ask in person — and follow through on whatever she names" },
    // 10. Turn off the TV, ask about her day before launching into yours
    { actions: [], freeAlt: "TV off. Phone away. Ask first. Listen all the way through." },
    // 11. Bring her tea, water, or her comfort drink
    { actions: [
      { kind: "INSTACART", icon: "🛒", label: "Stock Her Drink", param: "{snack}" },
    ], freeAlt: "Make it now and bring it to her — no questions asked" },
    // 12. Tell her: I love you, you don't have to perform anything tonight
    { actions: [
      { kind: "SMS_DRAFT", icon: "💬", label: "Send It", message: "I love you. We're good. You don't have to perform anything tonight. 💙", requires: "herPhone" },
      { kind: "CALM_GIFT", icon: "🧘", label: "Gift Calm" },
    ], freeAlt: "Say it tonight, in person, and let her exhale" },
  ],
};

export function getActionGroupForDay(
  day: number,
  variation: number,
  cycleLength: number,
): DayActionGroup | null {
  const phase = phaseForDay(day, cycleLength);
  const list = PHASE_ACTIONS[phase];
  if (!list || list.length === 0) return null;
  const group = list[(variation - 1) % list.length];
  // Hide chip rows that are intentionally empty (e.g., "this one's all you")
  if (!group || group.actions.length === 0) {
    return group?.freeAlt ? group : null;
  }
  return group;
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
    .replace(/\{cuisine\}/g, profile.cuisine || "")
    .replace(/\{snack\}/g, profile.favoriteSnack || "her favorite snack");
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
