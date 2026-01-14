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
  compareStrategies,
  STRATEGIES,
  StrategyType,
  StrategyInfo,
  formatCurrency,
} from "@/lib/allocation";
import { historicalPrices, earliestYear } from "@/data/historicalPrices";

interface StrategyComparisonProps {
  goldPercentage: number;
  btcPercentage: number;
}

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string; dataKey: string }>;
  label?: number;
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="premium-card px-4 py-3 rounded-xl text-xs max-w-xs">
        <p className="font-semibold text-white mb-2">{label}</p>
        {payload.map((entry, index) => {
          const strategy = STRATEGIES.find((s) => s.id === entry.dataKey);
          return (
            <p key={index} className="flex items-center justify-between gap-4">
              <span className="text-[var(--foreground-muted)]">{strategy?.name || entry.name}:</span>
              <span className="font-semibold" style={{ color: entry.color }}>
                {formatCurrency(entry.value)}
              </span>
            </p>
          );
        })}
      </div>
    );
  }
  return null;
};

export default function StrategyComparison({
  goldPercentage,
  btcPercentage,
}: StrategyComparisonProps) {
  const [selectedStrategies, setSelectedStrategies] = useState<StrategyType[]>([
    "mattison",
    "60_40",
    "sp500",
  ]);
  const [startYear, setStartYear] = useState(2015);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const initialInvestment = 10000;

  const result = useMemo(
    () =>
      compareStrategies(
        selectedStrategies,
        initialInvestment,
        historicalPrices,
        startYear,
        goldPercentage,
        btcPercentage
      ),
    [selectedStrategies, startYear, goldPercentage, btcPercentage]
  );

  const toggleStrategy = (strategyId: StrategyType) => {
    setSelectedStrategies((prev) => {
      if (prev.includes(strategyId)) {
        if (prev.length <= 1) return prev; // Keep at least one
        return prev.filter((s) => s !== strategyId);
      }
      return [...prev, strategyId];
    });
  };

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
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
          <h3 className="text-sm font-semibold text-white">Strategy Comparison</h3>
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
          {/* Strategy selector */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs text-[var(--foreground-muted)]">Select strategies:</label>
              <div className="flex items-center gap-2">
                <label className="text-xs text-[var(--foreground-muted)]">Since:</label>
                <select
                  value={startYear}
                  onChange={(e) => setStartYear(parseInt(e.target.value, 10))}
                  className="premium-input px-2 py-1 text-xs rounded-lg"
                >
                  {availableYears.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {STRATEGIES.map((strategy: StrategyInfo) => (
                <button
                  key={strategy.id}
                  onClick={() => toggleStrategy(strategy.id)}
                  className={`px-3 py-1.5 text-xs rounded-lg transition-all border ${
                    selectedStrategies.includes(strategy.id)
                      ? "border-white/20 font-semibold"
                      : "border-transparent bg-white/5 text-[var(--foreground-muted)] hover:bg-white/10"
                  }`}
                  style={{
                    backgroundColor: selectedStrategies.includes(strategy.id)
                      ? `${strategy.color}20`
                      : undefined,
                    color: selectedStrategies.includes(strategy.id) ? strategy.color : undefined,
                  }}
                  title={strategy.description}
                >
                  {strategy.name}
                </button>
              ))}
            </div>
          </div>

          {/* Chart */}
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={result.dataPoints}
                margin={{ top: 10, right: 10, left: 0, bottom: 5 }}
              >
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
                  wrapperStyle={{ fontSize: "10px", paddingTop: "8px" }}
                  iconType="circle"
                  iconSize={8}
                  formatter={(value) => {
                    const strategy = STRATEGIES.find((s) => s.id === value);
                    return strategy?.name || value;
                  }}
                />
                {selectedStrategies.map((strategyId) => {
                  const strategy = STRATEGIES.find((s) => s.id === strategyId);
                  return (
                    <Line
                      key={strategyId}
                      type="monotone"
                      dataKey={strategyId}
                      name={strategyId}
                      stroke={strategy?.color || "#888"}
                      strokeWidth={strategyId === "mattison" ? 2.5 : 1.5}
                      dot={false}
                      activeDot={{ r: 4 }}
                    />
                  );
                })}
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Metrics table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-2 text-[var(--foreground-muted)] font-normal">
                    Strategy
                  </th>
                  <th className="text-right py-2 text-[var(--foreground-muted)] font-normal">
                    Total Return
                  </th>
                  <th className="text-right py-2 text-[var(--foreground-muted)] font-normal hidden md:table-cell">
                    Annual
                  </th>
                  <th className="text-right py-2 text-[var(--foreground-muted)] font-normal">
                    Max DD
                  </th>
                  <th className="text-right py-2 text-[var(--foreground-muted)] font-normal hidden md:table-cell">
                    Volatility
                  </th>
                  <th className="text-right py-2 text-[var(--foreground-muted)] font-normal">
                    Final
                  </th>
                </tr>
              </thead>
              <tbody>
                {result.metrics.map((metric) => {
                  const strategy = STRATEGIES.find((s) => s.id === metric.strategyId);
                  return (
                    <tr key={metric.strategyId} className="border-b border-white/5">
                      <td className="py-2">
                        <span
                          className="font-semibold"
                          style={{ color: strategy?.color || "#fff" }}
                        >
                          {strategy?.name}
                        </span>
                      </td>
                      <td className="text-right py-2">
                        <span
                          className={metric.totalReturn >= 0 ? "text-[#10b981]" : "text-red-400"}
                        >
                          {metric.totalReturn >= 0 ? "+" : ""}
                          {metric.totalReturn}%
                        </span>
                      </td>
                      <td className="text-right py-2 hidden md:table-cell text-white">
                        {metric.annualizedReturn}%
                      </td>
                      <td className="text-right py-2 text-red-400">-{metric.maxDrawdown}%</td>
                      <td className="text-right py-2 hidden md:table-cell text-white">
                        {metric.volatility}%
                      </td>
                      <td className="text-right py-2 text-white font-semibold">
                        {formatCurrency(metric.finalValue)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Strategy descriptions */}
          <div className="glass-card rounded-lg p-3 text-xs text-[var(--foreground-muted)]">
            <p className="font-semibold text-white mb-2">Strategy Descriptions</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {selectedStrategies.map((strategyId) => {
                const strategy = STRATEGIES.find((s) => s.id === strategyId);
                if (!strategy) return null;
                return (
                  <div key={strategyId} className="flex gap-2">
                    <span
                      className="inline-block w-2 h-2 rounded-full mt-1 flex-shrink-0"
                      style={{ backgroundColor: strategy.color }}
                    />
                    <span>
                      <strong style={{ color: strategy.color }}>{strategy.name}:</strong>{" "}
                      {strategy.description}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
