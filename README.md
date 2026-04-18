# Inventory Management System

A full-stack inventory management system built with React, Node.js, Express, and PostgreSQL.

## Features

- **Product Management**: View all products with real-time stock levels across warehouses
- **Stock Tracking**: Monitor inventory levels with reorder thresholds
- **Shortage Detection**: Automatic identification of products below reorder levels
- **Smart Transfers**: Suggest and execute stock transfers between warehouses
- **Optimized Queries**: Zero N+1 queries, single-query product listing with conditional aggregation
- **Transaction Safety**: ACID-compliant stock transfers with automatic rollback on failure
- **Type Safety**: Full TypeScript implementation across frontend and backend

## Tech Stack

### Backend
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL (via Prisma ORM)
- **Validation**: Zod
- **Logging**: Winston
- **Testing**: Vitest

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **State Management**: TanStack Query (React Query)
- **HTTP Client**: Axios
- **Styling**: Tailwind CSS

## Project Structure

```
├── backend/
│   ├── src/
│   │   ├── config/          # Configuration (env, logger)
│   │   ├── controllers/     # Request handlers
│   │   ├── services/        # Business logic
│   │   ├── repositories/    # Data access layer
│   │   ├── routes/          # API routes
│   │   ├── middlewares/     # Express middlewares
│   │   ├── validators/      # Zod schemas
│   │   ├── types/           # TypeScript types
│   │   ├── scripts/         # Database seed
│   │   └── index.ts         # Entry point
│   └── prisma/
│       └── schema.prisma    # Database schema
└── frontend/
    └── src/
        ├── api/             # API client functions
        ├── components/      # React components
        ├── hooks/           # Custom React hooks
        ├── pages/           # Page components
        └── types/           # TypeScript types
```

## Quick Start

See [SETUP.md](./SETUP.md) for full setup instructions.

### Docker (recommended)

From the `inventory-system/` folder:

```bash
docker compose up -d --build
```

Open:
- Frontend: `http://localhost:8080`
- Backend: `http://localhost:3000` (API is also available via the frontend at `http://localhost:8080/api`)

Useful commands:

```bash
# View running containers
docker compose ps

# Follow logs
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f postgres

# Stop everything (keeps database volume)
docker compose down

# Stop and delete database volume (destructive)
docker compose down -v
```

Run services individually:

```bash
# Start database only
docker compose up -d postgres

# Start backend (and its dependencies)
docker compose up -d --build backend

# Start frontend
docker compose up -d --build frontend
```

### Backend
```bash
cd backend
npm install
npm run db:migrate
npm run db:seed
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

- Backend: `http://localhost:5000`
- Frontend: `http://localhost:5173`

## API Endpoints

### Products
- `GET /api/products` — All products with stock levels
- `GET /api/products/:id` — Single product details

### Shortages
- `GET /api/report/shortages` — Products below reorder level with suggested transfers

### Transfers
- `POST /api/transfer` — Execute a stock transfer
  - Body: `{ productId, fromWarehouseId, toWarehouseId, quantity }`

## Database Commands

```bash
cd backend
npm run db:migrate   # Run migrations
npm run db:seed      # Seed sample data
npm run db:reset     # Reset and reseed (dev only)
```

## Testing

```bash
cd backend
npm run test
```
