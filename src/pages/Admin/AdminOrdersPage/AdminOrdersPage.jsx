import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { GET_ADMIN_ORDERS, ADMIN_UPDATE_ORDER_STATUS } from '../../../graphql/orders.js';

export default function AdminOrdersPage() {
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [status, setStatus] = useState('');
    const [search, setSearch] = useState('');

    const { data, loading, error, refetch } = useQuery(GET_ADMIN_ORDERS, {
        variables: {
            page,
            limit,
            status: status || null,
            search: search.trim() || null,
        },
        fetchPolicy: 'cache-and-network',
    });

    const [updateStatus, { loading: statusLoading }] = useMutation(
        ADMIN_UPDATE_ORDER_STATUS,
        {
            onCompleted: () => {
                refetch();
            },
        }
    );

    const orders = data?.adminOrders?.items || [];
    const total = data?.adminOrders?.total || 0;

    const handleStatusChange = async (orderId, nextStatus) => {
        await updateStatus({
            variables: {
                id: orderId,
                status: nextStatus,
            },
        });
    };

    if (loading) {
        return <div className="admin-orders__state">Завантаження...</div>;
    }

    if (error) {
        return <div className="admin-orders__state admin-orders__state--error">Помилка: {error.message}</div>;
    }

    return (
        <section className="admin-orders">
            <div className="admin-orders__header">
                <div>
                    <h1 className="admin-orders__title">Замовлення</h1>
                    <p className="admin-orders__subtitle">
                        Перегляд та керування всіма замовленнями магазину
                    </p>
                </div>
            </div>

            <div className="admin-orders__filters">
                <input
                    className="admin-orders__input"
                    type="text"
                    placeholder="Пошук за номером"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <select
                    className="admin-orders__select"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                >
                    <option value="">Усі статуси</option>
                    <option value="pending">Очікує підтвердження</option>
                    <option value="confirmed">Підтверджено</option>
                    <option value="paid">Оплачено</option>
                    <option value="shipped">Відправлено</option>
                    <option value="completed">Завершено</option>
                    <option value="cancelled">Скасовано</option>
                </select>

                <button
                    type="button"
                    className="admin-orders__filter-btn"
                    onClick={() => refetch()}
                >
                    Застосувати
                </button>
            </div>

            <div className="admin-orders__table-wrap">
                <table className="admin-orders__table">
                    <thead>
                        <tr>
                            <th>Номер</th>
                            <th>Клієнт</th>
                            <th>Сума</th>
                            <th>Статус</th>
                            <th>Дата</th>
                            <th>Дії</th>
                        </tr>
                    </thead>

                    <tbody>
                        {orders.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="admin-orders__empty">
                                    Замовлень не знайдено
                                </td>
                            </tr>
                        ) : (
                            orders.map((order) => (
                                <tr key={order._id}>
                                    <td className="admin-orders__order-id">
                                        #{order.orderNumber || order._id.slice(-6)}
                                    </td>

                                    <td>
                                        <div className="admin-orders__customer">
                                            <span className="admin-orders__customer-name">
                                                {order.customer?.firstName} {order.customer?.lastName}
                                            </span>
                                            <span className="admin-orders__customer-email">
                                                {order.customer?.email}
                                            </span>
                                        </div>
                                    </td>

                                    <td className="admin-orders__amount">
                                        {order.total} грн
                                    </td>

                                    <td>
                                        <span className={`admin-orders__badge admin-orders__badge--${order.status}`}>
                                            {order.status}
                                        </span>
                                    </td>

                                    <td className="admin-orders__date">
                                        {new Date(order.createdAt).toLocaleString('uk-UA')}
                                    </td>

                                    <td>
                                        <select
                                            className="admin-orders__select admin-orders__select--status"
                                            defaultValue={order.status}
                                            onChange={(e) =>
                                                handleStatusChange(order._id, e.target.value)
                                            }
                                            disabled={statusLoading}
                                        >
                                            <option value="pending">pending</option>
                                            <option value="confirmed">confirmed</option>
                                            <option value="paid">paid</option>
                                            <option value="shipped">shipped</option>
                                            <option value="completed">completed</option>
                                            <option value="cancelled">cancelled</option>
                                        </select>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div className="admin-orders__footer">
                <p className="admin-orders__total">Всього замовлень: {total}</p>

                <div className="admin-orders__pagination">
                    <button
                        className="admin-orders__page-btn"
                        disabled={page <= 1}
                        onClick={() => setPage((prev) => prev - 1)}
                    >
                        Назад
                    </button>

                    <span className="admin-orders__page-number">Сторінка {page}</span>

                    <button
                        className="admin-orders__page-btn"
                        disabled={page * limit >= total}
                        onClick={() => setPage((prev) => prev + 1)}
                    >
                        Далі
                    </button>
                </div>
            </div>
        </section>
    );
}