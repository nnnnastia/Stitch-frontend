import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

const BADGES = ["Новинка", "Розпродаж", "Хіт"];

export default function SellerProductForm() {
    const [title, setTitle] = useState("");
    const [price, setPrice] = useState("");
    const [currency, setCurrency] = useState("UAH");
    const [categoryId, setCategoryId] = useState("");
    const [description, setDescription] = useState("");
    const [badges, setBadges] = useState([]);
    const [coverFile, setCoverFile] = useState(null);
    const [imagesFiles, setImagesFiles] = useState([]);
    const [categories, setCategories] = useState([]);
    const [saving, setSaving] = useState(false);

    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    useEffect(() => {
        // підтягни категорії (залежить від твого API)
        fetch(`${API}/api/categories`)
            .then((r) => r.json())
            .then((d) => setCategories(Array.isArray(d.categories) ? d.categories : []))
            .catch(() => setCategories([]));
    }, []);

    function toggleBadge(b) {
        setBadges((prev) => (prev.includes(b) ? prev.filter(x => x !== b) : [...prev, b]));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if (!coverFile) return alert("Обкладинка (coverImage) обовʼязкова");

        const fd = new FormData();
        fd.append("title", title);
        fd.append("price", price);
        fd.append("currency", currency);
        fd.append("categoryId", categoryId);
        fd.append("description", description);

        badges.forEach((b) => fd.append("badges[]", b)); // або "badges" якщо так парсиш

        fd.append("coverImage", coverFile);

        // якщо ти зробиш upload.fields та images:
        for (const file of imagesFiles) fd.append("images", file);

        setSaving(true);
        const res = await fetch(`${API}/api/seller/products`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: fd,
        });

        const data = await res.json().catch(() => ({}));
        setSaving(false);

        if (!res.ok) return alert(data.message || "Не вдалося створити товар");
        navigate("/seller");
    }

    return (
        <div className="container">
            <h1>Додати товар</h1>

            <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12, maxWidth: 720 }}>
                <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Назва товару" required />

                <div style={{ display: "flex", gap: 10 }}>
                    <input value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Ціна" required />
                    <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
                        <option value="UAH">UAH</option>
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                    </select>
                </div>

                <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required>
                    <option value="">Оберіть категорію</option>
                    {categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                </select>

                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Опис"
                    rows={6}
                />

                <div>
                    <div style={{ marginBottom: 6, fontWeight: 700 }}>Бейджі</div>
                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                        {BADGES.map((b) => (
                            <label key={b} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                                <input type="checkbox" checked={badges.includes(b)} onChange={() => toggleBadge(b)} />
                                {b}
                            </label>
                        ))}
                    </div>
                </div>

                <div>
                    <div style={{ marginBottom: 6, fontWeight: 700 }}>Обкладинка (обовʼязково)</div>
                    <input type="file" accept="image/*" onChange={(e) => setCoverFile(e.target.files?.[0] || null)} required />
                </div>

                <div>
                    <div style={{ marginBottom: 6, fontWeight: 700 }}>Додаткові фото (необовʼязково)</div>
                    <input type="file" accept="image/*" multiple onChange={(e) => setImagesFiles(Array.from(e.target.files || []))} />
                </div>

                <button type="submit" disabled={saving}>
                    {saving ? "Збереження…" : "Створити товар"}
                </button>
            </form>
        </div>
    );
}
