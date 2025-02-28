import { nanoid } from 'nanoid';

/**
 * Generate a unique ID
 */
export function generateId(prefix: string = ''): string {
  return `${prefix}${nanoid()}`;
}

/**
 * Format error messages for client consumption
 */
export function formatError(error: unknown): string {
  if (typeof error === 'string') {
    return error;
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'An unknown error occurred';
}

/**
 * Validate if a string is not empty
 */
export function isEmpty(value: string | null | undefined): boolean {
  return !value || value.trim() === '';
}

/**
 * Wait for a specified time (useful for debugging/testing)
 */
export function wait(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Safely parse JSON
 */
export function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json) as T;
  } catch {
    return fallback;
  }
} 