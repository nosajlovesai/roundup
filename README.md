# RoundUp — Micro-Allocations for Prediction Markets

> **Everyday spare change routed directly into real event contracts.**  
> Pick a market, swipe your card, and automatically turn idle cents into event-driven equity.

---

## 1. Product Overview

**RoundUp** is a modern consumer fintech platform bridging everyday transaction round-ups with binary prediction markets. 

Rather than letting loose change accumulate in low-yield savings accounts or static coin jars, RoundUp automatically rounds every debit/credit swipe up to the nearest whole dollar (with optional 1x, 2x, or 3x acceleration multipliers) and executes micro-purchases into a user's chosen event contract.

- **Market Settlement**: All binary contracts trade between 1¢ and 99¢ and settle at **$1.00 per share** upon verified resolution.
- **Single Destination Model**: Selecting or switching a destination target affects **future transactions only**—past allocation entries permanently retain their original contract and chosen side.
- **Gemini Contract Clarity**: Powered by Google DeepMind's `gemini-3.8-flash`, first-time market participants can tap **“Explain with Gemini”** to receive a clear, plain-language translation of complex settlement rules into two labeled parts: `YES wins if…` and `NO wins if…`.

---

## 2. Core Features

### 🎯 Destination Routing Engine
- Users select **one active contract** and back **YES** or **NO**.
- Clear status indicators show the active target across desktop and mobile.
- Changing destinations triggers an immediate confirmation banner: *“Future round-ups will back [Market Name] — [Side].”*

### 💳 Real-Time Spend Simulator
- Simulates real point-of-sale card swipes against a connected debit card (`Visa •••• 4128`).
- **Quick Presets**: Coffee ($4.60 → $5.00), Transit ($2.75 → $3.00), Lunch ($12.30 → $13.00), Groceries ($18.40 → $19.00).
- **Custom Spend Amount**: Test any transaction amount (e.g., $14.12) and watch the dynamic round-up calculator automatically compute the spare change.
- **Round-Up Acceleration**: Toggle between 1x, 2x, and 3x multiplier tiers.

### 📊 Active Prediction Markets (2-per-Line Grid)
1. **Sports · Football Championship**
   - *“Will London Monarchs win the 2026 World Club Football Championship?”*
   - Real-time contract pricing (62¢ YES / 38¢ NO), 24h change (+3.2%), $184.5k volume.
2. **Artificial Intelligence · Frontier Labs**
   - *“Will Google DeepMind’s next-gen Gemini achieve #1 global rank on Humanity’s Last Exam in 2026?”*
   - Real-time contract pricing (84¢ YES / 16¢ NO), 24h change (+5.8%), $412.9k volume.
3. **Commercial Aviation · Transatlantic**
   - *“Will commercial supersonic passenger flight service resume transatlantic routes before 2027?”*
   - Real-time contract pricing (38¢ YES / 62¢ NO), 24h change (-1.4%), $128.4k volume.
4. **Robotics · Industrial Automation**
   - *“Will bipedal humanoid robots exceed 10,000 active commercial factory deployments in 2026?”*
   - Real-time contract pricing (54¢ YES / 46¢ NO), 24h change (+2.1%), $265.1k volume.

### 🧠 Gemini Contract Clarity Assistant
- Cleanly labeled drawer under each contract: **“Understand this prediction”**.
- Returns two distinct, labeled parts:
  - `YES wins if…`
  - `NO wins if…`
- Preserves all legal exceptions, official replay provisions, and deadline dates.
- Strict neutral persona: Never predicts outcomes, recommends a side, or invents facts.
- **Session Caching**: Reopening an explanation instantly displays the cached response without redundant network requests, with a secondary **“Generate again”** action available.

### 📜 Allocation History & Audit Ledger
- Real-time chronological audit trail of all transactions.
- Filterable by **All**, **YES**, and **NO**.
- Displays original swipe price, rounded price, allocated change, timestamp, and destination contract.
- One-click **CSV Ledger Export** for personal finance tracking.

---

## 3. Design Philosophy & Impeccable Standards

RoundUp's user interface is crafted in accordance with the [Impeccable](https://github.com/pbakaus/impeccable) frontend constitution:

1. **Zero-Pill Discipline**:
   - Metadata (categories, dates, trading volumes, settlement rules) is rendered as clean, unboxed typography separated by quiet typographic separators (`·`).
   - Static badges and candy-colored pill wrappers are strictly avoided.
2. **Typographic Rhythm & Monospace Numbers**:
   - Currency amounts, timestamps, and percentages utilize tabular figures (`font-mono`) to prevent layout jitter during live animations.
   - Distinctive typography using *Plus Jakarta Sans* and *JetBrains Mono*.
3. **Layout Integrity & Intentional Geometry**:
   - Market cards are organized in an intentional 2-per-line grid with `items-start` alignment, preventing sibling cards from expanding awkwardly when an explanation drawer is opened.
   - Proportional container padding, subtle hairline borders (`#E4DFD3`), and warm neutral stone backgrounds (`#F8F6F0`).
4. **Instant Tactile Feedback**:
   - Micro-affirmations on swipe, bounce indicators on allocation deltas, and smooth collapsible accordions.

---

## 4. Architecture & Tech Stack

```
roundup/
├── server.ts                 # Express backend with Gemini API proxy
├── src/
│   ├── main.tsx              # React entry point
│   ├── App.tsx               # Main full-stack application shell
│   ├── types.ts              # TypeScript domain types & interfaces
│   ├── data/
│   │   └── markets.ts        # Contract specifications & settlement rules
│   └── components/
│       ├── Header.tsx        # Brand header with How-It-Works modal
│       ├── PredictionCard.tsx# 2-per-line market card with Gemini drawer
│       ├── DemoPanel.tsx     # Card allocation hub & spend simulator
│       ├── ActivityList.tsx  # Filterable transaction ledger & CSV exporter
│       ├── MarketVisual.tsx  # Bespoke SVG graphics per category
│       └── PurchaseNotification.tsx # Animated swipe feedback toast
├── package.json
└── vite.config.ts
```

- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide React icons.
- **Backend / API**: Node.js, Express, `@google/genai` TypeScript SDK.
- **Model**: `gemini-3.8-flash` via server-side `/api/explain-prediction`.

---

## 5. API Reference

### `POST /api/explain-prediction`
Generates beginner-friendly plain-language explanations of contract resolution rules.

#### Request Body
```json
{
  "question": "Will London Monarchs win the 2026 World Club Football Championship?",
  "description": "Undefeated in tournament group play heading into the global finals in Tokyo.",
  "resolutionRule": "Resolves YES if London Monarchs are officially declared tournament match winners on or before Dec 31, 2026. Resolves NO otherwise."
}
```

#### Response Body
```json
{
  "yesWinsIf": "the London Monarchs are officially declared tournament match winners on or before December 31, 2026.",
  "noWinsIf": "the London Monarchs are not officially declared tournament winners by December 31, 2026, or if any other outcome occurs."
}
```

---

## 6. Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/your-username/roundup.git
cd roundup

# Install dependencies
npm install

# Start the full-stack development server
npm run dev
```

The app will be accessible at `http://localhost:3000`.

### Production Build
```bash
npm run build
npm start
```

---

## 7. License
MIT License. Created for production-grade prediction market micro-investing.
