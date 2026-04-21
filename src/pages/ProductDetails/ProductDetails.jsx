import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fileUrl } from "../../utils/fileUrl.js";
import { productsService } from "../../services/products.service.js";
import { recommendationsService } from "../../services/recommendations.service.js";
import { reviewsService } from "../../services/reviews.service.js";
import ReviewForm from "../../components/ReviewForm/ReviewForm.jsx";
import { Link } from "react-router-dom";
import { Store, Star } from "lucide-react";
import { cartService } from "../../services/cartService.js";

const priceFormatter = new Intl.NumberFormat("uk-UA");

function getStoredUser() {
    try {
        return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
        return null;
    }
}

export default function ProductDetails() {
    const { id } = useParams();
    const currentUser = getStoredUser();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [qty, setQty] = useState(1);
    const [activeImg, setActiveImg] = useState(null);

    const [reviews, setReviews] = useState([]);
    const [reviewsLoading, setReviewsLoading] = useState(true);
    const [reviewsError, setReviewsError] = useState("");

    useEffect(() => {
        if (!id) return;

        const user = getStoredUser();
        const canUsePersonalTracking =
            user && (user.role === "user" || user.role === "seller");

        const request = canUsePersonalTracking
            ? recommendationsService.trackView(id)
            : recommendationsService.trackPublicView(id);

        request.catch((err) => {
            console.error("Failed to track product view", err);
        });
    }, [id]);

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

    async function handleDeleteReview(reviewId) {
        const confirmed = window.confirm("Видалити відгук?");

        if (!confirmed) return;

        try {
            await reviewsService.deleteReview(reviewId);
            await loadReviews();
            await refreshProduct();
        } catch (err) {
            console.error(err);
            alert(err.message || "Не вдалося видалити відгук");
        }
    }
    async function handleAddToCart() {
    try {
        await cartService.addToCart(product.id || product._id, qty);
        // alert("Товар додано в кошик");
    } catch (err) {
        console.error(err);
        alert(err.message || "Не вдалося додати товар у кошик");
    }
}

    async function loadReviews() {
        try {
            setReviewsLoading(true);
            setReviewsError("");

            const data = await reviewsService.getProductReviews(id);
            setReviews(Array.isArray(data?.items) ? data.items : []);
        } catch (err) {
            console.error(err);
            setReviewsError(err.message || "Не вдалося завантажити відгуки");
            setReviews([]);
        } finally {
            setReviewsLoading(false);
        }
    }

    useEffect(() => {
        if (id) {
            loadReviews();
        }
    }, [id]);

    async function refreshProduct() {
        try {
            const data = await productsService.getById(id);
            const productData = data.product || data;
            setProduct(productData);
        } catch (err) {
            console.error("Failed to refresh product", err);
        }
    }

    if (loading) return <div className="container">Завантаження...</div>;
    if (error) return <div className="container">{error}</div>;
    if (!product) return <div className="container">Товар не знайдено</div>;

    const images = [product.coverImage, ...(product.images || [])].filter(Boolean);

    return (
    <div className="product">
        <div className="container">
            <div className="product__container">
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
                    <div className="product__info-card">
                        <div className="product__badges">
                            {product.badges?.map((b) => (
                                <span key={b} className={`badge badge--${b}`}>
                                    {b}
                                </span>
                            ))}
                        </div>

                        <h1 className="product__title">{product.title}</h1>

                        {product?.seller && (
                            <div className="product-details__seller">
                                <div className="product-details__sellerHeader">
                                    <Store size={18} />
                                    <span className="product-details__sellerLabel">Продавець</span>
                                </div>

                                <div className="product-details__sellerContent">
                                    <div className="product-details__sellerInfo">
                                        {product.seller.storeSlug ? (
                                            <Link
                                                to={`/shops/${product.seller.storeSlug}`}
                                                className="product-details__sellerNameLink"
                                            >
                                                {product.seller.displayName || product.seller.userName || "Магазин"}
                                            </Link>
                                        ) : (
                                            <div className="product-details__sellerName">
                                                {product.seller.displayName || product.seller.userName || "Магазин"}
                                            </div>
                                        )}

                                        {product.seller.rating && (
                                            <div className="product-details__sellerRating">
                                                <Star size={14} />
                                                <span>{Number(product.seller.rating.avg || 0).toFixed(1)}</span>
                                                <span className="product-details__sellerRatingCount">
                                                    ({product.seller.rating.count || 0})
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {product.seller.storeSlug && (
                                        <Link
                                            to={`/shops/${product.seller.storeSlug}`}
                                            className="product-details__sellerBtn"
                                        >
                                            Перейти до магазину
                                        </Link>
                                    )}
                                </div>
                            </div>
                        )}

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

                            <button
                                type="button"
                                className="product__buy"
                                onClick={handleAddToCart}
                            >
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

            <div className="product__reviews product__reviews--section">
                <div className="product__reviews-header">
                    <h3>Відгуки</h3>

                    <div className="product__reviews-summary">
                        <Star size={16} />
                        <span>{Number(product.ratingAverage || 0).toFixed(1)}</span>
                        <span>({product.ratingCount || 0})</span>
                    </div>
                </div>

                <div className="product__review-form">
                    <ReviewForm
                        productId={product.id || product._id}
                        onSuccess={async () => {
                            await loadReviews();
                            await refreshProduct();
                        }}
                    />
                </div>

                {reviewsLoading && <p>Завантаження відгуків...</p>}
                {reviewsError && <p>{reviewsError}</p>}

                {!reviewsLoading && !reviews.length && (
                    <p className="product__reviews-empty">Ще немає відгуків</p>
                )}

                {!!reviews.length && (
                    <div className="product__reviews-list">
                        {reviews.map((review) => {
                            const isOwnReview = currentUser?.id === review.author?.id;

                            return (
                                <div key={review.id} className="product__review-card">
                                    <div className="product__review-top">
                                        <div className="product__review-author">
                                            {review.author?.userName || "Користувач"}
                                        </div>

                                        <div className="product__review-right">
                                            <div className="product__review-rating">
                                                <Star size={14} />
                                                <span>{Number(review.rating || 0).toFixed(1)}</span>
                                            </div>

                                            {isOwnReview && (
                                                <button
                                                    type="button"
                                                    className="product__review-delete"
                                                    onClick={() => handleDeleteReview(review.id)}
                                                    aria-label="Видалити відгук"
                                                    title="Видалити відгук"
                                                >
                                                    🗑
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    <p className="product__review-text">
                                        {review.text || ""}
                                    </p>

                                    <div className="product__review-date">
                                        {new Date(review.createdAt).toLocaleDateString("uk-UA")}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    </div>
);
}

function formatPrice(value) {
    if (value == null) return "";
    return priceFormatter.format(Number(value));
}