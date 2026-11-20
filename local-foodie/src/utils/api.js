// Where the backend lives.
// - While developing: leave VITE_API_URL unset, and Vite's proxy sends /api to localhost:3001.
// - After deploying: set VITE_API_URL to the backend's web address (e.g. https://local-foodie-api.onrender.com).
export const API_BASE = import.meta.env.VITE_API_URL || "";