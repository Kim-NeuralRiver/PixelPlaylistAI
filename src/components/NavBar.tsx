'use client';
// altered NavBar to reflect Django auth backend
import Link from 'next/link';
import React, { useState } from 'react';
import Image from "next/image";
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { isAuthenticated, user, signOut } = useAuth();

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const pathname = usePathname();

  const handleSignOut = () => {
    signOut();
    setIsDropdownOpen(false);
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo or App Name */}
        <Link href="/" className="text-xl font-bold text-blue-600">
          PixelPlaylistAI
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
          <Link href="/"
            className={`text-gray-600 hover:text-blue-900 ${pathname === "/" ? "font-bold text-blue-700" : ""}`}>
            Home
          </Link>
          <Link href="/recommendations"
            className={`text-gray-600 hover:text-blue-900 ${pathname === "/recommendations" ? "font-bold text-blue-700" : ""}`}>
            Recommendations
          </Link>
          <Link href="/contact-us"
            className={`text-gray-600 hover:text-blue-900 ${pathname === "/contact-us" ? "font-bold text-blue-700" : ""}`}>
            Contact Us
          </Link>
          <Link href="/faq"
            className={`text-gray-600 hover:text-blue-900 ${pathname === "/faq" ? "font-bold text-blue-700" : ""}`}>
            FAQ
          </Link>
          {/* Only show Playlists if authenticated */}
          {isAuthenticated && (
            <Link href="/playlists"
              className={`text-gray-600 hover:text-blue-900 ${pathname === "/playlists" ? "font-bold text-blue-700" : ""}`}>
              Playlists
            </Link>
          )}
        </div>

        {/* User Avatar/Profile Dropdown */}
        <div className="relative">
          <div
            className="rounded-full overflow-hidden border-2 border-gray-300 cursor-pointer hover:border-blue-500 transition-colors"
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
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
              {isAuthenticated ? (
                <>
                  {/* Show username if available */}
                  {user && (
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{user}</p>
                      <p className="text-xs text-gray-500">Signed in</p>
                    </div>
                  )}
                  
                  <ul className="py-1 text-gray-700">
                    <li>
                      <Link
                        href="/settings"
                        className="block px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        Settings
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/playlists"
                        className="block px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        My Playlists
                      </Link>
                    </li>
                    <li
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-600"
                      onClick={handleSignOut}
                    >
                      Sign Out
                    </li>
                  </ul>
                </>
              ) : (
                <>
                  <ul className="py-1 text-gray-700">
                    <li>
                      <Link
                        href="/sign-in"
                        className="block px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        Sign In
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/sign-up"
                        className="block px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        Sign Up
                      </Link>
                    </li>
                  </ul>
                </>
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
            className={`block px-3 py-2 rounded hover:bg-gray-50 text-gray-600 ${pathname === "/" ? "font-bold text-blue-700" : ""}`}
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>
          <Link
            href="/recommendations"
            className={`block px-3 py-2 rounded hover:bg-gray-50 text-gray-600 ${pathname === "/recommendations" ? "font-bold text-blue-700" : ""}`}
            onClick={() => setIsOpen(false)}
          >
            Recommendations
          </Link>
          <Link
            href="/faq"
            className={`block px-3 py-2 rounded hover:bg-gray-50 text-gray-600 ${pathname === "/faq" ? "font-bold text-blue-700" : ""}`}
            onClick={() => setIsOpen(false)}
          >
            FAQ
          </Link>
          <Link
            href="/contact-us"
            className={`block px-3 py-2 rounded hover:bg-gray-50 text-gray-600 ${pathname === "/contact-us" ? "font-bold text-blue-700" : ""}`}
            onClick={() => setIsOpen(false)}
          >
            Contact Us
          </Link>
          
          {/* Authenticated user mobile menu items */}
          {isAuthenticated ? (
            <>
              <Link
                href="/playlists"
                className={`block px-3 py-2 rounded hover:bg-gray-50 text-gray-600 ${pathname === "/playlists" ? "font-bold text-blue-700" : ""}`}
                onClick={() => setIsOpen(false)}
              >
                My Playlists
              </Link>
              <Link
                href="/settings"
                className={`block px-3 py-2 rounded hover:bg-gray-50 text-gray-600 ${pathname === "/settings" ? "font-bold text-blue-700" : ""}`}
                onClick={() => setIsOpen(false)}
              >
                Settings
              </Link>
              <button
                onClick={() => {
                  handleSignOut();
                  setIsOpen(false);
                }}
                className="block w-full text-left px-3 py-2 rounded hover:bg-gray-50 text-red-600"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="block px-3 py-2 rounded hover:bg-gray-50 text-gray-600"
                onClick={() => setIsOpen(false)}
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="block px-3 py-2 rounded hover:bg-gray-50 text-gray-600"
                onClick={() => setIsOpen(false)}
              >
                Sign Up
              </Link>
            </>
          )}
          
          <Link
            href="/privacy-policy"
            className={`block px-3 py-2 rounded hover:bg-gray-50 text-gray-600 ${pathname === "/privacy-policy" ? "font-bold text-blue-700" : ""}`}
            onClick={() => setIsOpen(false)}
          >
            Privacy Policy
          </Link>
        </div>
      )}
    </nav>
  );
}