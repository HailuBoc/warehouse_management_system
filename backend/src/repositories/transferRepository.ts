import { PrismaClient } from '@prisma/client';
import { TransferResponseDTO } from '../types/index.js';

const prisma = new PrismaClient();

export class TransferRepository {
  /**
   * Execute a stock transfer with transaction
   * Decreases stock from source, increases in destination, and records movements
   */
  async executeTransfer(
    productId: number,
    fromWarehouseId: number,
    toWarehouseId: number,
    quantity: number
  ): Promise<TransferResponseDTO> {
    const result = await prisma.$transaction(async (tx) => {
      // Verify source has enough stock
      const sourceStock = await tx.stock.findUnique({
        where: {
          productId_warehouseId: {
            productId,
            warehouseId: fromWarehouseId,
          },
        },
      });

      if (!sourceStock || sourceStock.quantity < quantity) {
        throw new Error('INSUFFICIENT_STOCK');
      }

      // Decrease source stock
      await tx.stock.update({
        where: {
          productId_warehouseId: {
            productId,
            warehouseId: fromWarehouseId,
          },
        },
        data: {
          quantity: {
            decrement: quantity,
          },
        },
      });

      // Increase destination stock
      await tx.stock.update({
        where: {
          productId_warehouseId: {
            productId,
            warehouseId: toWarehouseId,
          },
        },
        data: {
          quantity: {
            increment: quantity,
          },
        },
      });

      // Record outgoing movement
      const outMovement = await tx.stockMovement.create({
        data: {
          productId,
          fromWarehouseId,
          toWarehouseId,
          quantity,
          type: 'out',
        },
      });

      // Record incoming movement
      const inMovement = await tx.stockMovement.create({
        data: {
          productId,
          fromWarehouseId,
          toWarehouseId,
          quantity,
          type: 'in',
        },
      });

      return {
        success: true,
        message: `Successfully transferred ${quantity} units of product ${productId}`,
        stockMovementIds: [outMovement.id, inMovement.id],
      };
    });

    return result;
  }
}

export const transferRepository = new TransferRepository();
