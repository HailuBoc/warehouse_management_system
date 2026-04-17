import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class StockRepository {
  /**
   * Get stock quantity for a product in a warehouse
   */
  async getStock(productId: number, warehouseId: number): Promise<number> {
    const stock = await prisma.stock.findUnique({
      where: {
        productId_warehouseId: {
          productId,
          warehouseId,
        },
      },
    });

    return stock?.quantity ?? 0;
  }

  /**
   * Update stock quantity
   */
  async updateStock(
    productId: number,
    warehouseId: number,
    quantity: number
  ): Promise<void> {
    await prisma.stock.update({
      where: {
        productId_warehouseId: {
          productId,
          warehouseId,
        },
      },
      data: {
        quantity,
      },
    });
  }

  /**
   * Get reorder level for a product in a warehouse
   */
  async getReorderLevel(productId: number, warehouseId: number): Promise<number> {
    const stock = await prisma.stock.findUnique({
      where: {
        productId_warehouseId: {
          productId,
          warehouseId,
        },
      },
    });

    return stock?.reorderLevel ?? 0;
  }
}

export const stockRepository = new StockRepository();
