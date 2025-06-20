'use client';

import initTranslations from '@/app/i18n';
import { Resource, createInstance } from 'i18next';
import { I18nextProvider } from 'react-i18next';
import { useEffect, useState } from 'react';

interface ITranslationsProvider {
  children: React.ReactNode;
  locale: string;
  namespaces: string[];
  resources: Resource;
}

const TranslationsProvider: React.FC<ITranslationsProvider> = ({ 
  children, 
  locale, 
  namespaces, 
  resources 
}) => {
  const [i18n, setI18n] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initI18n = async () => {
      try {
        const i18nInstance = createInstance();
        await initTranslations(locale, namespaces, i18nInstance, resources);
        setI18n(i18nInstance);
      } catch (err) {
        console.error('Failed to initialize translations:', err);
        setError('Failed to load translations');
        // fallback instance
        const fallbackInstance = createInstance();
        await fallbackInstance.init({
          lng: 'en',
          fallbackLng: 'en',
          resources: {},
          interpolation: { escapeValue: false }
        });
        setI18n(fallbackInstance);
      }
    };

    initI18n();
  }, [locale, namespaces, resources]);

  if (!i18n) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading translations...</p>
      </div>
    );
  }

  if (error) {
    console.warn('Translation loading error:', error);
  }

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
};

export default TranslationsProvider;