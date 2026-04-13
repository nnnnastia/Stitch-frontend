import { useEffect, useState } from "react";
import ProductCarousel from "../ProductCarousel/ProductCarousel";
import { recommendationsService } from "../../services/recommendations.service";

export default function RecommendedSection() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let isMounted = true;

        async function loadRecommendations() {
            try {
                setLoading(true);
                setError("");

                const data = await recommendationsService.getMyRecommendations();

                if (!isMounted) return;

                const normalized = Array.isArray(data.products)
                    ? data.products.map(normalizeProduct)
                    : [];

                setItems(normalized);
            } catch (err) {
                if (!isMounted) return;

                if (err?.message === "Failed to load recommendations") {
                    setError("Не вдалося завантажити рекомендації");
                } else {
                    setError("Сталася помилка при завантаженні рекомендацій");
                }

                setItems([]);
                console.error(err);
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }

        loadRecommendations();

        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <div className="recommendation">
            <h2 className="recommendation__h2">Рекомендовані товари</h2>
            <span className="recommendation__line"></span>
            <ProductCarousel
                items={items}
                loading={loading}
                error={error}
                emptyText="Поки що немає персональних рекомендацій"
            />
        </div>
    );
}

function normalizeProduct(product) {
    return {
        ...product,
        id: product.id || product._id,
    };
}