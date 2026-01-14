// Mattison Allocation Formula
// Gold/Precious Metals % = Age + 15
// Bitcoin/Crypto % = 100 - (Age + 15)

export interface AllocationResult {
  goldPercentage: number;
  btcPercentage: number;
  goldAmount?: number;
  btcAmount?: number;
}

// Sub-allocation types for dividing Gold and BTC buckets
export interface GoldSubAllocation {
  physicalGold: number;    // Physical gold percentage within Gold bucket
  goldEtf: number;         // Gold ETFs (GLD, IAU)
  silver: number;          // Silver allocation
  platinum: number;        // Platinum allocation
}

export interface CryptoSubAllocation {
  bitcoin: number;         // BTC percentage within Crypto bucket
  ethereum: number;        // ETH percentage
  other: number;           // Other crypto
}

export interface SubAllocations {
  gold: GoldSubAllocation;
  crypto: CryptoSubAllocation;
}

export const DEFAULT_GOLD_SUB: GoldSubAllocation = {
  physicalGold: 100,
  goldEtf: 0,
  silver: 0,
  platinum: 0,
};

export const DEFAULT_CRYPTO_SUB: CryptoSubAllocation = {
  bitcoin: 100,
  ethereum: 0,
  other: 0,
};

export const DEFAULT_SUB_ALLOCATIONS: SubAllocations = {
  gold: DEFAULT_GOLD_SUB,
  crypto: DEFAULT_CRYPTO_SUB,
};

// Extended allocation result with sub-allocation amounts
export interface SubAllocationAmounts {
  // Gold bucket breakdown
  physicalGoldAmount?: number;
  goldEtfAmount?: number;
  silverAmount?: number;
  platinumAmount?: number;
  // Crypto bucket breakdown
  bitcoinAmount?: number;
  ethereumAmount?: number;
  otherCryptoAmount?: number;
}

export interface AllocationWithSubs extends AllocationResult {
  subAllocations: SubAllocations;
  subAmounts?: SubAllocationAmounts;
}

export interface DetailedAllocation extends AllocationResult {
  corePercentage: number;      // 35-60% of total portfolio
  satellitePercentage: number; // 40-65% of total portfolio
  coreGoldAmount?: number;
  coreBtcAmount?: number;
  satelliteAmount?: number;
}

export const MIN_AGE = 18;
export const MAX_AGE = 85;

export function calculateAllocation(age: number, portfolioValue?: number): AllocationResult {
  // Ensure age is within bounds
  const boundedAge = Math.min(Math.max(age, MIN_AGE), MAX_AGE);

  // Core formula
  const goldPercentage = Math.min(boundedAge + 15, 100);
  const btcPercentage = 100 - goldPercentage;

  const result: AllocationResult = {
    goldPercentage,
    btcPercentage,
  };

  // Calculate dollar amounts if portfolio value provided
  if (portfolioValue !== undefined && portfolioValue > 0) {
    result.goldAmount = Math.round(portfolioValue * (goldPercentage / 100));
    result.btcAmount = Math.round(portfolioValue * (btcPercentage / 100));
  }

  return result;
}

export function calculateDetailedAllocation(
  age: number,
  portfolioValue?: number,
  corePercentage: number = 50 // Default to 50% core allocation
): DetailedAllocation {
  const basic = calculateAllocation(age, portfolioValue);

  const satellitePercentage = 100 - corePercentage;

  const result: DetailedAllocation = {
    ...basic,
    corePercentage,
    satellitePercentage,
  };

  if (portfolioValue !== undefined && portfolioValue > 0) {
    const coreAmount = portfolioValue * (corePercentage / 100);
    result.coreGoldAmount = Math.round(coreAmount * (basic.goldPercentage / 100));
    result.coreBtcAmount = Math.round(coreAmount * (basic.btcPercentage / 100));
    result.satelliteAmount = Math.round(portfolioValue * (satellitePercentage / 100));
  }

  return result;
}

