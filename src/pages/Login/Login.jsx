import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import googleIcon from "../../assets/icon/google-icon.svg";
import facebookIcon from "../../assets/icon/facebook-icon.png";
import appleIcon from "../../assets/icon/apple-icon.svg";
import { http } from "../../api/http";
import { markAuthSession } from "../../utils/auth-session";
import { useNotification } from "../../components/NotificationContext/NotificationContext";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const { showError } = useNotification();
    const navigate = useNavigate();
    const location = useLocation();
    const queryClient = useQueryClient();

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            const data = await http("/api/auth/login", {
                method: "POST",
                body: JSON.stringify({ email, password }),
            });

            markAuthSession();

            localStorage.setItem("role", data.user.role);
            localStorage.setItem("user", JSON.stringify(data.user));

            queryClient.setQueryData(["me"], data.user);
            queryClient.removeQueries({ queryKey: ["cart"] });

            await queryClient.invalidateQueries({ queryKey: ["me"] });
            await queryClient.invalidateQueries({ queryKey: ["cart"] });

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
            showError(error.message || "Не вдалося увійти");
        }
    }

    return (
        <section className="login">
            <div className="container">
                <div className="login__wrapper">
                    <div className="login__top">
                        <button
                            type="button"
                            className="login__back"
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

                    <h1 className="login__h1">Увійти</h1>

                    <p className="login__register">
                        Новий користувач?{" "}
                        <Link className="login__register-link" to="/register">
                            Зареєструватися
                        </Link>
                    </p>

                    <form className="login__form" onSubmit={handleSubmit} autoComplete="off">
                        <input
                            className="login__input"
                            type="email"
                            placeholder="Email"
                            name="email"
                            autoComplete="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

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
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>

                        <Link className="login__forgot" to="/forgot-password">
                            Забули пароль?
                        </Link>

                        <button className="login__btn" type="submit">
                            Увійти
                        </button>
                    </form>

                    <div className="login__divider">
                        <span>або</span>
                    </div>

                    <div className="login__oauth">
                        <button
                            type="button"
                            className="login__oauth-btn"
                            onClick={() => {
                                window.location.href = `${API}/api/auth/google/login`;
                            }}
                        >
                            <img src={googleIcon} alt="google" className="login__oauth-icon" />
                            Продовжити з Google
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}