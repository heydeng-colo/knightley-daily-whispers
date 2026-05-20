import { createFileRoute } from "@tanstack/react-router";
import "@tanstack/react-start";
import { AFFILIATE_PARTNERS } from "@/lib/affiliatePartners";

interface Suggestion {
  brandKey: string;
  label: string;
  brandTier: number | null;
  category: string;
  affiliateUrl: string;
}

export const Route = createFileRoute("/api/v1/feedback/other")({
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => {
        const key = process.env.LOVABLE_API_KEY;
        if (!key) return Response.json({ suggestions: [], fallbackMessage: "Noted — we'll factor this in." });

        let body: { freeTextInput?: unknown };
        try {
          body = (await request.json()) as { freeTextInput?: unknown };
        } catch {
          return new Response("Invalid JSON", { status: 400 });
        }
        const input = typeof body.freeTextInput === "string" ? body.freeTextInput.trim() : "";
        if (!input || input.length > 500) {
          return new Response("freeTextInput must be 1-500 chars", { status: 400 });
        }

        // Build catalog of routable partners (have affiliateUrl, not coming soon, not utility).
        const catalog = Object.entries(AFFILIATE_PARTNERS)
          .filter(([, p]) => !p.comingSoon && !p.utilityChip && p.affiliateUrl)
          .map(([brandKey, p]) => ({
            brandKey,
            label: p.label,
            category: p.category,
            brandTier: p.brandTier,
          }));

        const systemPrompt =
          "You match a user's free-text intent for a relationship gesture to the best affiliate partner from a catalog. " +
          "Return strict JSON only: {\"brandKeys\":[\"key1\",\"key2\",\"key3\"]} ranked by confidence (highest first), " +
          "up to 4 keys, only from the provided catalog. If nothing fits, return {\"brandKeys\":[]}.";
        const userPrompt =
          `User intent: ${JSON.stringify(input)}\n\nCatalog:\n${JSON.stringify(catalog)}`;

        let brandKeys: string[] = [];
        try {
          const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Lovable-API-Key": key,
            },
            body: JSON.stringify({
              model: "google/gemini-3-flash-preview",
              messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt },
              ],
              response_format: { type: "json_object" },
            }),
          });
          if (resp.ok) {
            const data = (await resp.json()) as { choices?: Array<{ message?: { content?: string } }> };
            const content = data.choices?.[0]?.message?.content || "{}";
            const parsed = JSON.parse(content) as { brandKeys?: unknown };
            if (Array.isArray(parsed.brandKeys)) {
              brandKeys = parsed.brandKeys.filter((k): k is string => typeof k === "string");
            }
          }
        } catch {
          // fall through to empty suggestions
        }

        const suggestions: Suggestion[] = [];
        for (const k of brandKeys) {
          const p = AFFILIATE_PARTNERS[k];
          if (!p || p.comingSoon || p.utilityChip || !p.affiliateUrl) continue;
          if (suggestions.find((s) => s.brandKey === k)) continue;
          suggestions.push({
            brandKey: k,
            label: p.label,
            brandTier: p.brandTier,
            category: p.category,
            affiliateUrl: p.affiliateUrl,
          });
          if (suggestions.length >= 4) break;
        }

        if (suggestions.length === 0) {
          return Response.json({
            suggestions: [],
            fallbackMessage: "Noted — we'll factor this in. ✓",
          });
        }
        return Response.json({ suggestions });
      },
    },
  },
});
