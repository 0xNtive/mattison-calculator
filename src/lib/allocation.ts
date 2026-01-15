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

// Rebalancing simulation types and calculations
export type RebalanceFrequency = "none" | "annual" | "quarterly" | "monthly";

export interface RebalanceDataPoint {
  year: number;
  rebalancedValue: number;
  buyHoldValue: number;
}

export interface RebalanceResult {
  dataPoints: RebalanceDataPoint[];
  finalRebalanced: number;
  finalBuyHold: number;
  differencePercent: number;
  totalRebalanceEvents: number;
}

/**
 * Simulate portfolio performance with different rebalancing strategies.
 * Compares rebalanced portfolio vs buy-and-hold.
 */
export function simulateRebalancing(
  initialInvestment: number,
  goldPercentage: number,
  btcPercentage: number,
  priceData: { year: number; gold: number; bitcoin: number }[],
  frequency: RebalanceFrequency,
  startYear: number
): RebalanceResult {
  const startData = priceData.find(p => p.year === startYear);
  if (!startData) {
    return {
      dataPoints: [],
      finalRebalanced: initialInvestment,
      finalBuyHold: initialInvestment,
      differencePercent: 0,
      totalRebalanceEvents: 0,
    };
  }

  // Buy and hold - initial purchase
  const buyHoldGoldUnits = (initialInvestment * goldPercentage / 100) / startData.gold;
  const buyHoldBtcUnits = (initialInvestment * btcPercentage / 100) / startData.bitcoin;

  // Rebalanced portfolio - starts with same allocation
  let rebalancedGoldUnits = buyHoldGoldUnits;
  let rebalancedBtcUnits = buyHoldBtcUnits;
  let rebalanceEvents = 0;

  const dataPoints: RebalanceDataPoint[] = [];
  const relevantData = priceData.filter(p => p.year >= startYear);

  // Determine rebalance frequency in months
  const rebalanceMonths = frequency === "annual" ? 12 : frequency === "quarterly" ? 3 : frequency === "monthly" ? 1 : 0;

  for (let i = 0; i < relevantData.length; i++) {
    const data = relevantData[i];

    // Calculate buy-and-hold value
    const buyHoldValue = buyHoldGoldUnits * data.gold + buyHoldBtcUnits * data.bitcoin;

    // Calculate rebalanced value before any rebalancing
    const rebalancedValue = rebalancedGoldUnits * data.gold + rebalancedBtcUnits * data.bitcoin;

    dataPoints.push({
      year: data.year,
      rebalancedValue: Math.round(rebalancedValue),
      buyHoldValue: Math.round(buyHoldValue),
    });

    // Check if we should rebalance at this point (simulating year-end rebalancing)
    // Since we only have yearly data, we approximate based on frequency
    if (frequency !== "none" && i < relevantData.length - 1) {
      // Calculate how many rebalance events per year
      const eventsPerYear = 12 / rebalanceMonths;

      // Simulate rebalancing by resetting to target allocation
      const targetGoldValue = rebalancedValue * goldPercentage / 100;
      const targetBtcValue = rebalancedValue * btcPercentage / 100;

      rebalancedGoldUnits = targetGoldValue / data.gold;
      rebalancedBtcUnits = targetBtcValue / data.bitcoin;
      rebalanceEvents += eventsPerYear;
    }
  }

  const finalData = dataPoints[dataPoints.length - 1];
  const finalRebalanced = finalData?.rebalancedValue || initialInvestment;
  const finalBuyHold = finalData?.buyHoldValue || initialInvestment;
  const differencePercent = finalBuyHold > 0
    ? ((finalRebalanced - finalBuyHold) / finalBuyHold) * 100
    : 0;

  return {
    dataPoints,
    finalRebalanced,
    finalBuyHold,
    differencePercent: Math.round(differencePercent * 10) / 10,
    totalRebalanceEvents: Math.round(rebalanceEvents),
  };
}

// Strategy comparison types and calculations
export type StrategyType = "mattison" | "60_40" | "all_weather" | "sp500" | "bitcoin" | "gold";

export interface StrategyInfo {
  id: StrategyType;
  name: string;
  description: string;
  color: string;
  allocation?: {
    stocks?: number;
    bonds?: number;
    gold?: number;
    bitcoin?: number;
    commodities?: number;
  };
}

export const STRATEGIES: StrategyInfo[] = [
  {
    id: "mattison",
    name: "Mattison",
    description: "Age-based Gold & Bitcoin allocation formula.",
    color: "#F7931A",
    allocation: { gold: 50, bitcoin: 50 }, // Will be dynamic based on age
  },
  {
    id: "60_40",
    name: "60/40",
    description: "60% stocks, 40% bonds allocation.",
    color: "#3b82f6",
    allocation: { stocks: 60, bonds: 40 },
  },
  {
    id: "all_weather",
    name: "All-Weather",
    description: "30% stocks, 40% bonds, 15% gold, 15% commodities.",
    color: "#8b5cf6",
    allocation: { stocks: 30, bonds: 40, gold: 15, commodities: 15 },
  },
  {
    id: "sp500",
    name: "100% S&P 500",
    description: "100% US large-cap equity exposure.",
    color: "#22c55e",
    allocation: { stocks: 100 },
  },
  {
    id: "bitcoin",
    name: "100% Bitcoin",
    description: "100% Bitcoin allocation.",
    color: "#f97316",
    allocation: { bitcoin: 100 },
  },
  {
    id: "gold",
    name: "100% Gold",
    description: "100% precious metals allocation.",
    color: "#FFD700",
    allocation: { gold: 100 },
  },
];

