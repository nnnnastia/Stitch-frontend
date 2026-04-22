import { Link } from "react-router-dom";
import { XCircle } from "lucide-react";

export default function PaymentCancelPage() {
    return (
        <section className="payment-result payment-result--cancel">
            <div className="payment-result__card">
                <div className="payment-result__icon">
                    <XCircle size={48} />
                </div>

                <h1 className="payment-result__title">
                    Оплату скасовано
                </h1>

                <p className="payment-result__text">
                    Ви скасували оплату. Замовлення не було оплачено.
                </p>

                <div className="payment-result__actions">
                    <Link
                        to="/profile/orders"
                        className="payment-result__btn"
                    >
                        Перейти до замовлень
                    </Link>

                    <Link
                        to="/catalog"
                        className="payment-result__secondary"
                    >
                        Продовжити покупки
                    </Link>
                </div>
            </div>
        </section>
    );
}