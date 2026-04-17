import { Router } from 'express';
import { productController } from '../controllers/productController.js';
import { shortageController } from '../controllers/shortageController.js';
import { transferController } from '../controllers/transferController.js';
import { validateRequest } from '../middlewares/validation.js';
import { transferRequestSchema } from '../validators/index.js';

const router = Router();

// Product routes
router.get('/products', (req, res, next) =>
  productController.getAll(req, res, next)
);
router.get('/products/:id', (req, res, next) =>
  productController.getById(req, res, next)
);

// Shortage routes
router.get('/report/shortages', (req, res, next) =>
  shortageController.getShortages(req, res, next)
);

// Transfer routes
router.post(
  '/transfer',
  validateRequest(transferRequestSchema),
  (req, res, next) => transferController.transfer(req, res, next)
);

export default router;
