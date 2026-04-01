export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export function fileUrl(path) {
    if (!path) return null;
    if (path.startsWith("http")) return path;
    return `${API_URL}${path}`;
}