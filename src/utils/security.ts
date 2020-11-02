import jwt from 'jsonwebtoken';
import { AuthRole } from '../middlewares/auth';

const JWT_ISSUER = 'Partner Application';
const JWT_PAYLOAD_KEYS = ['iss', 'iat', 'jti', 'txn'];

export type JWTPayload = {
  jti: string;
  iss: string;
  iat: number;
  txn: AuthRole;
};

/**
 * Verify if the token passed to this method was signed in this application
 * @param token
 */
export async function decodeToken(token: string): Promise<JWTPayload> {
  const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

  if (typeof decoded !== 'object') {
    throw new jwt.JsonWebTokenError('jwt malformed');
  }

  const decodedKeys = Object.keys(decoded);
  const areEqual = decodedKeys.sort().toString() === JWT_PAYLOAD_KEYS.sort().toString();

  if (!areEqual || (decoded as JWTPayload).iss !== JWT_ISSUER) {
    throw new jwt.JsonWebTokenError('jwt malformed');
  }

  return decoded as JWTPayload;
}

export function signToken(id: string, role: AuthRole): string {
  const payload: JWTPayload = {
    jti: id,
    iss: JWT_ISSUER,
    iat: Date.now(),
    txn: role,
  };

  return jwt.sign(payload, process.env.JWT_SECRET as string);
}
