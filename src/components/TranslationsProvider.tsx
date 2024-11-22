'use client';

import initTranslations from '@/app/i18n';
import { Resource, createInstance } from 'i18next';
import { I18nextProvider } from 'react-i18next';

interface ITranslationsProvider {
  children: React.ReactNode;
  locale: string;
  namespaces: string[];
  resources: Resource;
}
const TranslationsProvider: React.FC<ITranslationsProvider> = ({ children, locale, namespaces, resources }) => {
  const i18n = createInstance();

  initTranslations(locale, namespaces, i18n, resources);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
};

export default TranslationsProvider;
