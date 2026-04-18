import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { fileUrl } from '../../../utils/fileUrl.js';
import { ordersService } from '../../../services/orders.service.js';
import { usersService } from '../../../services/users.service.js';
import { AccountSidebar } from '../../../components/AccountSidebar/AccountSidebar.jsx';
import { ROUTES } from '../../../constants/index.js';
import { useAuth } from '../../../hooks/useAuth.js';
import { clearAuthStorage } from '../../../utils/auth-storage.js';

function formatPrice(value, currency = 'UAH') {
    return new Intl.NumberFormat('uk-UA', {
        style: 'currency',
        currency,
        maximumFractionDigits: 0,
    }).format(value || 0);
}

function formatDate(dateString) {
    if (!dateString) return '—';

    return new Intl.DateTimeFormat('uk-UA', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(new Date(dateString));
}

function getStatusLabel(status) {
    switch (status) {
        case 'pending':
            return 'Очікує підтвердження';
        case 'paid':
            return 'Оплачено';
        case 'processing':
            return 'В обробці';
        case 'shipped':
            return 'Відправлено';
        case 'delivered':
            return 'Доставлено';
        case 'cancelled':
            return 'Скасовано';
        default:
            return 'Невідомий статус';
    }
}

function getStatusClass(status) {
    switch (status) {
        case 'pending':
            return 'my-orders__status my-orders__status--pending';
        case 'paid':
            return 'my-orders__status my-orders__status--paid';
        case 'processing':
            return 'my-orders__status my-orders__status--processing';
        case 'shipped':
            return 'my-orders__status my-orders__status--shipped';
        case 'delivered':
            return 'my-orders__status my-orders__status--delivered';
        case 'cancelled':
            return 'my-orders__status my-orders__status--cancelled';
        default:
            return 'my-orders__status';
    }
}

export default function MyOrdersPage() {
    const navigate = useNavigate();
    const { logout } = useAuth();

    const [user, setUser] = useState(null);
    const [orders, setOrders] = useState([]);

    const [isLoading, setIsLoading] = useState(true);
    const [pageError, setPageError] = useState('');
    const [submitError, setSubmitError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isAvatarUploading, setIsAvatarUploading] = useState(false);

    const handleUnauthorized = useCallback(() => {
        clearAuthStorage();
        setUser(null);
        setOrders([]);
        setPageError('');
        setSubmitError('');
        setSuccessMessage('');
        navigate(ROUTES.LOGIN, { replace: true });
    }, [navigate]);

    useEffect(() => {
        const loadPageData = async () => {
            try {
                setIsLoading(true);
                setPageError('');

                const [currentUser, ordersResponse] = await Promise.all([
                    usersService.getMe(),
                    ordersService.getMyOrders(),
                ]);

                setUser(currentUser);
                setOrders(Array.isArray(ordersResponse?.orders) ? ordersResponse.orders : []);
            } catch (err) {
                if (err instanceof Error && err.message.includes('401')) {
                    handleUnauthorized();
                    return;
                }

                setPageError(
                    err instanceof Error
                        ? err.message
                        : 'Помилка при завантаженні сторінки замовлень',
                );
            } finally {
                setIsLoading(false);
            }
        };

        loadPageData();
    }, [handleUnauthorized]);

    useEffect(() => {
        if (!successMessage) return;

        const timer = setTimeout(() => {
            setSuccessMessage('');
        }, 5000);

        return () => clearTimeout(timer);
    }, [successMessage]);

    useEffect(() => {
        if (!submitError) return;

        const timer = setTimeout(() => {
            setSubmitError('');
        }, 5000);

        return () => clearTimeout(timer);
    }, [submitError]);

    const handleAvatarUpload = async (file) => {
        if (!user) return;

        try {
            setIsAvatarUploading(true);
            setSubmitError('');
            setSuccessMessage('');

            const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
            const maxSize = 5 * 1024 * 1024;

            if (!allowedTypes.includes(file.type)) {
                throw new Error('Лише JPEG, PNG та WEBP файли можна додавати.');
            }

            if (file.size > maxSize) {
                throw new Error('Максимальний розмір файлу 5 MB');
            }

            const updatedUser = await usersService.uploadAvatar(file);
            setUser(updatedUser);
            setSuccessMessage('Аватар успішно оновлено!');
        } catch (err) {
            if (err instanceof Error && err.message.includes('401')) {
                handleUnauthorized();
                return;
            }

            setSubmitError(
                err instanceof Error ? err.message : 'Помилка при завантаженні фото',
            );
        } finally {
            setIsAvatarUploading(false);
        }
    };

    const handleLogout = async () => {
        await logout();
    };

    const hasOrders = useMemo(() => orders.length > 0, [orders]);

    if (isLoading) {
        return <div className="profile__state">Завантаження...</div>;
    }

    if (pageError) {
        return <div className="profile__state profile__state--error">{pageError}</div>;
    }

    if (!user) {
        return <div className="profile__state">Користувача не знайдено</div>;
    }

    return (
        <section className="profile my-orders-page">
            <div className="container">
                <h1 className="profile__title">Мої замовлення</h1>

                <div className="profile__layout">
                    <AccountSidebar
                        user={user}
                        onAvatarClick={handleAvatarUpload}
                        onLogout={handleLogout}
                        isAvatarUploading={isAvatarUploading}
                    />

                    <div className="profile__content">
                        {submitError && <p className="profile__error">{submitError}</p>}
                        {successMessage && <p className="profile__success">{successMessage}</p>}

                        {!hasOrders && (
                            <div className="my-orders__empty">
                                <h2 className="my-orders__empty-title">Замовлень поки немає</h2>
                                <p className="my-orders__empty-text">
                                    Коли ви оформите перше замовлення, воно з’явиться тут.
                                </p>
                            </div>
                        )}

                        {hasOrders && (
                            <div className="my-orders__list">
                                {orders.map((order) => (
                                    <article key={order._id} className="my-orders__card">
                                        <div className="my-orders__card-top">
                                            <div>
                                                <p className="my-orders__number">
                                                    Замовлення #
                                                    {order.orderNumber || order._id?.slice(-6)}
                                                </p>
                                                <p className="my-orders__date">
                                                    {formatDate(order.createdAt)}
                                                </p>
                                            </div>

                                            <div className={getStatusClass(order.status)}>
                                                {getStatusLabel(order.status)}
                                            </div>
                                        </div>

                                        <div className="my-orders__items">
                                            {order.items?.map((item) => (
                                                <div key={item._id} className="my-orders__item">
                                                    <div className="my-orders__item-image-wrap">
                                                        {item.product?.coverImage ? (
                                                            <img
                                                                src={fileUrl(item.product.coverImage)}
                                                                alt={item.product?.title || 'product'}
                                                                className="my-orders__item-image"
                                                            />
                                                        ) : (
                                                            <div className="my-orders__item-image-placeholder">
                                                                Немає фото
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="my-orders__item-content">
                                                        <h3 className="my-orders__item-title">
                                                            {item.product?.title || 'Товар'}
                                                        </h3>

                                                        <div className="my-orders__item-meta">
                                                            <span>Кількість: {item.quantity}</span>
                                                            <span>
                                                                Ціна:{' '}
                                                                {formatPrice(
                                                                    item.price,
                                                                    order.currency,
                                                                )}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="my-orders__footer">
                                            <div className="my-orders__total">
                                                Всього:{' '}
                                                <strong>
                                                    {formatPrice(
                                                        order.total,
                                                        order.currency,
                                                    )}
                                                </strong>
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}