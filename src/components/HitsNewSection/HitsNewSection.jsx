import { useEffect, useMemo, useState } from "react";
import ProductCarousel from "../ProductCarousel/ProductCarousel";

const API = import.meta.env.VITE_API_URL;

const BADGE_BY_TAB = {
    hits: "Хіт",
    new: "Новинка",
};

export default function HitsNewSection() {
    const [tab, setTab] = useState("hits");
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const controller = new AbortController();

        async function load() {
            try {
                setLoading(true);
                setError("");

                const res = await fetch(`${API}/api/products?limit=100`, {
                    signal: controller.signal,
                });

                if (!res.ok) throw new Error(`HTTP ${res.status}`);

                const data = await res.json();
                setProducts(Array.isArray(data.products) ? data.products : []);
            } catch (e) {
                if (e.name !== "AbortError") {
                    console.error(e);
                    setError("Не вдалося завантажити товари");
                }
            } finally {
                setLoading(false);
            }
        }

        load();

        return () => controller.abort();
    }, []);

    const currentLabel = tab === "hits" ? "Хіти" : "Новинки";
    const currentBadge = BADGE_BY_TAB[tab];

    const items = useMemo(() => {
        const filtered = products.filter(
            (p) => Array.isArray(p.badges) && p.badges.includes(currentBadge)
        );

        if (tab === "new") {
            return [...filtered].sort(
                (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            );
        }

        return filtered;
    }, [products, tab, currentBadge]);

    return (
        <section className="hp">
            <div className="container">
                <div className="hp__head">
                    <div className="hp__tabs">
                        <button
                            className={`hp__tab ${tab === "hits" ? "is-active" : ""}`}
                            onClick={() => setTab("hits")}
                            type="button"
                        >
                            Хіти продажу
                        </button>
                        <button
                            className={`hp__tab ${tab === "new" ? "is-active" : ""}`}
                            onClick={() => setTab("new")}
                            type="button"
                        >
                            Новинки
                        </button>
                    </div>
                </div>

                {loading && <div className="hp__skeleton">Завантаження…</div>}

                {!loading && error && <div className="hp__skeleton">{error}</div>}

                {!loading && !error && items.length === 0 && (
                    <div className="hp__skeleton">
                        Немає товарів у розділі “{currentLabel}”.
                        <br />
                        Додай бейдж <b>{currentBadge}</b> у товар.
                    </div>
                )}

                {!loading && !error && items.length > 0 && (
                    <ProductCarousel items={items} />
                )}
            </div>
        </section>
    );
}