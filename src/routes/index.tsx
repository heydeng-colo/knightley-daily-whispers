import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { BottomNav, type Tab } from "@/components/BottomNav";
import { HomeScreen } from "@/components/HomeScreen";
import { CalendarScreen } from "@/components/CalendarScreen";
import { ProfileScreen } from "@/components/ProfileScreen";
import { HelpScreen } from "@/components/HelpScreen";
import { Onboarding } from "@/components/Onboarding";
import { LandingPage } from "@/components/LandingPage";
import {
  getProfile,
  getLogs,
  setProfile as saveProfile,
  useClientReady,
  useStorageVersion,
} from "@/lib/storage";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Attuned — Show up for her, every day" },
      { name: "description", content: "One daily prompt, timed to her cycle. Built by men, for men, for real-life relationships." },
    ],
  }),
  component: Index,
});

function Index() {
  const ready = useClientReady();
  const v = useStorageVersion();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("home");
  const [reviewIntake, setReviewIntake] = useState(false);

  if (!ready) {
    return <div className="min-h-dvh bg-background" />;
  }

  const profile = getProfile();
  const logs = getLogs();

  if (!profile) {
    return <LandingPage onStart={() => navigate({ to: "/onboarding" })} />;
  }

  if (reviewIntake) {
    return <Onboarding initialProfile={profile} onDone={() => setReviewIntake(false)} />;
  }

  void v;

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <div className="mx-auto max-w-md px-5 pt-4 pb-28">
        {tab === "home" && <HomeScreen profile={profile} setProfile={saveProfile} logs={logs} />}
        {tab === "calendar" && <CalendarScreen profile={profile} logs={logs} />}
        {tab === "profile" && <ProfileScreen profile={profile} setProfile={saveProfile} onReviewIntake={() => setReviewIntake(true)} />}
        {tab === "help" && <HelpScreen />}
      </div>
      <BottomNav tab={tab} onChange={setTab} />
    </div>
  );
}
