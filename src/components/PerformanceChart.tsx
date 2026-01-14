"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatCurrency } from "@/lib/allocation";
import { BitcoinIcon, GoldIcon } from "@/components/icons";

interface ChartDataPoint {
  year: number;
  mattisonValue: number;
  sp500Value: number;
}

interface PerformanceChartProps {
  data: ChartDataPoint[];
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
        <p className="font-semibold text-white mb-2">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="flex items-center justify-between gap-4" style={{ color: entry.color }}>
            <span className="text-[var(--foreground-muted)]">{entry.name}:</span>
            <span className="font-semibold">{formatCurrency(entry.value)}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function PerformanceChart({ data }: PerformanceChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-[var(--neutral)] text-sm">
        Enter investment details to see chart
      </div>
    );
  }

  const formatYAxis = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    return `$${value}`;
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <defs>
              <linearGradient id="mattisonGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#F7931A" stopOpacity={0.4} />
                <stop offset="50%" stopColor="#F7931A" stopOpacity={0.15} />
                <stop offset="100%" stopColor="#F7931A" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="sp500Gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#71717a" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#71717a" stopOpacity={0} />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
            <XAxis
              dataKey="year"
              tick={{ fill: "#71717a", fontSize: 11 }}
              tickLine={false}
              axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
            />
            <YAxis
              tickFormatter={formatYAxis}
              tick={{ fill: "#71717a", fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              width={55}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="mattisonValue"
              name="Mattison"
              stroke="#F7931A"
              strokeWidth={2.5}
              fill="url(#mattisonGradient)"
              filter="url(#glow)"
            />
            <Area
              type="monotone"
              dataKey="sp500Value"
              name="S&P 500"
              stroke="#71717a"
              strokeWidth={1.5}
              fill="url(#sp500Gradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      {/* Custom Legend with Icons */}
      <div className="flex justify-center gap-6 pt-3">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <BitcoinIcon size={14} />
            <GoldIcon size={14} />
          </div>
          <span className="text-xs text-[var(--foreground-muted)]">Mattison</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[var(--neutral)]" />
          <span className="text-xs text-[var(--foreground-muted)]">S&P 500</span>
        </div>
      </div>
    </div>
  );
}
