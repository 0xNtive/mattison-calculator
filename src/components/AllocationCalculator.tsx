"use client";

import { useState, useCallback, useEffect } from "react";
import {
  calculateAllocation,
  calculateDetailedAllocation,
  MIN_AGE,
  MAX_AGE,
  isValidAge,
  AllocationResult,
  DetailedAllocation,
} from "@/lib/allocation";
import AllocationDisplay from "./AllocationDisplay";

interface AllocationCalculatorProps {
  onAgeChange?: (age: number) => void;
  onAllocationChange?: (allocation: AllocationResult) => void;
}

export default function AllocationCalculator({
  onAgeChange,
  onAllocationChange,
}: AllocationCalculatorProps) {
  const [age, setAge] = useState<number>(35);
  const [portfolioValue, setPortfolioValue] = useState<string>("");
  const [isDetailed, setIsDetailed] = useState(false);
  const [corePercentage, setCorePercentage] = useState(50);
  const [ageError, setAgeError] = useState<string>("");

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
    : calculateAllocation(age, portfolioValueNum);

  useEffect(() => {
    if (onAllocationChange && isValidAge(age)) {
      const basicAllocation = calculateAllocation(age);
      onAllocationChange(basicAllocation);
    }
  }, [age, onAllocationChange]);

  const formatPortfolioInput = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, "");
    if (numericValue === "") return "";
    const num = parseInt(numericValue, 10);
    return num.toLocaleString();
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Allocation</h2>

      {/* Inputs row */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <label htmlFor="age" className="block text-xs font-medium text-gray-500 mb-1">
            Age
          </label>
          <input
            type="number"
            id="age"
            value={age}
            onChange={(e) => handleAgeChange(e.target.value)}
            min={MIN_AGE}
            max={MAX_AGE}
            className={`w-full px-3 py-2 text-base border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
              ageError
                ? "border-red-300 focus:ring-red-200"
                : "border-gray-200 focus:ring-blue-200"
            }`}
          />
          {ageError && <p className="mt-1 text-xs text-red-500">{ageError}</p>}
        </div>

        <div>
          <label htmlFor="portfolio" className="block text-xs font-medium text-gray-500 mb-1">
            Portfolio <span className="text-gray-400">(opt.)</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">$</span>
            <input
              type="text"
              id="portfolio"
              value={portfolioValue}
              onChange={(e) => setPortfolioValue(formatPortfolioInput(e.target.value))}
              className="w-full pl-7 pr-3 py-2 text-base border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
              placeholder="10,000"
            />
          </div>
        </div>
      </div>

      {/* View toggle */}
      <div className="flex justify-center mb-4">
        <div className="inline-flex rounded-lg bg-gray-100 p-0.5 text-xs">
          <button
            onClick={() => setIsDetailed(false)}
            className={`px-3 py-1.5 rounded-md font-medium transition-all ${
              !isDetailed ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"
            }`}
          >
            Simple
          </button>
          <button
            onClick={() => setIsDetailed(true)}
            className={`px-3 py-1.5 rounded-md font-medium transition-all ${
              isDetailed ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"
            }`}
          >
            Detailed
          </button>
        </div>
      </div>

      {/* Core percentage slider (only in detailed view) */}
      {isDetailed && (
        <div className="mb-4 px-1">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Core: {corePercentage}%</span>
            <span>35-60%</span>
          </div>
          <input
            type="range"
            min={35}
            max={60}
            value={corePercentage}
            onChange={(e) => setCorePercentage(parseInt(e.target.value, 10))}
            className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
        </div>
      )}

      {/* Allocation display */}
      {isValidAge(age) && <AllocationDisplay allocation={allocation} isDetailed={isDetailed} />}

      {/* Formula hint */}
      <p className="text-xs text-gray-400 mt-4 text-center">
        Gold% = Age + 15 &nbsp;|&nbsp; BTC% = 100 - Gold%
      </p>
    </div>
  );
}
