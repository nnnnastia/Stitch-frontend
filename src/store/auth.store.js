import { create } from "zustand";

export const useAuthStore = create((set) => ({
    user: null,
    role: localStorage.getItem("role") || null,
    isAuth: false,

    setAuth: ({ role, user = null }) => {
        if (role) {
            localStorage.setItem("role", role);
        }

        set({
            role,
            user,
            isAuth: true,
        });
    },

    setUser: (user) =>
        set({
            user,
            role: user?.role || null,
            isAuth: true,
        }),

    logout: () => {
        localStorage.removeItem("role");

        set({
            role: null,
            user: null,
            isAuth: false,
        });
    },
}));