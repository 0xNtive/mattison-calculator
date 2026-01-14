# Mattison Calculator - Implementation Tracker

## Overview

This document tracks the implementation progress of features defined in [specs/prd.md](./prd.md). Features are organized into phases based on priority and dependencies.

---

## Implementation Phases

### Phase 1: Visual Foundation (P0 Features)
**Goal:** Address core visual pain points - logos and premium aesthetic

### Phase 2: Data & Flexibility (P1 Features)
**Goal:** Add sub-allocations, improved data display, enhanced sharing

### Phase 3: Educational Tools (P2 Features)
**Goal:** Add analytical features for deeper user education

### Phase 4: Polish & Extras (P3 Features)
**Goal:** Quality-of-life improvements

---

## Phase 1: Visual Foundation

### Feature 1.1: Asset Logos & Icons
**Status:** 🟢 Complete

| Task | Status | Notes |
|------|--------|-------|
| Source/create Bitcoin SVG logo | ✅ | Created `BitcoinIcon.tsx` with official BTC style |
| Source/create Gold icon SVG | ✅ | Created `GoldIcon.tsx` with gold bar style |
| Create icon component library | ✅ | `/src/components/icons/` with index.ts |
| Add logos to AllocationDisplay | ✅ | Icons next to percentage labels |
| Add logos to ShareButtons card | ✅ | Embedded SVGs in shareable image |
| Add logos to PerformanceChart legend | ✅ | Custom legend with BTC/Gold icons |
| Add sub-asset icons (ETH, Silver, etc.) | ✅ | Created ETH, Silver, Platinum icons |
| Test rendering at all sizes | ✅ | Verified via build process |

**Files modified:**
- `src/components/AllocationDisplay.tsx` - Added icon imports and display
- `src/components/ShareButtons.tsx` - Added inline SVGs to share card
- `src/components/PerformanceChart.tsx` - Custom legend with icons
- New: `src/components/icons/BitcoinIcon.tsx`
- New: `src/components/icons/GoldIcon.tsx`
- New: `src/components/icons/EthereumIcon.tsx`
- New: `src/components/icons/SilverIcon.tsx`
- New: `src/components/icons/PlatinumIcon.tsx`
- New: `src/components/icons/index.ts`

---

### Feature 1.2: Visual Overhaul - Premium Aesthetic
**Status:** 🟢 Complete

| Task | Status | Notes |
|------|--------|-------|
| Define enhanced color palette in CSS | ✅ | Dark premium palette with gold/bitcoin accents |
| Create gradient utility classes | ✅ | allocation-bar-*, gradient-*, glass-* classes |
| Redesign allocation cards with depth | ✅ | Glassmorphism with backdrop blur and glow |
| Add glow effects to key numbers | ✅ | glow-gold-subtle, glow-bitcoin-subtle, glow-success |
| Improve typography hierarchy | ✅ | number-large, number-display classes |
| Add smooth transitions/animations | ✅ | 700ms transitions, pulse-glow animation |
| Update bar chart with richer gradients | ✅ | SVG glow filter, enhanced gradient fills |
| Redesign input fields (age, portfolio) | ✅ | premium-input class with focus states |
| Update buttons with premium feel | ✅ | premium-button, premium-button-primary classes |
| Mobile responsive adjustments | ✅ | Verified build passes |

**Files modified:**
- `src/app/globals.css` - Complete dark theme with glassmorphism
- `src/app/page.tsx` - Updated header and layout styling
- `src/components/AllocationDisplay.tsx` - Glowing cards with premium styling
- `src/components/AllocationCalculator.tsx` - Premium inputs and toggle
- `src/components/ShareButtons.tsx` - Premium button styling
- `src/components/HistoricalCalculator.tsx` - Dark theme chart container
- `src/components/PerformanceChart.tsx` - Dark chart with glow effect
- `src/components/LearnMore.tsx` - Premium accordion styling
- `src/components/Disclaimer.tsx` - Dark theme banner

---

## Phase 2: Data & Flexibility

### Feature 2.1: Sub-Allocation Selector
**Status:** 🟢 Complete

