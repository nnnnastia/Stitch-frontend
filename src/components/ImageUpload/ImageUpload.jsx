import { useState } from "react";
import { useNotification } from "../NotificationContext/NotificationContext";

export default function ImageUpload({
    value,
    onUpload,
    type = "avatar", // avatar | banner
    fallbackText = "",
}) {
    const [drag, setDrag] = useState(false);
    const [loading, setLoading] = useState(false);
    const { showSuccess, showError } = useNotification();

    async function handleFile(file) {
        if (!file) return;

        try {
            setLoading(true);
            await onUpload(file);
        } catch (e) {
            console.error(e);
            showError("Помилка завантаження");
        } finally {
            setLoading(false);
        }
    }

    function handleDrop(e) {
        e.preventDefault();
        setDrag(false);

        const file = e.dataTransfer.files?.[0];
        handleFile(file);
    }

    function handleChange(e) {
        const file = e.target.files?.[0];
        handleFile(file);
        e.target.value = "";
    }

    return (
        <div
            className={`uploadZone ${drag ? "is-drag" : ""}`}
            onDragOver={(e) => {
                e.preventDefault();
                setDrag(true);
            }}
            onDragLeave={() => setDrag(false)}
            onDrop={handleDrop}
        >
            <input
                type="file"
                accept="image/*"
                onChange={handleChange}
            />

            {/* PREVIEW */}
            {value ? (
                <img src={value} alt="" />
            ) : (
                <div className="uploadZone__placeholder">
                    {fallbackText}
                </div>
            )}

            {/* OVERLAY */}
            <div className="uploadZone__overlay">
                {loading
                    ? "Завантаження..."
                    : "Перетягни або натисни"}
            </div>
        </div>
    );
}