// frontend/src/config/apiConfig.ts

const PRODUCTION_FALLBACK_URL = "https://policy-guard.onrender.com";

export function getApiBaseUrl(): string {
  // 1. User manual override in localStorage if set
  const customUrl = localStorage.getItem("policyguard_api_url");
  if (customUrl && customUrl.trim().length > 0) {
    return customUrl.trim().replace(/\/+$/, "");
  }

  // 2. Environment variable passed during build
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (envUrl && envUrl.trim().length > 0) {
    return envUrl.trim().replace(/\/+$/, "");
  }

  // 3. Smart Production Fallback:
  // If deployed to cloud (e.g. Vercel) and no VITE_API_BASE_URL was injected,
  // automatically route API requests to production Render backend instead of broken localhost.
  if (typeof window !== "undefined" && window.location) {
    const host = window.location.hostname;
    if (host !== "localhost" && host !== "127.0.0.1") {
      return PRODUCTION_FALLBACK_URL;
    }
  }

  return "http://localhost:8000";
}
