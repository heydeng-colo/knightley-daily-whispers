import { ShieldCheck, Check, X, MessageSquare, Lock, Ban, OctagonX } from "lucide-react";

const sectionLabel: React.CSSProperties = {
  fontFamily: "'Courier New', monospace",
  fontSize: 10,
  fontWeight: 700,
  color: "#C9A84C",
  letterSpacing: "0.15em",
  textTransform: "uppercase",
  marginBottom: 12,
};

const divider: React.CSSProperties = {
  height: 1,
  background: "rgba(255,255,255,0.06)",
  margin: "8px 0 20px",
};

function ColumnCard({
  tone,
  Icon,
  label,
  items,
}: {
  tone: "good" | "bad";
  Icon: typeof Check;
  label: string;
  items: string[];
}) {
  const palette =
    tone === "good"
      ? { bg: "rgba(26,122,74,0.12)", border: "rgba(26,122,74,0.25)", color: "#1A7A4A" }
      : { bg: "rgba(139,32,53,0.10)", border: "rgba(139,32,53,0.20)", color: "#8B2035" };
  return (
    <div
      style={{
        background: palette.bg,
        border: `1px solid ${palette.border}`,
        borderRadius: 4,
        padding: "12px 14px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          color: palette.color,
          fontFamily: "'Courier New', monospace",
          fontSize: 10,
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          marginBottom: 8,
        }}
      >
        <Icon size={12} strokeWidth={3} />
        <span>{label}</span>
      </div>
      <ul style={{ fontSize: 11.5, color: "#94A3B8", lineHeight: 1.7, listStyle: "none", padding: 0, margin: 0 }}>
        {items.map((it) => (
          <li key={it}>{it}</li>
        ))}
      </ul>
    </div>
  );
}

function RowCard({
  Icon,
  title,
  body,
}: {
  Icon: typeof MessageSquare;
  title: string;
  body: string;
}) {
  return (
    <div
      style={{
        background: "#1B2A4A",
        borderRadius: 4,
        padding: "14px 16px",
        display: "flex",
        gap: 12,
        alignItems: "flex-start",
      }}
    >
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: "50%",
          background: "#C9A84C",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Icon size={15} color="#0E1E35" strokeWidth={2.5} />
      </div>
      <div>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#EEF2F7", marginBottom: 4 }}>{title}</div>
        <div style={{ fontSize: 12, color: "#94A3B8", lineHeight: 1.55 }}>{body}</div>
      </div>
    </div>
  );
}

export function PrivacyScreen() {
  return (
    <div
      style={{
        background: "#0E1E35",
        minHeight: "100%",
        margin: "-16px -20px -112px",
        padding: "28px 20px",
        color: "#EEF2F7",
      }}
    >
      {/* Hero */}
      <div
        style={{
          textAlign: "center",
          paddingBottom: 28,
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          marginBottom: 28,
        }}
      >
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: "50%",
            background: "#C9A84C",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 14px",
          }}
        >
          <ShieldCheck size={24} color="#0E1E35" strokeWidth={2.5} />
        </div>
        <h1
          style={{
            fontFamily: "Georgia, serif",
            fontSize: 20,
            fontWeight: 700,
            color: "#F0C96A",
            marginBottom: 8,
          }}
        >
          Anonymous and Private, Now and Always
        </h1>
        <p
          style={{
            fontSize: 13,
            color: "#94A3B8",
            lineHeight: 1.6,
            maxWidth: 320,
            margin: "0 auto",
          }}
        >
          Here's exactly what Attuned collects — and what it doesn't.
        </p>
      </div>

      {/* What we collect */}
      <div style={sectionLabel}>What we collect</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 24 }}>
        <ColumnCard
          tone="good"
          Icon={Check}
          label="We do collect"
          items={[
            "Your name and email",
            "Her first initial",
            "Her cycle start date",
            "Her preferences (as you describe them)",
            "Your prompt feedback ratings",
            "Her monthly SMS rating (anonymous)",
          ]}
        />
        <ColumnCard
          tone="bad"
          Icon={X}
          label="We never collect"
          items={[
            "Her full name",
            "Her date of birth or age",
            "Her email or account",
            "Her location",
            "Any health or medical records",
            "Your anniversary or birthday year",
          ]}
        />
      </div>

      <div style={divider} />

      {/* About the monthly check-in */}
      <div style={sectionLabel}>About the monthly check-in</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
        <RowCard
          Icon={MessageSquare}
          title="She receives one anonymous text per month"
          body="The message doesn't mention Attuned. It doesn't identify you as the sender. Everything else stays off her plate."
        />
        <RowCard
          Icon={Lock}
          title="Her number is never stored permanently"
          body="Her phone number is used only to send the monthly message. It is not linked to any profile, not shared with any partner, and not retained beyond delivery."
        />
        <RowCard
          Icon={OctagonX}
          title="You can turn it off at any time"
          body="The monthly check-in is optional. Disable it in Profile → Her Check-In at any time. No messages will be sent after you turn it off."
        />
      </div>

      <div style={divider} />

      {/* Data and revenue */}
      <div style={sectionLabel}>Data and revenue</div>
      <div style={{ marginBottom: 24 }}>
        <RowCard
          Icon={Ban}
          title="We never sell your data"
          body="Attuned earns revenue through optional affiliate actions you choose to take and through subscription tiers. Never through your personal information."
        />
      </div>

      {/* Footer */}
      <div
        style={{
          background: "#1B2A4A",
          borderRadius: 4,
          padding: "14px 16px",
          textAlign: "center",
          fontSize: 11.5,
          color: "#475569",
          fontStyle: "italic",
          lineHeight: 1.6,
        }}
      >
        Questions about your data? Contact us at privacy@attuned.in
        <br />
        This policy applies now and always — it will never change without your explicit consent.
      </div>
    </div>
  );
}
