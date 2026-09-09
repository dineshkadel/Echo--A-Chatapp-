import { AlertCircle, CheckCircle2, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatusBannerProps {
  type: "error" | "success" | "info";
  message: string | null;
  className?: string;
}


export function StatusBanner({ type, message, className }: StatusBannerProps) {
  if (!message) return null;

  const styles = {
    error: {
      wrapper: "border-red-400/20 bg-red-400/10 text-red-200",
      Icon: AlertCircle,
    },
    success: {
      wrapper: "border-emerald-400/20 bg-emerald-400/10 text-emerald-200",
      Icon: CheckCircle2,
    },
    info: {
      wrapper: "border-blue-400/20 bg-blue-400/10 text-blue-200",
      Icon: Info,
    },
  };

  const { wrapper, Icon } = styles[type];

  return (
    <div
      className={cn(
        "mb-5 flex items-start gap-3 rounded-xl border px-4 py-3 text-sm",
        wrapper,
        className
      )}
    >
      <Icon className="mt-0.5 size-4 shrink-0" />
      <span>{message}</span>
    </div>
  );
}

// Backward-compat alias — matches the old AuthStatus API
export function AuthStatus({
  type,
  message,
}: {
  type: "error" | "success";
  message: string | null;
}) {
  return <StatusBanner type={type} message={message} />;
}
