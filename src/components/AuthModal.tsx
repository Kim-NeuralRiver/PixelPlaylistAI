// Playlist authentication modal - so it's clear making playlists requires user to have an account

'use client'; 

import Link from 'next/link';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    message?: string;
}

const AuthModal: React.FC<AuthModalProps> = ({
    isOpen,
    onClose,
    title,
    message
}) => {
    const { t } = useTranslation(['auth']);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-600"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <div className="text-center">
                    <div className="mx-auto flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                        <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 11H9v-2h2v2zm0-4H9V7h2v2z" />
                        </svg>
                    </div>

                    <h3 className="text-lg font-medium text-blue-500 mb-2">
                        {title || t('auth:savePlaylistTitle')}
                    </h3>

                    <p className="text-sm text-gray-600 mb-6">
                        {message || t('auth:signInToSave')}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3">
                        <Link
                            href="/sign-up"
                            className="w-full sm:w-auto inline-flex justify-center px-4 py-2 border border-transparent bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            onClick={onClose}
                        >
                            {t('auth:createAccount')}
                        </Link>

                        <Link
                            href="/sign-in"
                            className="w-full sm:w-auto inline-flex justify-center px-4 py-2 border border-transparent bg-white text-blue-600 text-sm font-medium rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            onClick={onClose}
                        >
                            {t('auth:signIn')}
                        </Link>
                    </div>

                    <button
                        onClick={onClose}
                        className="mt-4 text-sm text-gray-500 hover:text-gray-700"
                    >
                        Continue without signing in (Don't save playlist)
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AuthModal;

// This component is specifically for the recommendations and playlists page, but could be reused for auth prompting elsewhere.