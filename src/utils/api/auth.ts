// Legacy auth utilities - most functionality moved to tokenManager.ts
// Token manager dedicated ts was easier option, as I'm using JWT and nextauth

/**
 * @deprecated Use tokenManager.ensureValidToken() instead
 * This function is kept for backward compatibility
 * and for future reference. :)
 */

import { tokenManager } from './tokenManager';

export const refreshToken = async (): Promise<void> => {
  console.warn('refreshToken() is deprecated. Use tokenManager.ensureValidToken() instead.');
  
  try {
    await tokenManager.ensureValidToken();
  } catch (error) {
    throw new Error('Failed to refresh token');
  }
};

// All new code will use tokenManager directly