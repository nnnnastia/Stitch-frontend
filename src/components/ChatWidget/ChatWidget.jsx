import { useState, useEffect } from "react";
import ChatButton from "../ChatButton/ChatButton";
import ChatWindow from "../ChatWindow/ChatWindow";
import { chatService } from "../../services/chat.service";

function getStoredUser() {
    try {
        return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
        return null;
    }
}

export default function ChatWidget() {
    const [open, setOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    const user = getStoredUser();

    useEffect(() => {
        if (!user) {
            setUnreadCount(0);
            return;
        }

        loadUnread();

        const interval = setInterval(loadUnread, 10000);
        return () => clearInterval(interval);
    }, [user?.id]);

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
        if (!user) return;

        try {
            const res = await chatService.getUnreadCount();
            setUnreadCount(res.count || 0);
        } catch (e) {
            console.error(e);
        }
    }

    if (!user) {
        return null;
    }

    return (
        <div className="chat-widget">
            <ChatButton
                onClick={() => setOpen((prev) => !prev)}
                unreadCount={unreadCount}
            />

            <div className={`chat-widget__window ${open ? "open" : ""}`}>
                {open && <ChatWindow onClose={() => setOpen(false)} />}
            </div>
        </div>
    );
}