"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useCart, cartKey } from "@/store/cart";
import { formatDZD } from "@/lib/utils";
import Image from "next/image";

export function CartDrawer() {
  const { items, isOpen, close, updateQty, remove } = useCart();
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);

  const openCheckout = () => {
    close();
    document.dispatchEvent(new CustomEvent("open-checkout"));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          />
          <motion.aside
            className="fixed right-0 top-0 z-[70] h-full w-full max-w-md bg-neutral-950 text-white flex flex-col"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
          >
            <div className="flex items-center justify-between px-6 h-16 border-b border-white/10">
              <div className="font-display font-semibold">Panier</div>
              <button
                onClick={close}
                className="w-9 h-9 rounded-full grid place-items-center hover:bg-white/10 transition-colors"
                aria-label="Fermer"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 && (
                <div className="text-center text-white/50 py-24 text-sm">
                  Votre panier est vide.
                </div>
              )}
              <ul className="flex flex-col gap-4">
                {items.map((i) => {
                  const k = cartKey(i);
                  return (
                    <li
                      key={k}
                      className="flex gap-4 p-3 rounded-2xl bg-white/5 border border-white/10"
                    >
                      <div className="relative w-20 h-20 rounded-xl bg-black/40 overflow-hidden shrink-0">
                        <Image
                          src={i.image}
                          alt={i.name}
                          fill
                          sizes="80px"
                          className="object-contain p-2"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">
                          {i.name}
                        </div>
                        <div className="text-xs text-white/50 mt-0.5">
                          {[i.size && `Taille ${i.size}`, i.color]
                            .filter(Boolean)
                            .join(" · ")}
                        </div>
                        <div className="mt-2 flex items-center justify-between">
                          <div className="flex items-center gap-1 border border-white/15 rounded-full">
                            <button
                              onClick={() => updateQty(k, i.quantity - 1)}
                              className="w-7 h-7 grid place-items-center text-white/80 hover:text-white"
                              aria-label="Diminuer"
                            >
                              −
                            </button>
                            <span className="w-6 text-center text-xs tabular-nums">
                              {i.quantity}
                            </span>
                            <button
                              onClick={() => updateQty(k, i.quantity + 1)}
                              className="w-7 h-7 grid place-items-center text-white/80 hover:text-white"
                              aria-label="Augmenter"
                            >
                              +
                            </button>
                          </div>
                          <div className="text-sm font-medium">
                            {formatDZD(i.price * i.quantity)}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => remove(k)}
                        className="text-white/40 hover:text-white text-xs self-start"
                        aria-label="Retirer"
                      >
                        ✕
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            {items.length > 0 && (
              <div className="border-t border-white/10 p-6 space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/60">Sous-total</span>
                  <span className="font-medium">{formatDZD(subtotal)}</span>
                </div>
                <button
                  onClick={openCheckout}
                  className="w-full h-12 rounded-full bg-white text-black font-medium text-sm hover:shadow-[0_10px_40px_rgba(255,255,255,0.25)] transition-shadow"
                >
                  Passer la commande
                </button>
                <div className="text-center text-[11px] text-white/40">
                  Paiement à la livraison · Livraison 48–72h
                </div>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}