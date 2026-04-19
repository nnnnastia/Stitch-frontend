import { useSearchParams, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function CompleteGoogleSignupPage() {
    const [params] = useSearchParams();
    const navigate = useNavigate();
    const [role, setRole] = useState("user");
    const [loading, setLoading] = useState(false);

    const token = params.get("token");

    async function handleSubmit() {
        try {
            setLoading(true);

            const res = await fetch("http://localhost:5000/api/auth/google/complete-registration", {
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

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Failed to complete Google registration");
            }

            navigate("/");
        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <h1>Завершення реєстрації</h1>

            <label>
                <input
                    type="radio"
                    name="role"
                    value="user"
                    checked={role === "user"}
                    onChange={() => setRole("user")}
                />
                Покупець
            </label>

            <label>
                <input
                    type="radio"
                    name="role"
                    value="seller"
                    checked={role === "seller"}
                    onChange={() => setRole("seller")}
                />
                Продавець
            </label>

            <button onClick={handleSubmit} disabled={loading || !token}>
                Завершити реєстрацію
            </button>
        </div>
    );
}