export interface StrategyDataPoint {
  year: number;
  [key: string]: number; // Dynamic keys for each strategy
}

export interface StrategyMetrics {
  strategyId: StrategyType;
  totalReturn: number;
  annualizedReturn: number;
  maxDrawdown: number;
  volatility: number;
  finalValue: number;
}

export interface StrategyComparisonResult {
  dataPoints: StrategyDataPoint[];
  metrics: StrategyMetrics[];
}

/**
 * Calculate portfolio value for a given strategy at each year
 */
function calculateStrategyValue(
  strategy: StrategyInfo,
  initialInvestment: number,
  priceData: { year: number; gold: number; bitcoin: number; sp500: number; bonds: number }[],
  startYear: number,
  mattisonGoldPct?: number,
  mattisonBtcPct?: number
): number[] {
  const startData = priceData.find(p => p.year === startYear);
  if (!startData) return [];

  const alloc = strategy.allocation || {};
  let goldPct = alloc.gold || 0;
  let btcPct = alloc.bitcoin || 0;
  const stocksPct = alloc.stocks || 0;
  const bondsPct = alloc.bonds || 0;
  const commoditiesPct = alloc.commodities || 0; // Treat as gold for simplicity

  // For Mattison, use dynamic allocation
  if (strategy.id === "mattison" && mattisonGoldPct !== undefined && mattisonBtcPct !== undefined) {
    goldPct = mattisonGoldPct;
    btcPct = mattisonBtcPct;
  }

  // Treat commodities as gold for simplicity
  const effectiveGoldPct = goldPct + commoditiesPct;

  // Calculate units purchased
  const goldUnits = (initialInvestment * effectiveGoldPct / 100) / startData.gold;
  const btcUnits = (initialInvestment * btcPct / 100) / startData.bitcoin;
  const stockUnits = (initialInvestment * stocksPct / 100) / startData.sp500;
  const bondUnits = (initialInvestment * bondsPct / 100) / startData.bonds;

  const values: number[] = [];
  const relevantData = priceData.filter(p => p.year >= startYear);

  for (const data of relevantData) {
    const goldValue = goldUnits * data.gold;
    const btcValue = btcUnits * data.bitcoin;
    const stockValue = stockUnits * data.sp500;
    const bondValue = bondUnits * data.bonds;
    const totalValue = goldValue + btcValue + stockValue + bondValue;
    values.push(Math.round(totalValue));
  }

  return values;
}

/**
 * Calculate max drawdown from a series of values
 */
function calculateMaxDrawdown(values: number[]): number {
  let maxDrawdown = 0;
  let peak = values[0];

  for (const value of values) {
    if (value > peak) {
      peak = value;
    }
    const drawdown = (peak - value) / peak;
    if (drawdown > maxDrawdown) {
      maxDrawdown = drawdown;
    }
  }

  return Math.round(maxDrawdown * 100 * 10) / 10;
}

/**
 * Calculate volatility (standard deviation of annual returns)
 */
function calculateVolatility(values: number[]): number {
  if (values.length < 2) return 0;

  const returns: number[] = [];
  for (let i = 1; i < values.length; i++) {
    const annualReturn = (values[i] - values[i - 1]) / values[i - 1];
    returns.push(annualReturn);
  }

  const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
  const squaredDiffs = returns.map(r => Math.pow(r - mean, 2));
  const variance = squaredDiffs.reduce((a, b) => a + b, 0) / returns.length;
  const stdDev = Math.sqrt(variance);

  return Math.round(stdDev * 100 * 10) / 10;
}

/**
 * Compare multiple investment strategies over historical data
 */
export function compareStrategies(
  selectedStrategies: StrategyType[],
  initialInvestment: number,
  priceData: { year: number; gold: number; bitcoin: number; sp500: number; bonds: number }[],
  startYear: number,
  mattisonGoldPct: number,
  mattisonBtcPct: number
): StrategyComparisonResult {
  const years = priceData.filter(p => p.year >= startYear).map(p => p.year);
  const strategyValues: { [key: string]: number[] } = {};

  // Calculate values for each selected strategy
  for (const strategyId of selectedStrategies) {
    const strategy = STRATEGIES.find(s => s.id === strategyId);
    if (!strategy) continue;

    strategyValues[strategyId] = calculateStrategyValue(
      strategy,
      initialInvestment,
      priceData,
      startYear,
      mattisonGoldPct,
      mattisonBtcPct
    );
  }

  // Build data points
  const dataPoints: StrategyDataPoint[] = years.map((year, index) => {
    const point: StrategyDataPoint = { year };
    for (const strategyId of selectedStrategies) {
      point[strategyId] = strategyValues[strategyId]?.[index] || 0;
    }
    return point;
  });

  // Calculate metrics for each strategy
  const metrics: StrategyMetrics[] = selectedStrategies.map(strategyId => {
    const values = strategyValues[strategyId] || [];
    const finalValue = values[values.length - 1] || initialInvestment;
    const totalReturn = ((finalValue - initialInvestment) / initialInvestment) * 100;
    const yearsCount = years.length - 1;
    const annualizedReturn = yearsCount > 0
      ? (Math.pow(finalValue / initialInvestment, 1 / yearsCount) - 1) * 100
      : 0;

    return {
      strategyId,
      totalReturn: Math.round(totalReturn),
      annualizedReturn: Math.round(annualizedReturn * 10) / 10,
      maxDrawdown: calculateMaxDrawdown(values),
      volatility: calculateVolatility(values),
      finalValue,
    };
  });

  return { dataPoints, metrics };
}
