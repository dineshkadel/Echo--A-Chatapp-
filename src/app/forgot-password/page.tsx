"use client";

import { useState } from "react";
import Link from "next/link";
import { AuthShell } from "@/src/components/auth/auth-shell";
import { AuthStatus } from "@/src/components/auth/auth-status";
import { RequestResetForm } from "@/src/components/auth/request-reset-form";
import { CompleteResetForm } from "@/src/components/auth/complete-reset-form";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [expiresAt, setExpiresAt] = useState(0);
  const [reset, setReset] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  return (
    <AuthShell
      title={reset ? "Create a new password" : "Forgot your password?"}
      description={reset ? "Enter the code from your email and choose a stronger password for your Echo account." : "No stress. We will send a short-lived reset code to your email address."}
      footer={<>{reset ? "Remembered it? " : "Back to your account? "}<Link href="/login" className="font-semibold text-cyan-300 hover:text-cyan-200">Sign in</Link></>}
    >
      <AuthStatus type="success" message={success} />
      {!reset ? (
        <RequestResetForm onSent={(nextEmail, nextExpiresAt) => { setEmail(nextEmail); setExpiresAt(nextExpiresAt); setSuccess("Check your inbox for a 6-digit reset code."); setReset(true); }} />
      ) : (
        <CompleteResetForm email={email} expiresAt={expiresAt} onBack={() => { setReset(false); setSuccess(null); }} onReset={() => { setReset(false); setSuccess("Your password has been reset. You can sign in with the new password now."); }} />
      )}
    </AuthShell>
  );
}