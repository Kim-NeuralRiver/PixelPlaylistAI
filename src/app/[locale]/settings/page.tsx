'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { tokenManager } from '@/utils/api/tokenManager';
import { useTranslation } from 'react-i18next';
import { updateUserProfile, changePassword } from '@/utils/api/users'; 

interface UserData {
  id: number;
  username: string;
  email: string;
  first_name: string;
}

const UserSettings: React.FC = () => {
  const { t } = useTranslation(['settings', 'common', 'auth']);
  const { isAuthenticated, user, signOut } = useAuth();
  const router = useRouter();

  const [userData, setUserData] = useState<UserData | null>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState(''); // Unused currently
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(true);
  const [hasFetched, setHasFetched] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Handle fetch error with useCallback to prevent unnecessary re-renders
  const handleFetchError = useCallback((error: any) => {
    console.error('Error fetching user data:', error);
    setErrorMessage(t('settings:fetchUserError'));
  }, []);


  // Handle sign out with useCallback to avoid unnecessary re-renders and dependencies
  const handleSignOut = useCallback(() => {
    signOut();
  }, [signOut]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/sign-in');
      return;
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (!isAuthenticated || hasFetched) return; // Return early if already fetched or not authenticated

    const fetchUserData = async () => {
      try {
        setLoading(true);
        const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        const token = await tokenManager.ensureValidToken();

        const response = await fetch(`${BASE_URL}/api/user/profile/`, { 
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            handleSignOut();
            return;
          }
          throw new Error(t('settings:fetchUserError'));
        }

        const data = await response.json(); // Fetch user data from API
        setUserData(data);
        setFirstName(data.first_name || '');
        setEmail(data.email || '');
        setUsername(data.username || '');
        setHasFetched(true); // Mark as fetched to prev re-fetching / too many requests
      } catch (error) {
        handleFetchError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [isAuthenticated, hasFetched, handleFetchError, handleSignOut, t]);

  const handlePersonalInfoSubmit = async (e: React.FormEvent) => { // Handle personal info update
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    // Only update if fields are changed (exclude email since it's not editable)
    const updatedData: { first_name?: string } = {};
    if (firstName !== userData?.first_name) updatedData.first_name = firstName;

    // Make API call only if there are changes
    if (Object.keys(updatedData).length === 0) {
      setSuccessMessage(t('settings:noChanges'));
      setLoading(false);
      return;
    }

    try {
      const result = await updateUserProfile(updatedData);

      if (result.success) {
        setSuccessMessage(t('settings:updateSuccess'));
        // Update local user data
        setUserData(prev => prev ? { ...prev, ...updatedData } : null);
      } else {
        setErrorMessage(result.error || t('settings:updateError'));
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setErrorMessage(t('settings:updateError'));
    } finally {
      setLoading(false);
    }
  };

  // Password change function
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    if (newPassword !== confirmNewPassword) {
      setErrorMessage(t('settings:passwordMismatch'));
      setPasswordLoading(false);
      return;
    }

    if (newPassword.length < 8) {
      setErrorMessage(t('settings:passwordTooShort'));
      setPasswordLoading(false);
      return;
    }

    try {
      const result = await changePassword({
        old_password: currentPassword,
        new_password1: newPassword,
        new_password2: confirmNewPassword
      });

      if (result.success) {
        setSuccessMessage(t('settings:passwordChangeSuccess'));
        // reset password form fields
        setCurrentPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
      } else {
        if (result.fieldErrors) {
          // handle field specific errors
          const errorKeys = Object.keys(result.fieldErrors);
          if (errorKeys.length > 0) { 
            setErrorMessage(result.fieldErrors[errorKeys[0]] || t('settings:passwordChangeFail')); // Error key length check
          } else {
            setErrorMessage(result.error || t('settings:passwordChangeError'));
          }
        } else {
          setErrorMessage(result.error || t('settings:passwordChangeError'));
        }
      }
    } catch (error) {
      console.error('Error changing password:', error);
      setErrorMessage
    } finally {
      setPasswordLoading(false);
    }
  };

  if (!isAuthenticated || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-gray-500">{t('common:loading')}</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-extrabold text-gray-900">{t('settings:title')}</h1>
          <button
            onClick={signOut}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            {t('auth:signOut')}
          </button>
        </div>

        {(errorMessage || successMessage) && (
          <div className={`mb-4 p-4 rounded-md ${errorMessage ? 'bg-red-50 border border-red-300' : 'bg-green-50 border border-green-300'}`}>
            <div className="flex">
              <div className="flex-shrink-0">
                {errorMessage ? (
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-9v4a1 1 0 102 0V9a1 1 0 10-2 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <div className="ml-3">
                <p className={`text-sm ${errorMessage ? 'text-red-700' : 'text-green-700'}`}>
                  {errorMessage || successMessage}
                </p>
              </div>
              <div className="ml-auto pl-3">
                <div className="-mx-1.5 -my-1.5">
                  <button
                    type="button"
                    onClick={() => {errorMessage ? setErrorMessage(null) : setSuccessMessage(null)}}
                    className="inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2"
                  >
                    <span className="sr-only">Dismiss</span>
                    <svg className={`h-5 w-5 ${errorMessage ? 'text-red-400' : 'text-green-400'}`} viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              {t('settings:personalInfo')}
            </h2>
            <form onSubmit={handlePersonalInfoSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                    {t('settings:firstName')}
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                    {t('settings:lastName')}
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                  {t('settings:username')}
                </label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  disabled
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-50 text-gray-500"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  {t('settings:email')}
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  disabled
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-50 text-gray-500"
                />
                <p className="mt-1 text-sm text-gray-500">
                  {t('settings:emailNote')}
                </p>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
              >
                {t('settings:updateProfile')}
              </button>
            </form>
          </div>
        </div>

        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              {t('settings:changePassword')}
            </h2>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                  {t('settings:currentPassword')}
                </label>
                <input
                  type="password"
                  id="currentPassword"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                />
              </div>
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                  {t('settings:newPassword')}
                </label>
                <input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={8}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                />
                <p className="mt-1 text-sm text-gray-500">
                  {t('settings:passwordRequirements')}
                </p>
              </div>
              <div>
                <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-gray-700">
                  {t('settings:confirmNewPassword')}
                </label>
                <input
                  type="password"
                  id="confirmNewPassword"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                />
            </div>
            <div className="flex items-center justify-end">
              <button
                type="submit"
                disabled={passwordLoading}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {passwordLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {t('common:loading')}
                  </span>
                ) : (
                  t('settings:changePasswordButton')
                )}
              </button>
            </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSettings;
