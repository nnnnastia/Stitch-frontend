import { useEffect, useState } from "react";
import ProductCarousel from "../ProductCarousel/ProductCarousel";
import { recommendationsService } from "../../services/recommendations.service";

function getStoredUser() {
    try {
        return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
        return null;
    }
}

export default function RecommendedSection() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [title, setTitle] = useState("Рекомендовані товари");

    useEffect(() => {
        let isMounted = true;

        async function loadRecommendations() {
            try {
                setLoading(true);
                setError("");

                const user = getStoredUser();
                const canUsePersonalRecommendations =
                    user && (user.role === "user" || user.role === "seller");

                let data;

                if (canUsePersonalRecommendations) {
                    try {
                        data = await recommendationsService.getMyRecommendations();

                        if (!isMounted) return;
                        setTitle("Рекомендовано для вас");
                    } catch (err) {
                        console.error("Personal recommendations failed:", err);

                        data = await recommendationsService.getPopularProducts(8);

                        if (!isMounted) return;
                        setTitle("Можливо, Вас зацікавить");
                    }
                } else {
                    data = await recommendationsService.getPopularProducts(8);

                    if (!isMounted) return;
                    setTitle("Можливо, Вас зацікавить");
                }

                const normalized = Array.isArray(data?.products)
                    ? data.products.map(normalizeProduct)
                    : [];

                setItems(normalized);
            } catch (err) {
                if (!isMounted) return;

                setError("Сталася помилка при завантаженні товарів");
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
            <h2 className="recommendation__h2">{title}</h2>
            <span className="recommendation__line"></span>
            <ProductCarousel
                items={items}
                loading={loading}
                error={error}
                emptyText="Поки що немає товарів для відображення"
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