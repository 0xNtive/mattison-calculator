"use client";

import { useMemo } from "react";
import {
  AllocationResult,
  SubAllocations,
  AllocationWithSubs,
  formatCurrency,
  formatPercentage,
} from "@/lib/allocation";
import { historicalPrices } from "@/data/historicalPrices";
import { BitcoinIcon, GoldIcon, EthereumIcon, SilverIcon, PlatinumIcon } from "@/components/icons";
import Sparkline from "./Sparkline";

interface AllocationTableProps {
  allocation: AllocationResult | AllocationWithSubs;
  subAllocations?: SubAllocations;
}

interface AssetRow {
  name: string;
  icon: React.ReactNode;
  percentage: number;
  amount?: number;
  color: string;
  sparklineData: number[];
  isSubAllocation?: boolean;
}

function hasCustomSubAllocations(subs?: SubAllocations): boolean {
  if (!subs) return false;
  return (
    subs.gold.physicalGold !== 100 ||
    subs.gold.goldEtf !== 0 ||
    subs.gold.silver !== 0 ||
    subs.gold.platinum !== 0 ||
    subs.crypto.bitcoin !== 100 ||
    subs.crypto.ethereum !== 0 ||
    subs.crypto.other !== 0
  );
}

function isAllocationWithSubs(
  allocation: AllocationResult | AllocationWithSubs
): allocation is AllocationWithSubs {
  return "subAllocations" in allocation;
}

