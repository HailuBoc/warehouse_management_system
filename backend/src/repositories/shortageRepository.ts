import { PrismaClient } from '@prisma/client';
import { ShortageDTO } from '../types/index.js';

const prisma = new PrismaClient();

export class ShortageRepository {
  /**
   * Get all products with shortages
   * Uses Prisma query builder for reliability
   */
  async getShortages(): Promise<ShortageDTO[]> {
    const stocks = await prisma.stock.findMany({
      where: {
        quantity: {
          lt: prisma.stock.fields.reorderLevel,
        },
      },
      include: {
        product: true,
      },
    });

    // Get all products with surplus for suggestions
    const surplusStocks = await prisma.stock.findMany({
      where: {
        quantity: {
          gt: prisma.stock.fields.reorderLevel,
        },
      },
    });

    // Build shortage list with suggestions
    const shortages: ShortageDTO[] = stocks.map((stock) => {
      const shortageQuantity = stock.reorderLevel - stock.quantity;

      // Find suggested source warehouse (different warehouse with surplus)
      const suggestedSource = surplusStocks.find(
        (s) =>
          s.productId === stock.productId &&
          s.warehouseId !== stock.warehouseId &&
          s.quantity > stock.reorderLevel
      );

      return {
        productId: stock.productId,
        productName: stock.product.name,
        shortageWarehouseId: stock.warehouseId,
        shortageQuantity,
        reorderLevel: stock.reorderLevel,
        suggestedSourceWarehouseId: suggestedSource?.warehouseId,
      };
    });

    return shortages.sort((a, b) => a.productId - b.productId);
  }
}

export const shortageRepository = new ShortageRepository();
