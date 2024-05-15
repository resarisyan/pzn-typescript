import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { ResponseError } from '../handler/response-error';

export const errorMiddleware = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof ZodError) {
    res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: error.errors.map((err) => err.message),
    });
  } else if (error instanceof ResponseError) {
    res.status(error.status).json({
      success: false,
      message: error.message,
    });
  } else {
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};
