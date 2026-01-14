"use client";

import { useState, useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceDot,
} from "recharts";
import {
  generateRetirementProjection,
  getRetirementMilestones,
  RetirementProjectionPoint,
  MAX_AGE,
} from "@/lib/allocation";
import { BitcoinIcon, GoldIcon } from "@/components/icons";

interface RetirementProjectionProps {
  currentAge: number;
}

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
        <p className="font-semibold text-white mb-2">Age {label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="flex items-center justify-between gap-4">
            <span className="text-[var(--foreground-muted)]">{entry.name}:</span>
            <span className="font-semibold" style={{ color: entry.color }}>
              {Math.round(entry.value)}%
            </span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function RetirementProjection({ currentAge }: RetirementProjectionProps) {
  const [retirementAge, setRetirementAge] = useState(
    Math.min(Math.max(currentAge + 30, 60), MAX_AGE)
  );
  const [isCollapsed, setIsCollapsed] = useState(false);

  const projectionData = useMemo(
    () => generateRetirementProjection(currentAge, retirementAge),
    [currentAge, retirementAge]
  );

  const milestones = useMemo(
    () => getRetirementMilestones(projectionData),
    [projectionData]
  );

  const handleRetirementAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= currentAge && value <= MAX_AGE) {
      setRetirementAge(value);
    }
  };

  const retirementAllocation = projectionData[projectionData.length - 1];

  return (
    <div className="premium-card rounded-xl overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <GoldIcon size={18} />
            <BitcoinIcon size={18} />
          </div>
          <h3 className="text-sm font-semibold text-white">Retirement Projection</h3>
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
          {/* Retirement age input */}
          <div className="flex items-center gap-4">
            <label className="text-xs text-[var(--foreground-muted)]">
              Target Retirement Age:
            </label>
            <input
              type="number"
              min={currentAge}
              max={MAX_AGE}
              value={retirementAge}
              onChange={handleRetirementAgeChange}
              className="premium-input w-20 px-3 py-1.5 text-sm text-center"
            />
            <span className="text-xs text-[var(--foreground-muted)]">
              ({retirementAge - currentAge} years from now)
            </span>
          </div>

          {/* Chart */}
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={projectionData} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
                <defs>
                  <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FFD700" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#FFD700" stopOpacity={0.05} />
                  </linearGradient>
                  <linearGradient id="btcGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#F7931A" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#F7931A" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
                <XAxis
                  dataKey="age"
                  tick={{ fill: "#71717a", fontSize: 10 }}
                  tickLine={false}
                  axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                  tickFormatter={(value) => `${value}`}
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fill: "#71717a", fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}%`}
                  width={40}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="goldPercentage"
                  name="Gold"
                  stackId="1"
                  stroke="#FFD700"
                  strokeWidth={2}
                  fill="url(#goldGradient)"
                />
                <Area
                  type="monotone"
                  dataKey="btcPercentage"
                  name="Bitcoin"
                  stackId="1"
                  stroke="#F7931A"
                  strokeWidth={2}
                  fill="url(#btcGradient)"
                />
                {/* Milestone markers */}
                {milestones.map((milestone: RetirementProjectionPoint, index: number) => (
                  <ReferenceDot
                    key={index}
                    x={milestone.age}
                    y={milestone.goldPercentage}
                    r={4}
                    fill="#FFD700"
                    stroke="#1a1a2e"
                    strokeWidth={2}
                  />
                ))}
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="flex justify-center gap-6">
            <div className="flex items-center gap-2">
              <GoldIcon size={14} />
              <span className="text-xs text-[var(--foreground-muted)]">Gold / Precious Metals</span>
            </div>
            <div className="flex items-center gap-2">
              <BitcoinIcon size={14} />
              <span className="text-xs text-[var(--foreground-muted)]">Bitcoin / Crypto</span>
            </div>
          </div>

          {/* Milestones */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {milestones
              .filter(m => m.milestoneLabel)
              .slice(0, 4)
              .map((milestone: RetirementProjectionPoint, index: number) => (
                <div
                  key={index}
                  className="glass-card rounded-lg p-2 text-center"
                >
                  <p className="text-[10px] text-[var(--foreground-muted)] mb-0.5">
                    {milestone.milestoneLabel}
                  </p>
                  <p className="text-xs font-semibold text-white">
                    Age {milestone.age}
                  </p>
                  <p className="text-[10px]">
                    <span className="text-[var(--gold)]">{milestone.goldPercentage}%</span>
                    {" / "}
                    <span className="text-[var(--bitcoin)]">{milestone.btcPercentage}%</span>
                  </p>
                </div>
              ))}
          </div>

          {/* Educational context */}
          <div className="glass-card rounded-lg p-3 text-xs text-[var(--foreground-muted)]">
            <p className="font-semibold text-white mb-1">Why Your Allocation Shifts</p>
            <p>
              As you approach retirement, the Mattison formula gradually increases your
              allocation to gold and precious metals. This shift reduces portfolio volatility
              and protects your wealth when you have less time to recover from market
              downturns. At age {retirementAge}, you&apos;ll hold{" "}
              <span className="text-[var(--gold)] font-semibold">
                {retirementAllocation?.goldPercentage}% Gold
              </span>{" "}
              and{" "}
              <span className="text-[var(--bitcoin)] font-semibold">
                {retirementAllocation?.btcPercentage}% Bitcoin
              </span>
              .
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