export function isValidAge(age: number): boolean {
  return Number.isInteger(age) && age >= MIN_AGE && age <= MAX_AGE;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatPercentage(value: number): string {
  return `${Math.round(value)}%`;
}

// Validate that sub-allocations sum to 100%
export function validateGoldSubAllocation(sub: GoldSubAllocation): boolean {
  const sum = sub.physicalGold + sub.goldEtf + sub.silver + sub.platinum;
  return Math.abs(sum - 100) < 0.01;
}

export function validateCryptoSubAllocation(sub: CryptoSubAllocation): boolean {
  const sum = sub.bitcoin + sub.ethereum + sub.other;
  return Math.abs(sum - 100) < 0.01;
}

export function validateSubAllocations(subs: SubAllocations): boolean {
  return validateGoldSubAllocation(subs.gold) && validateCryptoSubAllocation(subs.crypto);
}

// Calculate allocation with sub-allocation breakdown
export function calculateAllocationWithSubs(
  age: number,
  portfolioValue?: number,
  subAllocations: SubAllocations = DEFAULT_SUB_ALLOCATIONS
): AllocationWithSubs {
  const basic = calculateAllocation(age, portfolioValue);

  const result: AllocationWithSubs = {
    ...basic,
    subAllocations,
  };

  if (portfolioValue !== undefined && portfolioValue > 0 && basic.goldAmount !== undefined && basic.btcAmount !== undefined) {
    const goldAmount = basic.goldAmount;
    const btcAmount = basic.btcAmount;

    result.subAmounts = {
      // Gold bucket breakdown
      physicalGoldAmount: Math.round(goldAmount * (subAllocations.gold.physicalGold / 100)),
      goldEtfAmount: Math.round(goldAmount * (subAllocations.gold.goldEtf / 100)),
      silverAmount: Math.round(goldAmount * (subAllocations.gold.silver / 100)),
      platinumAmount: Math.round(goldAmount * (subAllocations.gold.platinum / 100)),
      // Crypto bucket breakdown
      bitcoinAmount: Math.round(btcAmount * (subAllocations.crypto.bitcoin / 100)),
      ethereumAmount: Math.round(btcAmount * (subAllocations.crypto.ethereum / 100)),
      otherCryptoAmount: Math.round(btcAmount * (subAllocations.crypto.other / 100)),
    };
  }

  return result;
}

// Retirement projection types and calculation
export interface RetirementProjectionPoint {
  age: number;
  goldPercentage: number;
  btcPercentage: number;
  isMilestone?: boolean;
  milestoneLabel?: string;
}

/**
 * Generate retirement projection data from current age to target retirement age
 */
export function generateRetirementProjection(
  currentAge: number,
  retirementAge: number
): RetirementProjectionPoint[] {
  const points: RetirementProjectionPoint[] = [];
  const boundedCurrentAge = Math.max(MIN_AGE, Math.min(currentAge, MAX_AGE));
  const boundedRetirementAge = Math.max(boundedCurrentAge, Math.min(retirementAge, MAX_AGE));

  // Milestone ages to highlight
  const milestones = [30, 40, 50, 60, 65, 70];

  for (let age = boundedCurrentAge; age <= boundedRetirementAge; age++) {
    const { goldPercentage, btcPercentage } = calculateAllocation(age);

    const isMilestone = milestones.includes(age) || age === boundedCurrentAge || age === boundedRetirementAge;
    let milestoneLabel: string | undefined;

    if (age === boundedCurrentAge) {
      milestoneLabel = "Now";
    } else if (age === boundedRetirementAge) {
      milestoneLabel = "Retirement";
    } else if (milestones.includes(age)) {
      milestoneLabel = `Age ${age}`;
    }

    points.push({
      age,
      goldPercentage,
      btcPercentage,
      isMilestone,
      milestoneLabel,
    });
  }

  return points;
}

/**
 * Get key milestones from retirement projection data
 */
export function getRetirementMilestones(
  projectionData: RetirementProjectionPoint[]
): RetirementProjectionPoint[] {
  return projectionData.filter(point => point.isMilestone);
}

// Historical performance calculation for Mattison strategy
export interface HistoricalPerformance {
  startYear: number;
  endYear: number;
  totalReturnPercent: number;
  annualizedReturnPercent: number;
}

/**
 * Calculate the historical performance of the Mattison allocation strategy
 * based on a specific age (which determines the Gold/BTC split)
 */
export function calculateMattisonPerformance(
  age: number,
  startYear: number,
  endYear: number,
  priceData: { year: number; gold: number; bitcoin: number }[]
): HistoricalPerformance | null {
  const startData = priceData.find(p => p.year === startYear);
  const endData = priceData.find(p => p.year === endYear);

  if (!startData || !endData) return null;

  const { goldPercentage, btcPercentage } = calculateAllocation(age);

  // Calculate initial allocations (assume $10,000 starting investment)
  const initialInvestment = 10000;
  const goldAllocation = initialInvestment * (goldPercentage / 100);
  const btcAllocation = initialInvestment * (btcPercentage / 100);

  // Calculate units purchased at start
  const goldUnits = goldAllocation / startData.gold;
  const btcUnits = btcAllocation / startData.bitcoin;

  // Calculate final value
  const finalGoldValue = goldUnits * endData.gold;
  const finalBtcValue = btcUnits * endData.bitcoin;
  const finalValue = finalGoldValue + finalBtcValue;

  // Calculate returns
  const totalReturnPercent = ((finalValue - initialInvestment) / initialInvestment) * 100;
  const years = endYear - startYear;
  const annualizedReturnPercent = years > 0
    ? (Math.pow(finalValue / initialInvestment, 1 / years) - 1) * 100
    : 0;

  return {
    startYear,
    endYear,
    totalReturnPercent: Math.round(totalReturnPercent),
    annualizedReturnPercent: Math.round(annualizedReturnPercent * 10) / 10,
  };
}
