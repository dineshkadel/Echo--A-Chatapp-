import React from "react";
import { cn } from "@/lib/utils";

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  id: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

export function ToggleSwitch({
  checked,
  onChange,
  id,
  label,
  description,
  icon,
  disabled,
  className,
}: ToggleSwitchProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between p-4 bg-slate-900/80 border border-slate-800 rounded-2xl",
        className
      )}
    >
      <div className="flex items-center gap-3.5">
        {icon && (
          <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-300">
            {icon}
          </div>
        )}
        <div>
          <h4 className="text-xs font-bold text-slate-200">{label}</h4>
          {description && (
            <p className="text-[11px] text-slate-400">{description}</p>
          )}
        </div>
      </div>

      <label className="relative inline-flex items-center cursor-pointer">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only peer"
        />
        <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600" />
      </label>
    </div>
  );
}
