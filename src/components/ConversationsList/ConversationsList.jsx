import { useEffect, useState } from "react";
import { chatService } from "../../services/chat.service";

export default function ConversationsList({ onSelect }) {
    const [items, setItems] = useState([]);

    useEffect(() => {
        load();
    }, []);

    async function load() {
        const res = await chatService.getMyConversations();
        setItems(res.items || []);
    }

    return (
        <div className="chat-list">
            {items.map((c) => (
                <div
                    key={c.id}
                    className="chat-list-item"
                    onClick={() => onSelect(c)}
                >
                    <div className="chat-list-item__avatar">
                        {c.partner?.avatarUrl ? (
                            <img src={c.partner.avatarUrl} alt="" />
                        ) : (
                            <span>
                                {c.partner?.userName?.[0] || "U"}
                            </span>
                        )}
                    </div>

                    <div className="chat-list-item__content">
                        <div className="chat-list-item__top">
                            <span className="chat-list-item__name">
                                {c.partner?.userName}
                            </span>

                            {c.unreadCount > 0 && (
                                <span className="chat-list-item__badge">
                                    {c.unreadCount}
                                </span>
                            )}
                        </div>

                        <div className="chat-list-item__message">
                            {c.lastMessageText || "Немає повідомлень"}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}