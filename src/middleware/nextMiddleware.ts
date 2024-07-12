import { NextFunction, Request, Response } from 'express';

const protectedRoutes = ['/dashboard', '/product/ixone'];
const publicRoutes = ['/login', '/signup'];

export const nextMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { token } = req.cookies;

  const path = req.path;

  return next();

  // next();

  // if (path?.startsWith('_next/')) {
  //   next();
  //   return;
  // }

  // const isPublicRoute = publicRoutes.includes(path);

  // if (isPublicRoute) {
  //   next();
  //   return;
  // }

  // const isProtectedRoute =
  //   protectedRoutes.findIndex((protectedRouteItem: string) =>
  //     path.startsWith(protectedRouteItem)
  //   ) !== -1 || path === '/';

  // if (isProtectedRoute && !token) {
  //   console.log('come here');

  //   return res.redirect('/login');
  // } else {
  //   next();
  // }
};
