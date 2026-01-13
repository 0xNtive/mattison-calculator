// Historical price data (January 1st of each year)
// Gold: XAU/USD spot price
// Bitcoin: BTC/USD price
// S&P 500: Index value

export interface PriceDataPoint {
  year: number;
  gold: number;      // Price per oz in USD
  bitcoin: number;   // Price per BTC in USD
  sp500: number;     // S&P 500 index value
}

export const historicalPrices: PriceDataPoint[] = [
  { year: 2010, gold: 1096, bitcoin: 0.003, sp500: 1115 },
  { year: 2011, gold: 1421, bitcoin: 0.30, sp500: 1258 },
  { year: 2012, gold: 1566, bitcoin: 5.27, sp500: 1258 },
  { year: 2013, gold: 1664, bitcoin: 13.30, sp500: 1426 },
  { year: 2014, gold: 1205, bitcoin: 770, sp500: 1848 },
  { year: 2015, gold: 1184, bitcoin: 314, sp500: 2059 },
  { year: 2016, gold: 1061, bitcoin: 434, sp500: 2044 },
  { year: 2017, gold: 1151, bitcoin: 998, sp500: 2239 },
  { year: 2018, gold: 1303, bitcoin: 13412, sp500: 2674 },
  { year: 2019, gold: 1282, bitcoin: 3843, sp500: 2507 },
  { year: 2020, gold: 1517, bitcoin: 7200, sp500: 3231 },
  { year: 2021, gold: 1898, bitcoin: 29374, sp500: 3756 },
  { year: 2022, gold: 1800, bitcoin: 47686, sp500: 4766 },
  { year: 2023, gold: 1824, bitcoin: 16548, sp500: 3839 },
  { year: 2024, gold: 2063, bitcoin: 42258, sp500: 4770 },
  { year: 2025, gold: 2650, bitcoin: 94500, sp500: 5881 },
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
