"use client";

import { useState, useMemo } from "react";
import {
  calculatePortfolioHistory,
  earliestYear,
  latestYear,
} from "@/data/historicalPrices";
import { formatCurrency } from "@/lib/allocation";
import PerformanceChart from "./PerformanceChart";

interface HistoricalCalculatorProps {
  goldPercentage: number;
  btcPercentage: number;
}

export default function HistoricalCalculator({
  goldPercentage,
  btcPercentage,
}: HistoricalCalculatorProps) {
  const [investmentAmount, setInvestmentAmount] = useState<string>("10,000");
  const [startYear, setStartYear] = useState<number>(2015);

  const investmentNum = investmentAmount
    ? parseFloat(investmentAmount.replace(/,/g, ""))
    : 0;

  const portfolioHistory = useMemo(() => {
    if (!investmentNum || investmentNum <= 0) return [];
    return calculatePortfolioHistory(
      investmentNum,
      startYear,
      goldPercentage,
      btcPercentage
    );
  }, [investmentNum, startYear, goldPercentage, btcPercentage]);

  const formatInput = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, "");
    if (numericValue === "") return "";
    const num = parseInt(numericValue, 10);
    return num.toLocaleString();
  };

  const years = [];
  for (let y = earliestYear; y <= latestYear - 1; y++) {
    years.push(y);
  }

  const finalData = portfolioHistory[portfolioHistory.length - 1];
  const mattisonReturn = finalData
    ? ((finalData.mattisonValue - investmentNum) / investmentNum) * 100
    : 0;
  const sp500Return = finalData
    ? ((finalData.sp500Value - investmentNum) / investmentNum) * 100
    : 0;

  return (
    <div className="premium-card rounded-xl flex flex-col">
      {/* Header with inline inputs */}
      <div className="p-4 border-b border-[var(--card-border)]">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-lg font-semibold text-white">Historical Performance</h2>
          <div className="flex items-center gap-2 ml-auto">
            <div className="relative">
              <span className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-[var(--neutral)] text-xs">$</span>
              <input
                type="text"
                value={investmentAmount}
                onChange={(e) => setInvestmentAmount(formatInput(e.target.value))}
                className="premium-input w-24 pl-5 pr-2 py-1.5 text-sm rounded-lg"
                placeholder="10,000"
              />
            </div>
            <span className="text-xs text-[var(--neutral)]">from</span>
            <select
              value={startYear}
              onChange={(e) => setStartYear(parseInt(e.target.value, 10))}
              className="premium-input px-2 py-1.5 text-sm rounded-lg cursor-pointer"
            >
              {years.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="p-4">
        <div style={{ height: 260 }}>
          <PerformanceChart data={portfolioHistory} />
        </div>
      </div>

      {/* Results bar */}
      {finalData && (
        <div className="grid grid-cols-2 divide-x divide-[var(--card-border)] border-t border-[var(--card-border)]">
          <div className="p-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-[rgba(247,147,26,0.1)] to-transparent" />
            <div className="relative">
              <div className="flex items-baseline justify-between">
                <span className="text-xs text-[var(--foreground-muted)]">Mattison</span>
                <span className={`text-sm font-bold ${mattisonReturn >= 0 ? "text-[var(--accent-success)] glow-success" : "text-[var(--accent-danger)] glow-danger"}`}>
                  {mattisonReturn >= 0 ? "+" : ""}{mattisonReturn.toFixed(0)}%
                </span>
              </div>
              <p className="text-2xl font-bold text-white mt-1 number-large">{formatCurrency(finalData.mattisonValue)}</p>
            </div>
          </div>
          <div className="p-4">
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-[var(--foreground-muted)]">S&P 500</span>
              <span className={`text-sm font-bold ${sp500Return >= 0 ? "text-[var(--accent-success)]" : "text-[var(--accent-danger)]"}`}>
                {sp500Return >= 0 ? "+" : ""}{sp500Return.toFixed(0)}%
              </span>
            </div>
            <p className="text-2xl font-bold text-white mt-1 number-large">{formatCurrency(finalData.sp500Value)}</p>
          </div>
        </div>
      )}
    </div>
  );
}
