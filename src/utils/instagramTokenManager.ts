interface TokenData {
  access_token: string;
  expires_at: number;
}

class InstagramTokenManager {
  private static instance: InstagramTokenManager;
  private tokenData: TokenData | null = null;
  private readonly REFRESH_THRESHOLD_DAYS = 7; // Refresh token 7 days before expiration
  private readonly TOKEN_CACHE_KEY = 'instagram_token_data';

  private constructor() {
    // Initialize token data from environment variables if available
    this.initializeTokenData();
  }

  private initializeTokenData(): void {
    try {
      // Check if we're in a Vercel environment
      if (process.env.VERCEL) {
        // In Vercel, we'll rely on environment variables for the initial token
        // The token will be refreshed on first use
        this.tokenData = null;
      } else {
        // In development, try to load from localStorage if available
        if (typeof window !== 'undefined') {
          const storedData = localStorage.getItem(this.TOKEN_CACHE_KEY);
          if (storedData) {
            this.tokenData = JSON.parse(storedData);
          }
        }
      }
    } catch (error) {
      console.error('Error initializing token data:', error);
      this.tokenData = null;
    }
  }

  static getInstance(): InstagramTokenManager {
    if (!InstagramTokenManager.instance) {
      InstagramTokenManager.instance = new InstagramTokenManager();
    }
    return InstagramTokenManager.instance;
  }

  private async fetchLongLivedToken(shortLivedToken: string, appSecret: string): Promise<TokenData> {
    const response = await fetch(
      `https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=${appSecret}&access_token=${shortLivedToken}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.access_token) {
      throw new Error('No access token received in response');
    }

    const tokenData = {
      access_token: data.access_token,
      expires_at: Date.now() + (data.expires_in * 1000)
    };

    // Store token data if we're in a browser environment
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(this.TOKEN_CACHE_KEY, JSON.stringify(tokenData));
      } catch (error) {
        console.warn('Failed to store token in localStorage:', error);
      }
    }

    return tokenData;
  }

  private shouldRefreshToken(): boolean {
    if (!this.tokenData) return true;
    
    const now = Date.now();
    const refreshThreshold = this.REFRESH_THRESHOLD_DAYS * 24 * 60 * 60 * 1000; // Convert days to milliseconds
    return now + refreshThreshold >= this.tokenData.expires_at;
  }

  async getValidToken(shortLivedToken: string, appSecret: string): Promise<string> {
    if (this.shouldRefreshToken()) {
      try {
        this.tokenData = await this.fetchLongLivedToken(shortLivedToken, appSecret);
      } catch (error) {
        console.error('Error refreshing token:', error);
        throw new Error('Failed to refresh Instagram token');
      }
    }

    if (!this.tokenData) {
      throw new Error('No valid token available');
    }

    return this.tokenData.access_token;
  }

  // For testing purposes
  clearToken(): void {
    this.tokenData = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.TOKEN_CACHE_KEY);
    }
  }
}

export const instagramTokenManager = InstagramTokenManager.getInstance(); 