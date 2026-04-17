# Quick Reference Guide

## Common Commands

### Backend

```bash
# Install dependencies
npm install

# Development
npm run dev

# Build
npm run build

# Production
npm start

# Database
npm run db:migrate      # Run migrations
npm run db:seed         # Seed with sample data
npm run db:reset        # Reset database (dev only)

# Testing
npm run test            # Run tests once
npm run test:watch      # Watch mode

# Linting
npm run lint            # Check code style

# Database UI
npx prisma studio      # Open Prisma Studio
```

### Frontend

```bash
# Install dependencies
npm install

# Development
npm run dev

# Build
npm run build

# Preview production build
npm run preview

# Linting
npm run lint
```

### Docker

```bash
# Start all services
docker-compose up

# Start in background
docker-compose up -d

# Stop services
docker-compose down

# Rebuild images
docker-compose up --build

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend
```

## Environment Variables

### Backend (.env)

```
DATABASE_URL=postgresql://user:password@localhost:5432/inventory_db
NODE_ENV=development
PORT=3000
LOG_LEVEL=info
```

### Frontend (.env)

```
VITE_API_URL=http://localhost:3000/api
```

## API Quick Reference

### Get All Products
```bash
curl http://localhost:3000/api/products
```

### Get Product by ID
```bash
curl http://localhost:3000/api/products/1
```

### Get Shortages
```bash
curl http://localhost:3000/api/report/shortages
```

### Transfer Stock
```bash
curl -X POST http://localhost:3000/api/transfer \
  -H "Content-Type: application/json" \
  -d '{
    "productId": 1,
    "fromWarehouseId": 2,
    "toWarehouseId": 1,
    "quantity": 5
  }'
```

## File Structure Quick Guide

### Backend Key Files

```
backend/
├── src/
│   ├── index.ts                 # Entry point
│   ├── config/
│   │   ├── env.ts              # Environment config
│   │   └── logger.ts           # Winston logger
│   ├── controllers/
│   │   ├── productController.ts
│   │   ├── shortageController.ts
│   │   └── transferController.ts
│   ├── services/
│   │   ├── productService.ts
│   │   ├── shortageService.ts
│   │   └── transferService.ts
│   ├── repositories/
│   │   ├── productRepository.ts
│   │   ├── shortageRepository.ts
│   │   ├── stockRepository.ts
│   │   └── transferRepository.ts
│   ├── routes/
│   │   └── index.ts            # Route definitions
│   ├── middlewares/
│   │   ├── errorHandler.ts
│   │   ├── requestLogger.ts
│   │   └── validation.ts
│   ├── validators/
│   │   └── index.ts            # Zod schemas
│   ├── types/
│   │   └── index.ts            # TypeScript types
│   └── scripts/
│       └── seed.ts             # Database seed
├── prisma/
│   └── schema.prisma           # Database schema
└── package.json
```

### Frontend Key Files

```
frontend/
├── src/
│   ├── main.tsx                # Entry point
│   ├── App.tsx                 # Root component
│   ├── api/
│   │   ├── client.ts           # Axios client
│   │   ├── products.ts         # Product API
│   │   ├── shortages.ts        # Shortage API
│   │   └── transfers.ts        # Transfer API
│   ├── components/
│   │   ├── ProductTable.tsx
│   │   ├── TransferForm.tsx
│   │   ├── SuggestTransferButton.tsx
│   │   ├── LoadingSpinner.tsx
│   │   └── ErrorMessage.tsx
│   ├── hooks/
│   │   ├── useProducts.ts
│   │   ├── useShortages.ts
│   │   └── useTransfer.ts
│   ├── pages/
│   │   └── ProductsPage.tsx
│   └── types/
│       └── index.ts            # TypeScript types
├── index.html
└── package.json
```

## Database Schema Quick Reference

### Categories
```sql
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) UNIQUE NOT NULL
);
```

### Products
```sql
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) UNIQUE NOT NULL,
  category_id INTEGER NOT NULL REFERENCES categories(id)
);
```

### Warehouses
```sql
CREATE TABLE warehouses (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) UNIQUE NOT NULL
);
```

### Stock
```sql
CREATE TABLE stock (
  product_id INTEGER NOT NULL REFERENCES products(id),
  warehouse_id INTEGER NOT NULL REFERENCES warehouses(id),
  quantity INTEGER NOT NULL,
  reorder_level INTEGER NOT NULL,
  PRIMARY KEY (product_id, warehouse_id)
);
```

