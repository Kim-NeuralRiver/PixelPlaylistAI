'use client';

import Link from 'next/link';
import React, { useState } from 'react';

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo or App Name */}
        <Link href="/" className="text-xl font-bold text-blue-600">
          Neural Spring
        </Link>

        {/* Hamburger Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center p-2 text-gray-600 hover:text-gray-900 focus:outline-none md:hidden"
          aria-expanded={isOpen}
          aria-label="Toggle navigation menu"
        >
          {isOpen ? (
            // "X" icon
            <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            // Hamburger icon
            <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>

        {/* Desktop Menu */}
        <div className="hidden space-x-6 md:flex">
          <Link href="/" className="text-gray-600 hover:text-blue-900">
            Home
          </Link>
          <Link href="/faq" className="text-gray-600 hover:text-blue-900">
            FAQ
          </Link>
          <Link href="/contact-us" className="text-gray-600 hover:text-blue-900">
            Contact Us
          </Link>
          <Link href="/privacy-policy" className="text-gray-600 hover:text-blue-900">
            Privacy Policy
          </Link>
        </div>
      </div>

      {/* Mobile Menu (shown when `isOpen` is true) */}
      {isOpen && (
        <div className="mt-3 md:hidden">
          <Link
            href="/"
            className="block px-3 py-2 rounded hover:bg-gray-50 text-gray-600"
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>
          <Link
            href="/faq"
            className="block px-3 py-2 rounded hover:bg-gray-50 text-gray-600"
            onClick={() => setIsOpen(false)}
          >
            FAQ
          </Link>
          <Link
            href="/contact-us"
            className="block px-3 py-2 rounded hover:bg-gray-50 text-gray-600"
            onClick={() => setIsOpen(false)}
          >
            Contact Us
          </Link>
          <Link
            href="/privacy-policy"
            className="block px-3 py-2 rounded hover:bg-gray-50 text-gray-600"
            onClick={() => setIsOpen(false)}
          >
            Privacy Policy
          </Link>
        </div>
      )}
    </nav>
  );
}
