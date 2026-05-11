// Contextual action chips for daily prompts.

import type { Profile } from "./storage";

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
  | "1800_FLOWERS"
  | "CLASSPASS"
  | "SNAPPR"
  | "AIRBNB_EXPERIENCES"
  | "VOICE_MEMO"
  | "APPLE_CALENDAR";

export interface ActionDef {
  kind: ActionKind;
  icon: string;       // emoji
  label: string;
  /** Search term / event title / coffee phrase (with {herName} {restaurantName} {coffeeOrder} placeholders). */
  param?: string;
  /** Pre-written SMS / WhatsApp message body (placeholders allowed). */
  message?: string;
  /** Profile field that must be present, otherwise chip is disabled. */
  requires?: keyof Profile;
}

// Map: cycle day -> ordered list of actions (max 3)
export const DAY_ACTIONS: Record<number, ActionDef[]> = {
  1: [
    { kind: "AMAZON_SEARCH", icon: "🛒", label: "Order Heat Pad", param: "electric heat pad" },
    { kind: "GOOGLE_CALENDAR", icon: "📅", label: "Add Reminder", param: "Comfort day for {herName}" },
  ],
  2: [
    { kind: "DOORDASH", icon: "🛒", label: "Order Delivery" },
    { kind: "INSTACART", icon: "🛒", label: "Order Groceries" },
  ],
  3: [
    { kind: "SMS_DRAFT", icon: "💬", label: "Send Text Draft", message: "Hey {herName}, just thinking of you today. Hope you're feeling okay 💕", requires: "herPhone" },
    { kind: "WHATSAPP", icon: "💬", label: "WhatsApp Draft", message: "Hey {herName}, just thinking of you today. Hope you're feeling okay 💕", requires: "herPhone" },
  ],
  4: [
    { kind: "SPOTIFY_PLAYLIST", icon: "🎵", label: "Set the Mood", param: "cozy evening playlist" },
  ],
  5: [
    { kind: "DOORDASH", icon: "☕", label: "Order Her Coffee", param: "{coffeeOrder}" },
    { kind: "GOOGLE_CALENDAR", icon: "📅", label: "Add to Calendar", param: "Morning walk with {herName}" },
  ],
  6: [
    { kind: "GOOGLE_CALENDAR", icon: "📅", label: "Block the Weekend", param: "Weekend with {herName}" },
    { kind: "AIRBNB_EXPERIENCES", icon: "🏡", label: "Browse Experiences" },
  ],
  8: [
    { kind: "SMS_DRAFT", icon: "💬", label: "Send a Text", message: "Saw this and thought of you 😂 [paste link]", requires: "herPhone" },
  ],
  10: [
    { kind: "CLASSPASS", icon: "🧘", label: "Find a Class" },
  ],
  11: [
    { kind: "OPEN_TABLE", icon: "🍽️", label: "Reserve a Table", param: "{restaurant}", requires: "restaurant" },
    { kind: "GOOGLE_CALENDAR", icon: "📅", label: "Add Date Night", param: "Date Night 🌙" },
  ],
  12: [
    { kind: "VOICE_MEMO", icon: "🎙️", label: "Record Voice Note" },
  ],
  13: [
    { kind: "SPOTIFY_PLAYLIST", icon: "🎵", label: "Set the Mood", param: "romantic playlist" },
  ],
  14: [
    { kind: "URBAN_STEMS", icon: "🌸", label: "Order Flowers" },
    { kind: "OPEN_TABLE", icon: "🍽️", label: "Reserve Lunch", param: "{restaurant}", requires: "restaurant" },
    { kind: "SMS_DRAFT", icon: "💬", label: "Text Her", message: "Thinking of surprising you today 👀", requires: "herPhone" },
  ],
  15: [
    { kind: "RESY", icon: "🍽️", label: "Book Dinner", param: "{restaurant}", requires: "restaurant" },
    { kind: "GOOGLE_CALENDAR", icon: "📅", label: "Add to Calendar", param: "Evening with {herName} 🌹" },
  ],
  16: [
    { kind: "SMS_DRAFT", icon: "💬", label: "Send Text", message: "I just want you to know I think you're incredible. I was bragging about you today 😊", requires: "herPhone" },
  ],
  17: [
    { kind: "SNAPPR", icon: "📸", label: "Book Photographer" },
    { kind: "GOOGLE_CALENDAR", icon: "📅", label: "Schedule It", param: "Photo date with {herName}" },
  ],
  18: [
    { kind: "SPOTIFY_PLAYLIST", icon: "🎵", label: "Set the Mood", param: "romantic evening playlist" },
  ],
  19: [
    { kind: "INSTACART", icon: "🛒", label: "Order Ingredients" },
    { kind: "SPOTIFY_PLAYLIST", icon: "🎵", label: "Dinner Playlist", param: "slow dinner at home playlist" },
  ],
  20: [
    { kind: "AMAZON_SEARCH", icon: "🛒", label: "Cleaning Supplies", param: "home cleaning essentials" },
  ],
  22: [
    { kind: "GOOGLE_CALENDAR", icon: "📅", label: "Block Time", param: "Us Time — Life Admin 📋" },
  ],
  23: [
    { kind: "SPOTIFY_PLAYLIST", icon: "🎵", label: "Her Playlist", param: "relaxing solo time playlist" },
  ],
  24: [
    { kind: "AMAZON_SEARCH", icon: "🛒", label: "Get Sticky Notes", param: "colorful sticky notes" },
  ],
  25: [
    { kind: "SPOTIFY_PLAYLIST", icon: "🎵", label: "Cozy Playlist", param: "cozy night in playlist" },
  ],
  27: [
    { kind: "AMAZON_SEARCH", icon: "🛒", label: "Massage Oil", param: "massage oil couples" },
    { kind: "SPOTIFY_PLAYLIST", icon: "🎵", label: "Relaxing Music", param: "relaxing massage music" },
  ],
  28: [
    { kind: "DOORDASH", icon: "☕", label: "Order Her Coffee", param: "{coffeeOrder}" },
  ],
  29: [
    { kind: "AMAZON_SEARCH", icon: "🛒", label: "Cleaning Supplies", param: "home organization" },
  ],
  33: [
    { kind: "DOORDASH", icon: "🛒", label: "Order Food" },
    { kind: "AMAZON_SEARCH", icon: "🛒", label: "Get Candles", param: "scented candles relaxing" },
  ],
  35: [
    { kind: "INSTACART", icon: "🛒", label: "Supplies" },
  ],
  36: [
    { kind: "SMS_DRAFT", icon: "💬", label: "Send Text", message: "Thinking of you right now 💙 Hope your day is going okay.", requires: "herPhone" },
    { kind: "WHATSAPP", icon: "💬", label: "WhatsApp", message: "Thinking of you right now 💙 Hope your day is going okay.", requires: "herPhone" },
  ],
  38: [
    { kind: "AMAZON_SEARCH", icon: "🛒", label: "Bath Essentials", param: "bath salts relaxing gift set" },
    { kind: "SPOTIFY_PLAYLIST", icon: "🎵", label: "Bath Playlist", param: "relaxing bath music" },
  ],
  39: [
    { kind: "SMS_DRAFT", icon: "💬", label: "Send Text", message: "Hey {herName} — just wanted you to know I see you and I've got you. Always. 💕", requires: "herPhone" },
  ],
  40: [
    { kind: "GOOGLE_CALENDAR", icon: "📅", label: "Plan Next Cycle", param: "New cycle — Day 1 prep" },
    { kind: "AMAZON_SEARCH", icon: "🛒", label: "Stock Up", param: "electric heat pad" },
  ],
};

