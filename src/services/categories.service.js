const API_URL = import.meta.env.VITE_API_URL;

async function request(url) {
    const res = await fetch(`${API_URL}${url}`);
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
        throw new Error(data.message || "Request failed");
    }

    return data;
}

export const categoriesService = {
    getAll() {
        return request("/categories");
    },
};