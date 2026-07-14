// Base URL for the backend API.
// Override in production via a VITE_API_URL env var (e.g. in a .env or the host's env settings).
const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

export default API_BASE_URL;
