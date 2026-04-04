import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children, allowedRoles = [] }) {
    const location = useLocation();
    const role = localStorage.getItem("role");

    if (!role) {
        return (
            <Navigate
                to="/login"
                state={{ from: location.pathname }}
                replace
            />
        );
    }

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