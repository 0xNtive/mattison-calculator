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
      <div className="bg-white/95 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg border border-gray-200 text-xs">
        <p className="font-semibold text-gray-900 mb-1">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }}>
            {entry.name}: {formatCurrency(entry.value)}
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
      <div className="h-full flex items-center justify-center text-gray-400 text-sm">
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
                <stop offset="5%" stopColor="#F7931A" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#F7931A" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="sp500Gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6B7280" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#6B7280" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
            <XAxis
              dataKey="year"
              tick={{ fill: "#9CA3AF", fontSize: 11 }}
              tickLine={false}
              axisLine={{ stroke: "#E5E7EB" }}
            />
            <YAxis
              tickFormatter={formatYAxis}
              tick={{ fill: "#9CA3AF", fontSize: 11 }}
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
              strokeWidth={2}
              fill="url(#mattisonGradient)"
            />
            <Area
              type="monotone"
              dataKey="sp500Value"
              name="S&P 500"
              stroke="#6B7280"
              strokeWidth={1.5}
              fill="url(#sp500Gradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      {/* Custom Legend with Icons */}
      <div className="flex justify-center gap-6 pt-2">
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-1">
            <BitcoinIcon size={14} />
            <GoldIcon size={14} />
          </div>
          <span className="text-xs text-gray-600">Mattison</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-gray-500" />
          <span className="text-xs text-gray-600">S&P 500</span>
        </div>
      </div>
    </div>
  );
}
