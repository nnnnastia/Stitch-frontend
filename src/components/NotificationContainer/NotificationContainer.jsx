import { CheckCircle2, CircleAlert, Info, TriangleAlert, X } from "lucide-react";

function getIcon(type) {
    switch (type) {
        case "success":
            return <CheckCircle2 size={18} />;
        case "error":
            return <CircleAlert size={18} />;
        case "warning":
            return <TriangleAlert size={18} />;
        default:
            return <Info size={18} />;
    }
}

export default function NotificationContainer({ items, onClose }) {
    return (
        <div className="notification-stack" aria-live="polite" aria-atomic="true">
            {items.map((item) => (
                <div
                    key={item.id}
                    className={`notification notification--${item.type}`}
                >
                    <div className="notification__icon">
                        {getIcon(item.type)}
                    </div>

                    <div className="notification__content">
                        {item.title ? (
                            <div className="notification__title">{item.title}</div>
                        ) : null}

                        <div className="notification__message">{item.message}</div>
                    </div>

                    <button
                        type="button"
                        className="notification__close"
                        onClick={() => onClose(item.id)}
                        aria-label="Закрити повідомлення"
                    >
                        <X size={16} />
                    </button>
                </div>
            ))}
        </div>
    );
}