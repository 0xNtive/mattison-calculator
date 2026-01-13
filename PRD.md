# Product Requirements Document: Mattison Allocation Calculator

## Overview

The Mattison Allocation Calculator is a web-based tool that helps users determine their optimal portfolio allocation based on the Mattison Allocation strategy. The tool provides age-based allocation recommendations and historical performance visualization.

---

## The Mattison Allocation Strategy

### Core Allocation Formula
- **Gold/Precious Metals %** = Age + 15
- **Bitcoin/Crypto %** = 100 - (Age + 15)

### Examples
| Age | Gold/PMs | BTC/Crypto |
|-----|----------|------------|
| 20  | 35%      | 65%        |
| 35  | 50%      | 50%        |
| 50  | 65%      | 35%        |
| 70  | 85%      | 15%        |

### Portfolio Structure
- **Core Allocation**: 35-60% of total portfolio (Gold + BTC per formula above)
- **Satellite Allocation**: 40-65% of total portfolio (Equities and other assets, favoring non-USD denominated equities like EEM)

---

## Target Audience

- **Primary Users**: General public seeking portfolio allocation guidance
- **User Intent**: Education and tool sharing (viral distribution)

---

## Features

### 1. Core Allocation Calculator

#### Inputs
- **Age** (required): Integer, 18-85 range with hard limits
- **Portfolio Value** (optional): Dollar amount for personalized allocation amounts

#### Outputs
- **Simple View** (default):
  - Gold/Precious Metals percentage
  - Bitcoin/Crypto percentage
  - Visual breakdown (pie chart or bar)

- **Detailed View** (toggle):
  - Core allocation (Gold vs BTC split)
  - Satellite allocation recommendation (equities %)
  - Suggested core-to-satellite ratio (35-60% core)
  - If portfolio value provided: dollar amounts for each allocation

#### Behavior
- Instant calculation on input
- Smooth animations between view modes
- Clear visual hierarchy emphasizing the allocation percentages

---

### 2. Historical Performance Calculator

#### Inputs
- **Investment Amount**: Dollar amount (e.g., $10,000)
- **Start Year**: Dropdown/slider, 2010 to present
- **Age**: Uses current age from main calculator (or separate input)

#### Outputs
- **Final Portfolio Value**: What the investment would be worth today
- **Total Return**: Percentage and dollar gain
- **Comparison**: Side-by-side with S&P 500 performance

#### Data Sources
- **Gold**: Spot price (XAU/USD)
- **Bitcoin**: BTC/USD historical prices
- **S&P 500**: Index price for benchmark comparison

#### Assumptions
- **Rebalancing**: None (buy and hold)
- **Allocation**: Based on user's current age (not age at investment time)
- **Start Date**: January 1st of selected year

---

### 3. Performance Chart

#### Visualization
- **Chart Type**: Area chart
- **Data Series**:
  - Mattison Allocation portfolio value (primary, filled area)
  - S&P 500 benchmark (secondary line overlay)
- **Timeframe**: 2010 to present
- **Interactivity**:
  - Hover tooltips showing values at each point
  - Responsive to selected date range

#### Design
- Clean, minimal styling consistent with overall aesthetic
- Clear legend differentiating Mattison vs S&P 500
- Y-axis: Portfolio value in dollars
- X-axis: Time (years/months)

---

### 4. Shareable Results

#### Image Generation
- Generate a shareable image card containing:
  - User's age
  - Their personalized allocation (Gold % / BTC %)
  - "Mattison Allocation Calculator" branding
  - Optional: Historical return if calculated
- Optimized for social media dimensions (1200x630 for Open Graph)

#### Share Functionality
- One-click share buttons for major platforms (Twitter/X, Facebook, LinkedIn)
- Copy-to-clipboard for the generated image
- Open Graph meta tags for link previews

---

### 5. Educational Content

#### Collapsible "Learn More" Section
- Explanation of the Mattison Allocation philosophy
- Rationale behind the age-based formula
- Guidance on satellite allocation (non-USD equities like EEM)
- When to use core vs. detailed view

#### Location
- Below the main calculator
- Collapsed by default to maintain clean UI
- Expand/collapse animation

---

### 6. Financial Disclaimer

#### Requirements
- **Prominent placement**: Visible without scrolling
- **Content**: Clear "not financial advice" language
- **Styling**: Noticeable but not disruptive to UX

#### Suggested Text
> "This calculator is for educational purposes only and does not constitute financial advice. Past performance does not guarantee future results. Consult a qualified financial advisor before making investment decisions."

---

## Technical Specifications

### Recommended Tech Stack
- **Framework**: Next.js (React)
  - Rationale: SEO-friendly, excellent performance, easy Vercel deployment, good charting library ecosystem
- **Styling**: Tailwind CSS
  - Rationale: Rapid development, consistent design system, responsive by default
