import { useEffect, useMemo, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { fileUrl } from "../../../utils/fileUrl";
import Pagination from "../../../components/Pagination/Pagination";
import { useNotification } from "../../../components/NotificationContext/NotificationContext";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

function Badge({ text }) {
    const cls =
        text === "Новинка"
            ? "badge--new"
            : text === "Розпродаж"
                ? "badge--sale"
                : text === "Хіт"
                    ? "badge--hit"
                    : "";

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
                    {/* <span className="muted">ID: {p.id}</span> */}
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
                {/* <span className="muted">ID: {p.id}</span> */}
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

export default function SellerProductsPage() {
    const { products, setProducts } = useOutletContext();
    const [q, setQ] = useState("");
    const [view, setView] = useState("list");
    const [page, setPage] = useState(1);
    const limit = 5;
    const { showSuccess, showError } = useNotification();
    const filteredProducts = useMemo(() => {
        const normalized = q.trim().toLowerCase();

        if (!normalized) return products;

        return products.filter((p) =>
            p.title?.toLowerCase().includes(normalized)
        );
    }, [products, q]);

    const totalPages = Math.ceil(filteredProducts.length / limit);

    const paginatedProducts = useMemo(() => {
        const start = (page - 1) * limit;
        const end = start + limit;
        return filteredProducts.slice(start, end);
    }, [filteredProducts, page]);

    useEffect(() => {
        setPage(1);
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
            showError(data.message || "Не вдалося видалити");
        } catch (error) {
            console.error("DELETE PRODUCT ERROR:", error);
            showError("Не вдалося видалити");
        }
    }

    return (
        <>
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

                {!filteredProducts.length ? (
                    <div className="empty">
                        <div className="empty__icon">🧶</div>
                        <h2 className="empty__title">У вас ще немає товарів</h2>
                        <p className="empty__text">Додайте перший товар і почніть продажі.</p>
                        <Link className="btn btn--primary" to="/seller/products/new">
                            + Додати товар
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className="list">
                            {paginatedProducts.map((p) => (
                                <ProductRow key={p.id} p={p} onDelete={handleDeleteProduct} />
                            ))}
                        </div>

                        <Pagination
                            page={page}
                            totalPages={totalPages}
                            onPageChange={setPage}
                        />
                    </>
                )}
            </div>
        </>
    );
}