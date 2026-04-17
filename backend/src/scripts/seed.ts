import { PrismaClient } from '@prisma/client';
import logger from '../config/logger.js';

const prisma = new PrismaClient();

async function main() {
  try {
    logger.info('Starting database seed...');

    // Clear existing data
    await prisma.stockMovement.deleteMany();
    await prisma.stock.deleteMany();
    await prisma.product.deleteMany();
    await prisma.warehouse.deleteMany();
    await prisma.category.deleteMany();

    // Create categories
    const electronics = await prisma.category.create({
      data: { name: 'Electronics' },
    });

    const furniture = await prisma.category.create({
      data: { name: 'Furniture' },
    });

    const supplies = await prisma.category.create({
      data: { name: 'Office Supplies' },
    });

    logger.info('Created categories');

    // Create exactly 2 warehouses
    const warehouseA = await prisma.warehouse.create({
      data: { name: 'Warehouse A' },
    });

    const warehouseB = await prisma.warehouse.create({
      data: { name: 'Warehouse B' },
    });

    logger.info('Created warehouses');

    // Create products with various stock scenarios
    const products = [
      {
        name: 'Laptop',
        categoryId: electronics.id,
        stocks: [
          { warehouseId: warehouseA.id, quantity: 5, reorderLevel: 10 }, // Shortage
          { warehouseId: warehouseB.id, quantity: 15, reorderLevel: 10 }, // OK
        ],
      },
      {
        name: 'Monitor',
        categoryId: electronics.id,
        stocks: [
          { warehouseId: warehouseA.id, quantity: 20, reorderLevel: 10 }, // OK
          { warehouseId: warehouseB.id, quantity: 3, reorderLevel: 10 }, // Shortage
        ],
      },
      {
        name: 'Desk',
        categoryId: furniture.id,
        stocks: [
          { warehouseId: warehouseA.id, quantity: 2, reorderLevel: 5 }, // Shortage
          { warehouseId: warehouseB.id, quantity: 1, reorderLevel: 5 }, // Shortage
        ],
      },
      {
        name: 'Office Chair',
        categoryId: furniture.id,
        stocks: [
          { warehouseId: warehouseA.id, quantity: 12, reorderLevel: 8 }, // OK
          { warehouseId: warehouseB.id, quantity: 25, reorderLevel: 8 }, // OK
        ],
      },
      {
        name: 'Pen Set',
        categoryId: supplies.id,
        stocks: [
          { warehouseId: warehouseA.id, quantity: 100, reorderLevel: 50 }, // OK
          { warehouseId: warehouseB.id, quantity: 30, reorderLevel: 50 }, // Shortage
        ],
      },
      {
        name: 'Notebook',
        categoryId: supplies.id,
        stocks: [
          { warehouseId: warehouseA.id, quantity: 15, reorderLevel: 30 }, // Shortage
          { warehouseId: warehouseB.id, quantity: 80, reorderLevel: 30 }, // OK
        ],
      },
      {
        name: 'Keyboard',
        categoryId: electronics.id,
        stocks: [
          { warehouseId: warehouseA.id, quantity: 8, reorderLevel: 15 }, // Shortage
          { warehouseId: warehouseB.id, quantity: 5, reorderLevel: 15 }, // Shortage
        ],
      },
      {
        name: 'Mouse',
        categoryId: electronics.id,
        stocks: [
          { warehouseId: warehouseA.id, quantity: 50, reorderLevel: 20 }, // OK
          { warehouseId: warehouseB.id, quantity: 10, reorderLevel: 20 }, // Shortage
        ],
      },
    ];

    for (const productData of products) {
      const product = await prisma.product.create({
        data: {
          name: productData.name,
          categoryId: productData.categoryId,
        },
      });

      for (const stockData of productData.stocks) {
        await prisma.stock.create({
          data: {
            productId: product.id,
            warehouseId: stockData.warehouseId,
            quantity: stockData.quantity,
            reorderLevel: stockData.reorderLevel,
          },
        });
      }
    }

    logger.info('Created products and stock records');

    // Create some stock movements for history
    const laptop = await prisma.product.findFirst({
      where: { name: 'Laptop' },
    });

    if (laptop) {
      await prisma.stockMovement.create({
        data: {
          productId: laptop.id,
          fromWarehouseId: warehouseB.id,
          toWarehouseId: warehouseA.id,
          quantity: 5,
          type: 'in',
        },
      });

      await prisma.stockMovement.create({
        data: {
          productId: laptop.id,
          fromWarehouseId: warehouseB.id,
          toWarehouseId: warehouseA.id,
          quantity: 5,
          type: 'out',
        },
      });
    }

    logger.info('Created stock movements');
    logger.info('Database seed completed successfully');
  } catch (error) {
    logger.error('Error seeding database', { error });
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main();
