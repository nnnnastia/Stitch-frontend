import { NavLink, useNavigate } from "react-router-dom";
import ProfileMenuItem from "../../components/ProfileMenuItem/ProfileMenuItem.jsx";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

function StatusChip({ status }) {
    const map = {
        active: { label: "Активний", cls: "chip--ok" },
        pending: { label: "На модерації", cls: "chip--warn" },
        blocked: { label: "Заблоковано", cls: "chip--bad" },
    };

    const s = map[status] || { label: status || "—", cls: "" };

    return <span className={`chip ${s.cls}`}>{s.label}</span>;
}

export default function SellerSidebar({ profile, stats }) {
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
        <aside className="sellerNav">
            <div className="sellerNav__brand">
                <div className="sellerNav__title">Кабінет продавця</div>
                <div className="sellerNav__sub">
                    {profile?.displayName || "Мій магазин"}
                </div>

                <div className="sellerNav__status">
                    <StatusChip status={profile?.status} />
                    <span className="muted">
                        ★ {Number(profile?.rating?.avg ?? 0).toFixed(1)} ({profile?.rating?.count ?? 0})
                    </span>
                </div>
            </div>

            <div className="sellerNav__menu">
                <NavLink
                    to="/seller"
                    end
                    className={({ isActive }) => `navItem ${isActive ? "is-active" : ""}`}
                >
                    Товари
                </NavLink>

                <NavLink
                    to="/seller/profile"
                    className={({ isActive }) => `navItem ${isActive ? "is-active" : ""}`}
                >
                    Налаштування профілю
                </NavLink>

                <NavLink
                    to="/seller/orders"
                    className={({ isActive }) => `navItem ${isActive ? "is-active" : ""}`}
                >
                    Мої замовлення
                </NavLink>

                <NavLink
                    to="/seller/payment"
                    className={({ isActive }) => `navItem ${isActive ? "is-active" : ""}`}
                >
                    Оплата
                </NavLink>

                <ProfileMenuItem
                    label="Вийти"
                    danger
                    onClick={handleLogout}
                />
            </div>

            <div className="sellerNav__stats">
                <div className="stat">
                    <div className="stat__label">Усього</div>
                    <div className="stat__value">{stats?.total ?? 0}</div>
                </div>
                <div className="stat">
                    <div className="stat__label">Хіти</div>
                    <div className="stat__value">{stats?.hits ?? 0}</div>
                </div>
                <div className="stat">
                    <div className="stat__label">Новинки</div>
                    <div className="stat__value">{stats?.news ?? 0}</div>
                </div>
                <div className="stat">
                    <div className="stat__label">Знижки</div>
                    <div className="stat__value">{stats?.sales ?? 0}</div>
                </div>
            </div>
        </aside>
    );
}