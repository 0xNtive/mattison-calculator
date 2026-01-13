"use client";

import { useState } from "react";

export default function LearnMore() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
      >
        <span className="text-sm font-medium text-gray-700">
          Learn about the Mattison Allocation
        </span>
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-[1500px] opacity-100" : "max-h-0 opacity-0"}`}>
        <div className="px-4 pb-4 space-y-4 text-sm">
          <section>
            <h3 className="font-semibold text-gray-900 mb-2">The Philosophy</h3>
            <p className="text-gray-600 leading-relaxed">
              A simple, age-based strategy balancing two hard assets: <strong>Gold</strong> and <strong>Bitcoin</strong>.
              Younger investors allocate more to Bitcoin for growth; older investors favor gold for stability.
            </p>
          </section>

          <section>
            <h3 className="font-semibold text-gray-900 mb-2">The Formula</h3>
            <div className="bg-gray-50 rounded-lg p-3 font-mono text-xs space-y-1">
              <p className="text-yellow-700"><span className="font-bold">Gold %</span> = Age + 15</p>
              <p className="text-orange-600"><span className="font-bold">BTC %</span> = 100 - Gold %</p>
            </div>
          </section>

          <section>
            <h3 className="font-semibold text-gray-900 mb-2">Why It Works</h3>
            <ul className="text-gray-600 space-y-1.5">
              <li className="flex gap-2">
                <span className="text-yellow-500">&#10003;</span>
                <span><strong>Uncorrelated</strong> &ndash; Gold and BTC move independently</span>
              </li>
              <li className="flex gap-2">
                <span className="text-yellow-500">&#10003;</span>
                <span><strong>Time-tested + emerging</strong> &ndash; 5,000 years meets the future</span>
              </li>
              <li className="flex gap-2">
                <span className="text-yellow-500">&#10003;</span>
                <span><strong>Age-appropriate</strong> &ndash; Auto-adjusts risk as you age</span>
              </li>
              <li className="flex gap-2">
                <span className="text-yellow-500">&#10003;</span>
                <span><strong>Hard money</strong> &ndash; Both are scarce and inflation-resistant</span>
              </li>
            </ul>
          </section>

          <section>
            <h3 className="font-semibold text-gray-900 mb-2">Core vs. Satellite</h3>
            <p className="text-gray-600 leading-relaxed">
              Use this as your <strong>core holding</strong> (35-60% of portfolio).
              The rest goes to <strong>satellite</strong> positions like equities&mdash;favor non-USD denominated (e.g., EEM).
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
