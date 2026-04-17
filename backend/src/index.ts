import express from 'express';
import cors from 'cors';
import { config } from './config/env.js';
import logger from './config/logger.js';
import { requestLogger } from './middlewares/requestLogger.js';
import { errorHandler } from './middlewares/errorHandler.js';
import routes from './routes/index.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(requestLogger);

// Routes
app.use('/api', routes);

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling
app.use(errorHandler);

// Start server
const port = config.port;
app.listen(port, () => {
  logger.info(`Server running on port ${port}`, {
    environment: config.nodeEnv,
  });
});

export default app;
