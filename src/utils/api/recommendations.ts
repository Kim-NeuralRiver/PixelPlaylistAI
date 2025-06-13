// Request payload interface for game recommendations, frontend logic for making POST requests to the /api/recommendations/ endpoint
import { tokenManager } from './tokenManager'; // Import token manager utility

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'; // Base URL for API requests

export interface RecommendationQuery {
    genres: number[]; // IGDB Genre IDs
    platform: number[]; // IGDB Platform IDs
    budget: number; // User's budget number
}

// Expected response format from backend

export interface GameRecommendation {
    title: string;
    cover_url: string | null; // URL to the cover image
    platform: string | string[]; // List of platform names
    summary: string; // Game summary
    genres: string[]; // List of genre names
    price?: {
        price: number | null; // Game price
        store: string | null; // Store name
        discount: string | null; // Discount %
        currency: string | null; // Currency (in this instance, GBP)
        url: string | null; // URL to reach store
    };
    price_note?: string | null; // Note about the price (E.g. "Unavailable")
    blurb?: string | null; // Game blurb
}

/* Call PixelPlaylistAI Django backend to get game recommendations, see:
 * 
 * param query - Object containing genres, platform, and budget.
 * returns - Promise of an array of GameRecommendation objects.
 * throws - Error if the API call fails.
 */

export async function fetchGameRecommendations(query: RecommendationQuery): Promise<GameRecommendation[]> { // Fetch game recommendations from the API
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };

  // Add auth header if user = logged in
  const token = await tokenManager.ensureValidToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  // Make req (works for both auth and anon users)
  const response = await fetch(`${BASE_URL}/api/recommendations/`, {
    method: 'POST',
    headers,
    body: JSON.stringify(query),
  })

  if (!response.ok) {
    if (response.status === 401 && tokenManager.isAuthenticated()) {
      tokenManager.clearTokens(); // Clear unauth tokens if 401
    }

    const errorText = await response.text();
    throw new Error(`API Error ${response.status}: ${errorText}`);
  }

  return response.json();
}

