export const formatDZD = (n: number) =>
  new Intl.NumberFormat("fr-DZ", {
    style: "decimal",
    maximumFractionDigits: 0,
  }).format(n) + " DZD";

export const cn = (...c: (string | false | null | undefined)[]) =>
  c.filter(Boolean).join(" ");

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export const clamp = (v: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, v));