'use client';

import { useState, useEffect } from 'react';
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

  const handleSubmit = async (e: React.FormEvent) => { // Handle form submission
    e.preventDefault();
    setLoading(true);
    setError(null);

    const query: RecommendationQuery = {
      genres: genreIds,
      platforms: [platformId],
      budget,
    };

    try {
      const result = await fetchGameRecommendations(query); // Fetch recommendations based on the query
      setRecommendations(result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  try { // Render the recommendations page
    return (
      <main className="p-6 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">PixelPlaylistAI - Recommendations</h1> 

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium">Genres (select one or more)</label>
            {genresLoading ? ( // Loading state for genres
              <p>Loading genres...</p>
            ) : genresError ? (
              <p className="text-red-500">{genresError}</p>
            ) : (
              <select
                multiple
                value={genreIds.map(String)} 
                onChange={(e) =>
                  setGenreIds(Array.from(e.target.selectedOptions, (option) => Number(option.value))) // Update selected genres
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
              onChange={(e) => setPlatformId(Number(e.target.value))} // Update selected platform
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block font-medium">Budget</label> 
            <input
              type="number"
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))} // Update budget
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
          {recommendations.map((game) => ( // Render each game recommendation
            <div key={game.title} className="border rounded p-4">
              {typeof game.cover === 'string' && (
                <img
                  src={game.cover}
                  alt={game.title}
                  className="w-full h-auto mb-2 object-cover rounded"
                />
              )}

              <h2 className="text-xl font-semibold">{game.title}</h2> 
              <p className="text-sm">{game.summary}</p> 
              {Array.isArray(game.genres) && ( // Render genres if available
                <p className="text-sm text-gray-600">Genres: {game.genres.join(', ')}</p>
              )}
              {Array.isArray(game.platforms) && ( // Render platforms if available
                <p className="text-sm text-gray-600">Platforms: {game.platforms.join(', ')}</p>
              )}

              {game.price && typeof game.price.price === 'number' ? ( // Render price information if available
                <div className="mt-2 text-sm bg-green-50 border border-green-200 p-2 rounded">
                  <p><strong>Store:</strong> {game.price.store || 'Unknown'}</p>
                  <p>
                    <strong>Price:</strong> {game.price.currency || 'GBP'}{" "}
                    {typeof game.price.price === "number"
                      ? game.price.price.toFixed(2)
                      : "Unavailable"}
                  </p>
                  <p>{game.price.discount || "No discount info available"}</p>
                  {game.price.url && (
                    <a
                      href={game.price.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      View Deal
                    </a>
                  )}
                </div>
              ) : (
                <p className="mt-2 text-sm text-gray-400">No pricing information available.</p>
              )}
            </div>
          ))}
        </div>
      </main>
    );
  } catch (e) {
    console.error("Error rendering recommendation page:", e); // Log error
    return (
      <main className="p-6 max-w-4xl mx-auto text-red-600">
        <h1 className="text-2xl font-bold">Something went wrong</h1>
        <p>{String(e)}</p>
      </main>
    );
  }
}
// Note: The above code assumes that the fetchGameRecommendations and fetchGenres functions are defined in the utils/api/recommendations and utils/api/genres files respectively.