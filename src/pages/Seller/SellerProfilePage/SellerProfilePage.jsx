import { useEffect, useState } from "react";
import { sellerProfilesService } from "../../../services/sellerProfile.service";
import ImageUpload from "../../../components/ImageUpload/ImageUpload";
import { shippingService } from "../../../services/shipping.service";
import { useNotification } from "../../../components/NotificationContext/NotificationContext";

const initialForm = {
    displayName: "",
    storeSlug: "",
    avatarUrl: "",
    bannerUrl: "",
    about: "",
    contacts: {
        phone: "",
        email: "",
        city: "",
    },
    socials: {
        instagram: "",
        facebook: "",
        telegram: "",
        website: "",
    },
    delivery: {
        ukrposhta: true,
        novaPoshta: true,
        meest: false,
    },
    payment: {
        cardOnline: true,
        cashOnDelivery: false,
    },
};

export default function SellerProfilePage() {
    const [form, setForm] = useState(initialForm);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);
    const [uploadingBanner, setUploadingBanner] = useState(false);
    const [cityQuery, setCityQuery] = useState("");
    const [cities, setCities] = useState([]);
    const [selectedCity, setSelectedCity] = useState(null);
    const [loadingCities, setLoadingCities] = useState(false);
    const { showSuccess, showError } = useNotification();
    useEffect(() => {
        loadProfile();
    }, []);

    useEffect(() => {
        const timer = setTimeout(async () => {
            if (!cityQuery.trim()) {
                setCities([]);
                return;
            }

            try {
                setLoadingCities(true);
                const data = await shippingService.searchCities(cityQuery);
                setCities(data.items || []);
            } catch (error) {
                console.error("Failed to search cities", error);
            } finally {
                setLoadingCities(false);
            }
        }, 400);

        return () => clearTimeout(timer);
    }, [cityQuery]);

    async function loadProfile() {
        try {
            setLoading(true);

            const res = await sellerProfilesService.getMyProfile();
            const profile = res?.profile || res || {};

            setForm({
                displayName: profile.displayName || "",
                storeSlug: profile.storeSlug || "",
                avatarUrl: profile.avatarUrl || "",
                bannerUrl: profile.bannerUrl || "",
                about: profile.about || "",
                contacts: {
                    phone: profile.contacts?.phone || "",
                    email: profile.contacts?.email || "",
                    city: profile.contacts?.city || "",
                },
                socials: {
                    instagram: profile.socials?.instagram || "",
                    facebook: profile.socials?.facebook || "",
                    telegram: profile.socials?.telegram || "",
                    website: profile.socials?.website || "",
                },
                delivery: {
                    ukrposhta:
                        profile.delivery?.ukrposhta !== undefined
                            ? Boolean(profile.delivery.ukrposhta)
                            : true,
                    novaPoshta:
                        profile.delivery?.novaPoshta !== undefined
                            ? Boolean(profile.delivery.novaPoshta)
                            : true,
                    meest: Boolean(profile.delivery?.meest),
                },
                payment: {
                    cardOnline:
                        profile.payment?.cardOnline !== undefined
                            ? Boolean(profile.payment.cardOnline)
                            : true,
                    cashOnDelivery: Boolean(profile.payment?.cashOnDelivery),
                },
            });
            setCityQuery(profile.contacts?.city || "");
            setSelectedCity(
                profile.contacts?.city
                    ? { name: profile.contacts.city }
                    : null
            );
        } catch (error) {
            console.error("Failed to load seller profile", error);
            showError("Не вдалося завантажити профіль магазину");
        } finally {
            setLoading(false);
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            setSaving(true);

            await sellerProfilesService.updateMyProfile({
                displayName: form.displayName,
                storeSlug: form.storeSlug,
                avatarUrl: form.avatarUrl,
                bannerUrl: form.bannerUrl,
                about: form.about,
                contacts: form.contacts,
                socials: form.socials,
                delivery: form.delivery,
                payment: form.payment,
            });

            showSuccess("Налаштування магазину збережено");
        } catch (error) {
            console.error("Failed to save seller profile", error);
            showError(error?.message || "Не вдалося зберегти зміни");
        } finally {
            setSaving(false);
        }
    }

    async function handleAvatarUpload(e) {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setUploadingAvatar(true);

            const res = await sellerProfilesService.uploadAvatar(file);
            const profile = res?.profile || res || {};

            setForm((prev) => ({
                ...prev,
                avatarUrl: profile.avatarUrl || prev.avatarUrl,
            }));
        } catch (error) {
            console.error("Failed to upload avatar", error);
            showError(error?.message || "Не вдалося завантажити аватар");
        } finally {
            setUploadingAvatar(false);
            e.target.value = "";
        }
    }

    async function handleBannerUpload(e) {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setUploadingBanner(true);

            const res = await sellerProfilesService.uploadBanner(file);
            const profile = res?.profile || res || {};

            setForm((prev) => ({
                ...prev,
                bannerUrl: profile.bannerUrl || prev.bannerUrl,
            }));
        } catch (error) {
            console.error("Failed to upload banner", error);
            showError(error?.message || "Не вдалося завантажити банер");
        } finally {
            setUploadingBanner(false);
            e.target.value = "";
        }
    }

    function updateField(field, value) {
        setForm((prev) => ({
            ...prev,
            [field]: value,
        }));
    }

    function updateNestedField(section, field, value) {
        setForm((prev) => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value,
            },
        }));
    }

    if (loading) {
        return <div className="seller-store">Завантаження...</div>;
    }

    return (
        <section className="seller-store">
            <div className="seller-store__head">
                <h1 className="seller-store__title">Налаштування магазину</h1>
                <p className="seller-store__subtitle">
                    Оновіть назву, опис, контакти та умови доставки вашого магазину.
                </p>
            </div>

            <form className="seller-store__form" onSubmit={handleSubmit}>
                <div className="seller-store__grid">
                    <div className="seller-store__card">
                        <h2 className="seller-store__card-title">Основне</h2>

                        <label className="seller-store__label">
                            Назва магазину
                            <input
                                className="seller-store__input"
                                value={form.displayName}
                                onChange={(e) => updateField("displayName", e.target.value)}
                                placeholder="Наприклад, Handmade by Anna"
                            />
                        </label>

                        <label className="seller-store__label">
                            Slug магазину
                            <input
                                className="seller-store__input"
                                value={form.storeSlug}
                                onChange={(e) => updateField("storeSlug", e.target.value)}
                                placeholder="my-shop-slug"
                            />
                        </label>

                        <label className="seller-store__label">
                            Опис магазину
                            <textarea
                                className="seller-store__textarea"
                                value={form.about}
                                onChange={(e) => updateField("about", e.target.value)}
                                placeholder="Коротко розкажіть про свій магазин"
                            />
                        </label>
                    </div>

                    <div className="seller-store__card">
                        <h2 className="seller-store__card-title">Контакти</h2>

                        <label className="seller-store__label">
                            Телефон
                            <input
                                className="seller-store__input"
                                value={form.contacts.phone}
                                onChange={(e) =>
                                    updateNestedField("contacts", "phone", e.target.value)
                                }
                                placeholder="+380..."
                            />
                        </label>

                        <label className="seller-store__label">
                            Email
                            <input
                                className="seller-store__input"
                                type="email"
                                value={form.contacts.email}
                                onChange={(e) =>
                                    updateNestedField("contacts", "email", e.target.value)
                                }
                                placeholder="shop@example.com"
                            />
                        </label>

                        <label className="seller-store__label">
                            Місто
                            <input
                                className="seller-store__input"
                                value={cityQuery}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setCityQuery(value);
                                    setSelectedCity(null);
                                    updateNestedField("contacts", "city", value);
                                }}
                                placeholder="Почніть вводити назву міста"
                                autoComplete="off"
                            />

                            {loadingCities && (
                                <span className="seller-store__hint">Завантаження міст...</span>
                            )}

                            {!selectedCity && cities.length > 0 && (
                                <div className="seller-store__dropdown">
                                    {cities.map((city) => (
                                        <button
                                            key={city.id}
                                            type="button"
                                            className="seller-store__dropdown-item"
                                            onClick={() => {
                                                setSelectedCity(city);
                                                setCityQuery(city.name);
                                                updateNestedField("contacts", "city", city.name);
                                                setCities([]);
                                            }}
                                        >
                                            {city.name}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </label>
                    </div>

                    <div className="seller-store__card">
                        <h2 className="seller-store__card-title">Доставка</h2>

                        <label className="seller-store__check">
                            <input
                                type="checkbox"
                                checked={form.delivery.ukrposhta}
                                onChange={(e) =>
                                    updateNestedField("delivery", "ukrposhta", e.target.checked)
                                }
                            />
                            <span>Укрпошта</span>
                        </label>

                        <label className="seller-store__check">
                            <input
                                type="checkbox"
                                checked={form.delivery.novaPoshta}
                                onChange={(e) =>
                                    updateNestedField("delivery", "novaPoshta", e.target.checked)
                                }
                            />
                            <span>Нова пошта</span>
                        </label>

                        <label className="seller-store__check">
                            <input
                                type="checkbox"
                                checked={form.delivery.meest}
                                onChange={(e) =>
                                    updateNestedField("delivery", "meest", e.target.checked)
                                }
                            />
                            <span>Meest</span>
                        </label>
                    </div>

                    <div className="seller-store__card">
                        <h2 className="seller-store__card-title">Оплата</h2>

                        <label className="seller-store__check">
                            <input
                                type="checkbox"
                                checked={form.payment.cardOnline}
                                onChange={(e) =>
                                    updateNestedField("payment", "cardOnline", e.target.checked)
                                }
                            />
                            <span>Оплата карткою онлайн</span>
                        </label>

                        <label className="seller-store__check">
                            <input
                                type="checkbox"
                                checked={form.payment.cashOnDelivery}
                                onChange={(e) =>
                                    updateNestedField(
                                        "payment",
                                        "cashOnDelivery",
                                        e.target.checked
                                    )
                                }
                            />
                            <span>Післяплата</span>
                        </label>
                    </div>

                    <div className="seller-store__card">
                        <h2 className="seller-store__card-title">Медіа магазину</h2>

                        <div className="seller-store__media">
                            {/* АВАТАР */}
                            <ImageUpload
                                value={form.avatarUrl}
                                type="avatar"
                                fallbackText={(form.displayName || "M").charAt(0).toUpperCase()}
                                onUpload={async (file) => {
                                    const res = await sellerProfilesService.uploadAvatar(file);
                                    const profile = res?.profile || res;

                                    setForm((prev) => ({
                                        ...prev,
                                        avatarUrl: profile.avatarUrl,
                                    }));
                                }}
                            />

                            {/* БАНЕР */}
                            <ImageUpload
                                value={form.bannerUrl}
                                type="banner"
                                fallbackText="Банер магазину"
                                onUpload={async (file) => {
                                    const res = await sellerProfilesService.uploadBanner(file);
                                    const profile = res?.profile || res;

                                    setForm((prev) => ({
                                        ...prev,
                                        bannerUrl: profile.bannerUrl,
                                    }));
                                }}
                            />
                        </div>
                    </div>
                    <div className="seller-store__card">
                        <h2 className="seller-store__card-title">Соцмережі</h2>

                        <label className="seller-store__label">
                            Instagram
                            <input
                                className="seller-store__input"
                                value={form.socials.instagram}
                                onChange={(e) =>
                                    updateNestedField("socials", "instagram", e.target.value)
                                }
                                placeholder="https://instagram.com/yourshop"
                            />
                        </label>

                        <label className="seller-store__label">
                            Facebook
                            <input
                                className="seller-store__input"
                                value={form.socials.facebook}
                                onChange={(e) =>
                                    updateNestedField("socials", "facebook", e.target.value)
                                }
                                placeholder="https://facebook.com/yourshop"
                            />
                        </label>

                        <label className="seller-store__label">
                            Telegram
                            <input
                                className="seller-store__input"
                                value={form.socials.telegram}
                                onChange={(e) =>
                                    updateNestedField("socials", "telegram", e.target.value)
                                }
                                placeholder="https://t.me/yourshop"
                            />
                        </label>

                        <label className="seller-store__label">
                            Вебсайт
                            <input
                                className="seller-store__input"
                                value={form.socials.website}
                                onChange={(e) =>
                                    updateNestedField("socials", "website", e.target.value)
                                }
                                placeholder="https://yourshop.com"
                            />
                        </label>
                    </div>
                </div>

                <div className="seller-store__actions">
                    <button
                        type="submit"
                        className="seller-store__submit"
                        disabled={saving || uploadingAvatar || uploadingBanner}
                    >
                        {saving ? "Збереження..." : "Зберегти зміни"}
                    </button>
                </div>
            </form>
        </section>
    );
}