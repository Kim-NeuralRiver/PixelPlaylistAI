'use client';

import Link from 'next/link';
import React, { useState } from 'react';
import Image from "next/image";
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from 'react-i18next';

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { isAuthenticated, user, signOut } = useAuth();
  const { t } = useTranslation(['common', 'auth']);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const pathname = usePathname();

  const handleSignOut = () => {
    signOut();
    setIsDropdownOpen(false);
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-3 relative z-20">
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
          aria-label={t('common:navigation.toggleMenu')}
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
            {t('common:navigation.home')}
          </Link>
          <Link href="/recommendations"
            className={`text-gray-600 hover:text-blue-900 ${pathname === "/recommendations" ? "font-bold text-blue-700" : ""}`}>
            {t('common:navigation.recommendations')}
          </Link>
          <Link href="/contact-us"
            className={`text-gray-600 hover:text-blue-900 ${pathname === "/contact-us" ? "font-bold text-blue-700" : ""}`}>
            {t('common:navigation.contactUs')}
          </Link>
          <Link href="/faq"
            className={`text-gray-600 hover:text-blue-900 ${pathname === "/faq" ? "font-bold text-blue-700" : ""}`}>
            {t('common:navigation.faq')}
          </Link>
          <Link href="/privacy-policy"
            className={`text-gray-600 hover:text-blue-900 ${pathname === "/privacy-policy" ? "font-bold text-blue-700" : ""}`}>
            {t('common:navigation.privacyPolicy')}
          </Link>
          {/* Only show Playlists if authenticated */}
          {isAuthenticated && (
            <Link href="/playlists"
              className={`text-gray-600 hover:text-blue-900 ${pathname === "/playlists" ? "font-bold text-blue-700" : ""}`}>
              {t('common:navigation.playlists')}
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
              src="/NoAvatar.svg"
              alt={t('common:navigation.userAvatar')}
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
                      <p className="text-xs text-gray-500">{t('auth:signedIn')}</p>
                    </div>
                  )}
                  
                  <ul className="py-1 text-gray-700">
                    <li>
                      <Link
                        href="/settings"
                        className="block px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        {t('common:navigation.settings')}
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/playlists"
                        className="block px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        {t('common:navigation.myPlaylists')}
                      </Link>
                    </li>
                    <li
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-600"
                      onClick={handleSignOut}
                    >
                      {t('auth:signOut')}
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
                         {t('auth:signIn')}
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/sign-up"
                        className="block px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        {t('auth:signUp')}
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
            {t('common:navigation.home')}
          </Link>
          <Link
            href="/recommendations"
            className={`block px-3 py-2 rounded hover:bg-gray-50 text-gray-600 ${pathname === "/recommendations" ? "font-bold text-blue-700" : ""}`}
            onClick={() => setIsOpen(false)}
          >
            {t('common:navigation.recommendations')}
          </Link>
          <Link
            href="/faq"
            className={`block px-3 py-2 rounded hover:bg-gray-50 text-gray-600 ${pathname === "/faq" ? "font-bold text-blue-700" : ""}`}
            onClick={() => setIsOpen(false)}
          >
            {t('common:navigation.faq')}
          </Link>
          <Link
            href="/contact-us"
            className={`block px-3 py-2 rounded hover:bg-gray-50 text-gray-600 ${pathname === "/contact-us" ? "font-bold text-blue-700" : ""}`}
            onClick={() => setIsOpen(false)}
          >
            {t('common:navigation.contactUs')}
          </Link>
          
          {/* Authenticated user mobile menu items */}
          {isAuthenticated ? (
            <>
              <Link
                href="/playlists"
                className={`block px-3 py-2 rounded hover:bg-gray-50 text-gray-600 ${pathname === "/playlists" ? "font-bold text-blue-700" : ""}`}
                onClick={() => setIsOpen(false)}
              >
                {t('common:navigation.myPlaylists')}
              </Link>
              <Link
                href="/settings"
                className={`block px-3 py-2 rounded hover:bg-gray-50 text-gray-600 ${pathname === "/settings" ? "font-bold text-blue-700" : ""}`}
                onClick={() => setIsOpen(false)}
              >
                {t('common:navigation.settings')}
              </Link>
              <button
                onClick={() => {
                  handleSignOut();
                  setIsOpen(false);
                }}
                className="block w-full text-left px-3 py-2 rounded hover:bg-gray-50 text-red-600"
              >
                {t('auth:signOut')}
              </button>
            </>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="block px-3 py-2 rounded hover:bg-gray-50 text-gray-600"
                onClick={() => setIsOpen(false)}
              >
                {t('auth:signIn')}
              </Link>
              <Link
                href="/sign-up"
                className="block px-3 py-2 rounded hover:bg-gray-50 text-gray-600"
                onClick={() => setIsOpen(false)}
              >
                {t('auth:signUp')}
              </Link>
            </>
          )}
          
          <Link
            href="/privacy-policy"
            className={`block px-3 py-2 rounded hover:bg-gray-50 text-gray-600 ${pathname === "/privacy-policy" ? "font-bold text-blue-700" : ""}`}
            onClick={() => setIsOpen(false)}
          >
            {t('common:navigation.privacyPolicy')}
          </Link>
        </div>
      )}
    </nav>
  );
}