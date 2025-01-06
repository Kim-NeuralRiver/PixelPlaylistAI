'use client';

import React from 'react';

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center py-8 px-4 bg-gray-50">
      <div className="bg-white w-full max-w-3xl p-8 rounded-md shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-blue-600">Privacy Policy</h1>
        <p className="text-gray-700 mb-4">
          This Privacy Policy describes how we handle your personal information for our services on our platform. By
          using our services, you agree to the collection, use, disclosure, and storage of your personal information as
          described in this policy.
        </p>

        <h2 className="text-xl font-semibold mb-2 text-blue-600">Information Collection and Use</h2>
        <p className="text-gray-700 mb-4">
          We collect the following types of information to provide and improve our services to you:
        </p>
        <ul className="list-disc list-inside mb-4 text-gray-700">
          <li>Information you provide directly, such as when you sign up or contact us.</li>
          <li>Usage data about how you interact with our site.</li>
          <li>Cookies and similar technologies that help us understand user behavior.</li>
        </ul>

        <h2 className="text-xl font-semibold mb-2 text-blue-600">Data Sharing and Disclosure</h2>
        <p className="text-gray-700 mb-4">
          We do not share personal information with third parties except as necessary to provide our services or when
          legally required. We may share aggregated or anonymized data that cannot reasonably be used to identify you.
        </p>

        <h2 className="text-xl font-semibold mb-2 text-blue-600">Data Security</h2>
        <p className="text-gray-700 mb-4">
          We use industry-standard measures to protect your data from unauthorized access, alteration, or destruction.
          However, no transmission over the Internet can be guaranteed to be completely secure.
        </p>

        <h2 className="text-xl font-semibold mb-2 text-blue-600">Your Rights</h2>
        <p className="text-gray-700 mb-4">
          You have the right to access, correct, or delete your personal information, and the right to object to or
          restrict certain processing of your information.
        </p>

        <h2 className="text-xl font-semibold mb-2 text-blue-600">Changes to This Policy</h2>
        <p className="text-gray-700 mb-4">
          We may update this Privacy Policy from time to time. When we do, we will revise the “last updated” date at the
          top of this page. We encourage you to review this page periodically.
        </p>

        {/* Some Placeholder / Lorem Ipsum */}
        <div className="mt-6 text-gray-500">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus commodo urna purus, in venenatis ligula
            luctus eget. Sed efficitur, dolor eget convallis sollicitudin, est elit vehicula dui, in vulputate eros urna
            a libero. Nunc vel aliquam arcu.
          </p>
          <p className="mt-4">
            Phasellus efficitur nisl vel congue finibus. Donec gravida viverra ex, elementum fermentum magna laoreet ac.
            Vivamus posuere diam non libero feugiat, eu iaculis nunc ornare.
          </p>
        </div>
      </div>
    </main>
  );
}
