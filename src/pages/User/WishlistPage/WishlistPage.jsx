import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { usersService } from "../../../services/users.service.js";
import { AccountSidebar } from "../../../components/AccountSidebar/AccountSidebar.jsx";
import { ROUTES } from "../../../constants/index.js";
import { useAuth } from "../../../hooks/useAuth.js";
import { clearAuthStorage } from "../../../utils/auth-storage.js";
import { useWishlist } from "../../../hooks/useWishlist.js";
import ProductCard from "../../../components/ProductCard/ProductCard.jsx";
import Pagination from "../../../components/Pagination/Pagination.jsx";

export default function WishlistPage() {
    const navigate = useNavigate();
    const { logout } = useAuth();

    const [user, setUser] = useState(null);
    const [pageError, setPageError] = useState("");
    const [submitError, setSubmitError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [isAvatarUploading, setIsAvatarUploading] = useState(false);

    const [page, setPage] = useState(1);
    const [limit] = useState(8);

    const {
        items,
        isLoading: isWishlistLoading,
    } = useWishlist(true);

    const handleUnauthorized = useCallback(() => {
        clearAuthStorage();
        setUser(null);
        setPageError("");
        setSubmitError("");
        setSuccessMessage("");
        navigate(ROUTES.LOGIN, { replace: true });
    }, [navigate]);

    useEffect(() => {
        const loadUser = async () => {
            try {
                setPageError("");
                const currentUser = await usersService.getMe();
                setUser(currentUser);
            } catch (err) {
                if (err instanceof Error && err.message.includes("401")) {
                    handleUnauthorized();
                    return;
                }

                setPageError(
                    err instanceof Error
                        ? err.message
                        : "Помилка при завантаженні сторінки списку бажань",
                );
            }
        };

        loadUser();
    }, [handleUnauthorized]);

    useEffect(() => {
        if (!successMessage) return;

        const timer = setTimeout(() => {
            setSuccessMessage("");
        }, 5000);

        return () => clearTimeout(timer);
    }, [successMessage]);

    useEffect(() => {
        if (!submitError) return;

        const timer = setTimeout(() => {
            setSubmitError("");
        }, 5000);

        return () => clearTimeout(timer);
    }, [submitError]);

    const totalPages = Math.max(1, Math.ceil(items.length / limit));

    useEffect(() => {
        if (page > totalPages) {
            setPage(totalPages);
        }
    }, [page, totalPages]);

    const handleAvatarUpload = async (file) => {
        if (!user) return;

        try {
            setIsAvatarUploading(true);
            setSubmitError("");
            setSuccessMessage("");

            const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
            const maxSize = 5 * 1024 * 1024;

            if (!allowedTypes.includes(file.type)) {
                throw new Error("Лише JPEG, PNG та WEBP файли можна додавати.");
            }

            if (file.size > maxSize) {
                throw new Error("Максимальний розмір файлу 5 MB");
            }

            const updatedUser = await usersService.uploadAvatar(file);
            setUser(updatedUser);
            setSuccessMessage("Аватар успішно оновлено!");
        } catch (err) {
            if (err instanceof Error && err.message.includes("401")) {
                handleUnauthorized();
                return;
            }

            setSubmitError(
                err instanceof Error ? err.message : "Помилка при завантаженні фото",
            );
        } finally {
            setIsAvatarUploading(false);
        }
    };

    const handleLogout = async () => {
        await logout();
    };

    const hasFavorites = useMemo(() => items.length > 0, [items]);
    const favoritesCount = items.length;

    const paginatedItems = useMemo(() => {
        const start = (page - 1) * limit;
        return items.slice(start, start + limit);
    }, [items, page, limit]);

    if (isWishlistLoading && !user) {
        return <div className="profile__state">Завантаження...</div>;
    }

    if (pageError) {
        return <div className="profile__state profile__state--error">{pageError}</div>;
    }

    if (!user) {
        return <div className="profile__state">Користувача не знайдено</div>;
    }

    return (
        <section className="profile wishlist-page">
            <div className="container">
                <h1 className="profile__title">Список бажань</h1>

                <div className="profile__layout">
                    <AccountSidebar
                        user={user}
                        onAvatarClick={handleAvatarUpload}
                        onLogout={handleLogout}
                        isAvatarUploading={isAvatarUploading}
                    />

                    <div className="profile__content">
                        {submitError && <p className="profile__error">{submitError}</p>}
                        {successMessage && <p className="profile__success">{successMessage}</p>}

                        <div className="wishlist-page__head">
                            <div className="wishlist-page__head-text">
                                <h2 className="wishlist-page__title">Обрані товари</h2>
                                <p className="wishlist-page__subtitle">
                                    Зберігайте товари, щоб швидко повертатися до них пізніше.
                                </p>
                            </div>

                            <div className="wishlist-page__count">
                                {favoritesCount} {favoritesCount === 1 ? "товар" : "товарів"}
                            </div>
                        </div>

                        {!hasFavorites && (
                            <div className="wishlist-page__empty">
                                <div className="wishlist-page__empty-icon">♡</div>
                                <h3 className="wishlist-page__empty-title">
                                    Список бажань поки порожній
                                </h3>
                                <p className="wishlist-page__empty-text">
                                    Додавайте товари в обране, щоб швидко повертатися до них пізніше.
                                </p>
                                <Link to="/catalog" className="wishlist-page__empty-link">
                                    Перейти до каталогу
                                </Link>
                            </div>
                        )}

                        {hasFavorites && (
                            <>
                                <div className="wishlist-page__grid">
                                    {paginatedItems.map((item) => {
                                        const product = item.product;
                                        const productId = product?._id || product?.id;

                                        if (!productId) return null;

                                        return (
                                            <Link
                                                key={productId}
                                                to={`/product/${productId}`}
                                                className="wishlist-page__card-link"
                                            >
                                                <article className="pCard pCard--expand">
                                                    <ProductCard p={product} />
                                                </article>
                                            </Link>
                                        );
                                    })}
                                </div>

                                {totalPages > 1 && (
                                    <div className="wishlist-page__pagination">
                                        <Pagination
                                            page={page}
                                            totalPages={totalPages}
                                            onPageChange={setPage}
                                        />
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}