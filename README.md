# CRM Admin Suite

This repository contains a Vite + React + TypeScript admin console with a Scraper Console module backed by mocked APIs.

## Getting Started

```bash
npm install
npm run dev
```

The development server automatically boots Mock Service Worker so the UI functions without a running backend. When integrating a real backend, set `VITE_API_URL=https://crm.rivercityclean.com/api` (or your API base) and remove the MSW bootstrap in `src/main.tsx`.

### Build & Preview

```bash
npm run build
npm run preview
```

### Testing

```bash
npm run test
```

## Scraper Console

* Accessible from the sidebar for users with the `admin` or `tech` roles.
* Provides dashboard KPIs, targets management, schedules, job drill-downs, configuration editor, logs, snapshots, quarantine management, and proxy/user-agent administration.
* All scraper endpoints are mocked via MSW (`src/mocks/scraperHandlers.ts`) and mirrored by FastAPI stubs under `backend/app/routes/scraper.py`.

## Access Control

Non-admin/tech roles are redirected away from `/scraper/*` routes. Use the role switcher in the header to test permissions.
