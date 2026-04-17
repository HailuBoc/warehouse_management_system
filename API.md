# API Documentation

## Base URL

```
http://localhost:3000/api
```

## Response Format

All responses follow a consistent format:

### Success Response
```json
{
  "success": true,
  "data": {}
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message",
    "details": {}
  }
}
```

## Endpoints

### Health Check

#### GET /health

Check if the API is running.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-04-17T10:00:00.000Z"
}
```

---

### Products

#### GET /api/products

Get all products with their stock levels across warehouses.

**Query Parameters:** None

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Laptop",
      "categoryName": "Electronics",
      "warehouseAQty": 5,
      "warehouseBQty": 15,
      "reorderLevel": 10
    },
    {
      "id": 2,
      "name": "Monitor",
      "categoryName": "Electronics",
      "warehouseAQty": 20,
      "warehouseBQty": 3,
      "reorderLevel": 10
    }
  ]
}
```

**Performance Notes:**
- Uses single optimized SQL query with conditional aggregation
- No N+1 queries
- Indexed on product_id and warehouse_id
- Response is flat and frontend-ready

**Example:**
```bash
curl http://localhost:3000/api/products
```

---

#### GET /api/products/:id

Get a single product with stock levels.

**Path Parameters:**
- `id` (number): Product ID

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Laptop",
    "categoryName": "Electronics",
    "warehouseAQty": 5,
    "warehouseBQty": 15,
    "reorderLevel": 10
  }
}
```

**Error Responses:**
- `404 Not Found`: Product does not exist
- `400 Bad Request`: Invalid product ID

**Example:**
```bash
curl http://localhost:3000/api/products/1
```

---

### Shortages

#### GET /api/report/shortages

Get all products with stock shortages (quantity < reorder_level).

**Query Parameters:** None

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "productId": 1,
      "productName": "Laptop",
      "shortageWarehouseId": 1,
      "shortageQuantity": 5,
      "reorderLevel": 10,
      "suggestedSourceWarehouseId": 2
    },
    {
      "productId": 2,
      "productName": "Monitor",
      "shortageWarehouseId": 2,
      "shortageQuantity": 7,
      "reorderLevel": 10,
      "suggestedSourceWarehouseId": 1
    },
    {
      "productId": 3,
      "productName": "Desk",
      "shortageWarehouseId": 1,
      "shortageQuantity": 3,
      "reorderLevel": 5,
      "suggestedSourceWarehouseId": null
    }
  ]
}
```

**Response Fields:**
- `productId`: ID of the product with shortage
- `productName`: Name of the product
- `shortageWarehouseId`: Warehouse ID where shortage exists
- `shortageQuantity`: How many units below reorder level
- `reorderLevel`: The reorder threshold
- `suggestedSourceWarehouseId`: Warehouse with surplus (if available), null otherwise

**Performance Notes:**
- Maximum 2 optimized queries
- Uses CTEs for efficient shortage detection
- No iteration over result sets in application code
- Optimized for large datasets

**Example:**
```bash
curl http://localhost:3000/api/report/shortages
```

---

### Transfers

#### POST /api/transfer

Execute a stock transfer between warehouses.

**Request Body:**
```json
{
  "productId": 1,
  "fromWarehouseId": 2,
  "toWarehouseId": 1,
  "quantity": 5
}
```

**Request Fields:**
- `productId` (number, required): Product ID to transfer
- `fromWarehouseId` (number, required): Source warehouse ID
- `toWarehouseId` (number, required): Destination warehouse ID
- `quantity` (number, required): Quantity to transfer (must be positive)

**Validation Rules:**
- `quantity` must be a positive integer
- `fromWarehouseId` and `toWarehouseId` must be different
- Source warehouse must have sufficient stock
- All IDs must be positive integers

**Response (Success):**
```json
{
  "success": true,
  "data": {
    "success": true,
    "message": "Successfully transferred 5 units of product 1",
    "stockMovementIds": [42, 43]
  }
}
```

**Response Fields:**
- `success`: Transfer completed successfully
- `message`: Human-readable confirmation
- `stockMovementIds`: IDs of the two stock movement records created

**Error Responses:**

