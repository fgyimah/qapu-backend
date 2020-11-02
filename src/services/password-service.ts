import { randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';
import { BadRequest } from 'http-errors';

const scryptAsync = promisify(scrypt);

export class PasswordService {
  static async toHash(password: string): Promise<string> {
    if (!password || !password.trim().length) {
      throw new BadRequest('Invalid password entered');
    }
    const salt = randomBytes(16).toString('hex');
    const buf = (await scryptAsync(password, salt, 64)) as Buffer;

    return `${buf.toString('hex')}.${salt}`;
  }

  static async compare(storedPassword: string, suppliedPassword: string): Promise<boolean> {
    const [hashedPassword, salt] = storedPassword.split('.');

    const buf = (await scryptAsync(suppliedPassword, salt, 64)) as Buffer;

    return buf.toString('hex') === hashedPassword;
  }
}
