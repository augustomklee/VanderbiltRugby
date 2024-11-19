declare module 'instagram-web-api' {
    interface InstagramClientOptions {
      username: string;
      password: string;
      storeCookies?: boolean;
    }
  
    interface InstagramPost {
      id: string;
      caption?: string;
      media_type: string;
      media_url: string;
      permalink: string;
      thumbnail_url?: string;
      timestamp: string;
    }
  
    interface GetPhotosByUsernameOptions {
      username: string;
      first: number;
    }
  
    class Instagram {
      constructor(options: InstagramClientOptions);
      login(): Promise<void>;
      getPhotosByUsername(options: GetPhotosByUsernameOptions): Promise<InstagramPost[]>;
    }
  
    export default Instagram;
  }