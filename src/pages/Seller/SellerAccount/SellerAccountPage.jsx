import { useEffect, useState } from "react";
import { usersService } from "../../../services/users.service";
import { sellerProfilesService } from "../../../services/sellerProfile.service";
import { useNotification } from "../../../components/NotificationContext/NotificationContext";
import { Eye, EyeOff } from "lucide-react";

export default function SellerAccountPage() {
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
    });

    const [passwordForm, setPasswordForm] = useState({
        oldPassword: "",
        newPassword: "",
        repeatPassword: "",
    });

    const [payout, setPayout] = useState({
        provider: "",
        cardLast4: "",
    });

    const [showPassword, setShowPassword] = useState({
        old: false,
        new: false,
        repeat: false,
    });

    const [emailVerified, setEmailVerified] = useState(false);
    const [loading, setLoading] = useState(true);
    const { showSuccess, showError } = useNotification();

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        try {
            const user = await usersService.getMe();
            const profileRes = await sellerProfilesService.getMyProfile();
            const profile = profileRes?.profile || profileRes;

            setForm({
                firstName: user.firstName || "",
                lastName: user.lastName || "",
                email: user.email || "",
                phoneNumber: user.phoneNumber || "",
            });

            setEmailVerified(user.emailVerified);

            setPayout({
                provider: profile?.payout?.provider || "",
                cardLast4: profile?.payout?.cardLast4 || "",
            });
        } catch (e) {
            console.error(e);
            showError("Не вдалося завантажити дані");
        } finally {
            setLoading(false);
        }
    }

    function updateField(field, value) {
        setForm((prev) => ({ ...prev, [field]: value }));
    }

    function togglePassword(field) {
        setShowPassword((prev) => ({
            ...prev,
            [field]: !prev[field],
        }));
    }

    function updatePassword(field, value) {
        setPasswordForm((prev) => ({ ...prev, [field]: value }));
    }

    function updatePayout(field, value) {
        setPayout((prev) => ({ ...prev, [field]: value }));
    }

    async function handleSaveProfile(e) {
        e.preventDefault();

        try {
            await usersService.updateMe({
                firstName: form.firstName,
                lastName: form.lastName,
                phoneNumber: form.phoneNumber,
            });

            showSuccess("Дані успішно оновлено");
        } catch (e) {
            showError(e.message || "Не вдалося оновити дані");
        }
    }

    async function handleChangePassword(e) {
        e.preventDefault();

        try {
            await usersService.changePassword(passwordForm);

            showSuccess("Пароль успішно змінено");
            setPasswordForm({
                oldPassword: "",
                newPassword: "",
                repeatPassword: "",
            });
        } catch (e) {
            showError(e.message || "Помилка зміни пароля");
        }
    }

    async function handleSavePayout(e) {
        e.preventDefault();

        try {
            await sellerProfilesService.updateMyProfile({
                payout,
            });

            showSuccess("Платіжні дані збережено");
        } catch (e) {
            showError(e.message || "Не вдалося зберегти платіжні дані");
        }
    }

    if (loading) {
        return <div className="seller-account">Завантаження...</div>;
    }

    return (
        <section className="seller-account">
            <h1 className="seller-account__title">Налаштування акаунта</h1>

            {/* ===================== ОСОБИСТІ ДАНІ ===================== */}
            <form className="seller-account__card" onSubmit={handleSaveProfile}>
                <h2>Особисті дані</h2>

                <input
                    value={form.firstName}
                    onChange={(e) => updateField("firstName", e.target.value)}
                    placeholder="Ім’я"
                />

                <input
                    value={form.lastName}
                    onChange={(e) => updateField("lastName", e.target.value)}
                    placeholder="Прізвище"
                />

                <input
                    value={form.email}
                    disabled
                    placeholder="Email"
                />

                <input
                    value={form.phoneNumber}
                    onChange={(e) => updateField("phoneNumber", e.target.value)}
                    placeholder="Телефон"
                />

                <div className="seller-account__email-status">
                    {emailVerified ? "✅ Email підтверджено" : "❌ Email не підтверджено"}
                </div>

                <button className="seller-account__card--btn" type="submit">Зберегти</button>
            </form>

            {/* ===================== БЕЗПЕКА ===================== */}
            <form className="seller-account__card" onSubmit={handleChangePassword}>
                <h2>Безпека</h2>

                <div className="password-field">
                    <input
                        type={showPassword.old ? "text" : "password"}
                        value={passwordForm.oldPassword}
                        onChange={(e) => updatePassword("oldPassword", e.target.value)}
                        placeholder="Старий пароль"
                    />

                    <button
                        type="button"
                        className="password-field__toggle"
                        onClick={() => togglePassword("old")}
                        aria-label="Показати пароль"
                    >
                        {showPassword.old ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>

                {/* Новий пароль */}
                <div className="password-field">
                    <input
                        type={showPassword.new ? "text" : "password"}
                        value={passwordForm.newPassword}
                        onChange={(e) => updatePassword("newPassword", e.target.value)}
                        placeholder="Новий пароль"
                    />

                    <button
                        type="button"
                        onClick={() => togglePassword("new")}
                        className="password-field__toggle"
                    >
                        {showPassword.new ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>

                {/* Повтор пароля */}
                <div className="password-field">
                    <input
                        type={showPassword.repeat ? "text" : "password"}
                        value={passwordForm.repeatPassword}
                        onChange={(e) => updatePassword("repeatPassword", e.target.value)}
                        placeholder="Повторіть пароль"
                    />

                    <button
                        type="button"
                        onClick={() => togglePassword("repeat")}
                        className="password-field__toggle"
                    >
                        {showPassword.repeat ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>

                <button className="seller-account__card--btn" type="submit">Змінити пароль</button>
            </form>
        </section>
    );
}