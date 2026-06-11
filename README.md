# CarbonKeeper — PromptWars Challenge 3

> An AI-powered personal carbon coach that helps individuals **understand**, **track**, and **reduce** their carbon footprint through simple natural language logging and personalized AI insights.

**Problem Statement**: _Design a solution that helps individuals understand, track, and reduce their carbon footprint through simple actions and personalized insights._

---

## Problem Statement Alignment

| Pillar                    | How CarbonKeeper Delivers                                                                                                                                                        |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Understand**            | Relatable CO₂ equivalents ("= 212x charging a phone"), donut chart category breakdown, 7-day trend bar chart, daily budget meter with percentage                                 |
| **Track**                 | Natural language logging — type "I drove 12km" and it's parsed instantly. Running activity log with timestamps, amounts, and emission factors. Real-time daily footprint counter |
| **Reduce**                | AI-generated personalized reduction recommendations with annual kg CO₂e savings, gamified challenges with streak tracking, potential annual reduction counter                    |
| **Simple Actions**        | 5-second input — no forms, no dropdowns. Keyword fallback parser works even without AI                                                                                           |
| **Personalized Insights** | Gemini analyzes your actual activity history to generate unique recommendations and insights specific to your lifestyle                                                          |

---

## Features

| Feature                        | Description                                                                            |
| ------------------------------ | -------------------------------------------------------------------------------------- |
| **Natural Language Logging**   | Type "I drove 12km" or "I ate a beef burger" — AI parses it automatically              |
| **Instant CO₂ Calculation**    | Deterministic emission factors with relatable equivalents ("= 255 smartphone charges") |
| **AI Recommendations**         | Gemini analyzes your habits and suggests 3 personalized swaps with annual savings      |
| **Potential Annual Reduction** | Dashboard shows total kg CO₂e you could save per year by following recommendations     |
| **Weekly Trends**              | Bar chart showing your 7-day carbon footprint trajectory                               |
| **Category Breakdown**         | Donut chart visualizing emissions by category (transport, food, energy, shopping)      |
| **Daily Budget Meter**         | Visual gauge showing % of daily carbon budget used                                     |
| **Gamified Challenges**        | Meatless Monday, Bike to Work Wednesday — track streaks and build habits               |
| **Personalized Insights**      | Gemini-generated "aha" moment after each log                                           |
| **Loading & Error States**     | Skeleton loading screens and error boundaries on every route                           |
| **Rate Limiting**              | 30 requests/minute middleware protecting all API routes                                |

---

## Architecture

```
User Input ("I drove 12km")
        │
┌───────▼──────────────┐
│  Parse API Route      │  ← Zod validation → Gemini NLP + keyword fallback
└───────┬──────────────┘
        │
┌───────▼──────────────┐
│  Calculator (Pure fn) │  ← Emission factors × amount × regional grid factor
└───────┬──────────────┘
        │
┌───────▼──────────────┐     ┌──────────────────────┐
│  Recommender Agent    │  ←  │  Insights Agent       │  ← parallel via Promise.all
└───────┬──────────────┘     └──────┬───────────────┘
        │                           │
┌───────▼───────────────────────────▼────────────────┐
│  Dashboard UI (Next.js + Zustand + Recharts)        │
└────────────────────────────────────────────────────┘
```

### Tech Stack

- **Frontend**: Next.js 16, React 19, Tailwind CSS 4, Framer Motion, Recharts
- **AI Layer**: Google Gemini API (via `@google/genai` SDK) with keyword fallback when unavailable
- **State**: Zustand
- **Validation**: Zod
- **Testing**: Jest + React Testing Library (153 tests)
- **Security**: Content-Security-Policy headers, rate limiting, server-side AI calls, Zod input validation on every endpoint

---

## Code Quality Engineering

Code Quality is evaluated **independently** from Testing, Security, and Accessibility in PromptWars. This repository targets production-grade maintainability:

| Signal | Evidence |
| --- | --- |
| Layered architecture | UI → hooks → services → API → agents with strict import boundaries |
| Schema-driven types | `Activity`, `Recommendation` derived from Zod via `z.infer` |
| Dependency injection | `logActivityWithDeps` — services never import Zustand |
| DRY components | Shared `PageHeader`, `RecommendationItem`, `BudgetMeter` |
| Persistence abstraction | All `localStorage` via `lib/storage.ts` |
| Agent consistency | All agents use `generateContentSafe` / `generateTextSafe` |
| Zero static-analysis debt | ESLint clean, TypeScript strict, no `any` or `eslint-disable` |
| CI pipeline | lint + typecheck + 153 tests + build on every push |

