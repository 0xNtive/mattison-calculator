# Mattison Allocation Calculator - Product Requirements Document v2.0

## Overview

This document outlines the requirements for enhancing the Mattison Allocation Calculator based on user research and feedback. The primary goal is to improve visual polish, add educational depth, and enable sub-allocations while maintaining simplicity (no backend complexity).

---

## Goals & Success Metrics

### Primary Goal
**User Education** - Help people deeply understand the Mattison allocation strategy and make informed decisions about their portfolio allocation.

### Success Metrics
- Users spend more time exploring allocation options
- Increased share rate of allocation cards
- Users engage with sub-allocation features
- Positive feedback on visual improvements

### Constraints
- **Keep it simple**: No backend/database complexity
- All calculations and data remain client-side
- Static historical data (no live API dependencies for core functionality)

---

## User Research Summary

### What Users Value Most
| Aspect | Finding |
|--------|---------|
| Favorite feature | Shareable cards |
| Visual preference | Bolder & richer (premium feel, dramatic gradients) |
| Asset flexibility | Sub-allocations within Gold/BTC buckets |
| Calculation display | Table with sparklines preferred over bar charts |
| Share improvements | Asset logos + historical performance context |

### Pain Points (Current Implementation)
1. **Missing visual identity** - No Bitcoin or Gold logos/icons
2. **Underwhelming aesthetics** - Current design lacks premium feel
3. **Calculation display** - Results could be presented more elegantly
4. **Limited flexibility** - Cannot subdivide allocations (e.g., ETH within crypto)

---

## Feature Requirements

### Feature 1: Asset Logos & Icons
**Priority:** P0 (Critical)

**Description:**
Add recognizable logos for Bitcoin and Gold throughout the application to improve visual identity and instant recognition.

**Requirements:**
- [ ] Bitcoin logo (orange) displayed alongside BTC allocation
- [ ] Gold icon (gold bar or coin) displayed alongside Gold allocation
- [ ] Icons appear in: allocation display, share cards, historical chart legend
- [ ] SVG format for crisp rendering at all sizes
- [ ] Consider adding icons for sub-assets (ETH, Silver, Platinum)

**Acceptance Criteria:**
- Logos render crisply on all screen sizes
- Logos appear in shareable card images
- Consistent icon style throughout the app

---

### Feature 2: Visual Overhaul - Premium Aesthetic
**Priority:** P0 (Critical)

**Description:**
Transform the visual design to be bolder and richer with dramatic gradients, glowing effects, and a premium feel.

**Requirements:**
- [ ] Enhanced gradient backgrounds with more depth
- [ ] Subtle glow effects on key elements (allocation percentages, cards)
- [ ] Improved typography hierarchy with better contrast
- [ ] Premium card styling with shadows and borders
- [ ] Animated transitions between states
- [ ] Richer color palette while maintaining Gold/Orange brand colors

**Visual Direction:**
- Dramatic gradients (not flat colors)
- Glowing/luminous effects on important numbers
- Glass-morphism or depth effects on cards
- Premium "fintech app" aesthetic

**Acceptance Criteria:**
- Design feels noticeably more premium and polished
- Visual hierarchy clearly guides user attention
- Animations are smooth (60fps) and purposeful

---

### Feature 3: Sub-Allocation Selector
**Priority:** P1 (High)

**Description:**
Allow users to subdivide their Gold and Bitcoin allocations into specific assets while maintaining the core Mattison formula.

**Requirements:**
- [ ] Gold bucket can be split into:
  - Physical Gold
  - Gold ETFs (GLD, IAU)
  - Silver
  - Platinum
  - Mining stocks
- [ ] Bitcoin bucket can be split into:
  - Bitcoin (BTC)
  - Ethereum (ETH)
  - Other crypto (user-defined %)
- [ ] Default: 100% Gold / 100% BTC (pure Mattison)
- [ ] Sliders or input fields to adjust sub-allocation percentages
- [ ] Sub-allocations must sum to 100% within each bucket
- [ ] Visual breakdown showing sub-allocations in results

**Acceptance Criteria:**
- Sub-allocations correctly calculate dollar amounts
- UI prevents invalid allocations (>100% or <0%)
- Sub-allocation choices persist during session
- Share cards reflect sub-allocation choices

---

### Feature 4: Table with Sparklines Display
**Priority:** P1 (High)

**Description:**
Replace or supplement the current bar chart with a data-table format featuring sparklines for a more data-forward presentation.

**Requirements:**
- [ ] Table columns: Asset, Allocation %, Dollar Amount, Trend (sparkline)
- [ ] Sparklines show historical price trend for each asset
- [ ] Large, prominent numbers for allocations
- [ ] Sortable columns (optional)
- [ ] Responsive design for mobile (cards on mobile, table on desktop)
- [ ] Optional toggle between table view and visual chart view

**Acceptance Criteria:**
- Table renders correctly on all screen sizes
- Sparklines accurately reflect historical data
- Numbers are easy to read at a glance

---

### Feature 5: Enhanced Share Cards
**Priority:** P1 (High)

**Description:**
Improve shareable card images with asset logos and historical performance context.

**Requirements:**
- [ ] Include Bitcoin and Gold logos on share card
- [ ] Add mini performance indicator (e.g., "Mattison +847% since 2015")
- [ ] Show sub-allocation breakdown if configured
- [ ] Improved visual design matching new premium aesthetic
- [ ] Maintain 1200x630px dimension for social media optimization
- [ ] Optional: Multiple card templates/styles

