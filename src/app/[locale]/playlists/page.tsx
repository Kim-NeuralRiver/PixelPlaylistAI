'use client';

// This component fetches and displays saved playlists for the user

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

type Playlist = {
  id: number;
  name: string;
  games: any[];
  created_at: string;
};

export default function PlaylistsPage() {
  const { t } = useTranslation(['playlists']);
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

        if (!res.ok) throw new Error(t('playlists:fetchError'));

        const data = await res.json();
        setPlaylists(data);
      } catch (err: any) {
        setError(err.message || t('playlists:unknownError'));
      }
    };

    fetchPlaylists();
  }, [t]);

  return (
    <main className="p-6 max-w-4xl mx-auto min-h-screen bg-gray-50">
      <h1 className="text-2xl font-bold mb-6">{t('playlists:title')}</h1>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      {playlists.length === 0 ? (
        <p>{t('playlists:noPlaylists')}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {playlists.map((playlist) => (
            <div key={playlist.id} className="bg-white border rounded shadow p-4">
              <h2 className="text-lg font-semibold">{playlist.name}</h2>
              <p className="text-sm text-gray-600 mb-2">
                {t('playlists:savedOn')}: {new Date(playlist.created_at).toLocaleDateString()}
              </p>
              <ul className="list-disc list-inside text-sm text-gray-800">
                {playlist.games.slice(0, 3).map((game, i) => (
                  <li key={i}>{game.title || t('playlists:untitledGame')}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
