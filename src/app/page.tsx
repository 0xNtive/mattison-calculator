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
import PDFExport from "@/components/PDFExport";

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
            <div className="lg:col-span-5 space-y-4" style={{ minWidth: 0 }}>
              <AllocationCalculator
                onAgeChange={handleAgeChange}
                onAllocationChange={handleAllocationChange}
                onSubAllocationsChange={handleSubAllocationsChange}
              />

              {/* Share buttons and PDF Export */}
              <div className="premium-card rounded-xl p-4">
                <p className="text-xs text-[var(--foreground-muted)] text-center mb-3">Share your allocation</p>
                <div className="flex flex-wrap items-center justify-center gap-2">
                  <ShareButtons
                    age={age}
                    goldPercentage={allocation.goldPercentage}
                    btcPercentage={allocation.btcPercentage}
                    subAllocations={subAllocations}
                  />
                  <PDFExport
                    age={age}
                    goldPercentage={allocation.goldPercentage}
                    btcPercentage={allocation.btcPercentage}
                    goldAmount={allocation.goldAmount}
                    btcAmount={allocation.btcAmount}
                    portfolioValue={allocation.goldAmount && allocation.btcAmount ? allocation.goldAmount + allocation.btcAmount : undefined}
                    subAllocations={subAllocations}
                  />
                </div>
              </div>

              {/* Learn more - desktop only in left column */}
              <div className="hidden lg:block">
                <LearnMore />
              </div>
            </div>

            {/* Right column - Chart and Tools */}
            <div className="lg:col-span-7 space-y-4">
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

          {/* Book promotion */}
          <div className="mt-8 flex justify-center">
            <a
              href="https://www.melmattison.com/quoz"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[var(--gold-dark)] to-[var(--bitcoin)] text-white font-semibold text-sm shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 2a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6H6zm0 2h7v5h5v11H6V4zm2 8v2h8v-2H8zm0 4v2h5v-2H8z"/>
              </svg>
              <span>Buy Mel Mattison&apos;s Book</span>
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </div>

          {/* Footer */}
          <footer className="text-center text-[var(--neutral)] text-xs mt-6 pt-4 border-t border-[var(--card-border)] space-y-2">
            <p>
              For educational purposes only. Past performance does not guarantee future results.
            </p>
            <p>
              Developed by{" "}
              <a
                href="https://x.com/Techster"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--bitcoin)] hover:text-[var(--bitcoin-light)] transition-colors"
              >
                Techster
              </a>
            </p>
          </footer>
        </div>
      </main>
    </div>
  );
}
