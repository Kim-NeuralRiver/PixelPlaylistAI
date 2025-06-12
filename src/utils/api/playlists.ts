// Handles GET and POST requests to save and fetch playlists via the /api/playlists/ endpoint. Auth tokens are attached here for user-based access control.
import { GameRecommendation } from './recommendations';
import { tokenManager } from './tokenManager';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const getPlaylists = async () => { // Fetch all playlists
  const token = await tokenManager.ensureValidToken();
  if (!token) {
    throw new Error('Authentication required');
  }

  const res = await fetch(`${BASE_URL}/api/playlists/`, {
    headers: { Authorization: `Bearer ${token}`},
  });

  if (!res.ok) {
    if (res.status === 401) {
      tokenManager.clearTokens();
      throw new Error('Unauthorized access, please retry login');
    }
    throw new Error(`Failed to fetch playlists: ${res.status}`);
  }

  return await res.json(); // Return list of playlists

} 

export const savePlaylist = async (name: string, games: GameRecommendation[]) => { // Save a new playlist
  if (!name.trim()) {
    throw new Error('Playlist name cannot be empty'); // Validate playlist name
  }

  const token = await tokenManager.ensureValidToken();
  if (!token) {
    throw new Error('Authentication required'); // Ensure user = auth
  }

  const res = await fetch(`${BASE_URL}/api/playlists/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name, games }),
  });

  // Check if request = successful

  if (!res.ok) {
    if (res.status === 401) { 
      tokenManager.clearTokens();
      throw new Error('Session expired. Sign in again, please.');
    }
    throw new Error(`Failed to save playlist: ${res.status}`); 
  }

  return await res.json(); // Return saved playlist data

};
