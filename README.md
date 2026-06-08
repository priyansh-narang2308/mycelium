# MYCELIUM — PromptWars Challenge 3

> AI-powered personal carbon coach. Log your activities naturally, get instant CO₂ calculations, personalized swaps, and gamified challenges.

**Problem Statement**: _Design a solution that helps individuals understand, track, and reduce their carbon footprint through simple actions and personalized insights._

---

## Features

| Feature                      | Description                                                                            |
| ---------------------------- | -------------------------------------------------------------------------------------- |
| **Natural Language Logging** | Type "I drove 12km" or "I ate a beef burger" — AI parses it automatically              |
| **Instant CO₂ Calculation**  | Deterministic emission factors with relatable equivalents ("= 255 smartphone charges") |
| **AI Recommendations**       | Gemini analyzes your habits and suggests 3 personalized swaps ranked by impact         |
| **Weekly Trends**            | Bar chart showing your 7-day carbon footprint trajectory                               |
| **Category Breakdown**       | Donut chart visualizing emissions by category (transport, food, energy, shopping)      |
| **Daily Budget Meter**       | Visual gauge showing % of daily carbon budget used                                     |
| **Gamified Challenges**      | Meatless Monday, Bike to Work Wednesday — track streaks and build habits               |
| **AI Insights**              | Personalized "aha" moment generated after each log                                     |
| **Settings**                 | Configurable daily budget and Gemini API key override                                  |

---

## Architecture

```
User Input ("I drove 12km")
        │
┌───────▼──────────────┐
│  Parse API Route      │  ← Zod validation → Gemini NLP parsing
└───────┬──────────────┘
        │
┌───────▼──────────────┐
│  Calculator (Pure fn) │  ← Emission factors × amount
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
- **AI Layer**: Google Antigravity SDK + Gemini 3.5 Flash
- **State**: Zustand
- **Validation**: Zod
- **Testing**: Jest + React Testing Library
- **Auth bypass**: Judge-friendly settings page for API key injection

---

## Getting Started

### Prerequisites

- Node.js 20+
- Google Gemini API key (free at https://aistudio.google.com/)

### Setup

```bash
git clone <your-repo-url>
cd carbon-pulse
npm install
```

### Environment Variables

Copy `.env.example` to `.env` and add your Gemini API key:

```
GEMINI_API_KEY="your-api-key-here"
```

**For judges**: If you don't want to set up a `.env` file, just run the app and go to `/dashboard/settings` to inject your key through the UI.

### Run

```bash
npm run dev     # Development server at http://localhost:3000
npm run build   # Production build
npm run test    # Test suite (25+ tests)
npm run lint    # ESLint check
```

---

## Testing

```
npm run test
```

| Test Suite             | Tests | What It Covers                                                            |
| ---------------------- | ----- | ------------------------------------------------------------------------- |
| `emissions.test.ts`    | 14    | All categories, subcategories, edge cases (zero/negative/unknown)         |
| `validation.test.ts`   | 16    | Zod schemas: valid inputs, empty, missing, type mismatches                |
| `store.test.ts`        | 8     | State management: add, append, clear, budget, challenges, recommendations |
| `equivalents.test.ts`  | 6     | CO₂ equivalents across thresholds, edge cases                             |
| `ActivityLog.test.tsx` | 3     | Component rendering: input, button, header                                |

---

## Evaluation Criteria Mapping

| Criteria          | How We Address It                                                                                                                                |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Code Quality**  | Strict TypeScript, modular architecture (agents/UI/lib separation), DRY, clean Zod validation                                                    |
| **Security**      | All AI calls server-side via Next.js API routes, Zod input validation on every endpoint, `.env` gitignored                                       |
| **Efficiency**    | Pre-bundled emission factors (no API latency), low-token agent prompts, lightweight Zustand state, Framer Motion animations                      |
| **Testing**       | 25+ tests across 5 suites covering emissions, validation, store, equivalents, and component rendering                                            |
| **Accessibility** | Semantic HTML, `aria-labels`, `aria-live` regions for dynamic content, skip-to-content link, keyboard-navigable, `role="meter"` for budget gauge |

---

## PS Alignment

| PS Keyword                | Delivery                                                               |
| ------------------------- | ---------------------------------------------------------------------- |
| **individuals**           | Single-user, zero-friction, no org setup required                      |
| **understand**            | Relatable CO₂ equivalents, category breakdown, weekly trends           |
| **track**                 | Daily footprint meter, 7-day bar chart, budget percentage, running log |
| **reduce**                | AI recommendations, gamified challenges with streak tracking           |
| **simple actions**        | 5-second natural language input — type "I drove 12km"                  |
| **personalized insights** | Gemini-generated insights based on your actual activity history        |

---

## Submission Notes

- **Platform**: Google Antigravity 2.0 (subagent architecture via SDK)
- **Live Preview**: Run `npm run dev` and open http://localhost:3000
- **API Key**: Set via `.env` or `/dashboard/settings` page
- **Demo Data**: Click "Load Demo Data" on the dashboard empty state
