# Setup Guide

## Prerequisites

- Node.js 18+ ([Download](https://nodejs.org/))
- A PostgreSQL database (local or cloud, e.g. [Neon](https://neon.tech))

## Backend Setup

1. Install dependencies:
```bash
cd backend
npm install
```

2. Configure environment — edit `backend/.env`:
```
DATABASE_URL=postgresql://user:password@localhost:5432/inventory_db
NODE_ENV=development
PORT=5000
LOG_LEVEL=info
```

3. Run migrations:
```bash
npm run db:migrate
```

4. Seed sample data:
```bash
npm run db:seed
```

5. Start the dev server:
```bash
npm run dev
```

Backend runs at `http://localhost:5000`.

## Frontend Setup

1. Install dependencies:
```bash
cd frontend
npm install
```

2. Check `frontend/.env` — it should point to the backend:
```
VITE_API_URL=http://localhost:5000/api
```

3. Start the dev server:
```bash
npm run dev
```

Frontend runs at `http://localhost:5173`.

## Database Commands

| Command | Description |
|---|---|
| `npm run db:migrate` | Apply pending migrations |
| `npm run db:seed` | Seed sample data |
| `npm run db:reset` | Drop, migrate, and reseed (dev only) |

## Running Tests

```bash
cd backend
npm run test
```

## Troubleshooting

**`connect ECONNREFUSED 127.0.0.1:5432`** — PostgreSQL isn't running or `DATABASE_URL` is wrong.

**`relation 'products' does not exist`** — Run `npm run db:migrate` first.

**CORS errors** — Make sure the backend is running and `VITE_API_URL` in `frontend/.env` matches the backend port.

**Port already in use** — Change `PORT` in `backend/.env`. Vite will auto-pick the next available port.
