import { TransferRequest, TransferResponseDTO, AppError } from '../types/index.js';
import { transferRepository } from '../repositories/transferRepository.js';
import { stockRepository } from '../repositories/stockRepository.js';
import logger from '../config/logger.js';

export class TransferService {
  /**
   * Validate and execute a stock transfer
   */
  async executeTransfer(request: TransferRequest): Promise<TransferResponseDTO> {
    const {
      productId,
      fromWarehouseId,
      toWarehouseId,
      quantity,
    } = request;

    try {
      // Validate source and destination differ
      if (fromWarehouseId === toWarehouseId) {
        throw new AppError(
          'INVALID_TRANSFER',
          400,
          'Source and destination warehouses must be different'
        );
      }

      // Validate source has enough stock
      const sourceStock = await stockRepository.getStock(
        productId,
        fromWarehouseId
      );

      if (sourceStock < quantity) {
        throw new AppError(
          'INSUFFICIENT_STOCK',
          400,
          `Insufficient stock in source warehouse. Available: ${sourceStock}, Requested: ${quantity}`,
          { available: sourceStock, requested: quantity }
        );
      }

      logger.info('Executing transfer', {
        productId,
        fromWarehouseId,
        toWarehouseId,
        quantity,
      });

      const result = await transferRepository.executeTransfer(
        productId,
        fromWarehouseId,
        toWarehouseId,
        quantity
      );

      logger.info('Transfer completed successfully', {
        productId,
        quantity,
        movementIds: result.stockMovementIds,
      });

      return result;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      if (error instanceof Error && error.message === 'INSUFFICIENT_STOCK') {
        throw new AppError(
          'INSUFFICIENT_STOCK',
          400,
          'Insufficient stock in source warehouse'
        );
      }

      logger.error('Error executing transfer', {
        productId,
        fromWarehouseId,
        toWarehouseId,
        quantity,
        error,
      });

      throw new AppError(
        'TRANSFER_FAILED',
        500,
        'Failed to execute transfer'
      );
    }
  }
}

export const transferService = new TransferService();
