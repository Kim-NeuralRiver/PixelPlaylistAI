'use client';
// Note: The old sign-in page is saved elsewhere, in case this doesn't work

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';

const SignIn: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const router = useRouter();
  const { t } = useTranslation(['auth', 'common']);
  const { signIn: signInWithCredentials } = useAuth();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      setEmailError(t('auth:emailRequired'));
      return false;
    }
    if (!emailRegex.test(email)) {
      setEmailError(t('auth:emailInvalid'));
      return false;
    }
    setEmailError('');
    return true;
  };

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    console.log('Form submit triggered, event:', e); // Debug log
    
    if (e) {
      e.preventDefault();
    }
    setMessage('');
    setLoading(true);

    console.log('Email:', email, 'Password length:', password.length); // Debug log

    if (!validateEmail(email)) {
      setLoading(false);
      return;
    }
    if (!password.trim()) {
      setMessage(t('auth:passwordRequired'));
      setLoading(false);
      return;
    }
  
    try {
      console.log('Calling signInWithCredentials...'); // Debug log
      const result = await signInWithCredentials(email, password);
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {t('auth:signInTitle')}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {t('auth:or')}{' '}
            <Link href="/sign-up" className="font-medium text-blue-600 hover:text-blue-500">
              {t('auth:createAccount')}
            </Link>
          </p>
        </div>

        {message && (
          <div className={`rounded-md p-4 ${
            message.includes('success') || message.includes(':)')
              ? 'bg-green-50 border border-green-200'
              : 'bg-red-50 border border-red-200'
          }`}>
            <p className={`text-sm ${
              message.includes('success') || message.includes(':)')
                ? 'text-green-700'
                : 'text-red-700'
            }`}>
              {message}
            </p>
          </div>
        )}

        {/* Simplified credentials form */}
        <form onSubmit={handleCredentialsSubmit} className="mt-8 space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              {t('auth:emailAddress')}
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (emailError) validateEmail(e.target.value);
              }}
              onBlur={(e) => validateEmail(e.target.value)}
              className={`mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                emailError ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder={t('auth:emailPlaceholder')}
            />
            {emailError && (
              <p className="mt-1 text-sm text-red-600">{emailError}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              {t('auth:password')}
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder={t('auth:passwordPlaceholder')}
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
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
          <p className="text-sm text-gray-500">
            {t('auth:moreOptionsComingSoon')}
          </p>
        </div>

      </div>
    </div>


  );
};

export default SignIn;