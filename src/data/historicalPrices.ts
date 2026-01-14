// Historical price data (January 1st of each year)
// Gold: XAU/USD spot price
// Bitcoin: BTC/USD price
// S&P 500: Index value
// Ethereum: ETH/USD price (from 2016)
// Silver: XAG/USD spot price
// Platinum: XPT/USD spot price
// Bonds: Bloomberg US Aggregate Bond Index (normalized to 100 in 2010)

export interface PriceDataPoint {
  year: number;
  gold: number;      // Price per oz in USD
  bitcoin: number;   // Price per BTC in USD
  sp500: number;     // S&P 500 index value
  ethereum?: number; // Price per ETH in USD (available from 2016)
  silver?: number;   // Price per oz in USD
  platinum?: number; // Price per oz in USD
  bonds: number;     // Bond index value (normalized)
}

export const historicalPrices: PriceDataPoint[] = [
  { year: 2010, gold: 1096, bitcoin: 0.003, sp500: 1115, silver: 17.23, platinum: 1466, bonds: 100 },
  { year: 2011, gold: 1421, bitcoin: 0.30, sp500: 1258, silver: 30.67, platinum: 1769, bonds: 106.5 },
  { year: 2012, gold: 1566, bitcoin: 5.27, sp500: 1258, silver: 28.78, platinum: 1406, bonds: 114.0 },
  { year: 2013, gold: 1664, bitcoin: 13.30, sp500: 1426, silver: 30.35, platinum: 1557, bonds: 114.2 },
  { year: 2014, gold: 1205, bitcoin: 770, sp500: 1848, silver: 19.39, platinum: 1385, bonds: 111.9 },
  { year: 2015, gold: 1184, bitcoin: 314, sp500: 2059, silver: 15.70, platinum: 1207, bonds: 118.4 },
  { year: 2016, gold: 1061, bitcoin: 434, sp500: 2044, ethereum: 0.93, silver: 13.82, platinum: 892, bonds: 119.0 },
  { year: 2017, gold: 1151, bitcoin: 998, sp500: 2239, ethereum: 8.17, silver: 15.95, platinum: 905, bonds: 122.1 },
  { year: 2018, gold: 1303, bitcoin: 13412, sp500: 2674, ethereum: 755, silver: 17.01, platinum: 938, bonds: 126.5 },
  { year: 2019, gold: 1282, bitcoin: 3843, sp500: 2507, ethereum: 130, silver: 15.54, platinum: 795, bonds: 126.3 },
  { year: 2020, gold: 1517, bitcoin: 7200, sp500: 3231, ethereum: 129, silver: 17.85, platinum: 977, bonds: 137.4 },
  { year: 2021, gold: 1898, bitcoin: 29374, sp500: 3756, ethereum: 737, silver: 27.06, platinum: 1070, bonds: 136.6 },
  { year: 2022, gold: 1800, bitcoin: 47686, sp500: 4766, ethereum: 3683, silver: 23.35, platinum: 966, bonds: 134.8 },
  { year: 2023, gold: 1824, bitcoin: 16548, sp500: 3839, ethereum: 1196, silver: 23.95, platinum: 1070, bonds: 117.2 },
  { year: 2024, gold: 2063, bitcoin: 42258, sp500: 4770, ethereum: 2282, silver: 23.79, platinum: 1002, bonds: 123.8 },
  { year: 2025, gold: 2650, bitcoin: 94500, sp500: 5881, ethereum: 3350, silver: 29.50, platinum: 980, bonds: 125.5 },
];

// Get the earliest and latest years available
export const earliestYear = historicalPrices[0].year;
export const latestYear = historicalPrices[historicalPrices.length - 1].year;

// Helper function to get price data for a specific year
export function getPriceForYear(year: number): PriceDataPoint | undefined {
  return historicalPrices.find(p => p.year === year);
}

// Calculate portfolio value over time based on initial investment and allocation
export function calculatePortfolioHistory(
  initialInvestment: number,
  startYear: number,
  goldPercentage: number,
  btcPercentage: number
): { year: number; mattisonValue: number; sp500Value: number }[] {
  const startData = getPriceForYear(startYear);
  if (!startData) return [];

  const goldAllocation = initialInvestment * (goldPercentage / 100);
  const btcAllocation = initialInvestment * (btcPercentage / 100);

  // Calculate units purchased at start
  const goldUnits = goldAllocation / startData.gold;
  const btcUnits = btcAllocation / startData.bitcoin;
  const sp500Units = initialInvestment / startData.sp500;

  const results: { year: number; mattisonValue: number; sp500Value: number }[] = [];

  for (const priceData of historicalPrices) {
    if (priceData.year < startYear) continue;

    const goldValue = goldUnits * priceData.gold;
    const btcValue = btcUnits * priceData.bitcoin;
    const mattisonValue = goldValue + btcValue;
    const sp500Value = sp500Units * priceData.sp500;

    results.push({
      year: priceData.year,
      mattisonValue: Math.round(mattisonValue),
      sp500Value: Math.round(sp500Value),
    });
  }

  return results;
}
