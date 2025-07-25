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
import Image from 'next/image';

export default function RecommendationsPage() {
  const [genreIds, setGenreIds] = useState<number[]>([12]);
  const [platformId, setPlatformId] = useState<number>(6);
  const [budget, setBudget] = useState<number | string>(30); // Default budget set to 30 initially, allow string for empty state
  const [budgetTouched, setBudgetTouched] = useState(false); // track if user has interacted with budget input
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
      platform: [platformId],
      budget: budget === '' ? 0 : Number(budget),
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
  
    const handleSavePlaylist = async () => { // Handle saving the playlist
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
  
        if (playlists.includes(playlistName.trim())) { // Check if playlist already exists
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

    const handleAuthSuccess = async () => {
      // Auto save playlist after sign
      if (playlistName.trim()) {
        await handleSavePlaylist();
      }
    };
  
    if (renderError) { // Log the error to an external monitoring service or console
      console.error('Render error:', renderError);
  
      return (
        <main className="p-6 max-w-4xl mx-auto text-error">
          <h1 className="text-2xl font-bold">{t('recommendations:errorMessage')} </h1>
          <p>{renderError.message}</p>
        </main>
      );
    }
  
    return (
      <main className="p-6 max-w-4xl mx-auto min-h-screen">
        <h1 className="text-3xl font-bold mb-4 text-card">{t('recommendations:title')}</h1> {/* // Form to get game recommendations */}
        <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
        title={t('auth:savePlaylistTitle')}
        message={t('auth:signInToSave')}
        />

        <div className="bg-card p-6 rounded-lg shadow-md mb-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium text-card">
              {t('recommendations:genresLabel')}
            </label>
            {genresLoading ? (
              <p className="animate-pulse text-secondary">{t('common:loading', 'Loading...')}</p>
            ) : genresError ? (
              <p className="text-error">{genresError}</p>
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
                className="w-full p-2 border border-input bg-input text-input rounded focus:ring-2 focus:ring-blue-500"
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
            <label htmlFor="platformID" className="block font-medium text-card">
              {t('recommendations:platformLabel')}
            </label>
            <select
              id="platformID"
              name="platformID"
              value={platformId}
              onChange={(e) => setPlatformId(Number(e.target.value))}
              className="w-full p-2 border border-input bg-input text-input rounded focus:ring-2 focus:ring-blue-500"
            >
              {Object.entries(PLATFORM_MAP).map(([id, name]) => (
                <option key={id} value={id}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="budget" className="block font-medium text-card">
              {t('recommendations:budgetLabel')}
            </label>
            <input
              id="budget"
              name="budget"
              type="number"
              autoComplete="off"
              value={budgetTouched ? budget : (budget === 30 ? '' : budget)}
              onFocus={() => {
                if (!budgetTouched) {
                  setBudget('');
                  setBudgetTouched(true);
                }
              }}
              onChange={(e) => {
                setBudgetTouched(true);
                setBudget(e.target.value === '' ? '' : Number(e.target.value));
              }}
              className="w-full p-2 border border-input bg-input text-input rounded focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Submit button to get recs */}
          <button
            type="submit"
            className="bg-button-primary text-white px-4 py-2 rounded hover:bg-button-primaryHover focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          >
            {t('recommendations:getRecommendations')}
          </button>
        </form>
      </div>
  
        {/* Show loading state */}
      {loading && <p className="mt-4 animate-bounce text-secondary">{t('common:loading')}</p>}
      {error && <p className="mt-4 text-error">{error}</p>}


        {/* Display recommendations */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
         {recommendations.map((game, index) => (
          <div
            key={game.title}
            className="bg-card border-green-500 border-2 rounded-xl shadow-md p-4 transition-transform transform hover:scale-105 hover:shadow-lg"
          >
            {typeof game.cover_url === 'string' && ( 
              <div className="relative h-64 w-full mb-2 rounded overflow-hidden">
              <Image
                src={game.cover_url}
                alt={game.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover rounded"
                priority={index < 5} // Load first 5 images with priority
              />
              </div>
              )}
              <h2 className="text-xl font-semibold text-card">{game.title}</h2>
            {game.blurb ? (
              <p className="mt-2 text-sm text-card bg-success-background border border-success-border p-2 rounded">
                {game.blurb}
              </p>
            ) : (
              <p className="text-sm text-secondary mt-1">{t('recommendations:noBlurb')}</p>
            )}

             <div className="mt-2 text-sm text-info bg-info-background border border-info-border p-2 rounded">
              {/* Update all text elements to use theme-aware colors */}
              {Array.isArray(game.genres) && (
                <p className="text-sm">
                  <strong>{t('recommendations:genres')}:</strong> {game.genres.join(', ')}
                </p>
              )}
                {typeof game.platform === 'string' && ( // Handle platform as a string
                <p className="text-sm">
                  <strong>{t('recommendations:platform1')}:</strong> {game.platform}
                </p>
                )}
                {Array.isArray(game.platform) && ( // Handle array of platform names
                <p className="text-sm">
                  {t('recommendations:platform2')} {game.platform.join(', ')}
                </p>
                )}
                {game.price && typeof game.price.price === 'number' ? ( // Check if price is available and is a number
                <div>
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
                      className="text-button-primary underline"
                    >
                      {t('recommendations:viewDeal')}
                    </a>
                  )}
                </div>
                ) : ( // Display price_note if available
                <div className="text-secondary">
                  {game.price_note || t('recommendations:noPricing')}
                </div>
                )}
              </div>
            </div>
            ))}
        </div>
  
        {recommendations.length > 0 && (
        <div className="mt-8 p-4 border border-input rounded bg-card shadow">
          <h3 className="text-lg font-semibold mb-2 text-card">
            {t('recommendations:savePlaylistTitle')}
          </h3>
          <input
            type="text"
            placeholder={t('recommendations:playlistNamePlaceholder')}
            value={playlistName}
            onChange={(e) => setPlaylistName(e.target.value)}
            className="w-full border border-input bg-input text-input p-2 rounded mb-2 focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSavePlaylist}
            className="bg-button-primary text-white px-4 py-2 rounded hover:bg-button-primaryHover focus:ring-2 focus:ring-blue-500"
          >
            {t('recommendations:savePlaylist')}
          </button>
          {saveStatus === 'success' && (
            <p className="mt-2 text-sm text-green-400">{t('recommendations:playlistSavedSuccess')}</p>
          )}
          {saveStatus === 'error' && (
            <p className="mt-2 text-sm text-error">
              {saveError || t('recommendations:savePlaylistFailed')}
            </p>
          )}
          </div>
        )}
      </main>
    );
  }
