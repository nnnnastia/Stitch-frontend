import { Navigate, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { usersService } from "../../services/users.service";
import { getIsLoggingOut } from "../../utils/auth-session";

export default function ProtectedRoute({ children, allowedRoles = [] }) {
    const location = useLocation();
    const isLoggingOut = getIsLoggingOut();

    const {
        data: user,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ["me"],
        queryFn: usersService.getMe,
        retry: false,
        refetchOnWindowFocus: false,
        enabled: !isLoggingOut,
    });

    if (isLoggingOut) {
        return null;
    }

    if (isLoading) {
        return <div>Завантаження...</div>;
    }

    if (isError) {
        if (error?.status === 401) {
            return (
                <Navigate
                    to="/login"
                    state={{ from: location.pathname }}
                    replace
                />
            );
        }

        return <div>Помилка перевірки авторизації</div>;
    }

    const role = user?.role;

    if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
        switch (role) {
            case "seller":
                return <Navigate to="/seller" replace />;
            case "admin":
                return <Navigate to="/admin" replace />;
            default:
                return <Navigate to="/profile" replace />;
        }
    }

    return children;
}