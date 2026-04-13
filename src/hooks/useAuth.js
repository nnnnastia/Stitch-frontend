import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { authService } from "../services/authService";
import { clearAuthStorage } from "../utils/auth-storage";
import { setIsLoggingOut } from "../utils/auth-session";

export const useAuth = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const logout = async () => {
        setIsLoggingOut(true);

        try {
            await queryClient.cancelQueries();
            await authService.logout();
        } catch (error) {
            console.error("Error during server logout:", error);
        } finally {
            clearAuthStorage();

            queryClient.setQueryData(["me"], null);
            queryClient.setQueryData(["cart"], null);
            queryClient.clear();

            navigate("/login", { replace: true });
            setIsLoggingOut(false);
        }
    };

    return { logout };
};