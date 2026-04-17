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
export interface ProductDTO {
  id: number;
  name: string;
  categoryName: string;
  warehouseAQty: number;
  warehouseBQty: number;
  reorderLevel: number;
}

// Shortage types
export interface ShortageDTO {
  productId: number;
  productName: string;
  shortageWarehouseId: number;
  shortageQuantity: number;
  reorderLevel: number;
  suggestedSourceWarehouseId?: number;
}

// Transfer types
export interface TransferRequestDTO {
  productId: number;
  fromWarehouseId: number;
  toWarehouseId: number;
  quantity: number;
}

export interface TransferResponseDTO {
  success: boolean;
  message: string;
  stockMovementIds: number[];
}

// Stock movement types
export interface StockMovementDTO {
  id: number;
  productId: number;
  fromWarehouseId: number;
  toWarehouseId: number;
  quantity: number;
  type: 'in' | 'out';
  createdAt: Date;
}

// Error types
export class AppError extends Error {
  constructor(
    public code: string,
    public statusCode: number,
    message: string,
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'AppError';
  }
}
