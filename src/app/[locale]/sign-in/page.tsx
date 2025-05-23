'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { signIn } from 'next-auth/react';


const SignIn: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'credentials' | 'magic-link' | 'google'>('credentials');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();
  const { t } = useTranslation(['auth']);

const handleCredentialsSubmit = async (e: React.FormEvent) => { // Django creds
  e.preventDefault();
  setMessage('');

  try {
    const res = await fetch('http://localhost:8000/api/token/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: email, 
        password: password,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.detail || 'Login failed');
    }

    localStorage.setItem('access_token', data.access);
    localStorage.setItem('refresh_token', data.refresh);

    router.push('/');
  } catch (err) {
    alert(t('auth:signInError'));
    console.error('Login error:', err);
  }
};


  const handleMagicLinkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await signIn('email', {
      redirect: false,
      email,
    });

    if (result?.error) {
      setMessage(t('auth:checkEmailError'));
    } else {
      setMessage(t('auth:checkEmail'));
    }
  };

  const handleGoogleSignIn = () => {
    signIn('google');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-blue-600">{t('auth:signIn')}</h1>
        <div className="flex justify-between border-b mb-4">
          <button
            className={`pb-2 w-1/3 text-center font-medium ${
              activeTab === 'credentials' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'
            }`}
            onClick={() => setActiveTab('credentials')}
          >
            {t('Credentials')}
          </button>
          <button
            className={`pb-2 w-1/3 text-center font-medium ${
              activeTab === 'magic-link' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'
            }`}
            onClick={() => setActiveTab('magic-link')}
          >
            {t('Magic Link')}
          </button>
          <button
            className={`pb-2 w-1/3 text-center font-medium ${
              activeTab === 'google' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'
            }`}
            onClick={() => setActiveTab('google')}
          >
            {t('Google')}
          </button>
        </div>
        {activeTab === 'credentials' && (
          <form onSubmit={handleCredentialsSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                {t('auth:email')}
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 text-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                {t('auth:password')}
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 text-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {t('auth:signIn')}
            </button>
          </form>
        )}

        {activeTab === 'magic-link' && (
          <form onSubmit={handleMagicLinkSubmit} className="space-y-4">
            <div>
              <label htmlFor="magic-email" className="block text-sm font-medium text-gray-700">
                {t('auth:email')}
              </label>
              <input
                type="email"
                id="magic-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 text-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {t('Send Magic Link')}
            </button>
            {message && <p className="text-center mt-2 text-green-500">{message}</p>}
          </form>
        )}

        {activeTab === 'google' && (
          <div className="space-y-4">
            <button
              onClick={handleGoogleSignIn}
              className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-100"
            >
              {t('Sign In With Google')}
            </button>
          </div>
        )}
        <p className="text-gray-700 mt-4 text-center">
          {t('auth:dontHaveAccount')}{' '}
          <Link href="/sign-up" className="text-blue-500 hover:underline">
            {t('auth:signUp')}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
