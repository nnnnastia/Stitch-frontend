import { Outlet, NavLink } from "react-router-dom";

export default function AdminLayout() {
    return (
        <div className="admin-layout">
            <aside className="admin-sidebar">
                <h2 className="admin-sidebar__title">Admin Panel</h2>

                <nav className="admin-sidebar__nav">
                    <NavLink to="/admin">Dashboard</NavLink>
                    <NavLink to="/admin/categories">Categories</NavLink>
                    <NavLink to="/admin/orders">Orders</NavLink>
                    <NavLink to="/admin/users">Users</NavLink>
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