'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';

export default function FAQPage() {
  const { t } = useTranslation(['faq']);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center py-8 px-4 bg-gray-50">
      <div className="bg-white w-full max-w-2xl p-6 rounded-md shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-button-primary">
          {t('faq:title')}
        </h1>

        {/* Question 1 */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2 text-button-primary">
            {t('faq:q1.question')}
          </h2>
          <p className="text-gray-700">
            {t(
              'faq:q1.answer'
            )}
          </p>
        </div>

        {/* Question 2 */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2 text-button-primary">
            {t('faq:q2.question')}
          </h2>
          <p className="text-gray-700">
            {t(
              'faq:q2.answer'
            )}
          </p>
        </div>

        {/* Question 3 */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2 text-button-primary">
            {t('faq:q3.question')}
          </h2>
          <p className="text-gray-700">
            {t(
              'faq:q3.answer1'
            )}
            &nbsp;
            {t('faq:q3.answer2')}
            <a
              href="/sign-up"
              className="text-button-primary underline ml-1"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t('faq:q3.answer3')}
            </a>
            .
          </p>
        </div>

        {/* Question 4 */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2 text-button-primary">
            {t('faq:q4.question')}
          </h2>
          <p className="text-gray-700">
            {t(
              'faq:q4.answer'
            )}
          </p>
        </div>
      </div>
    </main>
  );
}
