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

  const activeTheme = products[activeIndex].theme;

  /* ---------- Navigation ---------- */
  const goTo = (i: number) => {
    if (i < 0 || i >= products.length) return;
    if (i === activeIndex) return;
    if (isAnimatingRef.current) return;

    setDirection(i > activeIndex ? 1 : -1);
    isAnimatingRef.current = true;
    setActiveIndex(i);

    setTimeout(() => {
      isAnimatingRef.current = false;
    }, 650);
  };

  const next = () => goTo(activeIndex + 1);
  const prev = () => goTo(activeIndex - 1);

  /* ---------- Wheel / Trackpad ---------- */
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let wheelTimeout: NodeJS.Timeout;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();

      // Throttle: ignore rapid wheel events during animation
      if (isAnimatingRef.current) return;

      // Ignore small movements (trackpad noise)
      if (Math.abs(e.deltaY) < 20) return;

      clearTimeout(wheelTimeout);
      wheelTimeout = setTimeout(() => {
        if (e.deltaY > 0) next();
        else prev();
      }, 10);
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      el.removeEventListener("wheel", onWheel);
      clearTimeout(wheelTimeout);
    };
  }, [activeIndex, products.length]);

  /* ---------- Touch (mobile swipe) ---------- */
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

      // Swipe threshold: 50px OR fast flick (velocity > 0.5)
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
      if (e.key === "Home") goTo(0);
      if (e.key === "End") goTo(products.length - 1);
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeIndex, products.length]);

  /* ---------- Prevent page scroll ---------- */
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  /* ---------- Transition variants (Reels-style) ---------- */
  const variants = {
    enter: (dir: number) => ({
      y: dir > 0 ? "100%" : "-100%",
      opacity: 0,
      scale: 0.9,
    }),
    center: {
      y: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (dir: number) => ({
      y: dir > 0 ? "-50%" : "50%",
      opacity: 0,
      scale: 0.85,
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
        {/* Animated background (changes with each product) */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`bg-${activeIndex}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 -z-10"
            style={{
              background: `radial-gradient(120% 100% at 65% 40%, ${products[activeIndex].palette.to} 0%, ${products[activeIndex].palette.via} 45%, ${products[activeIndex].palette.from} 100%)`,
            }}
          />
        </AnimatePresence>

        {/* Product scenes with AnimatePresence */}
        <AnimatePresence mode="popLayout" custom={direction}>
          <motion.div
            key={products[activeIndex].id}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              y: { type: "spring", stiffness: 300, damping: 32 },
              opacity: { duration: 0.35 },
              scale: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
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

        {/* Right-side product indicator */}
        <div className="absolute right-6 md:right-10 top-1/2 -translate-y-1/2 z-30">
          <ProductIndicator
            total={products.length}
            active={activeIndex}
            theme={activeTheme}
            names={products.map((p) => p.name)}
            onSelect={goTo}
          />
        </div>

        {/* Up/Down arrow buttons (desktop) */}
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

        {/* Progress counter (bottom) */}
        <div className="absolute bottom-8 right-6 md:right-10 z-30 text-white/60 text-xs tabular-nums tracking-widest">
          {String(activeIndex + 1).padStart(2, "0")} /{" "}
          {String(products.length).padStart(2, "0")}
        </div>
      </div>

      {/* Bottom spacer so footer can be reached */}
      <div style={{ height: "100vh" }} />
    </>
  );
}
