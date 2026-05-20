// Single source of truth for affiliate partners.
// Do not hardcode partner names or URLs elsewhere — reference this file.

export type BrandTier = 1 | 2 | 3;

export interface AffiliatePartner {
  label: string;
  category: string;
  brandTier: BrandTier | null;
  utilityChip: boolean;
  baseUrl: string;
  affiliateUrl: string | null;
  comingSoon: boolean;
}

export const AFFILIATE_PARTNERS: Record<string, AffiliatePartner> = {
  // ── UTILITY CHIPS ──
  sms:        { label: "SMS Draft",      category: "messaging",    brandTier: null, utilityChip: true,  baseUrl: "sms:",                              affiliateUrl: null, comingSoon: false },
  voicememo:  { label: "Voice Memo",     category: "messaging",    brandTier: null, utilityChip: true,  baseUrl: "voicememo://",                      affiliateUrl: null, comingSoon: false },
  spotify:    { label: "Spotify",        category: "ambiance",     brandTier: null, utilityChip: true,  baseUrl: "https://open.spotify.com",          affiliateUrl: null, comingSoon: false },
  gcal:       { label: "Google Cal",     category: "planning",     brandTier: null, utilityChip: true,  baseUrl: "https://calendar.google.com",       affiliateUrl: null, comingSoon: false },

  // ── CLASSIC — Brand Tier 1 ──
  amazon:       { label: "Amazon",            category: "gifts",         brandTier: 1, utilityChip: false, baseUrl: "https://amazon.com",                 affiliateUrl: "https://amzn.to/attuned",                       comingSoon: false },
  doordash:     { label: "DoorDash",          category: "food_delivery", brandTier: 1, utilityChip: false, baseUrl: "https://doordash.com",               affiliateUrl: "https://doordash.com/?ref=attuned",             comingSoon: false },
  instacart:    { label: "Instacart",         category: "grocery",       brandTier: 1, utilityChip: false, baseUrl: "https://instacart.com",              affiliateUrl: "https://instacart.com/?ref=attuned",            comingSoon: false },
  hellofresh:   { label: "HelloFresh",        category: "food_delivery", brandTier: 1, utilityChip: false, baseUrl: "https://hellofresh.com",             affiliateUrl: "https://hellofresh.com/?ref=attuned",           comingSoon: false },
  flowers1800:  { label: "1-800-Flowers",     category: "flowers",       brandTier: 1, utilityChip: false, baseUrl: "https://1800flowers.com",            affiliateUrl: "https://1800flowers.com/?ref=attuned",          comingSoon: false },
  teleflora:    { label: "Teleflora",         category: "flowers",       brandTier: 1, utilityChip: false, baseUrl: "https://teleflora.com",              affiliateUrl: "https://teleflora.com/?ref=attuned",            comingSoon: false },
  opentable:    { label: "OpenTable",         category: "dining",        brandTier: 1, utilityChip: false, baseUrl: "https://opentable.com",              affiliateUrl: "https://opentable.com/?ref=attuned",            comingSoon: false },
  audible:      { label: "Audible",           category: "gifts",         brandTier: 1, utilityChip: false, baseUrl: "https://audible.com",                affiliateUrl: "https://audible.com/?ref=attuned",              comingSoon: false },
  groupon:      { label: "Groupon",           category: "experiences",   brandTier: 1, utilityChip: false, baseUrl: "https://groupon.com",                affiliateUrl: "https://groupon.com/?ref=attuned",              comingSoon: false },
  calm:         { label: "Calm",              category: "wellness",      brandTier: 1, utilityChip: false, baseUrl: "https://calm.com",                   affiliateUrl: "https://calm.com/?ref=attuned",                 comingSoon: false },
  mindbody:     { label: "Mindbody",          category: "wellness",      brandTier: 1, utilityChip: false, baseUrl: "https://mindbodyonline.com",         affiliateUrl: "https://mindbodyonline.com/?ref=attuned",       comingSoon: false },

  // ── CURATED — Brand Tier 2 ──
  urbanstems:       { label: "UrbanStems",         category: "flowers",       brandTier: 2, utilityChip: false, baseUrl: "https://urbanstems.com",          affiliateUrl: "https://urbanstems.com/?ref=attuned",          comingSoon: false },
  bouqs:            { label: "Bouqs",              category: "flowers",       brandTier: 2, utilityChip: false, baseUrl: "https://bouqs.com",               affiliateUrl: "https://bouqs.com/?ref=attuned",               comingSoon: false },
  farmgirl:         { label: "Farmgirl Flowers",   category: "flowers",       brandTier: 2, utilityChip: false, baseUrl: "https://farmgirlflowers.com",     affiliateUrl: "https://farmgirlflowers.com/?ref=attuned",     comingSoon: false },
  resy:             { label: "Resy",               category: "dining",        brandTier: 2, utilityChip: false, baseUrl: "https://resy.com",                affiliateUrl: "https://resy.com/?ref=attuned",                comingSoon: false },
  goldbelly:        { label: "Goldbelly",          category: "food_delivery", brandTier: 2, utilityChip: false, baseUrl: "https://goldbelly.com",           affiliateUrl: "https://goldbelly.com/?ref=attuned",           comingSoon: false },
  goodeggs:         { label: "Good Eggs",          category: "grocery",       brandTier: 2, utilityChip: false, baseUrl: "https://goodeggs.com",            affiliateUrl: "https://goodeggs.com/?ref=attuned",            comingSoon: false },
  mejuri:           { label: "Mejuri",             category: "jewelry",       brandTier: 2, utilityChip: false, baseUrl: "https://mejuri.com",              affiliateUrl: "https://mejuri.com/?ref=attuned",              comingSoon: false },
  catbird:          { label: "Catbird",            category: "jewelry",       brandTier: 2, utilityChip: false, baseUrl: "https://catbirdnyc.com",          affiliateUrl: "https://catbirdnyc.com/?ref=attuned",          comingSoon: false },
  monicavinader:    { label: "Monica Vinader",     category: "jewelry",       brandTier: 2, utilityChip: false, baseUrl: "https://monicavinader.com",       affiliateUrl: "https://monicavinader.com/?ref=attuned",       comingSoon: false },
  classpass:        { label: "ClassPass",          category: "wellness",      brandTier: 2, utilityChip: false, baseUrl: "https://classpass.com",           affiliateUrl: "https://classpass.com/?ref=attuned",           comingSoon: false },
  zeel:             { label: "Zeel",               category: "wellness",      brandTier: 2, utilityChip: false, baseUrl: "https://zeel.com",                affiliateUrl: "https://zeel.com/?ref=attuned",                comingSoon: false },
  soothe:           { label: "Soothe",             category: "wellness",      brandTier: 2, utilityChip: false, baseUrl: "https://soothe.com",              affiliateUrl: "https://soothe.com/?ref=attuned",              comingSoon: false },
  airbnb:           { label: "Airbnb Experiences", category: "experiences",   brandTier: 2, utilityChip: false, baseUrl: "https://airbnb.com/experiences",  affiliateUrl: "https://airbnb.com/experiences?ref=attuned",   comingSoon: false },
  viator:           { label: "Viator",             category: "experiences",   brandTier: 2, utilityChip: false, baseUrl: "https://viator.com",              affiliateUrl: "https://viator.com/?ref=attuned",              comingSoon: false },
  tinggly:          { label: "Tinggly",            category: "experiences",   brandTier: 2, utilityChip: false, baseUrl: "https://tinggly.com",             affiliateUrl: "https://tinggly.com/?ref=attuned",             comingSoon: false },
  snappr:           { label: "Snappr",             category: "photography",   brandTier: 2, utilityChip: false, baseUrl: "https://snappr.com",              affiliateUrl: "https://snappr.com/?ref=attuned",              comingSoon: false },
  flytographer:     { label: "Flytographer",       category: "photography",   brandTier: 2, utilityChip: false, baseUrl: "https://flytographer.com",        affiliateUrl: "https://flytographer.com/?ref=attuned",        comingSoon: false },
  mrsmith:          { label: "Mr & Mrs Smith",     category: "travel",        brandTier: 2, utilityChip: false, baseUrl: "https://mrandmrssmith.com",       affiliateUrl: "https://mrandmrssmith.com/?ref=attuned",       comingSoon: false },
  tablethotels:     { label: "Tablet Hotels",      category: "travel",        brandTier: 2, utilityChip: false, baseUrl: "https://tablethotels.com",        affiliateUrl: "https://tablethotels.com/?ref=attuned",        comingSoon: false },
  secretescapes:    { label: "Secret Escapes",     category: "travel",        brandTier: 2, utilityChip: false, baseUrl: "https://secretescapes.com",       affiliateUrl: "https://secretescapes.com/?ref=attuned",       comingSoon: false },
  artifactuprising: { label: "Artifact Uprising",  category: "photography",   brandTier: 2, utilityChip: false, baseUrl: "https://artifactuprising.com",    affiliateUrl: "https://artifactuprising.com/?ref=attuned",    comingSoon: false },

  // ── DISTINCTIVE — Brand Tier 3 ──
  tock:           { label: "Tock",                category: "dining",      brandTier: 3, utilityChip: false, baseUrl: "https://exploretock.com",         affiliateUrl: null,                                            comingSoon: true  },
  fourseasonsspa: { label: "Four Seasons Spa",    category: "wellness",    brandTier: 3, utilityChip: false, baseUrl: "https://fourseasons.com/spas",    affiliateUrl: null,                                            comingSoon: true  },
  resyconcierge:  { label: "Resy Concierge",      category: "dining",      brandTier: 3, utilityChip: false, baseUrl: "https://resy.com",                affiliateUrl: null,                                            comingSoon: true  },
  relaischateaux: { label: "Relais & Chateaux",   category: "travel",      brandTier: 3, utilityChip: false, baseUrl: "https://relaischateaux.com",      affiliateUrl: null,                                            comingSoon: true  },
  netaporter:     { label: "Net-a-Porter",        category: "gifts",       brandTier: 3, utilityChip: false, baseUrl: "https://net-a-porter.com",        affiliateUrl: "https://net-a-porter.com/?ref=attuned",         comingSoon: false },
  saks:           { label: "Saks Fifth Avenue",   category: "gifts",       brandTier: 3, utilityChip: false, baseUrl: "https://saksfifthavenue.com",     affiliateUrl: "https://saksfifthavenue.com/?ref=attuned",      comingSoon: false },
  cloud9:         { label: "Cloud 9 Living",      category: "experiences", brandTier: 3, utilityChip: false, baseUrl: "https://cloud9living.com",        affiliateUrl: "https://cloud9living.com/?ref=attuned",         comingSoon: false },
  inspirato:      { label: "Inspirato",           category: "travel",      brandTier: 3, utilityChip: false, baseUrl: "https://inspirato.com",           affiliateUrl: null,                                            comingSoon: true  },
  exhalespa:      { label: "Exhale Spa",          category: "wellness",    brandTier: 3, utilityChip: false, baseUrl: "https://exhalespa.com",           affiliateUrl: null,                                            comingSoon: true  },
  davidyurman:    { label: "David Yurman",        category: "jewelry",     brandTier: 3, utilityChip: false, baseUrl: "https://davidyurman.com",         affiliateUrl: null,                                            comingSoon: true  },
};

