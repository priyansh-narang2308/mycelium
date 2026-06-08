# Carbon Pulse 🌱

Carbon Pulse is a smart, dynamic, AI-powered B2B web application designed to help users track, analyze, and dramatically reduce their daily carbon footprint with zero friction.

## 🎯 Chosen Vertical
We have chosen the **Environment / Sustainability** vertical. Our persona logic is designed around an environmentally conscious consumer who wants immediate, actionable insights into their daily activities, rather than overwhelming data dumps.

## 🧠 Approach and Logic
Our approach is entirely centered around **frictionless input** and **high-leverage swaps**. 
Traditional carbon calculators require users to navigate tedious dropdowns (e.g., "Transportation -> Car -> Miles"). Carbon Pulse eliminates this by integrating the **Gemini 2.5 Flash** model to parse natural language instantly. 

We used a **Distributed Microservice Architecture** to separate concerns:
1. **NLP Parsing (`/api/parse`)**: Translates "I drove 12km" into structured JSON.
2. **Recommender (`/api/recommend`)**: Analyzes history to suggest lifestyle swaps.
3. **Insights (`/api/insight`)**: Contextualizes current budget usage.

The frontend (`ActivityLog.tsx`) acts as an asynchronous orchestrator. It calculates emissions locally for instantaneous UI updates (optimistic response), while fetching the heavy AI analysis asynchronously in the background.

## ⚙️ How the Solution Works
1. **Input**: The user types a natural language sentence into the Dashboard (e.g. "I ate beef").
2. **Analysis**: The `/api/parse` microservice queries Gemini to classify the activity (e.g., `food -> beef`).
3. **Engine**: The local engine (`lib/emissions.ts`) calculates the CO₂e footprint using deterministic, verifiable scientific data.
4. **State**: The global Zustand store updates the Daily Budget (capped at 10kg).
5. **AI Swaps**: Gemini analyzes the user's history and suggests high-leverage swaps (e.g., "Swap to a chicken burger to save 20kg of CO₂").

## 🛠 Assumptions Made
- **Emission Factors**: We assume standard deterministic emission factors (e.g., 0.17 kg CO₂/km for cars, 27 kg CO₂/kg for beef) for consistent calculation.
- **Budget**: We assume a relatively aggressive daily budget of **10kg CO₂e** to encourage reduction. This can be customized in the Settings.
- **Hackathon AI Testing**: To prevent `.env` friction, we assume judges may want to test the app locally with their own AI keys. We built a dedicated `/dashboard/settings` override to dynamically inject `GEMINI_API_KEY` into the frontend localStorage, which is securely passed to the backend.