export default function AllocationTable({
  allocation,
  subAllocations,
}: AllocationTableProps) {
  const { goldPercentage, btcPercentage, goldAmount, btcAmount } = allocation;

  // Get last 5 years of data for sparklines (normalized to 0-100)
  const sparklineData = useMemo(() => {
    const recentPrices = historicalPrices.slice(-5);

    const normalize = (values: number[]) => {
      const min = Math.min(...values);
      const max = Math.max(...values);
      const range = max - min || 1;
      return values.map(v => ((v - min) / range) * 100);
    };

    return {
      gold: normalize(recentPrices.map(p => p.gold)),
      bitcoin: normalize(recentPrices.map(p => p.bitcoin)),
      ethereum: normalize(recentPrices.filter(p => p.ethereum).map(p => p.ethereum!)),
      silver: normalize(recentPrices.map(p => p.silver!)),
      platinum: normalize(recentPrices.map(p => p.platinum!)),
    };
  }, []);

  // Build asset rows
  const rows = useMemo(() => {
    const result: AssetRow[] = [];
    const showSubs = hasCustomSubAllocations(subAllocations) && isAllocationWithSubs(allocation) && allocation.subAmounts;

    if (showSubs && subAllocations) {
      // Gold sub-allocations
      if (subAllocations.gold.physicalGold > 0) {
        result.push({
          name: "Physical Gold",
          icon: <GoldIcon size={16} />,
          percentage: (goldPercentage * subAllocations.gold.physicalGold) / 100,
          amount: allocation.subAmounts?.physicalGoldAmount,
          color: "var(--gold)",
          sparklineData: sparklineData.gold,
        });
      }
      if (subAllocations.gold.goldEtf > 0) {
        result.push({
          name: "Gold ETFs",
          icon: <GoldIcon size={16} />,
          percentage: (goldPercentage * subAllocations.gold.goldEtf) / 100,
          amount: allocation.subAmounts?.goldEtfAmount,
          color: "var(--gold)",
          sparklineData: sparklineData.gold,
        });
      }
      if (subAllocations.gold.silver > 0) {
        result.push({
          name: "Silver",
          icon: <SilverIcon size={16} />,
          percentage: (goldPercentage * subAllocations.gold.silver) / 100,
          amount: allocation.subAmounts?.silverAmount,
          color: "#C0C0C0",
          sparklineData: sparklineData.silver,
        });
      }
      if (subAllocations.gold.platinum > 0) {
        result.push({
          name: "Platinum",
          icon: <PlatinumIcon size={16} />,
          percentage: (goldPercentage * subAllocations.gold.platinum) / 100,
          amount: allocation.subAmounts?.platinumAmount,
          color: "#E5E4E2",
          sparklineData: sparklineData.platinum,
        });
      }

      // Crypto sub-allocations
      if (subAllocations.crypto.bitcoin > 0) {
        result.push({
          name: "Bitcoin",
          icon: <BitcoinIcon size={16} />,
          percentage: (btcPercentage * subAllocations.crypto.bitcoin) / 100,
          amount: allocation.subAmounts?.bitcoinAmount,
          color: "var(--bitcoin)",
          sparklineData: sparklineData.bitcoin,
        });
      }
      if (subAllocations.crypto.ethereum > 0) {
        result.push({
          name: "Ethereum",
          icon: <EthereumIcon size={16} />,
          percentage: (btcPercentage * subAllocations.crypto.ethereum) / 100,
          amount: allocation.subAmounts?.ethereumAmount,
          color: "#627EEA",
          sparklineData: sparklineData.ethereum,
        });
      }
      if (subAllocations.crypto.other > 0) {
        result.push({
          name: "Other Crypto",
          icon: <span className="w-4 h-4 rounded-full bg-[#8B5CF6]" />,
          percentage: (btcPercentage * subAllocations.crypto.other) / 100,
          amount: allocation.subAmounts?.otherCryptoAmount,
          color: "#8B5CF6",
          sparklineData: sparklineData.bitcoin, // Use BTC data as proxy
        });
      }
    } else {
      // Standard view: just Gold and BTC
      result.push({
        name: "Gold / PMs",
        icon: <GoldIcon size={16} />,
        percentage: goldPercentage,
        amount: goldAmount,
        color: "var(--gold)",
        sparklineData: sparklineData.gold,
      });
      result.push({
        name: "Bitcoin / Crypto",
        icon: <BitcoinIcon size={16} />,
        percentage: btcPercentage,
        amount: btcAmount,
        color: "var(--bitcoin)",
        sparklineData: sparklineData.bitcoin,
      });
    }

    return result;
  }, [allocation, subAllocations, goldPercentage, btcPercentage, goldAmount, btcAmount, sparklineData]);

  return (
    <div className="space-y-3">
      {/* Desktop table view */}
      <div className="hidden md:block overflow-hidden rounded-xl glass">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--card-border)]">
              <th className="text-left text-xs text-[var(--foreground-muted)] font-medium px-4 py-3">Asset</th>
              <th className="text-right text-xs text-[var(--foreground-muted)] font-medium px-4 py-3">Allocation</th>
              <th className="text-right text-xs text-[var(--foreground-muted)] font-medium px-4 py-3">Amount</th>
              <th className="text-right text-xs text-[var(--foreground-muted)] font-medium px-4 py-3">5Y Trend</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr
                key={row.name}
                className={index < rows.length - 1 ? "border-b border-[var(--card-border)]" : ""}
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {row.icon}
                    <span className="text-sm text-white font-medium">{row.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-right">
                  <span
                    className="text-lg font-bold number-large"
                    style={{ color: row.color }}
                  >
                    {formatPercentage(row.percentage)}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <span className="text-sm text-[var(--foreground-muted)] number-display">
                    {row.amount !== undefined ? formatCurrency(row.amount) : "—"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end">
                    <Sparkline data={row.sparklineData} color={row.color} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile card view */}
      <div className="md:hidden space-y-2">
        {rows.map((row) => (
          <div
            key={row.name}
            className="glass-highlight rounded-xl p-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {row.icon}
                <span className="text-sm text-white font-medium">{row.name}</span>
              </div>
              <Sparkline data={row.sparklineData} color={row.color} width={60} height={20} />
            </div>
            <div className="flex items-center justify-between mt-2">
              <span
                className="text-2xl font-bold number-large"
                style={{ color: row.color }}
              >
                {formatPercentage(row.percentage)}
              </span>
              <span className="text-sm text-[var(--foreground-muted)] number-display">
                {row.amount !== undefined ? formatCurrency(row.amount) : "—"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
