import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import ProductCard from "../ProductCard/ProductCard";
import { Link } from "react-router-dom";


import "swiper/css";
import "swiper/css/navigation";

const API = "http://localhost:5000/api";


/**
 * Рекомендації (слайдер) — шаблон
 * Очікуваний бекенд: GET /api/recommendations
 * Повертає масив продуктів у тому ж форматі, що і /api/products
 *
 * Якщо бекенду ще нема — можна тимчасово підставити /api/products
 */
export default function Recommendation() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [reason, setReason] = useState("");


    useEffect(() => {
        let alive = true;

        async function load() {
            try {
                setLoading(true);
                setError("");

                const res = await promo(`${API}/api/recommendations/me?limit=12`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
                    },
                });

                if (!res.ok) throw new Error(`HTTP ${res.status}`);

                const data = await res.json();   // 👈 1. отримали відповідь
                if (!alive) return;

                setReason(data?.reason || "");   // 👈 2. ОТУТ саме 👈

                const list = Array.isArray(data?.items) ? data.items : [];
                setItems(list);                  // 👈 3. записали товари
            } catch (e) {
                if (alive) {
                    setError("Не вдалося завантажити рекомендації.");
                    setItems([]);
                    setReason("");                 // 👈 на помилці очищаємо
                }
            } finally {
                if (alive) setLoading(false);
            }
        }

        load();
        return () => {
            alive = false;
        };
    }, []);



    return (
        <section className="hp hp--reco">
            <div className="container">
                <div className="hp__head">
                    <div className="hp__titleBox">
                        <h2 className="hp__title">Вас може зацікавити</h2>
                        {reason === "popular_fallback" && (
                            <p className="hp__subtitle">Популярне серед покупців</p>
                        )}
                        {reason === "new_user_fallback" && (
                            <p className="hp__subtitle">Новинки для знайомства</p>
                        )}
                        {reason === "content_based" && (
                            <p className="hp__subtitle">На основі ваших переглядів</p>
                        )}

                    </div>
                </div>

                {loading && <div className="hp__skeleton">Завантаження…</div>}

                {!loading && error && <div className="hp__skeleton">{error}</div>}

                {!loading && !error && items.length === 0 && (
                    <div className="hp__skeleton">
                        Поки немає рекомендацій.
                    </div>
                )}

                {!loading && !error && items.length > 0 && (
                    <div className="hp__clip">
                        <Swiper
                            className="hp__slider"
                            modules={[Navigation]}
                            navigation
                            spaceBetween={16}
                            slidesPerView={1.2}
                            breakpoints={{
                                480: { slidesPerView: 2.2 },
                                768: { slidesPerView: 3.2 },
                                1200: { slidesPerView: 4.2 },
                            }}
                        >
                            {items.map((p) => (
                                <SwiperSlide key={p._id}>
                                    <Link to={`/product/${p._id}`} className="pCard pCard--expand">
                                        <ProductCard p={p} />
                                    </Link>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                )}
            </div>
        </section>
    );
}
