const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export function fileUrl(path) {
    if (!path) return "";

    if (path.startsWith("http://") || path.startsWith("https://")) {
        return path;
    }

    return `${API}${path}`;
}