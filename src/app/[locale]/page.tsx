'use client';

import LanguageChanger from '@/components/LanguageChanger';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const Home: React.FC = () => {
  const { t } = useTranslation(['common', 'home', 'auth']);
  const { isAuthenticated, user, signOut } = useAuth();
  const router = useRouter();

  // useEffect(() => {
  //   if (!isAuthenticated) {
  //     router.push('/sign-in'); 
  //   }
  // }, [isAuthenticated, router]);

  // if (!isAuthenticated) { 
  //   return (
  //     <div className="min-h-screen flex items-center justify-center">
  //       <p>{t('common:loading')}</p>
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <main className="flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold mb-4">{t('home:title')}</h1> 
        <p className="text-xl mb-8 mx-2">{t('home:description')}</p>
        <p className="text-lg mb-4">
          {t('home:welcome', { username: user || t('auth:usernamePlaceholder') })} 
        </p>

        <div className="mb-8 w-full">
          <h2 className="text-2xl font-semibold mb-2">{t('home:features.title')}</h2>
          <ul className="list-disc list-inside">
            {['feature1', 'feature2', 'feature3'].map((feature) => (
              <li key={feature}>{t(`home:features.${feature}`)}</li>
            ))}
          </ul>
        </div>

        <div className="flex gap-4 mb-4">
          <button
            onClick={() => router.push('/recommendations')}
            className="bg-blue-600 text-white px-8 py-2 rounded hover:bg-blue-700"
          >
            {t('home:recommendations')}
          </button>

          <button
            onClick={() => router.push('/sign-up')}
            className="bg-green-400 text-white px-6 py-2 rounded hover:bg-green-700"
          >
            {t('auth:signUp')}
          </button>

          <button
            onClick={() => router.push('/sign-in')}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {t('auth:signIn')}
          </button>

          <button
            onClick={signOut}
            className="bg-red-500 text-white px-2 py-2 rounded hover:bg-red-600"
          >
            {t('auth:signOut')}
          </button>
        </div>

        <LanguageChanger />
      </main>
      <footer className="mt-8 text-gray-600">{t('common:footer')}</footer>
    </div>
  );
};

export default Home;
