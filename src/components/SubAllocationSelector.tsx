"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import {
  SubAllocations,
  GoldSubAllocation,
  CryptoSubAllocation,
  DEFAULT_SUB_ALLOCATIONS,
  validateGoldSubAllocation,
  validateCryptoSubAllocation,
} from "@/lib/allocation";
import { GoldIcon, BitcoinIcon, EthereumIcon, SilverIcon, PlatinumIcon } from "@/components/icons";

interface SubAllocationSelectorProps {
  subAllocations: SubAllocations;
  onChange: (subs: SubAllocations) => void;
  goldAmount?: number;
  btcAmount?: number;
}

interface SliderItemProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  icon?: React.ReactNode;
  color: string;
  amount?: number;
}

function SliderItem({ label, value, onChange, icon, color, amount }: SliderItemProps) {
  return (
    <div className="flex items-center gap-3 py-2">
      <div className="flex items-center gap-2 w-24 flex-shrink-0">
        {icon && <span className="w-4 h-4 flex-shrink-0">{icon}</span>}
        <span className="text-xs text-[var(--foreground-muted)] truncate">{label}</span>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
        className="flex-1 h-1.5 rounded-lg appearance-none cursor-pointer"
        style={{
          background: `linear-gradient(to right, ${color} 0%, ${color} ${value}%, rgba(255,255,255,0.1) ${value}%, rgba(255,255,255,0.1) 100%)`,
        }}
      />
      <span className="w-12 text-right text-xs font-semibold text-white">{value}%</span>
      {amount !== undefined && value > 0 && (
        <span className="w-20 text-right text-xs text-[var(--neutral)] number-display">
          ${amount.toLocaleString()}
        </span>
      )}
    </div>
  );
}