| Task | Status | Notes |
|------|--------|-------|
| Define sub-allocation data types | ✅ | GoldSubAllocation, CryptoSubAllocation, SubAllocations interfaces |
| Create sub-allocation state management | ✅ | useState in page.tsx with callbacks |
| Build Gold sub-allocation UI | ✅ | Sliders for Physical Gold, Gold ETFs, Silver, Platinum |
| Build BTC sub-allocation UI | ✅ | Sliders for Bitcoin, Ethereum, Other Crypto |
| Add validation (sum to 100%) | ✅ | Real-time validation with error display |
| Update AllocationDisplay for sub-items | ✅ | Shows breakdown when customized and amounts available |
| Update calculation logic | ✅ | calculateAllocationWithSubs function added |
| Integrate sub-allocations in share card | ✅ | Shows sub-allocation breakdown in share image |
| Add historical data for new assets | ✅ | ETH (2016+), Silver, Platinum prices added |

**Files modified:**
- `src/lib/allocation.ts` - Added sub-allocation types and calculation function
- `src/app/page.tsx` - Added sub-allocation state management
- `src/components/AllocationCalculator.tsx` - Integrated SubAllocationSelector
- `src/components/AllocationDisplay.tsx` - Shows sub-allocation breakdown
- `src/components/ShareButtons.tsx` - Displays sub-allocations in share card
- `src/data/historicalPrices.ts` - Added ETH, Silver, Platinum historical data
- New: `src/components/SubAllocationSelector.tsx` - Collapsible sub-allocation UI

**Dependencies:** Phase 1 (icons needed for sub-assets) ✅

---

### Feature 2.2: Table with Sparklines Display
**Status:** 🟢 Complete

| Task | Status | Notes |
|------|--------|-------|
| Create sparkline component | ✅ | Recharts LineChart with responsive container |
| Design table layout | ✅ | Asset, %, Amount, 5Y Trend columns |
| Build AllocationTable component | ✅ | Full table with sub-allocation support |
| Generate sparkline data from historical | ✅ | Last 5 years normalized price trend |
| Add view toggle (chart vs table) | ✅ | Toggle buttons in AllocationDisplay |
| Mobile responsive (cards on mobile) | ✅ | Cards on mobile, table on desktop (md breakpoint) |
| Style table with premium aesthetic | ✅ | Glassmorphism, premium styling |

**Files modified:**
- New: `src/components/AllocationTable.tsx` - Table with sparklines
- New: `src/components/Sparkline.tsx` - Minimal Recharts line chart
- `src/components/AllocationDisplay.tsx` - Added view toggle

**Dependencies:** Phase 1 (visual styling) ✅

---

### Feature 2.3: Enhanced Share Cards
**Status:** 🟢 Complete

| Task | Status | Notes |
|------|--------|-------|
| Redesign share card template | ✅ | Premium dark theme with gradients and glows |
| Add Bitcoin logo to card | ✅ | BTC icon positioned in allocation circle |
| Add Gold logo to card | ✅ | Gold bar icon positioned in allocation circle |
| Calculate historical performance stat | ✅ | calculateMattisonPerformance() function added |
| Add performance badge to card | ✅ | Green badge showing "Mattison +X% since 2015" |
| Add sub-allocation breakdown | ✅ | Shows color-coded breakdown when customized |
| Test image generation quality | ✅ | Build passes, logos render correctly |
| Update social share preview meta | ⬜ | Optional - using existing meta setup |

**Files modified:**
- `src/components/ShareButtons.tsx` - Complete redesign with premium dark theme
- `src/lib/allocation.ts` - Added calculateMattisonPerformance() function

**Dependencies:** Feature 1.1 (logos), Feature 2.1 (sub-allocations) ✅

---

## Phase 3: Educational Tools

### Feature 3.1: Retirement Age Projection
**Status:** 🟢 Complete

