# Contributing to CarbonKeeper

Thank you for your interest in improving CarbonKeeper. This guide covers local setup and code conventions.

## Prerequisites

- Node.js 20+
- npm

## Setup

```bash
npm install
cp .env.example .env   # optional: add GEMINI_API_KEY
npm run dev
```

## Quality Checks

Run all checks before opening a pull request:

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

## Project Structure

| Path | Purpose |
| --- | --- |
| `app/` | Next.js pages and API routes |
| `components/` | React UI components |
| `lib/agents/` | AI agents and prompts (server-side) |
| `lib/schemas/` | Zod validation schemas (source of truth for types) |
| `lib/services/` | Pure client-side orchestration (no store imports) |
| `lib/stores/` | Zustand state management |
| `lib/storage.ts` | localStorage persistence layer |
| `lib/hooks/` | React hooks that wire UI to services/stores |

## Conventions

- **Types**: Derive domain types from Zod schemas in `lib/schemas/` via `z.infer`.
- **Layers**: Services must not import Zustand stores. Use hooks to inject dependencies.
- **Persistence**: All `localStorage` access goes through `lib/storage.ts`.
- **API routes**: Use `createAIRoute` from `lib/api/route-factory.ts` for consistent validation and caching.
- **Tests**: Place unit tests in `lib/__tests__/`. Use `lib/test-utils/mock-stores.ts` for Zustand mocks.

## Pull Requests

1. Keep changes focused and behavior-preserving unless the PR explicitly changes a feature.
2. Add or update tests for modified logic.
3. Ensure CI passes (`lint`, `typecheck`, `test`, `build`).
