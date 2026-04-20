import { Link, useSearchParams } from "react-router-dom";

export default function PaymentSuccessPage() {
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get("session_id");

    return (
        <section className="payment-result">
            <div className="payment-result__container">
                <h1 className="payment-result__title">Оплату отримано</h1>

                <p className="payment-result__text">
                    Дякуємо. Платіж обробляється, а статус замовлення буде оновлено автоматично.
                </p>

                <p className="payment-result__text">
                    Якщо статус не змінився одразу, зачекайте кілька секунд і оновіть сторінку.
                </p>

                {sessionId && (
                    <p className="payment-result__meta">
                        ID сесії: <strong>{sessionId}</strong>
                    </p>
                )}

                <div className="payment-result__actions">
                    <Link to="/orders" className="payment-result__link">
                        Перейти до моїх замовлень
                    </Link>
                </div>
            </div>
        </section>
    );
}