export type BrandPreference = "local" | "curated" | "elevated";

// Map the existing app spend tiers to allowed brand tiers.
export const SPEND_TIER_BRAND_TIERS: Record<string, BrandTier[]> = {
  // canonical names
  neighborhood: [1],
  boutique:     [1, 2],
  gallery:      [1, 2],
  estate:       [2, 3],
  reserve:      [2, 3],
  atelier:      [3],
  // existing app spend tiers
  free:    [1],
  "25":    [1, 2],
  "50":    [1, 2],
  "100":   [2, 3],
  "150":   [2, 3],
  "150plus": [3],
};

export const BRAND_PREF_AFFINITIES: Record<BrandPreference, Record<string, BrandTier>> = {
  local:    { flowers: 1, dining: 1, food_delivery: 1, grocery: 1, jewelry: 1, wellness: 1, experiences: 1, photography: 1, travel: 1, gifts: 1 },
  curated:  { flowers: 2, dining: 2, food_delivery: 2, grocery: 2, jewelry: 2, wellness: 2, experiences: 2, photography: 2, travel: 2, gifts: 2 },
  elevated: { flowers: 2, dining: 3, food_delivery: 2, grocery: 2, jewelry: 3, wellness: 2, experiences: 3, photography: 2, travel: 3, gifts: 3 },
};

