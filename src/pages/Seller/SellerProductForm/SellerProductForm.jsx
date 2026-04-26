import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./SellerProductForm.scss";

const API_BASE = import.meta.env.VITE_API_URL;
const BADGES = ["Новинка", "Розпродаж", "Хіт"];

export default function SellerProductForm({ mode = "create" }) {
    const navigate = useNavigate();
    const { id } = useParams();

    const isEdit = mode === "edit";

    const [title, setTitle] = useState("");
    const [price, setPrice] = useState("");
    const [currency, setCurrency] = useState("UAH");
    const [categoryId, setCategoryId] = useState("");
    const [description, setDescription] = useState("");
    const [badges, setBadges] = useState([]);
    const [coverFile, setCoverFile] = useState(null);
    const [imagesFiles, setImagesFiles] = useState([]);
    const [categories, setCategories] = useState([]);

    const [existingCover, setExistingCover] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadCategories() {
            try {
                const res = await fetch(`${API_BASE}/api/categories`, {
                    credentials: "include",
                });

                const data = await res.json().catch(() => ({}));

                const rawCategories = Array.isArray(data)
                    ? data
                    : data.categories || data.items || data.data || [];

                setCategories(rawCategories);
            } catch (err) {
                console.error("LOAD CATEGORIES ERROR:", err);
                setCategories([]);
            }
        }

        loadCategories();
    }, []);

    useEffect(() => {
        async function loadProductForEdit() {
            if (!isEdit || !id) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError("");

                const res = await fetch(`${API_BASE}/api/seller/products/${id}`, {
                    credentials: "include",
                });

                const data = await res.json().catch(() => ({}));

                if (!res.ok) {
                    setError(data.message || "Не вдалося завантажити товар");
                    setLoading(false);
                    return;
                }

                const product = data.product || data;

                setTitle(product.title || "");
                setPrice(product.price ?? "");
                setCurrency(product.currency || "UAH");
                setCategoryId(product.category?.id || product.categoryId || "");
                setDescription(product.description || "");
                setBadges(Array.isArray(product.badges) ? product.badges : []);
                setExistingCover(product.coverImage || "");
            } catch (err) {
                console.error("LOAD PRODUCT ERROR:", err);
                setError("Не вдалося завантажити товар");
            } finally {
                setLoading(false);
            }
        }

        loadProductForEdit();
    }, [id, isEdit]);

    function toggleBadge(badge) {
        setBadges((prev) =>
            prev.includes(badge)
                ? prev.filter((item) => item !== badge)
                : [...prev, badge]
        );
    }

    async function handleSubmit(e) {
        e.preventDefault();

        if (!title.trim()) {
            setError("Вкажіть назву товару");
            return;
        }

        if (!price || Number(price) <= 0) {
            setError("Вкажіть коректну ціну");
            return;
        }

        if (!categoryId) {
            setError("Оберіть категорію");
            return;
        }

        if (!isEdit && !coverFile) {
            setError("Обкладинка обовʼязкова");
            return;
        }

        try {
            setSaving(true);
            setError("");

            const fd = new FormData();
            fd.append("title", title.trim());
            fd.append("price", String(price));
            fd.append("currency", currency);
            fd.append("categoryId", categoryId);
            fd.append("description", description.trim());

            badges.forEach((badge) => fd.append("badges", badge));

            if (coverFile) {
                fd.append("coverImage", coverFile);
            }

            imagesFiles.forEach((file) => fd.append("images", file));

            const url = isEdit
                ? `${API_BASE}/api/seller/products/${id}`
                : `${API_BASE}/api/seller/products`;

            const method = isEdit ? "PATCH" : "POST";

            const res = await fetch(url, {
                method,
                credentials: "include",
                body: fd,
            });

            const data = await res.json().catch(() => ({}));

            if (!res.ok) {
                setError(data.message || "Не вдалося зберегти товар");
                return;
            }

            navigate("/seller", { replace: true });
        } catch (err) {
            console.error("SAVE PRODUCT ERROR:", err);
            setError("Не вдалося зберегти товар");
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return (
            <section className="seller-product-form">
                <div className="seller-product-form__container">
                    <p>Завантаження...</p>
                </div>
            </section>
        );
    }

    return (
        <section className="seller-product-form">
            <div className="seller-product-form__container">
                <div className="seller-product-form__head">
                    <div>
                        <h1 className="seller-product-form__title">
                            {isEdit ? "Редагувати товар" : "Створити товар"}
                        </h1>
                        <p className="seller-product-form__subtitle">
                            Заповніть основні дані товару, оберіть категорію, додайте фото та бейджі.
                        </p>
                    </div>
                </div>

                <form className="seller-product-form__card" onSubmit={handleSubmit}>
                    <div className="seller-product-form__section">
                        <h2 className="seller-product-form__section-title">Основна інформація</h2>
                        <p className="seller-product-form__section-text">
                            Заповніть базові дані товару: назву, категорію, ціну та короткий опис.
                        </p>

                        <div className="seller-product-form__grid">
                            <div className="seller-product-form__field seller-product-form__field--full">
                                <label className="seller-product-form__label">Назва товару</label>
                                <input
                                    className="seller-product-form__input"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Наприклад, В’язаний зайчик"
                                    required
                                />
                            </div>

                            <div className="seller-product-form__field">
                                <label className="seller-product-form__label">Ціна</label>
                                <input
                                    className="seller-product-form__input"
                                    type="number"
                                    min="1"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    placeholder="450"
                                    required
                                />
                            </div>

                            <div className="seller-product-form__field">
                                <label className="seller-product-form__label">Валюта</label>
                                <select
                                    className="seller-product-form__select"
                                    value={currency}
                                    onChange={(e) => setCurrency(e.target.value)}
                                >
                                    <option value="UAH">UAH</option>
                                    <option value="USD">USD</option>
                                    <option value="EUR">EUR</option>
                                </select>
                            </div>

                            <div className="seller-product-form__field seller-product-form__field--full">
                                <label className="seller-product-form__label">Категорія</label>
                                <select
                                    className="seller-product-form__select"
                                    value={categoryId}
                                    onChange={(e) => setCategoryId(e.target.value)}
                                    required
                                >
                                    <option value="">Оберіть категорію</option>
                                    {categories.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="seller-product-form__field seller-product-form__field--full">
                                <label className="seller-product-form__label">Опис</label>
                                <textarea
                                    className="seller-product-form__textarea"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Опишіть матеріали, розмір, колір, особливості догляду..."
                                    rows={6}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="seller-product-form__section">
                        <h2 className="seller-product-form__section-title">Оформлення товару</h2>
                        <p className="seller-product-form__section-text">
                            Додайте бейджі, обкладинку та додаткові фотографії.
                        </p>

                        <div className="seller-product-form__grid">
                            <div className="seller-product-form__field seller-product-form__field--full">
                                <label className="seller-product-form__label">Бейджі</label>
                                <div className="seller-product-form__badges">
                                    {BADGES.map((badge) => (
                                        <button
                                            key={badge}
                                            type="button"
                                            className={`seller-product-form__badge ${badges.includes(badge) ? "is-active" : ""}`}
                                            onClick={() => toggleBadge(badge)}
                                        >
                                            {badge}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="seller-product-form__field">
                                <label className="seller-product-form__label">
                                    Обкладинка {isEdit ? "(можна не змінювати)" : "(обовʼязково)"}
                                </label>

                                <div className="seller-product-form__file-wrap">
                                    <input
                                        className="seller-product-form__file"
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
                                        required={!isEdit}
                                    />

                                    {coverFile ? (
                                        <div className="seller-product-form__preview">
                                            <img
                                                src={URL.createObjectURL(coverFile)}
                                                alt="preview"
                                                style={{ maxWidth: "150px" }}
                                            />
                                        </div>
                                    ) : isEdit && existingCover ? (
                                        <div className="seller-product-form__preview">
                                            <img
                                                src={existingCover}
                                                alt="cover"
                                                style={{ maxWidth: "150px" }}
                                            />
                                        </div>
                                    ) : (
                                        <p className="seller-product-form__hint">
                                            Завантажте головне фото товару.
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="seller-product-form__field">
                                <label className="seller-product-form__label">Додаткові фото</label>

                                <div className="seller-product-form__file-wrap">
                                    <input
                                        className="seller-product-form__file"
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={(e) => setImagesFiles(Array.from(e.target.files || []))}
                                    />

                                    {imagesFiles.length > 0 ? (
                                        <div className="seller-product-form__preview">
                                            {imagesFiles.map((file, index) => (
                                                <img
                                                    key={index}
                                                    src={URL.createObjectURL(file)}
                                                    alt="preview"
                                                    style={{ width: "80px", marginRight: "8px" }}
                                                />
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="seller-product-form__hint">
                                            Можна додати кілька додаткових фотографій товару.
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {error ? <p className="seller-product-form__error">{error}</p> : null}

                    <div className="seller-product-form__actions">
                        <button
                            type="button"
                            className="seller-product-form__button seller-product-form__button--ghost"
                            onClick={() => navigate("/seller")}
                        >
                            Скасувати
                        </button>

                        <button
                            type="submit"
                            className="seller-product-form__button seller-product-form__button--primary"
                            disabled={saving}
                        >
                            {saving
                                ? "Збереження..."
                                : isEdit
                                    ? "Оновити товар"
                                    : "Створити товар"}
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
}