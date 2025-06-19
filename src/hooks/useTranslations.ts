'use client';

import { useTranslation } from 'react-i18next';

export const useTranslations = (namespaces: string[] = ['common']) => {
  const { t, ready, i18n } = useTranslation(namespaces, {
    useSuspense: false
  });

  // Safe translation function with fallbacks
  const safeT = (key: string, fallback: string, options?: any) => {
    if (!ready) return fallback;
    
    try {
      const translation = t(key, { defaultValue: fallback, ...options });
      return translation || fallback;
    } catch {
      return fallback;
    }
  };

  return {
    t: safeT,
    ready,
    i18n
  };
};