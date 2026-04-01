import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fileUrl } from "../../utils/fileUrl";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";
const priceFormatter = new Intl.NumberFormat("uk-UA");

export default function ProductDetails() {
    const { id } = useParams();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [qty, setQty] = useState(1);
    const [activeImg, setActiveImg] = useState(null);

    useEffect(() => {
        async function fetchProduct() {
            try {
                setLoading(true);
                setError("");

                const res = await fetch(`${API}/api/products/${id}`);
                const data = await res.json();

                setProduct(data.product);
                setActiveImg(data.product.coverImage || data.product.images?.[0]);
            } catch (err) {
                console.error(err);
                setError("Помилка завантаження товару");
            } finally {
                setLoading(false);
            }
        }

        if (id) fetchProduct();
    }, [id]);

    if (loading) return <div className="container">Завантаження...</div>;
    if (error) return <div className="container">{error}</div>;
    if (!product) return <div className="container">Товар не знайдено</div>;

    const images = [product.coverImage, ...(product.images || [])].filter(Boolean);

    return (
        <div className="product">
            <div className="container product__container">

                {/* LEFT */}
                <div className="product__gallery">
                    <div className="product__main-img">
                        <img src={fileUrl(activeImg)} alt={product.title} />
                    </div>

                    <div className="product__thumbs">
                        {images.map((img, i) => (
                            <button
                                key={i}
                                className={`product__thumb ${activeImg === img ? "is-active" : ""}`}
                                onClick={() => setActiveImg(img)}
                            >
                                <img src={fileUrl(img)} alt="" />
                            </button>
                        ))}
                    </div>
                </div>

                {/* RIGHT */}
                <div className="product__info">
                    <div className="product__badges">
                        {product.badges?.map((b) => (
                            <span key={b} className={`badge badge--${b}`}>
                                {b}
                            </span>
                        ))}
                    </div>

                    <h1 className="product__title">{product.title}</h1>

                    <div className="product__seller">
                        Продавець: {product.seller?.userName || "Невідомо"}
                    </div>

                    <div className="product__price">
                        {formatPrice(product.price)} грн
                    </div>

                    <div className="product__controls">
                        <div className="qty">
                            <button onClick={() => setQty((q) => Math.max(1, q - 1))}>–</button>
                            <span>{qty}</span>
                            <button onClick={() => setQty((q) => Math.min(99, q + 1))}>+</button>
                        </div>

                        <button className="product__buy">
                            Додати в кошик
                        </button>
                    </div>

                    <div className="product__meta">
                        <div>✔ 100% ручна робота</div>
                        <div>🚚 3–5 днів доставка</div>
                    </div>

                    <div className="product__description">
                        <h3>Опис</h3>
                        <p>{product.description || "Опис відсутній"}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function formatPrice(value) {
    if (value == null) return "";
    return priceFormatter.format(Number(value));
}