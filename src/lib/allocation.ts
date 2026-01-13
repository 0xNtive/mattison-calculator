// Mattison Allocation Formula
// Gold/Precious Metals % = Age + 15
// Bitcoin/Crypto % = 100 - (Age + 15)

export interface AllocationResult {
  goldPercentage: number;
  btcPercentage: number;
  goldAmount?: number;
  btcAmount?: number;
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
