import { MessageCircle } from "lucide-react";

export default function ChatButton({ onClick, unreadCount }) {
    return (
        <button className="chat-button" onClick={onClick} type="button" aria-label="Відкрити чат">
            <span className="chat-button__icon">
                <MessageCircle size={24} strokeWidth={2} />
            </span>

            {unreadCount > 0 && (
                <span className="chat-button__badge">
                    {unreadCount > 99 ? "99+" : unreadCount}
                </span>
            )}
        </button>
    );
}