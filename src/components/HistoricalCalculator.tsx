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
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-full flex flex-col">
      {/* Header with inline inputs */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-lg font-semibold text-gray-900">Historical Performance</h2>
          <div className="flex items-center gap-2 ml-auto">
            <div className="relative">
              <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs">$</span>
              <input
                type="text"
                value={investmentAmount}
                onChange={(e) => setInvestmentAmount(formatInput(e.target.value))}
                className="w-24 pl-5 pr-2 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                placeholder="10,000"
              />
            </div>
            <span className="text-xs text-gray-400">from</span>
            <select
              value={startYear}
              onChange={(e) => setStartYear(parseInt(e.target.value, 10))}
              className="px-2 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white"
            >
              {years.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="flex-1 p-4" style={{ minHeight: 280 }}>
        <div className="h-full" style={{ height: 260 }}>
          <PerformanceChart data={portfolioHistory} />
        </div>
      </div>

      {/* Results bar */}
      {finalData && (
        <div className="grid grid-cols-2 divide-x divide-gray-100 border-t border-gray-100">
          <div className="p-3 bg-gradient-to-r from-orange-50 to-transparent">
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-gray-500">Mattison</span>
              <span className={`text-sm font-semibold ${mattisonReturn >= 0 ? "text-green-600" : "text-red-600"}`}>
                {mattisonReturn >= 0 ? "+" : ""}{mattisonReturn.toFixed(0)}%
              </span>
            </div>
            <p className="text-xl font-bold text-gray-900">{formatCurrency(finalData.mattisonValue)}</p>
          </div>
          <div className="p-3">
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-gray-500">S&P 500</span>
              <span className={`text-sm font-semibold ${sp500Return >= 0 ? "text-green-600" : "text-red-600"}`}>
                {sp500Return >= 0 ? "+" : ""}{sp500Return.toFixed(0)}%
              </span>
            </div>
            <p className="text-xl font-bold text-gray-900">{formatCurrency(finalData.sp500Value)}</p>
          </div>
        </div>
      )}
    </div>
  );
}
