import { http } from "../api/http";
import { clearAuthStorage } from "../utils/auth-storage";
import { setIsLoggingOut } from "../utils/auth-session";

export const authService = {
    async logout() {
        try {
            setIsLoggingOut(true);
            await http("/api/auth/logout", {
                method: "POST",
            });
            clearAuthStorage();
            return true;
        } catch (error) {
            console.error("Logout error:", error);
            return false;
        } finally {
            setIsLoggingOut(false);
        }
    },

    async forgotPassword(email) {
        return http("/api/auth/forgot-password", {
            method: "POST",
            body: JSON.stringify({ email }),
        });
    },

    async resetPassword({ token, newPassword, confirmPassword }) {
        return http("/api/auth/reset-password", {
            method: "POST",
            body: JSON.stringify({
                token,
                newPassword,
                confirmPassword,
            }),
        });
    },
};