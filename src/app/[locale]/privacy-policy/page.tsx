'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';

export default function PrivacyPolicyPage() {
  const { t } = useTranslation(['privacy', 'common']);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center py-8 px-4 bg-gray-50">
      <div className="bg-white w-full max-w-3xl p-8 rounded-md shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-blue-600">
          {t('privacy:title')}
        </h1>

        <p className="text-gray-700 mb-4">
          {t(
            'privacy:intro'
          )}
        </p>

        <h2 className="text-xl font-semibold mb-2 text-blue-600">
          {t('privacy:infoCollectionTitle')}
        </h2>
        <p className="text-gray-700 mb-4">
          {t('privacy:infoCollectionIntro')}
        </p>
        <ul className="list-disc list-inside mb-4 text-gray-700">
          <li>{t('privacy:infoItem1')}</li>
          <li>{t('privacy:infoItem2')}</li>
          <li>{t('privacy:infoItem3')}</li>
        </ul>

        <h2 className="text-xl font-semibold mb-2 text-blue-600">
          {t('privacy:sharingTitle')}
        </h2>
        <p className="text-gray-700 mb-4">
          {t(
            'privacy:sharingText'
          )}
        </p>

        <h2 className="text-xl font-semibold mb-2 text-blue-600">
          {t('privacy:securityTitle')}
        </h2>
        <p className="text-gray-700 mb-4">
          {t(
            'privacy:securityText'
          )}
        </p>

        <h2 className="text-xl font-semibold mb-2 text-blue-600">
          {t('privacy:rightsTitle')}
        </h2>
        <p className="text-gray-700 mb-4">
          {t(
            'privacy:rightsText'
          )}
        </p>

        <h2 className="text-xl font-semibold mb-2 text-blue-600">
          {t('privacy:changesTitle')}
        </h2>
        <p className="text-gray-700 mb-4">
          {t(
            'privacy:changesText'
          )}
        </p>

        <div className="mt-6 text-gray-500">
          <p>
            {t(
              'privacy:lorem1'
            )}
          </p>
          <p className="mt-4">
            {t(
              'privacy:lorem2'
            )}
          </p>
        </div>
      </div>
    </main>
  );
}
