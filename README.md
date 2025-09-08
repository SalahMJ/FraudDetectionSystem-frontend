# Frontend (Angular) — Fraud Detection System

Angular UI for operators to monitor KPIs, review transactions, and get AI insights.

## Prerequisites
- Node.js 18+
- npm 9+

## Quick Start
```
npm install
npm start
```
Default dev server: http://localhost:4200

Configure the backend API base in `frontend/src/environments/environment.ts` if needed.

## Project Scripts
- `npm start` — Angular dev server with HMR
- `npm run build` — production build
- `npm run watch` — dev build in watch mode

## Structure
- `src/app/app.component.ts` — app shell, toolbar (Dashboard, Stats, Ingest, Login/Logout)
- `src/app/pages/dashboard/dashboard.component.ts` — KPIs, trends (SVG), AI Insights
- `src/app/services/stats.service.ts` — API calls for stats and AI
- `src/app/auth/auth.service.ts` — JWT login/logout
- `src/app/components/health-indicator.component.ts` — backend health indicator
- `src/app/models/types.ts` — shared interfaces
- `src/styles.css` — global styling and theme tweaks

## Features
- **KPIs and Trends**: rolling 7d/30d totals and daily line chart; toggles for Fraud/Clean/Approved/Pending/Rejected.
- **Transactions Review**: view and update statuses (approve/reject/pending).
- **AI Insights**: Natural language summary for current window; chart spec JSON shown for transparency.
- **Auth**: JWT-based; login/logout visible on the top toolbar.

## Environment
- Backend base URL and settings come from `src/environments/`.
- Ensure CORS on the backend allows `http://localhost:4200`.

## Build
```
npm run build
```
Output goes to `dist/`.

## Troubleshooting
- 401 from API → login first; ensure backend at `http://localhost:8000`.
- CORS errors → set `CORS_ORIGINS=http://localhost:4200` on the backend.
- Chart libraries → In the current UI, chart spec is displayed as JSON (no runtime chart rendering by default).

## Notes
- The app uses Angular Material and a dark theme.
- Health indicator pings `GET /health` periodically.
