import { Request, Response, NextFunction } from 'express';

/**
 * @desc    Middleware to handle "Not Found" errors (404)
 * This runs if no other route matches.
 */
const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(444); // Note: 444 is a common non-standard code, 404 is standard
  next(error);
};

/**
 * @desc    Main Error Handler Middleware
 * This "catches" all errors thrown from other routes/middleware.
 * It formats them and sends them as a clean JSON response.
 */
const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  // Sometimes an error comes in with a 200 status code.
  // If so, set it to a 500 Internal Server Error.
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  // --- Mongoose Error Handling ---
  // Check for a Mongoose Bad ObjectId (CastError)
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    message = 'Resource not found';
    statusCode = 404;
  }

  // --- Send the final JSON response ---
  res.status(statusCode).json({
    message: message,
    // Include stack trace only when in development mode
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

export { notFound, errorHandler };