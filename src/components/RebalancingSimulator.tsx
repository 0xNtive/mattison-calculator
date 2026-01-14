"use client";

import { useState, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  simulateRebalancing,
  RebalanceFrequency,
  formatCurrency,
} from "@/lib/allocation";
import { historicalPrices, earliestYear } from "@/data/historicalPrices";

interface RebalancingSimulatorProps {
  goldPercentage: number;
  btcPercentage: number;
}

const FREQUENCY_OPTIONS: { value: RebalanceFrequency; label: string }[] = [
  { value: "none", label: "Buy & Hold" },
  { value: "annual", label: "Annual" },
  { value: "quarterly", label: "Quarterly" },
  { value: "monthly", label: "Monthly" },
];

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: number;
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="premium-card px-4 py-3 rounded-xl text-xs">
        <p className="font-semibold text-white mb-2">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="flex items-center justify-between gap-4">
            <span className="text-[var(--foreground-muted)]">{entry.name}:</span>
            <span className="font-semibold" style={{ color: entry.color }}>
              {formatCurrency(entry.value)}
            </span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function RebalancingSimulator({
  goldPercentage,
  btcPercentage,
}: RebalancingSimulatorProps) {
  const [frequency, setFrequency] = useState<RebalanceFrequency>("annual");
  const [startYear, setStartYear] = useState(2015);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const initialInvestment = 10000;

  const result = useMemo(
    () =>
      simulateRebalancing(
        initialInvestment,
        goldPercentage,
        btcPercentage,
        historicalPrices,
        frequency,
        startYear
      ),
    [goldPercentage, btcPercentage, frequency, startYear]
  );

  const formatYAxis = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    return `$${value}`;
  };

  const availableYears = historicalPrices
    .filter((p) => p.year >= earliestYear && p.year <= 2020)
    .map((p) => p.year);

  return (
    <div className="premium-card rounded-xl overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          <svg
            className="w-5 h-5 text-[var(--foreground-muted)]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          <h3 className="text-sm font-semibold text-white">Rebalancing Simulator</h3>
        </div>
        <svg
          className={`w-5 h-5 text-[var(--foreground-muted)] transition-transform ${
            isCollapsed ? "" : "rotate-180"
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {!isCollapsed && (
        <div className="px-4 pb-4 space-y-4">
          {/* Controls */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-xs text-[var(--foreground-muted)]">Frequency:</label>
              <div className="flex gap-1">
                {FREQUENCY_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setFrequency(option.value)}
                    className={`px-3 py-1.5 text-xs rounded-lg transition-all ${
                      frequency === option.value
                        ? "bg-[var(--bitcoin)] text-black font-semibold"
                        : "bg-white/5 text-[var(--foreground-muted)] hover:bg-white/10"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-xs text-[var(--foreground-muted)]">Start Year:</label>
              <select
                value={startYear}
                onChange={(e) => setStartYear(parseInt(e.target.value, 10))}
                className="premium-input px-3 py-1.5 text-xs rounded-lg"
              >
                {availableYears.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Chart */}
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={result.dataPoints}
                margin={{ top: 10, right: 10, left: 0, bottom: 5 }}
              >
                <defs>
                  <linearGradient id="rebalancedGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.06)"
                  vertical={false}
                />
                <XAxis
                  dataKey="year"
                  tick={{ fill: "#71717a", fontSize: 10 }}
                  tickLine={false}
                  axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                />
                <YAxis
                  tickFormatter={formatYAxis}
                  tick={{ fill: "#71717a", fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                  width={50}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }}
                  iconType="circle"
                  iconSize={8}
                />
                <Line
                  type="monotone"
                  dataKey="rebalancedValue"
                  name="Rebalanced"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, fill: "#10b981" }}
                />
                <Line
                  type="monotone"
                  dataKey="buyHoldValue"
                  name="Buy & Hold"
                  stroke="#71717a"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                  activeDot={{ r: 4, fill: "#71717a" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Results summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <div className="glass-card rounded-lg p-2 text-center">
              <p className="text-[10px] text-[var(--foreground-muted)] mb-0.5">Rebalanced</p>
              <p className="text-sm font-semibold text-[#10b981]">
                {formatCurrency(result.finalRebalanced)}
              </p>
            </div>
            <div className="glass-card rounded-lg p-2 text-center">
              <p className="text-[10px] text-[var(--foreground-muted)] mb-0.5">Buy &amp; Hold</p>
              <p className="text-sm font-semibold text-white">
                {formatCurrency(result.finalBuyHold)}
              </p>
            </div>
            <div className="glass-card rounded-lg p-2 text-center">
              <p className="text-[10px] text-[var(--foreground-muted)] mb-0.5">Difference</p>
              <p
                className={`text-sm font-semibold ${
                  result.differencePercent >= 0 ? "text-[#10b981]" : "text-red-400"
                }`}
              >
                {result.differencePercent >= 0 ? "+" : ""}
                {result.differencePercent}%
              </p>
            </div>
            <div className="glass-card rounded-lg p-2 text-center">
              <p className="text-[10px] text-[var(--foreground-muted)] mb-0.5">Rebalances</p>
              <p className="text-sm font-semibold text-white">{result.totalRebalanceEvents}</p>
            </div>
          </div>

          {/* Educational context */}
          <div className="glass-card rounded-lg p-3 text-xs text-[var(--foreground-muted)]">
            <p className="font-semibold text-white mb-1">Why Rebalancing Matters</p>
            <p>
              Rebalancing periodically restores your portfolio to its target allocation, selling
              winners and buying underperformers. This enforces a &quot;buy low, sell high&quot;
              discipline. With volatile assets like Bitcoin and Gold,{" "}
              {frequency === "none" ? (
                "buy-and-hold lets winners run but increases concentration risk."
              ) : (
                <>
                  {frequency} rebalancing captured{" "}
                  <span
                    className={
                      result.differencePercent >= 0 ? "text-[#10b981]" : "text-red-400"
                    }
                  >
                    {Math.abs(result.differencePercent)}%{" "}
                    {result.differencePercent >= 0 ? "more" : "less"}
                  </span>{" "}
                  than buy-and-hold since {startYear}.
                </>
              )}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
