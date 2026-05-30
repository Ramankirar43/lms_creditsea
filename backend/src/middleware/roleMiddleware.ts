import { NextFunction, Request, Response } from 'express';
import { Role } from '../types/enums';
import { ForbiddenError, UnauthorizedError } from '../utils/errors';

export function roleMiddleware(...allowedRoles: Role[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new UnauthorizedError());
      return;
    }

    const userRole = req.user.role;
    const effectiveRoles =
      userRole === Role.ADMIN ? [...allowedRoles, Role.ADMIN] : allowedRoles;

    if (!effectiveRoles.includes(userRole)) {
      next(new ForbiddenError());
      return;
    }

    next();
  };
}
