// Make genres function to work with Django backend

export interface Genre {
    id: number; // IGDB Genre ID
    name: string; // Genre name
}

// Fetch list of genres from Django backend
export async function fetchGenres(): Promise<Genre[]> {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL; 

    if (!apiUrl) {
        throw new Error("API URL is not defined in the environment variables.");
    }

    const res = await fetch(`${apiUrl}/api/genres/`);
    if (!res.ok) {
        const errorBody = await res.text();
        throw new Error(`API Error: ${res.status} - ${errorBody}, failed to fetch genres.`);
    }

    return await res.json();
}