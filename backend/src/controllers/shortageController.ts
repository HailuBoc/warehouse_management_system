import { Request, Response, NextFunction } from 'express';
import { shortageService } from '../services/shortageService.js';
import { ApiResponse, ShortageDTO } from '../types/index.js';

export class ShortageController {
  async getShortages(
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const shortages = await shortageService.getShortages();
      const response: ApiResponse<ShortageDTO[]> = {
        success: true,
        data: shortages,
      };
      res.json(response);
    } catch (error) {
      next(error);
    }
  }
}

export const shortageController = new ShortageController();