### Stock Movements
```sql
CREATE TABLE stock_movements (
  id SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL REFERENCES products(id),
  from_warehouse_id INTEGER NOT NULL REFERENCES warehouses(id),
  to_warehouse_id INTEGER NOT NULL REFERENCES warehouses(id),
  quantity INTEGER NOT NULL,
  type VARCHAR(10) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Common Issues & Solutions

### Issue: Database Connection Error
```
Solution: Check DATABASE_URL in .env
- Verify PostgreSQL is running
- Check credentials
- Ensure database exists
```

### Issue: Port Already in Use
```
Solution: Change port in .env
- Backend: Change PORT=3001
- Frontend: Vite auto-selects next available
```

### Issue: CORS Error
```
Solution: Verify backend is running
- Check http://localhost:3000/health
- Verify VITE_API_URL in frontend .env
```

### Issue: Seed Script Fails
```
Solution: Run migrations first
npm run db:migrate
npm run db:seed
```

### Issue: Module Not Found
```
Solution: Install dependencies
npm install
```

## Performance Tips

### Backend
- Queries are optimized (single query for products)
- Use indexes for filtering
- Transactions ensure data consistency
- Connection pooling via Prisma

### Frontend
- React Query caches data
- Components memoized to prevent re-renders
- Lazy loading of components
- Optimistic updates

## Testing

### Run Tests
```bash
cd backend
npm run test
```

### Watch Mode
```bash
cd backend
npm run test:watch
```

### Test File Location
```
backend/src/services/__tests__/transferService.test.ts
```

## Debugging

### Backend Logs
```bash
# View logs in console during development
npm run dev

# Check log files in production
tail -f logs/error.log
tail -f logs/combined.log
```

### Frontend Logs
```bash
# Browser console (F12)
# Check Network tab for API calls
# Check Application tab for React Query cache
```

### Database
```bash
# Open Prisma Studio
npx prisma studio

# Query database directly
psql inventory_db
```

## Useful Links

- [Express.js Docs](https://expressjs.com/)
- [Prisma Docs](https://www.prisma.io/docs/)
- [React Docs](https://react.dev/)
- [React Query Docs](https://tanstack.com/query/latest)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [TypeScript Docs](https://www.typescriptlang.org/docs/)
- [Zod Docs](https://zod.dev/)

## Deployment Checklist

- [ ] Set production environment variables
- [ ] Build backend: `npm run build`
- [ ] Build frontend: `npm run build`
- [ ] Run database migrations
- [ ] Seed database (if needed)
- [ ] Test API endpoints
- [ ] Test frontend UI
- [ ] Check logs for errors
- [ ] Monitor performance
- [ ] Set up backups

## Git Workflow

```bash
# Clone repository
git clone <repo-url>
cd inventory-system

# Create feature branch
git checkout -b feature/my-feature

# Make changes
git add .
git commit -m "feat: add new feature"

# Push to remote
git push origin feature/my-feature

# Create pull request
# Review and merge
```

## Documentation Files

- **README.md** - Project overview
- **SETUP.md** - Setup instructions
- **API.md** - API documentation
- **ARCHITECTURE.md** - System design
- **PROJECT_SUMMARY.md** - Project summary
- **QUICK_REFERENCE.md** - This file

## Key Concepts

### Clean Architecture
- Controllers handle HTTP
- Services contain business logic
- Repositories handle data access
- Clear separation of concerns

### Type Safety
- Full TypeScript implementation
- Zod for runtime validation
- Type-safe database queries
- Type-safe API responses

### Performance
- Single query for products
- Max 2 queries for shortages
- Indexed database queries
- React Query caching

### Error Handling
- Centralized error handler
- Validation error formatting
- Transaction rollback
- Structured error responses

## Quick Troubleshooting

1. **Backend won't start?**
   - Check DATABASE_URL
   - Run migrations: `npm run db:migrate`
   - Check port availability

2. **Frontend won't load?**
   - Check backend is running
   - Check VITE_API_URL
   - Clear browser cache

3. **Database issues?**
   - Check PostgreSQL is running
   - Run migrations: `npm run db:migrate`
   - Check database exists

4. **Tests failing?**
   - Install dependencies: `npm install`
   - Check mocks are set up
   - Review test output

## Performance Monitoring

### Backend
- Check response times in logs
- Monitor database query times
- Track error rates

### Frontend
- Check React Query cache
- Monitor component re-renders
- Check network requests

### Database
- Monitor query performance
- Check index usage
- Monitor connection pool

---

**Need more help?** Check the full documentation files or review the codebase comments.
