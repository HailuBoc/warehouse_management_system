import { ProductDTO } from '../types/index.js';
import { productRepository } from '../repositories/productRepository.js';
import logger from '../config/logger.js';

export class ProductService {
  /**
   * Get all products with their stock levels
   */
  async getAllProducts(): Promise<ProductDTO[]> {
    try {
      logger.info('Fetching all products');
      const products = await productRepository.getAllProducts();
      logger.info(`Retrieved ${products.length} products`);
      return products;
    } catch (error) {
      logger.error('Error fetching products', { error });
      throw error;
    }
  }

  /**
   * Get product by ID
   */
  async getProductById(productId: number): Promise<ProductDTO | null> {
    try {
      logger.info('Fetching product', { productId });
      const product = await productRepository.getProductById(productId);
      return product;
    } catch (error) {
      logger.error('Error fetching product', { productId, error });
      throw error;
    }
  }
}

export const productService = new ProductService();
