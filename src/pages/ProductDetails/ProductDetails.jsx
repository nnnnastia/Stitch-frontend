import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fileUrl } from "../../utils/fileUrl.js";
import { productsService } from "../../services/products.service.js";
import { recommendationsService } from "../../services/recommendations.service.js";

const priceFormatter = new Intl.NumberFormat("uk-UA");

export default function ProductDetails() {
    const { id } = useParams();

    useEffect(() => {
        if (!id) return;

        recommendationsService.trackView(id).catch(console.error);
    }, [id]);

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

                const data = await productsService.getById(id);
                const productData = data.product || data;

                if (!productData) {
                    throw new Error("Товар не знайдено");
                }

                setProduct(productData);
                setActiveImg(productData.coverImage || productData.images?.[0] || null);
            } catch (err) {
                console.error(err);
                setError(err.message || "Помилка завантаження товару");
                setProduct(null);
                setActiveImg(null);
            } finally {
                setLoading(false);
            }
        }

        if (id) {
            fetchProduct();
        }
    }, [id]);

    if (loading) return <div className="container">Завантаження...</div>;
    if (error) return <div className="container">{error}</div>;
    if (!product) return <div className="container">Товар не знайдено</div>;

    const images = [product.coverImage, ...(product.images || [])].filter(Boolean);

    return (
        <div className="product">
            <div className="container product__container">
                <div className="product__gallery">
                    <div className="product__main-img">
                        <img src={fileUrl(activeImg)} alt={product.title} />
                    </div>

                    <div className="product__thumbs">
                        {images.map((img, i) => (
                            <button
                                key={i}
                                type="button"
                                className={`product__thumb ${activeImg === img ? "is-active" : ""}`}
                                onClick={() => setActiveImg(img)}
                            >
                                <img src={fileUrl(img)} alt="" />
                            </button>
                        ))}
                    </div>
                </div>

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
                            <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))}>
                                –
                            </button>
                            <span>{qty}</span>
                            <button type="button" onClick={() => setQty((q) => Math.min(99, q + 1))}>
                                +
                            </button>
                        </div>

                        <button type="button" className="product__buy">
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