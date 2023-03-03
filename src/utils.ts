import crypto from 'crypto';

export function generatePasswordHash(
  password: string,
  encoding: crypto.BinaryToTextEncoding = 'hex',
) {
  const hasher = crypto.createHash('sha256');
  hasher.update(password);
  return hasher.digest('hex');
}
