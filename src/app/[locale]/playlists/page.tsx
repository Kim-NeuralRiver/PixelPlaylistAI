'use client';


// This component fetches and displays saved playlists for the user

import { useEffect, useState } from 'react';

type Playlist = {
  id: number;
  name: string;
  games: any[];
  created_at: string;
};

export default function PlaylistsPage() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:8000/api/playlists/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error('Failed to fetch playlists');

        const data = await res.json();
        setPlaylists(data);
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchPlaylists();
  }, []);

  return (
    <main className="p-6 max-w-4xl mx-auto min-h-screen bg-gray-50">
      <h1 className="text-2xl font-bold mb-6">Your Saved Playlists</h1>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      {playlists.length === 0 ? (
        <p>No playlists saved yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {playlists.map((playlist) => (
            <div key={playlist.id} className="bg-white border rounded shadow p-4">
              <h2 className="text-lg font-semibold">{playlist.name}</h2>
              <p className="text-sm text-gray-600 mb-2">
                Saved on: {new Date(playlist.created_at).toLocaleDateString()}
              </p>
              <ul className="list-disc list-inside text-sm text-gray-800">
                {playlist.games.slice(0, 3).map((game, i) => (
                  <li key={i}>{game.title || 'Untitled game'}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
