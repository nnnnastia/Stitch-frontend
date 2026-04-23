import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle } from "lucide-react";

export default function PaymentSuccessPage() {
    const [searchParams] = useSearchParams();s

    return (
        <section className="payment-result payment-result--success">
            <div className="payment-result__card">
                <div className="payment-result__icon payment-result__icon--success">
                    <CheckCircle size={48} />
                </div>

                <h1 className="payment-result__title">
                    Оплату отримано
                </h1>

                <p className="payment-result__text">
                    Дякуємо за покупку 💙 Платіж обробляється, статус замовлення оновиться автоматично.
                </p>

                <p className="payment-result__text">
                    Якщо статус не змінився одразу — зачекайте кілька секунд і оновіть сторінку.
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