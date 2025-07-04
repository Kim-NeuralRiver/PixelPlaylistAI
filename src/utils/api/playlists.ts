// Handles GET and POST requests to save and fetch playlists via the /api/playlists/ endpoint. Auth tokens are attached here for user-based access control.
import { api } from '@/lib/apiClient';
import { GameRecommendation } from './recommendations';

export const getPlaylists = async () => {
  return api.get('api/playlists/', { requiresAuth: true });
};

export const savePlaylist = async (name: string, games: GameRecommendation[]) => {
  if (!name.trim()) {
    throw new Error('Playlist name cannot be empty');
  }

  if (games.length > 7) {
    throw new Error('A playlist can only contain up to 7 games');
  }

  if (games.some(game => !game.title || !game.title.trim())) {
    throw new Error('Games must have a title');
  }

  return api.post('api/playlists/', { name, games }, { requiresAuth: true });
};
