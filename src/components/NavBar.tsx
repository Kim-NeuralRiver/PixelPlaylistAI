'use client';

import Link from 'next/link';
import React, { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Image from "next/image";

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { data: session } = useSession();

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

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
        <div>
          <div
            className="rounded-full overflow-hidden border-2 border-gray-300 cursor-pointer"
            onClick={toggleDropdown}
          >
            <Image
              src="/Missing_avatar.svg"
              alt="User Avatar"
              width={48}
              height={48}
              className="object-cover"
            />
          </div>

          {isDropdownOpen && (
            <div
              className="absolute right-4 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg"
            >
              <ul className="py-1 text-gray-700">
                {session ? (
                  <>
                    <li
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => signOut()}
                    >
                      Sign Out
                    </li>
                  </>
                ) : (
                  <li
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      window.location.href = "/sign-in";
                    }
                    }
                  >
                    Sign In
                  </li>
                )}
              </ul>
              {session ? (
                <ul className="py-1 text-gray-700">
                  <>
                    <li
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={
                        () => {
                          window.location.href = "/settings";
                        }
                      }
                    >
                      Settings
                    </li>
                  </>
                </ul>
              ) : (
                <></>
              )}
              {!session ? (
                <ul className="py-1 text-gray-700">
                  <>
                    <li
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={
                        () => {
                          window.location.href = "/sign-up";
                        }
                      }
                    >
                      Sign Up
                    </li>
                  </>
                </ul>
              ) : (
                <></>
              )}
            </div>
          )}
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
