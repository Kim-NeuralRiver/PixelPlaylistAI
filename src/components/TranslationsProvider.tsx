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
}) => { // moved for readability
  const [i18n, setI18n] = useState<any>(null); // Use 'any' for i18n type to avoid issues with types

  useEffect(() => {
    const initI18n = async () => {
      const i18nInstance = createInstance();
      await initTranslations(locale, namespaces, i18nInstance, resources);
      setI18n(i18nInstance);
  };

  initI18n();
}, [locale, namespaces, resources]); // Initialize i18n instance when locale or namespaces change

  if (!i18n) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading translations...</p>
      </div>
    );
  }

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
};

export default TranslationsProvider;
