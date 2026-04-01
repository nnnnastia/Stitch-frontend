import { create } from "zustand";

export const useAuthStore = create((set) => ({
    token: localStorage.getItem("token") || null,
    role: localStorage.getItem("role") || null,
    user: null,

    isAuth: Boolean(localStorage.getItem("token")),

    setAuth: ({ token, role, user = null }) => {
        if (token) {
            localStorage.setItem("token", token);
        }

        if (role) {
            localStorage.setItem("role", role);
        }

        set({
            token,
            role,
            user,
            isAuth: Boolean(token),
        });
    },

    setUser: (user) =>
        set({
            user,
            role: user?.role || null,
        }),

    logout: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");

        set({
            token: null,
            role: null,
            user: null,
            isAuth: false,
        });
    },
}));