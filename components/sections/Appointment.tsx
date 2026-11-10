"use client";

import { useState } from "react";
import Image from "next/image";
import { Check, ChevronDown } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import SplitReveal from "@/components/ui/SplitReveal";
import { SERVICES, IMG } from "@/lib/data";
import { revealLeft, revealRight } from "@/lib/motion";

const field =
  "by-field placeholder:text-pink/50";

type FormState = { product: string; name: string; email: string; quantity: number; notes: string };
const EMPTY: FormState = { product: "", name: "", email: "", quantity: 1, notes: "" };

export default function Appointment() {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [submitted, setSubmitted] = useState(false);

  const set =
    (key: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Front-end only: this is where you'd POST to your API / email service.
    // We log the captured request and show a confirmation.
    console.info("Quote request:", form);
    setSubmitted(true);
  };

  const reset = () => {
    setForm(EMPTY);
    setSubmitted(false);
  };

  return (
    <section id="appointment" className="bg-pale py-16 sm:py-20">
      <div className="by-page grid items-stretch gap-2 lg:grid-cols-2">
        {/* Form */}
        <Reveal variants={revealLeft}>
          <div className="flex h-full flex-col rounded-[12px] bg-yellow p-8 sm:p-10">
            {submitted ? (
              <div className="flex flex-1 flex-col items-center justify-center py-8 text-center">
                <span className="grid h-20 w-20 place-items-center rounded-full bg-pink text-yellow">
                  <Check size={36} strokeWidth={3} />
                </span>
                <h2 className="by-h-band mt-6">
                  Request received{form.name ? `, ${form.name.split(" ")[0]}` : ""}!
                </h2>
                <p className="mt-3 max-w-sm text-sm leading-relaxed tracking-[0.6px] text-pink">
                  Thanks for your interest. Our team will confirm batch availability and pricing
                  by email shortly.
                </p>
                <button
                  onClick={reset}
                  className="by-btn mt-7"
                >
                  Submit another request
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <SplitReveal as="h2" className="by-h-section">
                  Request A Quote
                </SplitReveal>
                <p className="mt-3 text-sm leading-relaxed tracking-[0.6px] text-pink">
                  Research reference material — for laboratory and analytical use only. Not
                  intended to diagnose, treat, cure, or prevent any disease. Not for human or
                  veterinary use.
                </p>

                <div className="mt-7 space-y-5">
                  <Labeled label="Select Product">
                    <div className="relative">
                      <select
                        required
                        value={form.product}
                        onChange={set("product")}
                        className={`${field} appearance-none pr-12`}
                      >
                        <option value="" disabled>
                          Choose a compound
                        </option>
                        {SERVICES.map((s) => (
                          <option key={s.title}>{s.title}</option>
                        ))}
                      </select>
                      <ChevronDown
                        size={18}
                        className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-pink"
                      />
                    </div>
                  </Labeled>
                  <Labeled label="Your Name / Institution">
                    <input required value={form.name} onChange={set("name")} className={field} type="text" />
                  </Labeled>
                  <Labeled label="Email Address">
                    <input required value={form.email} onChange={set("email")} className={field} type="email" />
                  </Labeled>
                  <Labeled label="Quantity">
                    <input
                      required
                      value={form.quantity}
                      onChange={set("quantity")}
                      className={field}
                      type="number"
                      min={1}
                    />
                  </Labeled>
                  <Labeled label="Notes (optional)">
                    <input
                      value={form.notes}
                      onChange={set("notes")}
                      className={field}
                      type="text"
                      placeholder="Batch, COA, or research notes"
                    />
                  </Labeled>

                  <button
                    type="submit"
                    className="by-btn w-full"
                  >
                    Submit Request
                  </button>
                </div>
              </form>
            )}
          </div>
        </Reveal>

        {/* Image */}
        <Reveal variants={revealRight} className="relative">
          <div className="relative h-full min-h-[480px] w-full overflow-hidden rounded-[12px]">
            <Image
              src={IMG.quoteRight}
              alt="LUXEN laboratory preparing a research order"
              fill
              className="object-cover"
              sizes="(min-width:1024px) 45vw, 100vw"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Labeled({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-[13px] font-bold uppercase tracking-[1px] text-pink">{label}</span>
      {children}
    </label>
  );
}
