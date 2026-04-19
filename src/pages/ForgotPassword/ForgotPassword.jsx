import { useState } from "react";
import { Link } from "react-router-dom";
import { authService } from "../../services/authService";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setMessage("");
        setError("");
        setLoading(true);

        try {
            const data = await authService.forgotPassword(email);
            setMessage(
                data.message ||
                "Якщо акаунт із такою поштою існує, інструкцію надіслано."
            );
            setEmail("");
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
                    <h1 className="login__h1">Відновлення пароля</h1>
                    <p className="login__register">
                        Згадали пароль?{" "}
                        <Link className="login__register-link" to="/login">
                            Увійти
                        </Link>
                    </p>

                    <form className="login__form" onSubmit={handleSubmit}>
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

                        {message && <p className="login__success">{message}</p>}
                        {error && <p className="login__error">{error}</p>}

                        <button type="submit" disabled={loading}>
                            {loading ? "Надсилання..." : "Надіслати інструкцію"}
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
}