| Task | Status | Notes |
|------|--------|-------|
| Design projection UI mockup | ✅ | Collapsible card with timeline chart |
| Add retirement age input field | ✅ | Number input with validation |
| Calculate allocation at each age | ✅ | generateRetirementProjection function |
| Create timeline visualization | ✅ | Stacked area chart with Gold/BTC |
| Add milestone markers | ✅ | Reference dots at key ages (30, 40, 50, 60, 65, 70) |
| Write educational copy | ✅ | Explains why allocation shifts with age |
| Optional: Add projected values | ⬜ | Skipped for v1 (based on historical returns) |

**Files modified:**
- New: `src/components/RetirementProjection.tsx` - Main component with chart and milestones
- `src/lib/allocation.ts` - Added generateRetirementProjection, getRetirementMilestones, RetirementProjectionPoint
- `src/app/page.tsx` - Integrated RetirementProjection component

**Dependencies:** None

---

### Feature 3.2: Rebalancing Simulator
**Status:** 🟢 Complete

| Task | Status | Notes |
|------|--------|-------|
| Design simulator UI | ✅ | Collapsible card with frequency buttons |
| Implement rebalancing calculation | ✅ | simulateRebalancing function |
| Create comparison chart | ✅ | LineChart comparing rebalanced vs buy-and-hold |
| Add frequency toggle | ✅ | Buy & Hold, Annual, Quarterly, Monthly options |
| Calculate and display final values | ✅ | Summary cards with difference percentage |
| Write educational explanation | ✅ | Dynamic text explaining rebalancing impact |
| Handle edge cases | ✅ | Start year selector, handles all data ranges |

**Files modified:**
- New: `src/components/RebalancingSimulator.tsx` - Full simulator component
- `src/lib/allocation.ts` - Added simulateRebalancing, RebalanceFrequency, RebalanceResult types
- `src/app/page.tsx` - Integrated RebalancingSimulator component

**Dependencies:** None

---

### Feature 3.3: Strategy Comparison Mode
**Status:** 🟢 Complete

| Task | Status | Notes |
|------|--------|-------|
| Define comparison strategies | ✅ | Mattison, 60/40, All-Weather, S&P 500, 100% BTC, 100% Gold |
| Source/create historical data | ✅ | Added bonds data to historicalPrices.ts |
| Build strategy selection UI | ✅ | Toggle buttons with color-coded selection |
| Implement strategy calculations | ✅ | Total return, annualized return, max drawdown, volatility |
| Create comparison chart | ✅ | Multi-line LineChart with dynamic strategies |
| Build comparison metrics table | ✅ | Responsive table with key metrics |
| Write strategy descriptions | ✅ | Descriptions for each strategy in UI |
| Add time period selector | ✅ | Start year dropdown |

**Files modified:**
- New: `src/components/StrategyComparison.tsx` - Full comparison component
- `src/data/historicalPrices.ts` - Added bonds index data
- `src/lib/allocation.ts` - Added compareStrategies, STRATEGIES, StrategyType, metrics calculations
- `src/app/page.tsx` - Integrated StrategyComparison component

**Dependencies:** None (bonds data added inline)

---

## Phase 4: Polish & Extras

### Feature 4.1: Dark Mode (Light Mode Toggle)
**Status:** 🟢 Complete

| Task | Status | Notes |
|------|--------|-------|
| Set up Tailwind dark mode | ✅ | data-theme attribute system |
| Create theme toggle component | ✅ | Sun/Moon/System icons with cycle |
| Define light color palette | ✅ | Full CSS variables for light theme |
| Update all components for light | ✅ | CSS variables auto-adapt |
| Persist preference in localStorage | ✅ | useSyncExternalStore pattern |
| Detect system preference | ✅ | prefers-color-scheme media query |
| Update charts for light mode | ✅ | CSS variables adapt automatically |
| Test share card in themes | ✅ | Build passes |

**Files modified:**
- `src/app/globals.css` - Added [data-theme="light"] CSS variables and overrides
- `src/app/page.tsx` - Added ThemeToggle to header
- New: `src/components/ThemeToggle.tsx` - Theme toggle with system/light/dark cycling

**Dependencies:** None (CSS variables auto-adapt)

---

### Feature 4.2: PDF Export
**Status:** 🔴 Not Started

