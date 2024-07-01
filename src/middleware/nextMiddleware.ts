import { NextFunction, Request, Response } from 'express';

const protectedRoutes = ['/dashboard', '/'];
const publicRoutes = ['/login', '/signup'];

export const nextMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { token } = req.cookies;

  const path = req.path;

  // return next();

  if (path?.startsWith('_next/')) {
    next();
    return;
  }

  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);

  if (isProtectedRoute && !token) {
    return res.redirect('/login');
  }

  next();
};
