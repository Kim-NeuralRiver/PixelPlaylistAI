// Handles GET and POST requests to save and fetch playlists via the /api/playlists/ endpoint. Auth tokens are attached here for user-based access control.

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const getPlaylists = async () => { // Fetch all playlists
  const token = localStorage.getItem('token');
  const res = await fetch(`${BASE_URL}/api/playlists/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Unauthorized or fetch failed");
  return await res.json();
};

export const savePlaylist = async (name: string, games: any[]) => { // Save a new playlist
  if (!name.trim()) throw new Error('Playlist name cannot be empty'); // Validate playlist name
  const token = localStorage.getItem('token');
  const res = await fetch(`${BASE_URL}/api/playlists/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name, games }),
  });
  if (!res.ok) throw new Error('Failed to save playlist');
  return await res.json();
};
