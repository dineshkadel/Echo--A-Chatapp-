import { AlertCircle, CheckCircle2 } from "lucide-react";

export function AuthStatus({ type, message }: { type: "error" | "success"; message: string | null }) {
  if (!message) return null;
  const isError = type === "error";
  return (
    <div className={`mb-5 flex items-start gap-3 rounded-xl border px-4 py-3 text-sm ${isError ? "border-red-400/20 bg-red-400/10 text-red-200" : "border-emerald-400/20 bg-emerald-400/10 text-emerald-200"}`}>
      {isError ? <AlertCircle className="mt-0.5 size-4 shrink-0" /> : <CheckCircle2 className="mt-0.5 size-4 shrink-0" />}
      <span>{message}</span>
    </div>
  );
}