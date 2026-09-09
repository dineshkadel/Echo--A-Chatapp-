import React from "react";
import { cn } from "@/lib/utils";

interface FormLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode;
  className?: string;
}


export function FormLabel({ children, className, ...props }: FormLabelProps) {
  return (
    <label
      className={cn(
        "block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5",
        className
      )}
      {...props}
    >
      {children}
    </label>
  );
}
