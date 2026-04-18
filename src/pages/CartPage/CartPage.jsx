import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { useCart } from "../../hooks/useCart";
import { fileUrl } from "../../utils/fileUrl";

export default function CartPage({ isOpen, onClose }) {
    const navigate = useNavigate();

    const {
        cart,
        isLoading,
        error,
        updateQuantity,
        removeFromCart,
        clearCart,
    } = useCart();

    const items = cart?.items || [];
    const summary = cart?.summary || {
        totalItems: 0,
        totalPrice: 0,
        uniqueItems: 0,
    };

    if (!isOpen) return null;

    const handleDecrease = async (productId, currentQty) => {
        if (currentQty <= 1) return;
        await updateQuantity({ productId, quantity: currentQty - 1 });
    };

    const handleIncrease = async (productId, currentQty) => {
        await updateQuantity({ productId, quantity: currentQty + 1 });
    };

    const handleRemove = async (productId) => {
        await removeFromCart(productId);
    };

    const handleClear = async () => {
        await clearCart();
    };

    const handleCheckout = () => {
        onClose?.();
        navigate("/checkout");
    };

    return (
        <div className="cart-drawer-overlay" onClick={onClose}>
            <aside
                className={`cart-drawer ${isOpen ? "cart-drawer--open" : ""}`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="cart-drawer__header">
                    <h2 className="cart-drawer__title">Кошик</h2>
                    <button
                        type="button"
                        className="cart-drawer__close"
                        onClick={onClose}
                    >
                        <X size={20} />
                    </button>
                </div>

                {isLoading ? (
                    <p className="cart-drawer__state">Завантаження кошика...</p>
                ) : error ? (
                    <p className="cart-drawer__state">{error.message}</p>
                ) : !items.length ? (
                    <div className="cart-drawer__empty">
                        <p>Кошик порожній.</p>
                    </div>
                ) : (
                    <>
                        <div className="cart-drawer__body">
                            {items.map((item) => (
                                <article key={item.id} className="cart-drawer-item">
                                    <img
                                        src={fileUrl(item.product.coverImage)}
                                        alt={item.product.title}
                                        className="cart-drawer-item__image"
                                    />

                                    <div className="cart-drawer-item__content">
                                        <h3 className="cart-drawer-item__title">
                                            {item.product.title}
                                        </h3>

                                        <p className="cart-drawer-item__price">
                                            {item.product.price} {item.product.currency}
                                        </p>

                                        <div className="cart-drawer-item__controls">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleDecrease(item.product.id, item.quantity)
                                                }
                                            >
                                                -
                                            </button>

                                            <span>{item.quantity}</span>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleIncrease(item.product.id, item.quantity)
                                                }
                                            >
                                                +
                                            </button>
                                        </div>

                                        <p className="cart-drawer-item__subtotal">
                                            {item.subtotal} {item.product.currency}
                                        </p>

                                        <button
                                            type="button"
                                            className="cart-drawer-item__remove"
                                            onClick={() => handleRemove(item.product.id)}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </article>
                            ))}
                        </div>

                        <div className="cart-drawer__footer">
                            <div className="cart-drawer__summary">
                                <p>Всього товарів: {summary.totalItems}</p>
                                <p>Унікальні товари: {summary.uniqueItems}</p>
                                <p className="cart-drawer__total">
                                    Загальна сума: {summary.totalPrice} UAH
                                </p>
                            </div>

                            <div className="cart-drawer__actions">
                                <button
                                    type="button"
                                    className="cart-drawer__button cart-drawer__button--ghost"
                                    onClick={handleClear}
                                >
                                    Очистити кошик
                                </button>

                                <button
                                    type="button"
                                    className="cart-drawer__button cart-drawer__button--primary"
                                    onClick={handleCheckout}
                                >
                                    Оформити замовлення
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </aside>
        </div>
    );
}