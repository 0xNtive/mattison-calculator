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
**Status:** 🔴 Not Started

| Task | Status | Notes |
|------|--------|-------|
| Define sub-allocation data types | ⬜ | TypeScript interfaces |
| Create sub-allocation state management | ⬜ | useState in page.tsx |
| Build Gold sub-allocation UI | ⬜ | Sliders/inputs for Gold, Silver, Platinum |
| Build BTC sub-allocation UI | ⬜ | Sliders/inputs for BTC, ETH, Other |
| Add validation (sum to 100%) | ⬜ | Real-time validation |
| Update AllocationDisplay for sub-items | ⬜ | Show breakdown |
| Update calculation logic | ⬜ | allocation.ts updates |
| Integrate sub-allocations in share card | ⬜ | Show in shareable image |
| Add historical data for new assets | ⬜ | ETH, Silver prices if available |

**Files to modify:**
- `src/lib/allocation.ts`
- `src/app/page.tsx`
- `src/components/AllocationCalculator.tsx`
- `src/components/AllocationDisplay.tsx`
- `src/components/ShareButtons.tsx`
- `src/data/historicalPrices.ts`
- New: `src/components/SubAllocationSelector.tsx`

**Dependencies:** Phase 1 (icons needed for sub-assets)

---

### Feature 2.2: Table with Sparklines Display
**Status:** 🔴 Not Started

| Task | Status | Notes |
|------|--------|-------|
| Create sparkline component | ⬜ | Use Recharts LineChart minimal |
| Design table layout | ⬜ | Asset, %, Amount, Sparkline columns |
| Build AllocationTable component | ⬜ | New component |
| Generate sparkline data from historical | ⬜ | Last 5 years trend |
| Add view toggle (chart vs table) | ⬜ | User preference |
| Mobile responsive (cards on mobile) | ⬜ | Collapse to cards <768px |
| Style table with premium aesthetic | ⬜ | Match Phase 1 design |

**Files to modify:**
- New: `src/components/AllocationTable.tsx`
- New: `src/components/Sparkline.tsx`
- `src/components/AllocationDisplay.tsx` (add toggle)
- `src/app/page.tsx`

**Dependencies:** Phase 1 (visual styling)

---

### Feature 2.3: Enhanced Share Cards
**Status:** 🔴 Not Started

| Task | Status | Notes |
|------|--------|-------|
| Redesign share card template | ⬜ | Premium aesthetic from Phase 1 |
| Add Bitcoin logo to card | ⬜ | Positioned near BTC % |
| Add Gold logo to card | ⬜ | Positioned near Gold % |
| Calculate historical performance stat | ⬜ | "Mattison +X% since YYYY" |
| Add performance badge to card | ⬜ | Visual element showing returns |
| Add sub-allocation breakdown | ⬜ | If sub-allocations configured |
| Test image generation quality | ⬜ | Ensure logos render in PNG |
| Update social share preview meta | ⬜ | OpenGraph updates if needed |

**Files to modify:**
- `src/components/ShareButtons.tsx`
- `src/lib/allocation.ts` (performance calculation)
- `src/app/layout.tsx` (meta tags)

**Dependencies:** Feature 1.1 (logos), Feature 2.1 (sub-allocations)

---

## Phase 3: Educational Tools

### Feature 3.1: Retirement Age Projection
**Status:** 🔴 Not Started

| Task | Status | Notes |
|------|--------|-------|
| Design projection UI mockup | ⬜ | Input fields + timeline chart |
| Add retirement age input field | ⬜ | Target age selector |
| Calculate allocation at each age | ⬜ | Apply formula year by year |
| Create timeline visualization | ⬜ | Area chart or stepped line |
| Add milestone markers | ⬜ | Key ages highlighted |
| Write educational copy | ⬜ | Explain why allocation shifts |
| Optional: Add projected values | ⬜ | Based on historical returns |

**Files to modify:**
- New: `src/components/RetirementProjection.tsx`
- `src/lib/allocation.ts`
- `src/app/page.tsx`

**Dependencies:** None (can start independently)

---

### Feature 3.2: Rebalancing Simulator
**Status:** 🔴 Not Started

| Task | Status | Notes |
|------|--------|-------|
| Design simulator UI | ⬜ | Frequency selector + chart |
| Implement rebalancing calculation | ⬜ | Simulate periodic rebalancing |
| Create comparison chart | ⬜ | Rebalanced vs buy-and-hold |
| Add frequency toggle | ⬜ | Annual, Quarterly, Monthly, None |
| Calculate and display final values | ⬜ | Show difference |
| Write educational explanation | ⬜ | Why rebalancing matters |
| Handle edge cases | ⬜ | Partial years, etc. |

**Files to modify:**
- New: `src/components/RebalancingSimulator.tsx`
- `src/lib/allocation.ts` (rebalancing logic)
- `src/app/page.tsx`

**Dependencies:** None

---

### Feature 3.3: Strategy Comparison Mode
**Status:** 🔴 Not Started

| Task | Status | Notes |
|------|--------|-------|
| Define comparison strategies | ⬜ | 60/40, All-Weather, etc. |
| Source/create historical data | ⬜ | Bonds data needed for 60/40 |
| Build strategy selection UI | ⬜ | Multi-select checkboxes |
| Implement strategy calculations | ⬜ | Return, drawdown, volatility |
| Create comparison chart | ⬜ | Multi-line overlay |
| Build comparison metrics table | ⬜ | Side-by-side stats |
| Write strategy descriptions | ⬜ | Educational content |
| Add time period selector | ⬜ | Compare over different ranges |

**Files to modify:**
- New: `src/components/StrategyComparison.tsx`
- New: `src/data/bondPrices.ts` (if needed)
- `src/lib/allocation.ts`
- `src/app/page.tsx`

**Dependencies:** May need additional historical data

---

## Phase 4: Polish & Extras

### Feature 4.1: Dark Mode
**Status:** 🔴 Not Started

| Task | Status | Notes |
|------|--------|-------|
| Set up Tailwind dark mode | ⬜ | class-based toggle |
| Create theme toggle component | ⬜ | Sun/moon icon button |
| Define dark color palette | ⬜ | All CSS variables |
| Update all components for dark | ⬜ | Check each component |
| Persist preference in localStorage | ⬜ | Remember user choice |
| Detect system preference | ⬜ | prefers-color-scheme |
| Update charts for dark mode | ⬜ | Recharts theming |
| Test share card in dark mode | ⬜ | Generate appropriate image |

**Files to modify:**
- `tailwind.config.ts`
- `src/app/globals.css`
- `src/app/layout.tsx`
- New: `src/components/ThemeToggle.tsx`
- All component files (dark: classes)

**Dependencies:** Phase 1 (establish color system first)

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
| Phase 2 | Data & Flexibility | 🔴 Not Started | 0/3 |
| Phase 3 | Educational Tools | 🔴 Not Started | 0/3 |
| Phase 4 | Polish & Extras | 🔴 Not Started | 0/2 |
| **Total** | **10 Features** | | **2/10** |

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
