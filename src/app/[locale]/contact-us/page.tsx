'use client';

import React, { useState } from 'react';

export default function ContactUsPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: Replace with working logic.
    console.log({ name, email, message });
    alert('Your message has been submitted!');
    // Reset the form
    setName('');
    setEmail('');
    setMessage('');
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 py-10 px-4">
      <div className="bg-white w-full max-w-md p-6 rounded-md shadow-md">
        <h1 className="text-2xl font-bold mb-4 text-center text-blue-600">Contact Us</h1>
        <p className="text-gray-600 mb-6">
          Feel free to reach out if you have any questions or concerns. We are here to help! Please fill out the form
          below and we will get back to you as soon as possible.
        </p>

        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              id="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 text-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 text-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700">
              Message
            </label>
            <textarea
              id="message"
              rows={4}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 text-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Send
          </button>
        </form>

        {/* Some Lorem Ipsum / additional info */}
        <div className="mt-6 text-gray-500 text-sm">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce euismod nisi eget nibh porttitor, nec
            fermentum sapien sollicitudin.
          </p>
        </div>
      </div>
    </main>
  );
}
