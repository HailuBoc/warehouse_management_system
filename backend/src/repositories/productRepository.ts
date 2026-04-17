import { PrismaClient } from '@prisma/client';
import { ProductDTO } from '../types/index.js';

const prisma = new PrismaClient();

export class ProductRepository {
  /**
   * Get all products with stock levels from both warehouses
   * Uses Prisma query builder for reliability
   */
  async getAllProducts(): Promise<ProductDTO[]> {
    const products = await prisma.product.findMany({
      include: {
        category: true,
        stocks: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    return products.map((p) => {
      const warehouseAStock = p.stocks.find((s) => s.warehouseId === 1);
      const warehouseBStock = p.stocks.find((s) => s.warehouseId === 2);

      return {
        id: p.id,
        name: p.name,
        categoryName: p.category.name,
        warehouseAQty: warehouseAStock?.quantity ?? 0,
        warehouseBQty: warehouseBStock?.quantity ?? 0,
        reorderLevel: warehouseAStock?.reorderLevel ?? 0,
      };
    });
  }

  /**
   * Get product by ID with stock levels
   */
  async getProductById(productId: number): Promise<ProductDTO | null> {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        category: true,
        stocks: true,
      },
    });

    if (!product) return null;

    const warehouseAStock = product.stocks.find((s) => s.warehouseId === 1);
    const warehouseBStock = product.stocks.find((s) => s.warehouseId === 2);

    return {
      id: product.id,
      name: product.name,
      categoryName: product.category.name,
      warehouseAQty: warehouseAStock?.quantity ?? 0,
      warehouseBQty: warehouseBStock?.quantity ?? 0,
      reorderLevel: warehouseAStock?.reorderLevel ?? 0,
    };
  }
}

export const productRepository = new ProductRepository();
