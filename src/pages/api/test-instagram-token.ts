import type { APIRoute } from 'astro';
import { instagramTokenManager } from '../../utils/instagramTokenManager';

export const GET: APIRoute = async () => {
  try {
    const INSTAGRAM_TOKEN = import.meta.env.INSTAGRAM_ACCESS_TOKEN;
    const INSTAGRAM_APP_SECRET = import.meta.env.INSTAGRAM_APP_SECRET;

    if (!INSTAGRAM_TOKEN || !INSTAGRAM_APP_SECRET) {
      return new Response(
        JSON.stringify({
          error: 'Missing environment variables',
          INSTAGRAM_TOKEN: !!INSTAGRAM_TOKEN,
          INSTAGRAM_APP_SECRET: !!INSTAGRAM_APP_SECRET,
        }),
        { status: 500 }
      );
    }

    const token = await instagramTokenManager.getValidToken(INSTAGRAM_TOKEN, INSTAGRAM_APP_SECRET);

    return new Response(
      JSON.stringify({
        success: true,
        token: token ? 'Token received' : 'No token received',
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error testing Instagram token:', error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
      { status: 500 }
    );
  }
}; 