import { useEffect, useMemo, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { fileUrl } from "../../utils/fileUrl.js";
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

function Badge({ text }) {
    const cls =
        text === "Новинка" ? "badge--new" :
            text === "Розпродаж" ? "badge--sale" :
                text === "Хіт" ? "badge--hit" : "";

    return <span className={`badge ${cls}`}>{text}</span>;
}

function ProductRow({ p, onDelete }) {
    return (
        <div className="row">
            <div className="row__img">
                <img
                    className="pCard__img"
                    src={fileUrl(p.coverImage)}
                    alt={p.title}
                />
            </div>

            <div className="row__main">
                <div className="row__top">
                    <div className="row__title">{p.title}</div>
                    <div className="row__price">{p.price} {p.currency}</div>
                </div>

                <div className="row__meta">
                    <span className="muted">ID: {p.id}</span>
                    <span className="muted">
                        Оновлено: {new Date(p.updatedAt).toLocaleDateString()}
                    </span>
                </div>

                {!!p.badges?.length && (
                    <div className="row__badges">
                        {p.badges.map((b) => (
                            <Badge key={b} text={b} />
                        ))}
                    </div>
                )}
            </div>

            <div className="row__actions">
                <span className="muted">ID: {p.id}</span>
                <Link className="btn btn--soft" to={`/seller/products/${p.id}/edit`}>
                    Редагувати
                </Link>
                <button
                    className="btn btn--danger"
                    type="button"
                    onClick={() => onDelete(p.id)}
                >
                    Видалити
                </button>
            </div>
        </div>
    );
}

export default function SellerDashboard() {
    const [profile, setProfile] = useState(null);
    const [products, setProducts] = useState([]);
    const [q, setQ] = useState("");
    const [view, setView] = useState("list");
    const [loading, setLoading] = useState(true);

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

    const stats = useMemo(() => {
        const total = products.length;
        const hits = products.filter((p) => p.badges?.includes("Хіт")).length;
        const sales = products.filter((p) => p.badges?.includes("Розпродаж")).length;
        const news = products.filter((p) => p.badges?.includes("Новинка")).length;

        return { total, hits, sales, news };
    }, [products]);

    useEffect(() => {
        let alive = true;

        async function load() {
            try {
                setLoading(true);

                const pRes = await fetch(`${API}/api/seller/profile/me`, {
                    credentials: "include",
                });

                if (!alive) return;

                if (pRes.status === 401) {
                    setProfile(null);
                    setProducts([]);
                    setLoading(false);
                    return;
                }

                if (!pRes.ok) {
                    setProfile(null);
                    setProducts([]);
                    setLoading(false);
                    return;
                }

                const p = await pRes.json();
                setProfile(p);

                const prRes = await fetch(
                    `${API}/api/seller/products?q=${encodeURIComponent(q)}`,
                    {
                        credentials: "include",
                    }
                );

                if (!alive) return;

                if (prRes.status === 401) {
                    setProducts([]);
                    setLoading(false);
                    return;
                }

                const data = await prRes.json();
                setProducts(data.items || data.products || []);
            } catch (error) {
                console.error("SELLER DASHBOARD ERROR:", error);
                setProfile(null);
                setProducts([]);
            } finally {
                if (alive) {
                    setLoading(false);
                }
            }
        }

        load();

        return () => {
            alive = false;
        };
    }, [q]);

    async function handleDeleteProduct(id) {
        const confirmed = window.confirm("Видалити товар?");
        if (!confirmed) return;

        try {
            const res = await fetch(`${API}/api/seller/products/${id}`, {
                method: "DELETE",
                credentials: "include",
            });

            if (res.ok) {
                setProducts((prev) => prev.filter((x) => x.id !== id));
                return;
            }

            const data = await res.json().catch(() => ({}));
            alert(data.message || "Не вдалося видалити");
        } catch (error) {
            console.error("DELETE PRODUCT ERROR:", error);
            alert("Не вдалося видалити");
        }
    }

    if (loading) {
        return <div className="container">Завантаження…</div>;
    }

    if (!profile) {
        return (
            <div className="container">
                <h1>Кабінет продавця</h1>
                <p>Потрібно увійти в акаунт продавця або доступ обмежено.</p>
                <button
                    className="btn btn--primary"
                    type="button"
                    onClick={() => navigate("/login")}
                >
                    Перейти до входу
                </button>
            </div>
        );
    }

    return (
        <section className="sellerApp">
            <div className="container">
                <div className="sellerLayout">
                    <aside className="sellerNav">
                        <div className="sellerNav__brand">
                            <div className="sellerNav__title">Кабінет продавця</div>
                            <div className="sellerNav__sub">
                                {profile.displayName || "Мій магазин"}
                            </div>
                            <div className="sellerNav__status">
                                <StatusChip status={profile.status} />
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

                            {/* <NavLink
                                to="/seller/products/new"
                                className={({ isActive }) => `navItem ${isActive ? "is-active" : ""}`}
                            >
                                Додати товар
                            </NavLink> */}

                            <NavLink
                                to="/seller/profile"
                                className={({ isActive }) => `navItem ${isActive ? "is-active" : ""}`}
                            >
                                Налаштування профілю
                            </NavLink>

                            <NavLink
                                to="/seller/delivery"
                                className={({ isActive }) => `navItem ${isActive ? "is-active" : ""}`}
                            >
                                Доставка
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
                                <div className="stat__value">{stats.total}</div>
                            </div>
                            <div className="stat">
                                <div className="stat__label">Хіти</div>
                                <div className="stat__value">{stats.hits}</div>
                            </div>
                            <div className="stat">
                                <div className="stat__label">Новинки</div>
                                <div className="stat__value">{stats.news}</div>
                            </div>
                            <div className="stat">
                                <div className="stat__label">Знижки</div>
                                <div className="stat__value">{stats.sales}</div>
                            </div>
                        </div>
                    </aside>

                    <main className="sellerMain">
                        <header className="mainHead">
                            <div>
                                <h1 className="mainHead__h1">Мої товари</h1>
                                <p className="mainHead__p">
                                    Тут ви керуєте товарами: додаєте, редагуєте, видаляєте.
                                </p>
                            </div>

                            <div className="mainHead__actions">
                                <Link className="btn btn--primary" to="/seller/products/new">
                                    + Додати товар
                                </Link>
                                <button
                                    type="button"
                                    className="btn btn--soft"
                                    onClick={() => setView(view === "list" ? "grid" : "list")}
                                    title="Перемкнути вигляд"
                                >
                                    {view === "list" ? "Список" : "Сітка"}
                                </button>
                            </div>
                        </header>

                        <div className="panel">
                            <div className="panel__bar">
                                <div className="search">
                                    <input
                                        value={q}
                                        onChange={(e) => setQ(e.target.value)}
                                        placeholder="Пошук по товарах…"
                                    />
                                </div>
                            </div>

                            {!products.length ? (
                                <div className="empty">
                                    <div className="empty__icon">🧶</div>
                                    <h2 className="empty__title">У вас ще немає товарів</h2>
                                    <p className="empty__text">Додайте перший товар і почніть продажі.</p>
                                    <Link className="btn btn--primary" to="/seller/products/new">
                                        + Додати товар
                                    </Link>
                                </div>
                            ) : (
                                <div className="list">
                                    {products.map((p) => (
                                        <ProductRow key={p.id} p={p} onDelete={handleDeleteProduct} />
                                    ))}
                                </div>
                            )}
                        </div>
                    </main>
                </div>
            </div>
        </section>
    );
}