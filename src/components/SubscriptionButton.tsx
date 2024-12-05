"use client";

import React, { useState } from 'react';
import getStripe from '@/lib/get-stripe';

const SubscriptionButton = ({ priceId }: { priceId: string }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClick = async () => {
    setLoading(true);
    setError(null);

    try {
      const stripe = await getStripe();
      const response = await fetch('/api/create-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priceId }),
      });

      if (!response.ok) {
        throw new Error(`Failed to create subscription: ${response.statusText}`);
      }

      const session = await response.json();
      const result = await stripe?.redirectToCheckout({
        sessionId: session.id,
      });

      if (result?.error) {
        setError(result.error.message ?? 'An unknown error occurred');
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleClick}
        style={{
          padding: '0.5rem 1rem',
          backgroundColor: '#007BFF',
          color: '#fff',
          border: 'none',
          cursor: 'pointer',
          borderRadius: '4px',
          fontSize: '1rem',
          fontWeight: 'bold',
        }}
        disabled={loading}
      >
        {loading ? 'Processing...' : 'Subscribe'}
      </button>
      {error && (
        <div
          style={{
            marginTop: '1rem',
            color: 'red',
            fontWeight: 'bold',
          }}
        >
          Error: {error}
        </div>
      )}
    </div>
  );
};

export default SubscriptionButton;
