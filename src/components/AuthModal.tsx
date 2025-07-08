// Playlist authentication modal - so it's clear making playlists requires user to have an account

'use client'; 

import Link from 'next/link';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void; // Callback to close the modal
    onSuccess: () => void; // Callback for successful auth
    title?: string;
    message?: string;
}

export default function AuthModal({
    isOpen,
    onClose,
    onSuccess,
    title,
    message
}: AuthModalProps) {
    const [mode, setMode] = useState<'prompt' | 'signin' | 'signup'>('prompt');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { t } = useTranslation(['auth']);
    const { signIn, signUp } = useAuth();
    const [name, setName] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [username, setUsername] = useState('');

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (mode === 'signin') { 
                if (!email.trim()) {
                    throw new Error(t('auth:emailRequired')); 
                }
                
                if (!password.trim()) {
                    throw new Error(t('auth:passwordRequired')); 
                }
                
                const result = await signIn(email, password);

                if (!result.success) {
                    throw new Error(result.error || t('auth:signInFailed'));
                }

            } else {
                
                if (!username.trim()) {
                    throw new Error(t('auth:usernameRequired'));
                }
                if (!email.trim()) {
                    throw new Error(t('auth:emailRequired'));
                }
                if (!password.trim()) {
                    throw new Error(t('auth:passwordRequired'));
                }
                if (password !== confirmPassword) {
                    throw new Error(t('auth:passwordMismatch'));
                }
                if (password.length < 8) {
                    throw new Error(t('auth:passwordTooShort'));
                }

                const result = await signUp(username, email, password, name);

                if (!result.success) {
                    throw new Error(result.error || t('auth:signUpFailed'));
                }
            }

            onSuccess(); // Call success callback
            onClose(); // Close modal

        } catch (error: any) {
            console.error('Authentication error:', error);
            setError(error.message || t('auth:unexpectedError'));
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-card rounded-lg border:modal-border shadow-lg max-w-md w-full mx-4 p-6 relative">
                {mode === 'prompt' && (
                    <>
                    <div className="mx-auto flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full border-green-100 border-2 mb-4">
                        <svg className="w-8 h-8 text-button-primary" fill="currentColor" viewBox="0 0 20 20">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 11H9v-2h2v2zm0-4H9V7h2v2z" />
                        </svg>
                    </div>

                    <h3 className="text-lg font-medium text-blue-500 mb-2">
                        {title || t('auth:savePlaylistTitle')}
                    </h3>

                    <p className="text-sm text-secondary mb-6">
                        {message || t('auth:signInToSave')}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3">
                        <button
                            onClick={() => setMode('signup')}
                            className="w-full sm:w-auto inline-flex justify-center px-4 py-2 border border-transparent bg-button-primary text-white text-sm font-medium rounded-md hover:bg-button-primary focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                            {t('auth:createAccount')}
                        </button>

                        <button
                            onClick={() => setMode('signin')}
                            className="w-full sm:w-auto inline-flex justify-center px-4 py-2 border border-transparent bg-button-secondary text-white text-sm font-medium rounded-md hover:button-secondary-hover focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                            {t('auth:signIn')}
                        </button>
                   

                        <button
                            onClick={onClose}
                            className="w-full sm:w-auto inline-flex justify-center px-4 py-2 border border-transparent bg:button-back-button text-secondary500 hover:foreground focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded-md"
                        >
                            {t('auth:continueWithoutSignIn')}
                        </button>
                    </div>
                 </>
            )}
                {(mode === 'signin' || mode === 'signup') && (
                    <form onSubmit={handleAuth} className="space-y-4">

                        <h3 className="text-lg font-medium text-blue-500 mb-4 text-center">
                            {mode === 'signin' ? t('auth:signIn') : t('auth:createAccount')}
                        </h3>

                        {error && (
                            <div className="rounded-md p-4 bg-red-50 border border-red-200">
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        )}

                        {mode === 'signup' && (
                            <input
                            type="text"
                            placeholder={t('auth:usernamePlaceholder')}
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-success-border sm:text-sm"
                            required
                            />
                        )}

                        {mode === 'signup' && (
                            <input
                                type="text"
                                placeholder={t('auth:usernamePlaceholder')}
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-success-border"
                                required
                            />
                        )}

                        {mode === 'signup' && (
                            <input
                                type="text"
                                placeholder={t('auth:namePlaceholder')}
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-success-border"
                            />
                        )}
                            

                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-success-border sm:text-sm"
                            placeholder={t('auth:emailPlaceholder')}
                        />

                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-success-border sm:text-sm"
                            placeholder={t('auth:passwordPlaceholder')}
                        />

                        {mode === 'signup' && (
                            <input
                                type="password"
                                placeholder={t('auth:confirmPasswordPlaceholder')}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-success-border"
                                required
                            />
                        )}

                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full sm:w-auto inline-flex justify-center px-4 py-2 border border-green-200 text-sm font-medium rounded-md text-white bg-button-primary hover:bg-button-primaryHover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {loading ? t('common:loading') : (mode === 'signin' ? t('auth:signIn') : t('auth:createAccount'))}
                            </button>

                            <button
                                type="button"
                                onClick={() => setMode('prompt')}
                                className="w-full sm:w-auto inline-flex justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-card bg-card hover:bg-background focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            >
                                {t('common:back')}
                            </button>
                        </div>
                    </form>
                )}
               
            </div>
        </div>
    );
};

// This component is specifically for the recommendations and playlists page, but could be reused for auth prompting elsewhere.