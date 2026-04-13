import { Outlet, NavLink, useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function AdminLayout() {
    const navigate = useNavigate();

    async function handleLogout() {
        try {
            await fetch(`${API}/api/auth/logout`, {
                method: "POST",
                credentials: "include",
            });
        } catch (error) {
            console.error("LOGOUT ERROR:", error);
        } finally {
            navigate("/login", { replace: true });
        }
    }

    return (
        <div className="admin-layout">
            <aside className="admin-sidebar">
                <h2 className="admin-sidebar__title">Admin Panel</h2>

                <nav className="admin-sidebar__nav">
                    <NavLink to="/admin">Dashboard</NavLink>
                    <NavLink to="/admin/categories">Categories</NavLink>
                    <NavLink to="/admin/orders">Orders</NavLink>
                    <NavLink to="/admin/users">Users</NavLink>

                    <button
                        type="button"
                        className="admin-sidebar__logout"
                        onClick={handleLogout}
                    >
                        Вийти
                    </button>
                </nav>
            </aside>

            <div className="admin-layout__content">
                <header className="admin-header">
                    <h1>Admin Panel</h1>
                </header>

                <main className="admin-main">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}