import CryptoJS from 'crypto-js';
import { testConfig } from '@/testConfig';

/**
 * Utility class for encryption and decryption operations
 * Uses AES encryption with configurable key
 */
export class CryptoUtils {
    private static readonly KEY = testConfig.encryptionKey;

    /**
     * Encrypt a plain text string
     * @param plainText - Text to encrypt
     * @returns Encrypted cipher text
     */
    static encrypt(plainText: string): string {
        try {
            return CryptoJS.AES.encrypt(plainText, this.KEY).toString();
        } catch (error) {
            throw new Error(`Encryption failed: ${error}`);
        }
    }

    /**
     * Decrypt a cipher text string
     * @param cipherText - Encrypted text to decrypt
     * @returns Decrypted plain text
     */
    static decrypt(cipherText: string): string {
        try {
            const bytes = CryptoJS.AES.decrypt(cipherText, this.KEY);
            const decrypted = bytes.toString(CryptoJS.enc.Utf8);

            if (!decrypted) {
                throw new Error('Decryption resulted in empty string - possibly wrong key');
            }

            return decrypted;
        } catch (error) {
            throw new Error(`Decryption failed: ${error}`);
        }
    }

    /**
     * Encrypt with custom key (use sparingly, prefer default key from config)
     * @param plainText - Text to encrypt
     * @param customKey - Custom encryption key
     * @returns Encrypted cipher text
     */
    static encryptWithKey(plainText: string, customKey: string): string {
        try {
            return CryptoJS.AES.encrypt(plainText, customKey).toString();
        } catch (error) {
            throw new Error(`Encryption with custom key failed: ${error}`);
        }
    }

    /**
     * Decrypt with custom key (use sparingly, prefer default key from config)
     * @param cipherText - Encrypted text to decrypt
     * @param customKey - Custom encryption key
     * @returns Decrypted plain text
     */
    static decryptWithKey(cipherText: string, customKey: string): string {
        try {
            const bytes = CryptoJS.AES.decrypt(cipherText, customKey);
            const decrypted = bytes.toString(CryptoJS.enc.Utf8);

            if (!decrypted) {
                throw new Error('Decryption resulted in empty string - possibly wrong key');
            }

            return decrypted;
        } catch (error) {
            throw new Error(`Decryption with custom key failed: ${error}`);
        }
    }

    /**
     * Generate a hash of a string (useful for comparing values without storing plain text)
     * @param text - Text to hash
     * @returns SHA256 hash
     */
    static hash(text: string): string {
        return CryptoJS.SHA256(text).toString();
    }
}

