const ENV_API_BASE_URL = ((import.meta as any).env.VITE_API_BASE_URL || "").trim();

const DEFAULT_DEV_BASE_URL = typeof window !== "undefined" && window.location.hostname === "localhost"
  ? `http://localhost:3000`
  : "";

const API_BASE_URL = ENV_API_BASE_URL || (import.meta.env.DEV ? DEFAULT_DEV_BASE_URL : "");

export const apiUrl = (path: string) => {
  if (API_BASE_URL) {
    return `${API_BASE_URL.replace(/\/+$|\/$/, "")}${path}`;
  }
  return path;
};
