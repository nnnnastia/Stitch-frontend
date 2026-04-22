import { useSearchParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNotification } from "../../components/NotificationContext/NotificationContext";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function CompleteGoogleSignupPage() {
    const [params] = useSearchParams();
    const navigate = useNavigate();
    const [role, setRole] = useState("user");
    const [loading, setLoading] = useState(false);
    const { showError } = useNotification();

    const token = params.get("token");

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            setLoading(true);

            const res = await fetch(`${API}/api/auth/google/complete-registration`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    token,
                    role,
                }),
            });

            const data = await res.json().catch(() => ({}));

            if (!res.ok) {
                throw new Error(data.message || "Failed to complete Google registration");
            }

            navigate("/");
        } catch (error) {
            showError(error.message || "Не вдалося завершити реєстрацію");
        } finally {
            setLoading(false);
        }
    }

    return (
        <section className="google-complete">
            <div className="google-complete__wrapper">
                <div className="google-complete__top">
                    <button
                        type="button"
                        className="google-complete__back"
                        onClick={() => {
                            if (window.history.length > 1) {
                                navigate(-1);
                            } else {
                                navigate("/");
                            }
                        }}
                        aria-label="Назад"
                    >
                        <ArrowLeft size={20} />
                    </button>
                </div>

                <h1 className="google-complete__title">Завершення реєстрації</h1>
                <p className="google-complete__subtitle">
                    Оберіть, як ви хочете користуватися сайтом.
                </p>

                <form className="google-complete__form" onSubmit={handleSubmit}>
                    <fieldset className="google-complete__role">
                        <legend className="google-complete__label">Оберіть роль</legend>

                        <div
                            className="google-complete__segmented"
                            role="radiogroup"
                            aria-label="Роль"
                        >
                            <label
                                className={`google-complete__seg ${role === "seller" ? "is-active" : ""}`}
                            >
                                <input
                                    type="radio"
                                    name="role"
                                    value="seller"
                                    checked={role === "seller"}
                                    onChange={() => setRole("seller")}
                                />
                                <span className="google-complete__seg-text">Продавець</span>
                            </label>

                            <label
                                className={`google-complete__seg ${role === "user" ? "is-active" : ""}`}
                            >
                                <input
                                    type="radio"
                                    name="role"
                                    value="user"
                                    checked={role === "user"}
                                    onChange={() => setRole("user")}
                                />
                                <span className="google-complete__seg-text">Покупець</span>
                            </label>
                        </div>
                    </fieldset>

                    {!token && (
                        <p className="google-complete__error">
                            Токен реєстрації відсутній або недійсний.
                        </p>
                    )}

                    <button
                        className="google-complete__btn"
                        type="submit"
                        disabled={loading || !token}
                    >
                        {loading ? "Завершення..." : "Завершити реєстрацію"}
                    </button>
                </form>
            </div>
        </section>
    );
}