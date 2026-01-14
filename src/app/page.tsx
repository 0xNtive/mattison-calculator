"use client";

import { useState, useCallback } from "react";
import Disclaimer from "@/components/Disclaimer";
import AllocationCalculator from "@/components/AllocationCalculator";
import ShareButtons from "@/components/ShareButtons";
import LearnMore from "@/components/LearnMore";
import HistoricalCalculator from "@/components/HistoricalCalculator";
import { AllocationResult, SubAllocations, DEFAULT_SUB_ALLOCATIONS } from "@/lib/allocation";
import RetirementProjection from "@/components/RetirementProjection";
import RebalancingSimulator from "@/components/RebalancingSimulator";
import StrategyComparison from "@/components/StrategyComparison";
import ThemeToggle from "@/components/ThemeToggle";

export default function Home() {
  const [allocation, setAllocation] = useState<AllocationResult>({
    goldPercentage: 50,
    btcPercentage: 50,
  });
  const [age, setAge] = useState(35);
  const [subAllocations, setSubAllocations] = useState<SubAllocations>(DEFAULT_SUB_ALLOCATIONS);

  const handleAllocationChange = useCallback((newAllocation: AllocationResult) => {
    setAllocation(newAllocation);
  }, []);

  const handleAgeChange = useCallback((newAge: number) => {
    setAge(newAge);
  }, []);

  const handleSubAllocationsChange = useCallback((subs: SubAllocations) => {
    setSubAllocations(subs);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Disclaimer banner */}
      <Disclaimer />

      <main className="flex-1 py-4 md:py-8">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <header className="relative mb-8">
            <div className="absolute right-0 top-0">
              <ThemeToggle />
            </div>
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-bold text-[var(--foreground)] tracking-tight">
                Mattison Allocation Calculator
              </h1>
              <p className="text-[var(--foreground-muted)] text-sm mt-2">
                Age-based Gold &amp; Bitcoin portfolio allocation
              </p>
            </div>
          </header>

          {/* Main grid - two columns on desktop */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
            {/* Left column - Calculator */}
            <div className="lg:col-span-4 space-y-4">
              <AllocationCalculator
                onAgeChange={handleAgeChange}
                onAllocationChange={handleAllocationChange}
                onSubAllocationsChange={handleSubAllocationsChange}
              />

              {/* Share buttons */}
              <div className="premium-card rounded-xl p-4">
                <p className="text-xs text-[var(--foreground-muted)] text-center mb-3">Share your allocation</p>
                <ShareButtons
                  age={age}
                  goldPercentage={allocation.goldPercentage}
                  btcPercentage={allocation.btcPercentage}
                  subAllocations={subAllocations}
                />
              </div>

              {/* Learn more - desktop only in left column */}
              <div className="hidden lg:block">
                <LearnMore />
              </div>
            </div>

            {/* Right column - Chart and Tools */}
            <div className="lg:col-span-8 space-y-4">
              <HistoricalCalculator
                goldPercentage={allocation.goldPercentage}
                btcPercentage={allocation.btcPercentage}
              />

              {/* Retirement Projection */}
              <RetirementProjection currentAge={age} />

              {/* Rebalancing Simulator */}
              <RebalancingSimulator
                goldPercentage={allocation.goldPercentage}
                btcPercentage={allocation.btcPercentage}
              />

              {/* Strategy Comparison */}
              <StrategyComparison
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
          <footer className="text-center text-[var(--neutral)] text-xs mt-8 pt-4 border-t border-[var(--card-border)]">
            <p>
              For educational purposes only. Past performance does not guarantee future results.
            </p>
          </footer>
        </div>
      </main>
    </div>
  );
}
