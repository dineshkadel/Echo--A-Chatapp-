"use client";

import { useEffect, useState } from "react";

export function OtpCountdown({ expiresAt }: { expiresAt: number }) {
  const [remaining, setRemaining] = useState(() => Math.max(0, expiresAt - Date.now()));

  useEffect(() => {
    const timer = window.setInterval(() => setRemaining(Math.max(0, expiresAt - Date.now())), 1000);
    return () => window.clearInterval(timer);
  }, [expiresAt]);

  const totalSeconds = Math.ceil(remaining / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return (
    <p className={`text-xs ${totalSeconds > 0 ? "text-cyan-200" : "text-amber-300"}`}>
      {totalSeconds > 0 ? `Code expires in ${minutes}:${seconds.toString().padStart(2, "0")}` : "This code has expired. Request a new one."}
    </p>
  );
}