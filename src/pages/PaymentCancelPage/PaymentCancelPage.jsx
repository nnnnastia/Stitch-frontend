import { Link } from "react-router-dom";

export default function PaymentCancelPage() {
    return (
        <section className="payment-result">
            <div className="payment-result__container">
                <h1 className="payment-result__title">Оплату скасовано</h1>

                <p className="payment-result__text">
                    Ви скасували оплату. Замовлення не було оплачено.
                </p>

                <div className="payment-result__actions">
                    <Link to="/orders" className="payment-result__link">
                        Повернутися до замовлень
                    </Link>
                </div>
            </div>
        </section>
    );
}