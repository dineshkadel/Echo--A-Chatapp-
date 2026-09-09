"use client";

import { FullScreenLoader } from "@/src/modules/shared/full-screen-loader";
import { SiteHeader } from "@/src/modules/index/site-header";
import { HeroSection } from "@/src/modules/index/hero";
import { SiteFooter } from "@/src/modules/index/site-footer";
import { useAuthRedirect } from "@/src/hooks/use-auth-redirect";

export default function Home() {
  const { status } = useAuthRedirect();

  if (status === "loading") {
    return <FullScreenLoader message="Checking session..." accentClassName="text-blue-500" />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <SiteHeader />
      <HeroSection />
      <SiteFooter />
    </div>
  );
}