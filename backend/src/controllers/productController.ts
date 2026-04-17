import { Request, Response, NextFunction } from 'express';
import { productService } from '../services/productService.js';
import { ApiResponse, ProductDTO } from '../types/index.js';

export class ProductController {
  async getAll(
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const products = await productService.getAllProducts();
      const response: ApiResponse<ProductDTO[]> = {
        success: true,
        data: products,
      };
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  async getById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const productId = parseInt(id, 10);

      if (isNaN(productId)) {
        res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_ID',
            message: 'Product ID must be a valid number',
          },
        });
        return;
      }

      const product = await productService.getProductById(productId);

      if (!product) {
        res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Product not found',
          },
        });
        return;
      }

      const response: ApiResponse<ProductDTO> = {
        success: true,
        data: product,
      };
      res.json(response);
    } catch (error) {
      next(error);
    }
  }
}

export const productController = new ProductController();
