import { TokenData } from './types';

const REFRESH_THRESHOLD_DAYS = 7; // Refresh token 7 days before expiration
const TOKEN_CACHE_KEY = 'instagram_token_data';

export class InstagramTokenManager {
  private static instance: InstagramTokenManager;
  private tokenData: TokenData | null = null;

  constructor() {
    console.log('Initializing InstagramTokenManager');
    this.initializeTokenData();
  }

  public static getInstance(): InstagramTokenManager {
    if (!InstagramTokenManager.instance) {
      InstagramTokenManager.instance = new InstagramTokenManager();
    }
    return InstagramTokenManager.instance;
  }

  private initializeTokenData() {
    console.log('Initializing token data');
    if (typeof window !== 'undefined') {
      // Browser environment
      const storedData = localStorage.getItem(TOKEN_CACHE_KEY);
      if (storedData) {
        try {
          this.tokenData = JSON.parse(storedData);
          console.log('Loaded token data from localStorage');
        } catch (error) {
          console.error('Error parsing stored token data:', error);
          this.clearToken();
        }
      }
    } else {
      // Server environment (Vercel)
      const INSTAGRAM_TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN;
      const INSTAGRAM_APP_SECRET = process.env.INSTAGRAM_APP_SECRET;
      
      if (INSTAGRAM_TOKEN && INSTAGRAM_APP_SECRET) {
        this.tokenData = {
          access_token: INSTAGRAM_TOKEN,
          expires_at: Date.now() + 60 * 24 * 60 * 60 * 1000, // 60 days from now
        };
      }
    }
  }

  private validateTokenFormat(token: string): boolean {
    // Check if token starts with expected prefixes
    return token.startsWith('IGQVJ') || token.startsWith('EAA');
  }

  private async fetchLongLivedToken(shortLivedToken: string, appSecret: string): Promise<string> {
    if (!this.validateTokenFormat(shortLivedToken)) {
      throw new Error('Invalid token format. Token should start with IGQVJ or EAA');
    }

    const response = await fetch(
      `https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=${appSecret}&access_token=${shortLivedToken}`
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch long-lived token: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    return data.access_token;
  }

  private shouldRefreshToken(): boolean {
    if (!this.tokenData) return true;
    // Refresh if token expires in less than 24 hours
    return Date.now() > this.tokenData.expires_at - 24 * 60 * 60 * 1000;
  }

  public async getValidToken(shortLivedToken: string, appSecret: string): Promise<string> {
    try {
      if (!this.validateTokenFormat(shortLivedToken)) {
        throw new Error('Invalid token format. Token should start with IGQVJ or EAA');
      }

      if (!this.tokenData || this.shouldRefreshToken()) {
        const longLivedToken = await this.fetchLongLivedToken(shortLivedToken, appSecret);
        this.tokenData = {
          access_token: longLivedToken,
          expires_at: Date.now() + 60 * 24 * 60 * 60 * 1000, // 60 days from now
        };

        if (typeof window !== 'undefined') {
          localStorage.setItem(TOKEN_CACHE_KEY, JSON.stringify(this.tokenData));
          console.log('Stored token data in localStorage');
        }
      }

      return this.tokenData.access_token;
    } catch (error) {
      console.error('Error in getValidToken:', error);
      throw error;
    }
  }

  public clearToken(): void {
    console.log('Clearing token data');
    this.tokenData = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem(TOKEN_CACHE_KEY);
    }
  }
}

export const instagramTokenManager = InstagramTokenManager.getInstance(); 