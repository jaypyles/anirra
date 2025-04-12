import React from "react";
import { useSession } from "next-auth/react";
import LandingPage from "@/components/pages/landing-page";
import { LoggedInUser } from "@/components/pages/logged-in-user";

export default function Home() {
  const { data: session } = useSession();

  if (!session) {
    return <LandingPage />;
  }

  return <LoggedInUser />;
}
