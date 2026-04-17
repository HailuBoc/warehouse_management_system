# Production-Grade Inventory Management System

A full-stack inventory management system built with React, Node.js, Express, and PostgreSQL. Designed for scalability, performance, and maintainability.

## Features

- **Product Management**: View all products with real-time stock levels across warehouses
- **Stock Tracking**: Monitor inventory levels with reorder thresholds
- **Shortage Detection**: Automatic identification of products below reorder levels
- **Smart Transfers**: Suggest and execute stock transfers between warehouses
- **Optimized Queries**: Zero N+1 queries, single-query product listing with conditional aggregation
- **Transaction Safety**: ACID-compliant stock transfers with automatic rollback on failure
- **Type Safety**: Full TypeScript implementation across frontend and backend
- **Clean Architecture**: Separation of concerns with controllers, services, and repositories

## Tech Stack

### Backend
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Validation**: Zod
- **Logging**: Winston
- **Testing**: Vitest

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **State Management**: React Query (TanStack Query)
- **HTTP Client**: Axios
- **Styling**: Tailwind CSS

## Project Structure

```
inventory-system/
├── backend/
│   ├── src/
│   │   ├── config/          # Configuration (env, logger)
│   │   ├── controllers/      # Request handlers
│   │   ├── services/         # Business logic
│   │   ├── repositories/     # Data access layer
│   │   ├── routes/           # API routes
│   │   ├── middlewares/      # Express middlewares
│   │   ├── validators/       # Zod schemas
│   │   ├── types/            # TypeScript types
│   │   ├── scripts/          # Database seed
│   │   └── index.ts          # Entry point
│   ├── prisma/
│   │   └── schema.prisma     # Database schema
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── api/              # API client functions
│   │   ├── components/       # React components
│   │   ├── hooks/            # Custom React hooks
│   │   ├── pages/            # Page components
│   │   ├── types/            # TypeScript types
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.ts
└── README.md
```

## Database Schema

### Tables
- **categories**: Product categories
- **products**: Product information with category reference
- **warehouses**: Warehouse locations (exactly 2 records)
- **stock**: Product quantities per warehouse with reorder levels
- **stock_movements**: History of stock transfers between warehouses

### Key Constraints
- Foreign keys on all relations with cascade delete
- Composite primary key on stock (product_id, warehouse_id)
- Indexes on product_id, warehouse_id for performance
- Indexes on reporting queries

## API Endpoints

### Products
- `GET /api/products` - Get all products with stock levels
  - Returns: Product name, category, warehouse quantities, reorder level
  - Query: Single optimized SQL with conditional aggregation

- `GET /api/products/:id` - Get single product details

### Shortages
- `GET /api/report/shortages` - Get products with shortages
  - Returns: Product ID, name, shortage warehouse, shortage quantity, suggested source
  - Query: Maximum 2 optimized queries with CTEs

### Transfers
- `POST /api/transfer` - Execute stock transfer
  - Request: `{ productId, fromWarehouseId, toWarehouseId, quantity }`
  - Validation: Positive quantity, different warehouses, sufficient stock
  - Execution: Wrapped in database transaction
  - Response: Success status and movement IDs

## Setup Instructions

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd inventory-system/backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Update `.env` with your database URL:
```
DATABASE_URL=postgresql://user:password@localhost:5432/inventory_db
NODE_ENV=development
PORT=3000
LOG_LEVEL=info
```

5. Run database migrations:
```bash
npm run db:migrate
```

6. Seed database with sample data:
```bash
npm run db:seed
```

7. Start development server:
```bash
npm run dev
```

The backend will be available at `http://localhost:3000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd inventory-system/frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Update `.env` if needed (default points to localhost:3000):
```
VITE_API_URL=http://localhost:3000/api
```

5. Start development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

## Running Tests

### Backend Unit Tests
```bash
cd backend
npm run test
```

### Backend with Watch Mode
```bash
cd backend
npm run test:watch
```

## Database Commands

### Reset Database (Development Only)
```bash
cd backend
npm run db:reset
```

### Create New Migration
```bash
cd backend
npm run db:migrate
```

## Production Build

### Backend
```bash
cd backend
npm run build
npm start
```

### Frontend
```bash
cd frontend
npm run build
npm run preview
```

## Docker Setup (Optional)

### Build and Run with Docker Compose

1. Create `docker-compose.yml` in project root:
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: inventory_user
      POSTGRES_PASSWORD: inventory_password
      POSTGRES_DB: inventory_db
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    environment:
      DATABASE_URL: postgresql://inventory_user:inventory_password@postgres:5432/inventory_db
      NODE_ENV: production
      PORT: 3000
    ports:
      - "3000:3000"
    depends_on:
      - postgres
    command: sh -c "npm run db:migrate && npm run db:seed && npm start"

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "5173:5173"
    environment:
      VITE_API_URL: http://localhost:3000/api
    depends_on:
      - backend

volumes:
  postgres_data:
```

2. Create `backend/Dockerfile`:
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

3. Create `frontend/Dockerfile`:
```dockerfile
FROM node:18-alpine as builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

4. Run with Docker Compose:
```bash
docker-compose up
```

## Performance Optimizations

### Backend
- **Single Query Products**: Uses conditional aggregation to fetch all products with stock levels in one query
- **Optimized Shortages**: Uses CTEs and GROUP BY for efficient shortage detection
- **Indexed Queries**: All frequently queried columns are indexed
- **Transaction Safety**: Stock transfers wrapped in database transactions
- **Connection Pooling**: Prisma handles connection pooling automatically

### Frontend
- **React Query Caching**: Automatic caching and stale-while-revalidate pattern
- **Lazy Loading**: Components load data on demand
- **Memoization**: Prevents unnecessary re-renders
- **Optimistic Updates**: UI updates before server confirmation

## Seed Data

The seed script creates:
- 3 product categories (Electronics, Furniture, Office Supplies)
- 2 warehouses (Warehouse A, Warehouse B)
- 8 products with various stock scenarios:
  - Products with shortages in one warehouse
  - Products with shortages in both warehouses
  - Products with adequate stock
  - Products with surplus in one warehouse

This covers all shortage scenarios for testing the transfer workflow.

## Error Handling

- **Centralized Error Handler**: All errors caught and formatted consistently
- **Validation Errors**: Zod validation with detailed error messages
- **Transaction Rollback**: Automatic rollback on transfer failures
- **Logging**: All errors logged with context for debugging

## Security Considerations

- **Input Validation**: All inputs validated with Zod schemas
- **SQL Injection Prevention**: Prisma parameterized queries
- **CORS**: Configured for development
- **Environment Variables**: Sensitive config in .env files
- **Type Safety**: Full TypeScript prevents runtime type errors

## Troubleshooting

### Database Connection Error
- Verify PostgreSQL is running
- Check DATABASE_URL in .env
- Ensure database exists

### Port Already in Use
- Backend: Change PORT in .env
- Frontend: Vite will use next available port

### CORS Errors
- Verify backend is running on correct port
- Check VITE_API_URL in frontend .env

### Seed Script Fails
- Ensure database migrations are run first
- Check database permissions

## Future Enhancements

- Pagination on products endpoint
- Category filtering
- Stock movement history page
- User authentication and authorization
- Batch transfers
- Automated reorder alerts
- Advanced reporting and analytics
- Multi-warehouse optimization
- Barcode scanning integration

## License

MIT
