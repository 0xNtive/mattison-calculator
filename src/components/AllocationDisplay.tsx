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
    <div className="space-y-4">
      {/* Visual bar */}
      <div className="h-10 rounded-lg overflow-hidden flex shadow-inner">
        <div
          className="transition-all duration-500 ease-out flex items-center justify-center"
          style={{
            width: `${goldPercentage}%`,
            background: "linear-gradient(135deg, #FFD700 0%, #B8860B 100%)",
          }}
        >
          {goldPercentage >= 20 && (
            <span className="text-white font-bold text-sm drop-shadow-md">
              {formatPercentage(goldPercentage)}
            </span>
          )}
        </div>
        <div
          className="transition-all duration-500 ease-out flex items-center justify-center"
          style={{
            width: `${btcPercentage}%`,
            background: "linear-gradient(135deg, #F7931A 0%, #E6820F 100%)",
          }}
        >
          {btcPercentage >= 20 && (
            <span className="text-white font-bold text-sm drop-shadow-md">
              {formatPercentage(btcPercentage)}
            </span>
          )}
        </div>
      </div>

      {/* Compact allocation details */}
      <div className="grid grid-cols-2 gap-3">
        <div className="text-center p-3 bg-gradient-to-br from-yellow-50 to-amber-50 rounded-lg border border-yellow-200">
          <div className="flex items-center justify-center gap-1.5 mb-1">
            <GoldIcon size={16} />
            <p className="text-xs text-gray-500">Gold / PMs</p>
          </div>
          <p className="text-2xl font-bold text-yellow-600">{formatPercentage(goldPercentage)}</p>
          {goldAmount !== undefined && (
            <p className="text-xs text-gray-500 mt-1">{formatCurrency(goldAmount)}</p>
          )}
        </div>
        <div className="text-center p-3 bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg border border-orange-200">
          <div className="flex items-center justify-center gap-1.5 mb-1">
            <BitcoinIcon size={16} />
            <p className="text-xs text-gray-500">Bitcoin / Crypto</p>
          </div>
          <p className="text-2xl font-bold text-orange-500">{formatPercentage(btcPercentage)}</p>
          {btcAmount !== undefined && (
            <p className="text-xs text-gray-500 mt-1">{formatCurrency(btcAmount)}</p>
          )}
        </div>
      </div>

      {/* Detailed view extras */}
      {isDetailed && isDetailedAllocation(allocation) && (
        <div className="pt-3 border-t border-gray-100">
          <p className="text-xs font-medium text-gray-500 mb-2">Portfolio Structure</p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2 bg-gray-50 rounded-lg">
              <p className="text-gray-500">Core</p>
              <p className="text-lg font-bold text-gray-900">{formatPercentage(allocation.corePercentage)}</p>
              {allocation.coreGoldAmount !== undefined && allocation.coreBtcAmount !== undefined && (
                <p className="text-gray-400 mt-1">
                  {formatCurrency(allocation.coreGoldAmount + allocation.coreBtcAmount)}
                </p>
              )}
            </div>
            <div className="p-2 bg-gray-50 rounded-lg">
              <p className="text-gray-500">Satellite</p>
              <p className="text-lg font-bold text-gray-900">{formatPercentage(allocation.satellitePercentage)}</p>
              {allocation.satelliteAmount !== undefined && (
                <p className="text-gray-400 mt-1">{formatCurrency(allocation.satelliteAmount)}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
