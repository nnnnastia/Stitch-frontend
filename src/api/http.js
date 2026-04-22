import { clearAuthStorage } from "../utils/auth-storage";
import {
    getIsLoggingOut,
    clearAuthSession,
} from "../utils/auth-session";

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
                    const error = new Error("Refresh failed");
                    error.status = res.status;
                    throw error;
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
    const isRefreshRequest = path === "/api/auth/refresh" || path === "/auth/refresh";
    const isLogoutRequest = path === "/api/auth/logout" || path === "/auth/logout";

    const response = await fetch(`${API_URL}${path}`, {
        ...options,
        credentials: "include",
        headers: {
            ...(isFormData ? {} : { "Content-Type": "application/json" }),
            ...(options.headers || {}),
        },
    });

    if (
        response.status === 401 &&
        retry &&
        !isRefreshRequest &&
        !isLogoutRequest &&
        !getIsLoggingOut()
    ) {
        try {
            await tryRefresh();
            return http(path, options, false);
        } catch {
            clearAuthStorage();
            clearAuthSession();

            const error = new Error("Unauthorized");
            error.status = 401;
            throw error;
        }
    }

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        const error = new Error(
            data?.message || `Request failed with status ${response.status}`
        );
        error.status = response.status;
        throw error;
    }

    return data;
}