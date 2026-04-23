import { useEffect, useMemo, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import SellerSidebar from "../../../components/SellerSidebar/SellerSidebar";
import { usersService } from "../../../services/users.service";

const API = import.meta.env.VITE_API_URL;

export default function SellerLayout() {
    const [profile, setProfile] = useState(null);
    const [products, setProducts] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
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

                const [profileRes, productsRes, userRes] = await Promise.all([
                    fetch(`${API}/api/seller/profile/me`, {
                        credentials: "include",
                    }),
                    fetch(`${API}/api/seller/products`, {
                        credentials: "include",
                    }),
                    usersService.getMe(),
                ]);

                if (!alive) return;

                if (profileRes.status === 401) {
                    navigate("/login", { replace: true });
                    return;
                }

                if (!profileRes.ok) {
                    setProfile(null);
                    setProducts([]);
                    setCurrentUser(userRes || null);
                    return;
                }

                const profileData = await profileRes.json();
                setProfile(profileData?.profile || profileData || null);

                if (productsRes.ok) {
                    const productsData = await productsRes.json();
                    setProducts(productsData.items || productsData.products || []);
                } else {
                    setProducts([]);
                }

                setCurrentUser(userRes || null);
            } catch (error) {
                console.error("SELLER LAYOUT ERROR:", error);
                setProfile(null);
                setProducts([]);
                setCurrentUser(null);
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
                    <SellerSidebar
                        profile={profile}
                        stats={stats}
                        currentUser={currentUser}
                    />

                    <main className="sellerMain">
                        <Outlet context={{ profile, stats, products, setProducts, currentUser }} />
                    </main>
                </div>
            </div>
        </section>
    );
}