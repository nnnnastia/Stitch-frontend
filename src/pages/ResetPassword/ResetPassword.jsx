import { useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { authService } from "../../services/authService";

export default function ResetPassword() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const token = useMemo(() => searchParams.get("token") || "", [searchParams]);

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setMessage("");
        setError("");

        if (!token) {
            setError("Недійсне або відсутнє посилання для відновлення пароля");
            return;
        }

        setLoading(true);

        try {
            const data = await authService.resetPassword({
                token,
                newPassword,
                confirmPassword,
            });

            setMessage(data.message || "Пароль успішно змінено");

            setTimeout(() => {
                navigate("/login", { replace: true });
            }, 1500);
        } catch (err) {
            setError(err.message || "Сталася помилка");
        } finally {
            setLoading(false);
        }
    }

    return (
        <section className="login">
            <div className="container">
                <div className="login__wrapper">
                    <h1 className="login__h1">Новий пароль</h1>
                    <p className="login__register">
                        Повернутися до{" "}
                        <Link className="login__register-link" to="/login">
                            входу
                        </Link>
                    </p>

                    <form className="login__form" onSubmit={handleSubmit}>
                        <div className="login__field">
                            <input
                                className="login__input"
                                type={showPassword ? "text" : "password"}
                                placeholder="Новий пароль"
                                autoComplete="new-password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                className="login__eye-btn"
                                aria-label={showPassword ? "Приховати пароль" : "Показати пароль"}
                                onClick={() => setShowPassword((prev) => !prev)}
                            >
                                <span
                                    className={`login__eye-icon ${showPassword ? "icon-eye" : "icon-eye-off"
                                        }`}
                                />
                            </button>
                        </div>

                        <div className="login__field">
                            <input
                                className="login__input"
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Повторіть пароль"
                                autoComplete="new-password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                className="login__eye-btn"
                                aria-label={
                                    showConfirmPassword ? "Приховати пароль" : "Показати пароль"
                                }
                                onClick={() => setShowConfirmPassword((prev) => !prev)}
                            >
                                <span
                                    className={`login__eye-icon ${showConfirmPassword ? "icon-eye" : "icon-eye-off"
                                        }`}
                                />
                            </button>
                        </div>

                        {message && <p className="login__success">{message}</p>}
                        {error && <p className="login__error">{error}</p>}

                        <button type="submit" disabled={loading}>
                            {loading ? "Збереження..." : "Зберегти новий пароль"}
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
}