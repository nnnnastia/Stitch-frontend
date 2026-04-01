const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const buildUrl = (endpoint, params) => {
    const url = new URL(`${API}${endpoint}`);

    if (params) {
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                if (Array.isArray(value)) {
                    value.forEach((item) => {
                        url.searchParams.append(key, String(item));
                    });
                    return;
                }
                url.searchParams.append(key, String(value));
            }
        });
    }

    return url.toString();
};

const getAuthHeaders = () => {
    const token = localStorage.getItem("token");

    return token
        ? { Authorization: `Bearer ${token}` }
        : {};
};

const parseResponse = async (response) => {
    if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;

        try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
        } catch { }

        throw new Error(errorMessage);
    }

    if (response.status === 204) return null;

    return response.json();
};

export const apiClient = {
    async get(endpoint, options) {
        const url = buildUrl(endpoint, options?.params);

        const response = await fetch(url, {
            method: "GET",
            headers: {
                ...getAuthHeaders(),
                ...(options?.headers || {}),
            },
        });

        return parseResponse(response);
    },

    async post(endpoint, data) {
        const response = await fetch(`${API}${endpoint}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...getAuthHeaders(),
            },
            body: JSON.stringify(data),
        });

        return parseResponse(response);
    },

    async patch(endpoint, data) {
        const response = await fetch(`${API}${endpoint}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                ...getAuthHeaders(),
            },
            body: JSON.stringify(data),
        });

        return parseResponse(response);
    },

    async patchFormData(endpoint, data) {
        const response = await fetch(`${API}${endpoint}`, {
            method: "PATCH",
            headers: {
                ...getAuthHeaders(),
            },
            body: data,
        });

        return parseResponse(response);
    },

    async delete(endpoint) {
        const response = await fetch(`${API}${endpoint}`, {
            method: "DELETE",
            headers: {
                ...getAuthHeaders(),
            },
        });

        return parseResponse(response);
    },
};