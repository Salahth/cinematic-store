"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { products as defaultProducts, Product } from "@/data/products";
import { ProductScene } from "./ProductScene";
import { Header } from "./Header";
import { ProductIndicator } from "./ProductIndicator";

type Props = {
  products?: Product[];
};

export function ScrollShowcase({ products = defaultProducts }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const isAnimatingRef = useRef(false);
  const animTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const activeTheme = products[activeIndex].theme;

  /* ---------- Navigation ---------- */
  const goTo = (i: number, dir?: 1 | -1) => {
    if (i < 0 || i >= products.length) return;
    if (i === activeIndex) return;
    if (isAnimatingRef.current) return;

    const newDirection = dir ?? (i > activeIndex ? 1 : -1);
    setDirection(newDirection);
    isAnimatingRef.current = true;
    setActiveIndex(i);

    if (animTimeoutRef.current) clearTimeout(animTimeoutRef.current);
    animTimeoutRef.current = setTimeout(() => {
      isAnimatingRef.current = false;
    }, 700);
  };

  const next = () => goTo(activeIndex + 1, 1);
  const prev = () => goTo(activeIndex - 1, -1);

  /* ---------- Wheel / Trackpad ---------- */
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (isAnimatingRef.current) return;
      if (Math.abs(e.deltaY) < 20) return;

      // تنفيذ فوري بدون تأخير لتجنب تراكم الأحداث
      if (e.deltaY > 0) next();
      else prev();
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      el.removeEventListener("wheel", onWheel);
    };
  }, [activeIndex, products.length]);

  /* ---------- Touch ---------- */
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let touchStartY = 0;
    let touchStartTime = 0;

    const onTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
      touchStartTime = Date.now();
    };

    const onTouchEnd = (e: TouchEvent) => {
      const touchEndY = e.changedTouches[0].clientY;
      const diff = touchStartY - touchEndY;
      const duration = Date.now() - touchStartTime;
      const velocity = Math.abs(diff) / duration;

      if (Math.abs(diff) > 50 || velocity > 0.5) {
        if (diff > 0) next();
        else prev();
      }
    };

    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchend", onTouchEnd);
    };
  }, [activeIndex, products.length]);

  /* ---------- Keyboard ---------- */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "PageDown" || e.key === " ") {
        e.preventDefault();
        next();
      }
      if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        prev();
      }
      if (e.key === "Home") goTo(0, -1);
      if (e.key === "End") goTo(products.length - 1, 1);
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeIndex, products.length]);

  /* ---------- Prevent page scroll ---------- */
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
      if (animTimeoutRef.current) clearTimeout(animTimeoutRef.current);
    };
  }, []);

  /* ---------- Product slide (Reels-style snap) ---------- */
  const productVariants = {
    enter: (dir: number) => ({
      y: dir > 0 ? "100%" : "-100%",
      opacity: 0,
      scale: 0.92,
    }),
    center: {
      y: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (dir: number) => ({
      y: dir > 0 ? "-60%" : "60%",
      opacity: 0,
      scale: 0.86,
    }),
  };

  return (
    <>
      <Header
        theme={activeTheme}
        activeIndex={activeIndex}
        total={products.length}
      />

      {/* Fixed full-screen viewport */}
      <div
        ref={containerRef}
        className="fixed inset-0 overflow-hidden select-none"
        style={{ touchAction: "none" }}
      >
        {/* ============================================
            LAYERED BACKGROUNDS — smooth cross-fade between products
           ============================================ */}
        <div className="absolute inset-0 -z-10">
          {products.map((p, i) => {
            const isActive = i === activeIndex;
            const fadeDuration = 0.9;

            return (
              <motion.div
                key={`bg-${p.id}`}
                initial={false}
                animate={{
                  opacity: isActive ? 1 : 0,
                }}
                transition={{
                  duration: fadeDuration,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="absolute inset-0 will-change-opacity"
                style={{
                  background: `radial-gradient(120% 100% at 65% 40%, ${p.palette.to} 0%, ${p.palette.via} 45%, ${p.palette.from} 100%)`,
                }}
              />
            );
          })}

          {/* Ambient glow layer */}
          {products.map((p, i) => {
            const isActive = i === activeIndex;
            return (
              <motion.div
                key={`glow-${p.id}`}
                initial={false}
                animate={{
                  opacity: isActive ? 1 : 0,
                }}
                transition={{
                  duration: 1.1,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="absolute inset-0 pointer-events-none will-change-opacity"
                style={{
                  background: `radial-gradient(80% 60% at 65% 45%, ${p.palette.glow} 0%, transparent 70%)`,
                }}
              />
            );
          })}

          {/* Permanent vignette */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(120% 90% at 50% 50%, transparent 55%, rgba(0,0,0,0.55) 100%)",
              opacity: activeTheme === "dark" ? 0.9 : 0.35,
              transition: "opacity 0.7s ease",
            }}
          />
        </div>

        {/* ============================================
            PRODUCT CONTENT — Reels-style snap
           ============================================ */}
        <AnimatePresence mode="popLayout" custom={direction}>
          <motion.div
            key={products[activeIndex].id}
            custom={direction}
            variants={productVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              y: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
              opacity: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
              scale: { duration: 1, ease: [0.16, 1, 0.3, 1] },
            }}
            className="absolute inset-0 will-change-transform"
          >
            <ProductScene
              product={products[activeIndex]}
              index={activeIndex}
              isActive={true}
            />
          </motion.div>
        </AnimatePresence>

        {/* Right-side indicator */}
        <div className="absolute right-6 md:right-10 top-1/2 -translate-y-1/2 z-30">
          <ProductIndicator
            total={products.length}
            active={activeIndex}
            theme={activeTheme}
            names={products.map((p) => p.name)}
            onSelect={goTo}
          />
        </div>

        {/* Up/Down arrows (desktop) */}
        <div className="hidden md:flex flex-col gap-2 absolute bottom-8 left-1/2 -translate-x-1/2 z-30">
          <button
            onClick={prev}
            disabled={activeIndex === 0}
            className="w-10 h-10 rounded-full border border-white/20 backdrop-blur-md grid place-items-center text-white hover:bg-white/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Précédent"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="m6 15 6-6 6 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            onClick={next}
            disabled={activeIndex === products.length - 1}
            className="w-10 h-10 rounded-full border border-white/20 backdrop-blur-md grid place-items-center text-white hover:bg-white/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Suivant"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="m6 9 6 6 6-6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {/* Progress counter */}
        <div className="absolute bottom-8 right-6 md:right-10 z-30 text-white/60 text-xs tabular-nums tracking-widest">
          {String(activeIndex + 1).padStart(2, "0")} /{" "}
          {String(products.length).padStart(2, "0")}
        </div>
      </div>

      <div style={{ height: "100vh" }} />
    </>
  );
}
