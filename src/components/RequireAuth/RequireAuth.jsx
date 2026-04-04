import { Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function RequireAuth({ children }) {
    const [loading, setLoading] = useState(true);
    const [isAuth, setIsAuth] = useState(false);
    const location = useLocation();

    useEffect(() => {
        async function checkAuth() {
            try {
                const res = await fetch(`${API}/api/users/me`, {
                    credentials: "include",
                });

                if (!res.ok) throw new Error();

                setIsAuth(true);
            } catch {
                setIsAuth(false);
            } finally {
                setLoading(false);
            }
        }

        checkAuth();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!isAuth) {
        return <Navigate to="/login" replace state={{ from: location.pathname }} />;
    }

    return children;
}