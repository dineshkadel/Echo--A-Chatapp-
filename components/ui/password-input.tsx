import React from "react";
import { cn } from "@/lib/utils";

interface PasswordInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}


export function PasswordInput({ className, ...props }: PasswordInputProps) {
  return (
    <input
      type="password"
      className={cn(
        "w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl",
        "text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all",
        className
      )}
      {...props}
    />
  );
}