export interface ChipLike {
  brandKey?: string;
  [k: string]: unknown;
}

export interface ChipUser {
  spendTier?: string;
  brandPreference?: BrandPreference;
  brandAffinities?: Record<string, BrandTier>;
}

export function getEligibleChips<T extends ChipLike>(dayChips: T[], user: ChipUser): T[] {
  const allowedBrandTiers = SPEND_TIER_BRAND_TIERS[user.spendTier || "50"] || [1];
  const affinities =
    user.brandAffinities ||
    BRAND_PREF_AFFINITIES[user.brandPreference || "curated"];

  const filtered = dayChips.filter((chip) => {
    if (!chip.brandKey) return true; // unmapped chips pass through
    const partner = AFFILIATE_PARTNERS[chip.brandKey];
    if (!partner) return false;
    if (partner.comingSoon) return false;
    if (partner.utilityChip) return true;
    if (partner.brandTier == null) return true;
    if (!allowedBrandTiers.includes(partner.brandTier)) return false;
    const affinity = affinities[partner.category];
    if (affinity && Math.abs(partner.brandTier - affinity) > 1) return false;
    return true;
  });

  // Fallback: if filter removed all non-utility chips, restore the highest-tier
  // Classic (tier 1) chip available for the day.
  const hasNonUtility = filtered.some((c) => {
    if (!c.brandKey) return false;
    const p = AFFILIATE_PARTNERS[c.brandKey];
    return p && !p.utilityChip && !p.comingSoon;
  });
  if (!hasNonUtility) {
    const fallback = dayChips.find((c) => {
      if (!c.brandKey) return false;
      const p = AFFILIATE_PARTNERS[c.brandKey];
      return !!p && !p.utilityChip && !p.comingSoon && p.brandTier === 1;
    });
    if (fallback && !filtered.includes(fallback)) return [...filtered, fallback];
  }
  return filtered;
}

// Map existing ActionKind values to brand keys so chips can be filtered by tier.
export const ACTION_KIND_TO_BRAND_KEY: Record<string, string> = {
  AMAZON_SEARCH: "amazon",
  DOORDASH: "doordash",
  INSTACART: "instacart",
  HELLOFRESH: "hellofresh",
  FLOWERS_1800: "flowers1800",
  URBAN_STEMS: "urbanstems",
  OPEN_TABLE: "opentable",
  RESY: "resy",
  CLASSPASS: "classpass",
  MINDBODY: "mindbody",
  CALM_GIFT: "calm",
  AUDIBLE_GIFT: "audible",
  MEJURI: "mejuri",
  SNAPPR: "snappr",
  AIRBNB_EXPERIENCES: "airbnb",
  SMS_DRAFT: "sms",
  WHATSAPP: "sms",
  VOICE_MEMO: "voicememo",
  SPOTIFY_PLAYLIST: "spotify",
  GOOGLE_CALENDAR: "gcal",
  APPLE_CALENDAR: "gcal",
};
