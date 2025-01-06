'use client';

import React from 'react';

export default function FAQPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center py-8 px-4 bg-gray-50">
      <div className="bg-white w-full max-w-2xl p-6 rounded-md shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-blue-600">Frequently Asked Questions</h1>

        {/* Question 1 */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2 text-blue-600">Q: What is Lorem Ipsum?</h2>
          <p className="text-gray-700">
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. It has been the industry’s
            standard dummy text ever since the 1500s.
          </p>
        </div>

        {/* Question 2 */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2 text-blue-600">Q: Why do we use it?</h2>
          <p className="text-gray-700">
            It is a long established fact that a reader will be distracted by the readable content of a page when
            looking at its layout. Lorem Ipsum helps in focusing on design elements.
          </p>
        </div>

        {/* Question 3 */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2 text-blue-600">Q: Where can I get some?</h2>
          <p className="text-gray-700">
            There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration.
            You can also use generators like
            <a
              href="https://www.lipsum.com/"
              className="text-blue-600 underline ml-1"
              target="_blank"
              rel="noopener noreferrer"
            >
              lorem ipsum.com
            </a>
            &nbsp;to get your own.
          </p>
        </div>
      </div>
    </main>
  );
}
