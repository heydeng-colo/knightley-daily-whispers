import { useNavigate } from "@tanstack/react-router";
import { User, Lightbulb, TrendingUp } from "lucide-react";

const C = {
  navy: "#0E1E35",
  navy2: "#1B2A4A",
  navy3: "#243550",
  gold: "#C9A84C",
  gold2: "#F0C96A",
  white: "#FFFFFF",
  off: "#EEF2F7",
  gray3: "#94A3B8",
  gray4: "#475569",
  teal: "#0D6E8A",
  green: "#1A7A4A",
  purp: "#5C4B8A",
};

const SANS = "system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif";
const SERIF = "Georgia, serif";
const MONO = "'Courier New', Courier, monospace";

export function LandingPage({ onStart }: { onStart: () => void }) {
  const goStart = () => onStart();
  const scrollToHow = () => {
    const el = document.getElementById("how");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const navBtn: React.CSSProperties = {
    background: C.gold,
    color: C.navy,
    fontFamily: SANS,
    fontSize: 12,
    fontWeight: 700,
    padding: "7px 18px",
    borderRadius: 3,
    border: "none",
    cursor: "pointer",
  };

  const heroCta: React.CSSProperties = {
    background: C.gold,
    color: C.navy,
    fontFamily: SANS,
    fontSize: 14,
    fontWeight: 700,
    padding: "14px 32px",
    borderRadius: 3,
    border: "none",
    cursor: "pointer",
    marginBottom: 12,
  };

  const finalCta: React.CSSProperties = {
    background: C.gold,
    color: C.navy,
    fontFamily: SANS,
    fontSize: 15,
    fontWeight: 700,
    padding: "16px 44px",
    borderRadius: 3,
    border: "none",
    cursor: "pointer",
  };

  const sectionLabel: React.CSSProperties = {
    fontFamily: MONO,
    fontSize: 13,
    fontWeight: 700,
    color: C.gold,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    marginBottom: 24,
  };

  const divider: React.CSSProperties = {
    height: 1,
    background:
      "linear-gradient(90deg, transparent, rgba(201,168,76,0.3), transparent)",
    margin: "0 28px",
  };

  const quotes = [
    {
      text: "I'd tell every newlywed and young couple about Attuned.",
      attr: "Survey respondent",
      accent: false,
    },
    {
      text: "It's a great way to remember to check in with your wife and partner.",
      attr: "Survey respondent",
      accent: false,
    },
    {
      text:
        "I would prefer a date at the place down the street that my husband planned, to a fancy night that I planned.",
      attr: "Survey respondent",
      accent: true,
    },
  ];

  const steps = [
    {
      color: C.teal,
      num: "01",
      Icon: User,
      title: "Tell us about her",
      body: "A quick profile — what she loves, her style, her world. Takes 3 minutes.",
      detailLabel: "What this means for you",
      detail: "No guessing. No Googling. One thing, every morning.",
    },
    {
      color: C.green,
      num: "02",
      Icon: Lightbulb,
      title: "Get one daily action",
      body: "One simple prompt each day, timed to her cycle. Always a free option included.",
      detailLabel: "What this means for you",
      detail: "No subscription required to start. Upgrade when you're ready.",
    },
    {
      color: C.purp,
      num: "03",
      Icon: TrendingUp,
      title: "Watch it learn",
      body: "Rate each prompt. She rates you monthly. The app gets smarter every cycle.",
      detailLabel: "What this means for you",
      detail: "The more you use it, the better it knows your relationship.",
    },
  ];

  return (
    <div style={{ background: C.navy, minHeight: "100vh", color: C.white, fontFamily: SANS }}>
      {/* Gold vertical bar */}
      <div
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
          width: 4,
          background: C.gold,
          zIndex: 100,
        }}
      />

      {/* Nav */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: 52,
          background: "rgba(14,30,53,0.96)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(201,168,76,0.18)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 28px 0 28px",
          zIndex: 90,
        }}
      >
        <span
          style={{
            fontFamily: MONO,
            fontSize: 11,
            fontWeight: 700,
            color: C.gold,
            letterSpacing: "0.22em",
          }}
        >
          ATTUNED
        </span>
        <button style={navBtn} onClick={scrollToHow}>
          Get Started for Free
        </button>
      </nav>

      {/* Hero */}
      <section
        style={{
          minHeight: "100vh",
          padding: "120px 40px 80px 44px",
          position: "relative",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 52,
            alignItems: "center",
            minHeight: "calc(100vh - 200px)",
          }}
        >
          <div>
            <div
              style={{
                fontFamily: MONO,
                fontSize: 13,
                fontWeight: 700,
                color: C.gold,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                marginBottom: 22,
              }}
            >
              Built by Men · For Men · For Real-Life Relationships
            </div>
            <h1
              style={{
                fontFamily: SERIF,
                fontSize: 36,
                fontWeight: 700,
                color: C.white,
                lineHeight: 1.18,
                marginBottom: 20,
                marginTop: 0,
              }}
            >
              Show up in the relationship with her the way you always wanted to.
            </h1>
            <p
              style={{
                fontFamily: SANS,
                fontSize: 15,
                lineHeight: 1.7,
                marginBottom: 32,
                marginTop: 0,
              }}
            >
              <span style={{ color: C.gray3 }}>
                Most relationship friction isn't about love. It's about timing.
              </span>
              <br />
              <span style={{ color: C.off }}>Get your daily edge with Attuned.</span>
            </p>
            <button style={heroCta} onClick={goStart}>
              Get Started for Free →
            </button>
            <div style={{ fontFamily: SANS, fontSize: 11, color: C.gray4 }}>
              Every prompt has a free option · No credit card required
            </div>
          </div>

          <div
            style={{
              borderLeft: "1px solid rgba(201,168,76,0.22)",
              paddingLeft: 44,
            }}
          >
            <p
              style={{
                fontFamily: SERIF,
                fontSize: 24,
                fontStyle: "italic",
                color: C.gold2,
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              "Become the partner you want to be. Build the relationship you deserve."
            </p>
            <div
              style={{
                width: 48,
                height: 2,
                background: C.gold,
                marginTop: 26,
              }}
            />
          </div>
        </div>

        {/* Scroll hint */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 24,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span
            style={{
              fontFamily: MONO,
              fontSize: 10,
              color: C.gray4,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
            }}
          >
            scroll
          </span>
          <div
            style={{
              width: 1,
              height: 36,
              background: "linear-gradient(to bottom, #C9A84C, transparent)",
            }}
          />
        </div>
      </section>

      <div style={divider} />

      {/* Quotes */}
      <section style={{ padding: "56px 28px" }}>
        <div style={sectionLabel}>Built by Men, For Men, For Real-Life Relationships</div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 16,
          }}
        >
          {quotes.map((q, i) => (
            <div
              key={i}
              style={{
                background: C.navy2,
                border: q.accent
                  ? `1px solid ${C.gold}`
                  : "1px solid rgba(201,168,76,0.2)",
                borderTop: q.accent
                  ? `3px solid ${C.gold}`
                  : "3px solid rgba(201,168,76,0.15)",
                borderRadius: 4,
                padding: "22px 20px 18px",
              }}
            >
              <p
                style={{
                  fontFamily: SERIF,
                  fontSize: 13.5,
                  fontStyle: "italic",
                  color: q.accent ? C.off : C.gray3,
                  lineHeight: 1.7,
                  marginBottom: 14,
                  marginTop: 0,
                }}
              >
                "{q.text}"
              </p>
              <div
                style={{
                  fontFamily: MONO,
                  fontSize: 10,
                  color: C.gray4,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                }}
              >
                — {q.attr}
              </div>
            </div>
          ))}
        </div>
      </section>

      <div style={divider} />

      {/* Steps */}
      <section id="how" style={{ padding: "56px 28px 100px" }}>
        <div style={sectionLabel}>Get Started for Free — Just 3 Steps</div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 16,
            marginBottom: 48,
          }}
        >
          {steps.map((s, i) => {
            const Icon = s.Icon;
            return (
              <div
                key={i}
                style={{
                  background: C.navy2,
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderTop: `3px solid ${s.color}`,
                  borderRadius: 4,
                  padding: "26px 22px 22px",
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = C.navy3)}
                onMouseLeave={(e) => (e.currentTarget.style.background = C.navy2)}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 18,
                  }}
                >
                  <div
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: "50%",
                      background: s.color,
                      color: C.white,
                      fontFamily: SERIF,
                      fontWeight: 700,
                      fontSize: 13,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {s.num}
                  </div>
                  <Icon size={22} color={s.color} style={{ opacity: 0.7 }} />
                </div>
                <h3
                  style={{
                    fontFamily: SERIF,
                    fontSize: 18,
                    fontWeight: 700,
                    color: C.white,
                    margin: "0 0 10px 0",
                  }}
                >
                  {s.title}
                </h3>
                <p
                  style={{
                    fontFamily: SANS,
                    fontSize: 13.5,
                    color: C.gray3,
                    lineHeight: 1.6,
                    margin: "0 0 16px 0",
                  }}
                >
                  {s.body}
                </p>
                <div
                  style={{
                    height: 1,
                    background: "rgba(255,255,255,0.07)",
                    marginBottom: 14,
                  }}
                />
                <div
                  style={{
                    fontFamily: MONO,
                    fontSize: 10,
                    fontWeight: 700,
                    color: s.color,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    marginBottom: 8,
                  }}
                >
                  {s.detailLabel}
                </div>
                <div
                  style={{
                    fontFamily: SANS,
                    fontSize: 12.5,
                    fontStyle: "italic",
                    color: C.off,
                    lineHeight: 1.55,
                  }}
                >
                  {s.detail}
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ textAlign: "center" }}>
          <button style={finalCta} onClick={goStart}>
            Get Started for Free →
          </button>
          <div
            style={{
              fontFamily: SANS,
              fontSize: 11,
              color: C.gray4,
              marginTop: 14,
            }}
          >
            Every prompt has a free option · No credit card required · Takes 3 minutes to set up
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          borderTop: "1px solid rgba(201,168,76,0.15)",
          background: C.navy2,
          padding: "18px 28px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 16,
        }}
      >
        <span
          style={{
            fontFamily: MONO,
            fontSize: 11,
            fontWeight: 700,
            color: C.gold,
            letterSpacing: "0.2em",
          }}
        >
          ATTUNED
        </span>
        <span style={{ fontFamily: SANS, fontSize: 11, color: C.gray4, textAlign: "center" }}>
          attuned.in · Built by men, for men, for real-life relationships
        </span>
        <span style={{ fontFamily: SANS, fontSize: 11, color: C.gray4 }}>© 2026</span>
      </footer>
    </div>
  );
}
