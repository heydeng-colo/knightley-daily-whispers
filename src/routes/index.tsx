import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Onboarding } from "@/components/Onboarding";
import { BottomNav, type Tab } from "@/components/BottomNav";
import { HomeScreen } from "@/components/HomeScreen";
import { CalendarScreen } from "@/components/CalendarScreen";
import { ProfileScreen } from "@/components/ProfileScreen";
import { HelpScreen } from "@/components/HelpScreen";
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
      { title: "Attuned — Daily relationship guidance" },
      { name: "description", content: "A calm, daily prompt to help you show up for her — attuned to her cycle." },
    ],
  }),
  component: Index,
});

function Index() {
  const ready = useClientReady();
  const v = useStorageVersion();
  const [tab, setTab] = useState<Tab>("home");

  if (!ready) {
    return <div className="min-h-dvh bg-background" />;
  }

  const profile = getProfile();
  const logs = getLogs();

  if (!profile) {
    return <Onboarding onDone={() => { /* triggers via storage event */ }} />;
  }

  // referenced to subscribe to storage updates
  void v;

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <div className="mx-auto max-w-md px-5 pt-4 pb-28">
        {tab === "home" && <HomeScreen profile={profile} setProfile={saveProfile} logs={logs} />}
        {tab === "calendar" && <CalendarScreen profile={profile} logs={logs} />}
        {tab === "profile" && <ProfileScreen profile={profile} setProfile={saveProfile} />}
        {tab === "help" && <HelpScreen />}
      </div>
      <BottomNav tab={tab} onChange={setTab} />
    </div>
  );
}
