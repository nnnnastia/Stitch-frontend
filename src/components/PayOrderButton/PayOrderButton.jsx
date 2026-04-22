import { useState } from "react";
import { paymentsService } from "../../services/payments.service";
import { useNotification } from "../NotificationContext/NotificationContext";

export default function PayOrderButton({ orderId }) {
    const [loading, setLoading] = useState(false);
    const { showSuccess, showError } = useNotification();

    const handlePay = async () => {
        try {
            setLoading(true);
            const data = await paymentsService.createCheckoutSession(orderId);

            if (data?.url) {
                window.location.href = data.url;
            }
        } catch (error) {
            console.error(error);
            showError("Не вдалося створити сесію оплати");
        } finally {
            setLoading(false);
        }
    };

    return (
        <button type="button" onClick={handlePay} disabled={loading}>
            {loading ? "Переходимо до оплати..." : "Оплатити через Stripe"}
        </button>
    );
}