export default function SubAllocationSelector({
  subAllocations,
  onChange,
  goldAmount,
  btcAmount,
}: SubAllocationSelectorProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [goldSub, setGoldSub] = useState<GoldSubAllocation>(subAllocations.gold);
  const [cryptoSub, setCryptoSub] = useState<CryptoSubAllocation>(subAllocations.crypto);
  const onChangeRef = useRef(onChange);

  // Keep ref updated
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  // Calculate sums and validation inline (not in state)
  const goldSum = goldSub.physicalGold + goldSub.goldEtf + goldSub.silver + goldSub.platinum;
  const cryptoSum = cryptoSub.bitcoin + cryptoSub.ethereum + cryptoSub.other;
  const goldValid = validateGoldSubAllocation(goldSub);
  const cryptoValid = validateCryptoSubAllocation(cryptoSub);
  const goldError = goldValid ? "" : `Sum: ${goldSum}% (must be 100%)`;
  const cryptoError = cryptoValid ? "" : `Sum: ${cryptoSum}% (must be 100%)`;

  const handleGoldChange = useCallback((key: keyof GoldSubAllocation, value: number) => {
    setGoldSub((prev) => {
      const newGold = { ...prev, [key]: value };
      // Check if new values are valid and notify parent
      const newSum = newGold.physicalGold + newGold.goldEtf + newGold.silver + newGold.platinum;
      if (Math.abs(newSum - 100) < 0.01) {
        // Use setTimeout to avoid calling onChange during render
        setTimeout(() => onChangeRef.current({ gold: newGold, crypto: cryptoSub }), 0);
      }
      return newGold;
    });
  }, [cryptoSub]);

  const handleCryptoChange = useCallback((key: keyof CryptoSubAllocation, value: number) => {
    setCryptoSub((prev) => {
      const newCrypto = { ...prev, [key]: value };
      // Check if new values are valid and notify parent
      const newSum = newCrypto.bitcoin + newCrypto.ethereum + newCrypto.other;
      if (Math.abs(newSum - 100) < 0.01 && goldValid) {
        // Use setTimeout to avoid calling onChange during render
        setTimeout(() => onChangeRef.current({ gold: goldSub, crypto: newCrypto }), 0);
      }
      return newCrypto;
    });
  }, [goldSub, goldValid]);

  const handleReset = useCallback(() => {
    setGoldSub(DEFAULT_SUB_ALLOCATIONS.gold);
    setCryptoSub(DEFAULT_SUB_ALLOCATIONS.crypto);
    onChangeRef.current(DEFAULT_SUB_ALLOCATIONS);
  }, []);

  // Check if any sub-allocation is different from default (pure Mattison)
  const isCustomized =
    goldSub.physicalGold !== 100 ||
    goldSub.goldEtf !== 0 ||
    goldSub.silver !== 0 ||
    goldSub.platinum !== 0 ||
    cryptoSub.bitcoin !== 100 ||
    cryptoSub.ethereum !== 0 ||
    cryptoSub.other !== 0;

  // Calculate sub-amounts
  const goldSubAmounts = goldAmount
    ? {
        physicalGold: Math.round(goldAmount * (goldSub.physicalGold / 100)),
        goldEtf: Math.round(goldAmount * (goldSub.goldEtf / 100)),
        silver: Math.round(goldAmount * (goldSub.silver / 100)),
        platinum: Math.round(goldAmount * (goldSub.platinum / 100)),
      }
    : undefined;

  const cryptoSubAmounts = btcAmount
    ? {
        bitcoin: Math.round(btcAmount * (cryptoSub.bitcoin / 100)),
        ethereum: Math.round(btcAmount * (cryptoSub.ethereum / 100)),
        other: Math.round(btcAmount * (cryptoSub.other / 100)),
      }
    : undefined;

  return (
    <div className="border-t border-[var(--card-border)] pt-4 mt-4">
      {/* Toggle header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between text-sm text-[var(--foreground-muted)] hover:text-white transition-colors"
      >
        <span className="flex items-center gap-2">
          <svg
            className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-90" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          Sub-Allocations
          {isCustomized && (
            <span className="px-1.5 py-0.5 text-[10px] rounded bg-[var(--bitcoin)] text-white">
              Custom
            </span>
          )}
        </span>
        {!isExpanded && (
          <span className="text-xs text-[var(--neutral)]">
            Customize within Gold & BTC buckets
          </span>
        )}
      </button>

      {isExpanded && (
        <div className="mt-4 space-y-5">
          {/* Gold bucket */}
          <div className="p-3 rounded-lg glass">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <GoldIcon size={16} />
                <span className="text-sm font-medium text-[var(--gold)]">Gold / Precious Metals</span>
              </div>
              <span
                className={`text-xs font-semibold ${
                  goldError ? "text-[var(--accent-danger)]" : "text-[var(--success)]"
                }`}
              >
                {goldSum}%
              </span>
            </div>
            {goldError && (
              <p className="text-xs text-[var(--accent-danger)] mb-2">{goldError}</p>
            )}
            <div className="space-y-1">
              <SliderItem
                label="Physical Gold"
                value={goldSub.physicalGold}
                onChange={(v) => handleGoldChange("physicalGold", v)}
                icon={<GoldIcon size={14} />}
                color="var(--gold)"
                amount={goldSubAmounts?.physicalGold}
              />
              <SliderItem
                label="Gold ETFs"
                value={goldSub.goldEtf}
                onChange={(v) => handleGoldChange("goldEtf", v)}
                icon={<GoldIcon size={14} />}
                color="var(--gold)"
                amount={goldSubAmounts?.goldEtf}
              />
              <SliderItem
                label="Silver"
                value={goldSub.silver}
                onChange={(v) => handleGoldChange("silver", v)}
                icon={<SilverIcon size={14} />}
                color="#C0C0C0"
                amount={goldSubAmounts?.silver}
              />
              <SliderItem
                label="Platinum"
                value={goldSub.platinum}
                onChange={(v) => handleGoldChange("platinum", v)}
                icon={<PlatinumIcon size={14} />}
                color="#E5E4E2"
                amount={goldSubAmounts?.platinum}
              />
            </div>
          </div>

          {/* Crypto bucket */}
          <div className="p-3 rounded-lg glass">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <BitcoinIcon size={16} />
                <span className="text-sm font-medium text-[var(--bitcoin)]">Bitcoin / Crypto</span>
              </div>
              <span
                className={`text-xs font-semibold ${
                  cryptoError ? "text-[var(--accent-danger)]" : "text-[var(--success)]"
                }`}
              >
                {cryptoSum}%
              </span>
            </div>
            {cryptoError && (
              <p className="text-xs text-[var(--accent-danger)] mb-2">{cryptoError}</p>
            )}
            <div className="space-y-1">
              <SliderItem
                label="Bitcoin"
                value={cryptoSub.bitcoin}
                onChange={(v) => handleCryptoChange("bitcoin", v)}
                icon={<BitcoinIcon size={14} />}
                color="var(--bitcoin)"
                amount={cryptoSubAmounts?.bitcoin}
              />
              <SliderItem
                label="Ethereum"
                value={cryptoSub.ethereum}
                onChange={(v) => handleCryptoChange("ethereum", v)}
                icon={<EthereumIcon size={14} />}
                color="#627EEA"
                amount={cryptoSubAmounts?.ethereum}
              />
              <SliderItem
                label="Other Crypto"
                value={cryptoSub.other}
                onChange={(v) => handleCryptoChange("other", v)}
                color="#8B5CF6"
                amount={cryptoSubAmounts?.other}
              />
            </div>
          </div>

          {/* Reset button */}
          {isCustomized && (
            <button
              onClick={handleReset}
              className="w-full py-2 text-xs text-[var(--foreground-muted)] hover:text-white border border-[var(--card-border)] rounded-lg transition-colors"
            >
              Reset to Pure Mattison (100% Gold / 100% BTC)
            </button>
          )}

          <p className="text-xs text-[var(--neutral)] text-center">
            Each bucket must sum to 100%
          </p>
        </div>
      )}
    </div>
  );
}
