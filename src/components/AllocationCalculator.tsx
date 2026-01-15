"use client";

import { useState, useCallback, useEffect } from "react";
import {
  calculateAllocation,
  calculateDetailedAllocation,
  calculateAllocationWithSubs,
  MIN_AGE,
  MAX_AGE,
  isValidAge,
  AllocationResult,
  DetailedAllocation,
  SubAllocations,
  DEFAULT_SUB_ALLOCATIONS,
} from "@/lib/allocation";
import AllocationDisplay from "./AllocationDisplay";
import SubAllocationSelector from "./SubAllocationSelector";

interface AllocationCalculatorProps {
  onAgeChange?: (age: number) => void;
  onAllocationChange?: (allocation: AllocationResult) => void;
  onSubAllocationsChange?: (subs: SubAllocations) => void;
}

export default function AllocationCalculator({
  onAgeChange,
  onAllocationChange,
  onSubAllocationsChange,
}: AllocationCalculatorProps) {
  const [age, setAge] = useState<number>(35);
  const [portfolioValue, setPortfolioValue] = useState<string>("");
  const [isDetailed, setIsDetailed] = useState(false);
  const [corePercentage, setCorePercentage] = useState(50);
  const [ageError, setAgeError] = useState<string>("");
  const [subAllocations, setSubAllocations] = useState<SubAllocations>(DEFAULT_SUB_ALLOCATIONS);

  const handleAgeChange = useCallback(
    (value: string) => {
      const numValue = parseInt(value, 10);

      if (value === "") {
        setAge(MIN_AGE);
        setAgeError("");
        return;
      }

      if (isNaN(numValue)) {
        setAgeError("Please enter a valid number");
        return;
      }

      if (numValue < MIN_AGE) {
        setAgeError(`Min: ${MIN_AGE}`);
        setAge(numValue);
      } else if (numValue > MAX_AGE) {
        setAgeError(`Max: ${MAX_AGE}`);
        setAge(numValue);
      } else {
        setAgeError("");
        setAge(numValue);
        onAgeChange?.(numValue);
      }
    },
    [onAgeChange]
  );

  const portfolioValueNum = portfolioValue ? parseFloat(portfolioValue.replace(/,/g, "")) : undefined;

  const allocation: AllocationResult | DetailedAllocation = isDetailed
    ? calculateDetailedAllocation(age, portfolioValueNum, corePercentage)
    : calculateAllocationWithSubs(age, portfolioValueNum, subAllocations);

  useEffect(() => {
    if (onAllocationChange && isValidAge(age)) {
      const basicAllocation = calculateAllocation(age);
      onAllocationChange(basicAllocation);
    }
  }, [age, onAllocationChange]);

  const handleSubAllocationsChange = useCallback(
    (subs: SubAllocations) => {
      setSubAllocations(subs);
      onSubAllocationsChange?.(subs);
    },
    [onSubAllocationsChange]
  );

  const formatPortfolioInput = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, "");
    if (numericValue === "") return "";
    const num = parseInt(numericValue, 10);
    return num.toLocaleString();
  };

  return (
    <div className="premium-card rounded-xl p-5 overflow-hidden">
      <h2 className="text-lg font-semibold text-white mb-5">Your Allocation</h2>

      {/* Inputs row */}
      <div className="grid grid-cols-2 gap-4 mb-5">
        <div>
          <label htmlFor="age" className="block text-xs font-medium text-[var(--foreground-muted)] mb-1.5">
            Age
          </label>
          <input
            type="number"
            id="age"
            value={age}
            onChange={(e) => handleAgeChange(e.target.value)}
            min={MIN_AGE}
            max={MAX_AGE}
            className={`premium-input w-full px-3 py-2.5 text-base rounded-lg transition-all ${
              ageError
                ? "border-[var(--accent-danger)] focus:ring-[var(--accent-danger-glow)]"
                : ""
            }`}
          />
          {ageError && <p className="mt-1 text-xs text-[var(--accent-danger)]">{ageError}</p>}
        </div>

        <div>
          <label htmlFor="portfolio" className="block text-xs font-medium text-[var(--foreground-muted)] mb-1.5">
            Portfolio <span className="text-[var(--neutral)]">(opt.)</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--neutral)] text-sm">$</span>
            <input
              type="text"
              id="portfolio"
              value={portfolioValue}
              onChange={(e) => setPortfolioValue(formatPortfolioInput(e.target.value))}
              className="premium-input w-full pl-7 pr-3 py-2.5 text-base rounded-lg"
              placeholder="10,000"
            />
          </div>
        </div>
      </div>

      {/* View toggle */}
      <div className="flex justify-center mb-5">
        <div className="inline-flex rounded-lg bg-[rgba(255,255,255,0.03)] p-1 text-xs border border-[var(--card-border)]">
          <button
            onClick={() => setIsDetailed(false)}
            className={`px-4 py-2 rounded-md font-medium transition-all ${
              !isDetailed
                ? "bg-[var(--bitcoin)] text-white shadow-lg"
                : "text-[var(--foreground-muted)] hover:text-white"
            }`}
          >
            Simple
          </button>
          <button
            onClick={() => setIsDetailed(true)}
            className={`px-4 py-2 rounded-md font-medium transition-all ${
              isDetailed
                ? "bg-[var(--bitcoin)] text-white shadow-lg"
                : "text-[var(--foreground-muted)] hover:text-white"
            }`}
          >
            Detailed
          </button>
        </div>
      </div>

      {/* Core percentage slider (only in detailed view) */}
      {isDetailed && (
        <div className="mb-5 px-1">
          <div className="flex justify-between text-xs text-[var(--foreground-muted)] mb-2">
            <span>Core: <span className="text-white font-semibold">{corePercentage}%</span></span>
            <span className="text-[var(--neutral)]">35-60%</span>
          </div>
          <input
            type="range"
            min={35}
            max={60}
            value={corePercentage}
            onChange={(e) => setCorePercentage(parseInt(e.target.value, 10))}
            className="w-full h-2 rounded-lg appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, var(--bitcoin) 0%, var(--bitcoin) ${((corePercentage - 35) / 25) * 100}%, rgba(255,255,255,0.1) ${((corePercentage - 35) / 25) * 100}%, rgba(255,255,255,0.1) 100%)`
            }}
          />
        </div>
      )}

      {/* Allocation display */}
      {isValidAge(age) && (
        <AllocationDisplay
          allocation={allocation}
          isDetailed={isDetailed}
          subAllocations={subAllocations}
        />
      )}

      {/* Sub-allocation selector (only in simple view) */}
      {!isDetailed && isValidAge(age) && (
        <SubAllocationSelector
          subAllocations={subAllocations}
          onChange={handleSubAllocationsChange}
          goldAmount={allocation.goldAmount}
          btcAmount={allocation.btcAmount}
        />
      )}

      {/* Formula hint */}
      <p className="text-xs text-[var(--neutral)] mt-5 text-center">
        Gold% = Age + 15 &nbsp;|&nbsp; BTC% = 100 - Gold%
      </p>
    </div>
  );
}
