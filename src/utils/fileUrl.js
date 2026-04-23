const API = import.meta.env.VITE_API_URL;

export function fileUrl(path) {
    if (!path) return "";

    if (path.startsWith("http://") || path.startsWith("https://")) {
        return path;
    }

    return `${API}${path}`;
}