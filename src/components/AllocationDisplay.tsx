"use client";

import { AllocationResult, DetailedAllocation, formatCurrency, formatPercentage } from "@/lib/allocation";
import { BitcoinIcon, GoldIcon } from "@/components/icons";

interface AllocationDisplayProps {
  allocation: AllocationResult | DetailedAllocation;
  isDetailed: boolean;
}

function isDetailedAllocation(allocation: AllocationResult | DetailedAllocation): allocation is DetailedAllocation {
  return "corePercentage" in allocation;
}

export default function AllocationDisplay({ allocation, isDetailed }: AllocationDisplayProps) {
  const { goldPercentage, btcPercentage, goldAmount, btcAmount } = allocation;

  return (
    <div className="space-y-5">
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
    </div>
  );
}
