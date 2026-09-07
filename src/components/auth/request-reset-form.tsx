"use client";

import { FormEvent, useState } from "react";
import { ArrowRight, Loader2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthStatus } from "@/src/components/auth/auth-status";

export function RequestResetForm({ onSent }: { onSent: (email: string, expiresAt: number) => void }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(typeof data.error === "string" ? data.error : "Enter a valid email address.");
        return;
      }
      onSent(email.trim().toLowerCase(), Date.now() + 120_000);
    } catch {
      setError("We could not send a reset code. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <AuthStatus type="error" message={error} />
      <label className="block space-y-2 text-sm font-medium text-slate-200">
        Email address
        <div className="relative">
          <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
          <Input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" className="h-11 border-white/10 bg-white/5 pl-10 text-white placeholder:text-slate-500" />
        </div>
      </label>
      <Button type="submit" disabled={loading} className="h-11 w-full bg-cyan-400 text-slate-950 hover:bg-cyan-300">
        {loading ? <Loader2 className="animate-spin" /> : <ArrowRight />}
        {loading ? "Sending code..." : "Send reset code"}
      </Button>
    </form>
  );
}