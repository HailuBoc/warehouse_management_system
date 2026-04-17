import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError, ApiResponse } from '../types/index.js';
import logger from '../config/logger.js';

export const errorHandler = (
  err: Error | AppError | ZodError,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  logger.error('Error occurred', {
    error: err.message,
    stack: err.stack,
    type: err.constructor.name,
  });

  if (err instanceof AppError) {
    const response: ApiResponse<null> = {
      success: false,
      error: {
        code: err.code,
        message: err.message,
        details: err.details,
      },
    };
    return res.status(err.statusCode).json(response);
  }

  if (err instanceof ZodError) {
    const response: ApiResponse<null> = {
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Request validation failed',
        details: err.errors.reduce(
          (acc, error) => {
            const path = error.path.join('.');
            acc[path] = error.message;
            return acc;
          },
          {} as Record<string, string>
        ),
      },
    };
    return res.status(400).json(response);
  }

  const response: ApiResponse<null> = {
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred',
    },
  };
  res.status(500).json(response);
};
