# AGENTS.md

## Cursor Cloud specific instructions

This is a single-service, client-only React + Vite + TypeScript app (Tailwind v4) — a Brazilian Amazon seller pricing calculator. There is no backend, database, or external service.

- **Dev server**: `npm run dev` (Vite) serves at `http://localhost:5173/`. State is client-side only; results recalculate live as inputs change.
- **Lint**: `npm run lint` uses `oxlint` (not ESLint).
- **Build**: `npm run build` runs `tsc -b && vite build`; preview the production build with `npm run preview`.
- **Tests**: there is no automated test suite (no `test` script in `package.json`); verify changes manually in the browser.
- Node 22 is required (Vite 8 needs Node 20.19+ or 22.12+); the base image's Node satisfies this.
