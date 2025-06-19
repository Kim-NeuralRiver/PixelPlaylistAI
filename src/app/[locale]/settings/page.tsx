'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { tokenManager } from '@/utils/api/tokenManager';
import { useTranslation } from 'react-i18next';

interface UserData {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

const UserSettings: React.FC = () => {
  const { t } = useTranslation(['settings', 'common', 'auth']);
  const { isAuthenticated, user, signOut } = useAuth();
  const router = useRouter();

  const [userData, setUserData] = useState<UserData | null>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(true);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/sign-in');
      return;
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!isAuthenticated) return;

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
            signOut();
            return;
          }
          throw new Error(t('settings:fetchUserError'));
        }

        const data = await response.json();
        setUserData(data);
        setFirstName(data.first_name || '');
        setLastName(data.last_name || '');
        setEmail(data.email || '');
        setUsername(data.username || '');
      } catch (error) {
        console.error(t('settings:fetchUserError'), error);
        alert(t('settings:loadError'));
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [isAuthenticated, signOut, t]);

  const handlePersonalInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const token = await tokenManager.ensureValidToken();

      const response = await fetch(`${BASE_URL}/api/user/profile/`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          username: username,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.detail || errorData.message || t('settings:updateFail'));
        return;
      }

      alert(t('settings:updateSuccess'));
    } catch (error) {
      console.error('Error updating profile:', error);
      alert(t('settings:updateError'));
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmNewPassword) {
      alert(t('settings:passwordMismatch'));
      return;
    }

    if (newPassword.length < 8) {
      alert(t('settings:passwordTooShort'));
      return;
    }

    try {
      setPasswordLoading(true);
      const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const token = await tokenManager.ensureValidToken();

      const response = await fetch(`${BASE_URL}/api/user/change-password/`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          old_password: currentPassword,
          new_password: newPassword,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.detail || errorData.message || t('settings:passwordChangeFail'));
        return;
      }

      alert(t('settings:passwordChangeSuccess'));
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (error) {
      console.error('Error changing password:', error);
      alert(t('settings:passwordChangeError'));
    } finally {
      setPasswordLoading(false);
    }
  };

  if (!isAuthenticated || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">{t('common:loading')}</p>
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
                  onChange={(e) => setUsername(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
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
              <button
                type="submit"
                disabled={passwordLoading}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {passwordLoading
                  ? t('settings:changingPassword')
                  : t('settings:changePasswordButton')}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSettings;
