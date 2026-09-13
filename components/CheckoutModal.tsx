"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useCart } from "@/store/cart";
import { formatDZD } from "@/lib/utils";

// بيانات الولايات مع أسعار التوصيل للمنزل والمكتب
const WILAYAS_DATA: {
  code: string;
  name: string;
  home: number | null;
  office: number | null;
}[] = [
  { code: "01", name: "أدرار", home: 1250, office: 800 },
  { code: "02", name: "الشلف", home: 800, office: 450 },
  { code: "03", name: "الأغواط", home: 900, office: 550 },
  { code: "04", name: "أم البواقي", home: 800, office: 500 },
  { code: "05", name: "باتنة", home: 850, office: 480 },
  { code: "06", name: "بجاية", home: 750, office: 480 },
  { code: "07", name: "بسكرة", home: 900, office: 500 },
  { code: "08", name: "بشار", home: 1100, office: 700 },
  { code: "09", name: "البليدة", home: 630, office: 400 },
  { code: "10", name: "البويرة", home: 750, office: 450 },
  { code: "11", name: "تمنراست", home: 1600, office: 900 },
  { code: "12", name: "تبسة", home: 850, office: 500 },
  { code: "13", name: "تلمسان", home: 800, office: 500 },
  { code: "14", name: "تيارت", home: 850, office: 480 },
  { code: "15", name: "تيزي وزو", home: 700, office: 450 },
  { code: "16", name: "الجزائر", home: 380, office: 300 },
  { code: "17", name: "الجلفة", home: 950, office: 550 },
  { code: "18", name: "جيجل", home: 800, office: 450 },
  { code: "19", name: "سطيف", home: 750, office: 450 },
  { code: "20", name: "سعيدة", home: 800, office: 500 },
  { code: "21", name: "سكيكدة", home: 800, office: 450 },
  { code: "22", name: "سيدي بلعباس", home: 800, office: 450 },
  { code: "23", name: "عنابة", home: 800, office: 480 },
  { code: "24", name: "قالمة", home: 850, office: 400 },
  { code: "25", name: "قسنطينة", home: 800, office: 450 },
  { code: "26", name: "المدية", home: 800, office: 400 },
  { code: "27", name: "مستغانم", home: 800, office: 450 },
  { code: "28", name: "المسيلة", home: 800, office: 450 },
  { code: "29", name: "معسكر", home: 800, office: 500 },
  { code: "30", name: "ورقلة", home: 1050, office: 700 },
  { code: "31", name: "وهران", home: 800, office: 500 },
  { code: "32", name: "البيض", home: 1100, office: 650 },
  { code: "33", name: "إليزي", home: null, office: 1100 },
  { code: "34", name: "برج بوعريريج", home: 750, office: 450 },
  { code: "35", name: "بومرداس", home: 650, office: 400 },
  { code: "36", name: "الطارف", home: 850, office: 450 },
  { code: "37", name: "تندوف", home: 1500, office: 1150 },
  { code: "38", name: "تيسمسيلت", home: 800, office: 450 },
  { code: "39", name: "الوادي", home: 1000, office: 750 },
  { code: "40", name: "خنشلة", home: 850, office: 450 },
  { code: "41", name: "سوق أهراس", home: 850, office: 450 },
  { code: "42", name: "تيبازة", home: 650, office: 380 },
  { code: "43", name: "ميلة", home: 800, office: 450 },
  { code: "44", name: "عين الدفلى", home: 800, office: 450 },
  { code: "45", name: "النعامة", home: 1050, office: 650 },
  { code: "46", name: "عين تموشنت", home: 800, office: 450 },
  { code: "47", name: "غرداية", home: 1000, office: 650 },
  { code: "48", name: "غليزان", home: 800, office: 450 },
  { code: "49", name: "تيميمون", home: 1400, office: 750 },
  { code: "50", name: "برج باجي مختار", home: 1800, office: null },
  { code: "51", name: "أولاد جلال", home: 950, office: 600 },
  { code: "52", name: "بني عباس", home: 1150, office: 600 },
  { code: "53", name: "إن صالح", home: 1650, office: 950 },
  { code: "54", name: "عين قزام", home: 1800, office: null },
  { code: "55", name: "تقرت", home: 1100, office: 700 },
  { code: "56", name: "جانت", home: null, office: null },
  { code: "57", name: "المغير", home: 1050, office: 598 },
  { code: "58", name: "المنيعة", home: 1100, office: 650 },
];

type DeliveryType = "home" | "office";

type Form = {
  name: string;
  phone: string;
  wilaya: string;
  commune: string;
  address: string;
  notes: string;
  deliveryType: DeliveryType;
};

