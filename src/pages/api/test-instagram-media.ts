import type { APIRoute } from 'astro';
import { instagramTokenManager } from '../../utils/instagramTokenManager';

const INSTAGRAM_API_BASE_URL = 'https://graph.instagram.com';

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
    const response = await fetch(
      `${INSTAGRAM_API_BASE_URL}/me/media?fields=id,caption,media_type,media_url,permalink,thumbnail_url,timestamp&access_token=${token}`
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Instagram API error: ${response.status} ${errorText}`);
    }

    const data = await response.json();

    return new Response(
      JSON.stringify({
        success: true,
        postCount: data.data?.length || 0,
        firstPost: data.data?.[0] ? {
          id: data.data[0].id,
          media_type: data.data[0].media_type,
          timestamp: data.data[0].timestamp,
        } : null,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error testing Instagram media:', error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
      { status: 500 }
    );
  }
}; 