1. **400 Bad Request - Same Warehouse:**
```json
{
  "success": false,
  "error": {
    "code": "INVALID_TRANSFER",
    "message": "Source and destination warehouses must be different"
  }
}
```

2. **400 Bad Request - Insufficient Stock:**
```json
{
  "success": false,
  "error": {
    "code": "INSUFFICIENT_STOCK",
    "message": "Insufficient stock in source warehouse. Available: 3, Requested: 5",
    "details": {
      "available": 3,
      "requested": 5
    }
  }
}
```

3. **400 Bad Request - Validation Error:**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation failed",
    "details": {
      "quantity": "Quantity must be a positive integer",
      "fromWarehouseId": "From warehouse ID must be a positive integer"
    }
  }
}
```

4. **500 Internal Server Error:**
```json
{
  "success": false,
  "error": {
    "code": "TRANSFER_FAILED",
    "message": "Failed to execute transfer"
  }
}
```

**Execution Details:**
- All operations wrapped in database transaction
- Decreases stock from source warehouse
- Increases stock in destination warehouse
- Creates two stock_movements records:
  - One with type "out" for source
  - One with type "in" for destination
- Automatic rollback on any error

**Example:**
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

---

## Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `VALIDATION_ERROR` | 400 | Request validation failed |
| `INVALID_TRANSFER` | 400 | Transfer validation failed (same warehouse, etc.) |
| `INSUFFICIENT_STOCK` | 400 | Source warehouse doesn't have enough stock |
| `NOT_FOUND` | 404 | Resource not found |
| `TRANSFER_FAILED` | 500 | Transfer execution failed |
| `INTERNAL_SERVER_ERROR` | 500 | Unexpected server error |

---

## Rate Limiting

Currently no rate limiting is implemented. For production, consider adding:
- Request rate limiting per IP
- API key-based rate limiting
- Exponential backoff for retries

---

## Authentication

Currently no authentication is implemented. For production, add:
- JWT token-based authentication
- API key authentication
- Role-based access control (RBAC)

---

## CORS

CORS is enabled for all origins in development. For production:
- Restrict to specific domains
- Use environment-based configuration

---

## Pagination (Future)

Products endpoint will support pagination:
```
GET /api/products?skip=0&take=10
```

---

## Filtering (Future)

Products endpoint will support filtering:
```
GET /api/products?categoryId=1
```

---

## Stock Movement History (Future)

```
GET /api/stock-movements
GET /api/stock-movements/:productId
```

---

## Testing the API

### Using curl

```bash
# Get all products
curl http://localhost:3000/api/products

# Get product by ID
curl http://localhost:3000/api/products/1

# Get shortages
curl http://localhost:3000/api/report/shortages

# Transfer stock
curl -X POST http://localhost:3000/api/transfer \
  -H "Content-Type: application/json" \
  -d '{
    "productId": 1,
    "fromWarehouseId": 2,
    "toWarehouseId": 1,
    "quantity": 5
  }'
```

### Using Postman

1. Create a new collection
2. Add requests for each endpoint
3. Set base URL: `http://localhost:3000/api`
4. Test with provided examples

### Using JavaScript/Fetch

```javascript
// Get products
fetch('http://localhost:3000/api/products')
  .then(res => res.json())
  .then(data => console.log(data));

// Transfer stock
fetch('http://localhost:3000/api/transfer', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    productId: 1,
    fromWarehouseId: 2,
    toWarehouseId: 1,
    quantity: 5
  })
})
  .then(res => res.json())
  .then(data => console.log(data));
```

---

## Performance Characteristics

### Products Endpoint
- **Query Count**: 1
- **Response Time**: < 50ms (typical)
- **Scalability**: O(n) where n = number of products

### Shortages Endpoint
- **Query Count**: 2 (maximum)
- **Response Time**: < 100ms (typical)
- **Scalability**: O(n) where n = number of products with shortages

### Transfer Endpoint
- **Query Count**: 3-4 (within transaction)
- **Response Time**: < 200ms (typical)
- **Scalability**: O(1) - constant time operation

---

## Changelog

### Version 1.0.0
- Initial release
- Products endpoint with single query optimization
- Shortages endpoint with CTE optimization
- Transfer endpoint with transaction support
- Full TypeScript implementation
- Comprehensive error handling
