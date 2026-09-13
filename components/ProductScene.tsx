"use client";
import { motion, useTransform, MotionValue } from "framer-motion";
import Image from "next/image";
import { Product } from "@/data/products";
import { formatDZD, cn } from "@/lib/utils";
import { useMemo, useState } from "react";
import { useCart } from "@/store/cart";

type Props = {
  product: Product;
  index: number;
  /** Global scroll progress across the whole showcase (0..total) */
  globalProgress: MotionValue<number>;
  isActive: boolean;
};

const SIZES_FALLBACK = ["39", "40", "41", "42", "43", "44"];

export function ProductScene({ product, index, globalProgress, isActive }: Props) {
  const add = useCart((s) => s.add);
  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    product.sizes?.[0]
  );
  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    product.colors?.[0]?.name
  );

  // Each scene is 1 unit wide on the global progress axis.
  // Scene N starts appearing at (N-1) and completes at N.
  const start = index - 1;
  const end = index;
  const total = productsLengthFromContext();

  // t: 0 → entering, 1 → exiting (only meaningful for scenes 1..N-1)
  const t = useTransform(globalProgress, [start, end], [0, 1]);
  // entrance offset: scene index 0 is always "on"
  const entrance = useTransform(
    globalProgress,
    index === 0 ? [0, 0.001] : [start, end],
    index === 0 ? [1, 1] : [0, 1]
  );

  // For non-first scenes: 0 → 1 across their own slide
  const localIn = entrance;
  // For non-last scenes: exiting factor as next one comes in
  const exitT =
    index === total - 1
      ? useTransform(globalProgress, [0, 1], [1, 1])
      : useTransform(globalProgress, [end, end + 1], [0, 1]);

  // Composed visibility 0..1
  const visibility = useTransform(
    [localIn, exitT],
    ([i, e]: number[]) => i * (1 - e)
  );

  // Product image transforms
  const imageX = useTransform(
    [localIn, exitT],
    ([i, e]: number[]) => {
      // entering from right, exiting to left
      return (1 - i) * 260 - e * 260;
    }
  );
  const imageScale = useTransform(
    [localIn, exitT],
    ([i, e]: number[]) => 0.82 + i * 0.18 - e * 0.14
  );
  const imageRotate = useTransform(
    [localIn, exitT],
    ([i, e]: number[]) => (1 - i) * 8 - e * 8
  );
  const imageOpacity = useTransform(
    [localIn, exitT],
    ([i, e]: number[]) => Math.min(i, 1 - e) * 0.95
  );
  const imageY = useTransform(
    [localIn, exitT],
    ([i, e]: number[]) => (1 - i) * 40 + e * 40
  );
  const imageBlur = useTransform(
    [localIn, exitT],
    ([i, e]: number[]) => (1 - i) * 8 + e * 8
  );
  const filter = useTransform(imageBlur, (b) => `blur(${b}px)`);

  // Text transforms (left side) — appears slightly after image
  const textX = useTransform(
    [localIn, exitT],
    ([i, e]: number[]) => {
      const i2 = Math.max(0, (i - 0.15) / 0.85);
      return (1 - i2) * -60 - e * 80;
    }
  );
  const textOpacity = useTransform(
    [localIn, exitT],
    ([i, e]: number[]) => {
      const i2 = Math.max(0, (i - 0.2) / 0.8);
      return Math.min(i2, 1 - e) * 1;
    }
  );

  // CTA & price slightly later
  const ctaOpacity = useTransform(
    [localIn, exitT],
    ([i, e]: number[]) => {
      const i2 = Math.max(0, (i - 0.4) / 0.6);
      return Math.min(i2, 1 - e);
    }
  );
  const ctaY = useTransform(
    [localIn, exitT],
    ([i, e]: number[]) => {
      const i2 = Math.max(0, (i - 0.4) / 0.6);
      return (1 - i2) * 30 + e * 20;
    }
  );

  // Decorative blurred blobs
  const decoScale = useTransform(
    [localIn, exitT],
    ([i, e]: number[]) => 0.7 + i * 0.4 - e * 0.2
  );
  const decoOpacity = useTransform(
    [localIn, exitT],
    ([i, e]: number[]) => Math.min(i, 1 - e) * 0.9
  );

  const gradient = useMemo(
    () =>
      `radial-gradient(120% 90% at 70% 40%, ${product.palette.to} 0%, ${product.palette.via} 42%, ${product.palette.from} 100%)`,
    [product.palette]
  );

  const isDark = product.theme === "dark";
  const textPrimary = isDark ? "text-white" : "text-neutral-900";
  const textSubtle = isDark ? "text-white/65" : "text-neutral-900/60";
  const borderCol = isDark ? "border-white/15" : "border-black/15";
  const chipBg = isDark ? "bg-white/10" : "bg-black/5";

  const onAddToCart = () => {
    add(
      {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        size: selectedSize,
        color: selectedColor,
      },
      1
    );
  };

  const onOrderNow = () => {
    onAddToCart();
    setTimeout(() => {
      document.dispatchEvent(
        new CustomEvent("open-checkout")
      );
    }, 300);
  };

  return (
    <section
      className="relative h-screen w-full flex items-center justify-center overflow-hidden"
      aria-label={product.name}
    >
      {/* Local background layer (morphs with progress) */}
      <motion.div
        className="absolute inset-0 -z-20"
        style={{ background: gradient, opacity: visibility }}
      />

      {/* Decorative blurred blobs (behind product) */}
      <motion.div
        className="absolute -z-10 pointer-events-none"
        style={{
          scale: decoScale,
          opacity: decoOpacity,
        }}
      >
        <div
          className="absolute rounded-full blur-[120px]"
          style={{
            width: 620,
            height: 620,
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -55%)",
            background: product.palette.glow,
          }}
        />
        <div
          className="absolute rounded-full blur-[90px] opacity-70"
          style={{
            width: 340,
            height: 340,
            left: "58%",
            top: "62%",
            transform: "translate(-50%, -50%)",
            background: product.palette.glow,
          }}
        />
      </motion.div>

      {/* Subtle grid / vignette texture */}
      <div
        className="absolute inset-0 -z-10 pointer-events-none"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 50%, transparent 55%, rgba(0,0,0,0.55) 100%)",
          opacity: isDark ? 0.9 : 0.35,
        }}
      />

      {/* Content grid */}
      <div className="relative z-10 w-full max-w-[1400px] px-6 md:px-10 grid grid-cols-1 lg:grid-cols-12 items-center gap-6 lg:gap-10">
        {/* LEFT — info */}
        <motion.div
          className={cn("lg:col-span-4 order-2 lg:order-1", textPrimary)}
          style={{ x: textX, opacity: textOpacity }}
        >
          {/* Category chip */}
          <div className="flex items-center gap-3 mb-4 md:mb-6">
            <span
              className={cn(
                "px-3 py-1 rounded-full text-[10px] uppercase tracking-[0.22em] border",
                borderCol,
                chipBg
              )}
            >
              {product.category}
            </span>
            {product.badge && (
              <span
                className="px-3 py-1 rounded-full text-[10px] uppercase tracking-[0.22em] font-medium"
                style={{
                  background: product.palette.accent,
                  color: isDark ? "#0b0b0b" : "#ffffff",
                }}
              >
                {product.badge}
              </span>
            )}
          </div>

          <h1 className="font-display font-semibold tracking-tight text-[34px] leading-[1.02] sm:text-[44px] md:text-[56px] lg:text-[60px]">
            {product.name}
          </h1>

          <p className={cn("mt-3 md:mt-5 text-base md:text-lg", textSubtle)}>
            {product.headline}
          </p>

          <p
            className={cn(
              "mt-3 md:mt-4 text-sm md:text-[15px] leading-relaxed max-w-md",
              textSubtle
            )}
          >
            {product.description}
          </p>

          {/* Sizes */}
          {product.sizes && (
            <div className="mt-5 md:mt-6">
              <div
                className={cn(
                  "text-[10px] uppercase tracking-[0.22em] mb-2",
                  textSubtle
                )}
              >
                Taille
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => {
                  const active = s === selectedSize;
                  return (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={cn(
                        "h-9 min-w-9 px-3 rounded-full text-xs tabular-nums border transition-all duration-200",
                        active
                          ? isDark
                            ? "bg-white text-black border-white"
                            : "bg-neutral-900 text-white border-neutral-900"
                          : cn(borderCol, "hover:opacity-80")
                      )}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Colors */}
          {product.colors && (
            <div className="mt-4">
              <div
                className={cn(
                  "text-[10px] uppercase tracking-[0.22em] mb-2",
                  textSubtle
                )}
              >
                Couleur
              </div>
              <div className="flex gap-2">
                {product.colors.map((c) => {
                  const active = c.name === selectedColor;
                  return (
                    <button
                      key={c.name}
                      onClick={() => setSelectedColor(c.name)}
                      aria-label={c.name}
                      className={cn(
                        "w-7 h-7 rounded-full border transition-all duration-200",
                        active ? "scale-110" : "opacity-70 hover:opacity-100",
                        isDark ? "border-white/40" : "border-black/30"
                      )}
                      style={{ background: c.hex }}
                    />
                  );
                })}
              </div>
            </div>
          )}
        </motion.div>

        {/* CENTER — image */}
        <div className="lg:col-span-5 order-1 lg:order-2 relative h-[42vh] sm:h-[48vh] lg:h-[70vh] flex items-center justify-center">
          <motion.div
            style={{
              x: imageX,
              y: imageY,
              scale: imageScale,
              rotate: imageRotate,
              opacity: imageOpacity,
              filter,
            }}
            className="relative w-full h-full flex items-center justify-center will-change-transform"
          >
            {/* Floor shadow */}
            <div
              className="absolute bottom-[12%] left-1/2 -translate-x-1/2 rounded-[50%] blur-2xl"
              style={{
                width: "65%",
                height: "8%",
                background: isDark
                  ? "rgba(0,0,0,0.55)"
                  : "rgba(0,0,0,0.25)",
              }}
            />
            <div className="relative w-[85%] h-[85%] animate-float will-change-transform">
              <Image
                src={product.image}
                alt={product.name}
                fill
                priority={index === 0}
                sizes="(max-width: 1024px) 90vw, 45vw"
                className="object-contain drop-shadow-[0_40px_60px_rgba(0,0,0,0.45)]"
              />
            </div>
          </motion.div>
        </div>

        {/* RIGHT — price & CTA */}
        <motion.div
          className={cn(
            "lg:col-span-3 order-3 flex flex-col lg:items-end",
            textPrimary
          )}
          style={{ opacity: ctaOpacity, y: ctaY }}
        >
          <div className="w-full max-w-xs lg:text-right">
            {/* Discount badge */}
            {product.discount && (
              <div className="mb-3 flex lg:justify-end">
                <span
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
                  style={{
                    background: product.palette.accent,
                    color: isDark ? "#0b0b0b" : "#ffffff",
                    boxShadow: `0 8px 30px ${product.palette.glow}`,
                  }}
                >
                  −{product.discount}%
                </span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-baseline lg:justify-end gap-3">
              <span className="font-display text-[28px] md:text-[34px] font-semibold tracking-tight">
                {formatDZD(product.price)}
              </span>
              {product.oldPrice && (
                <span className={cn("text-sm line-through", textSubtle)}>
                  {formatDZD(product.oldPrice)}
                </span>
              )}
            </div>

            {/* CTAs */}
            <div className="mt-5 md:mt-6 flex flex-col gap-2.5">
              <button
                onClick={onOrderNow}
                className={cn(
                  "group relative w-full h-12 rounded-full font-medium text-sm tracking-wide transition-all duration-300 overflow-hidden",
                  isDark
                    ? "bg-white text-black hover:shadow-[0_10px_40px_rgba(255,255,255,0.25)]"
                    : "bg-neutral-900 text-white hover:shadow-[0_10px_40px_rgba(0,0,0,0.35)]"
                )}
              >
                <span className="relative z-10">Commander maintenant</span>
                <span
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${product.palette.accent}40, transparent)`,
                    animation: "shimmer 1.8s linear infinite",
                  }}
                />
              </button>

              <button
                onClick={onAddToCart}
                className={cn(
                  "w-full h-12 rounded-full font-medium text-sm tracking-wide border transition-all duration-300",
                  borderCol,
                  isDark
                    ? "hover:bg-white/10"
                    : "hover:bg-black/5"
                )}
              >
                Ajouter au panier
              </button>
            </div>

            <div
              className={cn(
                "mt-4 text-[11px] tracking-wide hidden lg:block",
                textSubtle
              )}
            >
              Livraison 48–72h · Paiement à la livraison
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// Small helper to avoid circular import; products length is read lazily.
function productsLengthFromContext() {
  // This is set via a module-level variable that ScrollShowcase writes to.
  return (globalThis as any).__PRODUCTS_LEN__ ?? 1;
}