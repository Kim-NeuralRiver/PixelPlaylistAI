'use client';
// Note: The old sign-in page is saved elsewhere, in case this doesn't work

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';

const SignIn: React.FC = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const router = useRouter();
  const { t } = useTranslation(['auth']);
  const { signIn } = useAuth();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      setEmailError('');
      return true;
    }
    if (!emailRegex.test(email)) {
      setEmailError(t('auth:emailInvalid'));
      return false;
    }
    setEmailError('');
    return true;
  };

  const validateUsername = (username: string) => {
    if (!username.trim()) {
      setUsernameError('');
      return true;
    }
    setUsernameError('');
    return true;
  };

  const validateCredentials = () => {
    const emailValid = validateEmail(email);
    const usernameValid = validateUsername(username);

    // At least email or username must be provided
    if (!email.trim() && !username.trim()) {
      setEmailError(t('auth:emailOrUsernameRequired'));
      setUsernameError(t('auth:emailOrUsernameRequired'));
      return false;
    }

    // Clear any errors if one or other field is provided and valid
    if (email.trim() && !emailValid) {
      return false;
    }
    if (username.trim() && !usernameValid) {
      return false;
    }

    // Clear 'field required' errors if either field has content
    if (email.trim() || username.trim()) {
      if (emailError === t('auth:emailOrUsernameRequired')) {
        setEmailError('');
      }
      if (usernameError === t('auth:emailOrUsernameRequired')) {
        setUsernameError('');
      }
    }

    return emailValid && usernameValid;
  }

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    console.log('Form submit triggered, event:', e); // Debug log
    
    if (e) {
      e.preventDefault();
    }
    setMessage('');
    setLoading(true);

    console.log('Email:', email, 'Username:', username, 'Password length:', password.length); // Debug log

    if (!validateCredentials()) {
      setLoading(false);
      return;
    }
    if (!password.trim()) {
      setMessage(t('auth:passwordRequired'));
      setLoading(false);
      return;
    }
  
    try {
      console.log('Calling signIn...'); // Debug log
      const result = await signIn(email, username, password);
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
            <label htmlFor="email" className="block text-sm font-medium text-card">
              {t('auth:emailAddress')}
            </label>
            <input
              id="email"
              type="email"
              required={!username.trim()}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (emailError) validateEmail(e.target.value);
                // clear required error when user starts typing
                if (emailError === t('auth:emailOrUsernameRequired') && e.target.value.trim()) {
                  setEmailError('');
                }
              }}
              onBlur={(e) => validateEmail(e.target.value)}
              className={`mt-1 block w-full px-3 py-2 border rounded-md bg-input text-input focus:outline-none focus:ring-blue-500 focus:border-success-border sm:text-sm ${
                emailError ? 'border-red-500' : 'border-input'
              }`}
              placeholder={t('auth:emailPlaceholder')}
            />
            {emailError && (
              <p className="mt-1 text-sm text-error">{emailError}</p>
            )}
          </div>

          <div>
            <label htmlFor="username" className="block text-sm font-medium text-card">
              {t('auth:username')} {!email.trim() && <span className="text-secondary">*</span>}
            </label>
            <input
              id="username"
              type="text"
              required={!email.trim()}
              value={username}
              onChange={(e) => { 
                setUsername(e.target.value);
                if (usernameError) validateUsername(e.target.value); 
                // Clear required error when user types
                if (usernameError === t('auth:emailOrUsernameRequired') && e.target.value.trim()) {
                  setUsernameError('');
                }
              }}
              onBlur={(e) => validateUsername(e.target.value)}
              className={`mt-1 block w-full px-3 py-2 border rounded-md bg-input text-input focus:outline-none focus:ring-blue-500 focus:border-success-border sm:text-sm ${
                usernameError ? 'border-red-500' : 'border-input'
              }`}
              placeholder={t('auth:usernamePlaceholder')}
            />
            {usernameError && (
              <p className="mt-1 text-sm text-error">{usernameError}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-card">
              {t('auth:password')}
            </label>
            <input
              id="password"
              type="password"
              required
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