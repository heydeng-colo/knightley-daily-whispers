import { HelpCircle, Mail } from "lucide-react";

export function HelpScreen() {
  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-semibold pt-2">Help</h1>
      <div className="rounded-3xl bg-surface border border-border p-6 text-center">
        <HelpCircle className="h-10 w-10 text-gold mx-auto mb-3" />
        <p className="text-sm text-muted-foreground leading-relaxed">
          Help center coming soon. Tap a daily prompt and try it. Log how it went.
          Patterns will emerge over the first few cycles.
        </p>
        <a href="mailto:hello@knightley.app" className="inline-flex items-center gap-2 mt-5 text-sm text-gold">
          <Mail className="h-4 w-4" /> Contact support
        </a>
      </div>
    </div>
  );
}
