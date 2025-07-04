// Make genres function to work with Django backend
import { api } from '@/lib/apiClient';

export interface Genre {
    id: number; // IGDB Genre ID
    name: string; // Genre name
}

// Fetch list of genres from Django backend
export async function fetchGenres(): Promise<Genre[]> {
    return api.get<Genre[]>('api/genres/', { requiresAuth: false });
}