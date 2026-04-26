const API_URL = import.meta.env.VITE_API_URL;

export async function searchByPhoto(file) {
    if (!API_URL) {
        throw new Error("VITE_API_URL is not defined");
    }

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`${API_URL}/api/search/by-photo`, {
        method: "POST",
        body: formData,
        credentials: "include",
    });

    const contentType = res.headers.get("content-type") || "";

    const data = contentType.includes("application/json")
        ? await res.json().catch(() => null)
        : null;

    if (!res.ok) {
        console.error("Search by photo error:", data);
        throw new Error(data?.message || data?.detail || "Помилка пошуку по фото");
    }

    return data;
}