'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';

const SignUp: React.FC = () => {
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('error');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { t } = useTranslation(['auth']);
  const { signUp } = useAuth();

  const sessionId = useRef(`signup-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`);

  useEffect(() => {
    console.log(`[${sessionId.current}] Sign-up page mounted`, {
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      referrer: document.referrer || 'direct',
    });

    return () => {
      console.log(`[${sessionId.current}] Sign-up page unmounted`, {
        timestamp: new Date().toISOString(),
      });
    };
  }, []);

  const handleNavigation = (destination: string, context: string) => {
    const navigationId = `nav-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

    console.log(`[${navigationId}] Navigation initiated`, {
      navigationId,
      timestamp: new Date().toISOString(),
      destination,
      context,
      currentPath: window.location.pathname,
      formData: {
        usernameLength: username.length,
        nameLength: name.length,
        emailLength: email.length,
        passwordLength: password.length,
      },
    });

    try {
      router.push(destination);

      console.log(`[${sessionId.current}] Router.push executed successfully`, {
        navigationId,
        timestamp: new Date().toISOString(),
        destination,
        context,
      });
    } catch (error) {
      console.error(`[${sessionId.current}] Error during navigation`, {
        navigationId,
        timestamp: new Date().toISOString(),
        destination,
        context,
        error: error instanceof Error ? error.message : String(error),
        errorStack: error instanceof Error ? error.stack : undefined,
      });
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const submissionId = `submit-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
    const startTime = Date.now(); 

    console.log(`[${sessionId.current}] Form submission started`, {
      submissionId,
      timestamp: new Date().toISOString(),
      formData: {
        username: username ? 'provided' : 'empty',
        name: name ? 'provided' : 'empty',
        email: email ? 'provided' : 'empty',
        password: password ? 'provided' : 'empty',
        confirmPassword: confirmPassword ? 'provided' : 'empty',
        usernameLength: username.length,
        nameLength: name.length,
        emailLength: email.length,
        passwordLength: password.length,
      },
    });

    setMessage('');
    setLoading(true);

    if (password !== confirmPassword) {

      const duration = Date.now() - startTime;
      console.warn(`[${sessionId.current}] Password mismatch validation failed`, {
        submissionId,
        timestamp: new Date().toISOString(),
        duration: `${duration}ms`,
        validationError: 'password_mismatch',
      });

      setMessage(t('auth:passwordMismatch').toString()); // Use toString because setMessage expects a string
      setMessageType('error');
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      const duration = Date.now() - startTime;
      console.warn(`[${sessionId.current}] Password length validation failed`, {
        submissionId,
        timestamp: new Date().toISOString(),
        duration: `${duration}ms`,
        validationError: 'password_too_short',
        passwordLength: password.length,
      });

      setMessage(t('auth:passwordTooShort').toString());
      setMessageType('error');
      setLoading(false);
      return;
    }

    try {
      console.log(`[${sessionId.current}] Calling signUp API`, {
        submissionId,
        timestamp: new Date().toISOString(),
        username: username ? 'provided' : 'empty',
        email: email ? 'provided' : 'empty',
      });

      const result = await signUp(username, email, password, name);
      const duration = Date.now() - startTime;

      if (result.success) {
        console.log(`[${sessionId.current}] Sign-up successful`, {
          submissionId,
          timestamp: new Date().toISOString(),
          duration: `${duration}ms`,
          username,
          email,
          redirectPending: true,
        });

        setMessage(t('auth:signUpSuccess', { defaultValue: result.message ?? '' }).toString()); // Pass defaultValue to ensure str is returned
        setMessageType('success');

        console.log(`[${sessionId.current}] Scheduling redirect to sign-in`, {
          submissionId,
          timestamp: new Date().toISOString(),
          redirectDelay: '2000ms',
        });

        setTimeout(() => {
          console.log(`[${sessionId.current}] Executing delayed redirect`, {
            submissionId,
            timestamp: new Date().toISOString(),
            destination: '/sign-in',
          });
          handleNavigation('/sign-in', 'post-signup-redirect');
        }, 2000);

      } else {
        const duration = Date.now() - startTime;
        console.error(`[${sessionId.current}] Sign-up failed`, {
          submissionId,
          timestamp: new Date().toISOString(),
          duration: `${duration}ms`,
          error: result.error,
          username,
          email,
        });

        setMessage(t('auth:signUpFail', result.error).toString());
        setMessageType('error');
      }

    } catch (err: any) {
      const duration = Date.now() - startTime;
      console.error(`[${sessionId.current}] Sign-up exception`, {
        submissionId,
        timestamp: new Date().toISOString(),
        duration: `${duration}ms`,
        error: err.message,
        errorStack: err.stack,
        username,
        email,
      });

      setMessage(t('auth:signUpUnexpectedError', err.message).toString());
      setMessageType('error');
    } finally {
      setLoading(false);
      const finalDuration = Date.now() - startTime;
      console.log(`[${sessionId.current}] Form submission completed`, {
        submissionId,
        timestamp: new Date().toISOString(),
        totalDuration: `${finalDuration}ms`,
        loading: false,
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-card max-w-md w-full p-8 rounded-lg shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-card">
            {t('auth:createAccount')}
          </h2>
          <p className="mt-2 text-center text-sm text-secondary">
            {t('auth:alreadyHaveAccount')}{' '}
            <Link href="/sign-in" className="font-medium text-blue-400 hover:text-card">
              {t('auth:signIn')}
            </Link>
          </p>
        </div>

        {message && (
          <div
            className={`rounded-md p-4 ${
              messageType === 'success'
                ? 'bg-green-900/20 border border-green-500'
                : 'bg-red-900/20 border border-red-500'
            }`}
          >
            <p className={`text-sm ${messageType === 'success' ? 'text-green-400' : 'text-error'}`}>
              {message}
            </p>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-card">
                {t('auth:username')}
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 block w-full border border-input rounded-md py-2 px-3 text-input bg-input focus:ring-2 focus:ring-blue-500 focus:border-success-border"
                placeholder={t('auth:usernamePlaceholder')}
              />
            </div>

             <div>
              <label htmlFor="name" className="block text-sm font-medium text-card">
                {t('auth:name')}
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full border border-input rounded-md py-2 px-3 text-input bg-input focus:ring-2 focus:ring-blue-500 focus:border-success-border"
                placeholder={t('auth:namePlaceholder')}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-card">
                {t('auth:email')}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full border border-input rounded-md py-2 px-3 text-input bg-input focus:ring-2 focus:ring-blue-500 focus:border-success-border"
                placeholder={t('auth:emailPlaceholder')}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-card">
                {t('auth:password')}
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full border border-input rounded-md py-2 px-3 text-input bg-input focus:ring-2 focus:ring-blue-500 focus:border-success-border"
                placeholder={t('auth:passwordPlaceholder')}
              />
              <p className="mt-1 text-xs text-secondary">
                {t('auth:passwordNote')}
              </p>
            </div>

            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-card">
                {t('auth:confirmPassword')}
              </label>
              <input
                id="confirm-password"
                name="confirm-password"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 block w-full border border-input rounded-md py-2 px-3 text-input bg-input focus:ring-2 focus:ring-blue-500 focus:border-success-border"
                placeholder={t('auth:confirmPasswordPlaceholder')}
              />
            </div>
          </div>
          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-button-primary hover:bg-button-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2.93 6.364A8.001 8.001 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3.93-1.574zM12 20a8.001 8.001 0 01-6.364-2.93l-3.93 1.574A11.95 11.95 0 0012 24v-4zm6.364-2.93A8.001 8.001 0 0120 12h4c0 3.042-1.135 5.824-3 7.938l-3.636-1.568zM20 12a8.001 8.001 0 01-2.93-6.364l3.636-1.568A11.95 11.95 0 0024 12h-4z"
                    ></path>
                  </svg>
                  {t('auth:creatingAccount')}
                </span>
              ) : (
                t('auth:createAccount')
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
