import { create } from "zustand";
import { clearAuthStorage } from "../utils/auth";

const initialRole = localStorage.getItem("role");
const initialUser = (() => {
    try {
        return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
        return null;
    }
})();

export const useAuthStore = create((set) => ({
    user: initialUser,
    role: initialRole || null,
    isAuth: Boolean(initialRole),

    setAuth: ({ role, user = null }) => {
        if (role) {
            localStorage.setItem("role", role);
        }

        if (user) {
            localStorage.setItem("user", JSON.stringify(user));
        }

        set({
            role,
            user,
            isAuth: true,
        });
    },

    setUser: (user) => {
        if (user) {
            localStorage.setItem("user", JSON.stringify(user));
            localStorage.setItem("role", user.role || "");
        }

        set({
            user,
            role: user?.role || null,
            isAuth: Boolean(user),
        });
    },

    logout: () => {
        clearAuthStorage();

        set({
            role: null,
            user: null,
            isAuth: false,
        });
    },
}));