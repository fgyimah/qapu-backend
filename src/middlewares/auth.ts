import { Request, Response, NextFunction } from 'express';
import { Unauthorized } from 'http-errors';
import { JsonWebTokenError } from 'jsonwebtoken';
import { decodeToken, JWTPayload, signToken } from '../utils/security';

export enum AuthRole {
  SUPER_ADMIN = 'SUPER_ADMIN_ACCESSIBLE',
  ADMIN = 'ADMIN_ACCESSIBLE',
}

export const NEW_TOKEN_REFRESH_HEADER = 'X-Token-Refresh';

/**
 * Security higher-order-function that returns a middleware which blocks
 * access to the resource if the correct access role is not provided.
 *
 * Verifies using the `Authorization` header
 * @param roles
 */
export const secure = (roles: AuthRole[] | AuthRole) => {
  roles = typeof roles === 'string' ? [roles] : roles;

  return async function verifyBearer(req: Request, res: Response, next: NextFunction) {
    try {
      const bearer = req.headers['authorization'];

      if (typeof bearer !== 'string') {
        throw new JsonWebTokenError('Authorization signature required');
      }

      const bearerArray = bearer.split(' ');
      const token = bearerArray.length === 2 ? bearerArray[1] : '';

      const decoded: JWTPayload = await decodeToken(token);
      if (!roles.includes(decoded.txn)) {
        throw new Unauthorized('Not authorized to access this resource');
      }

      res.locals.jwt = decoded;
      if (Date.now() - decoded.iat > 21600000) {
        const newToken = signToken(decoded.jti, decoded.txn);
        res.set(NEW_TOKEN_REFRESH_HEADER, newToken);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
