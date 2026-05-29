import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { LandingPage } from "@/components/LandingPage";

export const Route = createFileRoute("/welcome")({
  head: () => ({
    meta: [{ title: "Attuned — Show up for her, every day" }],
  }),
  component: WelcomeRoute,
});

function WelcomeRoute() {
  const navigate = useNavigate();
  return <LandingPage onStart={() => navigate({ to: "/onboarding" })} />;
}
