import { createContext, useCallback, useContext, useMemo, useState } from "react";
import NotificationContainer from "../NotificationContainer/NotificationContainer.jsx";

const NotificationContext = createContext(null);

let idCounter = 1;

export function NotificationProvider({ children }) {
    const [items, setItems] = useState([]);

    const removeNotification = useCallback((id) => {
        setItems((prev) => prev.filter((item) => item.id !== id));
    }, []);

    const showNotification = useCallback((payload) => {
        const id = idCounter++;

        const notification = {
            id,
            type: payload.type || "info",
            title: payload.title || "",
            message: payload.message || "",
            duration: payload.duration ?? 3500,
        };

        setItems((prev) => [...prev, notification]);

        if (notification.duration > 0) {
            window.setTimeout(() => {
                removeNotification(id);
            }, notification.duration);
        }

        return id;
    }, [removeNotification]);

    const showSuccess = useCallback((message, title = "Успіх") => {
        return showNotification({ type: "success", title, message });
    }, [showNotification]);

    const showError = useCallback((message, title = "Помилка") => {
        return showNotification({ type: "error", title, message, duration: 4500 });
    }, [showNotification]);

    const showInfo = useCallback((message, title = "Інформація") => {
        return showNotification({ type: "info", title, message });
    }, [showNotification]);

    const showWarning = useCallback((message, title = "Увага") => {
        return showNotification({ type: "warning", title, message });
    }, [showNotification]);

    const value = useMemo(() => ({
        showNotification,
        showSuccess,
        showError,
        showInfo,
        showWarning,
        removeNotification,
    }), [showNotification, showSuccess, showError, showInfo, showWarning, removeNotification]);

    return (
        <NotificationContext.Provider value={value}>
            {children}
            <NotificationContainer items={items} onClose={removeNotification} />
        </NotificationContext.Provider>
    );
}

export function useNotification() {
    const context = useContext(NotificationContext);

    if (!context) {
        throw new Error("useNotification must be used within NotificationProvider");
    }

    return context;
}