import { useEffect, useMemo, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import SellerSidebar from "../../../components/SellerSidebar/SellerSidebar";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function SellerLayout() {
    const [profile, setProfile] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    const stats = useMemo(() => {
        const total = products.length;
        const hits = products.filter((p) => p.badges?.includes("Хіт")).length;
        const sales = products.filter((p) => p.badges?.includes("Розпродаж")).length;
        const news = products.filter((p) => p.badges?.includes("Новинка")).length;

        return { total, hits, sales, news };
    }, [products]);

    useEffect(() => {
        let alive = true;

        async function loadLayoutData() {
            try {
                setLoading(true);

                const profileRes = await fetch(`${API}/api/seller/profile/me`, {
                    credentials: "include",
                });

                if (!alive) return;

                if (profileRes.status === 401) {
                    navigate("/login", { replace: true });
                    return;
                }

                if (!profileRes.ok) {
                    setProfile(null);
                    setProducts([]);
                    return;
                }

                const profileData = await profileRes.json();
                setProfile(profileData);

                const productsRes = await fetch(`${API}/api/seller/products`, {
                    credentials: "include",
                });

                if (!alive) return;

                if (!productsRes.ok) {
                    setProducts([]);
                    return;
                }

                const productsData = await productsRes.json();
                setProducts(productsData.items || productsData.products || []);
            } catch (error) {
                console.error("SELLER LAYOUT ERROR:", error);
                setProfile(null);
                setProducts([]);
            } finally {
                if (alive) {
                    setLoading(false);
                }
            }
        }

        loadLayoutData();

        return () => {
            alive = false;
        };
    }, [navigate]);

    if (loading) {
        return <div className="container">Завантаження…</div>;
    }

    if (!profile) {
        return (
            <div className="container">
                <h1>Кабінет продавця</h1>
                <p>Потрібно увійти в акаунт продавця або доступ обмежено.</p>
            </div>
        );
    }

    return (
        <section className="sellerApp">
            <div className="container">
                <div className="sellerLayout">
                    <SellerSidebar profile={profile} stats={stats} />

                    <main className="sellerMain">
                        <Outlet context={{ profile, stats, products, setProducts }} />
                    </main>
                </div>
            </div>
        </section>
    );
}