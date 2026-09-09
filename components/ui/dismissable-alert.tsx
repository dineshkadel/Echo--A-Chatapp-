import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

interface DismissableAlertProps {
  type: "success" | "error";
  message: string | null;
  onDismiss: () => void;
  className?: string;
}

/**
 * A dismissable alert banner for success/error feedback.
 * Generalizes the ActionAlert from admin/ and the inline alert pattern
 * in settings/security/page.tsx into one reusable component.
 */
export function DismissableAlert({
  type,
  message,
  onDismiss,
  className,
}: DismissableAlertProps) {
  if (!message) return null;

  return (
    <Alert
      className={cn(
        "rounded-xl flex items-center justify-between",
        type === "success"
          ? "bg-emerald-950/60 border-emerald-800 text-emerald-200"
          : "bg-red-950/60 border-red-800 text-red-200",
        className
      )}
    >
      <AlertDescription className="text-sm text-inherit">{message}</AlertDescription>
      <button
        onClick={onDismiss}
        className="text-xs opacity-70 hover:opacity-100 font-bold ml-4 shrink-0"
        aria-label="Dismiss message"
        type="button"
      >
        ✕
      </button>
    </Alert>
  );
}
