"use client";

import { useState } from "react";
import {
  AllocationResult,
  DetailedAllocation,
  SubAllocations,
  AllocationWithSubs,
  formatCurrency,
  formatPercentage,
} from "@/lib/allocation";
import { BitcoinIcon, GoldIcon, EthereumIcon, SilverIcon, PlatinumIcon } from "@/components/icons";
import AllocationTable from "./AllocationTable";

type ViewMode = "chart" | "table";

interface AllocationDisplayProps {
  allocation: AllocationResult | DetailedAllocation | AllocationWithSubs;
  isDetailed: boolean;
  subAllocations?: SubAllocations;
}

function isDetailedAllocation(
  allocation: AllocationResult | DetailedAllocation | AllocationWithSubs
): allocation is DetailedAllocation {
  return "corePercentage" in allocation;
}

function isAllocationWithSubs(
  allocation: AllocationResult | DetailedAllocation | AllocationWithSubs
): allocation is AllocationWithSubs {
  return "subAllocations" in allocation;
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

export default function AllocationDisplay({ allocation, isDetailed, subAllocations }: AllocationDisplayProps) {
  const { goldPercentage, btcPercentage, goldAmount, btcAmount } = allocation;
  const [viewMode, setViewMode] = useState<ViewMode>("chart");

  return (
    <div className="space-y-5">
      {/* View toggle */}
      <div className="flex items-center justify-center gap-1 p-1 rounded-lg glass">
        <button
          onClick={() => setViewMode("chart")}
          className={`flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 ${
            viewMode === "chart"
              ? "bg-[rgba(255,255,255,0.15)] text-white"
              : "text-[var(--foreground-muted)] hover:text-white"
          }`}
        >
          <span className="flex items-center justify-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="18" rx="1" />
              <rect x="14" y="9" width="7" height="12" rx="1" />
            </svg>
            Chart
          </span>
        </button>
        <button
          onClick={() => setViewMode("table")}
          className={`flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 ${
            viewMode === "table"
              ? "bg-[rgba(255,255,255,0.15)] text-white"
              : "text-[var(--foreground-muted)] hover:text-white"
          }`}
        >
          <span className="flex items-center justify-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 3h18v18H3z" />
              <path d="M3 9h18M3 15h18M9 3v18" />
            </svg>
            Table
          </span>
        </button>
      </div>

      {/* Table view */}
      {viewMode === "table" && (
        <AllocationTable allocation={allocation} subAllocations={subAllocations} />
      )}

      {/* Chart view (original) */}
      {viewMode === "chart" && (
        <>
      {/* Visual bar */}
      <div className="h-12 rounded-xl overflow-hidden flex bg-[rgba(0,0,0,0.3)] p-1">
        <div
          className="allocation-bar-gold transition-all duration-700 ease-out flex items-center justify-center rounded-l-lg"
          style={{
            width: `${goldPercentage}%`,
          }}
        >
          {goldPercentage >= 20 && (
            <span className="text-white font-bold text-sm drop-shadow-lg">
              {formatPercentage(goldPercentage)}
            </span>
          )}
        </div>
        <div
          className="allocation-bar-bitcoin transition-all duration-700 ease-out flex items-center justify-center rounded-r-lg"
          style={{
            width: `${btcPercentage}%`,
          }}
        >
          {btcPercentage >= 20 && (
            <span className="text-white font-bold text-sm drop-shadow-lg">
              {formatPercentage(btcPercentage)}
            </span>
          )}
        </div>
      </div>

      {/* Compact allocation details */}
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center p-4 rounded-xl glass-highlight box-glow-gold">
          <div className="flex items-center justify-center gap-2 mb-2">
            <GoldIcon size={18} />
            <p className="text-xs text-[var(--foreground-muted)]">Gold / PMs</p>
          </div>
          <p className="text-3xl font-bold text-[var(--gold)] glow-gold-subtle number-large">
            {formatPercentage(goldPercentage)}
          </p>
          {goldAmount !== undefined && (
            <p className="text-sm text-[var(--foreground-muted)] mt-2 number-display">
              {formatCurrency(goldAmount)}
            </p>
          )}
        </div>
        <div className="text-center p-4 rounded-xl glass-highlight box-glow-bitcoin">
          <div className="flex items-center justify-center gap-2 mb-2">
            <BitcoinIcon size={18} />
            <p className="text-xs text-[var(--foreground-muted)]">Bitcoin / Crypto</p>
          </div>
          <p className="text-3xl font-bold text-[var(--bitcoin)] glow-bitcoin-subtle number-large">
            {formatPercentage(btcPercentage)}
          </p>
          {btcAmount !== undefined && (
            <p className="text-sm text-[var(--foreground-muted)] mt-2 number-display">
              {formatCurrency(btcAmount)}
            </p>
          )}
        </div>
      </div>

      {/* Detailed view extras */}
      {isDetailed && isDetailedAllocation(allocation) && (
        <div className="pt-4 border-t border-[var(--card-border)]">
          <p className="text-xs font-medium text-[var(--foreground-muted)] mb-3">Portfolio Structure</p>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-lg glass">
              <p className="text-[var(--foreground-muted)]">Core</p>
              <p className="text-xl font-bold text-white mt-1">{formatPercentage(allocation.corePercentage)}</p>
              {allocation.coreGoldAmount !== undefined && allocation.coreBtcAmount !== undefined && (
                <p className="text-[var(--neutral)] mt-1 number-display">
                  {formatCurrency(allocation.coreGoldAmount + allocation.coreBtcAmount)}
                </p>
              )}
            </div>
            <div className="p-3 rounded-lg glass">
              <p className="text-[var(--foreground-muted)]">Satellite</p>
              <p className="text-xl font-bold text-white mt-1">{formatPercentage(allocation.satellitePercentage)}</p>
              {allocation.satelliteAmount !== undefined && (
                <p className="text-[var(--neutral)] mt-1 number-display">{formatCurrency(allocation.satelliteAmount)}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Sub-allocation breakdown (when customized and amounts available) */}
      {!isDetailed && hasCustomSubAllocations(subAllocations) && isAllocationWithSubs(allocation) && allocation.subAmounts && (
        <div className="pt-4 border-t border-[var(--card-border)]">
          <p className="text-xs font-medium text-[var(--foreground-muted)] mb-3">Sub-Allocation Breakdown</p>
          <div className="grid grid-cols-2 gap-3">
            {/* Gold sub-allocations */}
            <div className="space-y-1.5">
              {subAllocations!.gold.physicalGold > 0 && allocation.subAmounts.physicalGoldAmount && (
                <div className="flex items-center justify-between text-xs p-2 rounded-lg glass">
                  <span className="flex items-center gap-1.5 text-[var(--foreground-muted)]">
                    <GoldIcon size={12} />
                    Physical Gold
                  </span>
                  <span className="text-[var(--gold)] font-medium number-display">
                    {formatCurrency(allocation.subAmounts.physicalGoldAmount)}
                  </span>
                </div>
              )}
              {subAllocations!.gold.goldEtf > 0 && allocation.subAmounts.goldEtfAmount && (
                <div className="flex items-center justify-between text-xs p-2 rounded-lg glass">
                  <span className="flex items-center gap-1.5 text-[var(--foreground-muted)]">
                    <GoldIcon size={12} />
                    Gold ETFs
                  </span>
                  <span className="text-[var(--gold)] font-medium number-display">
                    {formatCurrency(allocation.subAmounts.goldEtfAmount)}
                  </span>
                </div>
              )}
              {subAllocations!.gold.silver > 0 && allocation.subAmounts.silverAmount && (
                <div className="flex items-center justify-between text-xs p-2 rounded-lg glass">
                  <span className="flex items-center gap-1.5 text-[var(--foreground-muted)]">
                    <SilverIcon size={12} />
                    Silver
                  </span>
                  <span className="text-[#C0C0C0] font-medium number-display">
                    {formatCurrency(allocation.subAmounts.silverAmount)}
                  </span>
                </div>
              )}
              {subAllocations!.gold.platinum > 0 && allocation.subAmounts.platinumAmount && (
                <div className="flex items-center justify-between text-xs p-2 rounded-lg glass">
                  <span className="flex items-center gap-1.5 text-[var(--foreground-muted)]">
                    <PlatinumIcon size={12} />
                    Platinum
                  </span>
                  <span className="text-[#E5E4E2] font-medium number-display">
                    {formatCurrency(allocation.subAmounts.platinumAmount)}
                  </span>
                </div>
              )}
            </div>
            {/* Crypto sub-allocations */}
            <div className="space-y-1.5">
              {subAllocations!.crypto.bitcoin > 0 && allocation.subAmounts.bitcoinAmount && (
                <div className="flex items-center justify-between text-xs p-2 rounded-lg glass">
                  <span className="flex items-center gap-1.5 text-[var(--foreground-muted)]">
                    <BitcoinIcon size={12} />
                    Bitcoin
                  </span>
                  <span className="text-[var(--bitcoin)] font-medium number-display">
                    {formatCurrency(allocation.subAmounts.bitcoinAmount)}
                  </span>
                </div>
              )}
              {subAllocations!.crypto.ethereum > 0 && allocation.subAmounts.ethereumAmount && (
                <div className="flex items-center justify-between text-xs p-2 rounded-lg glass">
                  <span className="flex items-center gap-1.5 text-[var(--foreground-muted)]">
                    <EthereumIcon size={12} />
                    Ethereum
                  </span>
                  <span className="text-[#627EEA] font-medium number-display">
                    {formatCurrency(allocation.subAmounts.ethereumAmount)}
                  </span>
                </div>
              )}
              {subAllocations!.crypto.other > 0 && allocation.subAmounts.otherCryptoAmount && (
                <div className="flex items-center justify-between text-xs p-2 rounded-lg glass">
                  <span className="flex items-center gap-1.5 text-[var(--foreground-muted)]">
                    <span className="w-3 h-3 rounded-full bg-[#8B5CF6]" />
                    Other Crypto
                  </span>
                  <span className="text-[#8B5CF6] font-medium number-display">
                    {formatCurrency(allocation.subAmounts.otherCryptoAmount)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
        </>
      )}
    </div>
  );
}
