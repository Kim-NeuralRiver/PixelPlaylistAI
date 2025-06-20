'use client';

// import '@/app/i18n';
import { store } from '@/store/store';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Provider } from 'react-redux';

interface IClientProvider {
  children: React.ReactNode;
  lang: string;
}

const ClientProvider: React.FC<IClientProvider> = ({ children, lang }) => {
  const { i18n } = useTranslation();

  useEffect(() => {
    i18n.changeLanguage(lang);
  }, [lang, i18n]);

  return <Provider store={store}>{children}</Provider>;
};

export default ClientProvider;
