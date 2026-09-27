# Round Up — Prediction Market Micro-Allocation Dashboard

> **Put your spare change behind your predictions.**  
> Pick a side. Enable round-ups. Let everyday purchases add up.

---

## 1. Product Overview

**Round Up** is a clean, polished prediction-market micro-allocation dashboard designed with inspiration from modern prediction platforms like Kalshi and Polymarket:
- Compact market browsing with search and category filters.
- Clear equal-width outcome selection buttons (`YES · 62¢` / `NO · 38¢`).
- Unified **“Your round-ups”** control panel with live calculation preview.
- Tabular chronological activity ledger with CSV export.
- Reusable **Market details** modal with live **Gemini AI contract explanations** and curated news reporting.

---

## 2. Visual System & Architecture

- **Page Background**: `#F7F8FA`
- **Cards & Header**: `#FFFFFF` with `#E5E7EB` borders
- **Typography & Numerical Hierarchy**:
  - Primary text: `#17212B`
  - Secondary text: `#64748B`
  - Main balance: 32–36px with tabular numbers (`font-tabular`)
  - Market titles: 16px semibold
- **Action & Brand Colors**:
  - Brand action green: `#16734B`
  - YES outcome: dark green text on pale green (`#16734B` on `#E8F5EE`, border `#C6E7D5`)
  - NO outcome: dark red text on pale red (`#991B1B` on `#FEE2E2`, border `#FECACA`)
- **Card Corners**: 10–12px radius with subtle shadows and restrained borders.

---

## 3. Core Features

### 🧭 64px Desktop Header & Intro
- **Branding**: Round Up circular logo and title.
- **Section Navigation**: Clean text links for **Markets** and **Activity** with smooth scroll and active indicators.
- **Top Controls**: Subtle **Demo mode** badge, **How it works** modal (3 concise steps), and instant **Reset** action.
- **Compact Intro**: Directly states the core value proposition without marketing fluff.

### 📊 Market Browsing
- **Search**: Compact search bar filtering across market titles, questions, and categories.
- **Category Filter Tabs**: `All`, `Sports`, `AI`, `Aviation`, `Robotics`.
- **4 Real-Time Markets**:
  1. *Will the Monarchs win the championship?* (`YES · 62¢` / `NO · 38¢`)
  2. *Will Gemini rank #1 on Humanity’s Last Exam?* (`YES · 84¢` / `NO · 16¢`)
  3. *Will transatlantic supersonic flights return by 2027?* (`YES · 38¢` / `NO · 62¢`)
  4. *Will factory humanoid deployments exceed 10,000?* (`YES · 54¢` / `NO · 46¢`)
- **Empty State**: Clean "No matching markets" card with a 1-click "Clear filters" action.

### 💳 Unified “Your round-ups” Panel
- **Total Allocated**: Cumulative round-ups allocated with purchase count.
- **Next round-ups go to**: Indicates the selected contract and side.
- **Automatic Round-ups**: Clearly labeled switch (Active / Paused); starts OFF on clean state.
- **Demo Purchase Simulator**: Presets for Coffee ($4.60), Transit ($2.75), Lunch ($12.30), Groceries ($18.40), and Custom inputs.
  - Transparent itemized calculation:
    ```
    Coffee                 $4.60
    Rounded purchase       $5.00
    Round-up               $0.40
    ```
- **Multiplier Acceleration**: Expandable 1x, 2x, 3x multipliers with explicit breakdown (e.g. *“Base round-up $0.40 × 2 = $0.80 allocated”*).
- **Allocation Breakdown**: Collapsible portfolio holding summary, hidden when no allocations exist.

### 📜 Tabular Activity Ledger
- Desktop table view with `Purchase | Prediction | Round-up | Time` columns.
- Mobile stacked card view with touch-friendly layout.
- Working filters for `All`, `YES`, and `NO`.
- Single-click CSV export.

### 🧠 Deep Gemini Market Intelligence & Analysis
- **Advanced Quantitative Research Analyst Persona**: Goes far beyond simply rephrasing the settlement rules to provide actionable, multi-dimensional market intelligence.
- **Executive Briefing & Sentiment**: Sharp 1-2 sentence overview of what is at stake and current market pricing dynamics.
- **Bull vs. Bear Thesis Grid**:
  - **Case for YES (Tailwinds & Catalysts)**: Technological scaling, OEM commitments, squad depth, or regulatory fast-tracks.
  - **Case for NO (Headwinds & Risk Factors)**: Supply chain bottlenecks, certification barriers, tournament variance, or competitor leapfrogging.
- **Key Milestones to Watch**: Numbered watchpoint catalysts for traders to monitor before contract settlement.
- **Contract Settlement Nuance & Trap Alert**: Uncovers subtle settlement technicalities (e.g. why private benchmarks don't count, extra time vs regulation rules, or non-revenue demonstration flights being disqualified).
- **Crisp Settlement Conditions**: Explicit `YES wins if…` and `NO wins if…` breakdowns.
- **Session Caching**: Instant recall when reopening a market during the same session, with a 1-click **Refresh analysis** option.
- **Curated Event News Links**: Outbound links with publication source, timestamp, and headlines.

### 📱 Apple Pay + Round Up Demo (`#/mobile-demo`)

- Official Apple Pay web button and unmodified Apple Pay mark.
- Separate in-store Wallet and online checkout previews, with side-button confirmation and post-payment Round Up notifications.
- Autoplay or step-by-step interaction; expand the notification to approve $0.40, skip, or dismiss. Approved amounts appear in the dashboard ledger.
- Responsive device preview, keyboard-accessible payment dialog, and reduced-motion support.
- This is a browser simulation. Native payment sheets, Face ID, NFC, and system status icons require Apple hardware/APIs.

See [source references, asset provenance, fidelity limits, and verification](docs/apple-pay-demo.md).

---

## 4. Prototype Disclaimer

- Prototype environment with simulated transactions. No real payments, financial transactions, or real money are handled.
- Payment cards and merchant interactions are simulated demonstration states.
