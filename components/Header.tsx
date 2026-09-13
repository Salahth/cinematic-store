"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useCart } from "@/store/cart";
import { cn } from "@/lib/utils";

type Props = {
  theme: "dark" | "light";
  activeIndex: number;
  total: number;
};

const NAV = ["Accueil", "Boutique", "À propos", "Contact"];

export function Header({ theme, activeIndex, total }: Props) {
  const { items, open, lastAdded } = useCart();
  const count = items.reduce((s, i) => s + i.quantity, 0);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isDark = theme === "dark";
  const text = isDark ? "text-white" : "text-neutral-900";
  const subtle = isDark ? "text-white/60" : "text-neutral-900/60";
  const border = isDark ? "border-white/10" : "border-black/10";
  const hoverBg = isDark ? "hover:bg-white/10" : "hover:bg-black/5";

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-colors duration-500",
        text
      )}
    >
      <div
        className={cn(
          "mx-auto max-w-[1400px] px-5 md:px-10 h-16 md:h-20 flex items-center justify-between transition-all duration-500",
          scrolled && "backdrop-blur-xl"
        )}
        style={{
          backgroundColor: scrolled
            ? isDark
              ? "rgba(0,0,0,0.28)"
              : "rgba(255,255,255,0.35)"
            : "transparent",
        }}
      >
        {/* Logo */}
        <a href="#" className="flex items-center gap-2 group">
          <span
            className={cn(
              "w-2.5 h-2.5 rounded-full transition-colors duration-500"
            )}
            style={{
              background: isDark ? "#fff" : "#111",
              boxShadow: isDark
                ? "0 0 20px rgba(255,255,255,0.5)"
                : "0 0 20px rgba(0,0,0,0.2)",
            }}
          />
          <span className="font-display font-semibold tracking-tight text-[15px] md:text-base">
            AURA<span className={subtle}>.studio</span>
          </span>
        </a>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV.map((label) => (
            <a
              key={label}
              href="#"
              className={cn(
                "relative text-sm tracking-wide transition-opacity hover:opacity-100 opacity-80 group"
              )}
            >
              {label}
              <span
                className={cn(
                  "absolute -bottom-1 left-0 h-px w-0 transition-all duration-300 group-hover:w-full",
                  isDark ? "bg-white" : "bg-neutral-900"
                )}
              />
            </a>
          ))}
        </nav>

        {/* Right */}
        <div className="flex items-center gap-1.5">
          <button
            aria-label="Search"
            className={cn(
              "w-10 h-10 rounded-full grid place-items-center transition-colors",
              hoverBg
            )}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.7" />
              <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
            </svg>
          </button>

          <button
            aria-label="Cart"
            onClick={open}
            className={cn(
              "relative w-10 h-10 rounded-full grid place-items-center transition-colors",
              hoverBg
            )}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
              <path
                d="M6 7h12l-1 12H7L6 7Z"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinejoin="round"
              />
              <path
                d="M9 7a3 3 0 0 1 6 0"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
              />
            </svg>
            {count > 0 && (
              <motion.span
                key={count}
                initial={{ scale: 0.4, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 22 }}
                className={cn(
                  "absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] rounded-full text-[10px] font-semibold grid place-items-center px-1",
                  isDark ? "bg-white text-black" : "bg-black text-white"
                )}
              >
                {count}
              </motion.span>
            )}
            {lastAdded && (
              <motion.span
                initial={{ scale: 1, opacity: 0.6 }}
                animate={{ scale: 1.8, opacity: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className={cn(
                  "absolute inset-0 rounded-full border",
                  isDark ? "border-white" : "border-black"
                )}
              />
            )}
          </button>

          {/* Progress dots — mobile only */}
          <div className="md:hidden ml-1 flex items-center gap-1">
            {Array.from({ length: total }).map((_, i) => (
              <span
                key={i}
                className={cn(
                  "h-1 rounded-full transition-all duration-500",
                  i === activeIndex ? "w-4" : "w-1",
                  isDark ? "bg-white" : "bg-neutral-900"
                )}
                style={{ opacity: i === activeIndex ? 1 : 0.35 }}
              />
            ))}
          </div>
        </div>
      </div>
      <div
        className={cn(
          "h-px transition-opacity duration-500 mx-5 md:mx-10",
          scrolled ? "opacity-100" : "opacity-0",
          isDark ? "bg-white/10" : "bg-black/10"
        )}
      />
    </motion.header>
  );
}