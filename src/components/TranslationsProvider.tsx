'use client';

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
        await i18nInstance.init({
          lng: locale,
          resources,
          fallbackLng: 'en',
          supportedLngs: ['en', 'uk'],
          defaultNS: 'common',
          fallbackNS: 'common',
          ns: namespaces,
          interpolation: {
            escapeValue: false,
          },
          react: {
            useSuspense: false, // Disable suspense to avoid issues with loading translations
          },
          returnNull: false,
          returnEmptyString: false,
          returnObjects: false,
        });
        setI18n(i18nInstance);
      } catch (err) {
        console.error('Error initialising i18n:', err);
        setError('Failed to load translations');

        // fallback instance w/ minimal resources
        const fallbackInstance = createInstance();
        await fallbackInstance.init({
          lng: 'en',
          fallbackLng: 'en',
          resources: {
            en: {
              common: {
                loading: 'Loading...',
                error: 'Something went wrong'
              }
            }
          },
          interpolation: { escapeValue: false },
          react: { useSuspense: false },
          returnNull: false,
          returnEmptyString: false,
        });
        setI18n(fallbackInstance);
      }
    };

    initI18n();
  }, [locale, namespaces, resources]);

  if (!i18n) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading translations...</div>
      </div>
    );
  }

  if (error) {
    console.warn('Translation loading error, using fallback:', error);
  }

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
};

export default TranslationsProvider;