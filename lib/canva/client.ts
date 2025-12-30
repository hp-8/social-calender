// Canva API integration
// Documentation: https://www.canva.dev/docs/connect/

export interface CanvaDesign {
  id: string;
  title: string;
  url: string;
}

export interface CanvaCreateDesignParams {
  postContent: string;
  postType: string;
  category: string;
  date: string;
}

// Initialize Canva OAuth and create design
export async function createCanvaDesign(
  accessToken: string,
  params: CanvaCreateDesignParams
): Promise<CanvaDesign> {
  // This will be implemented with Canva Connect API
  // For now, return a placeholder
  throw new Error('Canva integration not yet fully implemented. Please register your app at https://www.canva.dev/');
}

// Get Canva OAuth URL
export function getCanvaOAuthUrl(redirectUri: string): string {
  const clientId = process.env.CANVA_CLIENT_ID;
  if (!clientId) {
    throw new Error('CANVA_CLIENT_ID environment variable is not set');
  }
  
  const scopes = [
    'design:read',
    'design:write',
    'design:content:read',
    'design:content:write',
  ].join(' ');
  
  return `https://www.canva.com/api/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scopes)}&response_type=code`;
}

// Exchange authorization code for access token
export async function exchangeCanvaCode(code: string, redirectUri: string): Promise<string> {
  const clientId = process.env.CANVA_CLIENT_ID;
  const clientSecret = process.env.CANVA_CLIENT_SECRET;
  
  if (!clientId || !clientSecret) {
    throw new Error('Canva credentials not configured');
  }
  
  const response = await fetch('https://api.canva.com/rest/v1/oauth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
      client_id: clientId,
      client_secret: clientSecret,
    }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to exchange Canva authorization code');
  }
  
  const data = await response.json();
  return data.access_token;
}

