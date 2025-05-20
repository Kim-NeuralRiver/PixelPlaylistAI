'use client';

import { useState } from 'react';
import { useEffect } from 'react';
import { fetchGameRecommendations, RecommendationQuery, GameRecommendation } from '@/utils/api/recommendations';
import { fetchGenres, Genre } from '@/utils/api/genres';

export default function RecommendationsPage() {
    const [genreIds, setGenreIds] = useState<number[]>([12]);
    const [platformId, setPlatformId] = useState<number>(6);
    const [budget, setBudget] = useState<number>(30);
    const [recommendations, setRecommendations] = useState<GameRecommendation[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [genreOptions, setGenreOptions] = useState<Genre[]>([]);
    const [genresLoading, setGenresLoading] = useState(true);
    const [genresError, setGenresError] = useState<string | null>(null);

    useEffect(() => { // Fetch genres on component mount
        fetchGenres()
            .then((genres) => {
                setGenreOptions(genres);
                setGenresLoading(false);
            })
            .catch((err) => {
                setGenresError(err.message);
                setGenresLoading(false);
            });
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const query: RecommendationQuery = {
        genres: genreIds,
        platforms: [platformId],
        budget,
        };

        try {
        const result = await fetchGameRecommendations(query);
        setRecommendations(result);
        } catch (err: any) {
        setError(err.message);
        } finally {
        setLoading(false);
        }
    };

    return (
        <main className="p-6 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">PixelPlaylistAI - Recommendations</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
            <label className="block font-medium">Genres (comma-separated IGDB IDs)</label> 
            {genresLoading ? (
                <p>Loading genres!</p>
            ) : genresError ? (
                <p className="text-red-500">{genresError}</p>
            ) : (
                <select
                multiple
                value={genreIds.map(String)}
                onChange={(e) =>
                    setGenreIds(Array.from(e.target.selectedOptions, (option) => Number(option.value)))
                }
                className="w-full p-2 border rounded"
                >
                {genreOptions.map((genre) => (
                    <option key={genre.id} value={genre.id}>
                    {genre.name}
                    </option>
                ))}
                </select>    
             )}
            </div>
            <div>
            <label className="block font-medium">Platform (IGDB ID)</label>
            <input
                type="number"
                value={platformId}
                onChange={(e) => setPlatformId(Number(e.target.value))}
                className="w-full p-2 border rounded"
            />
            </div>
            <div>
            <label className="block font-medium">Budget</label>
            <input
                type="number"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full p-2 border rounded"
            />
            </div>
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Get Recommendations
            </button>
        </form>

        {loading && <p className="mt-4">Loading...</p>}
        {error && <p className="mt-4 text-red-500">{error}</p>}

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            {recommendations.map((game) => (
            <div key={game.title} className="border rounded p-4">
                {game.cover && (
                <img src={game.cover} alt={game.title} className="w-full h-auto mb-2 object-cover rounded" />
                )}
                <h2 className="text-xl font-semibold">{game.title}</h2>
                <p className="text-sm">{game.summary}</p>
                <p className="text-sm text-gray-600">Genres: {game.genres.join(', ')}</p>
                <p className="text-sm text-gray-600">Platforms: {game.platforms.join(', ')}</p>
            </div>
            ))}
        </div>
        </main>
    );
    }