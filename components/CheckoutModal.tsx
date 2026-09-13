"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useCart } from "@/store/cart";
import { formatDZD } from "@/lib/utils";

const WILAYAS = [
  "Alger",
  "Oran",
  "Constantine",
  "Annaba",
  "Blida",
  "Sétif",
  "Batna",
  "Tlemcen",
  "Béjaïa",
  "Tizi Ouzou",
  "Djelfa",
  "Biskra",
  "Ouargla",
  "Ghardaïa",
  "Adrar",
  "Tamanrasset",
];

type Form = {
  name: string;
  phone: string;
  wilaya: string;
  commune: string;
  address: string;
  notes: string;
};

const initial: Form = {
  name: "",
  phone: "",
  wilaya: "Alger",
  commune: "",
  address: "",
  notes: "",
};

export function CheckoutModal() {
  const { items, clear } = useCart();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Form>(initial);
  const [done, setDone] = useState(false);
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const delivery = 600;

  useEffect(() => {
    const onOpen = () => setOpen(true);
    document.addEventListener("open-checkout", onOpen);
    return () => document.removeEventListener("open-checkout", onOpen);
  }, []);

  const close = () => {
    setOpen(false);
    setDone(false);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production: POST to your backend.
    setDone(true);
    setTimeout(() => {
      clear();
      close();
    }, 2600);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          />
          <motion.div
            className="fixed inset-0 z-[90] grid place-items-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ y: 24, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 16, opacity: 0, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 340, damping: 32 }}
              className="w-full max-w-lg bg-neutral-950 text-white rounded-3xl border border-white/10 shadow-2xl overflow-hidden"
            >
              {done ? (
                <div className="p-10 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    className="w-14 h-14 mx-auto rounded-full bg-white text-black grid place-items-center text-2xl"
                  >
                    ✓
                  </motion.div>
                  <div className="mt-5 font-display text-xl font-semibold">
                    Commande confirmée
                  </div>
                  <div className="mt-2 text-sm text-white/60">
                    Nous vous appellerons bientôt pour confirmer la livraison.
                  </div>
                </div>
              ) : (
                <form onSubmit={submit} className="p-6 md:p-8 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="font-display text-xl font-semibold">
                      Finaliser la commande
                    </div>
                    <button
                      type="button"
                      onClick={close}
                      className="w-8 h-8 rounded-full grid place-items-center hover:bg-white/10"
                      aria-label="Fermer"
                    >
                      ✕
                    </button>
                  </div>

                  <Field label="Nom complet">
                    <input
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="input"
                      placeholder="Ahmed Benali"
                    />
                  </Field>

                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Téléphone">
                      <input
                        required
                        type="tel"
                        value={form.phone}
                        onChange={(e) =>
                          setForm({ ...form, phone: e.target.value })
                        }
                        className="input"
                        placeholder="0X XX XX XX XX"
                      />
                    </Field>
                    <Field label="Wilaya">
                      <select
                        value={form.wilaya}
                        onChange={(e) =>
                          setForm({ ...form, wilaya: e.target.value })
                        }
                        className="input"
                      >
                        {WILAYAS.map((w) => (
                          <option key={w} value={w} className="bg-neutral-900">
                            {w}
                          </option>
                        ))}
                      </select>
                    </Field>
                  </div>

                  <Field label="Commune">
                    <input
                      required
                      value={form.commune}
                      onChange={(e) =>
                        setForm({ ...form, commune: e.target.value })
                      }
                      className="input"
                      placeholder="Bab Ezzouar"
                    />
                  </Field>

                  <Field label="Adresse détaillée">
                    <textarea
                      required
                      rows={2}
                      value={form.address}
                      onChange={(e) =>
                        setForm({ ...form, address: e.target.value })
                      }
                      className="input resize-none"
                      placeholder="Rue, numéro, repère…"
                    />
                  </Field>

                  <Field label="Notes (optionnel)">
                    <input
                      value={form.notes}
                      onChange={(e) =>
                        setForm({ ...form, notes: e.target.value })
                      }
                      className="input"
                      placeholder="Instructions de livraison"
                    />
                  </Field>

                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm space-y-2">
                    <Row k="Sous-total" v={formatDZD(subtotal)} />
                    <Row k="Livraison" v={formatDZD(delivery)} />
                    <div className="h-px bg-white/10 my-2" />
                    <Row
                      k="Total"
                      v={formatDZD(subtotal + delivery)}
                      bold
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full h-12 rounded-full bg-white text-black font-medium text-sm hover:shadow-[0_10px_40px_rgba(255,255,255,0.25)] transition-shadow"
                  >
                    Confirmer la commande
                  </button>

                  <div className="text-center text-[11px] text-white/40">
                    Paiement à la livraison · Annulation gratuite
                  </div>
                </form>
              )}
            </motion.div>
          </motion.div>

          <style jsx global>{`
            .input {
              width: 100%;
              height: 44px;
              padding: 0 14px;
              border-radius: 12px;
              background: rgba(255, 255, 255, 0.05);
              border: 1px solid rgba(255, 255, 255, 0.1);
              color: white;
              font-size: 14px;
              outline: none;
              transition: border-color 0.2s, background 0.2s;
            }
            textarea.input {
              height: auto;
              padding: 12px 14px;
            }
            .input:focus {
              border-color: rgba(255, 255, 255, 0.35);
              background: rgba(255, 255, 255, 0.08);
            }
            .input::placeholder {
              color: rgba(255, 255, 255, 0.35);
            }
          `}</style>
        </>
      )}
    </AnimatePresence>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-[11px] uppercase tracking-[0.18em] text-white/50 mb-1.5">
        {label}
      </span>
      {children}
    </label>
  );
}

function Row({ k, v, bold }: { k: string; v: string; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className={bold ? "text-white" : "text-white/60"}>{k}</span>
      <span className={bold ? "font-semibold" : ""}>{v}</span>
    </div>
  );
}