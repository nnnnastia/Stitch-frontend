const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

let refreshPromise = null;

async function tryRefresh() {
    if (!refreshPromise) {
        refreshPromise = fetch(`${API_URL}/api/auth/refresh`, {
            method: "POST",
            credentials: "include",
        })
            .then(async (res) => {
                if (!res.ok) {
                    throw new Error("Refresh failed");
                }
                return res.json().catch(() => null);
            })
            .finally(() => {
                refreshPromise = null;
            });
    }

    return refreshPromise;
}

export async function http(path, options = {}, retry = true) {
    const isFormData = options.body instanceof FormData;

    const response = await fetch(`${API_URL}${path}`, {
        ...options,
        credentials: "include",
        headers: {
            ...(isFormData ? {} : { "Content-Type": "application/json" }),
            ...(options.headers || {}),
        },
    });

    if (response.status === 401 && retry) {
        try {
            await tryRefresh();

            return http(path, options, false);
        } catch (refreshError) {
            localStorage.removeItem("role");
            localStorage.removeItem("user");
            window.location.href = "/login";
            throw refreshError;
        }
    }

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        throw new Error(data?.message || `Request failed with status ${response.status}`);
    }

    return data;
}