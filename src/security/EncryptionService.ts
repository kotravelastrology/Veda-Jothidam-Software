// Encryption Service
// Handles client-side encryption for sensitive data using Web Crypto API

export interface EncryptedPayload {
  ciphertext: string; // base64
  iv: string; // base64
  algorithm: string;
}

/**
 * Encryption Service
 * AES-GCM encryption/decryption using the Web Crypto API for sensitive
 * data (birth details, personal notes) before storage or transmission
 */
export class EncryptionService {
  private algorithm = 'AES-GCM';
  private keyCache: Map<string, CryptoKey> = new Map();

  /**
   * Derive encryption key from password using PBKDF2
   */
  async deriveKey(password: string, salt: string): Promise<CryptoKey> {
    const cacheKey = `${password}:${salt}`;
    if (this.keyCache.has(cacheKey)) {
      return this.keyCache.get(cacheKey)!;
    }

    const encoder = new TextEncoder();
    const passwordKey = await crypto.subtle.importKey(
      'raw',
      encoder.encode(password),
      'PBKDF2',
      false,
      ['deriveKey']
    );

    const key = await crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: encoder.encode(salt),
        iterations: 100000,
        hash: 'SHA-256',
      },
      passwordKey,
      { name: this.algorithm, length: 256 },
      false,
      ['encrypt', 'decrypt']
    );

    this.keyCache.set(cacheKey, key);
    return key;
  }

  /**
   * Generate random encryption key
   */
  async generateKey(): Promise<CryptoKey> {
    return crypto.subtle.generateKey(
      { name: this.algorithm, length: 256 },
      true,
      ['encrypt', 'decrypt']
    );
  }

  /**
   * Encrypt plaintext data
   */
  async encrypt(plaintext: string, key: CryptoKey): Promise<EncryptedPayload> {
    const encoder = new TextEncoder();
    const iv = crypto.getRandomValues(new Uint8Array(12));

    const ciphertextBuffer = await crypto.subtle.encrypt(
      { name: this.algorithm, iv },
      key,
      encoder.encode(plaintext)
    );

    return {
      ciphertext: this.bufferToBase64(ciphertextBuffer),
      iv: this.bufferToBase64(iv),
      algorithm: this.algorithm,
    };
  }

  /**
   * Decrypt encrypted payload
   */
  async decrypt(payload: EncryptedPayload, key: CryptoKey): Promise<string> {
    const ciphertext = this.base64ToBuffer(payload.ciphertext);
    const iv = this.base64ToBuffer(payload.iv);

    const plaintextBuffer = await crypto.subtle.decrypt(
      { name: this.algorithm, iv },
      key,
      ciphertext
    );

    return new TextDecoder().decode(plaintextBuffer);
  }

  /**
   * Encrypt object as JSON
   */
  async encryptObject<T>(obj: T, key: CryptoKey): Promise<EncryptedPayload> {
    return this.encrypt(JSON.stringify(obj), key);
  }

  /**
   * Decrypt to object
   */
  async decryptObject<T>(payload: EncryptedPayload, key: CryptoKey): Promise<T> {
    const json = await this.decrypt(payload, key);
    return JSON.parse(json);
  }

  /**
   * Export key to base64 for storage (e.g. session-scoped)
   */
  async exportKey(key: CryptoKey): Promise<string> {
    const exported = await crypto.subtle.exportKey('raw', key);
    return this.bufferToBase64(exported);
  }

  /**
   * Import key from base64
   */
  async importKey(base64Key: string): Promise<CryptoKey> {
    const keyBuffer = this.base64ToBuffer(base64Key);
    return crypto.subtle.importKey(
      'raw',
      keyBuffer,
      { name: this.algorithm },
      false,
      ['encrypt', 'decrypt']
    );
  }

  /**
   * Generate secure random salt
   */
  generateSalt(): string {
    const salt = crypto.getRandomValues(new Uint8Array(16));
    return this.bufferToBase64(salt);
  }

  /**
   * Hash data using SHA-256 (for integrity checks, not passwords)
   */
  async sha256(data: string): Promise<string> {
    const encoder = new TextEncoder();
    const hashBuffer = await crypto.subtle.digest('SHA-256', encoder.encode(data));
    return this.bufferToBase64(hashBuffer);
  }

  /**
   * Constant-time string comparison (prevents timing attacks)
   */
  constantTimeCompare(a: string, b: string): boolean {
    if (a.length !== b.length) return false;
    let result = 0;
    for (let i = 0; i < a.length; i++) {
      result |= a.charCodeAt(i) ^ b.charCodeAt(i);
    }
    return result === 0;
  }

  // ==================== PRIVATE METHODS ====================

  private bufferToBase64(buffer: ArrayBuffer | Uint8Array): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    bytes.forEach(b => (binary += String.fromCharCode(b)));
    return btoa(binary);
  }

  private base64ToBuffer(base64: string): ArrayBuffer {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
  }
}

let encryptionService: EncryptionService | null = null;

export function getEncryptionService(): EncryptionService {
  if (!encryptionService) {
    encryptionService = new EncryptionService();
  }
  return encryptionService;
}
