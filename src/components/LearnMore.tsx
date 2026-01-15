"use client";

import { useState } from "react";

export default function LearnMore() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="premium-card rounded-xl overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-[rgba(255,255,255,0.02)] transition-colors"
      >
        <span className="text-sm font-medium text-white">
          Learn about the Mattison Allocation
        </span>
        <svg
          className={`w-4 h-4 text-[var(--foreground-muted)] transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-[1500px] opacity-100" : "max-h-0 opacity-0"}`}>
        <div className="px-4 pb-5 space-y-5 text-sm border-t border-[var(--card-border)]">
          <section className="pt-4">
            <h3 className="font-semibold text-white mb-2">The Concept</h3>
            <p className="text-[var(--foreground-muted)] leading-relaxed">
              An age-based formula for allocating between two hard assets: <strong className="text-[var(--gold)]">Gold</strong> and <strong className="text-[var(--bitcoin)]">Bitcoin</strong>.
              The formula assigns higher Bitcoin allocation at younger ages, shifting toward gold over time.
            </p>
          </section>

          <section>
            <h3 className="font-semibold text-white mb-2">The Formula</h3>
            <div className="glass rounded-lg p-4 font-mono text-sm space-y-2">
              <p className="text-[var(--gold)]"><span className="font-bold">Gold %</span> = Age + 15</p>
              <p className="text-[var(--bitcoin)]"><span className="font-bold">BTC %</span> = 100 - Gold %</p>
            </div>
          </section>

          <section>
            <h3 className="font-semibold text-white mb-2">Key Characteristics</h3>
            <ul className="text-[var(--foreground-muted)] space-y-2">
              <li className="flex gap-2">
                <span className="text-[var(--gold)]">&#8226;</span>
                <span><strong className="text-white">Low correlation</strong> &ndash; Gold and BTC historically move independently</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--gold)]">&#8226;</span>
                <span><strong className="text-white">Different asset classes</strong> &ndash; Traditional store of value meets digital asset</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--gold)]">&#8226;</span>
                <span><strong className="text-white">Age-based</strong> &ndash; Allocation shifts based on age input</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--gold)]">&#8226;</span>
                <span><strong className="text-white">Fixed supply</strong> &ndash; Both assets have limited supply characteristics</span>
              </li>
            </ul>
          </section>

          <section>
            <h3 className="font-semibold text-white mb-2">Core vs. Satellite Concept</h3>
            <p className="text-[var(--foreground-muted)] leading-relaxed">
              Some investors structure portfolios with a <strong className="text-white">core holding</strong> and <strong className="text-white">satellite</strong> positions.
              This calculator focuses on the hard asset allocation portion only.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
