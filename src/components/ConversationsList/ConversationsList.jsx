import { useEffect, useState } from "react";
import { chatService } from "../../services/chat.service";
import { usersService } from "../../services/users.service";

export default function ConversationsList({ onSelect }) {
    const [items, setItems] = useState([]);
    const [currentUserId, setCurrentUserId] = useState(null);

    useEffect(() => {
        init();
    }, []);

    async function init() {
        try {
            const me = await usersService.getMe();
            const user = me?.user || me || null;
            const userId = user?.id || user?._id || null;

            setCurrentUserId(userId);

            const res = await chatService.getMyConversations();
            const normalized = (res.items || []).map((c) => {
                const isBuyer = String(c.buyer?._id || c.buyer?.id || c.buyer) === String(userId);

                const partner = isBuyer ? c.seller : c.buyer;
                const unreadCount = isBuyer
                    ? Number(c.buyerUnreadCount || 0)
                    : Number(c.sellerUnreadCount || 0);

                return {
                    ...c,
                    id: c.id || c._id,
                    partner,
                    unreadCount,
                };
            });

            setItems(normalized);
        } catch (error) {
            console.error("Failed to load conversations:", error);
            setItems([]);
        }
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
                                {c.partner?.userName || "Користувач"}
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