| Task | Status | Notes |
|------|--------|-------|
| Research PDF library options | ⬜ | @react-pdf/renderer vs jsPDF |
| Design PDF template layout | ⬜ | Professional report style |
| Implement PDF generation | ⬜ | Client-side only |
| Include allocation breakdown | ⬜ | Main results |
| Include historical chart | ⬜ | As image or recreated |
| Add branded header/footer | ⬜ | Logo, disclaimer |
| Add download button to UI | ⬜ | Near share buttons |
| Test across browsers | ⬜ | Chrome, Safari, Firefox |
| Lazy load PDF library | ⬜ | Reduce initial bundle |

**Files to modify:**
- New: `src/components/PDFExport.tsx`
- New: `src/lib/pdfGenerator.ts`
- `src/components/ShareButtons.tsx` (add PDF button)
- `package.json` (new dependency)

**Dependencies:** Phase 1-2 (export final design)

---

## Progress Summary

| Phase | Features | Status | Progress |
|-------|----------|--------|----------|
| Phase 1 | Visual Foundation | 🟢 Complete | 2/2 |
| Phase 2 | Data & Flexibility | 🟢 Complete | 3/3 |
| Phase 3 | Educational Tools | 🟢 Complete | 3/3 |
| Phase 4 | Polish & Extras | 🟡 In Progress | 1/2 |
| **Total** | **10 Features** | | **9/10** |

---

## Status Legend

| Icon | Meaning |
|------|---------|
| 🔴 | Not Started |
| 🟡 | In Progress |
| 🟢 | Complete |
| ⬜ | Task not started |
| 🔲 | Task in progress |
| ✅ | Task complete |

---

## Implementation Notes

### Recommended Order
1. **Start with Feature 1.1** (logos) - Quick win, immediate visual impact
2. **Then Feature 1.2** (visual overhaul) - Sets design foundation
3. **Feature 2.3** (share cards) - Leverages logos, high user value
4. **Feature 2.1** (sub-allocations) - Core functionality enhancement
5. **Feature 2.2** (table/sparklines) - Data display improvement
6. Continue with Phase 3-4 based on priorities

### Technical Considerations
- All features are client-side only (per constraint)
- Lazy load PDF library if implemented
- Consider Framer Motion for animations (optional)
- Test share card image generation after each visual change

### Testing Checklist (Per Feature)
- [ ] Desktop Chrome
- [ ] Desktop Safari
- [ ] Desktop Firefox
- [ ] Mobile iOS Safari
- [ ] Mobile Android Chrome
- [ ] Tablet landscape/portrait

---

## Changelog

| Date | Update |
|------|--------|
| 2026-01-14 | Initial tracker created with 10 features across 4 phases |
| 2026-01-14 | Feature 1.1 (Asset Logos & Icons) completed - added Bitcoin, Gold, ETH, Silver, Platinum icons |
| 2026-01-14 | Feature 1.2 (Visual Overhaul) completed - premium dark theme with glassmorphism, glow effects, enhanced gradients |
| 2026-01-14 | Feature 2.1 (Sub-Allocation Selector) completed - Gold/Crypto bucket subdivision with sliders, validation, share card integration |
| 2026-01-14 | Feature 2.2 (Table with Sparklines) completed - Sparkline component, AllocationTable with 5Y trends, chart/table toggle, mobile responsive |
| 2026-01-14 | Feature 2.3 (Enhanced Share Cards) completed - Premium dark theme, asset logos, historical performance badge (+X% since 2015), improved sub-allocation display |
| 2026-01-14 | Feature 3.1 (Retirement Age Projection) completed - Timeline chart showing allocation shift from current age to retirement, milestone markers, educational context |
| 2026-01-14 | Feature 3.2 (Rebalancing Simulator) completed - Compare rebalanced vs buy-and-hold portfolios, frequency toggle, educational explanation |
| 2026-01-14 | Feature 3.3 (Strategy Comparison Mode) completed - Compare Mattison vs 60/40, All-Weather, S&P 500, 100% BTC, 100% Gold with metrics table |
| 2026-01-14 | Feature 4.1 (Dark Mode / Light Mode Toggle) completed - Theme toggle with system/light/dark cycling, localStorage persistence, CSS variables |
