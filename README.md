# HomeEase Rental Admin Dashboard

Starter admin website for your HomeEase-rental locker project. It currently uses sample data only; it does not connect to real lockers, accept payments, or control hardware.

## Run locally
Requires Node.js 18.18+ (Node 20+ recommended) and npm.

```bash
npm install
npm run dev
```

Open http://localhost:5173.

## Production build
```bash
npm run build
npm run preview
```

## Pages included
- Dashboard: locker counts, demo revenue, rental activity, recent orders
- Lockers: search lockers, view door/HomeEase sensor placeholders, change demo status
- Orders: searchable order and payment records
- Rentals: active, return-pending, and completed rental records
- Settings: demo rental price and duration

## Important
All data is hard-coded in `src/App.tsx` and resets on refresh. No authentication is implemented. Before deployment, add server-side admin authentication and protected API endpoints. Keep WeChat Pay keys, database credentials, device secrets, and MQTT credentials on the backend. The browser must never directly authorize a locker unlock.
