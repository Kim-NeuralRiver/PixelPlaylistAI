import { Resource, createInstance, i18n } from 'i18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import { initReactI18next } from 'react-i18next/initReactI18next';

import i18nConfig from '../../i18nConfig';

const initTranslations = async (
  locale: string, 
  namespaces: string[], 
  i18nInstance?: i18n, 
  resources?: Resource
) => {
  i18nInstance = i18nInstance || createInstance();

  i18nInstance.use(initReactI18next);

  if (!resources) {
    i18nInstance.use(
      resourcesToBackend((language: string, namespace: string) => {
        return import(`../../locales/${language}/${namespace}.json`);
      }),
    );
  }

  await i18nInstance.init({
    lng: locale,
    resources,
    fallbackLng: i18nConfig.defaultLocale,
    supportedLngs: i18nConfig.locales,
    defaultNS: namespaces[0] || 'common', // Default to 'common' if no namespaces are provided
    fallbackNS: 'common', // Fallback namespace
    ns: namespaces,
    preload: resources ? [] : i18nConfig.locales,

    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false, // Disable suspense to avoid issues with loading translations
    },

    // Fallback behaviour if translations are not found
    returnNull: false,
    returnEmptyString: false,
    returnObjects: false,
  });

  return {
    i18n: i18nInstance,
    resources: i18nInstance.services.resourceStore.data,
    t: i18nInstance.t,
  };
};

export default initTranslations;
