export const getPlaylists = async () => {
  const token = localStorage.getItem('token');
  const res = await fetch('http://localhost:8000/api/playlists/', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return await res.json();
};