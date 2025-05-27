// Token refresh utility for handling JWT tokens in a web application

export const refreshToken = async (): Promise<void> => {
  const refresh = localStorage.getItem('refresh');
  if (!refresh) return;

  const res = await fetch('http://localhost:8000/api/token/refresh/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh }),
  });

  const data = await res.json();
  if (data.access) {
    localStorage.setItem('token', data.access);
  } else {
    console.warn('Failed to refresh token:', data);
  }
};
