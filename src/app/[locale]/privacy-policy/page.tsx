'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';

export default function PrivacyPolicyPage() {
  const { t } = useTranslation(['privacy-policy']);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center py-8 px-4 bg-background">
      <div className="bg-card w-full max-w-3xl p-8 rounded-md shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-button-primary">
          {t('privacy-policy:title')}
        </h1>

        <p className="text-secondary mb-4">
          {t(
            'privacy-policy:intro'
          )}
        </p>

        <h2 className="text-xl font-semibold mb-2 text-button-primary">
          {t('privacy-policy:infoCollectionTitle')}
        </h2>
        <p className="text-secondary mb-4">
          {t('privacy-policy:infoCollectionIntro')}
        </p>
        <ul className="list-disc list-inside mb-4 text-secondary">
          <li>{t('privacy-policy:infoItem1')}</li>
          <li>{t('privacy-policy:infoItem2')}</li>
          <li>{t('privacy-policy:infoItem3')}</li>
        </ul>

        <h2 className="text-xl font-semibold mb-2 text-button-primary">
          {t('privacy-policy:sharingTitle')}
        </h2>
        <p className="text-secondary mb-4">
          {t(
            'privacy-policy:sharingText'
          )}
        </p>

        <h2 className="text-xl font-semibold mb-2 text-button-primary">
          {t('privacy-policy:securityTitle')}
        </h2>
        <p className="text-secondary mb-4">
          {t(
            'privacy-policy:securityText'
          )}
        </p>

        <h2 className="text-xl font-semibold mb-2 text-button-primary">
          {t('privacy-policy:rightsTitle')}
        </h2>
        <p className="text-secondary mb-4">
          {t(
            'privacy-policy:rightsText'
          )}
        </p>

        <h2 className="text-xl font-semibold mb-2 text-button-primary">
          {t('privacy-policy:changesTitle')}
        </h2>
        <p className="text-secondary mb-4">
          {t(
            'privacy-policy:changesText'
          )}
        </p>

        <div className="mt-6 text-card">
          <p>
            {t(
              'privacy-policy:contactUs1'
            )}
          </p>
          <div className="mt-2">
          <Link href="/contact-us" className="mt-4  bg-button-secondary hover:to-button-secondaryHover text-white px-2 py-2 rounded">
            {t(
              'privacy-policy:contactUs2'
            )}
          </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