export function getActionsForDay(day: number): ActionDef[] {
  return DAY_ACTIONS[day] || [];
}

/** Replace {herName} {restaurantName} {coffeeOrder} with profile values. */
export function fillTemplate(template: string, profile: Profile): string {
  return template
    .replace(/\{herName\}/g, profile.herName || "love")
    .replace(/\{restaurant\}/g, profile.restaurant || "")
    .replace(/\{restaurantName\}/g, profile.restaurant || "")
    .replace(/\{coffeeOrder\}/g, profile.coffeeOrder || "coffee");
}

/** Build the URL/scheme to open. For SMS_DRAFT, message is provided dynamically. */
export function buildActionUrl(action: ActionDef, profile: Profile, draftMessage?: string): string {
  const param = action.param ? encodeURIComponent(fillTemplate(action.param, profile)) : "";
  const phone = (profile.herPhone || "").replace(/[^\d+]/g, "");
  const msg = encodeURIComponent(fillTemplate(draftMessage ?? action.message ?? "", profile));

  switch (action.kind) {
    case "AMAZON_SEARCH":
      return `https://www.amazon.com/s?k=${param}`;
    case "GOOGLE_CALENDAR":
      return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${param}`;
    case "DOORDASH":
      return action.param
        ? `https://www.doordash.com/search/store/${param}`
        : `https://www.doordash.com`;
    case "INSTACART":
      return "https://www.instacart.com";
    case "SMS_DRAFT":
      return `sms:${phone}${/iPhone|iPad|iPod|Mac/.test(typeof navigator !== "undefined" ? navigator.userAgent : "") ? "&" : "?"}body=${msg}`;
    case "WHATSAPP":
      return `https://wa.me/${phone.replace(/^\+/, "")}?text=${msg}`;
    case "SPOTIFY_PLAYLIST":
      return `https://open.spotify.com/search/${param}`;
    case "OPEN_TABLE":
      return `https://www.opentable.com/s/?term=${param}`;
    case "RESY":
      return `https://resy.com/cities/ny?query=${param}`;
    case "URBAN_STEMS":
      return "https://urbanstems.com";
    case "1800_FLOWERS":
      return "https://www.1800flowers.com";
    case "CLASSPASS":
      return "https://classpass.com/search";
    case "SNAPPR":
      return "https://www.snappr.com";
    case "AIRBNB_EXPERIENCES":
      return "https://www.airbnb.com/s/experiences";
    case "VOICE_MEMO":
      return "com.apple.VoiceMemos://";
    case "APPLE_CALENDAR":
      return "calshow://";
    default:
      return "#";
  }
}
