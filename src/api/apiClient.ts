const API_BASE_URL = ((import.meta as any).env.VITE_API_BASE_URL || "").trim();

export const apiUrl = (path: string) => {
  if (API_BASE_URL) {
    return `${API_BASE_URL.replace(/\/+$|\/$/, "")}${path}`;
  }
  return path;
};
