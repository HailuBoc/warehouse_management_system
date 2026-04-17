// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
}

// Product types
export interface Product {
  id: number;
  name: string;
  categoryName: string;
  warehouseAQty: number;
  warehouseBQty: number;
  reorderLevel: number;
}

export type ProductStatus = 'ok' | 'shortage';

export interface ProductWithStatus extends Product {
  status: ProductStatus;
}

// Shortage types
export interface Shortage {
  productId: number;
  productName: string;
  shortageWarehouseId: number;
  shortageQuantity: number;
  reorderLevel: number;
  suggestedSourceWarehouseId?: number;
}

// Transfer types
export interface TransferRequest {
  productId: number;
  fromWarehouseId: number;
  toWarehouseId: number;
  quantity: number;
}

export interface TransferResponse {
  success: boolean;
  message: string;
  stockMovementIds: number[];
}

// Stock movement types
export interface StockMovement {
  id: number;
  productId: number;
  fromWarehouseId: number;
  toWarehouseId: number;
  quantity: number;
  type: 'in' | 'out';
  createdAt: string;
}
