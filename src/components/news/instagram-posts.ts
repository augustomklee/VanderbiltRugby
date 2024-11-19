import type { APIRoute } from 'astro';
import Instagram from 'instagram-web-api';

export const get: APIRoute = async ({ request }) => {
  const client = new Instagram({
    username: import.meta.env.INSTAGRAM_USERNAME,
    password: import.meta.env.INSTAGRAM_PASSWORD,
  });

  try {
    await client.login();
    const posts = await client.getPhotosByUsername({
      username: 'your_instagram_account',
      first: 4
    });

    return new Response(JSON.stringify(posts), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Instagram API error:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch Instagram posts' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}