"use client";

import React, { useState } from 'react';
import getStripe from '@/lib/get-stripe';

const TestPaymentsPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleOneTimePayment = async () => {
    setLoading(true);
    setError(null);
  
    try {
      const stripe = await getStripe();
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error(`Failed to create session: ${response.statusText}`);
      }
  
      const { id } = await response.json();
      const result = await stripe?.redirectToCheckout({ sessionId: id });
  
      if (result?.error) {
        setError(result.error.message);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  

  const handleSubscription = async () => {
    setLoading(true);
    setError(null);

    try {
      const stripe = await getStripe();
      const response = await fetch('/api/create-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: 'price_1QOyvDCHjQYsDWIdfJistx6x',
        }),
      });

      const { id } = await response.json();
      const result = await stripe?.redirectToCheckout({ sessionId: id });

      if (result?.error) {
        setError(result.error.message);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h1>Test Payments</h1>

      <div style={{ marginBottom: '1rem' }}>
        <button
          onClick={handleOneTimePayment}
          style={{
            padding: '0.5rem 1rem',
            marginRight: '1rem',
            backgroundColor: '#4CAF50',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
            borderRadius: '4px',
          }}
          disabled={loading}
        >
          {loading ? 'Processing...' : 'One-Time Payment'}
        </button>

        <button
          onClick={handleSubscription}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#007BFF',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
            borderRadius: '4px',
          }}
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Subscribe'}
        </button>
      </div>

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

export default TestPaymentsPage;