- **Charting**: Recharts or Chart.js
  - Rationale: React-native, customizable, good area chart support
- **Image Generation**: html-to-image or @vercel/og
  - Rationale: Server-side or client-side shareable image generation

### Hosting
- **Platform**: Vercel (primary) or Netlify (alternative)
- **Domain**: TBD

### Data Strategy
- **Option A**: Static JSON files with historical price data (updated periodically)
- **Option B**: API integration for real-time/recent data (e.g., CoinGecko for BTC, free gold price API)
- **Recommendation**: Hybrid—static historical data + API for recent prices

---

## Design Specifications

### Visual Style
- **Theme**: Clean, minimal (Apple-esque)
- **Colors**:
  - Light background with subtle grays
  - Gold accent color (#FFD700 or similar) for PM allocations
  - Orange/amber (#F7931A Bitcoin orange) for crypto allocations
  - Neutral for S&P comparison
- **Typography**: Modern sans-serif (Inter, SF Pro, or similar)
- **Spacing**: Generous whitespace, clear visual hierarchy

### Layout
```
┌─────────────────────────────────────────────────┐
│  [Disclaimer Banner]                            │
├─────────────────────────────────────────────────┤
│                                                 │
│         Mattison Allocation Calculator          │
│                                                 │
│  ┌─────────────────────────────────────────┐   │
│  │  Age: [____]   Portfolio: [____] (opt)  │   │
│  │                                         │   │
│  │  [Simple View] / [Detailed View] toggle │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  ┌─────────────────────────────────────────┐   │
│  │                                         │   │
│  │     YOUR ALLOCATION                     │   │
│  │     Gold: 50%    BTC: 50%               │   │
│  │     [Visual Breakdown]                  │   │
│  │                                         │   │
│  │     [Share Button]                      │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  ▼ Learn about the Mattison Allocation         │
│                                                 │
├─────────────────────────────────────────────────┤
│                                                 │
│         Historical Performance                  │
│                                                 │
│  ┌─────────────────────────────────────────┐   │
│  │  Amount: [____]   Start Year: [____]    │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  ┌─────────────────────────────────────────┐   │
│  │                                         │   │
│  │         [Area Chart]                    │   │
│  │    Mattison vs S&P 500 Performance      │   │
│  │                                         │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  Final Value: $XX,XXX (+XXX%)                  │
│  S&P 500:     $XX,XXX (+XXX%)                  │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Responsive Design
- Mobile-friendly but not mobile-first
- Breakpoints: Mobile (<768px), Tablet (768-1024px), Desktop (>1024px)
- Chart should resize gracefully
- Inputs stack vertically on mobile

---

## Analytics

### Implementation
- Anonymous usage analytics only (no PII collection)
- Recommended: Vercel Analytics, Plausible, or Simple Analytics

### Key Metrics to Track
- Page views
- Calculator usage (age inputs)
- Historical calculator usage
- Share button clicks
- View mode toggles (simple vs detailed)
- Time on page

---

## Constraints & Validation

### Age Input
- Minimum: 18
- Maximum: 85
- Validation: Integer only, show error for out-of-range

### Historical Data
- Earliest date: January 1, 2010
- Bitcoin data availability limits historical calculations
- Gold spot price data readily available

### Formula Boundaries
- At age 18: 33% Gold, 67% BTC
- At age 85: 100% Gold, 0% BTC (capped)
- Formula naturally caps at 100% Gold when Age + 15 ≥ 100

---

## Future Considerations (Out of Scope for V1)

- Email newsletter capture
- Dark mode toggle
- PDF/print export
- Rebalancing simulation toggle
- Age-at-investment historical calculations
- Additional benchmarks (60/40 portfolio, etc.)
- Multiple language support
- Actual trade execution integrations

---

## Success Criteria

1. **Functional**: Calculator accurately computes allocations per formula
2. **Performance**: Page loads in <2 seconds, calculations instant
3. **Shareability**: Users can generate and share allocation images
4. **Educational**: Users understand the strategy via collapsible content
5. **Compliant**: Prominent disclaimer visible on all views

---

## Open Questions

1. What domain will the site use?
2. Should historical data be updated manually (periodic) or via live API?
3. Are there specific social platforms to prioritize for sharing?
4. Is there existing brand guideline/logo to incorporate?

---

## Appendix

### Sample Historical Data Sources
- **Gold**: Kitco, GoldPrice.org API, Federal Reserve FRED
- **Bitcoin**: CoinGecko API, CoinMarketCap, Yahoo Finance
- **S&P 500**: Yahoo Finance, Alpha Vantage, FRED

### Formula Reference
```
goldAllocation = min(age + 15, 100)
btcAllocation = 100 - goldAllocation
coreAllocationRange = 35% to 60% of total portfolio
satelliteAllocationRange = 40% to 65% of total portfolio
```
