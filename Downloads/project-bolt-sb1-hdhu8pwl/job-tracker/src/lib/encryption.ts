import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12;

// Ensure we have a consistent encryption key
const KEY = process.env.ENCRYPTION_KEY 
  ? Buffer.from(process.env.ENCRYPTION_KEY, 'base64')
  : randomBytes(32);

if (!process.env.ENCRYPTION_KEY) {
  console.warn('No ENCRYPTION_KEY provided. Using random key. This will cause verification links to fail on server restart.');
}

export function encrypt(text: string): string {
  try {
    const iv = randomBytes(IV_LENGTH);
    const cipher = createCipheriv(ALGORITHM, KEY, iv);
    
    let encrypted = cipher.update(text, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    
    const authTag = cipher.getAuthTag();
    
    // Combine IV, encrypted data, and auth tag
    const combined = Buffer.concat([
      iv,
      Buffer.from(encrypted, 'base64'),
      authTag
    ]);
    
    return combined.toString('base64');
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt data');
  }
}

export function decrypt(encryptedData: string): string {
  try {
    const combined = Buffer.from(encryptedData, 'base64');
    
    // Extract IV, encrypted data, and auth tag
    const iv = combined.subarray(0, IV_LENGTH);
    const authTag = combined.subarray(combined.length - 16);
    const encrypted = combined.subarray(IV_LENGTH, combined.length - 16);
    
    const decipher = createDecipheriv(ALGORITHM, KEY, iv);
    decipher.setAuthTag(authTag);
    
    let decrypted = decipher.update(encrypted);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    
    return decrypted.toString('utf8');
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt data');
  }
} 