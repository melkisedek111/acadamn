import { Request, Response, NextFunction } from 'express';

export const loggingMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    console.log(`${req.method} ${req.originalUrl}`);

    next();
};