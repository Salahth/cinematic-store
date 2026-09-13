"use client";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type Props = {
  total: number;
  active: number;
  theme: "dark" | "light";
  onSelect: (i: number) => void;
  names: string[];
};

export function ProductIndicator({ total, active, theme, onSelect, names }: Props) {
  const isDark = theme === "dark";
  return (
    <div className="hidden lg:flex flex-col gap-3 items-end select-none">
      {Array.from({ length: total }).map((_, i) => {
        const isActive = i === active;
        return (
          <button
            key={i}
            onClick={() => onSelect(i)}
            aria-label={`Aller au produit ${i + 1}`}
            className="group flex items-center gap-3"
          >
            <span
              className={cn(
                "text-[11px] tabular-nums tracking-widest transition-all duration-500",
                isActive ? "opacity-100" : "opacity-30 group-hover:opacity-70",
                isDark ? "text-white" : "text-neutral-900"
              )}
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="relative flex items-center">
              <motion.span
                animate={{
                  width: isActive ? 34 : 14,
                  opacity: isActive ? 1 : 0.35,
                }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className={cn(
                  "h-px block",
                  isDark ? "bg-white" : "bg-neutral-900"
                )}
              />
            </span>
          </button>
        );
      })}
      <div
        className={cn(
          "mt-4 max-w-[140px] text-right text-[10px] uppercase tracking-[0.2em] transition-opacity duration-500",
          isDark ? "text-white/50" : "text-neutral-900/50"
        )}
      >
        {names[active]}
      </div>
    </div>
  );
}