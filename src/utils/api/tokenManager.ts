// This module manages access and refresh tokens for API authentication.
// It provides methods to set, get, clear tokens, check authentication status, and refresh tokens when necessary.

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

    const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'; // Base URL for API requests
    
    const response = await fetch(`${BASE_URL}/api/token/refresh/`, { // Refresh access token using the refresh token
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh: this.refreshToken }),
    });

    if (!response.ok) {
      this.clearTokens();
      throw new Error('Failed to refresh token');
    }

    const data = await response.json();
    
    if (data.access) {
      this.accessToken = data.access;
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', data.access); // Store new access token
      }
    } else {
      this.clearTokens();
      throw new Error('Invalid refresh response');
    }
  }
}

export const tokenManager = TokenManager.getInstance(); // Export the singleton instance for use 