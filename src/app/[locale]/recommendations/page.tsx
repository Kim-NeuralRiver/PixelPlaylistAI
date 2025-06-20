'use client';
// Main UI page where users select genres, platform, and budget to generate game recommendations

import { useState, useEffect } from 'react';
import { fetchGameRecommendations, RecommendationQuery, GameRecommendation } from '@/utils/api/recommendations';
import { fetchGenres, Genre } from '@/utils/api/genres';
import { PLATFORM_MAP } from '@/utils/platforms';
import { savePlaylist, getPlaylists } from '@/utils/api/playlists';
import React from 'react';
import AuthModal from '@/components/AuthModal';
import { useAuth } from '@/hooks/useAuth'; 
import { useTranslation } from 'react-i18next';

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
  const [renderError, setRenderError] = useState<Error | null>(null); // for render-level issues
  const [playlistName, setPlaylistName] = useState('');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [saveError, setSaveError] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [playlists, setPlaylists] = useState<string[]>([]); // Store user's playlists
  const { isAuthenticated } = useAuth();
  const { t } = useTranslation(['recommendations', 'common', 'auth']); // Initialize translation hook

  useEffect(() => { // Fetch genres on component mount
    try {
      fetchGenres()
        .then((genres) => {
          setGenreOptions(genres);
          setGenresLoading(false);
        })
        .catch((err) => {
          setGenresError(err.message);
          setGenresLoading(false);
        });
    } catch (e: any) {
      setRenderError(e);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => { // Handle form submission
    e.preventDefault();
    setLoading(true);
    setError(null);

    const query: RecommendationQuery = {
      genres: genreIds,
      platform: [platformId],
      budget,
    };

    try {
      const result = await fetchGameRecommendations(query); // Fetch recommendations
      console.log('Fetched recommendations:', result); // Debug, remove later
      setRecommendations(result);
    } catch (err: any) {
      setError(err.message || t('recommendations:unknownError'));
      } finally {
        setLoading(false);
      }
    };
  
    const handleSavePlaylist = async () => {
      if (!isAuthenticated) {
        setShowAuthModal(true);
        return;
      }
  
      if (!playlistName.trim()) {
        setSaveError(t('recommendations:enterPlaylistName'));
        setSaveStatus('error');
        return;
      }
  
      setSaveStatus('saving');
      setSaveError(null);
  
      try {
        setRecommendations((currentRecommendations) => {
          return currentRecommendations; // Ensure the callback returns the current state
        });
  
        if (playlists.includes(playlistName.trim())) {
          setSaveError(t('recommendations:playlistExists'));
          setSaveStatus('error');
          return;
        }
  
        await savePlaylist(playlistName, recommendations);
        setSaveStatus('success');
        setPlaylistName('');
        setPlaylists([...playlists, playlistName.trim()]); // Update playlists
      } catch (error: any) {
        setSaveStatus('error');
        setSaveError(error.message || t('recommendations:savePlaylistFailed'));
      }
    };
  
    if (renderError) { // Log the error to an external monitoring service or console
      console.error('Render error:', renderError);
  
      return (
        <main className="p-6 max-w-4xl mx-auto text-red-600">
          <h1 className="text-2xl font-bold">{t('recommendations:errorMessage')} </h1>
          <p>{renderError.message}</p>
        </main>
      );
    }
  
    return (
      <main className="p-6 max-w-4xl mx-auto min-h-screen bg-gray-50">
        <h1 className="text-3xl font-bold mb-4">{t('recommendations:title')}</h1> {/* // Form to get game recommendations */}
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          title={t('auth:savePlaylistTitle')}
          message={t('auth:signInToSave')}
          />
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium">
              {t('recommendations:genresLabel')}
            </label>
            {genresLoading ? (
              <p>{t('common:loading', 'Loading...')}</p>
            ) : genresError ? (
              <p className="text-red-500">{genresError}</p>
            ) : (
              <select
                multiple
                id="genres"
                name="genres"
                autoComplete="off"
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
            <label htmlFor="platformID" className="block font-medium">{t('recommendations:platformLabel')}</label>
            <select
              id="platformID"
              name="platformID"
              value={platformId}
              onChange={(e) => setPlatformId(Number(e.target.value))} // Update platform ID
              className="w-full p-2 border rounded"
            >
              {Object.entries(PLATFORM_MAP).map(([id, name]) => ( // Map platform IDs to names
                <option key={id} value={id}>
                  {name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="budget" className="block font-medium">
              {t('recommendations:budgetLabel')}
            </label>
            <input
              id="budget"
              name="budget"
              type="number"
              autoComplete="off"
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))} // Update budget
              className="w-full p-2 border rounded"
            />
          </div>
  
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {t('recommendations:getRecommendations')} 
          </button> 
        </form>
  
        {loading && <p className="mt-4">{t('common:loading')}</p>}
        {error && <p className="mt-4 text-red-500">{error}</p>}
  
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            {recommendations.map((game) => (
            <div
              key={game.title}
              className="bg-white border rounded-xl shadow-md p-4 transition-transform transform hover:scale-105 hover:shadow-lg"
            >
              {typeof game.cover_url === 'string' && (
              <img
                src={game.cover_url}
                alt={game.title}
                className="w-full h-auto mb-2 object-cover rounded"
              />
              )}
              <h2 className="text-xl font-semibold">{game.title}</h2>
              <p className="text-sm">{game.summary}</p>
  
              {Array.isArray(game.genres) && ( // Check if genres is an array
              <p className="text-sm text-gray-600">
                {t('recommendations:genres')}: {game.genres.join(', ')}
              </p>
              )}
              {typeof game.platform === 'string' && ( // Handle platform as a string
              <p className="text-sm text-gray-600">
                {t('recommendations:platform1')}: {Array.isArray(game.platform) ? game.platform.join(', ') : game.platform}
              </p>
              )}
              {Array.isArray(game.platform) && ( // Handle array of platform names
              <p className="text-sm text-gray-600">
                {t('recommendations:platform2')} {game.platform.join(', ')}
              </p>
              )}
              {game.blurb ? (
              <p className="mt-2 text-sm italic text-blue-800 bg-blue-50 p-2 rounded">
                {game.blurb}
              </p>
              ) : (
              <p className="mt-2 text-sm italic text-gray-400">{t('recommendations:noBlurb')}</p>
              )}
              {game.price && typeof game.price.price === 'number' ? ( // Check if price is available and is a number
              <div className="mt-2 text-sm bg-green-50 border border-green-200 p-2 rounded">
                <p>
                <strong>{t('recommendations:store')}:</strong> {game.price.store || t('recommendations:unknown')}
                </p>
                <p>
                <strong>{t('recommendations:price')}:</strong> {game.price.currency || t('recommendations:gbp')} {game.price.price.toFixed(2)}
                </p>
                <p>{game.price.discount || t('recommendations:noDiscountInfo')}</p> 
                {game.price.url && (
                <a
                  href={game.price.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  {t('recommendations:viewDeal')}
                </a>
                )}
              </div>
              ) : ( // Display price_note if available
              <div className="mt-2 text-sm text-gray-400">
                {game.price_note || t('recommendations:noPricing')}
              </div>
              )}
            </div>
            ))}
        </div>
  
        {recommendations.length > 0 && ( // If there are recommendations, show the save playlist section
          <div className="mt-8 p-4 border rounded bg-white shadow">
            <h3 className="text-lg font-semibold mb-2">{t('recommendations:savePlaylistTitle')}</h3>
            <input
              type="text" // Input for playlist name
              placeholder={t('recommendations:playlistNamePlaceholder')}
              value={playlistName}
              onChange={(e) => setPlaylistName(e.target.value)}
              className="w-full border p-2 rounded mb-2"
            />
            <button
              onClick={handleSavePlaylist} // Save playlist button
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              {t('recommendations:savePlaylist')}
            </button>
            {saveStatus === 'success' && (
              <p className="mt-2 text-sm text-green-700">{t('recommendations:playlistSavedSuccess')}</p>
            )}
            {saveStatus === 'error' && (
              <p className="mt-2 text-sm text-red-700">{saveError || t('recommendations:savePlaylistFailed')}</p>
            )}
          </div>
        )}
      </main>
    );
  }
