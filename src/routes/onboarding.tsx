import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Onboarding } from "@/components/Onboarding";
import { getProfile, useClientReady } from "@/lib/storage";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Get Started — Knightley" },
      { name: "description", content: "Set up your Knightley profile in 3 minutes." },
    ],
  }),
  component: OnboardingRoute,
});

function OnboardingRoute() {
  const ready = useClientReady();
  const navigate = useNavigate();
  if (!ready) return <div className="min-h-dvh bg-background" />;
  const profile = getProfile();
  return (
    <Onboarding
      initialProfile={profile ?? undefined}
      onDone={() => navigate({ to: "/" })}
    />
  );
}
