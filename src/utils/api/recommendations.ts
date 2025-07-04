// Request payload interface for game recommendations, frontend logic for making POST requests to the /api/recommendations/ endpoint
import { api } from '@/lib/apiClient';
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
  return api.post<GameRecommendation[]>('api/recommendations/', query, {
    requiresAuth: false // Allow anonymous recommendations
  });
}

