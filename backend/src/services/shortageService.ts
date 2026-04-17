import { ShortageDTO, AppError } from '../types/index.js';
import { shortageRepository } from '../repositories/shortageRepository.js';
import logger from '../config/logger.js';

export class ShortageService {
  /**
   * Get all products with shortages
   */
  async getShortages(): Promise<ShortageDTO[]> {
    try {
      logger.info('Fetching shortages');
      const shortages = await shortageRepository.getShortages();
      logger.info(`Retrieved ${shortages.length} shortage records`);
      return shortages;
    } catch (error) {
      logger.error('Error fetching shortages', { error });
      throw error;
    }
  }
}

export const shortageService = new ShortageService();
