import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

export default function VerifyEmail() {
    const [params] = useSearchParams();
    const token = params.get("token");

    const [status, setStatus] = useState("loading"); // loading | ok | error
    const [message, setMessage] = useState("");

    useEffect(() => {
        async function run() {
            try {
                const res = await fetch(`http://localhost:5000/api/api/auth/verify-email?token=${encodeURIComponent(token)}`);
                const data = await res.json().catch(() => ({}));

                if (res.ok) {
                    setStatus("ok");
                    setMessage(data.message || "Email підтверджено!");
                } else {
                    setStatus("error");
                    setMessage(data.message || "Посилання недійсне або прострочене");
                }
            } catch {
                setStatus("error");
                setMessage("Помилка мережі");
            }
        }

        if (!token) {
            setStatus("error");
            setMessage("Немає токена в посиланні");
            return;
        }
        run();
    }, [token]);

    return (
        <div className="container" style={{ padding: 24 }}>
            {status === "loading" && <p>Підтверджуємо email…</p>}

            {status === "ok" && (
                <>
                    <h1>✅ Готово!</h1>
                    <p>{message}</p>
                    <Link to="/login">Перейти до входу</Link>
                </>
            )}

            {status === "error" && (
                <>
                    <h1>❌ Не вийшло</h1>
                    <p>{message}</p>
                    <Link to="/login">До сторінки входу</Link>
                </>
            )}
        </div>
    );
}
