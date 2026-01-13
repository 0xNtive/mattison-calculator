"use client";

import { useState, useCallback } from "react";
import Disclaimer from "@/components/Disclaimer";
import AllocationCalculator from "@/components/AllocationCalculator";
import ShareButtons from "@/components/ShareButtons";
import LearnMore from "@/components/LearnMore";
import HistoricalCalculator from "@/components/HistoricalCalculator";
import { AllocationResult } from "@/lib/allocation";

export default function Home() {
  const [allocation, setAllocation] = useState<AllocationResult>({
    goldPercentage: 50,
    btcPercentage: 50,
  });
  const [age, setAge] = useState(35);

  const handleAllocationChange = useCallback((newAllocation: AllocationResult) => {
    setAllocation(newAllocation);
  }, []);

  const handleAgeChange = useCallback((newAge: number) => {
    setAge(newAge);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Disclaimer banner */}
      <Disclaimer />

      <main className="flex-1 py-4 md:py-6">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <header className="text-center mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Mattison Allocation Calculator
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Age-based Gold &amp; Bitcoin portfolio allocation
            </p>
          </header>

          {/* Main grid - two columns on desktop */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
            {/* Left column - Calculator */}
            <div className="lg:col-span-4 space-y-4">
              <AllocationCalculator
                onAgeChange={handleAgeChange}
                onAllocationChange={handleAllocationChange}
              />

              {/* Share buttons */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <p className="text-xs text-gray-500 text-center mb-3">Share your allocation</p>
                <ShareButtons
                  age={age}
                  goldPercentage={allocation.goldPercentage}
                  btcPercentage={allocation.btcPercentage}
                />
              </div>

              {/* Learn more - desktop only in left column */}
              <div className="hidden lg:block">
                <LearnMore />
              </div>
            </div>

            {/* Right column - Chart */}
            <div className="lg:col-span-8">
              <HistoricalCalculator
                goldPercentage={allocation.goldPercentage}
                btcPercentage={allocation.btcPercentage}
              />
            </div>

            {/* Learn more - mobile only below chart */}
            <div className="lg:hidden">
              <LearnMore />
            </div>
          </div>

          {/* Footer */}
          <footer className="text-center text-gray-400 text-xs mt-8 pt-4 border-t border-gray-200">
            <p>
              For educational purposes only. Past performance does not guarantee future results.
            </p>
          </footer>
        </div>
      </main>
    </div>
  );
}
