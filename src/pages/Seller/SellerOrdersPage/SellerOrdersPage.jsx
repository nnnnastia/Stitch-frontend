import { useEffect, useMemo, useState } from "react";
import { sellerOrdersService } from "../../../services/sellerOrders.service.js";
import { fileUrl } from "../../../utils/fileUrl.js";
import { useChatStore } from "../../../store/chat.store.js";
import { useNotification } from "../../../components/NotificationContext/NotificationContext.jsx";

function formatPrice(value) {
    return new Intl.NumberFormat("uk-UA", {
        style: "currency",
        currency: "UAH",
        maximumFractionDigits: 0,
    }).format(value || 0);
}

function formatDate(value) {
    if (!value) return "—";

    return new Intl.DateTimeFormat("uk-UA", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(new Date(value));
}

function getStatusLabel(status) {
    switch (status) {
        case "pending":
            return "Очікує";
        case "confirmed":
            return "Підтверджено";
        case "paid":
            return "Оплачено";
        case "shipped":
            return "Відправлено";
        case "completed":
            return "Завершено";
        case "cancelled":
            return "Скасовано";
        default:
            return status;
    }
}

export default function SellerOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [updatingId, setUpdatingId] = useState("");
    const startChat = useChatStore((state) => state.startChat);
    const { showSuccess, showError } = useNotification();

    useEffect(() => {
        let ignore = false;

        async function loadOrders() {
            try {
                setLoading(true);
                setError("");

                const data = await sellerOrdersService.getOrders();

                if (!ignore) {
                    setOrders(Array.isArray(data?.orders) ? data.orders : []);
                }
            } catch (err) {
                if (!ignore) {
                    setError(err.message || "Не вдалося завантажити замовлення");
                }
            } finally {
                if (!ignore) {
                    setLoading(false);
                }
            }
        }

        loadOrders();

        return () => {
            ignore = true;
        };
    }, []);

    async function handleContactBuyer(order) {
        try {
            await startChat({
                orderId: order._id,
                sourceType: "order",
            });
        } catch (error) {
            console.error(error);
            showError("Не вдалося відкрити чат з покупцем");
        }
    }

    const totalOrders = useMemo(() => orders.length, [orders]);

    const handleStatusChange = async (orderId, nextStatus) => {
        try {
            setUpdatingId(orderId);

            const data = await sellerOrdersService.updateStatus(orderId, nextStatus);
            const updatedOrder = data?.order;

            setOrders((prev) =>
                prev.map((order) =>
                    order._id === orderId ? updatedOrder : order
                )
            );
        } catch (err) {
            showError(err.message || "Не вдалося оновити статус");
        } finally {
            setUpdatingId("");
        }
    };

    if (loading) {
        return <div className="seller-orders__state">Завантаження...</div>;
    }

    if (error) {
        return <div className="seller-orders__state seller-orders__state--error">{error}</div>;
    }

    return (
        <section className="seller-orders">
            <div className="seller-orders__header">
                <h1 className="seller-orders__title">Мої замовлення</h1>
                <p className="seller-orders__subtitle">
                    Тут відображаються замовлення, які містять ваші товари.
                </p>
            </div>

            {orders.length === 0 ? (
                <div className="seller-orders__empty">
                    Замовлень поки немає
                </div>
            ) : (
                <>
                    <div className="seller-orders__summary">
                        Всього замовлень: <strong>{totalOrders}</strong>
                    </div>

                    <div className="seller-orders__list">
                        {orders.map((order) => (
                            <article key={order._id} className="seller-orders__card">
                                <div className="seller-orders__top">
                                    <div>
                                        <p className="seller-orders__number">
                                            Замовлення #{order._id.slice(-6)}
                                        </p>
                                        <p className="seller-orders__date">
                                            {formatDate(order.createdAt)}
                                        </p>
                                    </div>

                                    <div className="seller-orders__status-wrap">
                                        <span className={`seller-orders__status seller-orders__status--${order.status}`}>
                                            {getStatusLabel(order.status)}
                                        </span>

                                        <select
                                            className="seller-orders__select"
                                            value={order.status}
                                            onChange={(e) =>
                                                handleStatusChange(order._id, e.target.value)
                                            }
                                            disabled={updatingId === order._id}
                                        >
                                            <option value="pending">pending</option>
                                            <option value="confirmed">confirmed</option>
                                            <option value="shipped">shipped</option>
                                            <option value="completed">completed</option>
                                            <option value="cancelled">cancelled</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="seller-orders__customer">
                                    <p>
                                        <strong>Клієнт:</strong>{" "}
                                        {order.customer?.firstName} {order.customer?.lastName}
                                    </p>
                                    <p>
                                        <strong>Email:</strong> {order.customer?.email || "—"}
                                    </p>
                                    <p>
                                        <strong>Отримувач:</strong>{" "}
                                        {order.delivery?.recipientFullName || "—"}
                                    </p>
                                    <p>
                                        <strong>Телефон:</strong>{" "}
                                        {order.delivery?.recipientPhone || "—"}
                                    </p>
                                    <p>
                                        <strong>Місто:</strong> {order.delivery?.cityName || "—"}
                                    </p>
                                    <p>
                                        <strong>Відділення:</strong>{" "}
                                        {order.delivery?.warehouseName || "—"}
                                    </p>
                                </div>

                                <div className="seller-orders__items">
                                    {order.sellerItems?.map((item, index) => (
                                        <div key={`${order._id}-${index}`} className="seller-orders__item">
                                            <div className="seller-orders__image-wrap">
                                                {item.coverImage ? (
                                                    <img
                                                        src={fileUrl(item.coverImage)}
                                                        alt={item.title}
                                                        className="seller-orders__image"
                                                    />
                                                ) : (
                                                    <div className="seller-orders__image-placeholder">
                                                        Немає фото
                                                    </div>
                                                )}
                                            </div>

                                            <div className="seller-orders__item-content">
                                                <h3 className="seller-orders__item-title">
                                                    {item.title}
                                                </h3>

                                                <div className="seller-orders__item-meta">
                                                    <span>Кількість: {item.quantity}</span>
                                                    <span>Ціна: {formatPrice(item.price)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="seller-orders__footer">
                                    <div className="seller-orders__sum">
                                        Сума по ваших товарах:{" "}
                                        <strong>{formatPrice(order.sellerSubtotal)}</strong>
                                    </div>

                                    <button
                                        type="button"
                                        className="seller-orders__chatBtn"
                                        onClick={() => handleContactBuyer(order)}
                                    >
                                        Написати покупцю
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>
                </>
            )}
        </section>
    );
}