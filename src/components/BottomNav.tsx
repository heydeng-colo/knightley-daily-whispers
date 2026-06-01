import { Home, Calendar, User, HelpCircle, ShieldCheck } from "lucide-react";

export type Tab = "home" | "calendar" | "profile" | "privacy" | "help";

export function BottomNav({ tab, onChange }: { tab: Tab; onChange: (t: Tab) => void }) {
  const items: { id: Tab; label: string; Icon: typeof Home }[] = [
    { id: "home", label: "Home", Icon: Home },
    { id: "calendar", label: "Calendar", Icon: Calendar },
    { id: "profile", label: "Profile", Icon: User },
    { id: "privacy", label: "Privacy", Icon: ShieldCheck },
    { id: "help", label: "Help", Icon: HelpCircle },
  ];
  return (
    <nav className="fixed bottom-0 inset-x-0 glass border-t border-border z-30">
      <div className="mx-auto max-w-md grid grid-cols-5">
        {items.map(({ id, label, Icon }) => {
          const active = tab === id;
          return (
            <button
              key={id}
              onClick={() => onChange(id)}
              className={`flex flex-col items-center gap-1 py-3 transition ${
                active ? "text-gold" : "text-muted-foreground"
              }`}
            >
              <Icon className="h-5 w-5" strokeWidth={active ? 2.5 : 2} />
              <span className="text-[10px] tracking-wide">{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
