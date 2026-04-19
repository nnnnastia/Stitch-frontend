import { useState, useEffect } from "react";
import ChatButton from "../ChatButton/ChatButton";
import ChatWindow from "../ChatWindow/ChatWindow";
import { chatService } from "../../services/chat.service";

export default function ChatWidget() {
    const [open, setOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        loadUnread();

        const interval = setInterval(loadUnread, 10000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        function handleClick(e) {
            if (!e.target.closest(".chat-widget")) {
                setOpen(false);
            }
        }

        if (open) {
            document.addEventListener("mousedown", handleClick);
        }

        return () => document.removeEventListener("mousedown", handleClick);
    }, [open]);
    async function loadUnread() {
        try {
            const res = await chatService.getUnreadCount();
            setUnreadCount(res.count || 0);
        } catch (e) {
            console.error(e);
        }
    }

    return (
        <div className="chat-widget">
            <ChatButton
                onClick={() => setOpen((prev) => !prev)}
                unreadCount={unreadCount}
            />

            <div className={`chat-widget__window ${open ? "open" : ""}`}>
                {open && (
                    <ChatWindow onClose={() => setOpen(false)} />
                )}
            </div>
        </div>
    );
}