import { describe, it, expect, vi, beforeEach } from 'vitest';
import { transferService } from '../transferService.js';
import { transferRepository } from '../../repositories/transferRepository.js';
import { stockRepository } from '../../repositories/stockRepository.js';
import { AppError } from '../../types/index.js';

vi.mock('../../repositories/transferRepository.js');
vi.mock('../../repositories/stockRepository.js');
vi.mock('../../config/logger.js', () => ({
  default: {
    info: vi.fn(),
    error: vi.fn(),
  },
}));

describe('TransferService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should execute transfer successfully', async () => {
    const mockTransferResult = {
      success: true,
      message: 'Successfully transferred 10 units',
      stockMovementIds: [1, 2],
    };

    vi.mocked(stockRepository.getStock).mockResolvedValue(20);
    vi.mocked(transferRepository.executeTransfer).mockResolvedValue(
      mockTransferResult
    );

    const result = await transferService.executeTransfer({
      productId: 1,
      fromWarehouseId: 1,
      toWarehouseId: 2,
      quantity: 10,
    });

    expect(result).toEqual(mockTransferResult);
    expect(transferRepository.executeTransfer).toHaveBeenCalledWith(
      1,
      1,
      2,
      10
    );
  });

  it('should throw error when source and destination are same', async () => {
    await expect(
      transferService.executeTransfer({
        productId: 1,
        fromWarehouseId: 1,
        toWarehouseId: 1,
        quantity: 10,
      })
    ).rejects.toThrow(AppError);
  });

  it('should throw error when insufficient stock', async () => {
    vi.mocked(stockRepository.getStock).mockResolvedValue(5);

    await expect(
      transferService.executeTransfer({
        productId: 1,
        fromWarehouseId: 1,
        toWarehouseId: 2,
        quantity: 10,
      })
    ).rejects.toThrow(AppError);
  });
});
