import { z } from 'zod';

export const transferRequestSchema = z.object({
  productId: z.number().int().positive('Product ID must be a positive integer'),
  fromWarehouseId: z
    .number()
    .int()
    .positive('From warehouse ID must be a positive integer'),
  toWarehouseId: z
    .number()
    .int()
    .positive('To warehouse ID must be a positive integer'),
  quantity: z.number().int().positive('Quantity must be a positive integer'),
});

export const paginationSchema = z.object({
  skip: z.coerce.number().int().nonnegative().default(0),
  take: z.coerce.number().int().positive().max(100).default(10),
});

export const categoryFilterSchema = z.object({
  categoryId: z.coerce.number().int().positive().optional(),
});

export type TransferRequest = z.infer<typeof transferRequestSchema>;
export type PaginationParams = z.infer<typeof paginationSchema>;
export type CategoryFilter = z.infer<typeof categoryFilterSchema>;
