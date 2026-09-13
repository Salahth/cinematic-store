export type Product = {
  id: string;
  name: string;
  category: string;
  headline: string;
  description: string;
  price: number;
  oldPrice?: number;
  discount?: number;
  image: string;
  palette: {
    from: string;
    via: string;
    to: string;
    accent: string;
    glow: string;
  };
  theme: "dark" | "light";
  sizes?: string[];
  colors?: { name: string; hex: string }[];
  badge?: string;
};

export const products: Product[] = [
  {
    id: "air-max-red",
    name: "Nike Air Max",
    category: "Performance Sneaker",
    headline: "Performance meets everyday style.",
    description:
      "Engineered with visible Air cushioning and a breathable mesh upper. Built to move with you — from the street to the studio.",
    price: 15900,
    oldPrice: 19900,
    discount: 20,
    image: "/products/shoe-red.png",
    palette: {
      from: "#3a0512",
      via: "#7c0a2b",
      to: "#c21e4a",
      accent: "#ff5b86",
      glow: "rgba(255,60,110,0.35)",
    },
    theme: "dark",
    sizes: ["39", "40", "41", "42", "43", "44"],
    colors: [
      { name: "Burgundy", hex: "#7c0a2b" },
      { name: "Ivory", hex: "#f3e9dd" },
    ],
    badge: "Best-seller",
  },
  {
    id: "air-max-cyan",
    name: "Nike Air Max Ice",
    category: "Performance Sneaker",
    headline: "Cold-blooded comfort. Ice-clear focus.",
    description:
      "A glacial colorway on the same legendary Air platform. Lightweight, responsive, and unmistakably fresh.",
    price: 18900,
    image: "/products/shoe-cyan.png",
    palette: {
      from: "#03202b",
      via: "#0b6e8f",
      to: "#26d0e0",
      accent: "#7ff3ff",
      glow: "rgba(60,220,255,0.35)",
    },
    theme: "dark",
    sizes: ["39", "40", "41", "42", "43", "44"],
    colors: [
      { name: "Ice", hex: "#26d0e0" },
      { name: "White", hex: "#ffffff" },
    ],
    badge: "Nouveau",
  },
  {
    id: "air-max-obsidian",
    name: "Nike Air Max Obsidian",
    category: "Performance Sneaker",
    headline: "Stealth mode, activated.",
    description:
      "Triple-black construction with matte and gloss contrasts. A silhouette that disappears into the night — quietly powerful.",
    price: 21500,
    image: "/products/shoe-black.png",
    palette: {
      from: "#050505",
      via: "#1a1a1a",
      to: "#2e2e2e",
      accent: "#9ca3af",
      glow: "rgba(255,255,255,0.12)",
    },
    theme: "dark",
    sizes: ["39", "40", "41", "42", "43", "44"],
    colors: [{ name: "Obsidian", hex: "#111111" }],
  },
  {
    id: "air-max-arctic",
    name: "Nike Air Max Arctic",
    category: "Performance Sneaker",
    headline: "Pure. Clean. Effortless.",
    description:
      "An all-white icon with subtle off-white detailing. Pairs with everything, elevates anything.",
    price: 17500,
    oldPrice: 20500,
    discount: 15,
    image: "/products/shoe-white.png",
    palette: {
      from: "#e8e6e1",
      via: "#f5f3ef",
      to: "#ffffff",
      accent: "#8a8578",
      glow: "rgba(0,0,0,0.06)",
    },
    theme: "light",
    sizes: ["39", "40", "41", "42", "43", "44"],
    colors: [
      { name: "Arctic", hex: "#ffffff" },
      { name: "Bone", hex: "#e8e6e1" },
    ],
  },
  {
    id: "air-max-solar",
    name: "Nike Air Max Solar",
    category: "Performance Sneaker",
    headline: "Warmth you can wear.",
    description:
      "Sunset-inspired gradients on a cushioned base. For the ones who chase golden hour, every hour.",
    price: 19900,
    image: "/products/shoe-orange.png",
    palette: {
      from: "#3d1200",
      via: "#a8420a",
      to: "#ff7a18",
      accent: "#ffb066",
      glow: "rgba(255,140,40,0.35)",
    },
    theme: "dark",
    sizes: ["39", "40", "41", "42", "43", "44"],
    colors: [
      { name: "Solar", hex: "#ff7a18" },
      { name: "Ember", hex: "#a8420a" },
    ],
    badge: "Édition limitée",
  },
  {
  id: "air-max-purple",                    // معرف فريد
  name: "Nike Air Max Purple",
  category: "Performance Sneaker",
  headline: "Bold color. Bold moves.",
  description: "A statement silhouette with purple accents...",
  price: 17900,
  oldPrice: 21900,                         // اختياري
  discount: 18,                            // اختياري
  image: "/products/shoe-purple.png",      // ضع الصورة في public/products/
  palette: {
    from: "#1a0033",
    via: "#6b21a8",
    to: "#a855f7",
    accent: "#d8b4fe",
    glow: "rgba(168,85,247,0.35)",
  },
  theme: "dark",                           // أو "light"
  sizes: ["39", "40", "41", "42", "43", "44"],
  colors: [
    { name: "Purple", hex: "#a855f7" },
    { name: "Black", hex: "#000000" },
  ],
  badge: "Édition limitée",                // اختياري
},
];
