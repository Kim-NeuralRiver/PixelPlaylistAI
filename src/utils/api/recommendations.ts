// Request payload interface for game recommendations, frontend logic for making POST requests to the /api/recommendations/ endpoint

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'; // Base URL for API requests

export interface RecommendationQuery {
    genres: number[]; // IGDB Genre IDs
    platform: number; // IGDB Platform IDs
    budget: number; // User's budget number
}

// Expected response format from backend

export interface GameRecommendation {
    title: string;
    cover: string | null; // URL to the cover image
    platform: string; // List of platform names
    summary: string; // Game summary
    genres: string[]; // List of genre names
    price?: {
        price: number | null; // Game price
        store: string | null; // Store name
        discount: string | null; // Discount %
        currency: string | null; // Currency (in this instance, GBP)
        url: string | null; // URL to reach store
    };
    blurb?: string | null; // Game blurb
}

/* Call PixelPlaylistAI Django backend to get game recommendations, see:
 * 
 * @param query - Object containing genres, platform, and budget.
 * @returns - Promise of an array of GameRecommendation objects.
 * @throws - Error if the API call fails.
 */

export async function fetchGameRecommendations(query: RecommendationQuery): Promise<GameRecommendation[]> { // Fetch game recommendations from the API
  const res = await fetch(`${BASE_URL}/api/recommendations/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(query),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`API Error: ${res.status} - ${errorText}`);
  }

  return res.json();
}

