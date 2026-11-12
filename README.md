# Water Consumption & Pressure Monitoring – Frontend

React + Vite dashboard for viewing water tank and industrial pressure readings, historical trends and database tables.

## Features

- Dashboard overview (`/dashboard`)
- Water-tank readings (`/water`) and pressure gauges (`/pressure`)
- Pressure and history charts (`/chart`, `/history`)
- Pressure data (`/database`) and water tank data (`/waterdb`)

## Stack

React 19, React Router, Chart.js / Recharts, Socket.IO client, Tailwind CSS, ExcelJS and PDF export tooling.

## Local setup

```bash
npm install
npm run dev
```

Vite will print the local URL (usually http://localhost:5173).

The application currently has a committed `.env` with `VITE_API_URL` and `VITE_SOCKET_URL`. These `VITE_*` variables are client-visible public configuration, **not a safe place for secrets**. A separate cleanup change will replace the tracked local file with `.env.example`.

## Scripts

- `npm run dev` — local development
- `npm run build` — production build
- `npm run lint` — code checks
- `npm run preview` — preview build

## Deployment and security

The dashboard requires a reachable monitoring backend. Verify REST endpoint and Socket.IO connectivity from the intended browser/network and do not publicly expose unauthenticated industrial endpoints. Check chart exports and historical data ranges after deployment.

## Status

Documentation update only; no build, connection or equipment testing has been performed as part of this README change.