const initial: Form = {
  name: "",
  phone: "",
  wilaya: "16",
  commune: "",
  address: "",
  notes: "",
  deliveryType: "home",
};

export function CheckoutModal() {
  const { items, clear } = useCart();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Form>(initial);
  const [done, setDone] = useState(false);
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);

  // حساب سعر التوصيل بناءً على الولاية ونوع التوصيل
  const selectedWilaya = WILAYAS_DATA.find((w) => w.code === form.wilaya);
  const deliveryPrice =
    selectedWilaya?.[form.deliveryType] ?? null;
  const delivery = deliveryPrice ?? 0;

  const canDeliver =
    deliveryPrice !== null &&
    (form.deliveryType === "home" || form.deliveryType === "office");

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
    if (!canDeliver) return;
    // In production: POST to your backend.
    setDone(true);
    setTimeout(() => {
      clear();
      close();
    }, 2600);
  };

  const updateWilaya = (code: string) => {
    const w = WILAYAS_DATA.find((x) => x.code === code);
    // إذا كان نوع التوصيل الحالي غير متاح، نبدله تلقائياً
    let deliveryType = form.deliveryType;
    if (w) {
      if (deliveryType === "home" && w.home === null && w.office !== null) {
        deliveryType = "office";
      } else if (
        deliveryType === "office" &&
        w.office === null &&
        w.home !== null
      ) {
        deliveryType = "home";
      }
    }
    setForm({ ...form, wilaya: code, deliveryType });
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
              className="w-full max-w-lg bg-neutral-950 text-white rounded-3xl border border-white/10 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
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
                        onChange={(e) => updateWilaya(e.target.value)}
                        className="input"
                      >
                        {WILAYAS_DATA.map((w) => (
                          <option
                            key={w.code}
                            value={w.code}
                            className="bg-neutral-900"
                          >
                            {w.code} - {w.name}
                          </option>
                        ))}
                      </select>
                    </Field>
                  </div>

                  <Field label="Type de livraison">
                    <div className="grid grid-cols-2 gap-3">
                      <label
                        className={`flex items-center justify-center gap-2 h-11 rounded-xl border text-sm cursor-pointer transition-colors ${
                          form.deliveryType === "home"
                            ? "border-white/40 bg-white/10"
                            : "border-white/10 bg-white/5 hover:bg-white/10"
                        } ${selectedWilaya?.home === null ? "opacity-40 cursor-not-allowed" : ""}`}
                      >
                        <input
                          type="radio"
                          name="deliveryType"
                          value="home"
                          checked={form.deliveryType === "home"}
                          onChange={() =>
                            setForm({ ...form, deliveryType: "home" })
                          }
                          disabled={selectedWilaya?.home === null}
                          className="sr-only"
                        />
                        <span>🏠 À domicile</span>
                      </label>
                      <label
                        className={`flex items-center justify-center gap-2 h-11 rounded-xl border text-sm cursor-pointer transition-colors ${
                          form.deliveryType === "office"
                            ? "border-white/40 bg-white/10"
                            : "border-white/10 bg-white/5 hover:bg-white/10"
                        } ${selectedWilaya?.office === null ? "opacity-40 cursor-not-allowed" : ""}`}
                      >
                        <input
                          type="radio"
                          name="deliveryType"
                          value="office"
                          checked={form.deliveryType === "office"}
                          onChange={() =>
                            setForm({ ...form, deliveryType: "office" })
                          }
                          disabled={selectedWilaya?.office === null}
                          className="sr-only"
                        />
                        <span>🏢 Au bureau</span>
                      </label>
                    </div>
                  </Field>

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
                    <Row
                      k={`Livraison (${form.deliveryType === "home" ? "domicile" : "bureau"})`}
                      v={
                        deliveryPrice === null
                          ? "Non disponible"
                          : formatDZD(delivery)
                      }
                    />
                    <div className="h-px bg-white/10 my-2" />
                    <Row
                      k="Total"
                      v={
                        deliveryPrice === null
                          ? "—"
                          : formatDZD(subtotal + delivery)
                      }
                      bold
                    />
                  </div>

                  {!canDeliver && (
                    <div className="text-center text-xs text-red-400">
                      La livraison n'est pas disponible pour cette wilaya avec
                      ce type de livraison.
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={!canDeliver}
                    className="w-full h-12 rounded-full bg-white text-black font-medium text-sm hover:shadow-[0_10px_40px_rgba(255,255,255,0.25)] transition-shadow disabled:opacity-40 disabled:cursor-not-allowed"
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
