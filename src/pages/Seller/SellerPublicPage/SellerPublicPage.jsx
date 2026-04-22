import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import {
    MapPin,
    Mail,
    Phone,
    Star,
    Truck,
    CreditCard,
    Globe,
    Send,
    MessageCircle,
} from "lucide-react";
import { sellerProfilesService } from "../../../services/sellerProfile.service";
import { usersService } from "../../../services/users.service";
import ProductCard from "../../../components/ProductCard/ProductCard";
import { useChatStore } from "../../../store/chat.store";
import { Link } from "react-router-dom";
import { useNotification } from "../../../components/NotificationContext/NotificationContext";

function normalizeProductsResponse(data) {
    const items = Array.isArray(data)
        ? data
        : Array.isArray(data?.items)
            ? data.items
            : Array.isArray(data?.products)
                ? data.products
                : Array.isArray(data?.data)
                    ? data.data
                    : [];

    return items.map((product) => ({
        ...product,
        id: product.id || product._id,
    }));
}

export default function SellerPublicPage() {
    const { slug } = useParams();

    const [profile, setProfile] = useState(null);
    const [products, setProducts] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);

    const [loading, setLoading] = useState(true);
    const [loadingProducts, setLoadingProducts] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [sort, setSort] = useState("");

    const startChat = useChatStore((state) => state.startChat);
    const { showSuccess, showError } = useNotification();

    useEffect(() => {
        loadCurrentUser();
    }, []);

    useEffect(() => {
        let ignore = false;

        async function loadSellerPage() {
            try {
                setLoading(true);
                setLoadingProducts(true);
                setError("");

                const [profileRes, productsRes] = await Promise.all([
                    sellerProfilesService.getPublicProfileBySlug(slug),
                    sellerProfilesService.getPublicProductsBySlug(slug),
                ]);

                if (ignore) return;

                setProfile(profileRes?.profile || null);
                setProducts(normalizeProductsResponse(productsRes));
            } catch (err) {
                if (ignore) return;
                setError(err?.message || "Не вдалося завантажити сторінку продавця");
            } finally {
                if (!ignore) {
                    setLoading(false);
                    setLoadingProducts(false);
                }
            }
        }

        loadSellerPage();

        return () => {
            ignore = true;
        };
    }, [slug]);

    async function loadCurrentUser() {
        try {
            const res = await usersService.getMe();
            setCurrentUser(res?.user || res || null);
        } catch {
            setCurrentUser(null);
        }
    }

    async function handleContactSeller() {
        if (!currentUser) {
            showError("Щоб написати продавцю, потрібно увійти в акаунт");
            return;
        }

        const sellerUserId =
            profile?.sellerId ||
            profile?.userId ||
            profile?.user?._id ||
            profile?.user?.id ||
            null;

        if (!sellerUserId) {
            showError("Не вдалося визначити продавця для створення чату");
            return;
        }

        const currentUserId = currentUser?.id || currentUser?._id;

        if (String(currentUserId) === String(sellerUserId)) {
            showError("Ви не можете написати самі собі");
            return;
        }

        try {
            await startChat({
                sellerId: sellerUserId,
                sourceType: "shop",
            });
        } catch (error) {
            console.error(error);
            showError(error?.message || "Не вдалося відкрити чат із продавцем");
        }
    }

    const filteredProducts = useMemo(() => {
        let result = [...products];

        if (search.trim()) {
            const query = search.trim().toLowerCase();

            result = result.filter((product) =>
                (product.title || "").toLowerCase().includes(query)
            );
        }

        switch (sort) {
            case "price_asc":
                result.sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
                break;

            case "price_desc":
                result.sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
                break;

            case "title_asc":
                result.sort((a, b) =>
                    (a.title || "").localeCompare(b.title || "", "uk")
                );
                break;

            case "title_desc":
                result.sort((a, b) =>
                    (b.title || "").localeCompare(a.title || "", "uk")
                );
                break;

            case "newest":
                result.sort(
                    (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
                );
                break;

            default:
                break;
        }

        return result;
    }, [products, search, sort]);

    if (loading) {
        return (
            <section className="seller-page">
                <div className="seller-page__container">
                    <div className="seller-page__status">
                        Завантаження сторінки магазину...
                    </div>
                </div>
            </section>
        );
    }

    if (error || !profile) {
        return (
            <section className="seller-page">
                <div className="seller-page__container">
                    <div className="seller-page__status seller-page__status--error">
                        {error || "Магазин продавця не знайдено"}
                    </div>
                </div>
            </section>
        );
    }

    const hasBanner = Boolean(profile.bannerUrl);
    const hasAvatar = Boolean(profile.avatarUrl);

    const deliveryList = [
        profile.delivery?.ukrposhta ? "Укрпошта" : null,
        profile.delivery?.novaPoshta ? "Нова пошта" : null,
        profile.delivery?.meest ? "Meest" : null,
    ].filter(Boolean);

    const paymentList = [
        profile.payment?.cardOnline ? "Оплата карткою онлайн" : null,
        profile.payment?.cashOnDelivery ? "Післяплата" : null,
    ].filter(Boolean);

    return (
        <section className="seller-page">
            <div className="seller-page__container">
                <div className="seller-page__hero">
                    <div
                        className="seller-page__banner"
                        style={
                            hasBanner
                                ? { backgroundImage: `url(${profile.bannerUrl})` }
                                : undefined
                        }
                    >
                        {!hasBanner && (
                            <div className="seller-page__bannerPlaceholder">
                                Публічний магазин продавця
                            </div>
                        )}
                    </div>

                    <div className="seller-page__heroContent">
                        <div className="seller-page__avatarWrap">
                            {hasAvatar ? (
                                <img
                                    src={profile.avatarUrl}
                                    alt={profile.displayName || "Продавець"}
                                    className="seller-page__avatar"
                                />
                            ) : (
                                <div className="seller-page__avatar seller-page__avatar--placeholder">
                                    {(profile.displayName || "S").charAt(0).toUpperCase()}
                                </div>
                            )}
                        </div>

                        <div className="seller-page__mainInfo">
                            <div className="seller-page__headRow">
                                <h1 className="seller-page__title">
                                    {profile.displayName || "Магазин продавця"}
                                </h1>

                                <div className="seller-page__rating">
                                    <Star size={16} />
                                    <span>
                                        {(profile.rating?.avg ?? 0).toFixed(1)}
                                    </span>
                                    <span className="seller-page__ratingCount">
                                        ({profile.rating?.count ?? 0})
                                    </span>
                                </div>
                            </div>

                            <button
                                type="button"
                                className="seller-page__contactBtn"
                                onClick={handleContactSeller}
                            >
                                <MessageCircle size={18} />
                                <span>Написати продавцю</span>
                            </button>

                            <div className="seller-page__meta">
                                {profile.contacts?.city && (
                                    <div className="seller-page__metaItem">
                                        <MapPin size={16} />
                                        <span>{profile.contacts.city}</span>
                                    </div>
                                )}

                                <div className="seller-page__metaItem">
                                    <span className="seller-page__metaLabel">Товарів:</span>
                                    <span>{profile.productsCount || products.length || 0}</span>
                                </div>
                            </div>

                            {profile.about && (
                                <p className="seller-page__about">{profile.about}</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="seller-page__content">
                    <aside className="seller-page__sidebar">
                        <div className="seller-card">
                            <h2 className="seller-card__title">Контакти</h2>

                            <div className="seller-card__list">
                                {profile.contacts?.phone && (
                                    <div className="seller-card__item">
                                        <Phone size={16} />
                                        <span>{profile.contacts.phone}</span>
                                    </div>
                                )}

                                {profile.contacts?.email && (
                                    <div className="seller-card__item">
                                        <Mail size={16} />
                                        <span>{profile.contacts.email}</span>
                                    </div>
                                )}

                                {!profile.contacts?.phone && !profile.contacts?.email && (
                                    <div className="seller-card__empty">
                                        Контактні дані не вказані
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="seller-card">
                            <h2 className="seller-card__title">Доставка</h2>

                            {deliveryList.length > 0 ? (
                                <div className="seller-card__chips">
                                    {deliveryList.map((item) => (
                                        <span key={item} className="seller-card__chip">
                                            <Truck size={14} />
                                            {item}
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                <div className="seller-card__empty">
                                    Способи доставки не вказані
                                </div>
                            )}
                        </div>

                        <div className="seller-card">
                            <h2 className="seller-card__title">Оплата</h2>

                            {paymentList.length > 0 ? (
                                <div className="seller-card__chips">
                                    {paymentList.map((item) => (
                                        <span key={item} className="seller-card__chip">
                                            <CreditCard size={14} />
                                            {item}
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                <div className="seller-card__empty">
                                    Способи оплати не вказані
                                </div>
                            )}
                        </div>

                        <div className="seller-card">
                            <h2 className="seller-card__title">Соцмережі</h2>

                            <div className="seller-card__socials">
                                {profile.socials?.website && (
                                    <a
                                        href={profile.socials.website}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="seller-card__socialLink"
                                    >
                                        <Globe size={16} />
                                        <span>Сайт</span>
                                    </a>
                                )}

                                {profile.socials?.instagram && (
                                    <a
                                        href={profile.socials.instagram}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="seller-card__socialLink"
                                    >
                                        <Globe size={16} />
                                        <span>Instagram</span>
                                    </a>
                                )}

                                {profile.socials?.facebook && (
                                    <a
                                        href={profile.socials.facebook}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="seller-card__socialLink"
                                    >
                                        <Globe size={16} />
                                        <span>Facebook</span>
                                    </a>
                                )}

                                {profile.socials?.telegram && (
                                    <a
                                        href={profile.socials.telegram}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="seller-card__socialLink"
                                    >
                                        <Send size={16} />
                                        <span>Telegram</span>
                                    </a>
                                )}

                                {!profile.socials?.website &&
                                    !profile.socials?.instagram &&
                                    !profile.socials?.facebook &&
                                    !profile.socials?.telegram && (
                                        <div className="seller-card__empty">
                                            Посилання не вказані
                                        </div>
                                    )}
                            </div>
                        </div>
                    </aside>

                    <div className="seller-page__products">
                        <div className="seller-page__sectionHead">
                            <h2 className="seller-page__sectionTitle">Товари продавця</h2>

                            <div className="seller-page__toolbar">
                                <input
                                    className="seller-page__search"
                                    type="text"
                                    placeholder="Пошук товарів магазину..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />

                                <select
                                    className="seller-page__sort"
                                    value={sort}
                                    onChange={(e) => setSort(e.target.value)}
                                >
                                    <option value="">За замовчуванням</option>
                                    <option value="newest">Спочатку новіші</option>
                                    <option value="price_asc">Спочатку дешевші</option>
                                    <option value="price_desc">Спочатку дорожчі</option>
                                    <option value="title_asc">За назвою А-Я</option>
                                    <option value="title_desc">За назвою Я-А</option>
                                </select>
                            </div>
                        </div>

                        {loadingProducts ? (
                            <div className="seller-page__status">Завантаження товарів...</div>
                        ) : filteredProducts.length === 0 ? (
                            <div className="seller-page__empty">
                                У цього продавця поки немає активних товарів
                            </div>
                        ) : (
                            <div className="seller-page__productsGrid">
                                {filteredProducts.map((product) => (
                                    <Link
                                        key={product.id}
                                        to={`/product/${product.id}`}
                                        className="seller-page__productItem pCard--expand"
                                    >
                                        <ProductCard p={product} />
                                    </Link>
                                ))}
                            </div>

                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}