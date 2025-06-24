// Handles GET and POST requests to save and fetch playlists via the /api/playlists/ endpoint. Auth tokens are attached here for user-based access control.
import { GameRecommendation } from './recommendations';
import { tokenManager } from './tokenManager';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'; // Base URL for API requests

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

  if (games.length > 7) {
    throw new Error('A playlist can only contain up to 7 games'); // Validate max games
  }

  if (games.some(game => !game.title || !game.title.trim())) {
    throw new Error('Games must have a title'); // Validate game titles
  }

  const token = await tokenManager.ensureValidToken();
  if (!token) {
    throw new Error('Authentication required'); // Ensure user = auth
  }

  const res = await fetch(`${BASE_URL}/api/playlists/`, { // POST request to save playlist
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

  // Try to get error details from response
    try {
      const errorData = await res.json();
      throw new Error(`Failed to save playlist: ${errorData.detail || res.status}`);
    } catch (parseError) {
      throw new Error(`Failed to save playlist: ${res.status}`);
    }
  }

  return await res.json(); // Return saved playlist data

};
