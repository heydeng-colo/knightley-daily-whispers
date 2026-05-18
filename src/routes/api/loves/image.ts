import { createFileRoute } from "@tanstack/react-router";
import "@tanstack/react-start";

// Runtime image generation for "loves" prompts added by the learning system
// after the initial pre-generated batch (src/assets/loves/*).
// Caller passes { prompt }; we return { dataUrl } (base64 PNG/JPEG data URL)
// suitable for the client to cache (e.g. in localStorage keyed by prompt).
//
// Pre-generated images live in src/assets/loves/. Only call this for NEW
// prompts not in the initial deck.

const STYLE =
  "Soft-focus cinematic photograph, shallow depth of field, heavy bokeh, " +
  "warm golden-hour lighting, muted moody tones, romantic intimate atmosphere, " +
  "blurred background suitable as a card backdrop, no text, no logos, " +
  "no faces in sharp focus, painterly and dreamy. Subject: ";

export const Route = createFileRoute("/api/loves/image")({
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => {
        const key = process.env.LOVABLE_API_KEY;
        if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });

        let body: { prompt?: unknown };
        try {
          body = (await request.json()) as { prompt?: unknown };
        } catch {
          return new Response("Invalid JSON", { status: 400 });
        }
        const prompt = typeof body.prompt === "string" ? body.prompt.trim() : "";
        if (!prompt || prompt.length > 500) {
          return new Response("prompt must be 1-500 chars", { status: 400 });
        }

        const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Lovable-API-Key": key,
          },
          body: JSON.stringify({
            model: "google/gemini-3.1-flash-image-preview",
            messages: [{ role: "user", content: STYLE + prompt }],
            modalities: ["image", "text"],
          }),
        });

        if (resp.status === 429)
          return new Response("Rate limited", { status: 429 });
        if (resp.status === 402)
          return new Response("Credits exhausted", { status: 402 });
        if (!resp.ok)
          return new Response(`Gateway error ${resp.status}`, { status: 502 });

        const json = (await resp.json()) as {
          choices?: Array<{
            message?: {
              images?: Array<{ image_url?: { url?: string } }>;
            };
          }>;
        };
        const dataUrl =
          json.choices?.[0]?.message?.images?.[0]?.image_url?.url ?? null;
        if (!dataUrl)
          return new Response("No image returned", { status: 502 });

        return Response.json({ dataUrl });
      },
    },
  },
});
