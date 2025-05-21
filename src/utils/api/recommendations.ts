// Request payload interface for game recommendations 

export interface RecommendationQuery {
    genres: number[]; // IGDB Genre IDs
    platforms: number[]; // IGDB Platform IDs
    budget: number; // User's budget number
}

// Expected response format from backend

export interface GameRecommendation {
    title: string;
    cover: string | null; // URL to the cover image
    platforms: string[]; // List of platform names
    summary: string; // Game summary
    genres: string[]; // List of genre names
    price?: {
        price: number | null; // Game price
        store: string | null; // Store name
        discount: string | null; // Discount %
        currency: string | null; // Currency (in this instance, GBP)
        url: string | null; // URL to reach store
    };
}

/* Call PixelPlaylistAI Django API to get game recommendations, see:
 * 
 * @param query - Object containing genres, platform, and budget.
 * @returns - Promise of an array of GameRecommendation objects.
 * @throws - Error if the API call fails.
 */

export async function fetchGameRecommendations(query: RecommendationQuery): Promise<GameRecommendation[]> {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL; // Make sure this is defined in .env.local

    if (!apiUrl) {
        throw new Error("API URL is not defined in the environment variables.");
    }

    const response = await fetch(`${apiUrl}/recommendations/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(query),
    });

    if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`API Error: ${response.status} - ${errorBody}`);
    }

    return await response.json();
}