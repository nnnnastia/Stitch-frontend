import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import googleIcon from "../assets/icon/google-icon.svg";
import facebookIcon from "../assets/icon/facebook-icon.png";
import appleIcon from "../assets/icon/apple-icon.svg";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            const res = await fetch(`${API}/api/auth/login`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json().catch(() => ({}));

            if (!res.ok) {
                throw new Error(data.message || "Помилка входу");
            }

            // accessToken можна зберегти лише в пам’яті/state, але не обов’язково в localStorage
            localStorage.setItem("role", data.user.role);
            localStorage.setItem("user", JSON.stringify(data.user));

            if (location.state?.from) {
                navigate(location.state.from, { replace: true });
                return;
            }

            switch (data.user.role) {
                case "seller":
                    navigate("/seller", { replace: true });
                    break;
                case "admin":
                    navigate("/admin", { replace: true });
                    break;
                default:
                    navigate("/profile", { replace: true });
            }
        } catch (error) {
            console.error(error);
            alert(error.message || "Не вдалося увійти");
        }
    }

    return (
        <section className="login">
            <div className="container">
                <div className="login__wrapper">
                    <h1 className="login__h1">Увійти</h1>
                    <p className="login__register">
                        Новий користувач?{" "}
                        <Link className="login__register-link" to="/register">
                            Зареєструватися
                        </Link>
                    </p>

                    <form className="login__form" onSubmit={handleSubmit} autoComplete="off">
                        <div className="login__field">
                            <input
                                className="login__input"
                                type="email"
                                placeholder="Email"
                                name="email"
                                autoComplete="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="login__field">
                            <input
                                className="login__input"
                                type={showPassword ? "text" : "password"}
                                name="password"
                                autoComplete="current-password"
                                placeholder="Пароль"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                className="login__eye-btn"
                                aria-label={showPassword ? "Приховати пароль" : "Показати пароль"}
                                onClick={() => setShowPassword((prev) => !prev)}
                            >
                                <span
                                    className={`login__eye-icon ${showPassword ? "icon-eye" : "icon-eye-off"}`}
                                />
                            </button>
                        </div>

                        <Link className="login__forgot" to="#">
                            Забули пароль?
                        </Link>

                        <button type="submit">Увійти</button>
                    </form>

                    <div className="login__divider">
                        <span>або</span>
                    </div>

                    <div className="login__oauth">
                        <button type="button" className="login__oauth-btn">
                            <img src={googleIcon} alt="google" className="login__oauth-icon" />
                            Продовжити з Google
                        </button>

                        <button type="button" className="login__oauth-btn">
                            <img src={facebookIcon} alt="facebook" className="login__oauth-icon" />
                            Продовжити з Facebook
                        </button>

                        <button type="button" className="login__oauth-btn">
                            <img src={appleIcon} alt="apple" className="login__oauth-icon" />
                            Продовжити з Apple
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}