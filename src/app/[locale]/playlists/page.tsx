'use client';

// This component fetches and displays saved playlists for the user

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';
import { api } from '@/lib/apiClient'; // Import API client

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Define the structure of a playlist
type Playlist = {
  id: number;
  name: string;
  games: {
    title: string;
    price: {
      url: string;
      price: number;
      store: string;
      currency: string;
      discount: string;
    };
    cover_url: string | null;
    platform: string | string[];
  }[];
  created_at: string;
};

// Main component for the playlists page
export default function PlaylistsPage() {
  const { t } = useTranslation(['playlists']);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [error, setError] = useState<string | null>(null);

// Fetch playlists when the component mounts
  useEffect(() => {
  const fetchPlaylists = async () => {
    try {
      const data = await api.get<Playlist[]>('api/playlists/', { requiresAuth: true });
      setPlaylists(data);
    } catch (err: any) {
      setError(err.message || t('playlists:unknownError'));
    }
  };

  fetchPlaylists();
}, [t]);

  return ( // Render the playlists page
    <main className="p-6 max-w-4xl mx-auto min-h-screen bg-background">
      <h1 className="text-2xl font-bold mb-6">{t('playlists:title')}</h1> 
      {error && <p className="text-red-600 mb-4">{error}</p>}
      {playlists.length === 0 ? ( 
        <p>{t('playlists:noPlaylists')}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {playlists.map((playlist, index) => (
            <div key={playlist.id} className="bg-card border-green-200 border-2 rounded-xl shadow-md p-4 transition-transform transform hover:scale-105 hover:shadow-lg"> {/* Playlist card */}
              {playlist.games.length > 0 && playlist.games[0].cover_url && ( // Display cover image if available
               <div className="relative h-64 w-full mb-2 rounded overflow-hidden">
                <Image
                  src={playlist.games[0].cover_url}
                  alt={playlist.games[0].title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover rounded"
                  priority={index < 4}
                />
              </div>
              )}
              <h2 className="text-lg font-semibold">{playlist.name}</h2> { /* Playlist name */}
              <p className="text-sm text-secondary mb-2"> 
                {t('playlists:savedOn')}: {new Date(playlist.created_at).toLocaleDateString()} {/* Display creation date */}
              </p>
              <ul className="list-disc list-inside text-sm text-secondary800">
                {playlist.games.slice(0, 7).map((game, i) => ( // Display up to 7 games in the playlist
                  <li key={i} className="truncate">
                    {game.price?.url ? (
                      <a
                       href={game.price.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-button-primary hover:underline"
                      >
                        {game.title || t('playlists:untitledGame')} {/* Game title */}
                      </a>
                    ) : (
                      game.title || t('playlists:untitledGame') // Fallback for game title
                    )}
                    </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