See [docs/CODE_QUALITY.md](docs/CODE_QUALITY.md) and [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for full details. See [CONTRIBUTING.md](CONTRIBUTING.md) for development conventions.

## Getting Started

### Prerequisites

- Node.js 20+
- Google Gemini API key (free at https://aistudio.google.com/)

### Setup

```bash
git clone <your-repo-url>
cd carbonkeeper
npm install
```

### Environment Variables

Copy `.env.example` to `.env` and add your Gemini API key:

```
GEMINI_API_KEY="your-api-key-here"
```

**No API key?** The app works fully without one. A keyword-based fallback parser handles common inputs ("drove 10km", "ate beef", "flew 500km") so you can evaluate every feature immediately.

### Run

```bash
npm run dev       # Development server at http://localhost:3000
npm run build     # Production build
npm run test      # Test suite (153 tests)
npm run lint      # ESLint check
npm run typecheck # TypeScript type check
```

---

## Testing

```
npm run test
```

| Test Suite             | Tests | What It Covers                                                                  |
| ---------------------- | ----- | ------------------------------------------------------------------------------- |
| `emissions.test.ts`    | 14    | All categories, subcategories, edge cases (zero/negative/unknown)               |
| `validation.test.ts`   | 16    | Zod schemas: valid inputs, empty, missing, type mismatches                      |
| `store.test.ts`        | 8     | State management: add, append, clear, budget, challenges, recommendations       |
| `equivalents.test.ts`  | 6     | CO₂ equivalents across thresholds, edge cases                                   |
| `ActivityLog.test.tsx` | 7     | Component rendering, input, submit flow, processing state                       |
| `api.test.ts`          | 9     | API route validation, error handling, edge cases                                |
| `dashboard.test.tsx`   | 7     | Dashboard rendering, empty state, data state, challenges, over-budget           |
| `a11y.test.tsx`        | 1     | Automated accessibility audit (jest-axe)                                        |
| More                   |       | Calculator, equivalents, settings, logs, insights, home, layout, error boundary |

---

## User Journey

1. **Landing page** — Understand the four pillars: Understand, Track, Reduce, Personalized Insights
2. **Dashboard** — Type an activity ("drove 12km") in the natural language input
3. **Instant feedback** — See your daily footprint update, budget meter move, and category breakdown populate
4. **AI Recommendations** — Personalized swaps appear based on your activity history
5. **Challenges** — Start a challenge (Meatless Monday, Bike to Work) and build streaks
6. **Insights page** — Deep-dive into budget analysis and high-leverage AI swaps
7. **Activity Logs** — Complete history with equivalents showing the real-world impact

---

## Carbon Reduction Methodology

Emissions are calculated using established per-unit emission factors from climate research:

- **Transport**: kg CO₂e per km (car: 0.17, flight: 0.255, bus: 0.08, train: 0.04, bike: 0)
- **Food**: kg CO₂e per kg (beef: 27, chicken: 6.9, pork: 7.9, vegetables: 2.0, rice: 4.1)
- **Energy**: kg CO₂e per kWh (grid average: 0.4, solar: 0.05)
- **Shopping**: kg CO₂e per item (laptop: 230, t-shirt: 5, jeans: 20)

Regional grid modifiers adjust electricity emissions for local contexts (India: 1.75×, France: 0.15×, etc.).

All CO₂ values are converted to relatable equivalents (smartphone charges, tree growth, flights) for intuitive understanding.

---

## Security Architecture

- **Content-Security-Policy** headers on all routes
- **Rate limiting** (30 requests/minute per IP) on all API routes
- **Server-side AI calls** — Gemini API key never reaches the browser
- **Zod validation** on every API endpoint — type-safe input parsing
- **Error boundaries** at every route level
- **Prompt injection protection** — user input delimited and sanitized

---

## Submission Notes

- **Repository size**: Under 10MB
- **Live preview**: Run `npm run dev` and open http://localhost:3000
- **Demo data**: Click "Load Demo Data" on the dashboard empty state for an instant preview
- **No API key required**: Keyword fallback parser makes the app fully functional without Gemini
