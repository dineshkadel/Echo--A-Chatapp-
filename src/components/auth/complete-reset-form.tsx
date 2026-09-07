"use client";

import { FormEvent, useState } from "react";
import { ArrowLeft, Check, KeyRound, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthStatus } from "@/src/components/auth/auth-status";
import { OtpCountdown } from "@/src/components/auth/otp-countdown";

export function CompleteResetForm({ email, expiresAt, onBack, onReset }: { email: string; expiresAt: number; onBack: () => void; onReset: () => void }) {
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword, confirmPassword }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(typeof data.error === "string" ? data.error : Object.values(data.error ?? {}).flat().join(" ") || "Check your details and try again.");
        return;
      }
      onReset();
    } catch {
      setError("We could not reset your password. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <AuthStatus type="error" message={error} />
      <div className="flex items-center justify-between rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-3">
        <div className="flex items-center gap-3"><KeyRound className="size-4 text-cyan-300" /><span className="max-w-[190px] truncate text-sm text-slate-200">{email}</span></div>
        <OtpCountdown expiresAt={expiresAt} />
      </div>
      <label className="block space-y-2 text-sm font-medium text-slate-200">6-digit code<Input required inputMode="numeric" maxLength={6} value={otp} onChange={(event) => setOtp(event.target.value.replace(/\D/g, ""))} placeholder="123456" className="h-12 border-white/10 bg-white/5 text-center font-mono text-xl tracking-[0.5em] text-white" /></label>
      <label className="block space-y-2 text-sm font-medium text-slate-200">New password<Input required type="password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} placeholder="At least 8 characters" className="h-11 border-white/10 bg-white/5 text-white placeholder:text-slate-500" /></label>
      <label className="block space-y-2 text-sm font-medium text-slate-200">Confirm password<Input required type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} placeholder="Repeat your password" className="h-11 border-white/10 bg-white/5 text-white placeholder:text-slate-500" /></label>
      <Button type="submit" disabled={loading} className="h-11 w-full bg-cyan-400 text-slate-950 hover:bg-cyan-300">{loading ? <Loader2 className="animate-spin" /> : <Check />}{loading ? "Updating password..." : "Reset password"}</Button>
      <div className="flex items-center justify-between pt-2 text-xs">
        <button type="button" onClick={onBack} className="flex items-center gap-1 text-slate-400 hover:text-white"><ArrowLeft className="size-3" /> Use another email</button>
        <button type="button" onClick={onBack} className="flex items-center gap-1 text-cyan-300 hover:text-cyan-200"><RefreshCw className="size-3" /> Request new code</button>
      </div>
    </form>
  );
}