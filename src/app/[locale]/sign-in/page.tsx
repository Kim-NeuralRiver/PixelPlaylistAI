'use client';
// Note: The old sign-in page is saved elsewhere, in case this doesn't work

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';

const SignIn: React.FC = () => {
  const [credential, setCredential] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [credentialError, setCredentialError] = useState('');
  const router = useRouter();
  const { t } = useTranslation(['auth']);
  const { signIn } = useAuth();

  // Sign in form update - added helper function to determine if the input is an email 

  const isEmail = (input: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(input);
  }

  const validateCredential =  (input: string) => {
    if (!input.trim()) {
      setCredentialError(t('auth:emailOrUsernameRequired'));
      return false;
    }

    // If it has email regex, validate email format
    if (input.includes('@')) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(input)) {
        setCredentialError(t('auth:invalidEmail'));
        return false;
      }
    }

    setCredentialError('');
    return true;
  };

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    console.log('Form submit triggered, event:', e); // Debug log
    
    if (e) {
      e.preventDefault();
    }
    setMessage('');
    setLoading(true);

    console.log('Credential', credential, 'Password length:', password.length); // Debug log

    if (!validateCredential(credential)) {
      setLoading(false);
      return;
    }

    if (!password.trim()) {
      setMessage(t('auth:passwordRequired'));
      setLoading(false);
      return;
    }
  
    try {
      // Determine email vs username and prepare params
      const trimmedCredential = credential.trim();
      const isEmailInput = isEmail(trimmedCredential);

      console.log('Parameters being sent:', { 
        credential: trimmedCredential || 'EMPTY',
        isEmail: isEmailInput || 'EMPTY', 
        password: password ? 'PROVIDED' : 'EMPTY' 
      }); // Debug log

      const result = await signIn( // Pass only the provided credentials
        isEmailInput ? trimmedCredential : '', // Use email if provided
        isEmailInput ? '' : trimmedCredential, // Use username if provided
        password
      );

      console.log('Sign in result:', result); // Debug log

      if (result.success) {
        console.log('Sign in successful, redirecting...'); // Debug log
        router.push('/recommendations');
      } else {
        setMessage(result.error || t('auth:signInFailed', 'Sign in failed'));
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setMessage(t('auth:unexpectedError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-card p-8 rounded-lg shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-card">
            {t('auth:signInTitle')}
          </h2>
          <p className="mt-2 text-center text-sm text-secondary">
            {t('auth:or')}{' '}
            <Link href="/sign-up" className="font-medium text-blue-400 hover:text-blue-700 hover:underline">
              {t('auth:createAccount')}
            </Link>
          </p>
        </div>

        {message && (
          <div className={`rounded-md p-4 ${
            message.includes('success') || message.includes(':)')
              ? 'bg-green-900/20 border border-green-500'
              : 'bg-red-900/20 border border-red-500'
          }`}>
            <p className={`text-sm ${
              message.includes('success') || message.includes(':)')
                ? 'text-green-400'
                : 'text-error'
            }`}>
              {message}
            </p>
          </div>
        )}

        {/* Simplified credentials form */}
        <form onSubmit={handleCredentialsSubmit} className="mt-8 space-y-6">
          <div>
            <label htmlFor="credential" className="block text-sm font-medium text-card">
              {t('auth:enterEmailOrUsername')}
            </label>
            <input
              id="credential"
              type="text"
              value={credential}
              onChange={(e) => {
                setCredential(e.target.value);
                if (credentialError && e.target.value.trim()) {
                // clear credential required error when user starts typing
                  setCredentialError('');
                }
              }}
              onBlur={(e) => validateCredential(e.target.value)}
              className={`mt-1 block w-full px-3 py-2 border rounded-md bg-input text-input focus:outline-none focus:ring-blue-500 focus:border-success-border sm:text-sm ${
                credentialError ? 'border-red-500' : 'border-input'
              }`}
              placeholder={t('auth:emailOrUsernamePlaceholder')}
            />
            {credentialError && (
              <p className="mt-1 text-sm text-error">{credentialError}</p>
            )}
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-card">
              {t('auth:password')}
            </label>
            <input
              id="password"
              type="password"
              // required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-input bg-input text-input rounded-md focus:outline-none focus:ring-blue-500 focus:border-success-border sm:text-sm"
              placeholder={t('auth:passwordPlaceholder')}
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={loading} 
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-button-primary hover:bg-button-primaryHover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {t('auth:signingIn')}
                </span>
              ) : (
                t('auth:signIn')
              )}
            </button>
          </div>
        </form>

        {/* Note indicating intent to improve the page */}
        <div className="mt-6 text-center">
          <p className="text-sm text-secondary">
            {t('auth:moreOptionsComingSoon')}
          </p>
        </div>

      </div>
    </div>


  );
};

export default SignIn;