**Acceptance Criteria:**
- Share cards include asset logos
- Historical context is accurate and clear
- Cards render correctly when shared on Twitter, Facebook, LinkedIn

---

### Feature 6: Retirement Age Projection
**Priority:** P2 (Medium)

**Description:**
Educational tool showing how the user's allocation will shift as they age toward retirement.

**Requirements:**
- [ ] Input: Current age, Target retirement age
- [ ] Output: Timeline/chart showing allocation shift over time
- [ ] Visual representation of Gold % increasing, BTC % decreasing
- [ ] Key milestones highlighted (e.g., "At 50, you'll be 65% Gold")
- [ ] Projected portfolio value based on historical returns (optional)

**Acceptance Criteria:**
- Projections correctly apply Mattison formula for each age
- Visualization clearly shows the transition over time
- Educational context explains why allocation shifts

---

### Feature 7: Rebalancing Simulator
**Priority:** P2 (Medium)

**Description:**
Show the impact of periodic rebalancing versus buy-and-hold on historical returns.

**Requirements:**
- [ ] Rebalancing frequency options: Annual, Quarterly, Monthly, None
- [ ] Chart comparing rebalanced portfolio vs. buy-and-hold
- [ ] Display final values and percentage difference
- [ ] Educational explanation of rebalancing benefits/costs
- [ ] Use existing historical price data (2010-2025)

**Acceptance Criteria:**
- Calculations accurately simulate rebalancing events
- Chart clearly distinguishes between strategies
- User understands the impact of rebalancing choices

---

### Feature 8: Strategy Comparison Mode
**Priority:** P2 (Medium)

**Description:**
Compare Mattison allocation performance against other popular portfolio strategies.

**Requirements:**
- [ ] Comparison strategies:
  - 60/40 (Stocks/Bonds)
  - All-Weather (Bridgewater-style)
  - 100% S&P 500
  - 100% Bitcoin
  - 100% Gold
- [ ] Side-by-side chart comparison
- [ ] Table showing key metrics: Total return, Max drawdown, Volatility
- [ ] Time period selector for comparison
- [ ] Educational content explaining each strategy

**Acceptance Criteria:**
- Calculations are accurate for all strategies
- Comparison is fair (same time periods, same assumptions)
- User can easily understand relative performance

---

### Feature 9: Dark Mode
**Priority:** P3 (Low)

**Description:**
Add theme toggle supporting light and dark modes with system preference detection.

**Requirements:**
- [ ] Toggle switch in header or settings
- [ ] Respect system preference by default
- [ ] Persist user choice in localStorage
- [ ] All components properly themed
- [ ] Share cards generate in appropriate theme

**Acceptance Criteria:**
- Smooth transition between themes
- All text remains readable in both modes
- Charts and visualizations adapt to theme

---

### Feature 10: PDF Export
**Priority:** P3 (Low)

**Description:**
Allow users to download a PDF report of their allocation results.

**Requirements:**
- [ ] PDF includes: Allocation breakdown, Sub-allocations, Historical chart
- [ ] Branded header/footer with disclaimer
- [ ] Print-optimized layout
- [ ] Client-side generation (no server dependency)
- [ ] Filename includes user's age for reference

**Acceptance Criteria:**
- PDF generates correctly in all browsers
- Layout is professional and readable
- File size is reasonable (<2MB)

---

## Technical Specifications

### Tech Stack (Unchanged)
- Next.js 16+ with App Router
- React 19+ with hooks
- TypeScript 5 (strict mode)
- Tailwind CSS 4
- Recharts for visualizations
- html-to-image for share cards

### New Dependencies (Proposed)
| Package | Purpose | Size Impact |
|---------|---------|-------------|
| `recharts` (existing) | Sparklines in table | None |
| `@react-pdf/renderer` | PDF generation | ~500KB (lazy loaded) |
| None | Dark mode | Built-in Tailwind |

### Data Requirements
- Existing historical price data (2010-2025) sufficient for all features
- Sub-allocation percentages stored in component state
- No new external API dependencies

---

## Design System Updates

### Color Palette (Enhanced)
```
Gold Primary:    #FFD700 (existing)
Gold Gradient:   #FFD700 → #FFA500 → #B8860B
Bitcoin Orange:  #F7931A (existing)
Bitcoin Glow:    #F7931A with 20% opacity blur
Premium Dark:    #1a1a2e → #16213e (gradient)
Premium Light:   #f8f9fa → #ffffff (gradient)
```

### Typography
- Maintain Inter font family
- Increase contrast for key numbers
- Consider tabular numbers for financial data

### Iconography
- SVG icons for all assets
- Consistent 24px base size
- Monochrome with brand color fills

---

## Out of Scope (v2.0)

The following items are explicitly out of scope for this version:
- Backend/database integration
- User accounts or authentication
- Live price API integration
- Email capture/newsletter
- Multiple language support (i18n)
- Native mobile apps

---

## Appendix

### Original Mattison Formula
```
Gold/Precious Metals % = Age + 15
Bitcoin/Crypto % = 100 - (Age + 15)

Boundaries:
- Minimum age: 18 → 33% Gold, 67% BTC
- Maximum age: 85 → 100% Gold, 0% BTC
```

### Reference Links
- Original PRD: `/PRD.md`
- Current implementation: `/src/`
- Historical data: `/src/data/historicalPrices.ts`
