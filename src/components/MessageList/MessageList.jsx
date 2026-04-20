import { useEffect, useState } from "react";
import { chatService } from "../../services/chat.service";

export default function MessageList({ conversation, currentUserId, refreshKey = 0 }) {
    const [messages, setMessages] = useState([]);
    const [previewImage, setPreviewImage] = useState(null);

    useEffect(() => {
        if (!conversation?.id) return;

        load();
        markAsRead();
    }, [conversation?.id, refreshKey]);

    async function load() {
        if (!conversation?.id) return;

        const res = await chatService.getMessages(conversation.id);
        setMessages(res.items || []);
    }

    async function markAsRead() {
        if (!conversation?.id) return;

        await chatService.markAsRead(conversation.id);
    }

    function formatTime(date) {
        if (!date) return "";
        return new Date(date).toLocaleTimeString("uk-UA", {
            hour: "2-digit",
            minute: "2-digit",
        });
    }

    return (
        <div className="messages">
            {messages.map((m) => {
                const isMine = String(m.sender?.id || m.sender?._id) === String(currentUserId);

                return (
                    <div
                        key={m.id || m._id}
                        className={`message-row ${isMine ? "message-row--mine" : "message-row--other"}`}
                    >
                        <div className={`message-bubble ${isMine ? "message-bubble--mine" : "message-bubble--other"}`}>
                            {!isMine && (
                                <div className="message-bubble__name">
                                    {m.sender?.userName || "Користувач"}
                                </div>
                            )}

                            {m.text && (
                                <div className="message-bubble__text">{m.text}</div>
                            )}

                            {!!m.attachments?.length && (
                                <div className="message-bubble__attachments">
                                    {m.attachments.map((file, index) => (
                                        <img
                                            key={file.url || index}
                                            src={file.url}
                                            alt="Вкладення"
                                            className="message-bubble__image"
                                        />
                                    ))}
                                </div>
                            )}

                            <div className="message-bubble__meta">
                                {formatTime(m.createdAt)}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}