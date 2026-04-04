const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export function fileUrl(path) {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    return `${BASE_URL}${path}`;
}