import { useState } from "react";
import { fileUrl } from "../../utils/fileUrl.js";
import { AddToCartButton } from "../AddToCartButton/AddToCartButton.jsx";
import { useWishlist } from "../../hooks/useWishlist.js";

const priceFormatter = new Intl.NumberFormat("uk-UA");

export default function ProductCard({ p }) {
    const [qty, setQty] = useState(1);
    const { items, toggleWishlist, isToggling } = useWishlist();

    if (!p) return null;

    const productId = p.id || p._id;
    const imageSrc = resolveImg(p);

    const isFav = items.some((item) => {
        const wishlistProductId =
            item?.product?.id || item?.product?._id || item?.product;
        return String(wishlistProductId) === String(productId);
    });

    const dec = (e) => {
        blockCardNavigation(e);
        setQty((q) => Math.max(1, q - 1));
    };

    const inc = (e) => {
        blockCardNavigation(e);
        setQty((q) => Math.min(99, q + 1));
    };

    const toggleFav = async (e) => {
        blockCardNavigation(e);

        try {
            await toggleWishlist(productId);
        } catch (error) {
            console.error("TOGGLE WISHLIST ERROR:", error);
        }
    };

    return (
        <>
            <div className="pCard__media">
                {imageSrc ? (
                    <img src={imageSrc} alt={p.title || "product"} loading="lazy" />
                ) : (
                    <div className="pCard__image-placeholder">Немає фото</div>
                )}

                <div className="pCard__badges">
                    {p.badges?.includes("Новинка") && (
                        <span className="pCard__badge pCard__badge--new">Новинка</span>
                    )}
                    {p.badges?.includes("Хіт") && (
                        <span className="pCard__badge pCard__badge--hit">Хіт</span>
                    )}
                    {p.badges?.includes("Розпродаж") && (
                        <span className="pCard__badge pCard__badge--sale">Розпродаж</span>
                    )}
                </div>
            </div>

            <div className="pCard__body">
                <div className="pCard__title">{p.title}</div>
                <div className="pCard__seller">
                    Продавець: {p.seller?.userName || "Невідомо"}
                </div>

                <div className="pCard__price">
                    <span className="pCard__priceNow">{formatPrice(p.price)} грн</span>
                </div>
            </div>

            <div className="pCard__actions">
                <div className="pCard__actions-inner">
                    <div className="qty">
                        <button
                            className="qty__btn"
                            type="button"
                            onClick={dec}
                            aria-label="Зменшити"
                        >
                            –
                        </button>

                        <span className="qty__num">{qty}</span>

                        <button
                            className="qty__btn"
                            type="button"
                            onClick={inc}
                            aria-label="Збільшити"
                        >
                            +
                        </button>
                    </div>

                    <AddToCartButton productId={productId} quantity={qty} />

                    <button
                        className={`pCard__fav ${isFav ? "is-active" : ""}`}
                        type="button"
                        onClick={toggleFav}
                        aria-label={isFav ? "Прибрати з улюблених" : "В улюблені"}
                        disabled={isToggling}
                    >
                        <span className={isFav ? "icon-heart-1" : "icon-heart-empty-1"} />
                    </button>
                </div>
            </div>
        </>
    );
}

function blockCardNavigation(e) {
    e.preventDefault();
    e.stopPropagation();
}

function resolveImg(product) {
    const raw = [product.coverImage, product.imageUrl, product.images?.[0]].find(Boolean);
    return raw ? fileUrl(raw) || null : null;
}

function formatPrice(value) {
    if (value == null) return "";
    return priceFormatter.format(Number(value));
}