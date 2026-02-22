import { randomBytes, scryptSync, timingSafeEqual } from 'crypto';

const SCRYPT_KEYLEN = 64;

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex');
  const derived = scryptSync(password, salt, SCRYPT_KEYLEN).toString('hex');
  return `${salt}:${derived}`;
}

export function verifyPassword(password: string, encoded: string): boolean {
  const [salt, digest] = encoded.split(':');
  if (!salt || !digest) {
    return false;
  }

  const computed = scryptSync(password, salt, SCRYPT_KEYLEN);
  const provided = Buffer.from(digest, 'hex');

  if (computed.length !== provided.length) {
    return false;
  }

  return timingSafeEqual(computed, provided);
}
