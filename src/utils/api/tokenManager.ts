// This module manages access and refresh tokens for API authentication.
// It provides methods to set, get, clear tokens, check authentication status, and refresh tokens when necessary.
// Recent update: improve to work with centralised API client.

import { api } from '@/lib/apiClient'; // Import the centralised API client for making requests


class TokenManager { // Singleton class to manage access and refresh tokens
  private static instance: TokenManager;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  private constructor() {
    this.loadTokensFromStorage();
  }

  static getInstance(): TokenManager { // Returns the singleton instance of TokenManager
    if (!TokenManager.instance) {
      TokenManager.instance = new TokenManager();
    }
    return TokenManager.instance;
  }

  private loadTokensFromStorage(): void { // Load tokens from localStorage if available
    if (typeof window !== 'undefined') {
      this.accessToken = localStorage.getItem('token');
      this.refreshToken = localStorage.getItem('refresh');
    }
  }

  setTokens(accessToken: string, refreshToken: string): void { // Set access and refresh tokens, keep them in local storage
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', accessToken);
      localStorage.setItem('refresh', refreshToken);
      this.setCookieTokens(accessToken, refreshToken); // Set cookies for tokens to use for server side request
    }
  }

  getAccessToken(): string | null { // get current access token
    return this.accessToken;
  }

  clearTokens(): void { // clear access and fresh tokens, removing them from local store
    this.accessToken = null;
    this.refreshToken = null;
    
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('refresh');
      this.clearCookieTokens(); // Clear cookies 
    }
  }

  private setCookieTokens(accessToken: string, refreshToken: string): void {
    if (typeof document !== 'undefined') {
      const expires = new Date();
      expires.setDate(expires.getDate() + 7); // set cookies exp to 7 days 

      document.cookie = `access_token=${accessToken}; expires=${expires.toUTCString()}; path=/; secure; SameSite=Strict`; // Set access token cookie
      document.cookie = `refresh_token=${refreshToken}; expires=${expires.toUTCString()}; path=/; secure; SameSite=Strict`; // Set refresh token cookie
    }
  }

  private clearCookieTokens(): void {
    if (typeof document !== 'undefined') {
      document.cookie = 'access_token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/'; // Clear access token cookie by setting an expired date
      document.cookie = 'refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/'; // Clear refresh token cookie by setting an expired date
    }
  }

  isAuthenticated(): boolean { // Check if user = auth
    return !!this.accessToken;
  }

  async ensureValidToken(): Promise<string | null> {
    if (!this.accessToken) {
      return null;
    }

    if (this.isTokenExpired(this.accessToken)) {
      await this.refreshAccessToken();
    }

    return this.accessToken;
  }

  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp < (currentTime + 300); // Refresh 5 minutes before expiry
    } catch {
      return true;
    }
  }

  private async refreshAccessToken(): Promise<void> { 
    if (!this.refreshToken) {
      throw new Error('No refresh token available');
    }
    
    try {
      const data = await api.post<{access: string}>(
        'token/refresh', 
        { refresh: this.refreshToken },
        { requiresAuth: false } 
      );
      
      if (data.access) {
        this.accessToken = data.access;
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', data.access);
        }
      } else {
        this.clearTokens();
        throw new Error('Invalid refresh response');
      }
    } catch (error) {
      this.clearTokens();
      throw error;
    }
  }
}

export const tokenManager = TokenManager.getInstance(); // Export the singleton instance for use 