'use client';

import LanguageChanger from '@/components/LanguageChanger';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useTranslation } from 'react-i18next';

const Home: React.FC = () => {
  const { t } = useTranslation(['common', 'home', 'auth']);
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>{t('auth:loading')}</p>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    router.push('/sign-in');
    return null;
  }

  const user = session?.user?.name || session?.user?.email;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <main className="flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold mb-4">{t('home:title')}</h1>
        <p className="text-xl mb-8">{t('home:description')}</p>
        <p className="text-lg mb-4">{t('home:welcome', { username: user })}</p>
        <div className="mb-8 w-full">
          <h2 className="text-2xl font-semibold mb-2">{t('home:features.title')}</h2>
          <ul className="list-disc list-inside">
            {['feature1', 'feature2', 'feature3'].map((feature) => (
              <li key={feature}>{t(`home:features.${feature}`)}</li>
            ))}
          </ul>
        </div>
        <button
          onClick={() => signOut()}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 mb-4"
        >
          {t('auth:signOut')}
        </button>
        <LanguageChanger />
      </main>
      <footer className="mt-8 text-gray-600">{t('common:footer')}</footer>
    </div>
  );
};

export default Home;
