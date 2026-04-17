import { Request, Response, NextFunction } from 'express';
import { transferService } from '../services/transferService.js';
import { ApiResponse, TransferResponseDTO, TransferRequestDTO } from '../types/index.js';

export class TransferController {
  async transfer(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const transferRequest = req.body as TransferRequestDTO;
      const result = await transferService.executeTransfer(transferRequest);
      const response: ApiResponse<TransferResponseDTO> = {
        success: true,
        data: result,
      };
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }
}

export const transferController = new TransferController();
