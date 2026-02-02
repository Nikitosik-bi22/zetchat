export const API_BASE_URL = import.meta.env.DEV
  ? '/api'
  : (import.meta.env.VITE_API_URL?.toString() ||
     `http://${window.location.hostname}:5000/api`);
