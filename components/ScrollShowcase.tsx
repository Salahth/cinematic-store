"use client";
import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  MotionValue,
  useMotionValueEvent,
} from "framer-motion";
import { products as defaultProducts, Product } from "@/data/products";
import { ProductScene } from "./ProductScene";
import { Header } from "./Header";
import { ProductIndicator } from "./ProductIndicator";

type Props = {
  products?: Product[];
};

export function ScrollShowcase({ products = defaultProducts }: Props) {
  (globalThis as any).__PRODUCTS_LEN__ = products.length;

  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeTheme = products[activeIndex].theme;

  // Each product = 1 unit of scroll, with extra virtual length for smooth enters.
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Global progress mapped 0..products.length
  const globalProgress = useTransform(
    scrollYProgress,
    [0, 1],
    [0, products.length]
  );

  useMotionValueEvent(globalProgress, "change", (v) => {
    const idx = Math.min(products.length - 1, Math.max(0, Math.round(v - 0.0001)));
    // Determine active by nearest center: each product's "center" is at its index.
    const next = Math.min(
      products.length - 1,
      Math.max(0, Math.floor(v + 0.5))
    );
    if (next !== activeIndex) setActiveIndex(next);
  });

  const scrollToIndex = (i: number) => {
    const el = containerRef.current;
    if (!el) return;
    const total = el.offsetHeight - window.innerHeight;
    const target = (i / products.length) * total + el.offsetTop;
    window.scrollTo({ top: target, behavior: "smooth" });
  };

  // Background morph across whole page — layered gradients cross-fading.
  const bgColors = products.map((p) => p.palette.from);
  const bgStops = products.map((_, i) => i / Math.max(1, products.length - 1));

  return (
    <>
      <Header
        theme={activeTheme}
        activeIndex={activeIndex}
        total={products.length}
      />

      <div
        ref={containerRef}
        className="relative"
        style={{
          height: `${products.length * 100}vh`,
          scrollSnapType: "y mandatory",
        }}
      >
        {/* Sticky viewport that holds everything */}
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          {/* Base animated background (morphing) */}
          <MorphingBackground products={products} progress={globalProgress} />

          {/* Product scenes stacked; only their opacity/transform controlled */}
          <div className="absolute inset-0">
            {products.map((p, i) => (
              <div
                key={p.id}
                className="absolute inset-0"
                style={{ scrollSnapAlign: "start" }}
              >
                <ProductScene
                  product={p}
                  index={i}
                  globalProgress={globalProgress}
                  isActive={i === activeIndex}
                />
              </div>
            ))}
          </div>

          {/* Right-side product indicator */}
          <div className="pointer-events-none absolute right-6 md:right-10 top-1/2 -translate-y-1/2 z-30">
            <div className="pointer-events-auto">
              <ProductIndicator
                total={products.length}
                active={activeIndex}
                theme={activeTheme}
                names={products.map((p) => p.name)}
                onSelect={scrollToIndex}
              />
            </div>
          </div>

          {/* Bottom subtle hint on first load */}
          {activeIndex === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4, duration: 1 }}
              className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2 text-white/60"
            >
              <span className="text-[10px] uppercase tracking-[0.3em]">
                Scroll
              </span>
              <motion.span
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                className="w-px h-6 bg-white/50"
              />
            </motion.div>
          )}
        </div>

        {/* Scroll anchors to force snapping per product */}
        {products.map((_, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              top: `${i * 100}vh`,
              height: "100vh",
              width: "100%",
              scrollSnapAlign: "start",
              pointerEvents: "none",
            }}
          />
        ))}
      </div>
    </>
  );
}

/**
 * A layered background that cross-fades between product palettes
 * as the global progress moves from one product to the next.
 */
function MorphingBackground({
  products,
  progress,
}: {
  products: Product[];
  progress: MotionValue<number>;
}) {
  return (
    <div className="absolute inset-0 -z-30 bg-black">
      {products.map((p, i) => (
        <Layer key={p.id} product={p} index={i} progress={progress} />
      ))}
    </div>
  );
}

function Layer({
  product,
  index,
  progress,
}: {
  product: Product;
  index: number;
  progress: MotionValue<number>;
}) {
  // Layer i is fully visible at progress = i+1 (its center), fades in from i and out to i+2.
  const start = index; // visible window start (progress units)
  const end = index + 2;
  const opacity = useTransform(progress, [start, index + 0.85, index + 1.15, end], [0, 0.9, 0.9, 0]);

  const gradient = `radial-gradient(120% 100% at 65% 40%, ${product.palette.to} 0%, ${product.palette.via} 45%, ${product.palette.from} 100%)`;

  return (
    <motion.div
      className="absolute inset-0"
      style={{ background: gradient, opacity }}
    />
  );
}