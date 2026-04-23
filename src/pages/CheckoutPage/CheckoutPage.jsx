import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { shippingService } from "../../services/shipping.service";
import { ordersService } from "../../services/orders.service";
import { paymentsService } from "../../services/payments.service";
import { usersService } from "../../services/users.service";
import { useCart } from "../../hooks/useCart";
import { useNotification } from "../../components/NotificationContext/NotificationContext.jsx";
import { fileUrl } from "../../utils/fileUrl.js";

export default function CheckoutPage() {
    const navigate = useNavigate();
    const { cart } = useCart();
    const { showSuccess, showError } = useNotification();
    const [cityQuery, setCityQuery] = useState("");
    const [cities, setCities] = useState([]);
    const [selectedCity, setSelectedCity] = useState(null);

    const [warehouses, setWarehouses] = useState([]);
    const [selectedWarehouse, setSelectedWarehouse] = useState(null);

    const [recipientFullName, setRecipientFullName] = useState("");
    const [recipientPhone, setRecipientPhone] = useState("");
    const [recipientEmail, setRecipientEmail] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("cod");

    const [loadingCities, setLoadingCities] = useState(false);
    const [loadingWarehouses, setLoadingWarehouses] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const items = cart?.items || [];
    const summary = cart?.summary || {
        totalItems: 0,
        totalPrice: 0,
        uniqueItems: 0,
    };

    useEffect(() => {
        const timer = setTimeout(async () => {
            if (!cityQuery.trim()) {
                setCities([]);
                return;
            }

            try {
                setLoadingCities(true);
                const data = await shippingService.searchCities(cityQuery);
                setCities(data.items || []);
            } catch (error) {
                console.error(error);
            } finally {
                setLoadingCities(false);
            }
        }, 400);

        return () => clearTimeout(timer);
    }, [cityQuery]);

    useEffect(() => {
        async function loadWarehouses() {
            if (!selectedCity?.id) {
                setWarehouses([]);
                return;
            }

            try {
                setLoadingWarehouses(true);
                const data = await shippingService.getWarehouses(selectedCity.id);
                setWarehouses(data.items || []);
            } catch (error) {
                console.error(error);
            } finally {
                setLoadingWarehouses(false);
            }
        }

        setSelectedWarehouse(null);
        loadWarehouses();
    }, [selectedCity]);

    useEffect(() => {
        async function loadUserProfile() {
            try {
                const user = await usersService.getMe();

                if (!user) return;

                const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim();

                if (fullName) {
                    setRecipientFullName((prev) => prev || fullName);
                }

                if (user.phoneNumber) {
                    setRecipientPhone((prev) => prev || user.phoneNumber);
                }

                if (user.email) {
                    setRecipientEmail((prev) => prev || user.email);
                }
            } catch (error) {
                console.error("Не вдалося підтягнути дані профілю", error);
            }
        }

        loadUserProfile();
    }, []);

    async function handleSubmit(e) {
        e.preventDefault();

        if (!items.length) {
            showError("Кошик порожній");
            return;
        }

        if (!selectedCity || !selectedWarehouse) {
            showError("Оберіть місто та відділення");
            return;
        }

        if (!recipientFullName.trim() || !recipientPhone.trim()) {
            showError("Заповніть ПІБ та телефон");
            return;
        }

        try {
            setSubmitting(true);

            const data = await ordersService.createOrder({
                paymentMethod,
                delivery: {
                    provider: "nova_poshta",
                    cityId: selectedCity.id,
                    cityName: selectedCity.name,
                    warehouseId: selectedWarehouse.id,
                    warehouseName: selectedWarehouse.name,
                    recipientFullName: recipientFullName.trim(),
                    recipientPhone: recipientPhone.trim(),
                    recipientEmail: recipientEmail.trim(),
                },
            });

            const orderId = data?.order?._id || data?.order?.id;

            if (!orderId) {
                throw new Error("Не вдалося отримати ID замовлення");
            }

            if (paymentMethod === "card") {
                const payment = await paymentsService.createCheckoutSession(orderId);

                if (!payment?.url) {
                    throw new Error("Не вдалося створити платіжну сесію");
                }

                window.location.href = payment.url;
                return;
            }

            showSuccess("Замовлення успішно оформлено");
            navigate(`/payment/success`);
        } catch (error) {
            console.error(error);
            showError(error.message || "Помилка оформлення замовлення");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <section className="checkout">
            <div className="container">
                <h1 className="checkout__title">Оформлення замовлення</h1>

                {!items.length ? (
                    <p className="checkout__empty">Кошик порожній.</p>
                ) : (
                    <div className="checkout__layout">
                        <form className="checkout__form" onSubmit={handleSubmit}>
                            <div className="checkout__block">
                                <h2>Доставка</h2>

                                <p className="checkout__delivery-type">
                                    Служба доставки: <strong>Нова пошта</strong>
                                </p>

                                <label htmlFor="city">Місто</label>
                                <input
                                    id="city"
                                    type="text"
                                    value={cityQuery}
                                    onChange={(e) => {
                                        setCityQuery(e.target.value);
                                        setSelectedCity(null);
                                    }}
                                    placeholder="Почніть вводити назву міста"
                                />

                                {loadingCities && <p>Завантаження міст...</p>}

                                {!selectedCity && cities.length > 0 && (
                                    <div className="checkout-dropdown">
                                        {cities.map((city) => (
                                            <button
                                                type="button"
                                                key={city.id}
                                                onClick={() => {
                                                    setSelectedCity(city);
                                                    setCityQuery(city.name);
                                                    setCities([]);
                                                }}
                                            >
                                                {city.name}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                <label htmlFor="warehouse">Відділення</label>
                                <select
                                    id="warehouse"
                                    value={selectedWarehouse?.id || ""}
                                    onChange={(e) => {
                                        const warehouse =
                                            warehouses.find((w) => w.id === e.target.value) || null;
                                        setSelectedWarehouse(warehouse);
                                    }}
                                    disabled={!selectedCity || loadingWarehouses}
                                >
                                    <option value="">Оберіть відділення</option>
                                    {warehouses.map((warehouse) => (
                                        <option key={warehouse.id} value={warehouse.id}>
                                            {warehouse.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="checkout__block">
                                <h2>Отримувач</h2>

                                <label htmlFor="recipientFullName">ПІБ отримувача</label>
                                <input
                                    id="recipientFullName"
                                    value={recipientFullName}
                                    onChange={(e) => setRecipientFullName(e.target.value)}
                                    placeholder="ПІБ отримувача"
                                    required
                                />

                                <label htmlFor="recipientPhone">Номер телефону</label>
                                <input
                                    id="recipientPhone"
                                    value={recipientPhone}
                                    onChange={(e) => setRecipientPhone(e.target.value)}
                                    placeholder="Номер телефону"
                                    required
                                />
                                <label htmlFor="recipientEmail">Email</label>
                                <input
                                    id="recipientEmail"
                                    type="email"
                                    value={recipientEmail}
                                    onChange={(e) => setRecipientEmail(e.target.value)}
                                    placeholder="Email"
                                    required
                                />
                            </div>

                            <div className="checkout__block">
                                <h2>Оплата</h2>

                                <label htmlFor="paymentMethod">Спосіб оплати</label>
                                <select
                                    id="paymentMethod"
                                    value={paymentMethod}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                >
                                    <option value="cod">Післяплата</option>
                                    <option value="card">Оплата карткою</option>
                                </select>
                            </div>

                            <div className="checkout__actions">
                                <button type="submit" disabled={submitting} className="checkout__submit">
                                    {submitting
                                        ? paymentMethod === "card"
                                            ? "Переходимо до оплати..."
                                            : "Оформлення..."
                                        : "Підтвердити замовлення"}
                                </button>

                                <Link to="/catalog" className="checkout__back-btn">
                                    Продовжити покупки
                                </Link>
                            </div>
                        </form>

                        <aside className="checkout__summary">
                            <h2>Ваше замовлення</h2>

                            <p>Всього товарів: {summary.totalItems}</p>
                            <p>Унікальні товари: {summary.uniqueItems}</p>
                            <p>
                                <strong>Сума: {summary.totalPrice} UAH</strong>
                            </p>

                            <div className="checkout__items">
                                {items.map((item) => (
                                    <div key={item.id} className="checkout__item">
                                        <div className="checkout__item-image">
                                            <img
                                                src={fileUrl(item.product.coverImage)}
                                                alt={item.product.title}
                                            />
                                        </div>

                                        <div className="checkout__item-info">
                                            <Link
                                                to={`/products/${item.product.id || item.product._id}`}
                                                className="checkout__item-title"
                                            >
                                                {item.product.title}
                                            </Link>

                                            <div className="checkout__item-meta">
                                                Кількість: {item.quantity}
                                            </div>

                                            <div className="checkout__item-price">
                                                {item.quantity} × {item.product.price} {item.product.currency}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </aside>
                    </div>
                )}
            </div>
        </section>
    );
}