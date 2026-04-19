import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import googleIcon from "../../assets/icon/google-icon.svg";
import facebookIcon from "../../assets/icon/facebook-icon.png";
import appleIcon from "../../assets/icon/apple-icon.svg";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

const INITIAL_FORM = {
    userName: "",
    userSurname: "",
    email: "",
    phoneNumber: "",
    role: "user",          // ✅ зробимо дефолт, щоб не було пусто
    password: "",
    confirmPassword: "",
};

export default function Register() {
    const [form, setForm] = useState(INITIAL_FORM);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    function handleChange(e) {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        if (error) setError("");
    }

    const passwordsMatch =
        form.password.length > 0 &&
        form.confirmPassword.length > 0 &&
        form.password === form.confirmPassword;

    async function handleSubmit(e) {
        e.preventDefault();
        if (loading) return;

        if (!form.userName.trim() || !form.userSurname.trim() || !form.email.trim()) {
            setError("Заповніть ім’я, прізвище та email");
            return;
        }
        if (form.password.length < 6) {
            setError("Пароль має бути мінімум 6 символів");
            return;
        }
        if (form.password !== form.confirmPassword) {
            setError("Паролі не співпадають");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const payload = {
                userName: form.userName.trim(),
                userSurname: form.userSurname.trim(),
                email: form.email.trim(),
                phoneNumber: form.phoneNumber.trim(),
                role: form.role, // "user" або "seller"
                password: form.password,
            };

            const res = await fetch(`${API}/api/auth/register`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await res.json().catch(() => ({}));

            if (!res.ok) {
                setError(data.message || "Registration failed");
                return;
            }

            // ✅ НІЯКОГО авто-логіну
            // ✅ Просто ведемо на сторінку "Перевірте пошту"
            navigate("/check-email", { replace: true });
        } catch {
            setError("Network error. Try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <section className="register">
            <div className="container">
                <div className="register__wrapper">
                    <h1 className="register__h1">Реєстрація</h1>
                    <p className="register__text">
                        Уже є акаунт?{" "}
                        <Link className="register__text-link" to="/login">
                            Увійти
                        </Link>
                    </p>

                    <form className="register__form" onSubmit={handleSubmit} noValidate>
                        <input
                            className="register__input"
                            name="userName"
                            value={form.userName}
                            onChange={handleChange}
                            placeholder="Імʼя"
                            autoComplete="given-name"
                            required
                        />

                        <input
                            className="register__input"
                            name="userSurname"
                            value={form.userSurname}
                            onChange={handleChange}
                            placeholder="Прізвище"
                            autoComplete="family-name"
                            required
                        />

                        <input
                            className="register__input"
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="Email"
                            autoComplete="email"
                            inputMode="email"
                            required
                        />

                        <input
                            className="register__input"
                            type="tel"
                            name="phoneNumber"
                            value={form.phoneNumber}
                            onChange={handleChange}
                            placeholder="Телефон (необовʼязково)"
                            autoComplete="tel"
                            inputMode="tel"
                        />

                        <fieldset className="register__role">
                            <legend className="register__label">Оберіть бажану роль:</legend>

                            <div className="register__segmented" role="radiogroup" aria-label="Роль">
                                <label className={`register__seg ${form.role === "seller" ? "is-active" : ""}`}>
                                    <input
                                        type="radio"
                                        name="role"
                                        value="seller"
                                        checked={form.role === "seller"}
                                        onChange={handleChange}
                                    />
                                    <span className="register__seg-text">Продавець</span>
                                </label>

                                <label className={`register__seg ${form.role === "user" ? "is-active" : ""}`}>
                                    <input
                                        type="radio"
                                        name="role"
                                        value="user"
                                        checked={form.role === "user"}
                                        onChange={handleChange}
                                    />
                                    <span className="register__seg-text">Клієнт</span>
                                </label>
                            </div>
                        </fieldset>

                        {/* Password */}
                        <div className="register__field">
                            <input
                                className="register__input"
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                placeholder="Пароль"
                                autoComplete="new-password"
                                minLength={6}
                                required
                            />
                            <button
                                type="button"
                                className="register__eye-btn"
                                aria-label={showPassword ? "Приховати пароль" : "Показати пароль"}
                                onClick={() => setShowPassword((prev) => !prev)}
                            >
                                👁
                            </button>
                        </div>

                        {/* Confirm Password */}
                        <div className="register__field">
                            <input
                                className="register__input"
                                type={showConfirmPassword ? "text" : "password"}
                                name="confirmPassword"
                                value={form.confirmPassword}
                                onChange={handleChange}
                                placeholder="Підтвердити пароль"
                                autoComplete="new-password"
                                minLength={6}
                                required
                            />
                            <button
                                type="button"
                                className="register__eye-btn"
                                aria-label={showConfirmPassword ? "Приховати пароль" : "Показати пароль"}
                                onClick={() => setShowConfirmPassword((prev) => !prev)}
                            >
                                👁
                            </button>
                        </div>

                        {form.confirmPassword.length > 0 && (
                            <p className={`register__hint ${passwordsMatch ? "register__hint_ok" : "register__hint_bad"}`}>
                                {passwordsMatch ? "Паролі співпадають" : "Паролі не співпадають"}
                            </p>
                        )}

                        {error && <p className="register__error">{error}</p>}

                        <button className="register__btn" type="submit" disabled={loading}>
                            {loading ? "Реєстрація..." : "Зареєструватися"}
                        </button>
                    </form>

                    <div className="register__divider"><span>або</span></div>

                    <div className="register__oauth">
                        <button type="button" className="register__oauth-btn"
                            onClick={() => {
                                window.location.href = "http://localhost:5000/api/auth/google/register";
                            }}>
                            <img src={googleIcon} alt="google" className="register__oauth-icon" />
                            Продовжити з Google
                        </button>
                        <button type="button" className="register__oauth-btn">
                            <img src={facebookIcon} alt="facebook" className="register__oauth-icon" />
                            Продовжити з Facebook
                        </button>
                        <button type="button" className="register__oauth-btn">
                            <img src={appleIcon} alt="apple" className="register__oauth-icon" />
                            Продовжити з Apple
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
